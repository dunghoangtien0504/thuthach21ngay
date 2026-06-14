// app.js - Course Learning Portal Client Logic
import { supabase, isSupabaseEnabled } from './supabase.js';

// Load Config (prioritize localStorage custom config, fallback to env)
const customConfig = JSON.parse(localStorage.getItem('thuthach21ngay_custom_config')) || {};

const SITE_TITLE = customConfig.siteTitle || import.meta.env.VITE_SITE_TITLE || "Mật Mã 21 - Tái Sinh Bản Lĩnh";
const PRICE = customConfig.price || import.meta.env.VITE_PRICE || "686.868đ";
const TELEGRAM_USERNAME = customConfig.telegramUsername || import.meta.env.VITE_TELEGRAM_USERNAME || "matma21_support";
const SUPPORT_EMAIL = customConfig.supportEmail || import.meta.env.VITE_SUPPORT_EMAIL || "support@themencode.vn";

// Non-blocking toast notification (replaces alert())
function showToast(message, type = 'info', duration = 4500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const icons = {
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span></span>`;
  toast.querySelector('span').textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-leaving');
    toast.addEventListener('animationend', () => toast.remove());
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// State Management
let courseData = [];
let currentLessonId = null;
let completedLessons = JSON.parse(localStorage.getItem('thuthach21ngay_completed_lessons')) || [];
let progressLogs = JSON.parse(localStorage.getItem('thuthach21ngay_logs')) || [];

// Auth State
let userSession = JSON.parse(localStorage.getItem('thuthach21ngay_user_session')) || null;
let allowedAccounts = [];

// DOM Elements
const siteTitleTag = document.getElementById('site-title-tag');
const headerTitle = document.getElementById('header-title');
const sitePrice = document.getElementById('site-price');
const siteSupportEmail = document.getElementById('site-support-email');
const siteTelegramLink = document.getElementById('site-telegram-link');

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const statCompletedDays = document.getElementById('stat-completed-days');
const statStreak = document.getElementById('stat-streak');
const statStatus = document.getElementById('stat-status');

const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

const curriculumList = document.getElementById('curriculum-list');
const lessonViewport = document.querySelector('.lesson-viewport');
const lessonContentBox = document.getElementById('lesson-content-box');
const lessonEmptyState = document.getElementById('lesson-empty-state');

const lessonModuleTag = document.getElementById('lesson-module-tag');
const lessonMainTitle = document.getElementById('lesson-main-title');
const lessonTime = document.getElementById('lesson-time');
const lessonBody = document.getElementById('lesson-body');
const videoContainer = document.getElementById('video-container');
const videoIframe = document.getElementById('video-iframe');
const videoOverlay = document.getElementById('video-overlay');

// Interactive Player Elements
const playerTabsBar = document.getElementById('player-tabs-bar');
const btnTabVideo = document.getElementById('btn-tab-video');
const btnTabTool = document.getElementById('btn-tab-tool');
const interactiveToolContainer = document.getElementById('interactive-tool-container');

// Interactive Tool Timer State
let toolTimerInterval = null;
let toolSecondaryInterval = null;
let toolTimerSeconds = 0;
let toolTimerRunning = false;
let isSoundMuted = false;

const btnPrevLesson = document.getElementById('btn-prev-lesson');
const btnNextLesson = document.getElementById('btn-next-lesson');
const btnCompleteLesson = document.getElementById('btn-complete-lesson');
const btnStartCourse = document.getElementById('btn-start-course');

const screenChecks = [
  document.getElementById('screen-no-pain'),
  document.getElementById('screen-no-erectile'),
  document.getElementById('screen-no-spine'),
  document.getElementById('screen-commitment')
];
const screeningResult = document.getElementById('screening-result');

const trackerForm = document.getElementById('tracker-form');
const logsTableBody = document.getElementById('logs-table-body');
const btnClearLogs = document.getElementById('btn-clear-logs');

// DOM Training Log Modal Elements
const logModal = document.getElementById('log-modal');
const modalTrackerForm = document.getElementById('modal-tracker-form');
const btnCloseLogModal = document.getElementById('btn-close-log-modal');
const modalLogIelt = document.getElementById('modal-log-ielt');
const modalLogControl = document.getElementById('modal-log-control');
const modalLogConfidence = document.getElementById('modal-log-confidence');
const modalLogNote = document.getElementById('modal-log-note');
const logModalTitle = document.getElementById('log-modal-title');

// DOM Auth Elements
const authOverlay = document.getElementById('auth-overlay');
const tabLoginBtn = document.getElementById('tab-login-btn');
const tabRegisterBtn = document.getElementById('tab-register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authErrorAlert = document.getElementById('auth-error-alert');
const authSuccessAlert = document.getElementById('auth-success-alert');
const headerUserInfo = document.getElementById('header-user-info');
const userDisplayName = document.getElementById('user-display-name');
const btnLogoutAction = document.getElementById('btn-logout-action');

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  applyEnvConfigurations();
  setupAuth();
  setupTabSwitcher();
  loadCourseData();
  setupInteractiveLessons();
  setupScreeningChecklist();
  setupTracker();
  setupLogModal();
  loadFreeCourseData();
});

// Configure Site Content from .env variables
function applyEnvConfigurations() {
  siteTitleTag.textContent = SITE_TITLE;
  headerTitle.textContent = SITE_TITLE.split(" - ")[0]; // Get the "Mật Mã 21" part
  if (sitePrice) sitePrice.textContent = PRICE;
  
  if (siteSupportEmail) {
    siteSupportEmail.href = `mailto:${SUPPORT_EMAIL}`;
    siteSupportEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> ${SUPPORT_EMAIL}`;
  }
  
  if (siteTelegramLink) {
    siteTelegramLink.href = `https://t.me/${TELEGRAM_USERNAME}`;
    siteTelegramLink.innerHTML = `<i class="fa-brands fa-telegram"></i> Hỗ trợ Telegram 1:1`;
  }
}

// ==========================================================================
// STUDENT AUTHENTICATION SYSTEM
// ==========================================================================
async function setupAuth() {
  // 1. Fetch server-side accounts.json (legacy fallback)
  try {
    const res = await fetch('/accounts.json');
    if (res.ok) allowedAccounts = await res.json();
  } catch (_) {}

  // 2. Supabase: listen for auth state changes (handles email confirmation redirect)
  if (isSupabaseEnabled) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const meta = session.user.user_metadata || {};
        userSession = {
          email: session.user.email,
          name: meta.name || session.user.email,
          phone: meta.phone || '',
          supabase_id: session.user.id,
        };
        localStorage.setItem('thuthach21ngay_user_session', JSON.stringify(userSession));
        // If user just confirmed email, show a welcome toast then load portal
        if (event === 'SIGNED_IN') {
          checkSession();
        }
      } else if (event === 'SIGNED_OUT') {
        userSession = null;
        localStorage.removeItem('thuthach21ngay_user_session');
        checkSession();
      }
    });

    // Get existing Supabase session (if any)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const meta = session.user.user_metadata || {};
      userSession = {
        email: session.user.email,
        name: meta.name || session.user.email,
        phone: meta.phone || '',
        supabase_id: session.user.id,
      };
      localStorage.setItem('thuthach21ngay_user_session', JSON.stringify(userSession));
    }
  }

  // 3. Check current session (localStorage or Supabase)
  checkSession();

  // 4. Tab switching between Login and Register
  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      loginForm.style.display = 'flex';
      registerForm.style.display = 'none';
      clearAlerts();
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      registerForm.style.display = 'flex';
      loginForm.style.display = 'none';
      clearAlerts();
    });
  }

  // 5. Handle Login Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlerts();

      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const pass  = document.getElementById('login-password').value;

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Đang đăng nhập...'; }

      // ── Supabase login ────────────────────────────────────────────────
      if (isSupabaseEnabled) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Đăng Nhập'; }

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            showAuthError('Email chưa được xác nhận. Vui lòng kiểm tra hộp thư và bấm link xác nhận.');
          } else if (error.message.includes('Invalid login credentials')) {
            showAuthError('Email hoặc mật khẩu không chính xác!');
          } else {
            showAuthError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
          }
          return;
        }
        // onAuthStateChange handles session + checkSession()
        showAuthSuccess('Đăng nhập thành công! Đang mở khóa học...');
        return;
      }

      // ── localStorage fallback ─────────────────────────────────────────
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Đăng Nhập'; }
      let matchedUser = allowedAccounts.find(u => u.email === email && u.password === pass);
      if (!matchedUser) {
        const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
        matchedUser = localUsers.find(u => u.email === email && u.password === pass);
      }
      if (matchedUser) {
        userSession = { email: matchedUser.email, name: matchedUser.name, phone: matchedUser.phone || '' };
        localStorage.setItem('thuthach21ngay_user_session', JSON.stringify(userSession));
        showAuthSuccess('Đăng nhập thành công! Đang mở khóa học...');
        setTimeout(() => checkSession(), 1000);
      } else {
        showAuthError('Tài khoản hoặc mật khẩu không chính xác!');
      }
    });
  }

  // 6. Handle Register Form Submit (in-portal register tab — redirects to signup popup)
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlerts();

      const name  = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim().toLowerCase();
      const pass  = document.getElementById('register-password').value;
      const key   = document.getElementById('register-key')?.value.trim() || '';

      if (!name || !email || !pass) {
        showAuthError('Vui lòng điền đầy đủ các trường thông tin bắt buộc!');
        return;
      }

      // ── Supabase register ──────────────────────────────────────────────
      if (isSupabaseEnabled) {
        const { error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            emailRedirectTo: `${window.location.origin}/portal.html`,
            data: { name, source: window.location.pathname },
          },
        });
        if (error) {
          if (error.message.includes('already registered')) {
            showAuthError('Email này đã được đăng ký. Hãy đăng nhập.');
          } else {
            showAuthError(error.message || 'Có lỗi xảy ra. Thử lại sau.');
          }
          return;
        }
        showAuthSuccess('Đã gửi email xác nhận! Kiểm tra hộp thư và bấm link để kích hoạt tài khoản.');
        return;
      }

      // ── localStorage fallback ──────────────────────────────────────────
      const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
      if (allowedAccounts.some(u => u.email === email) || localUsers.some(u => u.email === email)) {
        showAuthError('Email này đã được đăng ký trên hệ thống!');
        return;
      }
      const generatedKeys = JSON.parse(localStorage.getItem('thuthach21ngay_generated_keys')) || [];
      const isValidKey = (key === 'MATMA21-VIP' || generatedKeys.includes(key));
      const status = isValidKey ? 'active' : 'pending';
      localUsers.push({ name, email, password: pass, status, key_used: key || null, date: new Date().toLocaleDateString('vi-VN') });
      localStorage.setItem('thuthach21ngay_registered_users', JSON.stringify(localUsers));
      userSession = { email, name, phone: '' };
      localStorage.setItem('thuthach21ngay_user_session', JSON.stringify(userSession));
      if (isValidKey && generatedKeys.includes(key)) {
        generatedKeys.splice(generatedKeys.indexOf(key), 1);
        localStorage.setItem('thuthach21ngay_generated_keys', JSON.stringify(generatedKeys));
      }
      showAuthSuccess(isValidKey
        ? 'Đăng ký thành công & tài khoản đã được kích hoạt VIP!'
        : 'Đăng ký thành công! Tài khoản đang chờ kích hoạt VIP.');
      setTimeout(() => checkSession(), 1500);
    });
  }

  // 7. Handle Logout Action
  if (btnLogoutAction) {
    btnLogoutAction.addEventListener('click', async () => {
      if (!confirm('Bạn có muốn đăng xuất khỏi cổng học tập không?')) return;
      if (isSupabaseEnabled) {
        await supabase.auth.signOut();
        // onAuthStateChange handles cleanup
      } else {
        localStorage.removeItem('thuthach21ngay_user_session');
        userSession = null;
        checkSession();
      }
    });
  }
}

