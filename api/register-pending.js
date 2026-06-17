import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, name, phone, course_id, referred_by, source } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Supabase credentials not configured' });
  }

  try {
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Find or create user
    const { data: { users }, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (listErr) throw listErr;

    let userId;
    const existing = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existing) {
      userId = existing.id;
    } else {
      // Create new user with a random temp password
      const randomPassword = Math.random().toString(36).substring(2, 12) + '!Temp';
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: { name: name || email.split('@')[0] },
      });
      if (createErr) throw createErr;
      userId = created.user.id;
    }

    // 2. Upsert profile in user_profiles
    const profileData = {
      id: userId,
      name: name || (existing?.user_metadata?.name) || email.split('@')[0],
      phone: phone ? phone.replace(/[^0-9]/g, '') : '',
      source: source || 'checkout_pending',
    };
    if (referred_by) {
      profileData.referred_by = referred_by;
    }
    
    const { error: profErr } = await admin.from('user_profiles').upsert(profileData, { onConflict: 'id' });
    if (profErr) throw profErr;

    // 3. Optional: Upsert pending enrollment in course_enrollments
    if (course_id) {
      const courseName = course_id === 'mat-ma-21' ? 'Mật Mã 21' : (course_id === 'kegel' ? 'Kegel Chuyên Sâu' : course_id);
      
      // Check if they already have an active enrollment so we don't overwrite it
      const { data: currentEnroll } = await admin
        .from('course_enrollments')
        .select('status')
        .eq('user_id', userId)
        .eq('course_id', course_id)
        .maybeSingle();

      if (!currentEnroll || currentEnroll.status !== 'active') {
        const { error: enrollErr } = await admin.from('course_enrollments').upsert({
          user_id: userId,
          course_id: course_id,
          course_name: courseName,
          status: 'pending',
          enrolled_at: new Date().toISOString(),
        }, { onConflict: 'user_id,course_id' });
        if (enrollErr) throw enrollErr;
      }
    }

    return res.status(200).json({ success: true, userId });
  } catch (err) {
    console.error('[register-pending] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
