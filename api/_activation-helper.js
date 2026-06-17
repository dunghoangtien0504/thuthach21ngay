import { createClient } from '@supabase/supabase-js';
import { EMAIL_SEQUENCES } from './_email-sequences.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function activateUserCourse({ email, name, phone, courseId, source, referredBy }) {
  if (!email || !courseId) {
    throw new Error('Email and courseId are required for activation.');
  }

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase credentials not fully configured.');
  }

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
    // Confirm email if not confirmed
    if (!existing.email_confirmed_at) {
      await admin.auth.admin.updateUserById(userId, { email_confirm: true });
    }
  } else {
    // Create new user (using default temp password)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: 'MatMa21!Temp', // default temp password
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
  };
  if (phone) {
    profileData.phone = phone.replace(/[^0-9]/g, '');
  }
  if (source) {
    profileData.source = source;
  }
  if (referredBy) {
    profileData.referred_by = referredBy;
  }
  
  const { error: profErr } = await admin.from('user_profiles').upsert(profileData, { onConflict: 'id' });
  if (profErr) throw profErr;

  // 3. Upsert active enrollment in course_enrollments
  const courseName = courseId === 'mat-ma-21' ? 'Mật Mã 21' : (courseId === 'kegel' ? 'Kegel Chuyên Sâu' : courseId);
  const enrolledAt = new Date().toISOString();
  
  const { error: enrollErr } = await admin.from('course_enrollments').upsert({
    user_id: userId,
    course_id: courseId,
    course_name: courseName,
    status: 'active',
    enrolled_at: enrolledAt,
  }, { onConflict: 'user_id,course_id' });
  if (enrollErr) throw enrollErr;

  // 4. Add contact to Brevo
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const segment = courseId === 'kegel' ? 'buyer_kegel' : 'buyer_mm21';
      const attributes = {
        FIRSTNAME: String(profileData.name).substring(0, 100),
        REGISTRATION_DATE: new Date().toISOString().split('T')[0],
        PRODUCT_BOUGHT: courseId,
        PURCHASE_DATE: new Date().toISOString().split('T')[0],
      };
      if (phone) {
        attributes.SMS = String(phone).replace(/[^0-9+]/g, '').substring(0, 20);
      }

      const listIds = [];
      if (segment === 'buyer_kegel' && process.env.BREVO_LIST_BUYERS_KEGEL) {
        listIds.push(parseInt(process.env.BREVO_LIST_BUYERS_KEGEL));
      }
      if (segment === 'buyer_mm21' && process.env.BREVO_LIST_BUYERS_MM21) {
        listIds.push(parseInt(process.env.BREVO_LIST_BUYERS_MM21));
      }

      const body = {
        email: email.trim().toLowerCase(),
        attributes,
        updateEnabled: true,
      };
      if (listIds.length) body.listIds = listIds;

      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (brevoErr) {
      console.error('[brevo-sync-helper] Error:', brevoErr);
    }
  }

  // 5. Schedule email sequence in Supabase email_queue
  const segment = courseId === 'kegel' ? 'buyer_kegel' : 'buyer_mm21';
  const sequence = EMAIL_SEQUENCES[segment];
  if (sequence) {
    try {
      // Check if already scheduled
      const { data: existingSeq, error: seqCheckErr } = await admin
        .from('email_queue')
        .select('id')
        .eq('email', email)
        .eq('sequence', segment)
        .limit(1);

      if (!seqCheckErr && (!existingSeq || existingSeq.length === 0)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const rows = sequence.map((emailData, index) => {
          const sendDate = new Date(today);
          sendDate.setDate(sendDate.getDate() + emailData.day);
          return {
            email,
            name: profileData.name,
            sequence: segment,
            email_number: index + 1,
            subject: emailData.subject,
            html_content: emailData.body,
            scheduled_for: sendDate.toISOString().split('T')[0],
            sent: false,
          };
        });

        await admin.from('email_queue').insert(rows);
      }
    } catch (seqErr) {
      console.error('[sequence-schedule-helper] Error:', seqErr);
    }
  }

  return { userId, email, courseId };
}