let portalPollInterval = null;

function updatePaymentActivationUI() {
  const userStatus = getUserStatus();
  const paymentPanel = document.getElementById('payment-activation-panel');
  const successBanner = document.getElementById('payment-success-banner');
  const qrImg = document.getElementById('portal-qr-img');
  const descCode = document.getElementById('portal-payment-desc');
  const btnCheck = document.getElementById('btn-check-payment');
  const statusText = document.getElementById('payment-status-text');
  const btnReload = document.getElementById('btn-payment-reload');

  if (!userSession) return;

  if (userStatus === 'pending') {
    if (paymentPanel) paymentPanel.style.display = 'block';
    if (successBanner) successBanner.style.display = 'none';

    // Generate description: MA21 [cleanPhone]
    const cleanPhone = (userSession.phone || '').replace(/[^0-9]/g, '');
    const cleanEmail = (userSession.email || '').split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const identifier = cleanPhone || cleanEmail || 'USER';
    const description = `MA21 ${identifier}`.toUpperCase();

    if (descCode) descCode.textContent = description;

    // VietQR code image source link
    const encodedDesc = encodeURIComponent(description);
    const vietQrUrl = `https://img.vietqr.io/image/mb-335577357-compact2.png?amount=686868&addInfo=${encodedDesc}&accountName=HOANG%20TIEN%20DUNG`;
    if (qrImg) qrImg.src = vietQrUrl;

    // Start background polling if not already running
    if (!portalPollInterval) {
      const runPortalCheck = async () => {
        try {
          const res = await fetch(`/api/check-payment?phone=${cleanPhone}&email=${encodeURIComponent(userSession.email)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              clearInterval(portalPollInterval);
              portalPollInterval = null;

              // Activate account in thuthach21ngay_registered_users
              const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
              const uIdx = localUsers.findIndex(u => u.email === userSession.email);
              if (uIdx !== -1) {
                localUsers[uIdx].status = 'active';
                localUsers[uIdx].key_used = 'SEPAY';
                localStorage.setItem('thuthach21ngay_registered_users', JSON.stringify(localUsers));
              }

              // Update active session in memory and localStorage
              userSession.status = 'active';
              localStorage.setItem('thuthach21ngay_user_session', JSON.stringify(userSession));

              // Show success, hide pending payment panel
              if (paymentPanel) paymentPanel.style.display = 'none';
              if (successBanner) successBanner.style.display = 'block';
              
              showToast("Thanh toán thành công! Tài khoản của anh đã được nâng cấp lên VIP.", "success");
            }
          }
        } catch (err) {
          console.error("Error polling payment status in portal:", err);
        }
      };

      portalPollInterval = setInterval(runPortalCheck, 8000);
      runPortalCheck(); // check once immediately
    }

    // Manual click handler for check payment button
    if (btnCheck) {
      // Clear previous click listener if any (by replacing with clone)
      const newBtnCheck = btnCheck.cloneNode(true);
      btnCheck.parentNode.replaceChild(newBtnCheck, btnCheck);

      newBtnCheck.addEventListener('click', async () => {
        const icon = newBtnCheck.querySelector('.spinner-icon');
        if (icon) icon.classList.add('fa-spin');
        if (statusText) statusText.textContent = "Đang kiểm tra tài khoản...";

        try {
          const res = await fetch(`/api/check-payment?phone=${cleanPhone}&email=${encodeURIComponent(userSession.email)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              if (portalPollInterval) {
                clearInterval(portalPollInterval);
                portalPollInterval = null;
              }

              const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
              const uIdx = localUsers.findIndex(u => u.email === userSession.email);
              if (uIdx !== -1) {
                localUsers[uIdx].status = 'active';
                localUsers[uIdx].key_used = 'SEPAY';
                localStorage.setItem('thuthach21ngay_registered_users', JSON.stringify(localUsers));
              }

              // Update active session in memory and localStorage
              userSession.status = 'active';
              localStorage.setItem('thuthach21ngay_user_session', JSON.stringify(userSession));

              if (paymentPanel) paymentPanel.style.display = 'none';
              if (successBanner) successBanner.style.display = 'block';
              
              showToast("Thanh toán thành công! Tài khoản của anh đã được nâng cấp lên VIP.", "success");
            } else {
              showToast("Hệ thống chưa nhận được khoản chuyển khoản của anh. Vui lòng đợi thêm hoặc liên hệ hỗ trợ Telegram.", "warning");
              if (statusText) statusText.textContent = "Chưa tìm thấy giao dịch. Vui lòng quét mã QR chuyển khoản chính xác.";
            }
          }
        } catch (err) {
          console.error(err);
          showToast("Lỗi kiểm tra thanh toán. Vui lòng thử lại.", "error");
        } finally {
          if (icon) icon.classList.remove('fa-spin');
        }
      });
    }
  } else {
    // Active user
    if (paymentPanel) paymentPanel.style.display = 'none';
    if (successBanner) successBanner.style.display = 'none';
    if (portalPollInterval) {
      clearInterval(portalPollInterval);
      portalPollInterval = null;
    }
  }

  // Reload action on success banner button click
  if (btnReload) {
    // Clear previous click listener if any
    const newBtnReload = btnReload.cloneNode(true);
    btnReload.parentNode.replaceChild(newBtnReload, btnReload);
    newBtnReload.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

function checkSession() {
  const appContainer = document.querySelector('.app-container');
  if (userSession) {
    if (authOverlay) authOverlay.style.display = 'none';
    if (appContainer) appContainer.style.display = 'flex';
    if (headerUserInfo) headerUserInfo.style.display = 'flex';
    if (userDisplayName) userDisplayName.textContent = userSession.name;
    updatePaymentActivationUI();
  } else {
    if (authOverlay) authOverlay.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
    if (headerUserInfo) headerUserInfo.style.display = 'none';
  }
}

function clearAlerts() {
  if (authErrorAlert) { authErrorAlert.style.display = 'none'; authErrorAlert.textContent = ''; }
  if (authSuccessAlert) { authSuccessAlert.style.display = 'none'; authSuccessAlert.textContent = ''; }
}

function showAuthError(msg) {
  if (authErrorAlert) {
    authErrorAlert.style.display = 'block';
    authErrorAlert.textContent = msg;
  }
}

function showAuthSuccess(msg) {
  if (authSuccessAlert) {
    authSuccessAlert.style.display = 'block';
    authSuccessAlert.textContent = msg;
  }
}

// ==========================================================================
// PORTAL GENERAL TAB ROUTING
// ==========================================================================
function setupTabSwitcher() {
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
      
      window.scrollTo(0, 0);
    });
  });

  if (btnStartCourse) {
    btnStartCourse.addEventListener('click', () => {
      const lockReason = getLessonLockReason(0);
      if (lockReason) {
        if (lockReason === 'paid_only') {
          showToast(`Bài học này thuộc chương trình trả phí Mật Mã 21. Vui lòng thanh toán hoặc nhập mã kích hoạt VIP để học tiếp bài này nhé!`, 'error');
        }
        return;
      }
      document.querySelector('[data-tab="lessons"]').click();
      if (currentLessonId === null && courseData.length > 0) {
        selectLesson(0);
      }
    });
  }
}

