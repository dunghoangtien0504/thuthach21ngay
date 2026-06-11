export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing webhook payload body' });
  }

  console.log('Received SePay Webhook:', payload);

  const telegramToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.VITE_TELEGRAM_CHAT_ID;

  // Verify it is an incoming money transaction
  const transferType = payload.transferType || payload.transfer_type || 'in';
  const amount = parseFloat(payload.transferAmount || payload.amount || 0);

  if (transferType === 'in' && amount >= 680000) {
    // Notify the admin via Telegram Bot immediately
    if (telegramToken && telegramChatId) {
      const bankGateway = payload.gateway || 'Ngân hàng';
      const accountNo = payload.accountNumber || '';
      const content = payload.content || '';
      const dateStr = payload.transactionDate || new Date().toLocaleString('vi-VN');
      const refCode = payload.referenceCode || '';

      const messageText = `✅ *Thanh Toán Khóa Học Thành Công!*\n\n• Số tiền: *${amount.toLocaleString('vi-VN')}đ*\n• Ngân hàng: *${bankGateway}*\n• Số TK nhận: \`${accountNo}\`\n• Nội dung CK: *${content}*\n• Thời gian: _${dateStr}_\n• Mã đối chiếu: \`${refCode}\``;

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: messageText,
            parse_mode: 'Markdown'
          })
        });
      } catch (err) {
        console.error("Failed to send webhook Telegram notification:", err);
      }
    }
  }

  // Always return 200 OK to SePay to acknowledge receipt
  return res.status(200).json({ success: true });
}
