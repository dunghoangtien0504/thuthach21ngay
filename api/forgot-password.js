import { resetUserPassword } from './_reset-password-helper.js';

/**
 * Public endpoint — khách bấm "Quên mật khẩu", nhập email.
 * Luôn trả về success chung chung để không lộ email nào tồn tại trong hệ thống.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Email không hợp lệ' });
  }

  try {
    await resetUserPassword({ email, source: 'forgot_password' });
    // Generic response — không tiết lộ email có tồn tại hay không
    return res.status(200).json({
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, mật khẩu mới đã được gửi vào hộp thư của anh.',
    });
  } catch (err) {
    console.error('[forgot-password] Error:', err);
    return res.status(500).json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ hỗ trợ.' });
  }
}
