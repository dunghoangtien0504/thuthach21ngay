/**
 * api/admin-activate-user.js — Vercel serverless function
 * Creates a Supabase user (or resets password) and grants full course access.
 * Protected by admin password header.
 *
 * POST /api/admin-activate-user
 * Headers: Authorization: Bearer <VITE_ADMIN_PASS>
 * Body: { email, password, name? }
 */

const COURSE_LIST = [
  { course_id: 'mat-ma-21',  course_name: 'Mật Mã 21' },
  { course_id: 'kegel',      course_name: 'Kegel Chuyên Sâu' },
];

export default async function handler(req, res) {
  // CORS
  const origin  = req.headers.origin || req.headers.referer || '';
  const allowed = process.env.VITE_SITE_URL || '';
  res.setHeader('Access-Control-Allow-Origin', (allowed && origin.startsWith(allowed)) ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Admin auth
  const authHeader = req.headers['authorization'] || '';
  const adminPass  = process.env.ADMIN_PASS || process.env.VITE_ADMIN_PASS || '';
  if (!adminPass || authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Supabase credentials
  const supabaseUrl    = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  const { email, password, name } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Find or create user
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
    let userId;
    const existing = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existing) {
      userId = existing.id;
      // Update password if provided
      if (password) {
        const { error: pwErr } = await admin.auth.admin.updateUserById(userId, { password });
        if (pwErr) throw pwErr;
      }
      // Confirm email if not confirmed
      if (!existing.email_confirmed_at) {
        await admin.auth.admin.updateUserById(userId, { email_confirm: true });
      }
    } else {
      // Create new user — admin path bypasses email verification and password length limits
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password: password || 'MatMa21!Temp',
        email_confirm: true,
        user_metadata: { name: name || email.split('@')[0] },
      });
      if (createErr) throw createErr;
      userId = created.user.id;
    }

    // 2. Upsert profile (user_profiles has no `status` column — access is granted
    //    via course_enrollments below, which is the source of truth for paid access)
    await admin.from('user_profiles').upsert({
      id: userId,
      name: name || (existing?.user_metadata?.name) || email.split('@')[0],
    }, { onConflict: 'id' });

    // 3. Insert enrollment records for all courses
    const enrolledAt = new Date().toISOString();
    for (const course of COURSE_LIST) {
      await admin.from('course_enrollments').upsert({
        user_id:     userId,
        course_id:   course.course_id,
        course_name: course.course_name,
        status:      'active',
        enrolled_at: enrolledAt,
      }, { onConflict: 'user_id,course_id' });
    }

    return res.status(200).json({
      success: true,
      userId,
      email,
      courses: COURSE_LIST.map(c => c.course_id),
      message: `Đã kích hoạt ${COURSE_LIST.length} khóa học cho ${email}`,
    });

  } catch (err) {
    console.error('[admin-activate-user]', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
