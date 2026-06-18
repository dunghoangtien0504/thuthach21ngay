// api/brevo.js - Merged Brevo API handler

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-brevo-key');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return handleAddContact(req, res);
  } else if (req.method === 'GET') {
    return handleGetStats(req, res);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

async function handleAddContact(req, res) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ success: false, error: 'BREVO_API_KEY not configured' });
  }

  const { email, name, phone, segment, product, purchaseDate } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email is required' });

  // Build contact attributes
  const attributes = {
    FIRSTNAME: String(name || '').substring(0, 100),
    SMS: String(phone || '').replace(/[^0-9+]/g, '').substring(0, 20),
    REGISTRATION_DATE: new Date().toISOString().split('T')[0],
  };

  if (segment === 'buyer_kegel' || segment === 'buyer_mm21') {
    attributes.PRODUCT_BOUGHT = product || (segment === 'buyer_kegel' ? 'kegel' : 'mm21');
    attributes.PURCHASE_DATE = purchaseDate || new Date().toISOString().split('T')[0];
  }

  // Determine list IDs from env vars
  const listIds = [];
  if (segment === 'registered' && process.env.BREVO_LIST_REGISTERED) {
    listIds.push(parseInt(process.env.BREVO_LIST_REGISTERED));
  }
  if (segment === 'buyer_kegel' && process.env.BREVO_LIST_BUYERS_KEGEL) {
    listIds.push(parseInt(process.env.BREVO_LIST_BUYERS_KEGEL));
  }
  if (segment === 'buyer_mm21' && process.env.BREVO_LIST_BUYERS_MM21) {
    listIds.push(parseInt(process.env.BREVO_LIST_BUYERS_MM21));
  }

  try {
    const body = {
      email: email.trim().toLowerCase(),
      attributes,
      updateEnabled: true, // update if already exists
    };
    if (listIds.length) body.listIds = listIds;

    const r = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // 204 = updated, 201 = created, 400 with "duplicate" = already exists (also OK)
    if (r.status === 201 || r.status === 204) {
      return res.status(200).json({ success: true, status: r.status });
    }

    const errData = await r.json().catch(() => ({}));
    // Contact already exists with same data — not an error
    if (errData.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true, status: 'already_exists' });
    }

    console.error('[brevo-add-contact] error', r.status, errData);
    return res.status(200).json({ success: false, error: errData.message || `HTTP ${r.status}` });

  } catch (err) {
    console.error('[brevo-add-contact]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function handleGetStats(req, res) {
  // API key: env var takes priority, then admin-supplied header
  const apiKey = process.env.BREVO_API_KEY || req.headers['x-brevo-key'];
  if (!apiKey) {
    return res.status(200).json({ success: false, error: 'BREVO_API_KEY chưa được cấu hình. Thêm vào .env hoặc nhập trong giao diện admin.' });
  }

  const headers = { 'api-key': apiKey, 'Content-Type': 'application/json' };
  const BASE = 'https://api.brevo.com/v3';

  try {
    const [accountRes, campaignsRes, contactsRes] = await Promise.all([
      fetch(`${BASE}/account`, { headers }),
      fetch(`${BASE}/emailCampaigns?status=sent&limit=50&type=classic&sort=desc`, { headers }),
      fetch(`${BASE}/contacts?limit=1`, { headers }),
    ]);

    if (!accountRes.ok) {
      const errBody = await accountRes.json().catch(() => ({}));
      return res.status(200).json({ success: false, error: errBody.message || `HTTP ${accountRes.status} — API key không hợp lệ` });
    }

    const account = await accountRes.json();
    const campaignBody = campaignsRes.ok ? await campaignsRes.json() : { campaigns: [] };
    const contactBody = contactsRes.ok ? await contactsRes.json() : {};

    const campaigns = (campaignBody.campaigns || []).map(c => ({
      id: c.id,
      name: c.name,
      sentDate: c.sentDate,
      statistics: c.statistics || {},
    }));

    // Aggregate totals across all fetched campaigns
    let sent = 0, delivered = 0, opened = 0, clicked = 0, bounced = 0, unsubscribed = 0;
    campaigns.forEach(c => {
      const gs = c.statistics.globalStats || c.statistics || {};
      sent        += gs.sent          || 0;
      delivered   += gs.delivered     || 0;
      opened      += gs.uniqueOpens   || gs.opened  || 0;
      clicked     += gs.uniqueClicks  || gs.clicked || 0;
      bounced     += (gs.hardBounces  || 0) + (gs.softBounces || 0);
      unsubscribed += gs.unsubscribed || 0;
    });

    return res.status(200).json({
      success: true,
      account: {
        email: account.email,
        plan: (account.plan || [{ type: 'free' }])[0]?.type,
        totalContacts: contactBody.count || 0,
      },
      totals: { sent, delivered, opened, clicked, bounced, unsubscribed },
      campaigns,
    });
  } catch (err) {
    console.error('[brevo-stats]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
