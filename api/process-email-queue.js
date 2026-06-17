/**
 * GET /api/process-email-queue
 * Called daily by Vercel Cron (0 1 * * * = 8 AM Vietnam time / UTC+7).
 * Fetches all email_queue rows scheduled for today or earlier that haven't been sent,
 * sends them via Resend API, and marks them as sent.
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'FORMEN <no-reply@thuthach21ngay.org>';
const BATCH_SIZE = 50; // Resend free: 100/day

async function sendEmail({ to, toName, subject, htmlContent }) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject,
    html: htmlContent,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export default async function handler(req, res) {
  // Vercel Cron sends GET requests; also allow POST for manual triggers
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cron security: Vercel sets Authorization header automatically
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Fetch due emails (scheduled_for <= today, not sent yet)
  const { data: dueEmails, error: fetchError } = await supabase
    .from('email_queue')
    .select('id, email, name, subject, html_content')
    .lte('scheduled_for', today)
    .eq('sent', false)
    .order('scheduled_for', { ascending: true })
    .limit(BATCH_SIZE);

  if (fetchError) {
    console.error('Supabase fetch error:', fetchError);
    return res.status(500).json({ error: 'Failed to fetch queue' });
  }

  if (!dueEmails || dueEmails.length === 0) {
    return res.status(200).json({ message: 'No emails due', sent: 0 });
  }

  const results = { sent: 0, failed: 0, errors: [] };

  for (const row of dueEmails) {
    try {
      await sendEmail({
        to: row.email,
        toName: row.name,
        subject: row.subject,
        htmlContent: row.html_content
      });

      // Mark as sent
      await supabase
        .from('email_queue')
        .update({ sent: true, sent_at: new Date().toISOString() })
        .eq('id', row.id);

      results.sent++;
    } catch (err) {
      console.error(`Failed to send email to ${row.email}:`, err.message);
      results.failed++;
      results.errors.push({ email: row.email, error: err.message });
    }
  }

  console.log(`[process-email-queue] ${today}: sent=${results.sent} failed=${results.failed}`);
  return res.status(200).json({ date: today, ...results });
}
