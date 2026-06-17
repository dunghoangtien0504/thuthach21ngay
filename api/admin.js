import { createClient } from '@supabase/supabase-js';
import { activateUserCourse } from './_activation-helper.js';

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

  // Admin auth check for all endpoints
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

  return res.status(400).json({ error: 'Invalid action' });
}
