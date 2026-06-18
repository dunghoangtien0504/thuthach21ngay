// api/emails.js - Merged Email sequence & queue processor API handler

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { EMAIL_SEQUENCES } from './_email-sequences.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleScheduleEmails(req, res);
  } else if (req.method === 'GET') {
    return handleProcessEmailQueue(req, res);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

// ─── POST: Schedule Emails (Previously schedule-email-sequence.js) ─────────
async function handleScheduleEmails(req, res) {
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

// ─── GET: Process Email Queue (Previously process-email-queue.js) ───────────
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM      = 'FORMEN <no-reply@thuthach21ngay.org>';
const SITE_URL  = (process.env.VITE_SITE_URL || 'https://www.thuthach21ngay.org').replace(/\/$/, '');
const BATCH_SIZE = 50;

function injectTracking(html, { id, email, sequence, emailNumber }) {
  const params = `id=${id}&email=${encodeURIComponent(email)}&seq=${encodeURIComponent(sequence || '')}&num=${emailNumber || ''}`;

  // 1. Replace <a href="..."> with click tracker
  const tracked = html.replace(
    /<a\s([^>]*?)href="([^"#][^"]*)"([^>]*)>/gi,
    (match, before, url, after) => {
      // Skip unsubscribe links and anchor links
      if (url.startsWith('#') || url.includes('track')) return match;
      const wrapped = `${SITE_URL}/api/track?type=click&${params}&url=${encodeURIComponent(url)}`;
      return `<a ${before}href="${wrapped}"${after}>`;
    }
  );

  // 2. Insert open-pixel before </body>
  const pixel = `<img src="${SITE_URL}/api/track?type=open&${params}" width="1" height="1" style="display:block;max-height:1px;overflow:hidden;" alt="" />`;
  return tracked.replace(/<\/body>/i, `${pixel}</body>`);
}

async function recordError({ queueId, email, sequence, emailNumber, errorMsg }) {
  try {
    await supabase.from('email_events').insert({
      queue_id:     queueId,
      email,
      sequence:     sequence || null,
      email_number: emailNumber ? parseInt(emailNumber) : null,
      event_type:   'error',
      error_msg:    errorMsg,
    });
  } catch (e) {
    console.error('[process-email-queue] Failed to record error event:', e.message);
  }
}

async function handleProcessEmailQueue(req, res) {
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date().toISOString().split('T')[0];

  const { data: dueEmails, error: fetchError } = await supabase
    .from('email_queue')
    .select('id, email, name, sequence, email_number, subject, html_content')
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
      // Inject tracking before sending
      const trackedHtml = injectTracking(row.html_content, {
        id:          row.id,
        email:       row.email,
        sequence:    row.sequence,
        emailNumber: row.email_number,
      });

      const { error } = await resend.emails.send({
        from:    FROM,
        to:      [row.email],
        subject: row.subject,
        html:    trackedHtml,
      });

      if (error) throw new Error(`Resend error: ${error.message}`);

      await supabase
        .from('email_queue')
        .update({ sent: true, sent_at: new Date().toISOString(), error_message: null })
        .eq('id', row.id);

      results.sent++;
    } catch (err) {
      const msg = err.message || 'Unknown error';
      console.error(`Failed to send email to ${row.email}:`, msg);

      // Store error in the queue row
      await supabase
        .from('email_queue')
        .update({ error_message: msg, retry_count: (row.retry_count || 0) + 1 })
        .eq('id', row.id);

      // Log to email_events for admin dashboard
      await recordError({
        queueId:     row.id,
        email:       row.email,
        sequence:    row.sequence,
        emailNumber: row.email_number,
        errorMsg:    msg,
      });

      results.failed++;
      results.errors.push({ email: row.email, error: msg });
    }
  }

  console.log(`[process-email-queue] ${today}: sent=${results.sent} failed=${results.failed}`);
  return res.status(200).json({ date: today, ...results });
}
