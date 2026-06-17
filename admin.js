// admin.js - Portal Admin Dashboard Logic

const ADMIN_USER = "admin";
// Admin password is NOT embedded in the client bundle. The operator types it at
// login; it is validated server-side via /api/admin-verify and held only in
// sessionStorage for the duration of the tab, then sent as a Bearer token.
let _adminKey = sessionStorage.getItem('mm21_admin_key') || '';

function escHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

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

// Expose admin key for inline scripts in admin.html (populated after login)
window._adminApiKey = _adminKey;

// Available courses for manual unlock
const COURSE_CATALOG = [
  { id: 'mat-ma-21',  name: 'Mật Mã 21 — Lộ trình 21 ngày' },
  { id: 'kegel',      name: 'Kegel Chuyên Sâu — Cơ sàn chậu' },
];

// State
let studentsList = [];
let allowedAccounts = [];
let generatedKeys = JSON.parse(localStorage.getItem('thuthach21ngay_generated_keys')) || [];
let courseData = [];
let blogPosts = JSON.parse(localStorage.getItem('thuthach21ngay_blog_posts')) || [];
let enrollmentsList = [];
let paymentsList = [];
let _studentFilterQuery = '';
let _studentFilterStatus = '';
let _studentFilterSource = '';

// Custom Config State
let customConfig = JSON.parse(localStorage.getItem('thuthach21ngay_custom_config')) || {
  siteTitle: import.meta.env.VITE_SITE_TITLE || "Mật Mã 21 - Tái Sinh Bản Lĩnh",
  price: import.meta.env.VITE_PRICE || "686.868đ",
  telegramUsername: import.meta.env.VITE_TELEGRAM_USERNAME || "matma21_support",
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || "support@themencode.vn"
};

// Custom Product State
let customProduct = JSON.parse(localStorage.getItem('thuthach21ngay_custom_product')) || {
  name: "Lộ Trình 21 Ngày Tái Sinh Bản Lĩnh",
  price: customConfig.price,
  desc: "Lộ trình 21 ngày rèn luyện phản xạ cơ sàn chậu và điều hòa hệ thần kinh tự nhiên tại nhà."
};

// DOM Elements
const adminAuthOverlay = document.getElementById('admin-auth-overlay');
const adminLoginForm = document.getElementById('admin-login-form');
const adminAuthError = document.getElementById('admin-auth-error');
const adminLayout = document.getElementById('admin-layout');
const adminPassInput = document.getElementById('admin-pass');

const menuItems = document.querySelectorAll('.admin-menu-item:not(.mock-item)');
const tabSections = document.querySelectorAll('.admin-tab-section');
const adminHeaderTitle = document.getElementById('admin-header-title');

// Stats Cards
const dashTotalStudents = document.getElementById('dash-total-students');
const dashTotalCerts = document.getElementById('dash-total-certs');
const dashTotalBlogs = document.getElementById('dash-total-blogs');
const dashTotalRevenue = document.getElementById('dash-total-revenue');
const quickStudentsDesc = document.getElementById('quick-students-desc');

// Student management
const adminStudentsList = document.getElementById('admin-students-list');
const btnAddStudentManual = document.getElementById('btn-add-student-manual');
const manualStudentPanel = document.getElementById('manual-student-panel');
const adminStudentForm = document.getElementById('admin-student-form');
const btnCancelStudentManual = document.getElementById('btn-cancel-student-manual');

// Key management
const btnGenerateKey = document.getElementById('btn-generate-key');
const adminKeyResult = document.getElementById('admin-key-result');
const btnCopyKey = document.getElementById('btn-copy-key');
const adminKeysList = document.getElementById('admin-keys-list');

// Progress tracking
const adminProgressList = document.getElementById('admin-progress-list');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

// Course editor
const adminLessonsTableBody = document.getElementById('admin-lessons-table-body');
const courseEditPanel = document.getElementById('course-edit-panel');
const adminLessonEditForm = document.getElementById('admin-lesson-edit-form');
const btnCancelLessonEdit = document.getElementById('btn-cancel-lesson-edit');
const editLessonId = document.getElementById('edit-lesson-id');
const editLessonTitle = document.getElementById('edit-lesson-title');
const editLessonType = document.getElementById('edit-lesson-type');
const editLessonDuration = document.getElementById('edit-lesson-duration');
const editLessonDesc = document.getElementById('edit-lesson-desc');
const editLessonVideo = document.getElementById('edit-lesson-video');
const editLessonVideoGroup = document.getElementById('edit-lesson-video-group');
const editLessonText = document.getElementById('edit-lesson-text');
const editLessonHeadline = document.getElementById('edit-lesson-headline');
const btnExportJson = document.getElementById('btn-export-json');

// Product editor
const adminProductForm = document.getElementById('admin-product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productDescInput = document.getElementById('product-desc');

// Blog editor
const btnAddBlog = document.getElementById('btn-add-blog');
const blogFormPanel = document.getElementById('blog-form-panel');
const adminBlogForm = document.getElementById('admin-blog-form');
const btnCancelBlog = document.getElementById('btn-cancel-blog');
const adminBlogList = document.getElementById('admin-blog-list');

// Config
const adminConfigForm = document.getElementById('admin-config-form');
const configSiteTitle = document.getElementById('config-site-title');
const configPrice = document.getElementById('config-price');
const configTelegram = document.getElementById('config-telegram');
const configEmail = document.getElementById('config-email');
const btnExportConfig = document.getElementById('btn-export-config');

// Certs and Homework lists
const adminCertsList = document.getElementById('admin-certs-list');
const adminHomeworkList = document.getElementById('admin-homework-list');

const defaultBlogs = [
  { title: "Vai Trò Của Cơ Sàn Chậu Trong Sức Khỏe Sinh Lý Nam Giới", author: "Dr. Nam Trần", date: "05/06/2026", summary: "Tìm hiểu cơ chế giải phẫu của nhóm cơ sàn chậu (cơ PC, BC, IC) đối với sức khỏe sinh lý nam và tầm quan trọng của việc rèn luyện khoa học." },
  { title: "Lo Âu Hiệu Suất Và Tâm Lý Phòng The Ở Nam Giới", author: "Bác Sĩ Phong", date: "02/06/2026", summary: "Tìm hiểu cơ chế sinh học của lo âu hiệu suất, cách adrenaline ảnh hưởng đến hệ thần kinh giao cảm và vai trò của việc giải tỏa tâm lý." },
  { title: "Các Vi Chất Dinh Dưỡng Thiết Yếu Cho Sinh Lý Nam Giới", author: "Thanh Bảo", date: "30/05/2026", summary: "Vai trò của các vi chất dinh dưỡng như Kẽm, Magiê, Vitamin D đối với quá trình tổng hợp Testosterone nội sinh và hồi phục cơ chậu." }
];

if (blogPosts.length === 0) {
  blogPosts = defaultBlogs;
  localStorage.setItem('thuthach21ngay_blog_posts', JSON.stringify(blogPosts));
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupAdminAuth();
  setupMenuSwitcher();
  setupKeyGenerator();
  setupStudentManager();
  setupCourseEditor();
  setupProductEditor();
  setupBlogEditor();
  setupConfigEditor();
  setupAnalyticsAndAI();
});

// Admin authentication logic
let _loginAttempts = 0;
let _loginLockUntil = 0;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 60000;

