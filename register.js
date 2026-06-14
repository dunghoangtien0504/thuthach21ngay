/**
 * register.js — Registration modal for Mật Mã 21
 * Uses Supabase Auth for real account creation + email verification.
 * Falls back to localStorage if Supabase is not configured.
 */

import { supabase, isSupabaseEnabled } from './supabase.js';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || '';
const LS_ACCOUNTS = 'thuthach21ngay_registered_users';

// ── Inject modal HTML ──────────────────────────────────────────────────────
function injectModal() {
  if (document.getElementById('reg-modal')) return;

  document.head.insertAdjacentHTML('beforeend', `
    <style>
      /* === Registration Modal === */
      #reg-modal {
        display: none; position: fixed; inset: 0;
        background: rgba(13,43,26,0.6); backdrop-filter: blur(6px);
        z-index: 2000; align-items: center; justify-content: center; padding: 20px;
      }
      #reg-modal.open { display: flex; }
      .reg-box {
        background: #fff; border-radius: 24px;
        width: 100%; max-width: 440px;
        padding: 40px 36px; position: relative;
        box-shadow: 0 30px 60px -10px rgba(13,43,26,0.3);
        animation: regSlideUp 0.28s cubic-bezier(0.22,1,0.36,1);
      }
      @keyframes regSlideUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .reg-close {
        position: absolute; top: 16px; right: 18px;
        background: none; border: none; font-size: 22px;
        color: #8FA497; cursor: pointer; line-height: 1;
        transition: color 0.2s;
      }
      .reg-close:hover { color: #0D2B1A; }
      .reg-logo {
        display: flex; align-items: center; gap: 10px;
        font-family: 'Lora', Georgia, serif;
        font-size: 18px; font-weight: 700;
        color: #0D2B1A; margin-bottom: 22px;
      }
      .reg-logo i { color: #B8860B; }
      .reg-title {
        font-family: 'Lora', Georgia, serif;
        font-size: 22px; font-weight: 700; color: #0D2B1A;
        margin-bottom: 6px;
      }
      .reg-subtitle {
        font-size: 14px; color: #485A4F; margin-bottom: 28px; line-height: 1.5;
      }
      .reg-form-group { margin-bottom: 18px; }
      .reg-form-group label {
        display: block; font-size: 13px; font-weight: 700;
        color: #0D2B1A; margin-bottom: 7px; letter-spacing: 0.2px;
      }
      .reg-form-group input[type="text"],
      .reg-form-group input[type="email"],
      .reg-form-group input[type="tel"],
      .reg-form-group input[type="password"] {
        width: 100%; padding: 13px 16px;
        border: 1.5px solid rgba(13,43,26,0.12);
        border-radius: 10px; font-family: inherit;
        font-size: 14.5px; color: #0D2B1A;
        background: #FBF9F4; outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
      }
      .reg-form-group input:focus {
        border-color: #B8860B;
        box-shadow: 0 0 0 4px rgba(184,134,11,0.12);
        background: #fff;
      }
      .reg-form-group input.error { border-color: #C0390E; }
      .reg-field-error {
        font-size: 12px; color: #C0390E;
        margin-top: 5px; display: none;
      }
      /* Email consent checkbox */
      .reg-consent {
        display: flex; align-items: flex-start; gap: 10px;
        margin-bottom: 18px; cursor: pointer;
      }
      .reg-consent input[type="checkbox"] {
        width: 18px; height: 18px; margin-top: 2px;
        accent-color: #B8860B; cursor: pointer; flex-shrink: 0;
      }
      .reg-consent-label {
        font-size: 13px; color: #485A4F; line-height: 1.5; cursor: pointer;
      }
      .reg-consent-label strong { color: #0D2B1A; }
      .reg-submit-btn {
        width: 100%; padding: 15px;
        background: linear-gradient(135deg, #B8860B 0%, #D4AF37 100%);
        color: #0D2B1A; border: none; border-radius: 50px;
        font-family: inherit; font-size: 15px; font-weight: 800;
        cursor: pointer; margin-top: 8px;
        transition: all 0.25s;
        display: flex; align-items: center; justify-content: center; gap: 8px;
      }
      .reg-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -4px rgba(184,134,11,0.4); }
      .reg-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      .reg-footer {
        text-align: center; margin-top: 18px;
        font-size: 13px; color: #8FA497;
      }
      .reg-footer a { color: #B8860B; text-decoration: none; font-weight: 700; }
      .reg-footer a:hover { text-decoration: underline; }
      .reg-divider {
        border: none; border-top: 1px solid rgba(13,43,26,0.07);
        margin: 20px 0;
      }
      .reg-privacy {
        font-size: 11.5px; color: #8FA497;
        text-align: center; line-height: 1.55;
        display: flex; align-items: flex-start; gap: 6px;
      }
      .reg-privacy i { margin-top: 2px; color: #2E7D32; flex-shrink: 0; }
      /* Password toggle */
      .reg-pw-wrap { position: relative; }
      .reg-pw-toggle {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        background: none; border: none; cursor: pointer;
        color: #8FA497; font-size: 15px; transition: color 0.2s;
      }
      .reg-pw-toggle:hover { color: #0D2B1A; }
      /* Email confirm state */
      .reg-email-sent {
        display: none; text-align: center; padding: 10px 0;
      }
      .reg-email-sent .email-icon { font-size: 52px; margin-bottom: 16px; display: block; }
      .reg-email-sent h3 {
        font-family: 'Lora', Georgia, serif;
        font-size: 20px; color: #0D2B1A; margin-bottom: 10px;
      }
      .reg-email-sent p { font-size: 14px; color: #485A4F; line-height: 1.6; }
      .reg-email-sent .email-hint {
        margin-top: 16px; padding: 12px 16px;
        background: #F0FDF4; border-radius: 10px;
        font-size: 13px; color: #166534; line-height: 1.5;
      }
      .reg-email-sent .resend-link {
        margin-top: 14px; font-size: 13px; color: #8FA497;
      }
      .reg-email-sent .resend-link button {
        background: none; border: none; color: #B8860B;
        font-weight: 700; cursor: pointer; font-size: 13px;
        font-family: inherit;
      }
      .reg-email-sent .resend-link button:hover { text-decoration: underline; }
      /* Toast */
      #mm21-toast-container {
        position: fixed; bottom: 24px; left: 50%;
        transform: translateX(-50%); z-index: 9999;
        display: flex; flex-direction: column; gap: 10px;
        align-items: center; pointer-events: none;
      }
      .mm21-toast {
        display: flex; gap: 10px; padding: 13px 18px;
        border-radius: 12px; background: #16341F; color: #fff;
        border-left: 4px solid #D4AF37; font-size: 14px;
        font-family: 'Raleway', sans-serif;
        max-width: 360px; pointer-events: all;
        animation: toastIn 0.25s ease-out;
        box-shadow: 0 8px 24px -4px rgba(0,0,0,0.3);
      }
      .mm21-toast.success { border-left-color: #4CAF50; }
      .mm21-toast.error   { border-left-color: #E24B4A; }
      .mm21-toast.warning { border-left-color: #EF9F27; }
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @media (max-width: 480px) {
        .reg-box { padding: 28px 22px; border-radius: 20px; }
        .reg-title { font-size: 20px; }
      }
    </style>
  `);

  document.body.insertAdjacentHTML('beforeend', `
    <div id="reg-modal" role="dialog" aria-modal="true" aria-labelledby="reg-modal-title">
      <div class="reg-box">
        <button class="reg-close" id="reg-close-btn" aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button>

        <div id="reg-form-wrap">
          <div class="reg-logo"><i class="fa-solid fa-shield-halved"></i> Mật Mã 21</div>
          <h2 class="reg-title" id="reg-modal-title">Tạo Tài Khoản</h2>
          <p class="reg-subtitle">Đăng ký tài khoản để truy cập khóa học và nhận hỗ trợ cá nhân hoá.</p>

          <form id="reg-form" novalidate>
            <div class="reg-form-group">
              <label for="reg-name">Họ và Tên <span style="color:#C0390E">*</span></label>
              <input type="text" id="reg-name" placeholder="Nhập họ tên của anh..." required>
              <p class="reg-field-error" id="err-name"></p>
            </div>

            <div class="reg-form-group">
              <label for="reg-email">Email <span style="color:#C0390E">*</span></label>
              <input type="email" id="reg-email" placeholder="email@example.com"
                     autocomplete="email" inputmode="email" required>
              <p class="reg-field-error" id="err-email"></p>
            </div>

            <div class="reg-form-group">
              <label for="reg-phone">Số điện thoại <span style="color:#C0390E">*</span></label>
              <input type="tel" id="reg-phone" placeholder="0912 345 678"
                     autocomplete="tel" inputmode="tel" required>
              <p class="reg-field-error" id="err-phone"></p>
            </div>

            <div class="reg-form-group">
              <label for="reg-password">Mật khẩu <span style="color:#C0390E">*</span></label>
              <div class="reg-pw-wrap">
                <input type="password" id="reg-password" placeholder="Ít nhất 6 ký tự"
                       autocomplete="new-password" required minlength="6">
                <button type="button" class="reg-pw-toggle" id="pw-toggle" aria-label="Hiện/Ẩn mật khẩu">
                  <i class="fa-solid fa-eye" id="pw-toggle-icon"></i>
                </button>
              </div>
              <p class="reg-field-error" id="err-password"></p>
            </div>

            <!-- Email consent checkbox -->
            <label class="reg-consent">
              <input type="checkbox" id="reg-email-consent" checked>
              <span class="reg-consent-label">
                Tôi đồng ý nhận <strong>hướng dẫn, tips và ưu đãi độc quyền</strong> từ Mật Mã 21 qua email. Có thể hủy bất kỳ lúc nào.
              </span>
            </label>

            <button type="submit" class="reg-submit-btn" id="reg-submit-btn">
              <i class="fa-solid fa-user-plus"></i> Tạo Tài Khoản
            </button>
          </form>

          <hr class="reg-divider">
          <p class="reg-privacy">
            <i class="fa-solid fa-lock"></i>
            Thông tin của anh được bảo mật tuyệt đối. Chúng tôi không chia sẻ dữ liệu cho bên thứ ba.
          </p>
          <p class="reg-footer">
            Đã có tài khoản? <a href="/portal.html">Đăng nhập tại đây</a>
          </p>
        </div>

        <!-- Email verification sent state -->
        <div class="reg-email-sent" id="reg-email-sent">
          <span class="email-icon">📧</span>
          <h3>Kiểm Tra Email Của Anh!</h3>
          <p>Chúng tôi đã gửi email xác nhận đến <strong id="reg-sent-email"></strong></p>
          <div class="email-hint">
            <i class="fa-solid fa-circle-info"></i>
            Bấm vào link trong email để <strong>kích hoạt tài khoản</strong> và đăng nhập vào hệ thống. Sau khi xác nhận, anh sẽ được chuyển đến trang đăng nhập tự động.
          </div>
          <p class="resend-link">
            Không thấy email? Kiểm tra Spam hoặc
            <button id="reg-resend-btn" type="button">Gửi lại</button>
          </p>
        </div>
      </div>
    </div>
    <div id="mm21-toast-container" aria-live="polite"></div>
  `);
}

