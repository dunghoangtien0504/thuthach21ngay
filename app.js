// app.js - Course Learning Portal Client Logic

// Load Environment Variables using Vite's import.meta.env
const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || "Mật Mã 21 - Tái Sinh Bản Lĩnh";
const PRICE = import.meta.env.VITE_PRICE || "686.868đ";
const ZALO_PHONE = import.meta.env.VITE_ZALO_PHONE || "0377014982";
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || "support@themencode.vn";

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
const siteZaloLink = document.getElementById('site-zalo-link');

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
  
  if (siteZaloLink) {
    siteZaloLink.href = `https://zalo.me/${ZALO_PHONE}`;
    siteZaloLink.innerHTML = `<i class="fa-solid fa-comment-dots"></i> Hỗ trợ Zalo 1:1`;
  }
}

// ==========================================================================
// STUDENT AUTHENTICATION SYSTEM
// ==========================================================================
async function setupAuth() {
  // 1. Fetch server-side accounts.json
  try {
    const res = await fetch('/accounts.json');
    if (res.ok) {
      allowedAccounts = await res.json();
    }
  } catch (err) {
    console.error("Failed to load allowed accounts:", err);
  }

  // 2. Check current session
  checkSession();

  // 3. Tab switching between Login and Register
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

  // 4. Handle Login Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlerts();

      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value.trim();

      // Check server-side accounts
      let matchedUser = allowedAccounts.find(u => u.email === email && u.password === pass);

      // Check local storage accounts
      if (!matchedUser) {
        const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
        matchedUser = localUsers.find(u => u.email === email && u.password === pass);
      }

      if (matchedUser) {
        if (matchedUser.status === 'pending') {
          showAuthError(`Tài khoản của bạn chưa được kích hoạt. Vui lòng bấm liên hệ Zalo bên dưới để Admin mở khóa!`);
        } else {
          // Success login
          userSession = { email: matchedUser.email, name: matchedUser.name };
          localStorage.setItem('thuthach21ngay_user_session', JSON.stringify(userSession));
          showAuthSuccess(`Đăng nhập thành công! Đang mở khóa học...`);
          setTimeout(() => {
            checkSession();
          }, 1000);
        }
      } else {
        showAuthError(`Tài khoản hoặc mật khẩu không chính xác!`);
      }
    });
  }

  // 5. Handle Register Form Submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlerts();

      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const pass = document.getElementById('register-password').value.trim();
      const key = document.getElementById('register-key').value.trim();

      if (!name || !email || !pass) {
        showAuthError(`Vui lòng điền đầy đủ các trường thông tin bắt buộc!`);
        return;
      }

      // Check duplicates
      const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
      const dupServer = allowedAccounts.some(u => u.email === email);
      const dupLocal = localUsers.some(u => u.email === email);

      if (dupServer || dupLocal) {
        showAuthError(`Email hoặc Số điện thoại này đã được đăng ký trên hệ thống!`);
        return;
      }

      // Check Key Validation
      const generatedKeys = JSON.parse(localStorage.getItem('thuthach21ngay_generated_keys')) || [];
      const isValidKey = (key === 'MATMA21-VIP' || generatedKeys.includes(key));

      // Active immediately if key matches, otherwise wait for manual approval
      const status = isValidKey ? 'active' : 'pending';

      const newUser = { name, email, password: pass, status, key_used: key || null, date: new Date().toLocaleDateString('vi-VN') };
      localUsers.push(newUser);
      localStorage.setItem('thuthach21ngay_registered_users', JSON.stringify(localUsers));

      if (isValidKey) {
        // Mark key as consumed if it is in generated keys list
        if (generatedKeys.includes(key)) {
          const keyIdx = generatedKeys.indexOf(key);
          generatedKeys.splice(keyIdx, 1);
          localStorage.setItem('thuthach21ngay_generated_keys', JSON.stringify(generatedKeys));
        }

        // Set session
        userSession = { email, name };
        localStorage.setItem('thuthach21ngay_user_session', JSON.stringify(userSession));
        showAuthSuccess(`Đăng ký thành công & tài khoản đã được kích hoạt tự động bằng Mã khóa! Đang chuyển hướng...`);
        setTimeout(() => {
          checkSession();
        }, 1500);
      } else {
        // Pending
        const msg = `Chào Admin, tôi vừa đăng ký tài khoản Mật Mã 21: ${name} (${email}). Nhờ Admin kích hoạt giúp tôi!`;
        navigator.clipboard.writeText(msg).catch(() => {});
        
        showAuthSuccess(`Đăng ký thành công! Hãy gửi tin nhắn Zalo cho Admin để kích hoạt tài khoản của bạn. Thông tin yêu cầu đã được tự động copy.`);
        
        const supportLink = document.getElementById('auth-zalo-support');
        if (supportLink) {
          supportLink.innerHTML = `<i class="fa-solid fa-comment-dots"></i> Click để nhắn Zalo kích hoạt ngay`;
          supportLink.href = `https://zalo.me/${ZALO_PHONE}?text=${encodeURIComponent(msg)}`;
          supportLink.className = "btn btn-success btn-submit";
          supportLink.style.display = "inline-flex";
          supportLink.style.marginTop = "15px";
          supportLink.target = "_blank";
        }
      }
    });
  }

  // 6. Handle Logout Action
  if (btnLogoutAction) {
    btnLogoutAction.addEventListener('click', () => {
      if (confirm(`Bạn có muốn đăng xuất khỏi cổng học tập không?`)) {
        localStorage.removeItem('thuthach21ngay_user_session');
        userSession = null;
        checkSession();
      }
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
  const customDb = localStorage.getItem('thuthach21ngay_custom_course_db');
  if (customDb) {
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
      
      const itemEl = document.createElement('li');
      itemEl.innerHTML = `
        <button class="sidebar-lesson-btn ${currentLessonId === lesson.lesson_id ? 'active' : ''}" data-id="${lesson.lesson_id}">
          <div class="lesson-btn-content">
            <i class="fa-solid ${lesson.type === 'video' ? 'fa-video text-primary' : 'fa-file-lines text-muted'}"></i>
            <span class="lesson-btn-title">${lesson.title}</span>
          </div>
          <span class="lesson-status-icon ${isCompleted ? 'completed' : 'uncompleted'}">
            <i class="fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-circle'}"></i>
          </span>
        </button>
      `;
      
      const btn = itemEl.querySelector('button');
      btn.addEventListener('click', () => {
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
    lessonBody.innerHTML = marked.parse(selectedLesson.text_content);
  } else {
    lessonBody.innerHTML = `<pre>${selectedLesson.text_content}</pre>`;
  }
  
  if (selectedLesson.type === 'video' && selectedLesson.video_url) {
    videoContainer.style.display = 'block';
    const embedUrl = getYouTubeEmbedUrl(selectedLesson.video_url);
    videoIframe.src = embedUrl;
    
    videoOverlay.style.display = 'flex';
    videoIframe.style.display = 'none';
  } else {
    videoContainer.style.display = 'none';
    videoIframe.src = '';
  }
  
  updateCompletionButtonState();
  lessonViewport.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setup Video Overlay click to play
function setupInteractiveLessons() {
  videoOverlay.addEventListener('click', () => {
    videoOverlay.style.display = 'none';
    videoIframe.style.display = 'block';
    if (videoIframe.src.indexOf('autoplay=1') === -1) {
      videoIframe.src += (videoIframe.src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
    }
  });
  
  btnCompleteLesson.addEventListener('click', () => {
    if (currentLessonId === null) return;
    
    const idx = completedLessons.indexOf(currentLessonId);
    if (idx === -1) {
      completedLessons.push(currentLessonId);
    } else {
      completedLessons.splice(idx, 1);
    }
    
    localStorage.setItem('thuthach21ngay_completed_lessons', JSON.stringify(completedLessons));
    
    updateCompletionButtonState();
    renderSidebar();
    updateProgressUI();
  });
  
  btnPrevLesson.addEventListener('click', () => {
    if (currentLessonId > 0) {
      selectLesson(currentLessonId - 1);
    }
  });
  
  btnNextLesson.addEventListener('click', () => {
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
  
  trackerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const week = document.getElementById('log-week').value;
    const ielt = parseInt(document.getElementById('log-ielt').value);
    const control = parseInt(document.getElementById('log-control').value);
    const confidence = parseInt(document.getElementById('log-confidence').value);
    const note = document.getElementById('log-note').value;
    const date = new Date().toLocaleDateString('vi-VN');
    
    const newLog = { week, ielt, control, confidence, note, date };
    progressLogs.push(newLog);
    
    localStorage.setItem('thuthach21ngay_logs', JSON.stringify(progressLogs));
    
    trackerForm.reset();
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
    row.innerHTML = `
      <td><strong>${log.week}</strong></td>
      <td class="text-primary font-weight-bold">${log.ielt} giây</td>
      <td><span class="text-success">${log.control}/10</span></td>
      <td><span class="text-info">${log.confidence}/10</span></td>
      <td style="max-width: 250px; font-size: 13px; color: var(--text-muted);">${log.note || '-'}</td>
      <td style="font-size: 12px; color: var(--text-dimmed);">${log.date}</td>
    `;
    logsTableBody.appendChild(row);
  });
}
