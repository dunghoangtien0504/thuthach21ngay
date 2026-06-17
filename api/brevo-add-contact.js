/**
 * POST /api/brevo-add-contact
 * Adds or updates a contact in Brevo with attributes.
 * Body: { email, name, phone, segment, product, purchaseDate }
 * segment: 'registered' | 'buyer_kegel' | 'buyer_mm21'
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

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

  // Determine list IDs from env vars (optional — works without lists too)
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
