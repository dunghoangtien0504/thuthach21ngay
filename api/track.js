/**
 * GET /api/track/open?id={queueId}   → 1×1 pixel, ghi nhận mở email
 * GET /api/track/click?id={queueId}&url={encodedUrl} → redirect + ghi nhận click
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1×1 transparent GIF
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

async function recordEvent({ queueId, email, sequence, emailNumber, eventType, url, ip, ua }) {
  try {
    await supabase.from('email_events').insert({
      queue_id:     queueId || null,
      email:        email || null,
      sequence:     sequence || null,
      email_number: emailNumber ? parseInt(emailNumber) : null,
      event_type:   eventType,
      url:          url || null,
      ip:           ip || null,
      user_agent:   (ua || '').substring(0, 300),
    });
  } catch (err) {
    console.error('[track] DB insert error:', err.message);
  }
}

export default async function handler(req, res) {
  const { id, url, email, seq, num } = req.query;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '';
  const ua = req.headers['user-agent'] || '';

  const type = req.url?.includes('/track/click') || req.query.type === 'click' ? 'click' : 'open';

  // Route by ?type or path suffix
  const path = req.url?.split('?')[0] || '';
  const isClick = path.endsWith('/click') || req.query.type === 'click';

  if (isClick) {
    // Click tracking: redirect then record
    const targetUrl = url ? decodeURIComponent(url) : 'https://www.thuthach21ngay.org';
    // Redirect immediately so user isn't delayed
    res.setHeader('Location', targetUrl);
    res.setHeader('Cache-Control', 'no-store');
    res.status(302).end();

    // Record asynchronously (fire and forget)
    recordEvent({ queueId: id, email, sequence: seq, emailNumber: num, eventType: 'click', url: targetUrl, ip, ua });
    return;
  }

  // Open tracking: return 1×1 pixel
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Length', PIXEL.length);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.status(200).end(PIXEL);

  recordEvent({ queueId: id, email, sequence: seq, emailNumber: num, eventType: 'open', ip, ua });
}
