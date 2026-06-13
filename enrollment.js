/**
 * enrollment.js — Course enrollment modal for Mật Mã 21
 * Shows after login when user hasn't enrolled in a specific course.
 * Saves enrollment to Supabase + notifies via Telegram.
 */

import { supabase, isSupabaseEnabled } from './supabase.js';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID   = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';
const LS_ENROLLMENTS     = 'mm21_course_enrollments';

// ── Inject modal HTML ──────────────────────────────────────────────────────
function injectEnrollmentModal() {
  if (document.getElementById('enroll-modal')) return;

  document.head.insertAdjacentHTML('beforeend', `
    <style>
      #enroll-modal {
        display: none; position: fixed; inset: 0;
        background: rgba(13,43,26,0.65); backdrop-filter: blur(8px);
        z-index: 2100; align-items: center; justify-content: center; padding: 20px;
      }
      #enroll-modal.open { display: flex; }
      .enroll-box {
        background: #fff; border-radius: 24px;
        width: 100%; max-width: 460px;
        padding: 40px 36px; position: relative;
        box-shadow: 0 30px 60px -10px rgba(13,43,26,0.35);
        animation: enrollSlide 0.28s cubic-bezier(0.22,1,0.36,1);
      }
      @keyframes enrollSlide {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .enroll-close {
        position: absolute; top: 16px; right: 18px;
        background: none; border: none; font-size: 22px;
        color: #8FA497; cursor: pointer;
      }
      .enroll-close:hover { color: #0D2B1A; }
      .enroll-badge {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 14px; border-radius: 50px;
        background: #F0FDF4; color: #166534;
        font-size: 12px; font-weight: 700;
        margin-bottom: 16px;
      }
      .enroll-title {
        font-family: 'Lora', Georgia, serif;
        font-size: 22px; font-weight: 700; color: #0D2B1A;
        margin-bottom: 8px;
      }
      .enroll-course-name {
        font-size: 14px; color: #485A4F;
        background: #FBF9F4; padding: 10px 14px;
        border-radius: 8px; margin-bottom: 22px;
        border-left: 3px solid #B8860B;
        font-weight: 600;
      }
      .enroll-form-group { margin-bottom: 16px; }
      .enroll-form-group label {
        display: block; font-size: 13px; font-weight: 700;
        color: #0D2B1A; margin-bottom: 6px;
      }
      .enroll-form-group input,
      .enroll-form-group select,
      .enroll-form-group textarea {
        width: 100%; padding: 12px 14px;
        border: 1.5px solid rgba(13,43,26,0.12);
        border-radius: 10px; font-family: inherit;
        font-size: 14px; color: #0D2B1A;
        background: #FBF9F4; outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }
      .enroll-form-group textarea { resize: vertical; min-height: 80px; }
      .enroll-form-group input:focus,
      .enroll-form-group select:focus,
      .enroll-form-group textarea:focus {
        border-color: #B8860B;
        box-shadow: 0 0 0 3px rgba(184,134,11,0.1);
        background: #fff;
      }
      .enroll-submit-btn {
        width: 100%; padding: 15px;
        background: linear-gradient(135deg, #0D2B1A 0%, #1B442D 100%);
        color: #D4AF37; border: none; border-radius: 50px;
        font-family: inherit; font-size: 15px; font-weight: 800;
        cursor: pointer; margin-top: 8px;
        transition: all 0.25s;
        display: flex; align-items: center; justify-content: center; gap: 8px;
      }
      .enroll-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -4px rgba(13,43,26,0.35); }
      .enroll-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
      .enroll-privacy {
        margin-top: 14px; font-size: 11.5px;
        color: #8FA497; text-align: center;
      }
      /* Success */
      .enroll-success {
        display: none; text-align: center; padding: 10px 0;
      }
      .enroll-success .s-icon { font-size: 52px; margin-bottom: 14px; display: block; }
      .enroll-success h3 {
        font-family: 'Lora', Georgia, serif;
        font-size: 20px; color: #0D2B1A; margin-bottom: 8px;
      }
      .enroll-success p { font-size: 14px; color: #485A4F; line-height: 1.6; }
      .enroll-success .continue-btn {
        display: inline-flex; align-items: center; gap: 8px;
        margin-top: 18px; padding: 12px 28px;
        background: #0D2B1A; color: #D4AF37;
        border-radius: 50px; text-decoration: none;
        font-weight: 700; font-size: 14px; border: none;
        cursor: pointer; font-family: inherit;
        transition: background 0.2s;
      }
      .enroll-success .continue-btn:hover { background: #1B442D; }
    </style>
  `);

  document.body.insertAdjacentHTML('beforeend', `
    <div id="enroll-modal" role="dialog" aria-modal="true" aria-labelledby="enroll-title">
      <div class="enroll-box">
        <button class="enroll-close" id="enroll-close-btn" aria-label="Đóng">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div id="enroll-form-wrap">
          <div class="enroll-badge">
            <i class="fa-solid fa-book-open"></i> Đăng Ký Khóa Học
          </div>
          <h2 class="enroll-title" id="enroll-title">Tham Gia Lộ Trình</h2>
          <div class="enroll-course-name" id="enroll-course-display">Đang tải...</div>

          <form id="enroll-form" novalidate>
            <input type="hidden" id="enroll-course-id">
            <input type="hidden" id="enroll-course-name-hidden">

            <div class="enroll-form-group">
              <label for="enroll-name">Họ và Tên</label>
              <input type="text" id="enroll-name" placeholder="Họ tên của anh..." required>
            </div>

            <div class="enroll-form-group">
              <label for="enroll-email">Email</label>
              <input type="email" id="enroll-email" placeholder="email@example.com" required>
            </div>

            <div class="enroll-form-group">
              <label for="enroll-phone">Số điện thoại</label>
              <input type="tel" id="enroll-phone" placeholder="0912 345 678">
            </div>

            <div class="enroll-form-group">
              <label for="enroll-goal">Mục tiêu của anh khi tham gia khóa học này?</label>
              <select id="enroll-goal">
                <option value="">-- Chọn mục tiêu --</option>
                <option value="kiem_soat">Kiểm soát thời gian xuất tinh tốt hơn</option>
                <option value="tu_tin">Tăng sự tự tin trong chuyện phòng the</option>
                <option value="quan_he">Cải thiện chất lượng quan hệ với bạn đời</option>
                <option value="hieu_biet">Hiểu rõ cơ thể và sức khỏe sinh lý</option>
                <option value="khac">Mục tiêu khác</option>
              </select>
            </div>

            <div class="enroll-form-group">
              <label for="enroll-note">Chia sẻ thêm (không bắt buộc)</label>
              <textarea id="enroll-note" placeholder="Tình trạng hiện tại, câu hỏi hoặc kỳ vọng..."></textarea>
            </div>

            <button type="submit" class="enroll-submit-btn" id="enroll-submit-btn">
              <i class="fa-solid fa-check-circle"></i> Xác Nhận Đăng Ký
            </button>
          </form>
          <p class="enroll-privacy">
            <i class="fa-solid fa-lock"></i>
            Thông tin của anh được bảo mật hoàn toàn.
          </p>
        </div>

        <div class="enroll-success" id="enroll-success">
          <span class="s-icon">🎉</span>
          <h3>Đăng Ký Thành Công!</h3>
          <p>Anh đã đăng ký tham gia khóa học. Hãy bắt đầu lộ trình ngay bây giờ!</p>
          <button class="continue-btn" id="enroll-continue-btn">
            <i class="fa-solid fa-play-circle"></i> Bắt Đầu Học
          </button>
        </div>
      </div>
    </div>
  `);
}

