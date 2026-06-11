/**
 * register.js — Registration modal for Mật Mã 21
 * Injects modal HTML, handles form submit, stores to localStorage,
 * and optionally POSTs to a CRM webhook (VITE_WEBHOOK_URL env var).
 */

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || '';
const LS_PENDING  = 'mm21_pending_registrations';
const LS_ACCOUNTS = 'mm21_accounts';

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
      .reg-form-group input {
        width: 100%; padding: 13px 16px;
        border: 1.5px solid rgba(13,43,26,0.12);
        border-radius: 10px; font-family: inherit;
        font-size: 14.5px; color: #0D2B1A;
        background: #FBF9F4; outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
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
      /* Success state */
      .reg-success {
        display: none; text-align: center; padding: 10px 0;
      }
      .reg-success i { font-size: 52px; color: #2E7D32; margin-bottom: 16px; display: block; }
      .reg-success h3 {
        font-family: 'Lora', Georgia, serif;
        font-size: 20px; color: #0D2B1A; margin-bottom: 10px;
      }
      .reg-success p { font-size: 14px; color: #485A4F; line-height: 1.6; }
      .reg-success .go-portal {
        display: inline-flex; align-items: center; gap: 8px;
        margin-top: 20px; padding: 12px 28px;
        background: #0D2B1A; color: #fff;
        border-radius: 50px; text-decoration: none;
        font-weight: 700; font-size: 14px;
        transition: background 0.2s;
      }
      .reg-success .go-portal:hover { background: #163f27; }

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
          <p class="reg-subtitle">Nhận thông tin khóa học, ưu đãi độc quyền và hỗ trợ cá nhân hoá qua email.</p>

          <form id="reg-form" novalidate>
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

            <button type="submit" class="reg-submit-btn" id="reg-submit-btn">
              <i class="fa-solid fa-user-plus"></i> Tạo Tài Khoản Miễn Phí
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

        <div class="reg-success" id="reg-success">
          <i class="fa-solid fa-circle-check"></i>
          <h3>Tài Khoản Đã Được Tạo!</h3>
          <p>Chúng tôi đã ghi nhận thông tin của anh. Kiểm tra email để nhận mã kích hoạt từ <strong>support@themencode.vn</strong>.</p>
          <a href="/portal.html" class="go-portal">
            <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập Ngay
          </a>
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
  if (!container) { container = document.createElement('div'); container.id = 'mm21-toast-container'; container.setAttribute('aria-live', 'polite'); document.body.appendChild(container); }
  const el = document.createElement('div');
  el.className = `mm21-toast ${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span></span>`;
  el.querySelector('span').textContent = message;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; el.style.transition = 'all 0.3s'; setTimeout(() => el.remove(), 320); }, duration);
}

// ── Modal open/close ───────────────────────────────────────────────────────
function openModal() {
  const modal = document.getElementById('reg-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
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

// ── Account helpers ─────────────────────────────────────────────────────────
function getLocalAccounts() {
  try { return JSON.parse(localStorage.getItem(LS_ACCOUNTS) || '[]'); } catch { return []; }
}
function saveLocalAccounts(arr) {
  localStorage.setItem(LS_ACCOUNTS, JSON.stringify(arr));
}
function getPending() {
  try { return JSON.parse(localStorage.getItem(LS_PENDING) || '[]'); } catch { return []; }
}
function savePending(arr) {
  localStorage.setItem(LS_PENDING, JSON.stringify(arr));
}

// ── Form submit ────────────────────────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();
  clearErrors();

  const email    = document.getElementById('reg-email').value.trim().toLowerCase();
  const phone    = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;

  let valid = true;
  if (!email)              { showError('err-email', 'Vui lòng nhập email.'); valid = false; }
  else if (!validateEmail(email)) { showError('err-email', 'Email không hợp lệ.'); valid = false; }
  if (!phone)              { showError('err-phone', 'Vui lòng nhập số điện thoại.'); valid = false; }
  else if (!validatePhone(phone)) { showError('err-phone', 'Số điện thoại không hợp lệ (VD: 0912 345 678).'); valid = false; }
  if (!password)           { showError('err-password', 'Vui lòng nhập mật khẩu.'); valid = false; }
  else if (password.length < 6) { showError('err-password', 'Mật khẩu phải có ít nhất 6 ký tự.'); valid = false; }
  if (!valid) return;

  // Duplicate check
  const existing = getLocalAccounts();
  if (existing.find(a => a.email === email)) {
    showError('err-email', 'Email này đã có tài khoản. Hãy đăng nhập.');
    return;
  }

  const submitBtn = document.getElementById('reg-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tạo...';

  const account = {
    email,
    password,
    phone: phone.replace(/\s/g, ''),
    name: '',
    status: 'pending',
    registeredAt: new Date().toISOString(),
    source: window.location.pathname,
  };

  // Save locally
  existing.push(account);
  saveLocalAccounts(existing);

  const pending = getPending();
  pending.push(account);
  savePending(pending);

  // Optional: POST to CRM webhook
  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: account.email,
          phone: account.phone,
          registeredAt: account.registeredAt,
          source: account.source,
        }),
      });
    } catch (_) { /* silent — webhook optional */ }
  }

  submitBtn.disabled = false;

  // Show success state
  document.getElementById('reg-form-wrap').style.display = 'none';
  document.getElementById('reg-success').style.display = 'block';
  toast('Tài khoản đã tạo thành công! Kiểm tra email để xác nhận.', 'success');
}

// ── Init ───────────────────────────────────────────────────────────────────
function init() {
  injectModal();

  // Close handlers
  document.getElementById('reg-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('reg-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('reg-modal')) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Form submit
  document.getElementById('reg-form')?.addEventListener('submit', handleSubmit);

  // Password toggle
  document.getElementById('pw-toggle')?.addEventListener('click', () => {
    const input = document.getElementById('reg-password');
    const icon  = document.getElementById('pw-toggle-icon');
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  });

  // Wire ALL elements with data-open-register or #register-btn-desktop / #register-btn-mobile
  function wireBtn(el) {
    if (!el) return;
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  }
  document.querySelectorAll('[data-open-register], #register-btn-desktop, #register-btn-mobile').forEach(wireBtn);

  // Expose globally for inline onclick usage
  window.openRegisterModal = openModal;
}

// Run after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { openModal as openRegisterModal, toast };