// ==========================================================================
// COURSE METADATA & LESSONS LOADER
// ==========================================================================
async function loadCourseData() {
  let customDb = localStorage.getItem('thuthach21ngay_custom_course_db');
  if (customDb) {
    const oldSvgs = [
      "/images/glute_bridge.svg",
      "/images/sit_up.svg",
      "/images/split_table_top.svg",
      "/images/gluta_kick_back.svg",
      "/images/single_leg_stretch.svg",
      "/images/single_leg_glute_bridge.svg",
      "/images/oblique_sit_up.svg",
      "/images/single_leg_stretch_adv.svg",
      "/images/pelvic_anatomy.svg",
      "/images/coronal_squeeze.svg"
    ];
    let dbStr = customDb;
    let hasUpdated = false;
    
    oldSvgs.forEach(svg => {
      if (dbStr.includes(svg)) {
        let png = svg.replace(".svg", ".png");
        if (svg === "/images/single_leg_stretch_adv.svg") {
          png = "/images/single_leg_stretch.png";
        }
        dbStr = dbStr.split(svg).join(png);
        hasUpdated = true;
      }
    });
    
    if (hasUpdated) {
      localStorage.setItem('thuthach21ngay_custom_course_db', dbStr);
      customDb = dbStr;
    }
    
    courseData = JSON.parse(customDb);
    renderSidebar();
    updateProgressUI();
    return;
  }

  try {
    const response = await fetch('/course_curriculum_database.json');
    if (!response.ok) {
      throw new Error(`Failed to load database: ${response.status}`);
    }
    courseData = await response.json();
    renderSidebar();
    updateProgressUI();
  } catch (error) {
    console.error("Error loading curriculum database:", error);
    curriculumList.innerHTML = `<div class="text-danger" style="padding: 20px; text-align: center;">Lỗi tải giáo trình: ${error.message}</div>`;
  }
}

// Helper to convert watch URL to embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  let videoId = "";
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    videoId = match[2];
  } else {
    return url;
  }
  
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

// Render Sidebar Navigation
function renderSidebar() {
  curriculumList.innerHTML = '';
  
  courseData.forEach(mod => {
    const modEl = document.createElement('div');
    modEl.className = 'sidebar-module';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'module-title';
    titleEl.textContent = mod.module_title;
    modEl.appendChild(titleEl);
    
    const listEl = document.createElement('ul');
    listEl.className = 'module-lessons-list';
    
    mod.lessons.forEach(lesson => {
      const isCompleted = completedLessons.includes(lesson.lesson_id);
      const isUnlocked = isLessonUnlocked(lesson.lesson_id);
      
      const itemEl = document.createElement('li');
      itemEl.innerHTML = `
        <button class="sidebar-lesson-btn ${currentLessonId === lesson.lesson_id ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}" data-id="${lesson.lesson_id}">
          <div class="lesson-btn-content">
            <i class="fa-solid ${!isUnlocked ? 'fa-lock text-muted' : (lesson.type === 'video' ? 'fa-video text-primary' : 'fa-file-lines text-muted')}"></i>
            <span class="lesson-btn-title">${lesson.title}</span>
          </div>
          <span class="lesson-status-icon ${isCompleted ? 'completed' : 'uncompleted'}">
            <i class="fa-solid ${!isUnlocked ? '' : (isCompleted ? 'fa-circle-check' : 'fa-circle')}"></i>
          </span>
        </button>
      `;
      
      const btn = itemEl.querySelector('button');
      btn.addEventListener('click', (e) => {
        const lockReason = getLessonLockReason(lesson.lesson_id);
        if (lockReason) {
          e.preventDefault();
          if (lockReason === 'paid_only') {
            showToast(`Bài học này thuộc chương trình trả phí Mật Mã 21. Vui lòng thanh toán hoặc nhập mã kích hoạt VIP để học tiếp bài này nhé!`, 'error');
          } else if (typeof lockReason === 'object' && lockReason.type === 'time_locked') {
            showToast(`Bài học này đang tạm khóa. Bạn cần đợi thêm ${lockReason.remainingHours} giờ nữa để đảm bảo có đủ 24h thực hành và phục hồi nhóm cơ chậu từ bài học trước!`, 'warning');
          } else {
            showToast(`Bài học này đang bị khóa. Hãy hoàn thành bài trước đó và điền nhật ký tập luyện để mở khóa bài tiếp theo!`, 'warning');
          }
          return;
        }
        selectLesson(lesson.lesson_id);
      });
      
      listEl.appendChild(itemEl);
    });
    
    modEl.appendChild(listEl);
    curriculumList.appendChild(modEl);
  });
}

// Select a lesson to view
function selectLesson(id) {
  currentLessonId = id;
  
  // Sync tracker form defaults with selected lesson
  const logDay = document.getElementById('log-day');
  const logWeek = document.getElementById('log-week');
  if (logDay) {
    logDay.value = id.toString();
  }
  if (logWeek) {
    if (id >= 1 && id <= 7) logWeek.value = 'Tuần 1';
    else if (id >= 8 && id <= 14) logWeek.value = 'Tuần 2';
    else if (id >= 15 && id <= 21) logWeek.value = 'Tuần 3';
    else if (id === 0) logWeek.value = 'Tuần 1';
  }
  
  let selectedLesson = null;
  let selectedModuleTitle = "";
  
  for (const mod of courseData) {
    const found = mod.lessons.find(l => l.lesson_id === id);
    if (found) {
      selectedLesson = found;
      selectedModuleTitle = mod.module_title.split(":")[0];
      break;
    }
  }
  
  if (!selectedLesson) return;
  
  document.querySelectorAll('.sidebar-lesson-btn').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.getAttribute('data-id')) === id) {
      btn.classList.add('active');
    }
  });
  
  lessonEmptyState.style.display = 'none';
  lessonContentBox.style.display = 'block';
  
  lessonModuleTag.textContent = selectedModuleTitle;
  lessonTime.textContent = selectedLesson.duration_min;
  lessonMainTitle.textContent = selectedLesson.title;
  
  if (window.marked) {
    marked.setOptions({ gfm: true, breaks: true });
    const rawHtml = marked.parse(selectedLesson.text_content);
    lessonBody.innerHTML = window.DOMPurify ? DOMPurify.sanitize(rawHtml) : rawHtml;
  } else {
    lessonBody.innerHTML = `<pre>${selectedLesson.text_content}</pre>`;
  }
  
  // Clear any running timers from previous tools
  stopToolTimers();
  interactiveToolContainer.style.display = 'none';
  interactiveToolContainer.innerHTML = '';
  
  // Hide video elements completely (No Video Mode)
  playerTabsBar.style.display = 'none';
  videoContainer.style.display = 'none';
  videoIframe.src = '';
  
  const text = selectedLesson.text_content || "";
  const title = selectedLesson.title || "";
  const fullText = (title + " " + text).toLowerCase();
  
  // Decide which tool fits the lesson
  let toolType = null;
  if (selectedLesson.lesson_id > 0) {
    if (fullText.includes("4-2-6") || fullText.includes("hít vào 4") || fullText.includes("thở phế vị") || fullText.includes("thở bụng")) {
      toolType = 'breathing';
    } else if (fullText.includes("start-stop") || fullText.includes("dừng và bắt đầu") || fullText.includes("chu kỳ dừng") || fullText.includes("dừng lại")) {
      toolType = 'startstop';
    } else if (fullText.includes("ranh giới hưng phấn") || fullText.includes("thang đo 10 điểm") || fullText.includes("biểu đồ khoái cảm")) {
      toolType = 'arousal';
    } else if (fullText.includes("kegel") || fullText.includes("sàn chậu") || fullText.includes("glute bridge") || fullText.includes("sit-up") || fullText.includes("stretch") || fullText.includes("kick back") || title.includes("Cơ")) {
      toolType = 'pelvic';
    }
  }

  if (toolType) {
    interactiveToolContainer.style.display = 'block';
    initializeInteractiveTool(toolType, selectedLesson);
  } else {
    interactiveToolContainer.style.display = 'none';
  }
  
  updateCompletionButtonState();
  lessonViewport.scrollTo({ top: 0, behavior: 'smooth' });

  // On stacked mobile layout, bring the lesson content into view
  if (window.innerWidth < 992 && lessonContentBox) {
    lessonContentBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Helpers for Locked Progression & Diary Verification
function getUserStatus() {
  if (!userSession) return 'pending';
  
  // Check server-side accounts
  const serverAcc = allowedAccounts.find(u => u.email === userSession.email);
  if (serverAcc) return serverAcc.status || 'active';
  
  // Check local storage accounts
  const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
  const localAcc = localUsers.find(u => u.email === userSession.email);
  return localAcc ? (localAcc.status || 'pending') : 'pending';
}

function hasLoggedLesson(lessonId) {
  return progressLogs.some(log => log.lessonId === lessonId);
}

function getLessonLockReason(lessonId) {
  // Find current lesson detail to check if it's free
  let lesson = null;
  for (const mod of courseData) {
    const found = mod.lessons.find(l => l.lesson_id === lessonId);
    if (found) {
      lesson = found;
      break;
    }
  }

  const userStatus = getUserStatus();

  // Block pending users from accessing any lessons
  if (userStatus === 'pending') {
    return "paid_only";
  }

  // Always unlock for trial student (by email or name)
  if (userSession && (
    userSession.email === 'hocvien@thuthach21ngay.us' || 
    userSession.name === 'học viên thử nghiệm' || 
    userSession.name === 'Học Viên Thử Nghiệm'
  )) {
    return null; // Unlocked
  }
  
  if (lessonId === 0) return null; // Day 0 is always unlocked
  
  const prevLessonId = lessonId - 1;
  const prevCompleted = completedLessons.includes(prevLessonId);
  const prevLogged = prevLessonId === 0 || hasLoggedLesson(prevLessonId);
  
  if (!prevCompleted || !prevLogged) {
    return "previous_incomplete";
  }
  
  // 24 hours lock check
  const completionTimestamps = JSON.parse(localStorage.getItem('thuthach21ngay_completion_timestamps')) || {};
  const prevCompletedTime = completionTimestamps[prevLessonId];
  
  if (prevCompletedTime) {
    const elapsedMs = Date.now() - prevCompletedTime;
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (elapsedMs < oneDayMs) {
      const remainingMs = oneDayMs - elapsedMs;
      const hours = Math.ceil(remainingMs / (1000 * 60 * 60));
      return { type: "time_locked", remainingHours: hours };
    }
  }
  
  return null; // Unlocked
}

function isLessonUnlocked(lessonId) {
  return getLessonLockReason(lessonId) === null;
}

function showLogModalForCurrentLesson() {
  if (!logModal) return;
  
  let lessonTitle = "Bài học";
  for (const mod of courseData) {
    const found = mod.lessons.find(l => l.lesson_id === currentLessonId);
    if (found) {
      lessonTitle = found.title;
      break;
    }
  }
  
  if (logModalTitle) {
    logModalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square logo-icon"></i> Nhật Ký Ngày ${currentLessonId}`;
  }
  
  logModal.style.display = 'flex';
  modalTrackerForm.reset();
  if (modalLogIelt) modalLogIelt.focus();
}

function setupLogModal() {
  if (btnCloseLogModal && logModal) {
    btnCloseLogModal.addEventListener('click', () => {
      logModal.style.display = 'none';
      modalTrackerForm.reset();
    });
  }
  
  if (modalTrackerForm) {
    modalTrackerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (currentLessonId === null) return;
      
      let week = "Tuần 1";
      if (currentLessonId >= 8 && currentLessonId <= 14) week = "Tuần 2";
      else if (currentLessonId >= 15 && currentLessonId <= 21) week = "Tuần 3";
      
      const ielt = parseInt(modalLogIelt.value);
      const control = parseInt(modalLogControl.value);
      const confidence = parseInt(modalLogConfidence.value);
      const note = modalLogNote.value.trim();
      const date = new Date().toLocaleDateString('vi-VN');
      
      const newLog = { 
        lessonId: currentLessonId, 
        week, 
        ielt, 
        control, 
        confidence, 
        note, 
        date 
      };
      
      progressLogs.push(newLog);
      localStorage.setItem('thuthach21ngay_logs', JSON.stringify(progressLogs));
      
      if (!completedLessons.includes(currentLessonId)) {
        completedLessons.push(currentLessonId);
        localStorage.setItem('thuthach21ngay_completed_lessons', JSON.stringify(completedLessons));
        
        // Save completion timestamp
        const completionTimestamps = JSON.parse(localStorage.getItem('thuthach21ngay_completion_timestamps')) || {};
        completionTimestamps[currentLessonId] = Date.now();
        localStorage.setItem('thuthach21ngay_completion_timestamps', JSON.stringify(completionTimestamps));
      }
      
      logModal.style.display = 'none';
      modalTrackerForm.reset();
      
      showToast("Đã lưu nhật ký và hoàn thành bài học thành công!", 'success');
      updateCompletionButtonState();
      renderSidebar();
      updateProgressUI();
      renderLogsTable();
    });
  }
}