// ── Toast helper ───────────────────────────────────────────────────────────
function toast(message, type = 'info', duration = 4500) {
  const icons = { info: 'fa-circle-info', success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation' };
  let container = document.getElementById('mm21-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'mm21-toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `mm21-toast ${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span></span>`;
  el.querySelector('span').textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 320);
  }, duration);
}

// ── Modal open/close ───────────────────────────────────────────────────────
function openModal() {
  const modal = document.getElementById('reg-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset to form state each time
  document.getElementById('reg-form-wrap').style.display = '';
  document.getElementById('reg-email-sent').style.display = 'none';
  document.getElementById('reg-email')?.focus();
}

function closeModal() {
  const modal = document.getElementById('reg-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Validation ─────────────────────────────────────────────────────────────
function showError(id, msg) {
  const el = document.getElementById(id);
  const input = document.getElementById(id.replace('err-', 'reg-'));
  if (el) { el.textContent = msg; el.style.display = 'block'; }
  if (input) input.classList.add('error');
}
function clearErrors() {
  document.querySelectorAll('.reg-field-error').forEach(e => { e.style.display = 'none'; e.textContent = ''; });
  document.querySelectorAll('.reg-form-group input').forEach(i => i.classList.remove('error'));
}

function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validatePhone(v) { return /^(\+?84|0)\d{9,10}$/.test(v.replace(/\s/g, '')); }

// ── Server-side Telegram notification ──────────────────────────────────────
async function notifyTelegram(account) {
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'registration',
        data: {
          name: account.name,
          email: account.email,
          phone: account.phone,
          source: account.source
        }
      })
    });
  } catch (_) { /* silent */ }
}

