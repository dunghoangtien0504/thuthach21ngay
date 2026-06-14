export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-brevo-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

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