// ── Open enrollment modal ──────────────────────────────────────────────────
function openEnrollModal(courseId, courseName, userSession) {
  injectEnrollmentModal();

  document.getElementById('enroll-course-id').value = courseId;
  document.getElementById('enroll-course-name-hidden').value = courseName;
  document.getElementById('enroll-course-display').textContent = courseName;

  // Pre-fill user info if logged in
  if (userSession) {
    const nameEl  = document.getElementById('enroll-name');
    const emailEl = document.getElementById('enroll-email');
    const phoneEl = document.getElementById('enroll-phone');
    if (nameEl  && userSession.name)  nameEl.value  = userSession.name;
    if (emailEl && userSession.email) emailEl.value = userSession.email;
    if (phoneEl && userSession.phone) phoneEl.value = userSession.phone;
  }

  // Reset state
  document.getElementById('enroll-form-wrap').style.display = '';
  document.getElementById('enroll-success').style.display = 'none';

  const modal = document.getElementById('enroll-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Wire events (once)
  if (!modal.dataset.wired) {
    modal.dataset.wired = '1';
    document.getElementById('enroll-close-btn').addEventListener('click', closeEnrollModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeEnrollModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeEnrollModal(); });
    document.getElementById('enroll-form').addEventListener('submit', handleEnrollSubmit);
    document.getElementById('enroll-continue-btn').addEventListener('click', () => {
      closeEnrollModal();
      // Optionally trigger course start callback
      if (typeof window._enrollContinueCallback === 'function') window._enrollContinueCallback();
    });
  }
}

