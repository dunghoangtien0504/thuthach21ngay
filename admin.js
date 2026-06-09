// admin.js - Portal Admin Dashboard Logic

const ADMIN_USER = "admin";
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || "123456";

// State
let studentsList = [];
let allowedAccounts = [];
let generatedKeys = JSON.parse(localStorage.getItem('thuthach21ngay_generated_keys')) || [];

// DOM Elements
const adminAuthOverlay = document.getElementById('admin-auth-overlay');
const adminLoginForm = document.getElementById('admin-login-form');
const adminAuthError = document.getElementById('admin-auth-error');
const adminLayout = document.getElementById('admin-layout');
const adminPassInput = document.getElementById('admin-pass');

const menuItems = document.querySelectorAll('.admin-menu-item:not(.mock-item)');
const tabSections = document.querySelectorAll('.admin-tab-section');
const adminHeaderTitle = document.getElementById('admin-header-title');

const dashTotalStudents = document.getElementById('dash-total-students');
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

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupAdminAuth();
  setupMenuSwitcher();
  setupKeyGenerator();
  setupStudentManager();
});

// Admin authentication logic
function setupAdminAuth() {
  // Check session
  const isLogged = sessionStorage.getItem('thuthach21ngay_admin_logged') === 'true';
  if (isLogged) {
    showAdminLayout();
  } else {
    showLoginLayout();
  }

  // Handle Login
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

  // Handle Logout
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
  
  // Load database and render dashboard
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
      adminHeaderTitle.textContent = tabTitle === 'Dashboard' ? 'Tổng quan hoạt động Noli Sales' : `Quản lý: ${tabTitle}`;
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

  // 2. Fetch local storage accounts
  const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];

  // 3. Merge accounts
  // Server-side accounts are loaded as static "active" users.
  // Local storage accounts are user-registered, could be active or pending.
  studentsList = [];

  // Add static server accounts
  allowedAccounts.forEach(acc => {
    studentsList.push({
      name: acc.name,
      email: acc.email,
      date: "01/06/2026",
      key_used: "Hệ thống cấp",
      status: "active"
    });
  });

  // Add local accounts
  localUsers.forEach(acc => {
    // Avoid duplicates
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

  // Update UI Stats
  updateStatsUI();
  renderStudentsTable();
  renderKeysTable();
  renderProgressTable();
}

function updateStatsUI() {
  const count = studentsList.length;
  // Visual stats matching screenshot + localStorage additions
  if (dashTotalStudents) dashTotalStudents.textContent = count;
  if (quickStudentsDesc) quickStudentsDesc.textContent = `${count} tài khoản`;
}

// ==========================================================================
// STUDENTS MANAGEMENT
// ==========================================================================
function setupStudentManager() {
  // Manual student form toggle
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

  // Submit manual student creation
  if (adminStudentForm) {
    adminStudentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('manual-student-name').value.trim();
      const email = document.getElementById('manual-student-email').value.trim();
      const password = document.getElementById('manual-student-password').value.trim();

      const localUsers = JSON.parse(localStorage.getItem('thuthach21ngay_registered_users')) || [];

      // Check duplicates
      const exists = localUsers.some(u => u.email === email) || allowedAccounts.some(u => u.email === email);
      if (exists) {
        alert("Email hoặc số điện thoại này đã tồn tại!");
        return;
      }

      // Add as active immediately
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

      // Reset and reload
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

    // Bind Activation action
    const btnActivate = row.querySelector('.btn-activate');
    if (btnActivate) {
      btnActivate.addEventListener('click', () => {
        activateStudentAccount(student.email);
      });
    }

    // Bind Delete action
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
    alert("Kích hoạt tài khoản thành công!");
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
      // Generate key like: MATMA21-K89D
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars like O/0/I/1
      let randomCode = '';
      for (let i = 0; i < 4; i++) {
        randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const newKey = `MATMA21-${randomCode}`;

      // Save key
      generatedKeys.push(newKey);
      localStorage.setItem('thuthach21ngay_generated_keys', JSON.stringify(generatedKeys));

      // Display UI
      adminKeyResult.textContent = newKey;
      if (btnCopyKey) btnCopyKey.style.display = 'inline-flex';

      loadDatabase();
    });
  }

  if (btnCopyKey) {
    btnCopyKey.addEventListener('click', () => {
      const keyStr = adminKeyResult.textContent;
      navigator.clipboard.writeText(keyStr).then(() => {
        alert(`Đã copy mã kích hoạt: ${keyStr}`);
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

  // Get active session user progress from localStorage
  const activeUserSession = JSON.parse(localStorage.getItem('thuthach21ngay_user_session'));
  const completedLessons = JSON.parse(localStorage.getItem('thuthach21ngay_completed_lessons')) || [];
  const ieltLogs = JSON.parse(localStorage.getItem('thuthach21ngay_logs')) || [];

  studentsList.forEach(student => {
    // Generate realistic progress metrics
    let percent = 0;
    let completedCount = 0;
    let logSnippet = "-";

    // If this is the active student viewing from this browser, get their actual stats
    if (activeUserSession && student.email === activeUserSession.email) {
      const trainingDays = completedLessons.filter(id => id >= 1 && id <= 21);
      completedCount = trainingDays.length;
      percent = Math.round((completedCount / 21) * 100);
      
      if (ieltLogs.length > 0) {
        const last = ieltLogs[ieltLogs.length - 1];
        logSnippet = `Lần cuối: IELT ${last.ielt}s (Tuần ${last.week})`;
      }
    } else {
      // Mock progress stats for other list items
      // Check if we already generated progress for them or set static defaults
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