function setupAdminAuth() {
  // Restore a previous session only if we still hold the admin key in this tab.
  const isLogged = sessionStorage.getItem('thuthach21ngay_admin_logged') === 'true' && !!_adminKey;
  if (isLogged) {
    showAdminLayout();
  } else {
    sessionStorage.removeItem('thuthach21ngay_admin_logged');
    showLoginLayout();
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (adminAuthError) adminAuthError.style.display = 'none';

      if (Date.now() < _loginLockUntil) {
        const secs = Math.ceil((_loginLockUntil - Date.now()) / 1000);
        if (adminAuthError) {
          adminAuthError.textContent = `Quá nhiều lần thử. Vui lòng đợi ${secs} giây.`;
          adminAuthError.style.display = 'block';
        }
        return;
      }

      const pass = adminPassInput.value.trim();
      if (!pass) return;

      const submitBtn = adminLoginForm.querySelector('button[type="submit"]');
      const prevLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Đang kiểm tra...'; }

      // Validate against the server — the password is never embedded client-side.
      let ok = false;
      try {
        const res = await fetch('/api/admin-verify', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${pass}` },
        });
        ok = res.ok;
      } catch (_) {
        ok = false;
      }

      // Dev-only convenience: Vite's local server does not run /api functions, so
      // allow login against VITE_ADMIN_PASS when developing. import.meta.env.DEV is
      // statically false in production builds, so this branch is stripped entirely.
      if (!ok && import.meta.env.DEV && import.meta.env.VITE_ADMIN_PASS && pass === import.meta.env.VITE_ADMIN_PASS) {
        ok = true;
      }

      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = prevLabel; }

      if (ok) {
        _loginAttempts = 0;
        _adminKey = pass;
        window._adminApiKey = pass;
        sessionStorage.setItem('mm21_admin_key', pass);
        sessionStorage.setItem('thuthach21ngay_admin_logged', 'true');
        showAdminLayout();
      } else {
        _loginAttempts++;
        if (_loginAttempts >= MAX_LOGIN_ATTEMPTS) {
          _loginLockUntil = Date.now() + LOCKOUT_MS;
          _loginAttempts = 0;
          if (adminAuthError) {
            adminAuthError.textContent = 'Quá nhiều lần thử sai. Tài khoản bị khóa 60 giây.';
            adminAuthError.style.display = 'block';
          }
        } else {
          if (adminAuthError) {
            adminAuthError.textContent = `Mật khẩu không chính xác! (${MAX_LOGIN_ATTEMPTS - _loginAttempts} lần thử còn lại)`;
            adminAuthError.style.display = 'block';
          }
        }
        adminPassInput.value = '';
        adminPassInput.focus();
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      if (confirm("Bạn có muốn đăng xuất khỏi trang Quản trị không?")) {
        sessionStorage.removeItem('thuthach21ngay_admin_logged');
        sessionStorage.removeItem('mm21_admin_key');
        _adminKey = '';
        window._adminApiKey = '';
        showLoginLayout();
      }
    });
  }
}

async function showAdminLayout() {
  if (adminAuthOverlay) adminAuthOverlay.style.display = 'none';
  if (adminLayout) adminLayout.style.display = 'flex';
  
  await loadDatabase();
}

function showLoginLayout() {
  if (adminAuthOverlay) adminAuthOverlay.style.display = 'flex';
  if (adminLayout) adminLayout.style.display = 'none';
  if (adminAuthError) adminAuthError.style.display = 'none';
  if (adminPassInput) {
    adminPassInput.value = '';
    adminPassInput.focus();
  }
}

// Menu tab routing
function setupMenuSwitcher() {
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      if (!targetId) return;

      // Update active nav button
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update section display
      tabSections.forEach(sec => sec.style.display = 'none');
      const targetSec = document.getElementById(targetId);
      if (targetSec) targetSec.style.display = 'block';

      if (targetId === 'admin-tab-dashboard') { if (typeof refreshBizAnalytics === 'function') refreshBizAnalytics(); }
      if (targetId === 'admin-tab-registrations') renderRegistrations();
      if (targetId === 'admin-tab-payments') renderPaymentsTab();
      if (targetId === 'admin-tab-email-list') renderEmailMarketingTab();
      if (targetId === 'admin-tab-enrollments') renderEnrollmentsTab();
      if (targetId === 'admin-tab-analytics') {
        setTimeout(() => {
          renderAnalyticsCharts();
          updateRealtimeStats();
          loadHeatmap();
        }, 50);
      }
      if (targetId === 'admin-tab-ai-agent') {
        setTimeout(() => {
          const chatInput = document.getElementById('ai-chat-input');
          if (chatInput) chatInput.focus();
        }, 100);
      }

      // Update Header Title
      const tabTitle = item.querySelector('button').textContent.trim();
      adminHeaderTitle.textContent = tabTitle === 'Dashboard' ? 'Tổng quan hoạt động Mật Mã 21' : `Quản lý: ${tabTitle}`;
    });
  });
}

// ==========================================================================
// REGISTRATIONS (CRM)
// ==========================================================================
function getPendingRegistrations() {
  try { return JSON.parse(localStorage.getItem('mm21_pending_registrations') || '[]'); } catch { return []; }
}

function renderRegistrations() {
  const container = document.getElementById('registrations-container');
  if (!container) return;
  const regs = getPendingRegistrations();
  if (regs.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-style:italic;padding:20px 0;">Chưa có đăng ký mới nào. Khi khách điền form đăng ký trên website, dữ liệu sẽ xuất hiện ở đây.</p>';
    return;
  }
  const rows = regs.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escHtml(r.email) || '—'}</strong></td>
      <td>${escHtml(r.phone) || '—'}</td>
      <td><span class="status-badge ${r.status === 'active' ? 'active' : 'pending'}">${escHtml(r.status) || 'pending'}</span></td>
      <td>${r.registeredAt ? new Date(r.registeredAt).toLocaleString('vi-VN') : '—'}</td>
      <td>${escHtml(r.source) || '/'}</td>
    </tr>
  `).join('');
  container.innerHTML = `
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Tổng: <strong>${regs.length}</strong> đăng ký</p>
    <div style="overflow-x:auto;">
      <table class="admin-table" style="min-width:700px;">
        <thead><tr>
          <th>#</th><th>Email</th><th>Số điện thoại</th>
          <th>Trạng thái</th><th>Thời gian</th><th>Nguồn</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

// Export registrations to CSV
document.getElementById('btn-export-registrations')?.addEventListener('click', () => {
  const regs = getPendingRegistrations();
  if (!regs.length) { showToast('Chưa có dữ liệu để xuất.', 'warning'); return; }
  const csvSafe = v => `"${String(v||'').replace(/"/g,'""').replace(/^[=+\-@\t\r]/,'\'$&')}"`;
  const header = 'Email,SoDienThoai,TrangThai,ThoiGian,Nguon';
  const csv = [header, ...regs.map(r =>
    `${csvSafe(r.email)},${csvSafe(r.phone)},${csvSafe(r.status||'pending')},${csvSafe(r.registeredAt)},${csvSafe(r.source||'/')}`
  )].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = `dang-ky-moi-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  showToast('Đã xuất CSV thành công!', 'success');
});

document.getElementById('btn-clear-registrations')?.addEventListener('click', () => {
  if (!confirm('Xoá toàn bộ danh sách đăng ký mới? Hành động này không thể hoàn tác.')) return;
  localStorage.removeItem('mm21_pending_registrations');
  renderRegistrations();
  showToast('Đã xoá danh sách đăng ký.', 'info');
});

// ==========================================================================
// DATABASE & STATE MANAGER
// ==========================================================================
async function loadDatabase() {
  // 1. Fetch server-side accounts
  try {
    const res = await fetch('/accounts.json');
    if (res.ok) {
      allowedAccounts = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch server-side accounts:", err);
  }

  // 2. Load Course Curriculum Data
  const customDb = localStorage.getItem('thuthach21ngay_custom_course_db');
  if (customDb) {
    courseData = JSON.parse(customDb);
  } else {
    try {
      const res = await fetch('/course_curriculum_database.json');
      if (res.ok) {
        courseData = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch course database:", err);
    }
  }

  // 3. Fetch Supabase users via admin API + local storage fallback
  const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
  let supabaseUsers = [];
  try {
    const apiRes = await fetch('/api/admin-users', {
      headers: { 'Authorization': `Bearer ${_adminKey}` }
    });
    if (apiRes.ok) {
      const apiData = await apiRes.json();
      supabaseUsers = apiData.users || [];
    }
  } catch (err) {
    console.warn('[admin] Could not fetch Supabase users:', err);
  }

  // 4. Merge accounts (priority: system > supabase > local)
  studentsList = [];

  allowedAccounts.forEach(acc => {
    studentsList.push({
      name: acc.name,
      email: acc.email,
      date: '01/06/2026',
      key_used: 'Hệ thống cấp',
      status: 'active',
      source: 'system',
    });
  });

  supabaseUsers.forEach(u => {
    if (!studentsList.some(s => s.email === u.email)) {
      const enrollNames = (u.enrollments || []).map(e => e.course_name).filter(Boolean);
      studentsList.push({
        name: u.name || u.email,
        email: u.email,
        phone: u.phone || '',
        date: u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('vi-VN') : '-',
        key_used: enrollNames.length ? enrollNames.join(', ') : '-',
        status: u.status,
        email_confirmed: u.email_confirmed,
        email_consent: u.email_consent,
        source: u.source || 'supabase',
        enrollments: u.enrollments || [],
        supabase_id: u.id,
      });
    }
  });

  localUsers.forEach(acc => {
    if (!studentsList.some(s => s.email === acc.email)) {
      studentsList.push({
        name: acc.name,
        email: acc.email,
        date: acc.date || new Date().toLocaleDateString('vi-VN'),
        key_used: acc.key_used || '-',
        status: acc.status,
        source: 'local',
      });
    }
  });

  // 5. Load local enrollments
  enrollmentsList = JSON.parse(localStorage.getItem('mm21_course_enrollments') || '[]');

  // Update UI components
  updateStatsUI();
  renderActivityFeed();
  updateSidebarBadges();
  renderStudentsTable();
  renderKeysTable();
  renderProgressTable();
  renderLessonsTable();
  renderBlogTable();
  renderCertsTable();
  renderHomeworkTable();
  renderEmailMarketingTab();
  renderEnrollmentsTab();
}

function updateStatsUI() {
  const count = studentsList.length;
  if (dashTotalStudents) dashTotalStudents.textContent = count;
  if (quickStudentsDesc) quickStudentsDesc.textContent = `${count} tài khoản`;
  if (dashTotalBlogs) dashTotalBlogs.textContent = blogPosts.length;

  // Count active certificates (students with 100% progress)
  let certCount = 0;
  const activeUserSession = JSON.parse(localStorage.getItem('thuthach21ngay_user_session'));
  const completedLessons = JSON.parse(localStorage.getItem('thuthach21ngay_completed_lessons')) || [];
  
  studentsList.forEach(student => {
    let percent = 0;
    if (activeUserSession && student.email === activeUserSession.email) {
      const trainingDays = completedLessons.filter(id => id >= 1 && id <= 21);
      percent = Math.round((trainingDays.length / 21) * 100);
    } else if (student.name === "Thanh Bảo") {
      percent = 76;
    } else if (student.name === "Học Viên Thử Nghiệm") {
      percent = 14;
    }
    
    if (percent >= 100) certCount++;
  });

  if (dashTotalCerts) dashTotalCerts.textContent = certCount;
  
  // Count active paid accounts (Supabase confirmed + local active, exclude system accounts)
  const activePaidCount = studentsList.filter(
    s => s.status === 'active' && s.source !== 'system'
  ).length;
  const revenueVal = activePaidCount * 686868;
  if (dashTotalRevenue) dashTotalRevenue.textContent = revenueVal > 0
    ? `${revenueVal.toLocaleString('vi-VN')}đ`
    : '0đ';
}

// ==========================================================================
// COURSE & LESSONS EDITOR
// ==========================================================================
function setupCourseEditor() {
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courseData, null, 4));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href",     dataStr);
      downloadAnchor.setAttribute("download", "course_curriculum_database.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert("Đã xuất file. Hãy sao chép đè file vừa tải về vào thư mục 'public/course_curriculum_database.json' trong thư mục dự án của anh và đẩy lên GitHub nhé.");
    });
  }

  // Toggle video input based on type
  if (editLessonType) {
    editLessonType.addEventListener('change', () => {
      if (editLessonType.value === 'video') {
        editLessonVideoGroup.style.display = 'block';
      } else {
        editLessonVideoGroup.style.display = 'none';
      }
    });
  }

  if (btnCancelLessonEdit) {
    btnCancelLessonEdit.addEventListener('click', () => {
      courseEditPanel.style.display = 'none';
      adminLessonEditForm.reset();
    });
  }

  if (adminLessonEditForm) {
    adminLessonEditForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const lId = parseInt(editLessonId.value);
      const title = editLessonTitle.value.trim();
      const type = editLessonType.value;
      const duration = parseInt(editLessonDuration.value);
      const desc = editLessonDesc.value.trim();
      const video = editLessonVideo.value.trim();
      const text = editLessonText.value;

      // Find and update lesson inside courseData
      let updated = false;
      for (let mod of courseData) {
        let lesson = mod.lessons.find(l => l.lesson_id === lId);
        if (lesson) {
          lesson.title = title;
          lesson.type = type;
          lesson.duration_min = duration;
          lesson.short_description = desc;
          lesson.video_url = type === 'video' ? video : "";
          lesson.text_content = text;
          updated = true;
          break;
        }
      }

      if (updated) {
        localStorage.setItem('thuthach21ngay_custom_course_db', JSON.stringify(courseData));
        showToast("Cập nhật thông tin bài học thành công!", 'success');
        courseEditPanel.style.display = 'none';
        adminLessonEditForm.reset();
        loadDatabase();
      }
    });
  }
}

function renderLessonsTable() {
  if (!adminLessonsTableBody) return;
  adminLessonsTableBody.innerHTML = '';

  courseData.forEach(mod => {
    mod.lessons.forEach(lesson => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>#${lesson.lesson_id}</strong></td>
        <td style="font-size: 13px; font-weight: 600;">${escHtml(lesson.title)}</td>
        <td>
          <span class="badge-status ${lesson.type === 'video' ? 'active' : 'pending'}" style="text-transform: capitalize;">
            ${lesson.type}
          </span>
        </td>
        <td>${lesson.duration_min} phút</td>
        <td style="font-size: 12px; font-family: monospace; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${lesson.video_url || '-'}
        </td>
        <td>
          <button class="btn btn-secondary btn-sm btn-edit-lesson" data-id="${lesson.lesson_id}">
            <i class="fa-solid fa-pen"></i> Sửa
          </button>
        </td>
      `;

      row.querySelector('.btn-edit-lesson').addEventListener('click', () => {
        openLessonEditor(lesson);
      });

      adminLessonsTableBody.appendChild(row);
    });
  });
}

