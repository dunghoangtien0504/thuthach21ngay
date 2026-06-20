/**
 * Gửi email xác nhận tức thì (transactional, không qua queue).
 * type: 'register' | 'kegel' | 'mm21'
 *
 * Telegram groups:
 *  - Cộng đồng FORMEN (register): https://t.me/+formen_community
 *  - Hỗ trợ Kegel:                https://t.me/+formen_kegel
 *  - Hỗ trợ Mật Mã 21:            https://t.me/+formen_mm21
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = 'FORMEN <no-reply@thuthach21ngay.org>';

const SITE   = 'https://www.thuthach21ngay.org';

const TG_COMMUNITY = 'https://web.telegram.org/a/#-5485155652';
const TG_KEGEL     = 'https://web.telegram.org/a/#-5282773244';
const TG_MM21      = 'https://web.telegram.org/a/#-1003980994902';

const PORTAL_URL   = `${SITE}/kegel-portal`;
const MM21_PORTAL  = `${SITE}/portal`;
const KEGEL_URL    = `${SITE}/kegel-khoi-dau`;
const MM21_URL     = `${SITE}/#offer-section`;

function wrapConfirm(body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 24px;color:#1a1a1a;font-size:16px;line-height:1.9;">
${body}
<hr style="border:none;border-top:1px solid #eeeeee;margin:32px 0;">
<p style="font-size:12px;color:#aaaaaa;">FORMEN · Nếu cần hỗ trợ, reply email này.</p>
</div></body></html>`;
}

const TEMPLATES = {
  register: (name) => ({
    subject: 'đăng ký thành công — chào mừng anh đến FORMEN',
    html: wrapConfirm(`
<p>Anh ${name || 'ơi'},</p>

<p>Tài khoản FORMEN của anh đã được tạo thành công.</p>

<p>Đây là bước đầu tiên — và tôi không nói điều đó qua loa. Phần lớn đàn ông biết mình cần nhưng không bắt đầu. Anh đã bắt đầu.</p>

<p>Tôi sẽ gửi cho anh những thông tin và phương pháp thiết thực nhất trong những ngày tới — không spam, không bán hàng ép. Chỉ những gì thật sự hữu ích.</p>

<p><strong>Trong thời gian đó — anh có thể vào cộng đồng FORMEN để:</strong></p>
<ul style="margin:12px 0;padding-left:20px;">
  <li style="margin-bottom:8px;">Đặt câu hỏi riêng tư với những người cùng hành trình</li>
  <li style="margin-bottom:8px;">Nhận hỗ trợ từ đội ngũ FORMEN</li>
  <li style="margin-bottom:8px;">Đọc chia sẻ thật từ học viên đã có kết quả</li>
</ul>

<p style="text-align:center;margin:28px 0;">
  <a href="${TG_COMMUNITY}" style="background:#229ED9;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;font-size:15px;">📱 Vào Cộng Đồng FORMEN →</a>
</p>

<p>Tôi sẽ gặp anh trong email tiếp theo.</p>

<p>—<br>FORMEN</p>`)
  }),

  kegel: (name) => ({
    subject: 'đặt hàng thành công — Kegel Khởi Đầu đang chờ anh',
    html: wrapConfirm(`
<p>Anh ${name || 'ơi'},</p>

<p>Thanh toán đã được xác nhận. <strong>Kegel Khởi Đầu</strong> đã được kích hoạt cho tài khoản của anh.</p>

<p>Anh vừa làm điều mà 94% người đọc xong rồi thôi — anh đã bước vào thật sự.</p>

<p><strong>Bắt đầu ngay hôm nay:</strong></p>
<ul style="margin:12px 0;padding-left:20px;">
  <li style="margin-bottom:8px;">Vào portal → học bài 1 (10 phút)</li>
  <li style="margin-bottom:8px;">Tập đúng lịch — không tập thêm, không bỏ buổi</li>
  <li style="margin-bottom:8px;">Sau ngày 3 sẽ bắt đầu cảm nhận được sự khác biệt</li>
</ul>

<p style="text-align:center;margin:24px 0;">
  <a href="${PORTAL_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;font-size:15px;">Vào Portal Học Ngay →</a>
</p>

<p><strong>Cần hỗ trợ kỹ thuật hoặc có câu hỏi?</strong><br>
Nhóm hỗ trợ Kegel — anh hỏi là có người trả lời trong ngày:</p>

<p style="text-align:center;margin:20px 0;">
  <a href="${TG_KEGEL}" style="background:#229ED9;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">📱 Nhóm Hỗ Trợ Kegel →</a>
</p>

<p>Tôi sẽ check-in với anh sau 2 ngày đầu.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">Hoàn tiền 7 ngày nếu không thấy khác biệt — reply email này để yêu cầu.</p>`)
  }),

  mm21: (name) => ({
    subject: 'đặt hàng thành công — Mật Mã 21 đã kích hoạt',
    html: wrapConfirm(`
<p>Anh ${name || 'ơi'},</p>

<p>Thanh toán đã được xác nhận. <strong>Mật Mã 21</strong> đã được kích hoạt cho tài khoản của anh — 21 ngày bắt đầu từ hôm nay.</p>

<p>Đây không phải điều nhỏ. Anh vừa chọn đối mặt thay vì tiếp tục né tránh. Đó là quyết định quan trọng nhất.</p>

<p><strong>3 điều để 21 ngày này không bị lãng phí:</strong></p>
<ul style="margin:12px 0;padding-left:20px;">
  <li style="margin-bottom:10px;"><strong>Đừng bỏ qua bài tâm lý.</strong> 60% kiểm soát đến từ hệ thần kinh — không phải cơ bắp.</li>
  <li style="margin-bottom:10px;"><strong>Không tập thêm ngoài lịch.</strong> Tập đúng quan trọng hơn tập nhiều.</li>
  <li style="margin-bottom:10px;"><strong>Tuần 2 nhiều người bỏ.</strong> Nếu anh qua được tuần 2 — tuần 3 sẽ là nơi mọi thứ thay đổi.</li>
</ul>

<p style="text-align:center;margin:24px 0;">
  <a href="${MM21_PORTAL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;font-size:15px;">Vào Portal Mật Mã 21 →</a>
</p>

<p><strong>Nhóm hỗ trợ Mật Mã 21</strong> — học viên và đội ngũ FORMEN đồng hành cùng anh suốt 21 ngày:</p>

<p style="text-align:center;margin:20px 0;">
  <a href="${TG_MM21}" style="background:#229ED9;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">📱 Nhóm Hỗ Trợ Mật Mã 21 →</a>
</p>

<p>Tôi sẽ gặp anh vào ngày 3.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">Hoàn tiền 3 ngày vô điều kiện — reply email này để yêu cầu.</p>`)
  }),
};

/**
 * Gửi email mật khẩu mới sau khi reset.
 * @param {Object} opts
 * @param {string} opts.email
 * @param {string} [opts.name]
 * @param {string} opts.newPassword
 */