// Setup Practice Controls
function setupInteractiveLessons() {
  
  btnCompleteLesson.addEventListener('click', () => {
    if (currentLessonId === null) return;
    
    const completionTimestamps = JSON.parse(localStorage.getItem('thuthach21ngay_completion_timestamps')) || {};
    
    if (currentLessonId === 0) {
      const idx = completedLessons.indexOf(0);
      if (idx === -1) {
        completedLessons.push(0);
        completionTimestamps[0] = Date.now();
      } else {
        completedLessons.splice(idx, 1);
        delete completionTimestamps[0];
      }
      localStorage.setItem('thuthach21ngay_completed_lessons', JSON.stringify(completedLessons));
      localStorage.setItem('thuthach21ngay_completion_timestamps', JSON.stringify(completionTimestamps));
      updateCompletionButtonState();
      renderSidebar();
      updateProgressUI();
      return;
    }
    
    const isCompleted = completedLessons.includes(currentLessonId);
    const isLogged = hasLoggedLesson(currentLessonId);
    
    if (isCompleted) {
      const idx = completedLessons.indexOf(currentLessonId);
      completedLessons.splice(idx, 1);
      delete completionTimestamps[currentLessonId];
      localStorage.setItem('thuthach21ngay_completed_lessons', JSON.stringify(completedLessons));
      localStorage.setItem('thuthach21ngay_completion_timestamps', JSON.stringify(completionTimestamps));
      updateCompletionButtonState();
      renderSidebar();
      updateProgressUI();
    } else {
      if (!isLogged) {
        showLogModalForCurrentLesson();
      } else {
        completedLessons.push(currentLessonId);
        completionTimestamps[currentLessonId] = Date.now();
        localStorage.setItem('thuthach21ngay_completed_lessons', JSON.stringify(completedLessons));
        localStorage.setItem('thuthach21ngay_completion_timestamps', JSON.stringify(completionTimestamps));
        updateCompletionButtonState();
        renderSidebar();
        updateProgressUI();
      }
    }
  });
  
  btnPrevLesson.addEventListener('click', () => {
    if (currentLessonId > 0) {
      selectLesson(currentLessonId - 1);
    }
  });
  
  btnNextLesson.addEventListener('click', () => {
    if (currentLessonId === null) return;
    
    // Bypass validation for trial account
    const isTrialUser = userSession && userSession.email === 'hocvien@thuthach21ngay.us';
    
    if (!isTrialUser) {
      if (currentLessonId > 0) {
        const isCompleted = completedLessons.includes(currentLessonId);
        const isLogged = hasLoggedLesson(currentLessonId);
        
        if (!isCompleted || !isLogged) {
          showToast("Bạn cần hoàn thành bài học và ghi nhật ký tập luyện hôm nay trước khi chuyển sang bài học mới!", 'warning');
          if (!isLogged) {
            showLogModalForCurrentLesson();
          }
          return;
        }
      } else if (currentLessonId === 0) {
        if (!completedLessons.includes(0)) {
          showToast("Bạn cần bấm 'Đánh dấu hoàn thành' bài chuẩn bị trước khi sang bài tiếp theo!", 'warning');
          return;
        }
      }
    }
    
    const flatLessons = [];
    courseData.forEach(mod => {
      mod.lessons.forEach(l => flatLessons.push(l.lesson_id));
    });
    
    if (currentLessonId < flatLessons.length - 1) {
      selectLesson(currentLessonId + 1);
    }
  });
}