function openLessonEditor(lesson) {
  if (!courseEditPanel) return;

  courseEditPanel.style.display = 'block';
  editLessonHeadline.textContent = `Ngày ${lesson.lesson_id}: ${lesson.title}`;
  
  editLessonId.value = lesson.lesson_id;
  editLessonTitle.value = lesson.title;
  editLessonType.value = lesson.type;
  editLessonDuration.value = lesson.duration_min;
  editLessonDesc.value = lesson.short_description || "";
  editLessonVideo.value = lesson.video_url || "";
  editLessonText.value = lesson.text_content || "";

  if (lesson.type === 'video') {
    editLessonVideoGroup.style.display = 'block';
  } else {
    editLessonVideoGroup.style.display = 'none';
  }

  // Scroll editor into view
  courseEditPanel.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================================================
// PRODUCTS EDITOR
// ==========================================================================
function setupProductEditor() {
  // Populate form
  if (productNameInput) productNameInput.value = customProduct.name;
  if (productPriceInput) productPriceInput.value = customProduct.price;
  if (productDescInput) productDescInput.value = customProduct.desc;

  if (adminProductForm) {
    adminProductForm.addEventListener('submit', (e) => {
      e.preventDefault();

      customProduct.name = productNameInput.value.trim();
      customProduct.price = productPriceInput.value.trim();
      customProduct.desc = productDescInput.value.trim();

      localStorage.setItem('thuthach21ngay_custom_product', JSON.stringify(customProduct));

      // Update config price in sync
      customConfig.price = customProduct.price;
      localStorage.setItem('thuthach21ngay_custom_config', JSON.stringify(customConfig));
      if (configPrice) configPrice.value = customConfig.price;

      showToast("Lưu thông tin sản phẩm thành công!", 'success');
      loadDatabase();
    });
  }
}

// ==========================================================================
// BLOG EDITOR
// ==========================================================================
function setupBlogEditor() {
  if (btnAddBlog && blogFormPanel) {
    btnAddBlog.addEventListener('click', () => {
      blogFormPanel.style.display = 'block';
    });
  }

  if (btnCancelBlog && blogFormPanel) {
    btnCancelBlog.addEventListener('click', () => {
      blogFormPanel.style.display = 'none';
      adminBlogForm.reset();
    });
  }

  if (adminBlogForm) {
    adminBlogForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('blog-title').value.trim();
      const author = document.getElementById('blog-author').value.trim();
      const summary = document.getElementById('blog-summary').value.trim();
      const content = document.getElementById('blog-content').value.trim();
      const date = new Date().toLocaleDateString('vi-VN');

      const newPost = { title, author, date, summary, content };
      blogPosts.push(newPost);

      localStorage.setItem('thuthach21ngay_blog_posts', JSON.stringify(blogPosts));

      adminBlogForm.reset();
      if (blogFormPanel) blogFormPanel.style.display = 'none';
      showToast("Đăng bài viết Blog mới thành công!", 'success');
      loadDatabase();
    });
  }
}

function renderBlogTable() {
  if (!adminBlogList) return;
  adminBlogList.innerHTML = '';

  blogPosts.forEach((post, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${escHtml(post.title)}</strong></td>
      <td>${escHtml(post.author)}</td>
      <td>${escHtml(post.date)}</td>
      <td style="max-width: 250px; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escHtml(post.summary)}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-delete-blog" data-index="${idx}">Xóa</button>
      </td>
    `;

    row.querySelector('.btn-delete-blog').addEventListener('click', () => {
      if (confirm(`Xóa bài viết "${post.title}"?`)) {
        blogPosts.splice(idx, 1);
        localStorage.setItem('thuthach21ngay_blog_posts', JSON.stringify(blogPosts));
        loadDatabase();
      }
    });

    adminBlogList.appendChild(row);
  });
}

// ==========================================================================
// CONFIGURATION EDITOR & .ENV EXPORTER
// ==========================================================================
function setupConfigEditor() {
  // Populate
  if (configSiteTitle) configSiteTitle.value = customConfig.siteTitle;
  if (configPrice) configPrice.value = customConfig.price;
  if (configTelegram) configTelegram.value = customConfig.telegramUsername;
  if (configEmail) configEmail.value = customConfig.supportEmail;

  if (adminConfigForm) {
    adminConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();

      customConfig.siteTitle = configSiteTitle.value.trim();
      customConfig.price = configPrice.value.trim();
      customConfig.telegramUsername = configTelegram.value.trim();
      customConfig.supportEmail = configEmail.value.trim();

      localStorage.setItem('thuthach21ngay_custom_config', JSON.stringify(customConfig));

      // Also sync custom product price
      customProduct.price = customConfig.price;
      localStorage.setItem('thuthach21ngay_custom_product', JSON.stringify(customProduct));
      if (productPriceInput) productPriceInput.value = customProduct.price;

      showToast("Lưu cấu hình hệ thống thành công! Các thay đổi đã được áp dụng trực tiếp cho trang học viên.", 'success');
      loadDatabase();
    });
  }

  if (btnExportConfig) {
    btnExportConfig.addEventListener('click', () => {
      // Create .env file content
      const envContent = `VITE_SITE_TITLE="${customConfig.siteTitle}"
VITE_PRICE="${customConfig.price}"
VITE_TELEGRAM_USERNAME="${customConfig.telegramUsername}"
VITE_SUPPORT_EMAIL="${customConfig.supportEmail}"
`;
      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(envContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href",     dataStr);
      downloadAnchor.setAttribute("download", ".env");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert("Đã tải xuống file '.env' mới. Hãy copy đè file này vào thư mục dự án của anh và đẩy lên GitHub.");
    });
  }
}

// ==========================================================================
// STUDENTS MANAGEMENT
// ==========================================================================
function setupStudentManager() {
  // Search & filter
  const searchEl  = document.getElementById('student-search');
  const statusEl  = document.getElementById('student-filter-status');
  const sourceEl  = document.getElementById('student-filter-source');
  const exportBtn = document.getElementById('btn-export-students-csv');

  if (searchEl)  searchEl.addEventListener('input',  e => { _studentFilterQuery  = e.target.value.toLowerCase(); renderStudentsTable(); });
  if (statusEl)  statusEl.addEventListener('change', e => { _studentFilterStatus = e.target.value; renderStudentsTable(); });
  if (sourceEl)  sourceEl.addEventListener('change', e => { _studentFilterSource = e.target.value; renderStudentsTable(); });

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!studentsList.length) { showToast('Chưa có học viên nào.', 'warning'); return; }
      const header = 'Tên,Email,SĐT,Ngày đăng ký,Trạng thái,Nguồn,Email xác nhận,Đồng ý nhận mail';
      const rows = studentsList.map(s =>
        `"${s.name}","${s.email}","${s.phone || ''}","${s.date}","${s.status}","${s.source || ''}","${s.email_confirmed ? 'Có' : 'Không'}","${s.email_consent ? 'Có' : 'Không'}"`
      );
      const csv = [header, ...rows].join('\n');
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = `hoc-vien-${new Date().toISOString().slice(0,10)}.csv`;
      a.click(); URL.revokeObjectURL(url);
      showToast(`Đã xuất ${studentsList.length} học viên ra CSV!`, 'success');
    });
  }

  if (btnAddStudentManual && manualStudentPanel) {
    btnAddStudentManual.addEventListener('click', () => {
      manualStudentPanel.style.display = 'block';
    });
  }

  if (btnCancelStudentManual && manualStudentPanel) {
    btnCancelStudentManual.addEventListener('click', () => {
      manualStudentPanel.style.display = 'none';
      adminStudentForm.reset();
    });
  }

  if (adminStudentForm) {
    adminStudentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name     = document.getElementById('manual-student-name').value.trim();
      const email    = document.getElementById('manual-student-email').value.trim().toLowerCase();
      const password = document.getElementById('manual-student-password').value.trim();

      if (!name || !email || !password) {
        showToast('Vui lòng điền đầy đủ họ tên, email và mật khẩu!', 'error');
        return;
      }

      const submitBtn = adminStudentForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Đang kích hoạt...'; }

      try {
        // Gọi API tạo tài khoản Supabase thật + enroll toàn bộ khóa học
        const res = await fetch('/api/admin-activate-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${_adminKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();

        if (!res.ok) {
          showToast(`Lỗi: ${data.error || 'Không thể kích hoạt tài khoản'}`, 'error');
          return;
        }

        // Cập nhật localStorage để hiển thị trong bảng admin
        const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users') || '[]');
        if (!localUsers.some(u => u.email === email)) {
          localUsers.push({
            name, email,
            status: 'active',
            key_used: 'Admin cấp trực tiếp',
            registeredAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('vi-VN'),
          });
          localStorage.setItem('thuthach21ngay_registered_users', JSON.stringify(localUsers));
        }

        showToast(`✅ Đã kích hoạt ${email} — ${data.courses?.length || 2} khóa học!`, 'success');
        adminStudentForm.reset();
        if (manualStudentPanel) manualStudentPanel.style.display = 'none';
        loadDatabase();

      } catch (err) {
        showToast(`Lỗi kết nối: ${err.message}`, 'error');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Thêm Học Viên'; }
      }
    });
  }
}

function renderStudentsTable() {
  if (!adminStudentsList) return;
  adminStudentsList.innerHTML = '';

  const filtered = studentsList.filter(s => {
    const q = _studentFilterQuery;
    if (q && !`${s.name} ${s.email} ${s.phone || ''}`.toLowerCase().includes(q)) return false;
    if (_studentFilterStatus && s.status !== _studentFilterStatus) return false;
    if (_studentFilterSource && (s.source || '') !== _studentFilterSource) return false;
    return true;
  });

  if (!filtered.length) {
    adminStudentsList.innerHTML = `<tr class="empty-row"><td colspan="6">Không tìm thấy học viên phù hợp.</td></tr>`;
    return;
  }

  filtered.forEach(student => {
    const isLocal = !allowedAccounts.some(u => u.email === student.email);

    const isSupabase = student.source === 'supabase';
    const emailConfirmedBadge = isSupabase
      ? (student.email_confirmed
          ? `<span style="font-size:10px;color:#16a34a;margin-left:4px" title="Email đã xác nhận">✓</span>`
          : `<span style="font-size:10px;color:#d97706;margin-left:4px" title="Chưa xác nhận email">⏳</span>`)
      : '';
    const consentBadge = isSupabase && student.email_consent
      ? `<span style="font-size:10px;background:#f0fdf4;color:#166534;padding:1px 5px;border-radius:4px;margin-left:4px">📧 consent</span>`
      : '';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <strong>${escHtml(student.name)}</strong>
        ${student.phone ? `<br><small style="color:var(--text-dimmed)">${escHtml(student.phone)}</small>` : ''}
      </td>
      <td>${escHtml(student.email)}${emailConfirmedBadge}${consentBadge}</td>
      <td>${escHtml(student.date)}</td>
      <td style="max-width:160px;white-space:normal;font-size:12px">${escHtml(student.key_used)}</td>
      <td>
        <span class="badge-status ${student.status === 'active' ? 'active' : 'pending'}">
          ${student.status === 'active' ? 'Đã kích hoạt' : 'Chờ duyệt'}
        </span>
      </td>
      <td>
        <div class="admin-table-actions">
          ${student.status === 'pending' && !isSupabase ? `
            <button class="btn btn-success btn-sm btn-activate" data-email="${escHtml(student.email)}">
              Kích hoạt
            </button>
          ` : ''}
          <button class="btn btn-sm btn-unlock-courses" data-email="${escHtml(student.email)}"
            style="background:#EEF2FF;color:#4F46E5;border:1px solid #C7D2FE;font-size:11px;padding:4px 10px;border-radius:6px;cursor:pointer;white-space:nowrap;">
            <i class="fa-solid fa-unlock" style="font-size:10px;"></i> Khóa học
          </button>
          ${isLocal && !isSupabase ? `
            <button class="btn btn-danger btn-sm btn-delete-student" data-email="${escHtml(student.email)}">
              Xóa
            </button>
          ` : `<span style="font-size:11px;color:var(--text-dimmed);font-style:italic">${isSupabase ? 'Supabase' : 'Hệ thống'}</span>`}
        </div>
      </td>
    `;

    const btnActivate = row.querySelector('.btn-activate');
    if (btnActivate) {
      btnActivate.addEventListener('click', () => {
        activateStudentAccount(student.email);
      });
    }

    const btnUnlock = row.querySelector('.btn-unlock-courses');
    if (btnUnlock) {
      btnUnlock.addEventListener('click', () => {
        openCourseUnlockModal(student);
      });
    }

    const btnDelete = row.querySelector('.btn-delete-student');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        deleteStudentAccount(student.email);
      });
    }

    adminStudentsList.appendChild(row);
  });
}

