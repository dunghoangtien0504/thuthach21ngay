/**
 * GET /api/process-email-queue
 * Called daily by Vercel Cron (0 1 * * * = 8 AM Vietnam time / UTC+7).
 * Fetches all email_queue rows scheduled for today or earlier that haven't been sent,
 * injects open/click tracking, sends via Resend, marks as sent.
 * Errors are stored in email_queue.error_message and logged to email_events.
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM      = 'FORMEN <no-reply@thuthach21ngay.org>';
const SITE_URL  = (process.env.VITE_SITE_URL || 'https://www.thuthach21ngay.org').replace(/\/$/, '');
const BATCH_SIZE = 50;

// ─── Inject open-pixel + wrap every <a href> through click tracker ─────────
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

// ─── Record error event to email_events ────────────────────────────────────
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

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