function updateCompletionButtonState() {
  const isCompleted = completedLessons.includes(currentLessonId);
  if (isCompleted) {
    btnCompleteLesson.classList.add('active');
    btnCompleteLesson.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã hoàn thành`;
  } else {
    btnCompleteLesson.classList.remove('active');
    btnCompleteLesson.innerHTML = `<i class="fa-solid fa-check"></i> Đánh dấu hoàn thành`;
  }
}

// Update Header Progress Bar and stats
function updateProgressUI() {
  const totalDays = 21;
  const completedTrainingDays = completedLessons.filter(id => id >= 1 && id <= 21);
  const completedCount = completedTrainingDays.length;
  const percent = Math.min(100, Math.round((completedCount / totalDays) * 100));
  
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
  
  if (statCompletedDays) statCompletedDays.textContent = `${completedCount}/21 ngày`;
  
  let streak = 0;
  for (let i = 1; i <= totalDays; i++) {
    if (completedLessons.includes(i)) {
      streak++;
    } else {
      break;
    }
  }
  if (statStreak) statStreak.textContent = `${streak} ngày`;
  
  let statusText = "Khởi động";
  if (percent >= 100) statusText = "Làm chủ Phản xạ";
  else if (percent >= 70) statusText = "Tái tạo Phản xạ";
  else if (percent >= 30) statusText = "Sức bền Nâng cao";
  else if (completedLessons.includes(0)) statusText = "Chuẩn bị";
  
  if (statStatus) statStatus.textContent = statusText;
}

// ==========================================================================
// SCREENING CHECKLIST PANEL
// ==========================================================================
function setupScreeningChecklist() {
  const checkedKeys = JSON.parse(localStorage.getItem('thuthach21ngay_screening')) || [];
  
  screenChecks.forEach((check, index) => {
    if (!check) return;
    
    if (checkedKeys.includes(index)) {
      check.checked = true;
    }
    
    check.addEventListener('change', () => {
      const activeChecked = [];
      screenChecks.forEach((c, idx) => {
        if (c.checked) activeChecked.push(idx);
      });
      localStorage.setItem('thuthach21ngay_screening', JSON.stringify(activeChecked));
      validateScreening();
    });
  });
  
  validateScreening();
}

function validateScreening() {
  if (!screeningResult) return;
  
  const allChecked = screenChecks.every(check => check && check.checked);
  if (allChecked) {
    screeningResult.className = "screening-alert verified";
    screeningResult.innerHTML = `<i class="fa-solid fa-circle-check"></i> Bạn đã hoàn thành sàng lọc y khoa. Lộ trình tập luyện hoàn toàn AN TOÀN cho bạn!`;
  } else {
    screeningResult.className = "screening-alert";
    screeningResult.innerHTML = `Vui lòng tích chọn đầy đủ 4 điều kiện để bắt đầu chương trình một cách an toàn.`;
  }
}

// ==========================================================================
// RESULTS TRACKER TAB
// ==========================================================================
function setupTracker() {
  if (!trackerForm) return;
  
  renderLogsTable();
  
  const logDay = document.getElementById('log-day');
  const logWeek = document.getElementById('log-week');
  
  if (logDay && logWeek) {
    logDay.addEventListener('change', () => {
      const dayVal = logDay.value;
      if (dayVal === 'Duy trì') {
        logWeek.value = 'Duy trì';
      } else {
        const dayNum = parseInt(dayVal);
        if (dayNum >= 1 && dayNum <= 7) {
          logWeek.value = 'Tuần 1';
        } else if (dayNum >= 8 && dayNum <= 14) {
          logWeek.value = 'Tuần 2';
        } else if (dayNum >= 15 && dayNum <= 21) {
          logWeek.value = 'Tuần 3';
        } else if (dayNum === 0) {
          logWeek.value = 'Tuần 1';
        }
      }
    });
  }
  
  trackerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const week = logWeek ? logWeek.value : 'Tuần 1';
    const dayVal = logDay ? logDay.value : '0';
    let targetLessonId = null;
    if (dayVal !== 'Duy trì') {
      targetLessonId = parseInt(dayVal);
    }
    
    const ielt = parseInt(document.getElementById('log-ielt').value);
    const control = parseInt(document.getElementById('log-control').value);
    const confidence = parseInt(document.getElementById('log-confidence').value);
    const note = document.getElementById('log-note').value;
    const date = new Date().toLocaleDateString('vi-VN');
    
    const newLog = { lessonId: targetLessonId, week, ielt, control, confidence, note, date };
    progressLogs.push(newLog);
    
    localStorage.setItem('thuthach21ngay_logs', JSON.stringify(progressLogs));
    
    // Also mark lesson as completed if it's a valid lesson ID (> 0)
    if (targetLessonId !== null && targetLessonId > 0 && !completedLessons.includes(targetLessonId)) {
      completedLessons.push(targetLessonId);
      localStorage.setItem('thuthach21ngay_completed_lessons', JSON.stringify(completedLessons));
      if (currentLessonId === targetLessonId) {
        updateCompletionButtonState();
      }
      renderSidebar();
      updateProgressUI();
    } else if (targetLessonId === 0 && !completedLessons.includes(0)) {
      completedLessons.push(0);
      localStorage.setItem('thuthach21ngay_completed_lessons', JSON.stringify(completedLessons));
      if (currentLessonId === 0) {
        updateCompletionButtonState();
      }
      renderSidebar();
      updateProgressUI();
    }
    
    trackerForm.reset();
    
    // Re-sync after reset
    if (logDay && currentLessonId !== null) {
      logDay.value = currentLessonId.toString();
      logDay.dispatchEvent(new Event('change'));
    }
    
    renderLogsTable();
  });
  
  if (btnClearLogs) {
    btnClearLogs.addEventListener('click', () => {
      if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử tập luyện này không?")) {
        progressLogs = [];
        localStorage.removeItem('thuthach21ngay_logs');
        renderLogsTable();
      }
    });
  }
}

function renderLogsTable() {
  if (!logsTableBody) return;
  
  logsTableBody.innerHTML = '';
  
  if (progressLogs.length === 0) {
    logsTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="6">Chưa có kết quả tập luyện được ghi nhận. Hãy lưu lượt tập đầu tiên của bạn!</td>
      </tr>
    `;
    return;
  }
  
  const reversedLogs = [...progressLogs].reverse();
  
reversedLogs.forEach(log => {
    const row = document.createElement('tr');
    
    // Format week and day details
    let phaseDisplay = log.week;
    if (log.lessonId !== undefined && log.lessonId !== null) {
      phaseDisplay += ` (Ngày ${log.lessonId})`;
    }
    
    row.innerHTML = `
      <td><strong>${phaseDisplay}</strong></td>
      <td class="text-primary font-weight-bold">${log.ielt} giây</td>
      <td><span class="text-success">${log.control}/10</span></td>
      <td><span class="text-info">${log.confidence}/10</span></td>
      <td style="max-width: 250px; font-size: 13px; color: var(--text-muted);">${log.note || '-'}</td>
      <td style="font-size: 12px; color: var(--text-dimmed);">${log.date}</td>
    `;
    logsTableBody.appendChild(row);
  });
}

/* ==========================================================================
   INTERACTIVE PRACTICE ASSISTANTS (CLINICAL BIOFEEDBACK LOGIC)
   ========================================================================== */

function stopToolTimers() {
  if (toolTimerInterval) {
    clearInterval(toolTimerInterval);
    toolTimerInterval = null;
  }
  if (toolSecondaryInterval) {
    clearInterval(toolSecondaryInterval);
    toolSecondaryInterval = null;
  }
  toolTimerRunning = false;
}

function playChime(type = 'bell') {
  if (isSoundMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'bell') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.0);
    } else if (type === 'tick') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    }
  } catch (e) {
    console.error("Audio failed", e);
  }
}

function setupSoundToggler() {
  const soundToggle = document.getElementById('tool-sound-toggle');
  if (soundToggle) {
    soundToggle.onclick = () => {
      isSoundMuted = !isSoundMuted;
      if (isSoundMuted) {
        soundToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Âm thanh: <span>TẮT</span>';
      } else {
        soundToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i> Âm thanh: <span>BẬT</span>';
        playChime('bell');
      }
    };
    if (isSoundMuted) {
      soundToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Âm thanh: <span>TẮT</span>';
    }
  }
}



function initializeInteractiveTool(toolType, lesson) {
  stopToolTimers();
  interactiveToolContainer.innerHTML = '';
  
  if (toolType === 'breathing') {
    initBreathingCoach(lesson);
  } else if (toolType === 'pelvic') {
    initPelvicCoach(lesson);
  } else if (toolType === 'arousal') {
    initArousalMeter(lesson);
  } else if (toolType === 'startstop') {
    initStartStopCoach(lesson);
  }
}

/* 1. Breathing Coach Implementation */
function initBreathingCoach(lesson) {
  interactiveToolContainer.innerHTML = `
    <div class="breathing-coach-box">
      <div class="sound-switch" id="tool-sound-toggle">
        <i class="fa-solid fa-volume-high"></i> Âm thanh: <span>BẬT</span>
      </div>
      <div class="tool-badge">Hô Hấp Đối Giao Cảm 4-2-6</div>
      
      <div class="breathing-visual-area">
        <div class="breathing-circle-outer" id="breathing-circle-outer">
          <div class="breathing-circle-inner" id="breathing-circle-inner"></div>
          <div class="breathing-text-instruction" id="breathing-state-text">BẮT ĐẦU</div>
        </div>
        <div class="breathing-timer-display" id="breathing-time-text">05:00</div>
      </div>
      
      <div class="breathing-controls">
        <button class="btn-tool primary" id="btn-breathing-start"><i class="fa-solid fa-play"></i> Bắt đầu tập</button>
        <button class="btn-tool" id="btn-breathing-reset"><i class="fa-solid fa-rotate-left"></i> Đặt lại</button>
      </div>
    </div>
  `;
  
  setupSoundToggler();
  
  const outerCircle = document.getElementById('breathing-circle-outer');
  const innerCircle = document.getElementById('breathing-circle-inner');
  const stateText = document.getElementById('breathing-state-text');
  const timeText = document.getElementById('breathing-time-text');
  const btnStart = document.getElementById('btn-breathing-start');
  const btnReset = document.getElementById('btn-breathing-reset');
  
  let elapsed = 0;
  let remainingSeconds = 300; // 5 mins
  
  function updateTimerUI() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    timeText.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  function stepBreathing() {
    if (remainingSeconds <= 0) {
      stopToolTimers();
      stateText.textContent = "HOÀN THÀNH";
      stateText.style.color = "#00ff88";
      innerCircle.style.transform = "scale(1)";
      innerCircle.style.boxShadow = "0 0 40px #00ff88";
      btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Bắt đầu';
      playChime('success');
      return;
    }
    
    remainingSeconds--;
    elapsed++;
    updateTimerUI();
    
    const cycleSec = elapsed % 12;
    
    if (cycleSec === 0) {
      // Inhale phase (4 seconds)
      stateText.textContent = "HÍT VÀO";
      stateText.style.color = "#00ff88";
      innerCircle.style.transform = "scale(1.4)";
      innerCircle.style.background = "radial-gradient(circle, #00ff88 0%, #0d2b1a 100%)";
      innerCircle.style.boxShadow = "0 0 40px #00ff88";
      playChime('bell');
    } else if (cycleSec === 4) {
      // Hold phase (2 seconds)
      stateText.textContent = "GIỮ HƠI";
      stateText.style.color = "var(--warning)";
      innerCircle.style.transform = "scale(1.4)";
      innerCircle.style.background = "radial-gradient(circle, var(--warning) 0%, #8b6508 100%)";
      innerCircle.style.boxShadow = "0 0 50px var(--warning)";
      playChime('bell');
    } else if (cycleSec === 6) {
      // Exhale phase (6 seconds)
      stateText.textContent = "THỞ RA";
      stateText.style.color = "var(--danger)";
      innerCircle.style.transform = "scale(0.85)";
      innerCircle.style.background = "radial-gradient(circle, var(--danger) 0%, #7c1a05 100%)";
      innerCircle.style.boxShadow = "0 0 30px rgba(192, 57, 14, 0.5)";
      playChime('bell');
    } else {
      playChime('tick');
    }
  }
  
  btnStart.onclick = () => {
    if (toolTimerRunning) {
      // Pause
      stopToolTimers();
      btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Tiếp tục';
    } else {
      // Start
      toolTimerRunning = true;
      btnStart.innerHTML = '<i class="fa-solid fa-pause"></i> Tạm dừng';
      stepBreathing(); // run first step instantly
      toolTimerInterval = setInterval(stepBreathing, 1000);
    }
  };
  
  btnReset.onclick = () => {
    stopToolTimers();
    elapsed = 0;
    remainingSeconds = 300;
    updateTimerUI();
    stateText.textContent = "BẮT ĐẦU";
    stateText.style.color = "#FFF";
    innerCircle.style.transform = "scale(1.0)";
    innerCircle.style.background = "radial-gradient(circle, var(--warning) 0%, #8b6508 100%)";
    innerCircle.style.boxShadow = "0 0 30px rgba(184, 134, 11, 0.6)";
    btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Bắt đầu tập';
  };
}

