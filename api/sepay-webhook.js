export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing webhook payload body' });
  }

  console.log('Received SePay Webhook:', payload);

  const telegramToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.VITE_TELEGRAM_PAYMENT_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

  const transferType = payload.transferType || payload.transfer_type || 'in';
  const amount = parseFloat(payload.transferAmount || payload.amount || 0);

  if (transferType === 'in' && amount >= 195000 && telegramToken && telegramChatId) {
    const bankGateway = payload.gateway || payload.bank_brand_name || payload.bankBrandName || 'Ngân hàng';
    const accountNo = payload.accountNumber || payload.account_number || '';
    const content = payload.content || payload.transaction_content || payload.transactionContent || '';
    const dateStr = payload.transactionDate || payload.transaction_date || new Date().toLocaleString('vi-VN');
    const refCode = payload.referenceCode || payload.reference_code || payload.id || '';

    const isKegel = amount >= 195000 && amount < 650000;
    const isMM21 = amount >= 680000;

    let productLabel = '';
    if (isKegel) productLabel = '🥋 *Kegel Khởi Đầu* (199k)';
    else if (isMM21) productLabel = '🔑 *Mật Mã 21* (686k)';
    else productLabel = `Giao dịch ${amount.toLocaleString('vi-VN')}đ`;

    const messageText = `✅ *Thanh Toán Thành Công!*\n\n• Sản phẩm: ${productLabel}\n• Số tiền: *${amount.toLocaleString('vi-VN')}đ*\n• Ngân hàng: *${bankGateway}*\n• Số TK nhận: \`${accountNo}\`\n• Nội dung CK: *${content}*\n• Thời gian: _${dateStr}_\n• Mã đối chiếu: \`${refCode}\``;

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
      console.error('Failed to send webhook Telegram notification:', err);
    }
  }

  return res.status(200).json({ success: true });
}