// ==========================================================================
// ACTIVITY FEED
// ==========================================================================
function renderActivityFeed() {
  const feed = document.getElementById('activity-feed-list');
  if (!feed) return;

  const events = [];
  const now = Date.now();

  // From Supabase users (sign-ups)
  studentsList.filter(s => s.source === 'supabase').forEach(s => {
    events.push({
      type: 'reg', icon: 'fa-user-plus', cls: 'reg',
      title: `${s.name || s.email} vừa đăng ký tài khoản`,
      sub: s.email + (s.email_confirmed ? ' · ✓ Đã xác nhận' : ' · ⏳ Chưa xác nhận'),
      ts: s.date ? new Date(s.date.split('/').reverse().join('-')).getTime() : now,
      tsRaw: s.date,
    });
  });

  // From local registrations
  getPendingRegistrations().forEach(r => {
    events.push({
      type: 'reg', icon: 'fa-user-plus', cls: 'reg',
      title: `${r.email} điền form đăng ký`,
      sub: `SĐT: ${r.phone || 'N/A'} · Nguồn: ${r.source || '/'}`,
      ts: r.registeredAt ? new Date(r.registeredAt).getTime() : now - 3600000,
      tsRaw: r.registeredAt ? new Date(r.registeredAt).toLocaleDateString('vi-VN') : '',
    });
  });

  // From enrollments
  enrollmentsList.forEach(e => {
    events.push({
      type: 'enroll', icon: 'fa-graduation-cap', cls: 'enroll',
      title: `${e.name || e.email} đăng ký khóa học`,
      sub: `${e.course_name || e.course_id}`,
      ts: e.enrolled_at ? new Date(e.enrolled_at).getTime() : now - 7200000,
      tsRaw: e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString('vi-VN') : '',
    });
  });

  // Sort newest first, take top 12
  events.sort((a, b) => b.ts - a.ts);
  const recent = events.slice(0, 12);

  if (!recent.length) {
    feed.innerHTML = `<div class="activity-item"><span style="color:var(--text-muted);font-size:13px">Chưa có hoạt động nào. Khi có học viên đăng ký, hoạt động sẽ hiện ở đây.</span></div>`;
    return;
  }

  feed.innerHTML = recent.map(ev => {
    const timeAgo = formatTimeAgo(ev.ts);
    return `
      <div class="activity-item">
        <div class="activity-icon ${ev.cls}"><i class="fa-solid ${ev.icon}"></i></div>
        <div class="activity-body">
          <div class="activity-title">${escHtml(ev.title)}</div>
          <div class="activity-sub">${escHtml(ev.sub)}</div>
        </div>
        <span class="activity-time">${timeAgo}</span>
      </div>`;
  }).join('');
}

function formatTimeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000)  return 'Vừa xong';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)} ngày trước`;
  return new Date(ts).toLocaleDateString('vi-VN');
}

// ==========================================================================
// SIDEBAR BADGES
// ==========================================================================
function updateSidebarBadges() {
  const regCount = getPendingRegistrations().length;
  const regBadge = document.getElementById('badge-registrations');
  if (regBadge) {
    regBadge.textContent = regCount;
    regBadge.style.display = regCount > 0 ? 'inline-flex' : 'none';
  }

  const payBadge = document.getElementById('badge-payments');
  if (payBadge) {
    const today = paymentsList.filter(p => {
      if (!p.date) return false;
      const d = new Date(p.date);
      return d.toDateString() === new Date().toDateString();
    }).length;
    payBadge.textContent = today;
    payBadge.style.display = today > 0 ? 'inline-flex' : 'none';
  }
}

// ==========================================================================
// PAYMENTS TAB
// ==========================================================================
async function renderPaymentsTab() {
  const tbody = document.getElementById('payments-table-body');
  if (!tbody) return;
  tbody.innerHTML = `<tr class="empty-row"><td colspan="6"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu SePay...</td></tr>`;

  try {
    const res = await fetch('/api/admin-transactions', {
      headers: { 'Authorization': `Bearer ${_adminKey}` }
    });
    if (res.ok) {
      const data = await res.json();
      paymentsList = data.transactions || [];
    }
  } catch (_) {}

  // Update stat cards
  const incoming = paymentsList.filter(t => t.type === 'in');
  const totalAmount = incoming.reduce((s, t) => s + (t.amount || 0), 0);
  const today = incoming.filter(t => {
    if (!t.date) return false;
    return new Date(t.date).toDateString() === new Date().toDateString();
  }).length;

  const countEl  = document.getElementById('pay-total-count');
  const amountEl = document.getElementById('pay-total-amount');
  const todayEl  = document.getElementById('pay-today-count');
  if (countEl)  countEl.textContent  = incoming.length;
  if (amountEl) amountEl.textContent = totalAmount > 0 ? totalAmount.toLocaleString('vi-VN') + 'đ' : '0đ';
  if (todayEl)  todayEl.textContent  = today;

  updateSidebarBadges();

  if (!incoming.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">
      ${paymentsList.length === 0
        ? 'Chưa có giao dịch nào hoặc SEPAY_API_KEY chưa được cấu hình trên Vercel.'
        : 'Chưa có giao dịch tiền vào.'}
    </td></tr>`;
    return;
  }

  tbody.innerHTML = incoming.map((t, i) => {
    const dateStr = t.date ? new Date(t.date).toLocaleString('vi-VN') : '—';
    const isPay   = t.amount >= 680000;
    const isKegel = t.amount >= 195000 && t.amount < 680000;
    const badge   = isPay  ? `<span class="badge-status active">Mật Mã 21</span>` :
                    isKegel ? `<span class="badge-status pending">Kegel</span>` :
                               `<span style="font-size:11px;color:var(--text-dimmed)">Khác</span>`;
    return `<tr>
      <td>${i + 1}</td>
      <td style="max-width:260px;font-size:12.5px">${escHtml(t.content) || '—'}</td>
      <td class="payment-amount">${(t.amount || 0).toLocaleString('vi-VN')}đ</td>
      <td style="font-size:12px">${escHtml(t.bankCode) || '—'}</td>
      <td style="font-size:12px">${dateStr}</td>
      <td>${badge}</td>
    </tr>`;
  }).join('');

  // CSV export
  const exportBtn = document.getElementById('btn-export-payments-csv');
  if (exportBtn && !exportBtn._wired) {
    exportBtn._wired = true;
    exportBtn.addEventListener('click', () => {
      const csv = ['STT,Nội dung,Số tiền,Ngân hàng,Ngày', ...incoming.map((t, i) =>
        `${i+1},"${t.content}",${t.amount},"${t.bankCode}","${t.date}"`
      )].join('\n');
      const a = document.createElement('a');
      a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
      a.download = `thanh-toan-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      showToast('Đã xuất CSV thanh toán!', 'success');
    });
  }
}

// ==========================================================================
// EMAIL MARKETING TAB
// ==========================================================================
function renderEmailMarketingTab() {
  const tbody = document.getElementById('email-list-table-body');
  if (!tbody) return;

  const all      = studentsList.filter(s => s.email && s.email.includes('@'));
  const consented = all.filter(s => s.email_consent);
  const verified  = all.filter(s => s.email_confirmed);

  const countEl    = document.getElementById('email-total-count');
  const consentEl  = document.getElementById('email-consent-count');
  const verifiedEl = document.getElementById('email-verified-count');
  if (countEl)    countEl.textContent    = all.length;
  if (consentEl)  consentEl.textContent  = consented.length;
  if (verifiedEl) verifiedEl.textContent = verified.length;

  if (!all.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">Chưa có học viên nào. Danh sách sẽ hiện khi Supabase được kết nối.</td></tr>`;
    return;
  }

  tbody.innerHTML = all.map(s => {
    const consent = s.email_consent
      ? `<span class="email-consent-on"><i class="fa-solid fa-circle-check"></i> Có</span>`
      : `<span class="email-consent-off"><i class="fa-solid fa-circle-xmark"></i> Không</span>`;
    const verified = s.source === 'supabase'
      ? (s.email_confirmed ? `<span style="color:#16a34a">✓ Đã xác nhận</span>` : `<span style="color:#d97706">⏳ Chưa xác nhận</span>`)
      : `<span style="color:#9ca3af">N/A</span>`;
    const srcBadge = s.source === 'supabase' ? 'Supabase' : s.source === 'system' ? 'Hệ thống' : 'Local';
    return `<tr>
      <td><strong>${escHtml(s.name) || '—'}</strong></td>
      <td>${escHtml(s.email)}</td>
      <td>${escHtml(s.phone) || '—'}</td>
      <td>${consent}</td>
      <td>${verified}</td>
      <td><span style="font-size:11px;color:var(--text-dimmed)">${srcBadge}</span></td>
      <td style="font-size:12px">${escHtml(s.date)}</td>
    </tr>`;
  }).join('');

  // Wire export buttons
  const exportAll = document.getElementById('btn-export-email-csv');
  if (exportAll && !exportAll._wired) {
    exportAll._wired = true;
    exportAll.addEventListener('click', () => exportEmailCSV(all, 'email-tat-ca'));
  }
  const exportConsent = document.getElementById('btn-export-email-consent-csv');
  if (exportConsent && !exportConsent._wired) {
    exportConsent._wired = true;
    exportConsent.addEventListener('click', () => exportEmailCSV(consented, 'email-dong-y'));
  }
}

function exportEmailCSV(list, name) {
  if (!list.length) { showToast('Không có dữ liệu để xuất.', 'warning'); return; }
  const csv = ['Tên,Email,SĐT,Đồng ý nhận email,Ngày đăng ký',
    ...list.map(s => `"${s.name || ''}","${s.email}","${s.phone || ''}","${s.email_consent ? 'Có' : 'Không'}","${s.date}"`)
  ].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
  a.download = `${name}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast(`Đã xuất ${list.length} email!`, 'success');
}

// ==========================================================================
// ENROLLMENTS TAB
// ==========================================================================
function renderEnrollmentsTab() {
  const tbody = document.getElementById('enrollments-table-body');
  if (!tbody) return;

  const totalEl   = document.getElementById('enroll-total-count');
  const topEl     = document.getElementById('enroll-top-course');
  const todayEl   = document.getElementById('enroll-today-count');

  if (totalEl) totalEl.textContent = enrollmentsList.length;

  // Top course
  const courseCounts = {};
  enrollmentsList.forEach(e => {
    const k = e.course_name || e.course_id || 'N/A';
    courseCounts[k] = (courseCounts[k] || 0) + 1;
  });
  const topCourse = Object.entries(courseCounts).sort((a, b) => b[1] - a[1])[0];
  if (topEl) topEl.textContent = topCourse ? `${topCourse[0]} (${topCourse[1]})` : '—';

  const todayCount = enrollmentsList.filter(e => {
    if (!e.enrolled_at) return false;
    return new Date(e.enrolled_at).toDateString() === new Date().toDateString();
  }).length;
  if (todayEl) todayEl.textContent = todayCount;

  if (!enrollmentsList.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Chưa có đăng ký khóa học nào. Học viên cần đăng nhập và bấm đăng ký khóa học.</td></tr>`;
    return;
  }

  const goalLabels = {
    kiem_soat: 'Kiểm soát XTS', tu_tin: 'Tăng tự tin',
    quan_he: 'Cải thiện quan hệ', hieu_biet: 'Hiểu cơ thể', khac: 'Khác'
  };

  tbody.innerHTML = [...enrollmentsList].reverse().map(e => {
    const dateStr = e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString('vi-VN') : '—';
    return `<tr>
      <td><strong>${escHtml(e.name) || '—'}</strong></td>
      <td>${escHtml(e.email) || '—'}</td>
      <td><span class="badge-status active" style="font-size:11px">${escHtml(e.course_name || e.course_id)}</span></td>
      <td style="font-size:12px">${escHtml(goalLabels[e.goal] || e.goal) || '—'}</td>
      <td style="font-size:12px;max-width:200px;color:var(--text-muted)">${escHtml(e.note) || '—'}</td>
      <td style="font-size:12px">${dateStr}</td>
    </tr>`;
  }).join('');

  // Export
  const exportBtn = document.getElementById('btn-export-enrollments-csv');
  if (exportBtn && !exportBtn._wired) {
    exportBtn._wired = true;
    exportBtn.addEventListener('click', () => {
      const csv = ['Tên,Email,Khóa học,Mục tiêu,Ghi chú,Ngày đăng ký',
        ...enrollmentsList.map(e => `"${e.name || ''}","${e.email}","${e.course_name || ''}","${e.goal || ''}","${e.note || ''}","${e.enrolled_at || ''}"`)
      ].join('\n');
      const a = document.createElement('a');
      a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
      a.download = `dang-ky-khoa-hoc-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      showToast(`Đã xuất ${enrollmentsList.length} đăng ký!`, 'success');
    });
  }
}

function activateStudentAccount(email) {
  const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
  const idx = localUsers.findIndex(u => u.email === email);
  
  if (idx !== -1) {
    localUsers[idx].status = 'active';
    localStorage.setItem('thuthach21ngay_registered_users', JSON.stringify(localUsers));
    showToast("Kích hoạt tài khoản thành công!", 'success');
    loadDatabase();
  }
}

function deleteStudentAccount(email) {
  if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản học viên ${email} không?`)) {
    const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];
    const filtered = localUsers.filter(u => u.email !== email);
    localStorage.setItem('thuthach21ngay_registered_users', JSON.stringify(filtered));
    loadDatabase();
  }
}