/* 2. Pelvic Floor Coach Implementation */
function initPelvicCoach(lesson) {
  const title = lesson.title || "";
  let exerciseMode = 'kegel'; // default
  let modelTitle = "Co Thắt Cơ Sàn Chậu";
  let description = "Hãy siết cơ sàn chậu (co cơ hậu môn/PC) và giữ, sau đó thả lỏng hoàn toàn theo nhịp đồng hồ.";
  
  if (title.includes("Glute Bridge") || title.includes("nâng hông") || title.includes("cầu mông")) {
    exerciseMode = 'bridge';
    modelTitle = "Bài Tập Glute Bridge";
    description = "Nằm ngửa gập gối, nâng cao hông tạo đường thẳng và siết chặt cơ chậu khi ở trên đỉnh.";
  } else if (title.includes("Sit-up") || title.includes("gập bụng")) {
    exerciseMode = 'situp';
    modelTitle = "Bài Tập Gập Bụng Sit-up";
    description = "Gập bụng lên 45 độ, thở ra và giải phóng (kegel ngược) hoàn toàn cơ chậu để tránh áp lực nội tạng.";
  }
  
  interactiveToolContainer.innerHTML = `
    <div class="pelvic-coach-box">
      <div class="pelvic-coach-left">
        <div class="sound-switch" id="tool-sound-toggle" style="position: static; margin-bottom: 10px;">
          <i class="fa-solid fa-volume-high"></i> Âm thanh: <span>BẬT</span>
        </div>
        <div>
          <div class="pelvic-instruction-title" id="pelvic-title-ui">${modelTitle}</div>
          <div class="pelvic-instruction-text" id="pelvic-desc-ui">${description}</div>
        </div>
        
        <div class="pelvic-progress-bar-container">
          <div class="pelvic-progress-fill" id="pelvic-progress-fill"></div>
        </div>
        
        <div class="rep-tracker">
          <div>Hiệp: <span class="rep-number" id="pelvic-set-text">1/3</span></div>
          <div>Lần lặp (Rep): <span class="rep-number" id="pelvic-rep-text">0/10</span></div>
        </div>
        
        <div class="breathing-controls" style="margin-top: 15px;">
          <button class="btn-tool primary" id="btn-pelvic-start"><i class="fa-solid fa-play"></i> Bắt đầu</button>
          <button class="btn-tool" id="btn-pelvic-reset"><i class="fa-solid fa-rotate-left"></i> Đặt lại</button>
        </div>
      </div>
      
      <div class="pelvic-coach-right">
        <div class="anatomy-visual-container">
          <svg viewBox="0 0 200 100" class="stick-figure-svg">
            <line x1="10" y1="90" x2="190" y2="90" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
            <g id="pelvic-anatomy-body">
              <circle cx="40" cy="80" r="6" fill="#FFF" id="fig-head" />
              <path d="M 40 80 L 100 80 L 140 80" stroke="#FFF" stroke-width="4" stroke-linecap="round" fill="none" id="fig-spine" />
              <path d="M 140 80 L 160 55 L 180 90" stroke="#FFF" stroke-width="4" stroke-linecap="round" fill="none" id="fig-leg" />
              <line x1="80" y1="80" x2="120" y2="90" stroke="rgba(255,255,255,0.5)" stroke-width="3" stroke-linecap="round" />
            </g>
            <ellipse cx="140" cy="80" rx="14" ry="7" fill="none" stroke="rgba(0, 255, 136, 0.2)" stroke-width="3" id="fig-pc-muscle" />
          </svg>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #FFF; text-align: center; margin-top: 10px;" id="pelvic-state-indicator">SẴN SÀNG</div>
      </div>
    </div>
  `;
  
  setupSoundToggler();
  
  const btnStart = document.getElementById('btn-pelvic-start');
  const btnReset = document.getElementById('btn-pelvic-reset');
  const fillBar = document.getElementById('pelvic-progress-fill');
  const repText = document.getElementById('pelvic-rep-text');
  const setText = document.getElementById('pelvic-set-text');
  const stateIndicator = document.getElementById('pelvic-state-indicator');
  
  // SVG points references
  const figHead = document.getElementById('fig-head');
  const figSpine = document.getElementById('fig-spine');
  const figPc = document.getElementById('fig-pc-muscle');
  
  let reps = 0;
  let sets = 1;
  let step = 0; // 0 to 9 representing a 10s cycle (5s contract, 5s relax)
  
  function updateStickFigure(isSqueezing) {
    if (isSqueezing) {
      figPc.classList.add('active-kegel-squeeze');
      figPc.style.stroke = "var(--warning)";
      if (exerciseMode === 'bridge') {
        // Move hips up
        figSpine.setAttribute('d', 'M 40 80 L 100 60 L 140 45');
        figPc.setAttribute('cx', '140');
        figPc.setAttribute('cy', '45');
      } else if (exerciseMode === 'situp') {
        // Move head/torso up
        figHead.setAttribute('cx', '70');
        figHead.setAttribute('cy', '45');
        figSpine.setAttribute('d', 'M 70 45 L 110 65 L 140 80');
      } else {
        // Standard Kegel: pulse the PC ring
        figPc.setAttribute('rx', '18');
        figPc.setAttribute('ry', '9');
      }
    } else {
      figPc.classList.remove('active-kegel-squeeze');
      figPc.style.stroke = "rgba(0, 255, 136, 0.2)";
      if (exerciseMode === 'bridge') {
        // flat spine
        figSpine.setAttribute('d', 'M 40 80 L 100 80 L 140 80');
        figPc.setAttribute('cx', '140');
        figPc.setAttribute('cy', '80');
      } else if (exerciseMode === 'situp') {
        // flat spine
        figHead.setAttribute('cx', '40');
        figHead.setAttribute('cy', '80');
        figSpine.setAttribute('d', 'M 40 80 L 100 80 L 140 80');
      } else {
        // standard size
        figPc.setAttribute('rx', '14');
        figPc.setAttribute('ry', '7');
      }
    }
  }
  
  function stepPelvic() {
    const cycleSec = step % 10;
    
    if (cycleSec < 5) {
      // Squeeze phase (5 seconds)
      const pct = ((cycleSec + 1) / 5) * 100;
      fillBar.style.width = `${pct}%`;
      fillBar.style.backgroundColor = "var(--warning)";
      stateIndicator.textContent = "SIẾT CƠ CHẬU";
      stateIndicator.style.color = "var(--warning)";
      updateStickFigure(true);
      
      if (cycleSec === 0) {
        playChime('bell');
      } else {
        playChime('tick');
      }
    } else {
      // Relax phase (5 seconds)
      const relaxSec = cycleSec - 5;
      const pct = (1 - (relaxSec + 1) / 5) * 100;
      fillBar.style.width = `${pct}%`;
      fillBar.style.backgroundColor = "rgba(255,255,255,0.2)";
      stateIndicator.textContent = "THẢ LỎNG";
      stateIndicator.style.color = "#FFF";
      updateStickFigure(false);
      
      if (cycleSec === 5) {
        playChime('bell');
      } else {
        playChime('tick');
      }
    }
    
    step++;
    
    if (step > 0 && step % 10 === 0) {
      reps++;
      repText.textContent = `${reps}/10`;
      
      if (reps >= 10) {
        reps = 0;
        repText.textContent = `0/10`;
        sets++;
        if (sets > 3) {
          stopToolTimers();
          stateIndicator.textContent = "HOÀN THÀNH";
          stateIndicator.style.color = "#00ff88";
          setText.textContent = "3/3";
          playChime('success');
          return;
        }
        setText.textContent = `${sets}/3`;
        stopToolTimers();
        btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Hiệp tiếp theo';
      }
    }
  }
  
  btnStart.onclick = () => {
    if (toolTimerRunning) {
      stopToolTimers();
      btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Tiếp tục';
    } else {
      toolTimerRunning = true;
      btnStart.innerHTML = '<i class="fa-solid fa-pause"></i> Tạm dừng';
      stepPelvic();
      toolTimerInterval = setInterval(stepPelvic, 1000);
    }
  };
  
  btnReset.onclick = () => {
    stopToolTimers();
    reps = 0;
    sets = 1;
    step = 0;
    fillBar.style.width = "0%";
    repText.textContent = "0/10";
    setText.textContent = "1/3";
    stateIndicator.textContent = "SẴN SÀNG";
    stateIndicator.style.color = "#FFF";
    updateStickFigure(false);
    btnStart.innerHTML = '<i class="fa-solid fa-play"></i> Bắt đầu';
  };
}

