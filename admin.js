// admin.js - Portal Admin Dashboard Logic

const ADMIN_USER = "admin";
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || "123456";

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

// State
let studentsList = [];
let allowedAccounts = [];
let generatedKeys = JSON.parse(localStorage.getItem('thuthach21ngay_generated_keys')) || [];
let courseData = [];
let blogPosts = JSON.parse(localStorage.getItem('thuthach21ngay_blog_posts')) || [];

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
});

// Admin authentication logic
function setupAdminAuth() {
  const isLogged = sessionStorage.getItem('thuthach21ngay_admin_logged') === 'true';
  if (isLogged) {
    showAdminLayout();
  } else {
    showLoginLayout();
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (adminAuthError) adminAuthError.style.display = 'none';

      const pass = adminPassInput.value.trim();

      if (pass === ADMIN_PASS) {
        sessionStorage.setItem('thuthach21ngay_admin_logged', 'true');
        showAdminLayout();
      } else {
        if (adminAuthError) adminAuthError.style.display = 'block';
        adminPassInput.value = '';
        adminPassInput.focus();
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      if (confirm("Bạn có muốn đăng xuất khỏi trang Quản trị không?")) {
        sessionStorage.removeItem('thuthach21ngay_admin_logged');
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
      document.getElementById(targetId).style.display = 'block';

      // Update Header Title
      const tabTitle = item.querySelector('button').textContent.trim();
      adminHeaderTitle.textContent = tabTitle === 'Dashboard' ? 'Tổng quan hoạt động Mật Mã 21' : `Quản lý: ${tabTitle}`;
    });
  });
}

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

  // 3. Fetch local storage accounts
  const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];

  // 4. Merge accounts
  studentsList = [];

  allowedAccounts.forEach(acc => {
    studentsList.push({
      name: acc.name,
      email: acc.email,
      date: "01/06/2026",
      key_used: "Hệ thống cấp",
      status: "active"
    });
  });

  localUsers.forEach(acc => {
    if (!studentsList.some(s => s.email === acc.email)) {
      studentsList.push({
        name: acc.name,
        email: acc.email,
        date: acc.date || new Date().toLocaleDateString('vi-VN'),
        key_used: acc.key_used || "-",
        status: acc.status
      });
    }
  });

  // Update UI components
  updateStatsUI();
  renderStudentsTable();
  renderKeysTable();
  renderProgressTable();
  renderLessonsTable();
  renderBlogTable();
  renderCertsTable();
  renderHomeworkTable();
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
  
  // Calculate mock revenue based on active local students
  const activeLocalCount = studentsList.filter(s => s.status === 'active' && s.key_used !== "Hệ thống cấp").length;
  // Let's say each paid VITE_PRICE
  const revenueVal = activeLocalCount * 686.868;
  if (dashTotalRevenue) dashTotalRevenue.textContent = revenueVal > 0 ? `${revenueVal.toFixed(3)}đ` : "0.0đ";
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
        <td style="font-size: 13px; font-weight: 600;">${lesson.title}</td>
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
      <td><strong>${post.title}</strong></td>
      <td>${post.author}</td>
      <td>${post.date}</td>
      <td style="max-width: 250px; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${post.summary}</td>
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
    adminStudentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('manual-student-name').value.trim();
      const email = document.getElementById('manual-student-email').value.trim();
      const password = document.getElementById('manual-student-password').value.trim();

      const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];

      const exists = localUsers.some(u => u.email === email) || allowedAccounts.some(u => u.email === email);
      if (exists) {
        showToast("Email hoặc số điện thoại này đã tồn tại!", 'error');
        return;
      }

      const newUser = {
        name,
        email,
        password,
        status: "active",
        key_used: "Admin cấp trực tiếp",
        date: new Date().toLocaleDateString('vi-VN')
      };

      localUsers.push(newUser);
      localStorage.setItem('thuthach21ngay_registered_users', JSON.stringify(localUsers));

      adminStudentForm.reset();
      if (manualStudentPanel) manualStudentPanel.style.display = 'none';
      loadDatabase();
    });
  }
}

function renderStudentsTable() {
  if (!adminStudentsList) return;
  adminStudentsList.innerHTML = '';

  studentsList.forEach(student => {
    const isLocal = !allowedAccounts.some(u => u.email === student.email);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${student.name}</strong></td>
      <td>${student.email}</td>
      <td>${student.date}</td>
      <td>${student.key_used}</td>
      <td>
        <span class="badge-status ${student.status === 'active' ? 'active' : 'pending'}">
          ${student.status === 'active' ? 'Đã kích hoạt' : 'Chờ duyệt'}
        </span>
      </td>
      <td>
        <div class="admin-table-actions">
          ${student.status === 'pending' ? `
            <button class="btn btn-success btn-sm btn-activate" data-email="${student.email}">
              Kích hoạt
            </button>
          ` : ''}
          ${isLocal ? `
            <button class="btn btn-danger btn-sm btn-delete-student" data-email="${student.email}">
              Xóa
            </button>
          ` : `<span style="font-size: 11px; color: var(--text-dimmed); font-style: italic;">Hệ thống</span>`}
        </div>
      </td>
    `;

    const btnActivate = row.querySelector('.btn-activate');
    if (btnActivate) {
      btnActivate.addEventListener('click', () => {
        activateStudentAccount(student.email);
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