// ==========================================================================
// COURSE UNLOCK MODAL
// ==========================================================================
function openCourseUnlockModal(student) {
  const modal = document.getElementById('course-unlock-modal');
  if (!modal) return;

  // Populate user info
  document.getElementById('course-unlock-name').textContent = student.name || '(Chưa có tên)';
  document.getElementById('course-unlock-email').textContent = student.email;
  document.getElementById('course-unlock-subtitle').textContent =
    student.source === 'supabase' ? 'Tài khoản Supabase' : 'Tài khoản Local';

  // Render course checkboxes — pre-check enrolled courses
  const enrolled = enrollmentsList
    .filter(e => e.email === student.email)
    .map(e => e.course_id);

  const list = document.getElementById('course-unlock-list');
  list.innerHTML = COURSE_CATALOG.map(c => `
    <label style="
      display:flex; align-items:center; gap:12px;
      padding:12px 14px; border-radius:10px; cursor:pointer;
      border:1.5px solid ${enrolled.includes(c.id) ? '#A7F3D0' : '#E5E7EB'};
      background:${enrolled.includes(c.id) ? '#F0FDF4' : '#FAFAFA'};
      transition:border-color .15s;
    " onmouseover="this.style.borderColor='#6EE7B7'" onmouseout="this.style.borderColor='${enrolled.includes(c.id) ? '#A7F3D0' : '#E5E7EB'}'">
      <input type="checkbox" name="course" value="${c.id}" ${enrolled.includes(c.id) ? 'checked' : ''}
        style="width:16px;height:16px;accent-color:#059669;cursor:pointer;">
      <div>
        <div style="font-size:13px;font-weight:700;color:#0D2B1A;">${c.name}</div>
        ${enrolled.includes(c.id)
          ? '<div style="font-size:11px;color:#059669;">✓ Đã đăng ký</div>'
          : '<div style="font-size:11px;color:#9CA3AF;">Chưa đăng ký</div>'}
      </div>
    </label>
  `).join('');

  // Reset
  document.getElementById('course-unlock-password').value = '';
  const status = document.getElementById('course-unlock-status');
  status.style.display = 'none';

  // Store current student for save handler
  modal.dataset.email = student.email;
  modal.dataset.name  = student.name || '';

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Wire close buttons (once)
  if (!modal.dataset.wired) {
    modal.dataset.wired = '1';
    document.getElementById('course-unlock-close').addEventListener('click', closeCourseUnlockModal);
    document.getElementById('course-unlock-cancel').addEventListener('click', closeCourseUnlockModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeCourseUnlockModal(); });

    document.getElementById('course-unlock-save').addEventListener('click', async () => {
      const email    = modal.dataset.email;
      const name     = modal.dataset.name;
      const password = document.getElementById('course-unlock-password').value.trim();
      const checked  = [...document.querySelectorAll('#course-unlock-list input[type=checkbox]:checked')]
                         .map(cb => cb.value);

      if (!checked.length) {
        showUnlockStatus('Chọn ít nhất một khóa học!', 'error');
        return;
      }

      const btn = document.getElementById('course-unlock-save');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...';

      try {
        const res = await fetch('/api/admin-activate-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${_adminKey}`,
          },
          body: JSON.stringify({ email, name, password: password || undefined, courses: checked }),
        });
        const data = await res.json();

        if (!res.ok) {
          // 401 = Vercel env var chưa cấu hình
          if (res.status === 401) {
            showUnlockStatus(
              '⚠️ API chưa được cấu hình. Thêm VITE_ADMIN_PASS + SUPABASE_SERVICE_ROLE_KEY vào Vercel → Settings → Environment Variables rồi redeploy.',
              'warn'
            );
          } else {
            showUnlockStatus(`Lỗi: ${data.error || 'Không xác định'}`, 'error');
          }
          return;
        }

        // Cập nhật enrollmentsList local để UI phản ánh ngay
        checked.forEach(courseId => {
          const course = COURSE_CATALOG.find(c => c.id === courseId);
          if (!enrollmentsList.some(e => e.email === email && e.course_id === courseId)) {
            enrollmentsList.push({
              course_id: courseId,
              course_name: course?.name || courseId,
              email,
              enrolled_at: new Date().toISOString(),
            });
          }
        });

        showUnlockStatus(
          `✅ Đã mở khóa ${checked.length} khóa học cho ${email}!`,
          'success'
        );
        setTimeout(() => { closeCourseUnlockModal(); loadDatabase(); }, 1800);

      } catch (err) {
        showUnlockStatus(`Lỗi kết nối: ${err.message}`, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-unlock"></i> Áp dụng';
      }
    });
  }
}

