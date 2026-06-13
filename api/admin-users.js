/**
 * api/admin-users.js — Vercel serverless function
 * Returns all registered users from Supabase for the admin panel.
 * Protected by admin password header.
 */

export default async function handler(req, res) {
  // CORS for same-origin admin panel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Auth check: admin must send the admin password as Bearer token
  const authHeader = req.headers['authorization'] || '';
  const adminPass  = process.env.VITE_ADMIN_PASS || '';
  if (!adminPass || authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Supabase credentials check
  const supabaseUrl     = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Supabase not configured', users: [] });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
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

    // Get enrollments
    const { data: enrollments } = await adminClient
      .from('course_enrollments')
      .select('user_id, course_id, course_name, enrolled_at, status');

    const profileMap    = Object.fromEntries((profiles || []).map(p => [p.id, p]));
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
      };
    });

    return res.status(200).json({ users: combined });
  } catch (err) {
    console.error('[admin-users] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error', users: [] });
  }
}
