export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const order = req.body;
  if (!order || !order.name || !order.phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Sanitize inputs
  order.name = String(order.name).substring(0, 100);
  order.phone = String(order.phone).replace(/[^0-9+\- ()]/g, '').substring(0, 20);
  order.address = String(order.address || '').substring(0, 300);
  order.product = String(order.product || '').substring(0, 100);
  order.productLabel = String(order.productLabel || '').substring(0, 100);
  order.id = String(order.id || '').substring(0, 50);

  const telegramToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.VITE_TELEGRAM_PAYMENT_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

  if (telegramToken && telegramChatId) {
    const text =
      `📦 *Đơn Thực Phẩm Bổ Sung Mới!*\n\n` +
      `• Sản phẩm: *${order.productLabel || order.product}*\n` +
      `• Họ tên: ${order.name}\n` +
      `• SĐT: \`${order.phone}\`\n` +
      `• Địa chỉ: ${order.address}\n` +
      `• Thời gian: ${new Date(order.createdAt).toLocaleString('vi-VN')}\n` +
      `• Mã đơn: \`${order.id}\``;

    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramChatId, text, parse_mode: 'Markdown' })
      });
    } catch (err) {
      console.error('Telegram notification failed:', err);
    }
  }

  return res.status(200).json({ success: true, id: order.id });
}
