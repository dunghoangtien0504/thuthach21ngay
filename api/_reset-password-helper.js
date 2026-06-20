import { createClient } from '@supabase/supabase-js';
import { sendPasswordReset } from './send-confirmation.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Tạo mật khẩu mới dễ đọc (tránh ký tự dễ nhầm: 0/O, 1/l/I).
 * Độ dài 8 ký tự — đủ mạnh, dễ đọc cho khách qua Telegram.
 */
function generateReadablePassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let pw = '';
  for (let i = 0; i < 8; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

/**
 * Reset mật khẩu cho 1 học viên:
 *  1. Tìm user theo email
 *  2. Sinh mật khẩu mới + set qua Supabase Admin API
 *  3. Lưu vào user_profiles (temp_password, temp_password_at) để admin quản lý
 *  4. Gửi email mật khẩu mới cho khách
 *  5. Cảnh báo Telegram về cho admin
 *
 * @param {Object} opts
 * @param {string} opts.email
 * @param {string} [opts.source] - 'forgot_password' | 'admin_panel'
 * @returns {Promise<{found:boolean, email?:string, name?:string, newPassword?:string}>}
 */
export async function resetUserPassword({ email, source = 'forgot_password' }) {
  if (!email) throw new Error('Email is required');
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase credentials not configured.');
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const cleanEmail = email.trim().toLowerCase();

  // 1. Find user by email
  const { data: { users }, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw listErr;
  const target = users.find(u => u.email?.toLowerCase() === cleanEmail);

  if (!target) {
    return { found: false };
  }

  // 2. Generate + set new password
  const newPassword = generateReadablePassword();
  const { error: updErr } = await admin.auth.admin.updateUserById(target.id, {
    password: newPassword,
    email_confirm: true,
  });
  if (updErr) throw updErr;

  // 3. Store in admin-only password_resets table.
  //    Bảng này BẬT RLS và KHÔNG có policy public → chỉ service role (server) đọc được,
  //    client với anon key KHÔNG bao giờ đọc được mật khẩu này.
  const name = target.user_metadata?.name || cleanEmail.split('@')[0];
  try {
    await admin.from('password_resets').upsert({
      user_id: target.id,
      email: cleanEmail,
      name,
      temp_password: newPassword,
      reset_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (profErr) {
    console.error('[reset-password] Could not store temp password:', profErr.message);
  }

  // 4. Email the new password to the customer
  try {
    await sendPasswordReset({ email: cleanEmail, name, newPassword });
  } catch (mailErr) {
    console.error('[reset-password] Email send failed:', mailErr.message);
  }

  // 5. Telegram alert to admin
  const telegramToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.VITE_TELEGRAM_PAYMENT_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;
  if (telegramToken && telegramChatId) {
    const srcLabel = source === 'admin_panel' ? 'Admin reset' : 'Khách bấm Quên mật khẩu';
    const text = `🔑 *Reset Mật Khẩu Học Viên*\n\n• Học viên: *${name}*\n• Email: \`${cleanEmail}\`\n• Mật khẩu mới: \`${newPassword}\`\n• Nguồn: _${srcLabel}_\n\n_Mật khẩu đã được gửi vào email khách. Anh có thể đọc lại cho khách qua Telegram nếu cần._`;
    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramChatId, text, parse_mode: 'Markdown' }),
      });
    } catch (tgErr) {
      console.error('[reset-password] Telegram alert failed:', tgErr.message);
    }
  }

  return { found: true, email: cleanEmail, name, newPassword };
}
