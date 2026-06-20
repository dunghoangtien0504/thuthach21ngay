import { createClient } from '@supabase/supabase-js';
import { activateUserCourse } from './_activation-helper.js';

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

  if (transferType === 'in' && amount >= 198000 && telegramToken && telegramChatId) {
    const bankGateway = payload.gateway || payload.bank_brand_name || payload.bankBrandName || 'Ngân hàng';
    const accountNo = payload.accountNumber || payload.account_number || '';
    const content = payload.content || payload.transaction_content || payload.transactionContent || '';
    const dateStr = payload.transactionDate || payload.transaction_date || new Date().toLocaleString('vi-VN');
    const refCode = payload.referenceCode || payload.reference_code || payload.id || '';

    // Kegel = 199.000đ | MM21 = 686.868đ — tight windows prevent cross-product false activation
    const isKegel = amount >= 198000 && amount <= 205000;
    const isMM21  = amount >= 685000 && amount <= 695000;
    const isKnownProduct = isKegel || isMM21;

    let productLabel = '';
    let courseId = null;
    if (isKegel)       { productLabel = '🥋 *Kegel Khởi Đầu* (199k)'; courseId = 'kegel'; }
    else if (isMM21)   { productLabel = '🔑 *Mật Mã 21* (686k)';       courseId = 'mat-ma-21'; }
    else               { productLabel = `❓ Giao dịch không xác định: ${amount.toLocaleString('vi-VN')}đ`; }

    // Try to auto-activate — chỉ khi nhận ra sản phẩm
    let activatedUser = null;
    let activationErrorMsg = '';

    // Extract phone number from content (digits of length 9 to 11)
    const phoneMatch = content.match(/\d{9,11}/);
    const cleanPhone = phoneMatch ? phoneMatch[0].replace(/[^0-9]/g, '') : null;

    if (!isKnownProduct) {
      activationErrorMsg = `Số tiền ${amount.toLocaleString('vi-VN')}đ không khớp với bất kỳ sản phẩm nào (199k hoặc 686k). Kiểm tra thủ công.`;
    } else if (cleanPhone) {
      try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && serviceRoleKey) {
          const admin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          });

          // Query user_profiles by matching the last 9 digits of the phone number
          const suffix = cleanPhone.substring(cleanPhone.length - 9);
          const { data: profiles, error: profErr } = await admin
            .from('user_profiles')
            .select('id, name, phone')
            .like('phone', `%${suffix}`);

          if (profErr) throw profErr;

          if (profiles && profiles.length > 0) {
            const profile = profiles[0];
            const { data: { user }, error: userErr } = await admin.auth.admin.getUserById(profile.id);
            if (userErr) throw userErr;

            if (user && user.email) {
              await activateUserCourse({
                email: user.email,
                name: profile.name || user.user_metadata?.name,
                phone: profile.phone,
                courseId,
                source: 'sepay_webhook',
              });
              activatedUser = { email: user.email, name: profile.name || user.user_metadata?.name || 'Học viên' };
            } else {
              activationErrorMsg = 'Không tìm thấy email của user trong Auth.';
            }
          } else {
            activationErrorMsg = `Không tìm thấy SĐT đuôi \`...${suffix}\` trong user_profiles.`;
          }
        } else {
          activationErrorMsg = 'Chưa cấu hình Supabase URL hoặc Service Role Key.';
        }
      } catch (err) {
        console.error('Webhook auto-activation failed:', err);
        activationErrorMsg = `Lỗi hệ thống: ${err.message || 'Unknown error'}`;
      }
    } else {
      activationErrorMsg = 'Không tìm thấy số điện thoại trong nội dung chuyển khoản.';
    }

    let activationLabel = '';
    if (activatedUser) {
      activationLabel = `\n⚡ *Tài khoản tự động kích hoạt*: ${activatedUser.name} (${activatedUser.email})`;
    } else {
      activationLabel = `\n⚠️ *Không tự động kích hoạt*: ${activationErrorMsg}`;
    }

    const messageText = `✅ *Thanh Toán Thành Công!*\n\n• Sản phẩm: ${productLabel}\n• Số tiền: *${amount.toLocaleString('vi-VN')}đ*\n• Ngân hàng: *${bankGateway}*\n• Số TK nhận: \`${accountNo}\`\n• Nội dung CK: *${content}*\n• Thời gian: _${dateStr}_\n• Mã đối chiếu: \`${refCode}\`${activationLabel}`;

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