/* 3. Arousal Meter Implementation */
function initArousalMeter(lesson) {
  interactiveToolContainer.innerHTML = `
    <div class="arousal-meter-box">
      <div class="arousal-meter-title">BẢN ĐỒ CHẨN ĐOÁN HƯNG PHẤN & RANH GIỚI PHẢN XẠ</div>
      
      <div class="arousal-slider-container">
        <div class="arousal-labels-row" id="arousal-labels-row"></div>
        <div class="arousal-bar-track" id="arousal-bar-track">
          <div class="arousal-bar-pointer" id="arousal-bar-pointer"></div>
        </div>
      </div>
      
      <div class="arousal-info-card" id="arousal-info-card"></div>
    </div>
  `;
  
  const labelsRow = document.getElementById('arousal-labels-row');
  const pointer = document.getElementById('arousal-bar-pointer');
  const infoCard = document.getElementById('arousal-info-card');
  
  const arousalData = {
    1: { name: "Mức 1: Thư giãn hoàn toàn", zone: "safe", title: "Khởi động", state: "Cơ thể hoàn toàn thả lỏng. Không có kích thích. Dương vật xìu hoặc cương nhẹ.", action: "Bắt đầu dạo đầu, thở đều bụng tự nhiên." },
    2: { name: "Mức 2: Kích thích ban đầu", zone: "safe", title: "Cương cứng nhẹ", state: "Độ cương khoảng 40%. Xúc giác bắt đầu kích hoạt hệ thần kinh.", action: "Duy trì nhịp chạm chậm, kiểm soát tâm lý thoải mái." },
    3: { name: "Mức 3: Hưng phấn nhẹ", zone: "safe", title: "Chuẩn bị", state: "Độ cương 60%. Cảm giác ấm áp lan tỏa toàn thân.", action: "Tiếp tục nhịp thở điều hòa phế vị." },
    4: { name: "Mức 4: Vùng An toàn Cương cứng", zone: "safe", title: "Cương tối đa", state: "Đương vật đạt độ cương cứng 100%. Khoái cảm ổn định, nhịp tim tăng nhẹ.", action: "Đây là vùng tối ưu để duy trì thâm nhập lâu nhất. Tập trung thả lỏng cơ chậu." },
    5: { name: "Mức 5: Hưng phấn ổn định", zone: "safe", title: "Nhịp điệu cao", state: "Khoái cảm đạt điểm cân bằng. Cơ thể dồi dào năng lượng.", action: "Chuyển động chéo góc (Lãng tử quay đầu) để phân tán kích thích trực diện." },
    6: { name: "Mức 6: Ngưỡng ranh giới an toàn", zone: "safe", title: "Gần cảnh báo", state: "Khoái cảm tích tụ dần. Hơi thở bắt đầu gấp nhẹ.", action: "Giảm tốc độ chuyển động xuống 30% lực, hít thở sâu 4-2-6." },
    7: { name: "Mức 7: Ngưỡng Cảnh Báo Lâm Sàng", zone: "alert", title: "Phải Dừng Nhịp", state: "Cực kỳ nhạy cảm vùng đầu dương vật. Nhịp tim tăng nhanh, cơ sàn chậu có phản xạ siết cứng tự động.", action: "Dừng mọi chuyển động! Siết cơ chậu Phanh khẩn cấp 5s ngay lập tức, thả lỏng xả áp và thở 4-2-6." },
    8: { name: "Mức 8: Vùng kích hoạt phản xạ", zone: "alert", title: "Phanh khẩn cấp", state: "Cảm giác tinh dịch bắt đầu co bóp dồn dịch về túi tinh.", action: "Dừng rút ra hoặc dùng kỹ thuật Squeeze (ép gốc/ép quy đầu) ngay. Thở sâu." },
    9: { name: "Mức 9: Ngưỡng Không Thể Đảo Ngược", zone: "danger", title: "Điểm không thể dừng", state: "Phản xạ cơ học của niệu đạo đã bắt đầu co bóp. Không thể thu hồi kích thích.", action: "Quá muộn để phanh. Chuẩn bị xuất tinh. Ghi nhận thời điểm chạm mức này để căn dừng sớm hơn ở lần sau." },
    10: { name: "Mức 10: Xuất tinh & Cực khoái", zone: "danger", title: "Giải phóng", state: "Co thắt cơ sàn chậu 5-8 nhịp liên tục và phóng tinh dịch.", action: "Thả lỏng sâu cơ sàn chậu sau xuất tinh để hồi phục nhanh." }
  };
  
  // Render label numbers
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('div');
    btn.className = `arousal-label-num level-${i}`;
    btn.textContent = i;
    btn.onclick = () => selectLevel(i);
    labelsRow.appendChild(btn);
  }
  
  function selectLevel(level) {
    document.querySelectorAll('.arousal-label-num').forEach(node => {
      node.classList.remove('active');
    });
    
    const activeNode = labelsRow.children[level - 1];
    activeNode.classList.add('active');
    
    // Position pointer
    const pct = ((level - 1) / 9) * 100;
    pointer.style.left = `${pct}%`;
    
    playChime('tick');
    
    const data = arousalData[level];
    
    let zoneClass = data.zone;
    let zoneText = data.zone === 'safe' ? 'AN TOÀN (MỨC 1 - 6)' : (data.zone === 'alert' ? 'CẢNH BÁO (MỨC 7 - 8)' : 'QUÁ NGƯỠNG (MỨC 9 - 10)');
    
    infoCard.innerHTML = `
      <div class="arousal-info-header">
        <div class="arousal-info-title">${data.name}</div>
        <span class="arousal-zone-badge ${zoneClass}">${zoneText}</span>
      </div>
      <div class="arousal-info-detail">
        <p><strong>Trạng thái sinh lý:</strong> ${data.state}</p>
        <p style="color: var(--warning); font-weight: 600; margin-top: 8px;">
          <i class="fa-solid fa-circle-exclamation"></i> Hướng dẫn kỹ thuật: ${data.action}
        </p>
      </div>
    `;
  }
  
  // Default to level 5
  selectLevel(5);
}

