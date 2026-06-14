/**
 * api/admin-transactions.js — Fetch all recent SePay transactions for admin panel
 * Protected by admin password header.
 */
export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || '';
  const allowed = process.env.VITE_SITE_URL || '';
  res.setHeader('Access-Control-Allow-Origin', (allowed && origin.startsWith(allowed)) ? origin : '');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers['authorization'] || '';
  const adminPass  = process.env.VITE_ADMIN_PASS || '';
  if (!adminPass || authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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
