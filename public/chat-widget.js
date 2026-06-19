/**
 * chat-widget.js — Tiểu Mễ AI customer support widget
 * Floating chat button + panel, bottom-right, desktop + mobile responsive.
 * RULE: Không cung cấp nội dung bài học — chỉ redirect sang nhóm Telegram.
 */
(function () {
  'use strict';

  // ── Response engine ─────────────────────────────────────────────────────────
  const KB = [
    {
      keys: ['bài học', 'nội dung bài', 'học gì', 'chương trình học', 'giáo trình',
             'học về gì', 'buổi học', 'bài số', 'lesson', 'nội dung khóa',
             'curriculum', 'syllabus', 'tài liệu học'],
      reply: `📌 <b>Nội dung bài học chỉ chia sẻ trong nhóm Telegram riêng của khóa học.</b><br><br>
Sau khi thanh toán thành công, anh sẽ nhận được link vào nhóm — nơi có toàn bộ lộ trình, bài giảng và đội ngũ hỗ trợ mỗi ngày.<br><br>
👉 Chưa có tài khoản? Hỏi mình về cách <b>đăng ký</b> hoặc <b>thanh toán</b> nhé!`,
    },
    {
      keys: ['thanh toán', 'chuyển khoản', 'trả tiền', 'mua khóa', 'mua ngay',
             'đặt mua', 'mã qr', 'qr code', 'stk', 'số tài khoản', 'ngân hàng',
             'payment', 'mua như thế nào', 'mua ở đâu', 'order', 'đặt hàng',
             'sepay', 'chuyển tiền'],
      reply: `💳 <b>Hướng dẫn thanh toán</b><br><br>
<b>Bước 1:</b> Nhấn nút <b>"Đăng Ký Ngay"</b> hoặc <b>"Mua Ngay"</b> trên trang.<br>
<b>Bước 2:</b> Chọn gói phù hợp, điền thông tin đăng ký.<br>
<b>Bước 3:</b> Cửa sổ thanh toán hiện ra với <b>mã QR SePay</b> — quét bằng app ngân hàng bất kỳ.<br>
<b>Bước 4:</b> Chuyển đúng số tiền + điền đúng nội dung chuyển khoản hiển thị trên màn hình.<br>
<b>Bước 5:</b> Hệ thống tự xác nhận trong vài phút. Anh nhận email và truy cập ngay!<br><br>
⚠️ Chờ quá 15 phút mà chưa nhận được xác nhận → nhắn mình để kiểm tra!`,
    },
    {
      keys: ['đăng ký', 'tạo tài khoản', 'tạo account', 'register',
             'chưa có tài khoản', 'mới đăng ký', 'đăng kí', 'sign up'],
      reply: `📝 <b>Cách đăng ký tài khoản</b><br><br>
<b>Bước 1:</b> Nhấn nút <b>"Đăng Ký Miễn Phí"</b> trên trang chủ.<br>
<b>Bước 2:</b> Điền họ tên, email và số điện thoại.<br>
<b>Bước 3:</b> Nhận email xác nhận → nhấn link để kích hoạt tài khoản.<br>
<b>Bước 4:</b> Đăng nhập → chọn và mua khóa học yêu thích.<br><br>
✅ Đăng ký miễn phí, chỉ mất 1 phút!`,
    },
    {
      keys: ['đăng nhập', 'login', 'vào học', 'truy cập', 'không đăng nhập được',
             'quên mật khẩu', 'sai mật khẩu', 'sign in', 'log in', 'mật khẩu'],
      reply: `🔑 <b>Đăng nhập & truy cập khóa học</b><br><br>
<b>Đăng nhập:</b> Nhấn <b>"Đăng Nhập"</b> ở góc trên trang → nhập email + mật khẩu.<br><br>
<b>Quên mật khẩu?</b> Nhấn "Quên mật khẩu?" → nhập email → kiểm tra hộp thư để đặt lại.<br><br>
<b>Sau đăng nhập:</b> Vào mục <b>"Khóa Học Của Tôi"</b> để bắt đầu lộ trình.<br><br>
❓ Vẫn không vào được? Mô tả lỗi cụ thể để mình hỗ trợ nhanh hơn!`,
    },
    {
      keys: ['giá', 'học phí', 'chi phí', 'bao nhiêu tiền', 'giá bao nhiêu',
             'mất bao nhiêu', 'price', 'pricing', 'gói', 'các gói', 'gói học',
             'mật mã 21', 'kegel', 'start stop', 'khóa học có những gì',
             'có những khóa nào', 'khóa học gì'],
      reply: `📚 <b>Các khóa học tại Mật Mã 21</b><br><br>
🔒 <b>Mật Mã 21 — Bản Lĩnh Phái Mạnh</b><br>
Lộ trình 21 ngày khoa học: Kegel, hô hấp, tâm lý & kỹ thuật kiểm soát. Dành cho anh muốn làm chủ thời gian và tự tin hơn trong chuyện phòng the.<br><br>
🏋️ <b>Kegel Khởi Đầu — Miễn Phí</b><br>
Khóa nhập môn kỹ thuật Kegel cơ bản. Anh có thể trải nghiệm trước khi quyết định.<br><br>
💬 Anh muốn biết thêm chi tiết gói nào, hoặc hỏi về <b>thanh toán</b>?`,
    },
    {
      keys: ['lỗi', 'không vào được', 'không học được', 'bị lỗi', 'trang trắng',
             'không hiển thị', 'crash', 'không tải được', 'chậm', 'bug',
             'error', 'không hoạt động', 'trang báo lỗi'],
      reply: `🛠️ <b>Xử lý sự cố kỹ thuật</b><br><br>
Anh thử lần lượt:<br>
<b>1.</b> Làm mới trang (F5 hoặc Ctrl+R)<br>
<b>2.</b> Xóa cache trình duyệt (Ctrl+Shift+Del)<br>
<b>3.</b> Thử trình duyệt khác (Chrome, Firefox, Edge)<br>
<b>4.</b> Kiểm tra kết nối mạng<br>
<b>5.</b> Tắt tiện ích chặn quảng cáo nếu đang dùng<br><br>
Nếu vẫn lỗi → Chụp màn hình và gửi qua <b>Zalo/Telegram</b> để mình hỗ trợ nhanh nhất!`,
    },
    {
      keys: ['hoàn tiền', 'hủy', 'trả lại tiền', 'refund', 'không muốn học',
             'đổi trả', 'bảo hành', 'hoàn lại'],
      reply: `💰 <b>Chính sách hoàn tiền</b><br><br>
Hỗ trợ <b>hoàn tiền trong 7 ngày</b> kể từ ngày mua, với điều kiện chưa hoàn thành quá 20% nội dung khóa học.<br><br>
📩 Gửi yêu cầu về: <b>support@thuthach21ngay.us</b><br>
Ghi rõ: họ tên · email đăng ký · lý do hoàn tiền.<br><br>
Đội ngũ phản hồi trong <b>1–2 ngày làm việc</b>.`,
    },
    {
      keys: ['liên hệ', 'hỗ trợ trực tiếp', 'zalo', 'telegram', 'email support',
             'contact', 'nhắn tin', 'gặp người thật', 'tư vấn trực tiếp',
             'chăm sóc khách hàng', 'hotline', 'số điện thoại hỗ trợ'],
      reply: `📞 <b>Kênh hỗ trợ</b><br><br>
📧 <b>Email:</b> support@thuthach21ngay.us<br>
💬 <b>Zalo / Telegram:</b> Nhắn tin trực tiếp — phản hồi trong 30 phút (giờ hành chính).<br>
👥 <b>Nhóm Telegram:</b> Sau khi mua khóa, anh được vào nhóm riêng có hỗ trợ hằng ngày.<br><br>
⏰ Giờ hỗ trợ: <b>8:00 – 22:00</b> mỗi ngày.`,
    },
    {
      keys: ['xin chào', 'chào', 'hello', 'hi', 'hey', 'alo', 'cho hỏi', 'bắt đầu'],
      reply: `Xin chào anh! 👋 Mình là <b>Tiểu Mễ</b>, trợ lý của <b>Mật Mã 21</b>.<br><br>
Mình hỗ trợ anh về:<br>
• 💳 Hướng dẫn thanh toán<br>
• 📝 Đăng ký tài khoản<br>
• 🔑 Truy cập khóa học<br>
• 📚 Thông tin các gói học<br>
• 🛠️ Sự cố kỹ thuật<br>
• 📞 Liên hệ đội ngũ<br><br>
Anh cần hỗ trợ gì?`,
    },
  ];

  const DEFAULT_REPLY = `Mình chưa hiểu rõ câu hỏi của anh 🤔<br><br>
Anh có thể hỏi về:<br>
• <b>Thanh toán</b> — cách chuyển khoản, QR<br>
• <b>Đăng ký</b> — tạo tài khoản mới<br>
• <b>Đăng nhập</b> — vào học<br>
• <b>Giá</b> — các gói học<br>
• <b>Lỗi</b> — xử lý sự cố<br>
• <b>Liên hệ</b> — kênh hỗ trợ<br><br>
Hoặc nhắn cụ thể hơn để mình hiểu và hỗ trợ đúng nhé!`;

  function getReply(text) {
    const q = text.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')  // strip diacritics for matching
      .normalize('NFC');
    // Also try original for exact Vietnamese matches
    const orig = text.toLowerCase();
    for (const item of KB) {
      if (item.keys.some(k => orig.includes(k) || q.includes(
        k.normalize('NFD').replace(/[̀-ͯ]/g, '')
      ))) {
        return item.reply;
      }
    }
    return DEFAULT_REPLY;
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('tm-css')) return;
    const s = document.createElement('style');
    s.id = 'tm-css';
    s.textContent = `
/* ── Tiểu Mễ Widget ───────────────────────────────────────────── */
#tm-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  font-family: 'Raleway', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

/* Toggle button */
#tm-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0D2B1A 0%, #1B442D 100%);
  border: 3px solid #D4AF37;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px -4px rgba(13,43,26,0.5);
  transition: transform 0.25s, box-shadow 0.25s;
  position: relative;
  margin-left: auto;
  animation: tmPulse 3s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
}
@keyframes tmPulse {
  0%,100% { box-shadow: 0 8px 24px -4px rgba(13,43,26,0.5), 0 0 0 0 rgba(212,175,55,0.35); }
  50%      { box-shadow: 0 8px 24px -4px rgba(13,43,26,0.5), 0 0 0 9px rgba(212,175,55,0); }
}
#tm-toggle:hover { transform: scale(1.08); animation: none; }
#tm-toggle.open  { animation: none; background: linear-gradient(135deg, #1B442D,#2a5c3f); }

.tm-ico-chat { font-size: 26px; transition: opacity 0.15s; }
.tm-ico-close { display: none; color: #D4AF37; font-size: 20px; }
#tm-toggle.open .tm-ico-chat  { display: none; }
#tm-toggle.open .tm-ico-close { display: block; }

#tm-dot {
  position: absolute;
  top: -1px; right: -1px;
  width: 15px; height: 15px;
  background: #C0390E;
  border-radius: 50%;
  border: 2px solid #FBF9F4;
  display: none;
}
#tm-dot.show { display: block; animation: tmBounce 0.4s ease; }
@keyframes tmBounce { 0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)} }

/* Chat window */
#tm-win {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 360px;
  height: 520px;
  background: #FBF9F4;
  border-radius: 20px;
  box-shadow: 0 24px 60px -10px rgba(13,43,26,0.28), 0 0 0 1px rgba(13,43,26,0.07);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
  transform: scale(0.88) translateY(12px);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.24s cubic-bezier(0.22,1,0.36,1),
              opacity  0.24s cubic-bezier(0.22,1,0.36,1);
}
#tm-win.open {
  transform: scale(1) translateY(0);
  opacity: 1;
  pointer-events: all;
}

/* Header */
.tm-hdr {
  background: linear-gradient(135deg, #0D2B1A 0%, #1a3d28 100%);
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
}
.tm-hdr-av {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg,#D4AF37,#B8860B);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0; position: relative;
}
.tm-online {
  position: absolute; bottom: 1px; right: 1px;
  width: 10px; height: 10px;
  background: #22c55e; border-radius: 50%;
  border: 2px solid #0D2B1A;
}
.tm-hdr-info { flex: 1; min-width: 0; }
.tm-hdr-name  { font-size: 14.5px; font-weight: 800; color: #D4AF37; }
.tm-hdr-sub   { font-size: 11px; color: rgba(212,175,55,0.6); margin-top: 1px; }
.tm-hdr-x {
  background: none; border: none; color: rgba(212,175,55,0.55);
  cursor: pointer; padding: 4px; border-radius: 6px;
  font-size: 16px; transition: color 0.18s; flex-shrink: 0;
  line-height: 1;
}
.tm-hdr-x:hover { color: #D4AF37; }

/* Messages */
.tm-msgs {
  flex: 1; overflow-y: auto; padding: 14px;
  display: flex; flex-direction: column; gap: 10px;
  scroll-behavior: smooth;
}
.tm-msgs::-webkit-scrollbar { width: 4px; }
.tm-msgs::-webkit-scrollbar-thumb { background: rgba(13,43,26,0.1); border-radius: 2px; }

.tm-m {
  display: flex; gap: 7px;
  animation: tmIn 0.2s ease-out;
}
@keyframes tmIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
.tm-m.me { flex-direction: row-reverse; }

.tm-av {
  width: 27px; height: 27px; border-radius: 50%;
  background: linear-gradient(135deg,#D4AF37,#B8860B);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; flex-shrink: 0; align-self: flex-end;
}
.tm-b {
  max-width: 83%; padding: 9px 12px;
  font-size: 13px; line-height: 1.55;
  color: #0E2519;
}
.tm-m.bot .tm-b {
  background: #fff; border-radius: 4px 14px 14px 14px;
  box-shadow: 0 2px 8px -2px rgba(13,43,26,0.08);
}
.tm-m.me .tm-b {
  background: linear-gradient(135deg,#0D2B1A,#1B442D);
  color: #D4AF37; border-radius: 14px 4px 14px 14px;
}

/* Typing indicator */
.tm-typing { display: flex; gap: 7px; align-items: flex-end; }
.tm-dots {
  background: #fff; border-radius: 4px 14px 14px 14px;
  padding: 9px 13px; display: flex; gap: 4px; align-items: center;
  box-shadow: 0 2px 8px -2px rgba(13,43,26,0.08);
}
.tm-dots span {
  width: 6px; height: 6px; background: #0D2B1A;
  border-radius: 50%; opacity: 0.25;
  animation: tmDot 1.2s infinite;
}
.tm-dots span:nth-child(2) { animation-delay: .2s; }
.tm-dots span:nth-child(3) { animation-delay: .4s; }
@keyframes tmDot {
  0%,80%,100% { opacity:.25; transform:scale(.8); }
  40%          { opacity:1;   transform:scale(1); }
}

/* Quick replies */
.tm-qr {
  display: flex; flex-wrap: wrap; gap: 6px;
  padding: 0 14px 10px; flex-shrink: 0;
}
.tm-q {
  background: #fff; border: 1.5px solid rgba(13,43,26,0.12);
  border-radius: 50px; padding: 5px 11px;
  font-size: 12px; font-family: inherit; color: #0D2B1A;
  cursor: pointer; transition: all 0.17s; white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}
.tm-q:hover, .tm-q:active {
  background: #0D2B1A; color: #D4AF37; border-color: #0D2B1A;
}

/* Input bar */
.tm-bar {
  padding: 9px 11px; border-top: 1px solid rgba(13,43,26,0.07);
  display: flex; gap: 7px; align-items: flex-end;
  background: #fff; flex-shrink: 0;
}
.tm-inp {
  flex: 1; border: 1.5px solid rgba(13,43,26,0.12);
  border-radius: 11px; padding: 8px 12px;
  font-family: inherit; font-size: 13px;
  color: #0E2519; background: #FBF9F4;
  outline: none; resize: none;
  min-height: 38px; max-height: 96px;
  transition: border-color 0.18s, box-shadow 0.18s;
  line-height: 1.45; overflow-y: auto;
}
.tm-inp:focus {
  border-color: #B8860B;
  box-shadow: 0 0 0 3px rgba(184,134,11,0.09);
  background: #fff;
}
.tm-inp::placeholder { color: #8FA497; }
.tm-send {
  width: 36px; height: 36px; border-radius: 9px;
  background: linear-gradient(135deg,#0D2B1A,#1B442D);
  border: none; color: #D4AF37; font-size: 14px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: transform 0.18s, box-shadow 0.18s; flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}
.tm-send:hover { transform: scale(1.1); box-shadow: 0 4px 12px -2px rgba(13,43,26,0.4); }
.tm-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.tm-foot {
  text-align: center; font-size: 10px; color: #8FA497;
  padding: 4px 0 7px; flex-shrink: 0; letter-spacing: 0.2px;
}

/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 540px) {
  #tm-widget { bottom: 16px; right: 16px; }
  #tm-toggle { width: 54px; height: 54px; }
  #tm-toggle.open { display: none; } /* close via header X on mobile */

  #tm-win {
    position: fixed;
    bottom: 0; right: 0; left: 0;
    width: 100%; height: 88vh; max-height: 88vh;
    border-radius: 20px 20px 0 0;
    transform-origin: bottom center;
    transform: translateY(100%);
    opacity: 0;
  }
  #tm-win.open { transform: translateY(0); opacity: 1; }

  .tm-b { font-size: 13.5px; }
  .tm-q  { font-size: 12.5px; padding: 6px 12px; }
  .tm-inp { font-size: 14px; }
}
@media (max-width: 360px) {
  #tm-win { height: 94vh; max-height: 94vh; }
}
    `;
    document.head.appendChild(s);
  }

  // ── HTML ────────────────────────────────────────────────────────────────────
  function injectHTML() {
    if (document.getElementById('tm-widget')) return;

    const wrap = document.createElement('div');
    wrap.id = 'tm-widget';
    wrap.setAttribute('aria-label', 'Chat hỗ trợ Tiểu Mễ');
    wrap.innerHTML = `
      <div id="tm-win" role="dialog" aria-modal="true" aria-label="Tiểu Mễ — Hỗ trợ khách hàng">
        <div class="tm-hdr">
          <div class="tm-hdr-av">🌿<div class="tm-online"></div></div>
          <div class="tm-hdr-info">
            <div class="tm-hdr-name">Tiểu Mễ</div>
            <div class="tm-hdr-sub">Trợ lý Mật Mã 21 · Đang hoạt động</div>
          </div>
          <button class="tm-hdr-x" id="tm-hdr-x" aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="tm-msgs" id="tm-msgs" aria-live="polite" aria-atomic="false"></div>

        <div class="tm-qr" id="tm-qr">
          <button class="tm-q" data-q="Cách thanh toán">💳 Thanh toán</button>
          <button class="tm-q" data-q="Cách đăng ký tài khoản">📝 Đăng ký</button>
          <button class="tm-q" data-q="Giá các gói khóa học">📚 Giá &amp; Gói</button>
          <button class="tm-q" data-q="Bị lỗi không vào được">🛠️ Sự cố</button>
          <button class="tm-q" data-q="Liên hệ hỗ trợ">📞 Liên hệ</button>
        </div>

        <div class="tm-bar">
          <textarea class="tm-inp" id="tm-inp" placeholder="Nhắn tin cho Tiểu Mễ..." rows="1" aria-label="Nhập tin nhắn"></textarea>
          <button class="tm-send" id="tm-send" aria-label="Gửi tin nhắn"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
        <div class="tm-foot">Mật Mã 21 · Hỗ trợ 8:00–22:00 hằng ngày</div>
      </div>

      <button id="tm-toggle" aria-label="Mở chat hỗ trợ" aria-expanded="false">
        <span class="tm-ico-chat">🌿</span>
        <i class="tm-ico-close fa-solid fa-xmark"></i>
        <span id="tm-dot"></span>
      </button>
    `;
    document.body.appendChild(wrap);
  }

  // ── Core logic ───────────────────────────────────────────────────────────────
  let open = false;
  let busy = false;
  let greeted = false;

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
  }

  function addMsg(html, role) {
    const box = document.getElementById('tm-msgs');
    const el = document.createElement('div');
    el.className = `tm-m ${role}`;
    if (role === 'bot') {
      el.innerHTML = `<div class="tm-av">🌿</div><div class="tm-b">${html}</div>`;
    } else {
      el.innerHTML = `<div class="tm-b">${esc(html)}</div>`;
    }
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function showTyping() {
    const box = document.getElementById('tm-msgs');
    const el = document.createElement('div');
    el.id = 'tm-typing';
    el.className = 'tm-typing';
    el.innerHTML = `<div class="tm-av">🌿</div><div class="tm-dots"><span></span><span></span><span></span></div>`;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('tm-typing');
    if (el) el.remove();
  }

  function send(text) {
    if (!text.trim() || busy) return;
    busy = true;

    addMsg(text, 'me');
    const inp = document.getElementById('tm-inp');
    if (inp) { inp.value = ''; inp.style.height = 'auto'; }

    // Hide quick replies after first real message
    const qr = document.getElementById('tm-qr');
    if (qr) qr.style.display = 'none';

    showTyping();
    const delay = 700 + Math.random() * 500;
    setTimeout(() => {
      removeTyping();
      addMsg(getReply(text), 'bot');
      busy = false;
    }, delay);
  }

  function toggle() {
    open = !open;
    const btn = document.getElementById('tm-toggle');
    const win = document.getElementById('tm-win');
    const dot = document.getElementById('tm-dot');

    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    win.classList.toggle('open', open);
    if (dot) dot.classList.remove('show');

    if (open && !greeted) {
      greeted = true;
      busy = true;
      showTyping();
      setTimeout(() => {
        removeTyping();
        addMsg(
          `Xin chào anh! 👋 Mình là <b>Tiểu Mễ</b>, trợ lý hỗ trợ của <b>Mật Mã 21</b>.<br><br>` +
          `Mình giúp được anh về thanh toán, đăng ký tài khoản, truy cập khóa học và sự cố kỹ thuật.<br><br>` +
          `Anh cần hỗ trợ gì?`,
          'bot'
        );
        busy = false;
      }, 900);
      setTimeout(() => document.getElementById('tm-inp')?.focus(), 350);
    }
  }

  // ── Init ────────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    injectHTML();

    document.getElementById('tm-toggle').addEventListener('click', toggle);
    document.getElementById('tm-hdr-x').addEventListener('click', toggle);

    const send_btn = document.getElementById('tm-send');
    const inp = document.getElementById('tm-inp');

    send_btn.addEventListener('click', () => send(inp.value));

    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send(inp.value);
      }
    });

    inp.addEventListener('input', () => {
      inp.style.height = 'auto';
      inp.style.height = Math.min(inp.scrollHeight, 96) + 'px';
    });

    document.getElementById('tm-qr').addEventListener('click', e => {
      const btn = e.target.closest('.tm-q');
      if (btn) send(btn.dataset.q);
    });

    // Show notification dot after 10s if not opened yet
    setTimeout(() => {
      if (!open) document.getElementById('tm-dot').classList.add('show');
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
