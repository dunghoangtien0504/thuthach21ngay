/**
 * api/admin-delete-user.js — Delete a Supabase auth user + enrollments + profile
 * POST /api/admin-delete-user
 * Headers: Authorization: Bearer <ADMIN_PASS>
 * Body: { email }
 */
export default async function handler(req, res) {
  const origin  = req.headers.origin || req.headers.referer || '';
  const allowed = process.env.VITE_SITE_URL || '';
  res.setHeader('Access-Control-Allow-Origin', (allowed && origin.startsWith(allowed)) ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers['authorization'] || '';
  const adminPass  = process.env.ADMIN_PASS || process.env.VITE_ADMIN_PASS || '';
  if (!adminPass || authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl    = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Supabase not configured' });
  }

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    const { createClient } = await import('@supabase/supabase-js');
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
