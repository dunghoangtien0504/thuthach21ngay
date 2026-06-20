import { createClient } from '@supabase/supabase-js';
import { activateUserCourse } from './_activation-helper.js';
import { resetUserPassword } from './_reset-password-helper.js';

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || req.headers.referer || '';
  const allowed = process.env.VITE_SITE_URL || '';
  res.setHeader('Access-Control-Allow-Origin', (allowed && origin.startsWith(allowed)) ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Determine action from query
  const action = req.query.action;
  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }

  // affiliate_stats: user token auth (not admin), early exit before admin check
  if (action === 'affiliate_stats') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const supabaseUrl2 = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey2 = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl2 || !serviceRoleKey2) return res.status(503).json({ error: 'Supabase not configured' });

    const bearerToken = (req.headers['authorization'] || '').replace('Bearer ', '').trim();
    if (!bearerToken) return res.status(401).json({ error: 'Missing access token' });

    try {
      const svc = createClient(supabaseUrl2, serviceRoleKey2, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data: { user }, error: uErr } = await svc.auth.getUser(bearerToken);
      if (uErr || !user) return res.status(401).json({ error: 'Invalid or expired session' });

      const { data: aff } = await svc.from('affiliates').select('code').eq('user_id', user.id).maybeSingle();
      if (!aff?.code) return res.status(200).json({ code: null, clicks: 0, signups: 0, buyers: 0, commission: 0, mm21Count: 0, kegelCount: 0, rows: [] });
      const code = aff.code;

      const { count: clicks } = await svc.from('referral_clicks').select('*', { count: 'exact', head: true }).eq('ref_code', code);
      const { data: profiles } = await svc.from('user_profiles').select('id, name, created_at').eq('referred_by', code);
      const referred = profiles || [];

      let buyers = 0, commission = 0, mm21Count = 0, kegelCount = 0;
      const rows = [];
      const COMM = { 'mat-ma-21': 137374, kegel: 39800 };
      if (referred.length) {
        const ids = referred.map(p => p.id);
        const { data: enrollments } = await svc.from('course_enrollments').select('user_id, course_id, status').in('user_id', ids);
        const map = {};
        (enrollments || []).forEach(e => { if (e.status === 'active') (map[e.user_id] = map[e.user_id] || []).push(e.course_id); });
        referred.forEach(p => {
          const courses = map[p.id] || [];
          if (courses.length) buyers++;
          if (courses.includes('mat-ma-21')) mm21Count++;
          if (courses.includes('kegel')) kegelCount++;
          let comm = 0; courses.forEach(c => { comm += COMM[c] || 0; }); commission += comm;
          rows.push({ name: p.name || 'Học viên', bought: courses.length > 0, commission: comm });
        });
      }
      return res.status(200).json({ code, clicks: clicks || 0, signups: referred.length, buyers, commission, mm21Count, kegelCount, rows });
    } catch (err) {
      console.error('[affiliate_stats]', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Admin auth check for all other endpoints
  const authHeader = req.headers['authorization'] || '';
  const adminPass  = process.env.ADMIN_PASS || process.env.VITE_ADMIN_PASS || '';

  if (!adminPass) {
    return res.status(503).json({ error: 'ADMIN_PASS chưa được cấu hình trên server.' });
  }

  if (authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle actions
  if (action === 'verify') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    return res.status(200).json({ ok: true });
  }

  // Supabase init (for actions that need it)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbConfigured = supabaseUrl && serviceRoleKey;

  if (action === 'users') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (!dbConfigured) {
      return res.status(503).json({ error: 'Supabase not configured', users: [] });
    }

    try {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // List all auth users
      const { data: { users }, error: authErr } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (authErr) throw authErr;

      // Get extended profiles
      const { data: profiles } = await adminClient
        .from('user_profiles')
        .select('id, name, phone, email_consent, source, created_at');

      // Get latest password resets (admin-only table, service role)
      const { data: resets } = await adminClient
        .from('password_resets')
        .select('user_id, temp_password, reset_at');
      const resetMap = Object.fromEntries((resets || []).map(r => [r.user_id, r]));

      // Get enrollments
      const { data: enrollments } = await adminClient
        .from('course_enrollments')
        .select('user_id, course_id, course_name, enrolled_at, status');

      const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));
      const enrollmentMap = {};
      (enrollments || []).forEach(e => {
        if (!enrollmentMap[e.user_id]) enrollmentMap[e.user_id] = [];
        enrollmentMap[e.user_id].push(e);
      });

      const combined = users.map(u => {
        const profile = profileMap[u.id] || {};
        return {
          id: u.id,
          email: u.email,
          name: profile.name || u.user_metadata?.name || '',
          phone: profile.phone || u.user_metadata?.phone || '',
          email_confirmed: !!u.email_confirmed_at,
          email_consent: profile.email_consent ?? u.user_metadata?.email_consent ?? false,
          source: profile.source || u.user_metadata?.source || '',
          registeredAt: u.created_at,
          enrollments: enrollmentMap[u.id] || [],
          status: u.email_confirmed_at ? 'active' : 'pending',
          temp_password: resetMap[u.id]?.temp_password || '',
          temp_password_at: resetMap[u.id]?.reset_at || '',
        };
      });

      return res.status(200).json({ users: combined });
    } catch (err) {
      console.error('[admin-users] Error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error', users: [] });
    }
  }

  if (action === 'transactions') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const token = process.env.SEPAY_API_KEY;
    if (!token) {
      return res.status(200).json({ success: false, transactions: [], message: 'SEPAY_API_KEY not configured' });
    }

    try {
      const response = await fetch('https://userapi.sepay.vn/v2/transactions?limit=100', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`SePay API ${response.status}`);
      const data = await response.json();
      const txs = (data.transactions || []).map(t => ({
        id:         t.id,
        amount:     parseFloat(t.transfer_amount || t.amount || 0),
        content:    t.transaction_content || t.content || '',
        date:       t.transaction_date || t.transactionDate || '',
        type:       t.transfer_type || 'in',
        bankCode:   t.bank_code || t.bankCode || '',
        account:    t.account_number || '',
      }));
      return res.status(200).json({ success: true, transactions: txs });
    } catch (err) {
      console.error('[admin-transactions]', err);
      return res.status(500).json({ success: false, transactions: [], error: err.message });
    }
  }

  if (action === 'activate') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email, name, phone, courses: requestedCourses } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email is required' });

    const coursesToActivate = (Array.isArray(requestedCourses) && requestedCourses.length)
      ? requestedCourses
      : ['mat-ma-21', 'kegel'];

    try {
      const results = [];
      for (const courseId of coursesToActivate) {
        const result = await activateUserCourse({
          email,
          name,
          phone,
          courseId,
          source: 'admin_panel',
        });
        results.push(result);
      }

      return res.status(200).json({
        success: true,
        email,
        courses: coursesToActivate,
        message: `Đã kích hoạt ${coursesToActivate.length} khóa học cho ${email}`,
      });
    } catch (err) {
      console.error('[admin-activate-user] Error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  if (action === 'reset_password') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!dbConfigured) {
      return res.status(503).json({ error: 'Supabase not configured' });
    }
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email is required' });

    try {
      const result = await resetUserPassword({ email, source: 'admin_panel' });
      if (!result.found) {
        return res.status(404).json({ error: `Không tìm thấy tài khoản ${email} trong Supabase` });
      }
      return res.status(200).json({
        success: true,
        email: result.email,
        newPassword: result.newPassword,
        message: `Đã đặt lại mật khẩu cho ${result.email}`,
      });
    } catch (err) {
      console.error('[admin-reset-password]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  if (action === 'delete') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!dbConfigured) {
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email is required' });

    try {
      const admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Find user by email
      const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const target = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

      if (!target) {
        return res.status(404).json({ error: `Không tìm thấy tài khoản ${email} trong Supabase` });
      }

      const userId = target.id;

      // Delete enrollments + profile first (FK constraints)
      await admin.from('course_enrollments').delete().eq('user_id', userId);
      await admin.from('user_profiles').delete().eq('id', userId);

      // Delete auth user
      const { error: delErr } = await admin.auth.admin.deleteUser(userId);
      if (delErr) throw delErr;

      return res.status(200).json({ success: true, email, message: `Đã xóa tài khoản ${email}` });
    } catch (err) {
      console.error('[admin-delete-user]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  if (action === 'email_stats') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (!dbConfigured) return res.status(503).json({ error: 'Supabase not configured' });

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    try {
      // --- Queue summary per sequence ---
      const { data: queueRows } = await adminClient
        .from('email_queue')
        .select('sequence, email_number, sent, error_message, sent_at');

      // --- Events: opens, clicks, errors ---
      const { data: events } = await adminClient
        .from('email_events')
        .select('queue_id, email, sequence, email_number, event_type, url, error_msg, created_at')
        .order('created_at', { ascending: false })
        .limit(500);

      // --- Aggregate by sequence + email_number ---
      const map = {}; // key: `${sequence}__${email_number}`
      for (const row of (queueRows || [])) {
        const k = `${row.sequence}__${row.email_number}`;
        if (!map[k]) map[k] = { sequence: row.sequence, email_number: row.email_number, sent: 0, pending: 0, errors: 0, opens: 0, clicks: 0, uniqueOpens: new Set(), uniqueClicks: new Set() };
        if (row.sent) map[k].sent++;
        else if (row.error_message) map[k].errors++;
        else map[k].pending++;
      }

      for (const ev of (events || [])) {
        const k = `${ev.sequence}__${ev.email_number}`;
        if (!map[k]) continue;
        if (ev.event_type === 'open')  { map[k].opens++;  map[k].uniqueOpens.add(ev.email); }
        if (ev.event_type === 'click') { map[k].clicks++; map[k].uniqueClicks.add(ev.email); }
        if (ev.event_type === 'error') map[k].errors++;
      }

      const stats = Object.values(map).map(r => ({
        sequence:     r.sequence,
        email_number: r.email_number,
        sent:         r.sent,
        pending:      r.pending,
        errors:       r.errors,
        opens:        r.uniqueOpens.size,
        clicks:       r.uniqueClicks.size,
        open_rate:    r.sent > 0 ? Math.round(r.uniqueOpens.size / r.sent * 100) : 0,
        click_rate:   r.sent > 0 ? Math.round(r.uniqueClicks.size / r.sent * 100) : 0,
      })).sort((a, b) => {
        const seqOrder = { registered: 0, buyer_kegel: 1, buyer_mm21: 2 };
        const sd = (seqOrder[a.sequence] ?? 9) - (seqOrder[b.sequence] ?? 9);
        return sd !== 0 ? sd : a.email_number - b.email_number;
      });

      // --- Recent errors (last 20) ---
      const recentErrors = (events || [])
        .filter(e => e.event_type === 'error')
        .slice(0, 20)
        .map(e => ({ email: e.email, sequence: e.sequence, email_number: e.email_number, error_msg: e.error_msg, created_at: e.created_at }));

      // --- Overall totals ---
      const total = (queueRows || []).length;
      const totalSent = (queueRows || []).filter(r => r.sent).length;
      const totalPending = (queueRows || []).filter(r => !r.sent && !r.error_message).length;
      const totalErrors = (queueRows || []).filter(r => !r.sent && r.error_message).length;
      const totalOpens = new Set((events || []).filter(e => e.event_type === 'open').map(e => e.email + e.sequence + e.email_number)).size;
      const totalClicks = new Set((events || []).filter(e => e.event_type === 'click').map(e => e.email + e.sequence + e.email_number)).size;

      return res.status(200).json({
        totals: { total, sent: totalSent, pending: totalPending, errors: totalErrors, opens: totalOpens, clicks: totalClicks },
        stats,
        recentErrors,
      });
    } catch (err) {
      console.error('[admin-email_stats]', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (action === 'email_queue') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (!dbConfigured) return res.status(503).json({ error: 'Supabase not configured' });

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    try {
      const { email: filterEmail, seq } = req.query;
      let query = adminClient
        .from('email_queue')
        .select('id, email, name, sequence, email_number, subject, scheduled_for, sent, sent_at, error_message, retry_count')
        .order('scheduled_for', { ascending: true })
        .limit(200);

      if (filterEmail) query = query.eq('email', filterEmail);
      if (seq) query = query.eq('sequence', seq);

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ rows: data || [] });
    } catch (err) {
      console.error('[admin-email_queue]', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (action === 'affiliates') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (!dbConfigured) {
      return res.status(503).json({ error: 'Supabase not configured', affiliates: [] });
    }

    try {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // 1. Fetch all auth users
      const { data: { users }, error: authErr } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (authErr) throw authErr;

      // 2. Fetch all affiliates
      const { data: affiliates, error: affErr } = await adminClient.from('affiliates').select('*');
      if (affErr) throw affErr;

      // 3. Fetch all user profiles
      const { data: profiles, error: profErr } = await adminClient.from('user_profiles').select('id, name, referred_by, created_at');
      if (profErr) throw profErr;

      // 4. Fetch all course enrollments
      const { data: enrollments, error: enrolErr } = await adminClient.from('course_enrollments').select('user_id, course_id, status');
      if (enrolErr) throw enrolErr;

      // 5. Fetch referral clicks counts
      const { data: clicks, error: clickErr } = await adminClient.from('referral_clicks').select('ref_code');
      if (clickErr) throw clickErr;

      // Map users for lookup
      const userMap = Object.fromEntries(users.map(u => [u.id, u]));
      const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]));

      // Group clicks by ref_code
      const clicksCountMap = {};
      clicks.forEach(c => {
        if (c.ref_code) {
          const code = c.ref_code.toLowerCase().trim();
          clicksCountMap[code] = (clicksCountMap[code] || 0) + 1;
        }
      });

      // Group referred profiles by referred_by code
      const referredProfilesMap = {};
      profiles.forEach(p => {
        if (p.referred_by) {
          const code = p.referred_by.toLowerCase().trim();
          if (!referredProfilesMap[code]) referredProfilesMap[code] = [];
          referredProfilesMap[code].push(p);
        }
      });

      // Map enrollments by user_id
      const userEnrollmentsMap = {};
      enrollments.forEach(e => {
        if (e.status === 'active') {
          if (!userEnrollmentsMap[e.user_id]) userEnrollmentsMap[e.user_id] = [];
          userEnrollmentsMap[e.user_id].push(e);
        }
      });

      const result = affiliates.map(aff => {
        const affUser = userMap[aff.user_id] || {};
        const affProfile = profileMap[aff.user_id] || {};
        const codeClean = aff.code.toLowerCase().trim();

        const clicksCount = clicksCountMap[codeClean] || 0;
        const referred = referredProfilesMap[codeClean] || [];
        const signupsCount = referred.length;

        let buyersCount = 0;
        let totalCommission = 0;
        const referredDetails = [];

        referred.forEach(refProf => {
          const refUser = userMap[refProf.id] || {};
          const enrolls = userEnrollmentsMap[refProf.id] || [];
          const bought = enrolls.length > 0;
          if (bought) buyersCount++;

          // Calculate commission
          let studentCommission = 0;
          enrolls.forEach(e => {
            if (e.course_id === 'mat-ma-21') {
              studentCommission += 137374;
            } else if (e.course_id === 'kegel') {
              studentCommission += 39800;
            }
          });
          totalCommission += studentCommission;

          referredDetails.push({
            name: refProf.name || refUser.user_metadata?.name || 'Học viên',
            email: refUser.email || '-',
            registeredAt: refUser.created_at || refProf.created_at,
            bought,
            courses: enrolls.map(e => e.course_id),
            commission: studentCommission
          });
        });

        return {
          user_id: aff.user_id,
          email: affUser.email || '-',
          name: affProfile.name || affUser.user_metadata?.name || 'Affiliate',
          code: aff.code,
          created_at: aff.created_at,
          clicks: clicksCount,
          signups: signupsCount,
          buyers: buyersCount,
          commission: totalCommission,
          referrals: referredDetails
        };
      });

      return res.status(200).json({ affiliates: result });
    } catch (err) {
      console.error('[admin-affiliates] Error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error', affiliates: [] });
    }
  }

  return res.status(400).json({ error: 'Invalid action' });
}