// ── Form submit ────────────────────────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();
  clearErrors();

  const name         = document.getElementById('reg-name').value.trim();
  const email        = document.getElementById('reg-email').value.trim().toLowerCase();
  const phone        = document.getElementById('reg-phone').value.trim();
  const password     = document.getElementById('reg-password').value;
  const emailConsent = document.getElementById('reg-email-consent').checked;

  let valid = true;
  if (!name)                    { showError('err-name', 'Vui lòng nhập họ tên.'); valid = false; }
  if (!email)                   { showError('err-email', 'Vui lòng nhập email.'); valid = false; }
  else if (!validateEmail(email)) { showError('err-email', 'Email không hợp lệ.'); valid = false; }
  if (!phone)                   { showError('err-phone', 'Vui lòng nhập số điện thoại.'); valid = false; }
  else if (!validatePhone(phone)) { showError('err-phone', 'Số điện thoại không hợp lệ (VD: 0912 345 678).'); valid = false; }
  if (!password)                { showError('err-password', 'Vui lòng nhập mật khẩu.'); valid = false; }
  else if (password.length < 6) { showError('err-password', 'Mật khẩu phải có ít nhất 6 ký tự.'); valid = false; }
  if (!valid) return;

  const submitBtn = document.getElementById('reg-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tạo...';

  const account = {
    email,
    phone: phone.replace(/\s/g, ''),
    name,
    email_consent: emailConsent,
    registeredAt: new Date().toISOString(),
    source: window.location.pathname,
  };

  // ── Supabase path ──────────────────────────────────────────────────────
  if (isSupabaseEnabled) {
    const redirectTo = `${window.location.origin}/portal.html`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          name,
          phone: account.phone,
          email_consent: emailConsent,
          source: account.source,
        },
      },
    });

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Tạo Tài Khoản';

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        showError('err-email', 'Email này đã có tài khoản. Hãy đăng nhập.');
      } else {
        toast(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
      }
      return;
    }

    // Show email-sent state
    document.getElementById('reg-sent-email').textContent = email;
    document.getElementById('reg-form-wrap').style.display = 'none';
    document.getElementById('reg-email-sent').style.display = 'block';

    // Notifications
    await notifyTelegram(account);
    if (WEBHOOK_URL) {
      try { await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(account) }); } catch (_) {}
    }
    return;
  }

  // ── localStorage fallback (no Supabase) ────────────────────────────────
  const existing = JSON.parse(localStorage.getItem(LS_ACCOUNTS) || '[]');
  if (existing.find(a => a.email === email)) {
    showError('err-email', 'Email này đã có tài khoản. Hãy đăng nhập.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Tạo Tài Khoản';
    return;
  }

  const localAccount = { ...account, password, status: 'pending' };
  existing.push(localAccount);
  localStorage.setItem(LS_ACCOUNTS, JSON.stringify(existing));
  localStorage.setItem('thuthach21ngay_user_session', JSON.stringify({ email, name, phone: account.phone }));

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Tạo Tài Khoản';

  await notifyTelegram(account);
  if (WEBHOOK_URL) {
    try { await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(account) }); } catch (_) {}
  }

  toast('Đăng ký thành công! Đang chuyển đến trang học tập...', 'success');
  setTimeout(() => { window.location.href = '/portal.html'; }, 1500);
}