function closeEnrollModal() {
  const modal = document.getElementById('enroll-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Check if user is already enrolled ─────────────────────────────────────
async function isEnrolled(userId, courseId) {
  if (isSupabaseEnabled && userId) {
    const { data } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();
    if (data) return true;
  }
  // localStorage fallback
  const local = JSON.parse(localStorage.getItem(LS_ENROLLMENTS) || '[]');
  return local.some(e => e.course_id === courseId);
}

// ── Handle enrollment form submit ──────────────────────────────────────────
async function handleEnrollSubmit(e) {
  e.preventDefault();

  const courseId   = document.getElementById('enroll-course-id').value;
  const courseName = document.getElementById('enroll-course-name-hidden').value;
  const name       = document.getElementById('enroll-name').value.trim();
  const email      = document.getElementById('enroll-email').value.trim().toLowerCase();
  const phone      = document.getElementById('enroll-phone').value.trim();
  const goal       = document.getElementById('enroll-goal').value;
  const note       = document.getElementById('enroll-note').value.trim();

  if (!name || !email) {
    alert('Vui lòng điền họ tên và email.');
    return;
  }

  const btn = document.getElementById('enroll-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang đăng ký...';

  const enrollment = {
    course_id:   courseId,
    course_name: courseName,
    name,
    email,
    phone,
    goal,
    note,
    enrolled_at: new Date().toISOString(),
  };

  // ── Save to Supabase ─────────────────────────────────────────────────────
  if (isSupabaseEnabled) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('course_enrollments').upsert({
        user_id:     session.user.id,
        course_id:   courseId,
        course_name: courseName,
        status:      'active',
        enrolled_at: enrollment.enrolled_at,
      }, { onConflict: 'user_id,course_id' });
    }
  }

  // ── Save locally as fallback ────────────────────────────────────────────
  const local = JSON.parse(localStorage.getItem(LS_ENROLLMENTS) || '[]');
  if (!local.some(e => e.course_id === courseId && e.email === email)) {
    local.push(enrollment);
    localStorage.setItem(LS_ENROLLMENTS, JSON.stringify(local));
  }

  // ── Telegram notification ────────────────────────────────────────────────
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const goalLabels = {
      kiem_soat: 'Kiểm soát thời gian xuất tinh',
      tu_tin: 'Tăng sự tự tin',
      quan_he: 'Cải thiện quan hệ',
      hieu_biet: 'Hiểu rõ cơ thể',
      khac: 'Khác'
    };
    const msg = `📚 *Đăng Ký Khóa Học Mới*\n\n• Khóa học: *${courseName}*\n• Họ tên: *${name}*\n• Email: \`${email}\`\n• SĐT: \`${phone || 'N/A'}\`\n• Mục tiêu: ${goalLabels[goal] || 'N/A'}\n• Ghi chú: ${note || 'Không có'}\n• Thời gian: _${new Date(enrollment.enrolled_at).toLocaleString('vi-VN')}_`;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: 'Markdown' })
      });
    } catch (_) {}
  }

  btn.disabled = false;

  // Show success
  document.getElementById('enroll-form-wrap').style.display = 'none';
  document.getElementById('enroll-success').style.display = 'block';
}

export { openEnrollModal, closeEnrollModal, isEnrolled };