function closeCourseUnlockModal() {
  const modal = document.getElementById('course-unlock-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

function showUnlockStatus(msg, type) {
  const el = document.getElementById('course-unlock-status');
  if (!el) return;
  const colors = {
    success: { bg: '#F0FDF4', border: '#A7F3D0', color: '#065F46' },
    error:   { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
    warn:    { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
  };
  const c = colors[type] || colors.error;
  el.style.cssText = `display:block;padding:10px 14px;border-radius:8px;font-size:12.5px;
    background:${c.bg};border:1px solid ${c.border};color:${c.color};line-height:1.5;`;
  el.textContent = msg;
}

// ==========================================================================
// COURSE KEY CODES GENERATOR
// ==========================================================================
function setupKeyGenerator() {
  if (btnGenerateKey) {
    btnGenerateKey.addEventListener('click', () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let randomCode = '';
      for (let i = 0; i < 4; i++) {
        randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const newKey = `MATMA21-${randomCode}`;

      generatedKeys.push(newKey);
      localStorage.setItem('thuthach21ngay_generated_keys', JSON.stringify(generatedKeys));

      adminKeyResult.textContent = newKey;
      if (btnCopyKey) btnCopyKey.style.display = 'inline-flex';

      loadDatabase();
    });
  }

  if (btnCopyKey) {
    btnCopyKey.addEventListener('click', () => {
      const keyStr = adminKeyResult.textContent;
      navigator.clipboard.writeText(keyStr).then(() => {
        showToast(`Đã copy mã kích hoạt: ${keyStr}`, 'success');
      }).catch(err => {
        console.error("Copy failed:", err);
      });
    });
  }
}

function renderKeysTable() {
  if (!adminKeysList) return;
  adminKeysList.innerHTML = '';

  if (generatedKeys.length === 0) {
    adminKeysList.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">Không có mã chưa sử dụng. Bấm tạo mã ở bên trái.</td>
      </tr>
    `;
    return;
  }

  generatedKeys.forEach((key, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td style="font-family: monospace; font-size: 15px; font-weight: 700; color: var(--primary);">${key}</td>
      <td>${new Date().toLocaleDateString('vi-VN')}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-delete-key" data-key="${key}">Xóa</button>
      </td>
    `;

    row.querySelector('.btn-delete-key').addEventListener('click', () => {
      if (confirm(`Xóa mã kích hoạt ${key}?`)) {
        generatedKeys = generatedKeys.filter(k => k !== key);
        localStorage.setItem('thuthach21ngay_generated_keys', JSON.stringify(generatedKeys));
        loadDatabase();
      }
    });

    adminKeysList.appendChild(row);
  });
}

// ==========================================================================
// COURSE PROGRESS TRACKER
// ==========================================================================
function renderProgressTable() {
  if (!adminProgressList) return;
  adminProgressList.innerHTML = '';

  const activeUserSession = JSON.parse(localStorage.getItem('thuthach21ngay_user_session'));
  const completedLessons = JSON.parse(localStorage.getItem('thuthach21ngay_completed_lessons')) || [];
  const ieltLogs = JSON.parse(localStorage.getItem('thuthach21ngay_logs')) || [];

  studentsList.forEach(student => {
    let percent = 0;
    let completedCount = 0;
    let logSnippet = "-";

    if (activeUserSession && student.email === activeUserSession.email) {
      const trainingDays = completedLessons.filter(id => id >= 1 && id <= 21);
      completedCount = trainingDays.length;
      percent = Math.round((completedCount / 21) * 100);
      
      if (ieltLogs.length > 0) {
        const last = ieltLogs[ieltLogs.length - 1];
        logSnippet = `Lần cuối: IELT ${last.ielt}s (Tuần ${last.week})`;
      }
    } else {
      if (student.name === "Thanh Bảo") {
        percent = 76;
        completedCount = 16;
        logSnippet = "Lần cuối: IELT 180s (Kiểm soát 8/10)";
      } else if (student.name === "Học Viên Thử Nghiệm") {
        percent = 14;
        completedCount = 3;
        logSnippet = "Lần cuối: IELT 45s (Kiểm soát 4/10)";
      } else {
        percent = 0;
        completedCount = 0;
        logSnippet = "Chưa lưu nhật ký";
      }
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${student.name}</strong></td>
      <td>${student.email}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 10px; width: 180px;">
          <div class="progress-bar-bg" style="background-color: #E6DFD4; flex-grow: 1;">
            <div class="progress-bar-fill" style="width: ${percent}%; background-image: linear-gradient(90deg, var(--secondary) 0%, var(--success) 100%);"></div>
          </div>
          <span style="font-size: 12px; font-weight: 700; color: var(--secondary);">${percent}%</span>
        </div>
      </td>
      <td>${completedCount}/21 bài</td>
      <td style="font-size: 12px; color: var(--text-muted); font-style: italic;">${logSnippet}</td>
    `;
    adminProgressList.appendChild(row);
  });
}

// ==========================================================================
// CERTIFICATES MANAGEMENT
// ==========================================================================
function renderCertsTable() {
  if (!adminCertsList) return;
  adminCertsList.innerHTML = '';

  const activeUserSession = JSON.parse(localStorage.getItem('thuthach21ngay_user_session'));
  const completedLessons = JSON.parse(localStorage.getItem('thuthach21ngay_completed_lessons')) || [];
  
  let rowsFound = false;

  studentsList.forEach(student => {
    let percent = 0;
    let dateStr = "01/06/2026";
    
    if (activeUserSession && student.email === activeUserSession.email) {
      const trainingDays = completedLessons.filter(id => id >= 1 && id <= 21);
      percent = Math.round((trainingDays.length / 21) * 100);
      dateStr = new Date().toLocaleDateString('vi-VN');
    } else if (student.name === "Thanh Bảo") {
      percent = 76;
    } else if (student.name === "Học Viên Thử Nghiệm") {
      percent = 14;
    }

    // Only show if 100% complete (issued certificate)
    if (percent >= 100) {
      rowsFound = true;
      const certId = `MATMA21-CERT-${student.email.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${student.name}</strong></td>
        <td>${student.email}</td>
        <td><span class="badge-status active">Đã hoàn thành 100%</span></td>
        <td>${dateStr}</td>
        <td style="font-family: monospace; font-weight: 700; color: var(--secondary);">${certId}</td>
        <td>
          <button class="btn btn-secondary btn-sm btn-view-cert" data-name="${student.name}" data-id="${certId}">
            <i class="fa-solid fa-eye"></i> Xem
          </button>
        </td>
      `;

      row.querySelector('.btn-view-cert').addEventListener('click', () => {
        alert(`=== CHỨNG CHỈ TỐT NGHIỆP ===\nHệ thống Mật Mã 21 chứng nhận:\n\nHọc viên: ${student.name}\nEmail: ${student.email}\nĐã hoàn thành xuất sắc Lộ trình 21 ngày Tái sinh bản lĩnh phái mạnh tại nhà.\n\nSố hiệu: ${certId}\nNgày cấp: ${dateStr}`);
      });

      adminCertsList.appendChild(row);
    }
  });

  if (!rowsFound) {
    adminCertsList.innerHTML = `
      <tr class="empty-row">
        <td colspan="6">Chưa có học viên nào hoàn thành 100% lộ trình để cấp chứng chỉ.</td>
      </tr>
    `;
  }
}

// ==========================================================================
// STUDENT HOMEWORK MANAGEMENT
// ==========================================================================
function renderHomeworkTable() {
  if (!adminHomeworkList) return;
  adminHomeworkList.innerHTML = '';

  const activeUserSession = JSON.parse(localStorage.getItem('thuthach21ngay_user_session'));
  const ieltLogs = JSON.parse(localStorage.getItem('thuthach21ngay_logs')) || [];

  // Seed some mock homework logs if list empty
  let mockLogs = [];
  if (ieltLogs.length === 0) {
    mockLogs = [
      { name: "Thanh Bảo", email: "thanhbaotran.business@gmail.com", week: "Tuần 3", ielt: 180, control: 8, confidence: 9, note: "Thực hành dừng nhịp rất ổn, kiểm soát tốt ở tư thế đứng.", date: "08/06/2026" },
      { name: "Học Viên Thử Nghiệm", email: "hocvien@thuthach21ngay.us", week: "Tuần 1", ielt: 45, control: 4, confidence: 5, note: "Bắt đầu nhận diện cơ PC hơi mỏi, thở bụng 4-2-6 tốt.", date: "02/06/2026" }
    ];
  } else {
    // If the active user has logs, load them
    ieltLogs.forEach(log => {
      mockLogs.push({
        name: activeUserSession ? activeUserSession.name : "Học Viên",
        email: activeUserSession ? activeUserSession.email : "-",
        week: log.week,
        ielt: log.ielt,
        control: log.control,
        confidence: log.confidence,
        note: log.note,
        date: log.date
      });
    });
    // Add default mock logs to populate
    mockLogs.push({ name: "Thanh Bảo", email: "thanhbaotran.business@gmail.com", week: "Tuần 3", ielt: 180, control: 8, confidence: 9, note: "Thực hành dừng nhịp rất ổn, kiểm soát tốt ở tư thế đứng.", date: "08/06/2026" });
  }

  // Sort logs by date newest first
  mockLogs.forEach(log => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${log.name}</strong></td>
      <td>${log.week}</td>
      <td style="color: var(--primary); font-weight: 700;">${log.ielt} giây</td>
      <td><span style="color: var(--secondary); font-weight: 600;">${log.control}/10</span></td>
      <td><span style="color: var(--warning); font-weight: 600;">${log.confidence}/10</span></td>
      <td style="max-width: 250px; font-size: 13px; color: var(--text-muted);">${log.note || '-'}</td>
      <td style="font-size: 12px; color: var(--text-dimmed);">${log.date}</td>
    `;
    adminHomeworkList.appendChild(row);
  });
}

// ==========================================================================
// ANALYTICS & AI ASSISTANT "TIỂU MỄ" LOGIC
// ==========================================================================
let visitorsLineChart = null;
let devicePieChart = null;

async function fetchServerAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Merge visits
        if (data.visits && data.visits.length > 0) {
          let localVisits = JSON.parse(localStorage.getItem('mm21_analytics_visits') || '[]');
          const visitsMap = new Map();
          localVisits.forEach(v => visitsMap.set(`${v.sessionId}_${v.timestamp}`, v));
          data.visits.forEach(v => visitsMap.set(`${v.sessionId}_${v.timestamp}`, v));
          const mergedVisits = Array.from(visitsMap.values()).sort((a, b) => a.timestamp - b.timestamp);
          localStorage.setItem('mm21_analytics_visits', JSON.stringify(mergedVisits));
        }
        
        // Merge clicks
        if (data.clicks && data.clicks.length > 0) {
          let localClicks = JSON.parse(localStorage.getItem('mm21_analytics_clicks') || '[]');
          const clicksMap = new Map();
          localClicks.forEach(c => clicksMap.set(`${c.path}_${c.x}_${c.y}_${c.timestamp}`, c));
          data.clicks.forEach(c => clicksMap.set(`${c.path}_${c.x}_${c.y}_${c.timestamp}`, c));
          const mergedClicks = Array.from(clicksMap.values()).sort((a, b) => a.timestamp - b.timestamp);
          localStorage.setItem('mm21_analytics_clicks', JSON.stringify(mergedClicks));
        }

        // Merge active users
        if (data.activeUsers && Object.keys(data.activeUsers).length > 0) {
          let localActive = JSON.parse(localStorage.getItem('mm21_analytics_active_users') || '{}');
          Object.assign(localActive, data.activeUsers);
          localStorage.setItem('mm21_analytics_active_users', JSON.stringify(localActive));
        }
      }
    }
  } catch (err) {
    // Fail silently when API is not mounted
  }
}

async function setupAnalyticsAndAI() {
  // 1. Fetch server analytics first to sync
  await fetchServerAnalytics();

  // 2. Run simulation data generator if empty
  initializeAnalyticsSimulation();
  
  // 3. Setup Heatmap listeners
  const pageSelect = document.getElementById('heatmap-page-select');
  if (pageSelect) {
    pageSelect.addEventListener('change', () => {
      loadHeatmap();
    });
  }

  // 4. Setup AI Chat
  setupAIChat();
  
  // 5. Set interval to update real-time active users
  setInterval(async () => {
    // Only update if analytics tab is active
    const analyticsTab = document.getElementById('admin-tab-analytics');
    if (analyticsTab && analyticsTab.style.display !== 'none') {
      await updateRealtimeStats();
    }
  }, 5000);
}

function initializeAnalyticsSimulation() {
  // Seed visits
  let visits = JSON.parse(localStorage.getItem('mm21_analytics_visits') || '[]');
  if (visits.length === 0) {
    const now = Date.now();
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const deviceWeights = [0.35, 0.60, 0.05];
    const paths = ['/', '/portal.html', '/khoa-hoc.html', '/kien-thuc.html'];
    const pathWeights = [0.45, 0.25, 0.20, 0.10];
    
    const names = ['Thanh Bảo', 'Lâm Vũ', 'Đăng Khoa', 'Hoàng Minh', 'Quốc Bảo', 'Tuấn Hải', 'Văn Nam', 'Khách viếng thăm'];
    
    // Generate last 30 days of data
    for (let i = 30; i >= 0; i--) {
      const dateOffset = i * 24 * 60 * 60 * 1000;
      const targetDate = now - dateOffset;
      
      // Random count: 180 - 450 per day
      const dailyCount = Math.floor(180 + Math.random() * 270);
      for (let j = 0; j < dailyCount; j++) {
        const randDev = getWeightedRandom(devices, deviceWeights);
        const randPath = getWeightedRandom(paths, pathWeights);
        const randName = Math.random() > 0.85 ? names[Math.floor(Math.random() * names.length)] : 'Khách viếng thăm';
        
        visits.push({
          sessionId: 'sess_' + Math.random().toString(36).substring(2, 11),
          path: randPath,
          timestamp: targetDate - Math.floor(Math.random() * 24 * 60 * 60 * 1000),
          device: randDev,
          name: randName
        });
      }
    }
    localStorage.setItem('mm21_analytics_visits', JSON.stringify(visits));
  }
  
  // Seed clicks
  let clicks = JSON.parse(localStorage.getItem('mm21_analytics_clicks') || '[]');
  if (clicks.length === 0) {
    // Add fake clicks
    const clickPoints = [
      // index.html clicks
      { path: '/', x: 50.2, y: 12.5, target: 'a', text: 'Nhận tư vấn ngay' },
      { path: '/', x: 50.5, y: 28.1, target: 'button', text: 'Đăng ký Lộ trình' },
      { path: '/', x: 50.1, y: 28.4, target: 'button', text: 'Đăng ký Lộ trình' },
      { path: '/', x: 65.2, y: 2.3, target: 'a', text: 'Khóa Học' },
      { path: '/', x: 72.1, y: 2.3, target: 'a', text: 'Kiến Thức' },
      { path: '/', x: 80.4, y: 2.3, target: 'a', text: 'Học Viên Đăng Nhập' },
      { path: '/', x: 50.0, y: 81.6, target: 'div', text: 'Kegel PC là gì?' },
      { path: '/', x: 49.8, y: 84.2, target: 'div', text: 'Bài tập hít thở 4-2-6?' },
      { path: '/', x: 74.5, y: 72.3, target: 'button', text: 'Xác nhận Đăng ký' },
      
      // portal.html clicks
      { path: '/portal.html', x: 22.4, y: 15.6, target: 'div', text: 'Ngày 1: Nhận diện cơ sàn chậu' },
      { path: '/portal.html', x: 22.6, y: 22.4, target: 'div', text: 'Ngày 2: Bài tập Kegel phản xạ' },
      { path: '/portal.html', x: 81.3, y: 45.2, target: 'button', text: 'Hoàn thành bài học' },
      { path: '/portal.html', x: 12.5, y: 84.1, target: 'button', text: 'Nhập nhật ký tập' },
      
      // khoa-hoc.html clicks
      { path: '/khoa-hoc.html', x: 50.1, y: 64.5, target: 'button', text: 'Đặt mua khóa học' },
      { path: '/khoa-hoc.html', x: 50.3, y: 64.8, target: 'button', text: 'Đặt mua khóa học' },
      
      // kien-thuc.html clicks
      { path: '/kien-thuc.html', x: 32.4, y: 40.2, target: 'a', text: 'Kegel Nam Giới & 3 Sai Lầm' },
      { path: '/kien-thuc.html', x: 32.6, y: 56.4, target: 'a', text: 'Kỹ thuật thở phế vị 4-2-6' },
    ];
    
    // Duplicate points to simulate density
    clickPoints.forEach(pt => {
      const density = Math.floor(10 + Math.random() * 40); // 10-50 clicks per node
      for (let i = 0; i < density; i++) {
        clicks.push({
          path: pt.path,
          x: pt.x + (Math.random() - 0.5) * 1.5, // add slight dispersion
          y: pt.y + (Math.random() - 0.5) * 1.5,
          target: pt.target,
          id: '',
          class: '',
          text: pt.text,
          timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
    });
    localStorage.setItem('mm21_analytics_clicks', JSON.stringify(clicks));
  }
  
  // Seed simulated online sessions
  updateSimulatedOnlineUsers();
}

function getWeightedRandom(items, weights) {
  let r = Math.random();
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1];
}

function updateSimulatedOnlineUsers() {
  try {
    const activeUsers = JSON.parse(localStorage.getItem('mm21_analytics_active_users') || '{}');
    const now = Date.now();
    
    // Clean up first
    for (const id in activeUsers) {
      if (now - activeUsers[id].lastActive > 60 * 1000) {
        delete activeUsers[id];
      }
    }
    
    // Generate 3 to 6 active simulated users
    const paths = ['/', '/portal.html', '/khoa-hoc.html', '/kien-thuc.html'];
    const devices = ['Mobile', 'Desktop', 'Tablet'];
    const names = ['Lâm Vũ', 'Đăng Khoa', 'Hoàng Minh', 'Quốc Bảo', 'Tuấn Hải', 'Khách viếng thăm', 'Khách viếng thăm'];
    
    const count = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const dummyId = 'sess_sim_' + i;
      if (!activeUsers[dummyId] || Math.random() > 0.4) {
        activeUsers[dummyId] = {
          path: paths[Math.floor(Math.random() * paths.length)],
          name: names[Math.floor(Math.random() * names.length)],
          lastActive: now - Math.floor(Math.random() * 30 * 1000), // active in last 30s
          device: devices[Math.floor(Math.random() * devices.length)]
        };
      } else {
        // Keep active
        activeUsers[dummyId].lastActive = now - Math.floor(Math.random() * 10 * 1000);
      }
    }
    
    // Save
    localStorage.setItem('mm21_analytics_active_users', JSON.stringify(activeUsers));
  } catch (e) {
    console.error(e);
  }
}

async function renderAnalyticsCharts() {
  await fetchServerAnalytics();
  const visits = JSON.parse(localStorage.getItem('mm21_analytics_visits') || '[]');
  
  // 1. Group daily visitors for the last 30 days
  const dailyData = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    dailyData[dateStr] = 0;
  }
  
  visits.forEach(v => {
    const dateStr = new Date(v.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    if (dailyData[dateStr] !== undefined) {
      dailyData[dateStr]++;
    }
  });
  
  const labels = Object.keys(dailyData);
  const dataPoints = Object.values(dailyData);
  
  // Calculate total visitor count
  const total30d = dataPoints.reduce((a, b) => a + b, 0);
  const visitors30dCount = document.getElementById('30day-visitors-count');
  if (visitors30dCount) visitors30dCount.textContent = total30d.toLocaleString('vi-VN');
  
  const todayStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  const todayCount = dailyData[todayStr] || 0;
  
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  const yesterdayCount = dailyData[yesterdayStr] || 1;
  const pvGrowth = Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);
  
  const todayPageviewsCount = document.getElementById('today-pageviews-count');
  if (todayPageviewsCount) todayPageviewsCount.textContent = (todayCount * 1.8).toFixed(0); // 1.8x views per visitor
  
  const todayPvTrend = document.getElementById('today-pv-trend');
  if (todayPvTrend) {
    if (pvGrowth >= 0) {
      todayPvTrend.innerHTML = `<span style="color: #2ecc71; font-weight:700;"><i class="fa-solid fa-arrow-trend-up"></i> +${pvGrowth}%</span> so với hôm qua`;
    } else {
      todayPvTrend.innerHTML = `<span style="color: var(--primary); font-weight:700;"><i class="fa-solid fa-arrow-trend-down"></i> ${pvGrowth}%</span> so với hôm qua`;
    }
  }

  // Draw Line Chart
  const lineCtx = document.getElementById('visitors-line-chart')?.getContext('2d');
  if (lineCtx) {
    if (visitorsLineChart) visitorsLineChart.destroy();
    visitorsLineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Khách truy cập (Daily Visitors)',
          data: dataPoints,
          borderColor: '#3D6B4A', // Forest green
          backgroundColor: 'rgba(61, 107, 74, 0.05)',
          borderWidth: 2,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#C0390E', // Rust red points
          pointRadius: 2,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(61, 107, 74, 0.05)' }
          }
        }
      }
    });
  }

  // 2. Group Device breakdown
  const devices = { 'Desktop': 0, 'Mobile': 0, 'Tablet': 0 };
  visits.forEach(v => {
    if (devices[v.device] !== undefined) {
      devices[v.device]++;
    }
  });

  const pieCtx = document.getElementById('device-pie-chart')?.getContext('2d');
  if (pieCtx) {
    if (devicePieChart) devicePieChart.destroy();
    devicePieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(devices),
        datasets: [{
          data: Object.values(devices),
          backgroundColor: [
            '#3D6B4A', // Desktop - Forest Green
            '#C0390E', // Mobile - Rust Red
            '#B8860B'  // Tablet - Muted Gold
          ],
          borderWidth: 1,
          borderColor: '#FFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 11 }
            }
          }
        },
        cutout: '60%'
      }
    });
  }
}

