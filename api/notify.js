export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.VITE_TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(200).json({ success: false, message: 'Telegram not configured' });
  }

  const { type, data } = req.body || {};
  if (!type || !data) {
    return res.status(400).json({ error: 'Missing type or data' });
  }

  let msg = '';
  if (type === 'registration') {
    const e = String(data.email || '').substring(0, 100);
    const p = String(data.phone || '').substring(0, 20);
    const n = String(data.name || '').substring(0, 100);
    const s = String(data.source || '').substring(0, 50);
    msg = `📝 *Đăng Ký Mới*\n\n• Họ tên: *${n}*\n• Email: \`${e}\`\n• SĐT: \`${p || 'N/A'}\`\n• Nguồn: ${s || '/'}`;
  } else if (type === 'enrollment') {
    const n = String(data.name || '').substring(0, 100);
    const e = String(data.email || '').substring(0, 100);
    const p = String(data.phone || '').substring(0, 20);
    const c = String(data.courseName || '').substring(0, 100);
    const g = String(data.goal || '').substring(0, 100);
    const note = String(data.note || '').substring(0, 200);
    msg = `📚 *Đăng Ký Khóa Học Mới*\n\n• Khóa học: *${c}*\n• Họ tên: *${n}*\n• Email: \`${e}\`\n• SĐT: \`${p || 'N/A'}\`\n• Mục tiêu: ${g || 'N/A'}\n• Ghi chú: ${note || 'Không có'}`;
  } else {
    return res.status(400).json({ error: 'Unknown notification type' });
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[notify]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