// ── Resend email ───────────────────────────────────────────────────────────
async function handleResend() {
  const email = document.getElementById('reg-sent-email')?.textContent;
  if (!email || !isSupabaseEnabled) return;
  const btn = document.getElementById('reg-resend-btn');
  btn.disabled = true;
  btn.textContent = 'Đang gửi...';
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  btn.disabled = false;
  btn.textContent = 'Gửi lại';
  if (error) { toast('Không thể gửi lại. Vui lòng thử sau.', 'error'); }
  else { toast('Đã gửi lại email xác nhận!', 'success'); }
}

// ── Init ───────────────────────────────────────────────────────────────────
function init() {
  injectModal();

  document.getElementById('reg-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('reg-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('reg-modal')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.getElementById('reg-form')?.addEventListener('submit', handleSubmit);
  document.getElementById('reg-resend-btn')?.addEventListener('click', handleResend);

  // Password toggle
  document.getElementById('pw-toggle')?.addEventListener('click', () => {
    const input = document.getElementById('reg-password');
    const icon  = document.getElementById('pw-toggle-icon');
    if (input.type === 'password') {
      input.type = 'text'; icon.className = 'fa-solid fa-eye-slash';
    } else {
      input.type = 'password'; icon.className = 'fa-solid fa-eye';
    }
  });

  // Wire all elements with data-open-register
  document.querySelectorAll('[data-open-register], #register-btn-desktop, #register-btn-mobile').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  window.openRegisterModal = openModal;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { openModal as openRegisterModal, toast };
