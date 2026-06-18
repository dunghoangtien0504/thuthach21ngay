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

  return res.status(400).json({ error: 'Invalid action' });
}