export async function sendPasswordReset({ email, name, newPassword }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[send-confirmation] RESEND_API_KEY not configured');
    return;
  }
  if (!email || !newPassword) return;

  const html = wrapConfirm(`
<p>Anh ${name || 'ơi'},</p>

<p>Mật khẩu đăng nhập FORMEN của anh vừa được đặt lại theo yêu cầu.</p>

<p style="text-align:center;margin:24px 0;">
  <span style="display:inline-block;background:#0D2B1A;color:#D4AF37;padding:14px 36px;border-radius:6px;font-size:22px;font-weight:bold;letter-spacing:2px;font-family:monospace;">${newPassword}</span>
</p>

<p style="text-align:center;color:#666;font-size:13px;margin-top:-12px;">Mật khẩu mới của anh</p>

<p>Anh dùng email này và mật khẩu trên để đăng nhập:</p>

<p style="text-align:center;margin:24px 0;">
  <a href="${MM21_PORTAL}" style="background:#229ED9;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;font-size:15px;">Đăng Nhập Ngay →</a>
</p>

<p style="font-size:14px;color:#888;">Sau khi đăng nhập, anh nên vào phần tài khoản để đổi sang mật khẩu riêng dễ nhớ hơn.</p>

<p>Nếu anh không yêu cầu đổi mật khẩu — hãy reply email này để chúng tôi hỗ trợ ngay.</p>

<p>—<br>FORMEN</p>`);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: 'Mật khẩu mới của anh — FORMEN',
      html,
    });
    if (error) throw new Error(error.message);
    console.log(`[send-confirmation] Password reset sent to ${email}`);
  } catch (err) {
    console.error(`[send-confirmation] Password reset failed to ${email}:`, err.message);
    throw err;
  }
}

function capitalizeSubject(subject) {
  if (!subject || typeof subject !== 'string') return subject;
  return subject.replace(/^([^a-zA-Zà-ỹÀ-Ỹ]*)([a-zA-Zà-ỹÀ-Ỹ])/, (match, prefix, char) => prefix + char.toUpperCase());
}

/**
 * Send an immediate confirmation email.
 * @param {Object} opts
 * @param {'register'|'kegel'|'mm21'} opts.type
 * @param {string} opts.email
 * @param {string} [opts.name]
 */
export async function sendConfirmation({ type, email, name }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[send-confirmation] RESEND_API_KEY not configured');
    return;
  }

  const tpl = TEMPLATES[type];
  if (!tpl) {
    console.warn('[send-confirmation] Unknown type:', type);
    return;
  }

  const { subject, html } = tpl(name);
  const capitalizedSubject = capitalizeSubject(subject);

  try {
    const { error } = await resend.emails.send({ from: FROM, to: [email], subject: capitalizedSubject, html });
    if (error) throw new Error(error.message);
    console.log(`[send-confirmation] Sent type=${type} to ${email}`);
  } catch (err) {
    console.error(`[send-confirmation] Failed type=${type} to ${email}:`, err.message);
  }
}

// Also expose as HTTP endpoint for manual triggers
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers['authorization'] || '';
  const adminPass  = process.env.ADMIN_PASS || '';
  if (adminPass && authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { type, email, name } = req.body || {};
  if (!type || !email) return res.status(400).json({ error: 'type and email required' });

  await sendConfirmation({ type, email, name });
  return res.status(200).json({ ok: true });
}
