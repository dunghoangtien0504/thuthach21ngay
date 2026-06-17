/**
 * POST /api/schedule-email-sequence
 * Called when a user registers or buys a course.
 * Inserts all future emails into Supabase email_queue.
 *
 * Body: { email, name, segment }
 * segment: 'registered' | 'buyer_kegel' | 'buyer_mm21'
 */

import { createClient } from '@supabase/supabase-js';
import { EMAIL_SEQUENCES } from './_email-sequences.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name = '', segment } = req.body || {};

  if (!email || !segment) {
    return res.status(400).json({ error: 'email and segment are required' });
  }

  const sequence = EMAIL_SEQUENCES[segment];
  if (!sequence) {
    return res.status(400).json({ error: `Unknown segment: ${segment}` });
  }

  // Check if this email+segment is already scheduled to avoid duplicates
  const { data: existing } = await supabase
    .from('email_queue')
    .select('id')
    .eq('email', email)
    .eq('sequence', segment)
    .limit(1);

  if (existing && existing.length > 0) {
    return res.status(200).json({ message: 'Already scheduled', skipped: true });
  }

  // Build all queue rows
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = sequence.map((emailData, index) => {
    const sendDate = new Date(today);
    sendDate.setDate(sendDate.getDate() + emailData.day);
    return {
      email,
      name,
      sequence: segment,
      email_number: index + 1,
      subject: emailData.subject,
      html_content: emailData.body,
      scheduled_for: sendDate.toISOString().split('T')[0],
      sent: false
    };
  });

  const { error } = await supabase.from('email_queue').insert(rows);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to schedule emails' });
  }

  return res.status(200).json({
    message: 'Scheduled',
    count: rows.length,
    segment,
    email
  });
}