/* 4. Start-Stop Coach Implementation */
function initStartStopCoach(lesson) {
  interactiveToolContainer.innerHTML = `
    <div class="start-stop-box">
      <div class="start-stop-left">
        <div class="sound-switch" id="tool-sound-toggle" style="position: static; margin-bottom: 5px;">
          <i class="fa-solid fa-volume-high"></i> Âm thanh: <span>BẬT</span>
        </div>
        <div>
          <div class="pelvic-instruction-title">Bộ Trợ Lý Luyện Tập Start-Stop</div>
          <div class="pelvic-instruction-text" style="margin-bottom: 15px;">Tự kích thích hoặc phối hợp đối tác. Bấm nút khi hưng phấn đạt mức 7.5 để thực hành chu kỳ dừng siết.</div>
        </div>
        
        <div class="slider-input-group">
          <div style="display:flex; justify-content:space-between; font-size:12px;">
            <span>Mức hưng phấn: <strong id="startstop-arousal-num">1.0</strong>/10</span>
            <span id="startstop-arousal-zone" class="text-success">VÙNG AN TOÀN</span>
          </div>
          <input type="range" class="arousal-range-input" id="arousal-range-input" min="1" max="9" step="0.1" value="1">
        </div>
        
        <div class="rep-tracker" style="margin-top: 15px;">
          <div>Mục tiêu: <span class="rep-number">3 - 4 chu kỳ</span></div>
          <div>Chu kỳ đã đạt: <span class="rep-number" id="startstop-cycle-count">0</span></div>
        </div>
      </div>
      
      <div class="start-stop-right" id="startstop-right-panel">
        <div class="start-stop-state-title" id="ss-state-title">KÍCH THÍCH</div>
        <div class="start-stop-state-desc" id="ss-state-desc">Hãy kích thích chậm rãi bằng tay hoặc cùng đối tác.</div>
        
        <div id="ss-animation-area" style="min-height: 120px; display: flex; align-items:center; justify-content:center;">
          <!-- Animation injected here -->
        </div>
        
        <div style="margin-top: 15px; width:100%;">
          <button class="btn-tool primary" id="btn-ss-action" style="width: 100%; justify-content:center; padding:12px;">
            ĐÃ CHẠM NGƯỠNG 7.5 (DỪNG LẠI)
          </button>
        </div>
      </div>
    </div>
  `;
  
  setupSoundToggler();
  
  const arousalInput = document.getElementById('arousal-range-input');
  const arousalNum = document.getElementById('startstop-arousal-num');
  const arousalZone = document.getElementById('startstop-arousal-zone');
  const cycleText = document.getElementById('startstop-cycle-count');
  
  const ssTitle = document.getElementById('ss-state-title');
  const ssDesc = document.getElementById('ss-state-desc');
  const ssAnimArea = document.getElementById('ss-animation-area');
  const btnAction = document.getElementById('btn-ss-action');
  
  let cycle = 0;
  let state = 'stimulation'; // 'stimulation' | 'squeeze' | 'relaxation'
  let secondsRemaining = 0;
  
  // Set stimulation default animation
  setStimulationUI();
  
  // Slow arousal auto-increase to simulate real exercise
  let arousalAutoInterval = setInterval(() => {
    if (state === 'stimulation') {
      let val = parseFloat(arousalInput.value);
      if (val < 7.5) {
        val = Math.min(7.5, val + 0.1);
        arousalInput.value = val;
        updateArousalUI(val);
      }
    }
  }, 1000);
  
  // Save interval to the global manager so it gets cleared properly
  toolSecondaryInterval = arousalAutoInterval;
  
  arousalInput.oninput = (e) => {
    if (state === 'stimulation') {
      updateArousalUI(parseFloat(e.target.value));
    }
  };
  
  function updateArousalUI(val) {
    arousalNum.textContent = val.toFixed(1);
    if (val < 7.0) {
      arousalZone.textContent = "VÙNG AN TOÀN";
      arousalZone.className = "text-success";
    } else if (val < 8.5) {
      arousalZone.textContent = "NGƯỠNG CẢNH BÁO";
      arousalZone.className = "text-warning";
    } else {
      arousalZone.textContent = "NGƯỠNG QUÁ TẢI";
      arousalZone.className = "text-danger";
    }
  }
  
  function setStimulationUI() {
    state = 'stimulation';
    arousalInput.disabled = false;
    ssTitle.textContent = "1. KÍCH THÍCH";
    ssTitle.style.color = "#FFF";
    ssDesc.textContent = "Tiến hành kích thích chậm rãi. Theo dõi cảm giác vùng đầu khấc dương vật và nhịp thở.";
    ssAnimArea.innerHTML = `
      <div style="font-size: 50px; color: #00ff88; animation: squeeze-pulse-anim 2s infinite alternate;">
        <i class="fa-solid fa-heart-pulse"></i>
      </div>
    `;
    btnAction.disabled = false;
    btnAction.textContent = "ĐÃ CHẠM NGƯỠNG 7.5 (DỪNG LẠI)";
    btnAction.className = "btn-tool primary";
  }
  
  function setSqueezeUI() {
    state = 'squeeze';
    arousalInput.disabled = true;
    arousalInput.value = 7.5;
    updateArousalUI(7.5);
    
    ssTitle.textContent = "2. DỪNG VÀ SIẾT CHẶT";
    ssTitle.style.color = "var(--danger)";
    ssDesc.textContent = "Dừng ngay mọi kích thích! Siết cơ sàn chậu 100% lực giống như bạn đang bóp phanh cơ chậu.";
    
    secondsRemaining = 5;
    ssAnimArea.innerHTML = `
      <div class="pulse-circle-squeeze" id="ss-countdown-circle">5</div>
    `;
    btnAction.disabled = true;
    btnAction.textContent = "ĐANG SIẾT PHANH CƠ CHẬU...";
    btnAction.className = "btn-tool";
    
    playChime('bell');
    
    toolTimerInterval = setInterval(() => {
      secondsRemaining--;
      const circle = document.getElementById('ss-countdown-circle');
      if (circle) circle.textContent = secondsRemaining;
      
      if (secondsRemaining <= 0) {
        clearInterval(toolTimerInterval);
        setRelaxationUI();
      } else {
        playChime('tick');
      }
    }, 1000);
  }
  
  function setRelaxationUI() {
    state = 'relaxation';
    ssTitle.textContent = "3. THẢ LỎNG SÂU";
    ssTitle.style.color = "var(--warning)";
    ssDesc.textContent = "Thả lỏng hoàn toàn cơ sàn chậu (Kegel ngược) và áp dụng nhịp thở phế vị 4-2-6 để hạ nhịp tim.";
    
    secondsRemaining = 15;
    ssAnimArea.innerHTML = `
      <div class="calm-wave-container">
        <div class="calm-wave-bar"></div>
        <div class="calm-wave-bar"></div>
        <div class="calm-wave-bar"></div>
        <div class="calm-wave-bar"></div>
        <div class="calm-wave-bar"></div>
      </div>
      <div style="font-size:24px; font-weight:700; color:var(--warning); margin-left:15px;" id="ss-relax-timer">15s</div>
    `;
    btnAction.textContent = "THƯ GIÃN SÂU HẠ NHIỆT...";
    
    playChime('bell');
    
    toolTimerInterval = setInterval(() => {
      secondsRemaining--;
      const timerVal = document.getElementById('ss-relax-timer');
      if (timerVal) timerVal.textContent = `${secondsRemaining}s`;
      
      if (secondsRemaining <= 0) {
        clearInterval(toolTimerInterval);
        cycle++;
        cycleText.textContent = cycle;
        
        if (cycle >= 4) {
          setCompletedUI();
        } else {
          arousalInput.value = 1.0;
          updateArousalUI(1.0);
          setStimulationUI();
        }
      } else {
        playChime('tick');
      }
    }, 1000);
  }
  
  function setCompletedUI() {
    state = 'completed';
    clearInterval(arousalAutoInterval);
    ssTitle.textContent = "TỐT NGHIỆP BÀI TẬP";
    ssTitle.style.color = "#00ff88";
    ssDesc.textContent = "Tuyệt vời! Bạn đã hoàn thành xuất sắc 4 chu kỳ Start-Stop thành công mà không bị xuất tinh sớm.";
    ssAnimArea.innerHTML = `
      <div style="font-size: 56px; color: var(--warning); filter: drop-shadow(0 0 10px var(--warning));">
        <i class="fa-solid fa-trophy"></i>
      </div>
    `;
    btnAction.disabled = true;
    btnAction.textContent = "ĐÃ HOÀN THÀNH 4 CHU KỲ!";
    
    playChime('success');
  }
  
  btnAction.onclick = () => {
    if (state === 'stimulation') {
      clearInterval(toolTimerInterval); // clear any simulation
      setSqueezeUI();
    }
  };
}

// ==========================================================================
// FREE COURSE — KIẾN THỨC MIỄN PHÍ
// Accessible to ALL logged-in users (including pending/unpaid accounts)
// ==========================================================================

let freeCourseData = [];
let currentFreeLessonId = null;

const freeCurriculumList = document.getElementById('free-curriculum-list');
const freeLessonContentBox = document.getElementById('free-lesson-content-box');
const freeLessonEmptyState = document.getElementById('free-lesson-empty-state');
const freeLessonModuleTag = document.getElementById('free-lesson-module-tag');
const freeLessonMainTitle = document.getElementById('free-lesson-main-title');
const freeLessonTime = document.getElementById('free-lesson-time');
const freeLessonBody = document.getElementById('free-lesson-body');
const freeBtnPrev = document.getElementById('free-btn-prev-lesson');
const freeBtnNext = document.getElementById('free-btn-next-lesson');

async function loadFreeCourseData() {
  try {
    const response = await fetch('/free_course_database.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    freeCourseData = await response.json();
    renderFreeSidebar();
  } catch (error) {
    console.error("Error loading free course database:", error);
    if (freeCurriculumList) {
      freeCurriculumList.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);">Lỗi tải nội dung: ${error.message}</div>`;
    }
  }
}

function renderFreeSidebar() {
  if (!freeCurriculumList) return;
  freeCurriculumList.innerHTML = '';

  freeCourseData.forEach(mod => {
    const modEl = document.createElement('div');
    modEl.className = 'sidebar-module';

    const titleEl = document.createElement('div');
    titleEl.className = 'module-title';
    titleEl.textContent = mod.module_title;
    modEl.appendChild(titleEl);

    const listEl = document.createElement('ul');
    listEl.className = 'module-lessons-list';

    mod.lessons.forEach(lesson => {
      const itemEl = document.createElement('li');
      itemEl.innerHTML = `
        <button class="sidebar-lesson-btn ${currentFreeLessonId === lesson.lesson_id ? 'active' : ''}" data-free-id="${lesson.lesson_id}">
          <div class="lesson-btn-content">
            <i class="fa-solid fa-file-lines text-muted"></i>
            <span class="lesson-btn-title">${lesson.title}</span>
          </div>
          <span class="lesson-status-icon uncompleted">
            <i class="fa-solid fa-circle"></i>
          </span>
        </button>
      `;

      const btn = itemEl.querySelector('button');
      btn.addEventListener('click', () => selectFreeLesson(lesson.lesson_id));
      listEl.appendChild(itemEl);
    });

    modEl.appendChild(listEl);
    freeCurriculumList.appendChild(modEl);
  });
}

function selectFreeLesson(id) {
  currentFreeLessonId = id;

  let selectedLesson = null;
  let selectedModuleTitle = '';

  for (const mod of freeCourseData) {
    const found = mod.lessons.find(l => l.lesson_id === id);
    if (found) {
      selectedLesson = found;
      selectedModuleTitle = mod.module_title.split(':')[0];
      break;
    }
  }

  if (!selectedLesson) return;

  document.querySelectorAll('[data-free-id]').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.getAttribute('data-free-id')) === id) {
      btn.classList.add('active');
    }
  });

  if (freeLessonEmptyState) freeLessonEmptyState.style.display = 'none';
  if (freeLessonContentBox) freeLessonContentBox.style.display = 'block';

  if (freeLessonModuleTag) freeLessonModuleTag.textContent = selectedModuleTitle;
  if (freeLessonTime) freeLessonTime.textContent = selectedLesson.duration_min;
  if (freeLessonMainTitle) freeLessonMainTitle.textContent = selectedLesson.title;

  if (freeLessonBody) {
    if (window.marked) {
      marked.setOptions({ gfm: true, breaks: true });
      const rawHtml = marked.parse(selectedLesson.text_content);
      freeLessonBody.innerHTML = window.DOMPurify ? DOMPurify.sanitize(rawHtml) : rawHtml;
    } else {
      freeLessonBody.innerHTML = `<pre>${selectedLesson.text_content}</pre>`;
    }
  }

  // Update prev/next buttons
  const allLessons = freeCourseData.flatMap(m => m.lessons);
  const idx = allLessons.findIndex(l => l.lesson_id === id);

  if (freeBtnPrev) freeBtnPrev.disabled = idx <= 0;
  if (freeBtnNext) freeBtnNext.disabled = idx >= allLessons.length - 1;

  const freeViewport = document.getElementById('free-lesson-viewport');
  if (freeViewport) freeViewport.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.innerWidth < 992 && freeLessonContentBox) {
    freeLessonContentBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

if (freeBtnPrev) {
  freeBtnPrev.addEventListener('click', () => {
    const allLessons = freeCourseData.flatMap(m => m.lessons);
    const idx = allLessons.findIndex(l => l.lesson_id === currentFreeLessonId);
    if (idx > 0) selectFreeLesson(allLessons[idx - 1].lesson_id);
  });
}

if (freeBtnNext) {
  freeBtnNext.addEventListener('click', () => {
    const allLessons = freeCourseData.flatMap(m => m.lessons);
    const idx = allLessons.findIndex(l => l.lesson_id === currentFreeLessonId);
    if (idx < allLessons.length - 1) selectFreeLesson(allLessons[idx + 1].lesson_id);
  });
}
