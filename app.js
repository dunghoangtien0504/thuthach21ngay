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

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  applyEnvConfigurations();
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

// Tab Switching Routing
function setupTabSwitcher() {
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
      
      // Update screen layout for mobile viewports
      window.scrollTo(0, 0);
    });
  });

  if (btnStartCourse) {
    btnStartCourse.addEventListener('click', () => {
      // Direct user to Lessons Tab
      document.querySelector('[data-tab="lessons"]').click();
      // Select first lesson if none is selected
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
  
  // Check for watch?v= format
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    videoId = match[2];
  } else {
    // Fallback if URL is already just the ID or other formats
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
  
  // Find lesson object
  let selectedLesson = null;
  let selectedModuleTitle = "";
  
  for (const mod of courseData) {
    const found = mod.lessons.find(l => l.lesson_id === id);
    if (found) {
      selectedLesson = found;
      selectedModuleTitle = mod.module_title.split(":")[0]; // Get the "Module 1" part
      break;
    }
  }
  
  if (!selectedLesson) return;
  
  // Update Active Button in Sidebar
  document.querySelectorAll('.sidebar-lesson-btn').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.getAttribute('data-id')) === id) {
      btn.classList.add('active');
    }
  });
  
  // Display content viewport
  lessonEmptyState.style.display = 'none';
  lessonContentBox.style.display = 'block';
  
  // Update Content
  lessonModuleTag.textContent = selectedModuleTitle;
  lessonTime.textContent = selectedLesson.duration_min;
  lessonMainTitle.textContent = selectedLesson.title;
  
  // Render text content markdown using marked.js
  if (window.marked) {
    // Configure marked to render newlines as breaks
    marked.setOptions({ gfm: true, breaks: true });
    lessonBody.innerHTML = marked.parse(selectedLesson.text_content);
  } else {
    // Fallback if marked didn't load
    lessonBody.innerHTML = `<pre>${selectedLesson.text_content}</pre>`;
  }
  
  // Configure Video Player
  if (selectedLesson.type === 'video' && selectedLesson.video_url) {
    videoContainer.style.display = 'block';
    const embedUrl = getYouTubeEmbedUrl(selectedLesson.video_url);
    videoIframe.src = embedUrl;
    
    // Reset overlay
    videoOverlay.style.display = 'flex';
    videoIframe.style.display = 'none';
  } else {
    videoContainer.style.display = 'none';
    videoIframe.src = '';
  }
  
  // Update Completion button state
  updateCompletionButtonState();
  
  // Smooth scroll content area to top
  lessonViewport.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setup Video Overlay click to play
function setupInteractiveLessons() {
  videoOverlay.addEventListener('click', () => {
    videoOverlay.style.display = 'none';
    videoIframe.style.display = 'block';
    // Append autoplay flag to force playing
    if (videoIframe.src.indexOf('autoplay=1') === -1) {
      videoIframe.src += (videoIframe.src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
    }
  });
  
  // Completion Action
  btnCompleteLesson.addEventListener('click', () => {
    if (currentLessonId === null) return;
    
    const idx = completedLessons.indexOf(currentLessonId);
    if (idx === -1) {
      completedLessons.push(currentLessonId);
    } else {
      // Un-complete if clicked again
      completedLessons.splice(idx, 1);
    }
    
    localStorage.setItem('thuthach21ngay_completed_lessons', JSON.stringify(completedLessons));
    
    // Update UI components
    updateCompletionButtonState();
    renderSidebar();
    updateProgressUI();
  });
  
  // Navigation Next/Prev
  btnPrevLesson.addEventListener('click', () => {
    if (currentLessonId > 0) {
      selectLesson(currentLessonId - 1);
    }
  });
  
  btnNextLesson.addEventListener('click', () => {
    // Get flat list of lessons
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
  // Extract total days (lessons starting from Day 1 to Day 21 = 21 lessons. Day 0 is intro)
  const totalDays = 21;
  
  // Filter completed lessons: only count Day 1 to 21 for metrics
  const completedTrainingDays = completedLessons.filter(id => id >= 1 && id <= 21);
  const completedCount = completedTrainingDays.length;
  
  const percent = Math.min(100, Math.round((completedCount / totalDays) * 100));
  
  // Update header progress
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
  
  // Update dashboard stats
  if (statCompletedDays) statCompletedDays.textContent = `${completedCount}/21 ngày`;
  
  // Calculate streak (consecutive days completed up to current day)
  let streak = 0;
  for (let i = 1; i <= totalDays; i++) {
    if (completedLessons.includes(i)) {
      streak++;
    } else {
      break; // break at first incomplete day
    }
  }
  if (statStreak) statStreak.textContent = `${streak} ngày`;
  
  // Update Status Level
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
  // Load screening checklist status
  const checkedKeys = JSON.parse(localStorage.getItem('thuthach21ngay_screening')) || [];
  
  screenChecks.forEach((check, index) => {
    if (!check) return;
    
    // Set checked state from storage
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
  
  // Submit action
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
    
    // Reset form
    trackerForm.reset();
    
    // Render and notify
    renderLogsTable();
  });
  
  // Clear action
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
  
  // Sort logs by newest first
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
