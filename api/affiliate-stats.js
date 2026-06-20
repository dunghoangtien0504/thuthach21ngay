import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const COMMISSION = { 'mat-ma-21': 137374, 'kegel': 39800 };

/**
 * Trả về thống kê affiliate cho user đang đăng nhập.
 * Xác thực bằng access token (Authorization: Bearer <token>) — server tự suy ra
 * affiliate code từ user, KHÔNG tin code do client gửi → không ai xem được số liệu
 * của người khác. Đọc cross-user qua service role nên client không cần quyền đọc
 * user_profiles / enrollments của người khác.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Validate token → user
    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user) return res.status(401).json({ error: 'Invalid or expired session' });

    // 2. Derive this user's affiliate code (server-trusted, not client-supplied)
    const { data: aff } = await admin
      .from('affiliates')
      .select('code')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!aff || !aff.code) {
      return res.status(200).json({ code: null, clicks: 0, signups: 0, buyers: 0, commission: 0, rows: [] });
    }
    const code = aff.code;

    // 3. Clicks
    const { count: clicks } = await admin
      .from('referral_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('ref_code', code);

    // 4. Referred profiles
    const { data: profiles } = await admin
      .from('user_profiles')
      .select('id, name, created_at')
      .eq('referred_by', code);
    const referred = profiles || [];

    // 5. Their active enrollments → buyers + commission
    let buyers = 0;
    let commission = 0;
    let mm21Count = 0;
    let kegelCount = 0;
    const rows = [];
    if (referred.length) {
      const ids = referred.map(p => p.id);
      const { data: enrollments } = await admin
        .from('course_enrollments')
        .select('user_id, course_id, status')
        .in('user_id', ids);

      const map = {};
      (enrollments || []).forEach(e => {
        if (e.status === 'active') {
          (map[e.user_id] = map[e.user_id] || []).push(e.course_id);
        }
      });

      referred.forEach(p => {
        const courses = map[p.id] || [];
        const bought = courses.length > 0;
        if (bought) buyers++;
        if (courses.includes('mat-ma-21')) mm21Count++;
        if (courses.includes('kegel')) kegelCount++;
        let comm = 0;
        courses.forEach(c => { comm += COMMISSION[c] || 0; });
        commission += comm;
        rows.push({ name: p.name || 'Học viên', bought, commission: comm });
      });
    }

    return res.status(200).json({
      code,
      clicks: clicks || 0,
      signups: referred.length,
      buyers,
      commission,
      mm21Count,
      kegelCount,
      rows,
    });
  } catch (err) {
    console.error('[affiliate-stats] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
