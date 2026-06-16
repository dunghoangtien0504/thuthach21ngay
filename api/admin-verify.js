/**
 * api/admin-verify.js — Validate an admin password without exposing it client-side.
 * The admin panel sends the password the operator typed as a Bearer token; this
 * endpoint compares it against the server-only ADMIN_PASS (falling back to the
 * legacy VITE_ADMIN_PASS for backwards compatibility). Returns { ok: true } on
 * a match. The password is never embedded in the browser bundle.
 */
export default async function handler(req, res) {
  const origin  = req.headers.origin || req.headers.referer || '';
  const allowed = process.env.VITE_SITE_URL || '';
  res.setHeader('Access-Control-Allow-Origin', (allowed && origin.startsWith(allowed)) ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers['authorization'] || '';
  const adminPass  = process.env.ADMIN_PASS || process.env.VITE_ADMIN_PASS || '';
  if (!adminPass) {
    return res.status(503).json({ ok: false, error: 'ADMIN_PASS chưa được cấu hình trên server.' });
  }
  if (authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  return res.status(200).json({ ok: true });
}