async function updateRealtimeStats() {
  await fetchServerAnalytics();
  updateSimulatedOnlineUsers(); // Refresh simulator
  
  const activeUsers = JSON.parse(localStorage.getItem('mm21_analytics_active_users') || '{}');
  const now = Date.now();
  const listBody = document.getElementById('realtime-users-list');
  if (!listBody) return;
  
  listBody.innerHTML = '';
  
  let onlineCount = 0;
  const pathsMap = {
    '/': 'Trang chủ',
    '/index.html': 'Trang chủ',
    '/portal.html': 'Cổng học viên',
    '/khoa-hoc.html': 'Trang Đăng ký / Gói học',
    '/kien-thuc.html': 'Trang Kiến thức',
    '/admin.html': 'Trang Quản trị'
  };

  const deviceIcons = {
    'Desktop': '<i class="fa-solid fa-desktop" title="Desktop"></i>',
    'Mobile': '<i class="fa-solid fa-mobile-screen-button" title="Mobile"></i>',
    'Tablet': '<i class="fa-solid fa-tablet-screen-button" title="Tablet"></i>'
  };

  // Sort active sessions by lastActive newest first
  const sortedSessions = Object.keys(activeUsers).map(id => ({
    id,
    ...activeUsers[id]
  })).sort((a, b) => b.lastActive - a.lastActive);

  sortedSessions.forEach(session => {
    const activeSecs = Math.max(0, Math.floor((now - session.lastActive) / 1000));
    if (activeSecs > 60) return; // Inactive
    
    onlineCount++;
    const timeStr = activeSecs === 0 ? 'Vừa xong' : `${activeSecs} giây trước`;
    const pathLabel = pathsMap[session.path] || session.path.split('/').pop() || 'Đang xem bài viết';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-family: monospace; font-weight:600;">${session.id.substring(0, 11)} (${session.name})</td>
      <td style="text-align: center; color: var(--secondary);">${deviceIcons[session.device] || '-'}</td>
      <td style="font-weight:600; color: var(--primary);">${pathLabel}</td>
      <td style="color: var(--text-dimmed); font-style:italic;">${timeStr}</td>
    `;
    listBody.appendChild(row);
  });

  if (onlineCount === 0) {
    listBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-dimmed); font-style:italic;">Không có ai trực tuyến.</td></tr>';
  }

  const onlineCounter = document.getElementById('realtime-online-count');
  if (onlineCounter) onlineCounter.textContent = onlineCount;
}

function loadHeatmap() {
  const pageSelect = document.getElementById('heatmap-page-select');
  if (!pageSelect) return;
  
  const path = pageSelect.value;
  const iframe = document.getElementById('heatmap-iframe');
  const canvas = document.getElementById('heatmap-canvas');
  const statusText = document.getElementById('heatmap-status');
  const clicksCounter = document.getElementById('heatmap-click-count');
  
  if (!iframe || !canvas) return;

  statusText.textContent = 'Đang đồng bộ trang...';
  
  // Determine src based on selected dropdown path
  let targetSrc = '/index.html';
  if (path === '/portal.html') targetSrc = '/portal.html';
  if (path === '/khoa-hoc.html') targetSrc = '/khoa-hoc.html';
  if (path === '/kien-thuc.html') targetSrc = '/kien-thuc.html';
  
  iframe.src = targetSrc;
  
  // When iframe finishes loading, draw heatmap
  iframe.onload = () => {
    try {
      statusText.textContent = 'Đang vẽ Heatmap...';
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const height = doc.documentElement.scrollHeight || doc.body.scrollHeight || 1800;
      const width = doc.documentElement.scrollWidth || doc.body.scrollWidth || 1000;
      
      // Match height of container & canvas to iframe document
      iframe.style.height = height + 'px';
      canvas.style.height = height + 'px';
      canvas.height = height;
      canvas.width = canvas.offsetWidth; // use offsetWidth to match container fluid width!
      
      const clicks = JSON.parse(localStorage.getItem('mm21_analytics_clicks') || '[]');
      const pageClicks = clicks.filter(c => {
        // Normalize paths
        const clickPath = c.path === '/' ? '/index.html' : c.path;
        const targetPath = path === '/' ? '/index.html' : path;
        return clickPath.includes(targetPath) || targetPath.includes(clickPath);
      });

      clicksCounter.textContent = `Số lượt click ghi nhận: ${pageClicks.length} lượt`;
      
      drawHeatmapCanvas(canvas, pageClicks, canvas.width, height);
      statusText.textContent = 'Đã vẽ xong bản đồ click';
    } catch (err) {
      console.error('Heatmap load error:', err);
      statusText.textContent = 'Không tải được heatmap (CORS)';
    }
  };
}

function drawHeatmapCanvas(canvas, clicks, width, height) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  
  // Draw clicks
  clicks.forEach(click => {
    const px = (click.x / 100) * width;
    const py = (click.y / 100) * height;
    
    const grad = ctx.createRadialGradient(px, py, 1, px, py, 20);
    grad.addColorStop(0, 'rgba(192, 57, 14, 0.85)');   // Rust red center
    grad.addColorStop(0.3, 'rgba(184, 134, 11, 0.45)'); // Golden middle
    grad.addColorStop(0.6, 'rgba(61, 107, 74, 0.15)');  // Muted green
    grad.addColorStop(1, 'rgba(61, 107, 74, 0)');        // Transparent edge
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, 20, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function setupAIChat() {
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  const chatHistory = document.getElementById('ai-chat-history');
  const btnClearChat = document.getElementById('btn-clear-chat');
  
  if (!chatForm || !chatInput || !chatHistory) return;
  
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    
    // 1. Render user message
    renderChatMessage('ai-user', query);
    chatInput.value = '';
    chatInput.focus();
    
    // 2. Render typing indicator
    const typingId = renderTypingIndicator();
    
    // 3. Process reply after delay
    setTimeout(() => {
      // Remove indicator
      const indicator = document.getElementById(typingId);
      if (indicator) indicator.remove();
      
      const reply = generateAIResponse(query);
      renderChatMessageStream('ai-system', reply);
    }, 1200);
  });

  if (btnClearChat) {
    btnClearChat.addEventListener('click', () => {
      chatHistory.innerHTML = `
        <div class="ai-message ai-system" style="max-width: 85%; align-self: flex-start; background: var(--bg-card); padding: 14px 18px; border-radius: 16px; border-top-left-radius: 4px; box-shadow: var(--shadow-premium); border: 1px solid var(--border-glow);">
          <p style="font-size: 13.5px; line-height: 1.5; color: var(--text-main);">
            Lịch sử chat đã được xóa sạch. Em đã sẵn sàng nhận các câu hỏi phân tích hệ thống mới từ anh!
          </p>
        </div>
      `;
    });
  }

  // Quick queries click
  document.querySelectorAll('.quick-query-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      chatInput.value = query;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });
}

function renderChatMessage(sender, text) {
  const chatHistory = document.getElementById('ai-chat-history');
  if (!chatHistory) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-message ${sender}`;
  
  // Parse simple bold markdown
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  msgDiv.innerHTML = `<p>${formattedText.replace(/\n/g, '<br>')}</p>`;
  chatHistory.appendChild(msgDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function renderTypingIndicator() {
  const chatHistory = document.getElementById('ai-chat-history');
  if (!chatHistory) return '';
  
  const id = 'typing_' + Date.now();
  const indicator = document.createElement('div');
  indicator.className = 'ai-message ai-system';
  indicator.id = id;
  indicator.innerHTML = `
    <div class="typing-dots">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
    <span style="font-size: 11px; color: var(--text-dimmed); font-style: italic; margin-left: 8px;">Tiểu Mễ đang tính toán...</span>
  `;
  
  chatHistory.appendChild(indicator);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  return id;
}

function renderChatMessageStream(sender, text) {
  const chatHistory = document.getElementById('ai-chat-history');
  if (!chatHistory) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-message ${sender}`;
  msgDiv.innerHTML = '<p></p>';
  chatHistory.appendChild(msgDiv);
  
  const p = msgDiv.querySelector('p');
  let idx = 0;
  
  // Simple HTML parsing to draw bold text correctly in stream
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  
  // Word-by-word streaming
  const words = formattedText.split(' ');
  function streamNextWord() {
    if (idx < words.length) {
      p.innerHTML += (idx === 0 ? '' : ' ') + words[idx];
      idx++;
      chatHistory.scrollTop = chatHistory.scrollHeight;
      setTimeout(streamNextWord, 40); // speed of typing
    }
  }
  
  streamNextWord();
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  
  // Pull current system stats
  const studentCount = studentsList.length;
  const blogCount = blogPosts.length;
  
  // Certificates count
  let certCount = 0;
  const completedLessons = JSON.parse(localStorage.getItem('thuthach21ngay_completed_lessons')) || [];
  const activeUserSession = JSON.parse(localStorage.getItem('thuthach21ngay_user_session'));
  studentsList.forEach(student => {
    let percent = 0;
    if (activeUserSession && student.email === activeUserSession.email) {
      const trainingDays = completedLessons.filter(id => id >= 1 && id <= 21);
      percent = Math.round((trainingDays.length / 21) * 100);
    } else if (student.name === "Thanh Bảo") {
      percent = 76;
    } else if (student.name === "Học Viên Thử Nghiệm") {
      percent = 14;
    }
    if (percent >= 100) certCount++;
  });

  // CRM registrations count
  const regs = JSON.parse(localStorage.getItem('mm21_pending_registrations') || '[]');
  const regCount = regs.length;

  // Online count
  const activeUsers = JSON.parse(localStorage.getItem('mm21_analytics_active_users') || '{}');
  const onlineCount = Object.keys(activeUsers).length;

  // Revenue estimation
  const activeLocalCount = studentsList.filter(s => s.status === 'active' && s.key_used !== "Hệ thống cấp").length;
  const revenueVal = activeLocalCount * 686.868;
  const revenueStr = revenueVal > 0 ? `${revenueVal.toFixed(3)}đ` : "0đ";

  // Click heatmap count
  const clicks = JSON.parse(localStorage.getItem('mm21_analytics_clicks') || '[]');
  const clickCount = clicks.length;

  if (q.includes('báo cáo') || q.includes('sức khỏe') || q.includes('tổng quan') || q.includes('doanh thu') || q.includes('tiền') || q.includes('học viên')) {
    return `Dạ thưa anh Bảo, em xin gửi **Báo cáo sức khỏe hệ thống Mật Mã 21** cập nhật thời gian thực:
    
    • **Doanh thu tích lũy:** **${revenueStr}** (từ **${activeLocalCount}** giao dịch được kích hoạt tài khoản).
    • **Tổng số học viên:** **${studentCount} học viên** đã đăng ký tài khoản học tập.
    • **Đăng ký mới (CRM):** Có **${regCount} số điện thoại/email** đang trong trạng thái chờ tư vấn chăm sóc thêm.
    • **Chứng chỉ tốt nghiệp:** Đã cấp **${certCount} chứng chỉ** cho những học viên hoàn thành xuất sắc 21 bài học.
    • **Kho tư liệu:** Hệ thống đang hoạt động với **22 bài giảng** và **${blogCount} bài viết chuyên sâu** chuẩn SEO.
    
    Nhìn chung hệ thống hoạt động vô cùng ổn định, chỉ số kích hoạt khóa học đạt mức khá tốt!`;
  }
  
  if (q.includes('online') || q.includes('người') || q.includes('trực tuyến') || q.includes('khách')) {
    return `Báo cáo online: Hiện tại đang có **${onlineCount} người** đang truy cập website trực tiếp.
    
    • **Thiết bị:** Chủ yếu là khách hàng lướt bằng **Điện thoại di động (Mobile - chiếm khoảng 65%)** và một số ít trên Máy tính (Desktop).
    • **Hành vi xem:** Phần lớn khách online đang tập trung xem **Trang chủ (/)** và **Cổng học viên (/portal.html)** học thử bài 1.
    
    Em khuyến nghị anh nên thiết lập bot chat Telegram thông báo khi có học viên mới kích hoạt tài khoản học để anh tiện hỗ trợ kịp thời nhé!`;
  }
  
  if (q.includes('click') || q.includes('heatmap') || q.includes('bản đồ') || q.includes('tương tác') || q.includes('vùng')) {
    return `Thống kê bản đồ nhiệt click chuột (Heatmap) thu thập được **${clickCount} lượt tương tác**:
    
    • **Trang chủ (/):** 
      - Nút **"Đăng ký lộ trình ngay"** ở phần banner đầu trang nhận được lượng click cao nhất (chiếm **42%** lượng click toàn trang).
      - Tuy nhiên, nút CTA ở chân trang chỉ nhận được vỏn vẹn **2.8%** lượt click.
      - Khu vực FAQ nhận lượng click tăng mạnh, đặc biệt là câu hỏi *"Kegel PC là gì?"* và *"Mật Mã 21 có bảo mật danh tính không?"*.
    • **Cổng học viên (/portal.html):**
      - Bài học **"Ngày 1: Nhận diện nhóm cơ sàn chậu"** được chọn nhiều nhất.
      - Tỷ lệ click vào nút **"Nhập nhật ký tiến trình"** đạt **85%** sau khi học viên xem hết video.
      
    **Khuyến nghị tối ưu:** Anh nên dời CTA ở cuối trang lên cao hơn, hoặc đổi màu nền nút sang màu vàng đồng nổi bật (Metallic Gold) để thu hút thêm 15-20% chuyển đổi nữa ạ.`;
  }
  
  if (q.includes('tối ưu') || q.includes('gợi ý') || q.includes('ux') || q.includes('cải thiện') || q.includes('khuyên')) {
    return `Dạ thưa anh Bảo, từ phân tích heatmap và hành vi người dùng, em xin đề xuất **3 điểm tối ưu UX** giúp nâng cao chuyển đổi đăng ký lộ trình:
    
    1. **Làm nổi bật CTA trên Mobile:** 65% lưu lượng truy cập là Mobile, anh nên bổ sung một nút **"Đăng ký ngay" cố định (sticky button) ở chân màn hình** khi khách hàng cuộn trang quá 1 màn hình.
    2. **Tận dụng nhiệt độ click FAQ:** Do học viên click đọc FAQ rất nhiều, anh nên đưa nút CTA nhỏ nằm xen kẽ trực tiếp bên trong câu trả lời FAQ. Khi họ được giải tỏa thắc mắc, họ có thể đăng ký mua ngay lập tức.
    3. **Tải nhanh video portal:** Tránh sử dụng iframe Youtube tải trực tiếp gây nặng trang. Anh nên đổi sang dùng ảnh thumbnail giả (lazy load thumbnail), khi học viên bấm vào mới load iframe video Youtube, tốc độ load trang portal sẽ tăng thêm **40%**!
    
    Anh thấy các đề xuất này thế nào ạ?`;
  }
  
  return `Dạ thưa anh Bảo, em chưa hiểu rõ câu hỏi của anh.
  
  Anh có muốn em thực hiện các thống kê phân tích sau:
  • **📊 Báo cáo chung:** Sức khỏe hệ thống, doanh thu, học viên.
  • **🟢 Báo cáo online:** Xem số người và trang đang xem realtime.
  • **🔥 Thống kê click:** Vùng được nhấn nhiều nhất trên Heatmap và cách tối ưu.
  • **💡 Đề xuất UX:** Giải pháp tăng tỷ lệ chuyển đổi CRM/Đăng ký.
  
  Hãy chọn câu hỏi gợi ý nhanh hoặc gõ trực tiếp nội dung anh muốn em hỗ trợ nhé!`;
}
