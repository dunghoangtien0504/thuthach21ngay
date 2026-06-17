/**
 * Email sequences data for FORMEN automated email system.
 * All 3 sequences: registered, buyer_kegel, buyer_mm21
 * Content is Vietnamese, plain-text style HTML.
 */

const KEGEL_URL = 'https://www.thuthach21ngay.org/kegel-khoi-dau';
const MM21_URL  = 'https://www.thuthach21ngay.org/#offer-section';
const SUPP_URL  = 'https://www.thuthach21ngay.org/#supplement';
const TG_GROUP  = 'https://web.telegram.org/a/#-5282773244';

function wrap(body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 24px;color:#1a1a1a;font-size:16px;line-height:1.8;">
${body}
<hr style="border:none;border-top:1px solid #eeeeee;margin:32px 0;">
<p style="font-size:12px;color:#aaaaaa;">FORMEN · <a href="{{unsubscribe}}" style="color:#aaaaaa;">Hủy đăng ký</a></p>
</div></body></html>`;
}

// ─── LUỒNG 1: REGISTERED → KEGEL → MM21 ──────────────────────────────────
// 15 emails · Day 0,2,5,8,11,14,17,20,23,26,29,32,35,38,41
// Ratio 4 value : 1 sales
const REGISTERED = [
  {
    day: 0,
    subject: 'chào anh — tôi là FORMEN',
    body: wrap(`<p>Anh vừa đăng ký vào hệ thống FORMEN.</p>
<p>Tôi không biết lý do chính xác của anh. Nhưng tôi đoán được một phần.</p>
<p>Có điều gì đó liên quan đến sức khỏe nam giới mà anh muốn cải thiện. Điều mà anh không dễ nói với ai. Dù là bạn bè, hay bác sĩ, hay ngay cả người thân.</p>
<p>Tôi hiểu cảm giác đó.</p>
<p>FORMEN được xây dựng cho những người như anh — những người muốn giải quyết vấn đề một cách khoa học, riêng tư, và thật sự hiệu quả.</p>
<p>Trong những ngày tới tôi sẽ gửi cho anh một số thông tin thực tế. Không phải để bán hàng ngay. Mà để anh hiểu rõ hơn về cơ thể mình.</p>
<p>—<br>FORMEN</p>
<p style="font-size:13px;color:#888;">P.S. Nếu anh muốn bắt đầu ngay — <a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu là bước đầu tiên</a>. 7 ngày, 10 phút/ngày, 199.000đ.</p>`)
  },
  {
    day: 2,
    subject: 'có bao nhiêu đàn ông đang giả vờ ổn?',
    body: wrap(`<p>30% nam giới trưởng thành ở Việt Nam gặp vấn đề kiểm soát trong quan hệ. Nhưng chỉ 6% tìm đến bác sĩ.</p>
<p>Số còn lại? Họ im lặng. Thử thuốc. Thử gel. Đọc bài online lúc 2 giờ sáng. Rồi nói với bạn đời "hôm nay mệt thôi."</p>
<p>Rồi tiếp tục sống như vậy.</p>
<p>Anh không phải người duy nhất. Và quan trọng hơn — vấn đề này giải quyết được. Không phải bằng thuốc. Mà bằng phương pháp đúng, áp dụng đúng cách.</p>
<p>Kegel là bước đầu tiên mà khoa học đã chứng minh. Không phức tạp. Không cần dụng cụ. Không ai biết anh đang làm.</p>
<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Xem Kegel Khởi Đầu — 7 ngày, 199.000đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 5,
    subject: 'tại sao 80% đàn ông thử thuốc rồi vẫn thất vọng',
    body: wrap(`<p>Thuốc và gel tác động vào triệu chứng. Nhưng nguyên nhân thật sự nằm ở 5 hệ thống khác nhau:</p>
<ol style="padding-left:20px;line-height:2.2;">
  <li><strong>Cơ sàn chậu</strong> — nhóm cơ kiểm soát trực tiếp</li>
  <li><strong>Hệ thần kinh tự chủ</strong> — phản xạ tự động của cơ thể</li>
  <li><strong>Nội tiết tố</strong> — testosterone và cortisol</li>
  <li><strong>Tâm lý</strong> — lo lắng tạo ra vòng lặp tự cản</li>
  <li><strong>Tuần hoàn máu</strong> — ảnh hưởng độ nhạy cảm</li>
</ol>
<p>Khi chỉ dùng thuốc — anh chỉ tác động vào 1 hệ thống, hoặc không hệ thống nào thực sự. Đó là lý do người ta uống rồi vẫn thất vọng.</p>
<p>Kegel nhắm vào hệ thống số 1 — nền móng mà tất cả phương pháp khác đều cần.</p>
<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu: 7 ngày, 10 phút/ngày →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 8,
    subject: 'anh Minh — 34 tuổi — chia sẻ thật',
    body: wrap(`<p>Anh Minh, 34 tuổi, Hà Nội. Đã có gia đình, 1 con nhỏ.</p>
<p>Anh đăng ký FORMEN vì vợ bắt đầu ít chủ động hơn. Anh không nói gì, nhưng trong bụng biết lý do.</p>
<p>Anh thử Kegel Khởi Đầu vì giá 199k "thử xem sao." Không kỳ vọng nhiều.</p>
<p>Sau ngày 5, anh nhắn: <em>"Tôi không ngờ nó lại khác vậy. Cảm giác kiểm soát khác hẳn. Vợ tôi cũng thấy."</em></p>
<p>Anh Minh không phải ngoại lệ. 7 ngày. 10 phút mỗi ngày. Anh làm được.</p>
<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>
<p>—<br>FORMEN</p>
<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 7 ngày nếu anh không thấy bất kỳ sự khác biệt nào.</p>`)
  },
  {
    day: 11,
    subject: '199k cho 7 ngày — anh có muốn thử không?',
    body: wrap(`<p>Tôi đã gửi cho anh 4 email rồi. Tôi không muốn dài dòng thêm.</p>
<p><strong>Kegel Khởi Đầu</strong>:</p>
<ul style="padding-left:20px;line-height:2.2;">
  <li>7 bài học, mỗi bài 10 phút</li>
  <li>Tự tập tại nhà, không ai biết</li>
  <li>Kết quả cảm nhận trong 7 ngày</li>
  <li>199.000đ — hoàn tiền 7 ngày nếu không thấy khác</li>
</ul>
<p style="text-align:center;margin:28px 0;"><a href="${KEGEL_URL}" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Bắt Đầu Kegel Khởi Đầu — 199.000đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 14,
    subject: '"199k thì mua được gì?"',
    body: wrap(`<p>Câu hỏi hợp lý. Tôi trả lời thẳng.</p>
<p>Không phải YouTube. Là hệ thống 7 bài tập theo thứ tự cụ thể — từ cơ bản đến nâng cao — với tiến trình tăng dần đúng cách để cơ sàn chậu thực sự phát triển.</p>
<p>Làm sai thứ tự thì kết quả rất kém — dù bài tập đúng. Đó là lý do nhiều người tự tập theo video YouTube rồi không thấy khác biệt sau 2-3 tuần.</p>
<p>199k không phải trả cho video. Là trả cho thứ tự đúng và tiến trình đúng.</p>
<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 17,
    subject: 'cảm giác ngày 3-4 — anh có biết không?',
    body: wrap(`<p>Tôi muốn kể anh nghe về một dấu hiệu cụ thể mà hầu hết người tập Kegel đúng cách sẽ nhận ra vào ngày thứ 3-4.</p>
<p>Không phải kết quả to lớn. Chỉ là một cảm giác nhỏ: <strong>cảm giác mình đang kiểm soát được thứ gì đó mà trước đây không kiểm soát được</strong>.</p>
<p>Không rõ ràng lắm. Nhưng nó có. Và khi anh nhận ra — anh sẽ biết mình đang đúng hướng.</p>
<p>Nhiều học viên nói đây là khoảnh khắc họ tin rằng "cái này thật sự hoạt động."</p>
<p>Để có được cảm giác đó — anh cần tập đúng cách, đúng thứ tự, đủ 7 ngày.</p>
<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 7 ngày, 199.000đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 20,
    subject: 'đàn ông 35-50 tuổi có 1 lợi thế anh không ngờ đến',
    body: wrap(`<p>Nghiên cứu về cơ sàn chậu cho thấy điều bất ngờ:</p>
<p>Đàn ông từ 35-50 tuổi, khi bắt đầu tập Kegel đúng cách, thường thấy kết quả <strong>nhanh hơn</strong> so với người 20-25 tuổi.</p>
<p>Lý do: Não bộ ở độ tuổi này có khả năng học kỹ năng vận động có chủ đích tốt hơn. Anh không còn bị phân tâm bởi quá nhiều thứ — anh học và áp dụng nghiêm túc hơn.</p>
<p>Cơ thể anh ở tuổi này cũng phản hồi rõ ràng hơn với từng bài tập — anh cảm nhận được sự thay đổi cụ thể hơn.</p>
<p>Đây không phải lý do để chần chừ. Đây là lý do để bắt đầu ngay.</p>
<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 23,
    subject: 'anh Tuấn — 8 tuần — kết quả thật',
    body: wrap(`<p>Anh Tuấn, 41 tuổi, TP.HCM. Kỹ sư, hay làm việc muộn, ít vận động.</p>
<p>Anh mua Kegel Khởi Đầu sau 2 tuần đọc email của tôi. "Thử cho biết," anh nói.</p>
<p>Sau 7 ngày: "Khác một chút nhưng chưa rõ."<br>
Sau 3 tuần: "Rõ hơn nhiều rồi."<br>
Sau 8 tuần: "Vợ tôi hỏi tôi đang làm gì khác không."</p>
<p>Anh Tuấn không làm gì đặc biệt. Chỉ tập đúng, đủ, và kiên trì.</p>
<p>Nếu anh chưa bắt đầu — đây là lúc.</p>
<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 26,
    subject: 'lần cuối tôi nhắc đến Kegel 199k',
    body: wrap(`<p>Tôi đã gửi 9 email. Đây là lần cuối tôi nhắc về Kegel Khởi Đầu với mức giá này.</p>
<p>Nếu anh vẫn chưa bắt đầu — có thể anh cần lý do mạnh hơn. Tôi sẽ nói thẳng:</p>
<p>Vấn đề này không biến mất nếu bỏ qua. Nó im lặng một thời gian, rồi lại nhắc đến — trong phòng ngủ, trong suy nghĩ lúc 2 giờ sáng, trong cái nhìn của người bạn đời.</p>
<p>199k là mức giá thấp nhất anh có thể trả để bắt đầu thay đổi. Hoàn tiền 7 ngày nếu không thấy gì.</p>
<p style="text-align:center;margin:28px 0;"><a href="${KEGEL_URL}" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Kegel Khởi Đầu — 199.000đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 29,
    subject: 'Kegel chỉ là tầng 1 trong 5 tầng',
    body: wrap(`<p>Tôi muốn nói thật với anh về một điều.</p>
<p>Kegel giúp anh kiểm soát tốt hơn — 3-5 phút thêm là thực tế. Nhưng đó chỉ là tầng 1 trong hệ thống 5 tầng.</p>
<p>5 tầng kiểm soát hoàn toàn:</p>
<ol style="padding-left:20px;line-height:2.2;">
  <li>Cơ sàn chậu (Kegel) ✓</li>
  <li>Hệ thần kinh tự chủ — phản xạ tự động</li>
  <li>Nội tiết tố — testosterone tự nhiên</li>
  <li>Tâm lý — vòng lặp lo lắng</li>
  <li>Tuần hoàn — độ nhạy cảm</li>
</ol>
<p>Mật Mã 21 xây cả 5 tầng trong 21 ngày. Kết quả: 15-30 phút kiểm soát bền vững.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Tìm hiểu thêm về Mật Mã 21 →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 32,
    subject: 'tại sao 15-30 phút là mục tiêu đúng',
    body: wrap(`<p>Anh có bao giờ tự hỏi: "Bao nhiêu phút là đủ?"</p>
<p>Câu trả lời không phải là con số. Là cảm giác: <strong>anh tự chủ hoàn toàn — không còn lo lắng, không còn đếm giây, không còn cầu mong</strong>.</p>
<p>Với hầu hết cặp đôi, khoảng 15-20 phút là điểm mà cả hai đều cảm thấy thỏa mãn tự nhiên. Đây là mục tiêu thực tế — không phải kỷ lục.</p>
<p>Kegel cho anh 3-5 phút thêm. Mật Mã 21 đưa anh đến 15-30 phút — bằng cách xây cả 5 hệ thống kiểm soát cùng lúc.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 35,
    subject: 'từ 2 phút lên 22 phút — câu chuyện anh Hùng',
    body: wrap(`<p>Anh Hùng, 32 tuổi, đã có vợ 3 năm. Vấn đề: kiểm soát rất kém, ảnh hưởng đến hôn nhân.</p>
<p>Anh bắt đầu với Kegel 7 ngày. Cảm nhận được sự khác biệt nhỏ. Rồi vào Mật Mã 21.</p>
<p>Sau 21 ngày, anh nhắn: <em>"Lần đầu tiên trong 3 năm tôi thấy tự tin. Vợ tôi ngạc nhiên. Tôi ngạc nhiên hơn."</em></p>
<p>Từ 2 phút lên 22 phút — sau 21 ngày.</p>
<p>Kegel là nền móng. Mật Mã 21 là ngôi nhà.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — Xem chi tiết →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 38,
    subject: 'vợ/người yêu không nói ra — nhưng anh biết',
    body: wrap(`<p>Có một khoảng cách âm thầm trong nhiều mối quan hệ.</p>
<p>Không ai nói ra. Không ai tranh luận. Nhưng cả hai đều cảm nhận.</p>
<p>Sự ân cần giảm đi một chút. Câu chuyện trước khi ngủ ngắn lại. Cuối tuần ít kế hoạch hơn.</p>
<p>Không phải vì tình cảm phai. Mà vì có điều gì đó chưa được giải quyết — và cả hai chọn cách im lặng.</p>
<p>Mật Mã 21 không chỉ giải quyết vấn đề thể chất. Nó giải quyết cái vòng lặp tâm lý làm cả hai xa nhau dần.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 41,
    subject: 'email cuối — tôi muốn nói thẳng',
    body: wrap(`<p>Đây là email cuối trong chuỗi này.</p>
<p>Tôi đã gửi cho anh 14 email. Chia sẻ thông tin, câu chuyện, khoa học. Không ép. Không giả vờ.</p>
<p>Anh vẫn đang đọc — điều đó cho thấy anh vẫn quan tâm đến vấn đề này.</p>
<p>Tôi chỉ nói một điều: Vấn đề này không tự biến mất theo thời gian. Nó cần được giải quyết chủ động.</p>
<p><strong>Mật Mã 21</strong> — 21 ngày, 5 hệ thống kiểm soát, 686.868đ, hoàn tiền 3 ngày vô điều kiện.</p>
<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Bắt Đầu Mật Mã 21 — 686.868đ →</a></p>
<p>Nếu Kegel phù hợp hơn lúc này: <a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>
<p>—<br>FORMEN</p>`)
  }
];

// ─── LUỒNG 2: KEGEL BUYER → MM21 ─────────────────────────────────────────
// 25 emails · Onboarding: Day 0,2,6,9,13 · Follow-up: Day 16,19... every 3 days to Day 73
const BUYER_KEGEL = [
  {
    day: 0,
    subject: 'anh vừa làm điều quan trọng',
    body: wrap(`<p>Anh vừa mua Kegel Khởi Đầu. Quyết định tốt.</p>
<p><strong>3 điều cần biết trước bài 1:</strong></p>
<p><strong>1. Thời điểm:</strong> Sáng sau khi thức dậy hoặc tối trước khi ngủ. Chọn 1 thời điểm cố định và giữ suốt 7 ngày.</p>
<p><strong>2. Môi trường:</strong> Nằm hoặc ngồi thoải mái. Có thể làm trên giường.</p>
<p><strong>3. Cảm giác ban đầu:</strong> Ngày 1-2 anh có thể không chắc mình làm đúng không. Bình thường — bài học sẽ giải thích.</p>
<p style="text-align:center;margin:24px 0;"><a href="https://www.thuthach21ngay.org/kegel-portal" style="background:#2d6a4f;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Vào Portal Học Ngay →</a></p>
<p style="text-align:center;"><a href="${TG_GROUP}" style="background:#229ED9;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">📱 Vào Nhóm Hỗ Trợ Telegram →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 2,
    subject: 'ngày 3 — anh đang cảm thấy thế nào?',
    body: wrap(`<p>Ngày 3 rồi. Bài 1, 2, 3 xong chưa anh?</p>
<p>Có một điều hay xảy ra ở ngày 3: nhiều người bắt đầu tập quá mạnh, nghĩ rằng tập nhiều hơn = kết quả tốt hơn. Không đúng.</p>
<p>Giai đoạn đầu quan trọng nhất là <strong>kỹ thuật</strong>, không phải cường độ. Tập đúng 10 phút tốt hơn tập sai 30 phút.</p>
<p>Nếu chưa chắc mình đang làm đúng không — xem lại bài 2 về cách cô lập đúng cơ.</p>
<p><a href="https://www.thuthach21ngay.org/kegel-portal" style="color:#2d6a4f;">Vào portal học →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 6,
    subject: 'anh vừa hoàn thành 7 ngày',
    body: wrap(`<p>7 ngày xong. Anh làm được.</p>
<p>Tôi muốn hỏi thẳng: Anh cảm thấy gì khác so với tuần trước?</p>
<p>Không cần kết quả hoàn hảo. Nhưng nếu để ý — có gì đó đang thay đổi. Cơ đang phát triển. Kiểm soát đang tốt hơn, dù nhỏ.</p>
<p>Đây là nền móng. Nhưng tôi muốn nói thật: 3-5 phút mà Kegel cho anh — đó là tầng 1.</p>
<p><strong>Mật Mã 21</strong> xây tiếp từ nền móng anh vừa đặt. 21 ngày. 5 hệ thống kiểm soát. Kết quả: 15-30 phút bền vững.</p>
<p>Tôi sẽ chia sẻ thêm trong những email tiếp theo. Không vội.</p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 9,
    subject: 'anh Hùng kéo dài từ 2 phút lên 22 phút',
    body: wrap(`<p>Anh Hùng, 32 tuổi. Đã có vợ 3 năm. Bắt đầu từ đúng chỗ anh đang đứng.</p>
<p>Anh Hùng làm Kegel 7 ngày — cảm nhận được sự khác biệt nhỏ. Rồi vào Mật Mã 21.</p>
<p>Sau 21 ngày: <em>"Lần đầu tiên trong 3 năm tôi thấy tự tin. Vợ tôi ngạc nhiên."</em></p>
<p>Từ 2 phút lên 22 phút — sau 21 ngày.</p>
<p><strong>Hôm nay tôi mời anh vào Mật Mã 21 với ưu đãi dành riêng cho học viên Kegel:</strong></p>
<p>Giảm 100.000đ — còn <strong>586.868đ</strong> trong <strong>48 giờ</strong>.</p>
<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Nhận Ưu Đãi — Mật Mã 21 →</a></p>
<p>—<br>FORMEN</p>
<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày vô điều kiện.</p>`)
  },
  {
    day: 13,
    subject: 'email cuối về ưu đãi này',
    body: wrap(`<p>Đây là email cuối tôi nhắc về ưu đãi 100k cho Mật Mã 21. Sau email này — giá trở về 686.868đ.</p>
<p>Tôi muốn nói thật một điều: Vấn đề anh đang giải quyết không biến mất nếu bỏ qua. Kegel cho anh 3-5 phút. Nếu anh muốn hơn — tự tin hoàn toàn, không còn lo lắng — thì cần bước tiếp.</p>
<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Mật Mã 21 — 586.868đ (ưu đãi cuối) →</a></p>
<p>Nếu chưa sẵn sàng — tôi sẽ tiếp tục gửi email chia sẻ thêm kiến thức.</p>
<p>—<br>FORMEN</p>`)
  },
  // Follow-up emails 6-25 (every 3 days from Day 16 to Day 73)
  {
    day: 16,
    subject: 'anh có thấy không...',
    body: wrap(`<p>Sau 7 ngày Kegel — anh cảm thấy khác hơn rồi. Tôi biết.</p>
<p>Nhưng có một khoảnh khắc mà hầu hết đàn ông vẫn tránh né: Nằm yên trong bóng tối, nhìn lên trần nhà, và thầm biết: "Vẫn chưa đủ."</p>
<p>Kegel cho anh nền móng. Đó là sự thật. 3-5 phút là tiến bộ thật sự. Nhưng nền móng không phải là ngôi nhà.</p>
<p>Anh xây xong tầng 1 rồi. Câu hỏi là: Anh muốn dừng ở đó không?</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — bước tiếp theo →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 19,
    subject: 'lần đầu tiên trong cuộc đời',
    body: wrap(`<p>Tưởng tượng một buổi sáng — anh thức dậy và không còn lo lắng về điều đó nữa.</p>
<p>Không phải vì anh tránh né. Mà vì anh biết mình đã có đủ kiểm soát để không cần lo.</p>
<p>Cảm giác tự chủ lần đầu tiên trong cuộc đời — nhiều học viên Mật Mã 21 mô tả nó như vậy. Không phải 15 phút hay 30 phút. Mà là cảm giác không còn gánh nặng đó nữa.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 22,
    subject: 'vợ/người yêu hài lòng — quan hệ ấm hơn',
    body: wrap(`<p>Một học viên nhắn cho tôi tuần trước:</p>
<p><em>"Không phải chuyện thời gian. Là cái cách vợ tôi nhìn tôi sau đó. Lần đầu tiên tôi thấy cô ấy thật sự thỏa mãn. Tôi không biết mô tả thế nào khác."</em></p>
<p>Anh ấy học xong Mật Mã 21 được 3 tuần.</p>
<p>Kết quả không phải là con số. Kết quả là sự thay đổi trong mối quan hệ.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — xem chi tiết →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 25,
    subject: 'không phải lỗi của anh',
    body: wrap(`<p>Tôi muốn nói thẳng một điều mà ít ai nói với đàn ông:</p>
<p>Vấn đề kiểm soát không phải lỗi của anh. Không phải vì anh yếu. Không phải vì anh không đủ đàn ông.</p>
<p>Đó là vấn đề sinh lý — cơ chưa được huấn luyện, hệ thần kinh chưa được điều chỉnh, tâm lý chưa được giải phóng khỏi vòng lặp lo lắng.</p>
<p>Mật Mã 21 giải quyết cả 3 nguồn gốc. Không phải bằng ý chí. Bằng phương pháp.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 28,
    subject: 'cảm giác "đàn ông thật sự" được phục hồi',
    body: wrap(`<p>Có những thứ không đo được bằng phút giây.</p>
<p>Là cái cảm giác bước vào phòng với tự tin thật sự. Không cần chuẩn bị tâm lý trước. Không cần lo lắng hay tính toán.</p>
<p>Học viên Mật Mã 21 hay nói về điều này sau tuần 3: "Tôi cảm thấy như mình là đàn ông thật sự lần đầu tiên."</p>
<p>Không phải cường điệu. Đó là kết quả khi cả 5 hệ thống kiểm soát hoạt động đúng cùng lúc.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 → bắt đầu hành trình</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 31,
    subject: 'giữ gìn hạnh phúc — đây là điều anh thật sự muốn',
    body: wrap(`<p>Sâu bên trong, anh không chỉ muốn kéo dài thêm vài phút.</p>
<p>Anh muốn hôn nhân ổn. Anh muốn người bạn đời hạnh phúc. Anh muốn không còn cái cảm giác "mình đang không đủ".</p>
<p>Đây là lý do thật sự anh đang tìm kiếm giải pháp. Không phải kỷ lục. Là sự bình yên trong mối quan hệ.</p>
<p>Mật Mã 21 không chỉ dạy kỹ thuật. Nó dạy anh cách <strong>hiện diện hoàn toàn</strong> — không lo, không đếm, không tính.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 34,
    subject: 'cảm giác không xứng đáng — anh không phải người duy nhất',
    body: wrap(`<p>Có một cảm giác mà nhiều đàn ông không dám thừa nhận, kể cả với bản thân.</p>
<p>Cảm giác "mình không xứng đáng." Không xứng đáng với người bạn đời tốt. Không xứng đáng với mối quan hệ mình đang có.</p>
<p>Nó không đến từ đâu cả — chỉ là kết quả tích lũy từ nhiều lần thất vọng. Và nó ảnh hưởng sang cả công việc, giao tiếp, tự tin hàng ngày.</p>
<p>Giải quyết vấn đề ở phòng ngủ không chỉ cải thiện phòng ngủ. Nó cải thiện cả con người anh bên ngoài.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 37,
    subject: 'không còn lo lắng trước khi bắt đầu',
    body: wrap(`<p>Anh biết cái cảm giác đó không? Vài phút trước khi "bắt đầu" — tim đập nhanh hơn, đầu nghĩ nhanh hơn.</p>
<p>Không phải hưng phấn. Là lo lắng.</p>
<p>"Lần này có được không? Sẽ kéo dài bao lâu? Nếu lại như lần trước thì sao?"</p>
<p>Vòng lặp lo lắng này là kẻ thù thật sự — nặng hơn bất kỳ vấn đề thể chất nào. Và Mật Mã 21 có 1 tuần hoàn toàn dành cho hệ thần kinh và tâm lý để phá vỡ vòng lặp này.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 40,
    subject: 'trở thành phiên bản tốt nhất của bản thân',
    body: wrap(`<p>Anh đang đọc email này vì anh muốn tốt hơn. Không phải cho ai khác. Cho chính anh.</p>
<p>Đó là điều tôi trân trọng nhất ở những người học FORMEN — không phải khoe khoang, không phải chứng minh. Chỉ là muốn trở thành phiên bản tốt hơn của mình.</p>
<p>Mật Mã 21 là 21 ngày đầu tư vào bản thân. Kết quả kéo dài cả đời.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — bắt đầu hành trình →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 43,
    subject: 'chữa lành tổn thương từ nhiều năm trước',
    body: wrap(`<p>Với nhiều anh, vấn đề này không phải chỉ mới xảy ra. Nó đã ở đó nhiều năm. Im lặng, nhưng ở đó.</p>
<p>Và trong nhiều năm đó — mỗi lần thất vọng là một lớp tổn thương nhỏ. Tích lũy thành cái gánh nặng mà anh đang mang.</p>
<p>Giải quyết vấn đề này không chỉ là thêm vài phút. Là trả lại cho anh thứ đã bị lấy đi trong nhiều năm: sự tự tin và cảm giác xứng đáng.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 46,
    subject: 'khoảng cách âm thầm trong mối quan hệ',
    body: wrap(`<p>Nhiều cặp đôi không chia tay vì to tiếng. Họ xa dần vì những khoảng cách nhỏ tích lũy.</p>
<p>Ít chạm vào nhau hơn. Ít nói chuyện sâu hơn. Ít kế hoạch chung hơn.</p>
<p>Không ai nói lý do. Nhưng cả hai đều cảm nhận.</p>
<p>Giải quyết vấn đề thể chất thường mở ra lại những cuộc trò chuyện đó — vì cái rào cản vô hình không còn nữa.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 49,
    subject: 'tự hào về bản thân — lan tỏa ra ngoài',
    body: wrap(`<p>Học viên hay kể về một điều bất ngờ sau khi hoàn thành Mật Mã 21.</p>
<p>Không chỉ phòng ngủ thay đổi. Cả ngày hôm sau cũng thay đổi.</p>
<p>Tự tin hơn trong cuộc họp. Kiên nhẫn hơn với con cái. Năng lượng hơn trong công việc.</p>
<p>Bởi vì khi anh không còn mang gánh nặng đó — toàn bộ năng lượng tinh thần được giải phóng cho những việc khác.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 52,
    subject: 'ngủ ngon hơn, ít stress hơn — cuộc sống nhẹ hơn',
    body: wrap(`<p>Một nghiên cứu nhỏ nhưng thú vị: Đàn ông giải quyết xong vấn đề kiểm soát thường báo cáo ngủ ngon hơn và ít lo lắng vô cớ hơn.</p>
<p>Không phải ngẫu nhiên. Cortisol — hormone stress — giảm khi một nguồn lo lắng mãn tính được loại bỏ.</p>
<p>Mật Mã 21 không chỉ giải quyết 1 vấn đề. Nó cải thiện cả chất lượng cuộc sống xung quanh vấn đề đó.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 55,
    subject: '3-5 phút chưa đủ — anh biết điều này',
    body: wrap(`<p>Tôi không nói điều này để làm anh buồn. Tôi nói vì anh đã biết rồi.</p>
<p>3-5 phút tốt hơn trước. Nhưng vẫn chưa đủ để anh thật sự tự tin. Vẫn chưa đủ để anh không cần nghĩ đến nó nữa.</p>
<p>Đó là lý do Mật Mã 21 tồn tại. Không phải để thay thế Kegel — mà để đưa anh đến điểm đích thật sự.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 58,
    subject: 'không để vợ/người yêu thiếu thốn',
    body: wrap(`<p>Có một điều đàn ông thường không nói ra: nỗi sợ khiến người mình yêu thương thất vọng.</p>
<p>Không phải vì ích kỷ. Mà vì yêu thương thật sự — anh muốn người bên cạnh được hạnh phúc đầy đủ.</p>
<p>Đó là lý do thật sự nhiều anh tìm đến FORMEN. Không phải cho bản thân — là cho mối quan hệ.</p>
<p>Mật Mã 21 là 21 ngày để anh trở thành người bạn đời mà anh muốn là.</p>
<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 61,
    subject: 'email cuối — tôi tôn trọng quyết định của anh',
    body: wrap(`<p>Đây là email cuối cùng trong chuỗi này.</p>
<p>Tôi đã gửi 25 email. Chia sẻ khoa học, câu chuyện, lý do. Không ép. Không deadline giả.</p>
<p>Nếu anh chưa sẵn sàng cho Mật Mã 21 — tôi hoàn toàn tôn trọng. Mỗi người có thời điểm của riêng mình.</p>
<p>Nhưng nếu anh đã sẵn sàng — link luôn ở đây: <a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>
<p>Cảm ơn anh đã đọc và tin tưởng FORMEN.</p>
<p>—<br>FORMEN</p>`)
  }
];

// ─── LUỒNG 3: MM21 BUYER → SUPPLEMENT + AFFILIATE ────────────────────────
// 9 emails · Day 0,2,6,13,20,27,34,44,59
const BUYER_MM21 = [
  {
    day: 0,
    subject: 'anh đã đưa ra quyết định đúng',
    body: wrap(`<p>Anh vừa vào Mật Mã 21. Đây không phải lời nói xã giao — anh vừa làm điều mà phần lớn đàn ông biết mình cần nhưng không làm.</p>
<p><strong>3 điều để 21 ngày này không bị lãng phí:</strong></p>
<p><strong>1.</strong> Đừng bỏ qua các bài học tâm lý. 60% kiểm soát đến từ hệ thần kinh và tâm lý.</p>
<p><strong>2.</strong> Cơ thể cần 72 giờ thích nghi sau mỗi bài cường độ mới. Đừng tập thêm ngoài lịch.</p>
<p><strong>3.</strong> Tuần 2 thường khó nhất. Hưng phấn ban đầu qua đi nhưng kết quả rõ chưa đến. Đây là lúc nhiều người bỏ — anh không phải người như vậy.</p>
<p style="text-align:center;margin:24px 0;"><a href="https://www.thuthach21ngay.org/portal" style="background:#2d6a4f;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Vào Portal Học Ngay →</a></p>
<p>—<br>FORMEN</p>
<p style="font-size:13px;color:#888;">Hỗ trợ 1-1: <a href="https://t.me/matma21_support" style="color:#2d6a4f;">Telegram @matma21_support</a></p>`)
  },
  {
    day: 2,
    subject: 'ngày 3 — anh đang cảm thấy thế nào?',
    body: wrap(`<p>Ngày 3 rồi. Bài 1, 2, 3 xong chưa anh?</p>
<p>Sau 3 ngày Kegel nâng cao, nhiều người cảm thấy mỏi nhẹ ở vùng đáy chậu. Không đau — chỉ là cảm giác cơ vừa được dùng đúng cách lần đầu. Đó là dấu hiệu tốt.</p>
<p>Nếu chưa cảm thấy gì — không sao. Mỗi người khác nhau. Cứ tiếp tục đúng lịch.</p>
<p><a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào portal học bài tiếp theo →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 6,
    subject: 'anh xong tuần 1 — đây là điều cần biết cho tuần 2',
    body: wrap(`<p>7 ngày xong. Tuần 2 sẽ khác.</p>
<p>Tuần 1 là về cơ bắp và kỹ thuật cơ bản. Tuần 2 bắt đầu đi vào hệ thần kinh — cách huấn luyện phản xạ tự động để không còn "bị bất ngờ."</p>
<p><strong>Gợi ý thực tế cho tuần 2:</strong> Tập vào buổi tối, khi đầu óc thư giãn nhất. Hệ thần kinh cần bình tĩnh để học các phản xạ mới.</p>
<p><a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào học bài 8 →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 13,
    subject: 'nửa chặng rồi — cơ thể cần gì thêm không?',
    body: wrap(`<p>Ngày 14. Nửa hành trình. Anh đang cảm nhận được sự khác biệt rõ hơn chưa?</p>
<p>Hôm nay tôi muốn chia sẻ điều nhiều học viên hỏi ở giai đoạn này: "Có gì hỗ trợ thêm không?"</p>
<p><strong>Kẽm và Magie</strong> là 2 vi chất ảnh hưởng trực tiếp đến testosterone tự nhiên, chất lượng giấc ngủ và phục hồi cơ, chức năng thần kinh và kiểm soát cơ. Phần lớn nam giới Việt Nam thiếu cả 2.</p>
<p>Tôi chưa bán gì trong email này — chỉ muốn anh biết điều này tồn tại. Chia sẻ thêm sau khi anh hoàn thành 21 ngày.</p>
<p>Giờ tập trung vào bài 14: <a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào portal →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 20,
    subject: 'anh vừa hoàn thành điều mà 95% không làm được',
    body: wrap(`<p>21 ngày. Anh làm được.</p>
<p>Chỉ khoảng 1 trong 20 người bắt đầu mà hoàn thành đủ. Anh là người trong số đó.</p>
<p>Tôi muốn hỏi anh thật lòng: <strong>Sau 21 ngày — anh cảm nhận được gì khác so với trước?</strong></p>
<p>Reply email này hoặc nhắn <a href="https://t.me/matma21_support" style="color:#2d6a4f;">Telegram @matma21_support</a>. Feedback của anh giúp tôi cải thiện chương trình cho người tiếp theo.</p>
<p>—<br>FORMEN</p>
<p style="font-size:13px;color:#888;">P.S. Cảm ơn anh đã tin tưởng FORMEN. Điều đó không nhỏ với tôi.</p>`)
  },
  {
    day: 27,
    subject: 'bước tiếp theo để duy trì kết quả lâu dài',
    body: wrap(`<p>Anh đã hoàn thành 21 ngày. Câu hỏi tiếp theo: làm thế nào để kết quả này kéo dài?</p>
<p>Cơ thể cần nguồn nguyên liệu đúng để duy trì và phát triển tiếp:</p>
<p><strong>Kẽm</strong> (299.000đ/tháng) — hỗ trợ testosterone tự nhiên, kiểm soát cơ, sức bền.<br>
<strong>Magie</strong> (350.000đ/tháng) — cải thiện giấc ngủ sâu, giảm cortisol, tăng kiểm soát thần kinh.<br>
<strong>Combo Kẽm + Magie</strong> — <strong>549.000đ</strong> (tiết kiệm 100k)</p>
<p><strong>Ưu đãi học viên MM21:</strong> Giảm thêm 50.000đ cho đơn đầu tiên trong 7 ngày tới.</p>
<p style="text-align:center;margin:28px 0;"><a href="${SUPP_URL}" style="background:#2d6a4f;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Đặt Mua Supplement →</a></p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 34,
    subject: 'anh có muốn kiếm thêm từ FORMEN không?',
    body: wrap(`<p>Nhiều học viên sau khi hoàn thành MM21 tự nhiên chia sẻ với bạn bè — vì kết quả thật và họ muốn người khác cũng được như vậy.</p>
<p>Chúng tôi có chương trình <strong>Affiliate FORMEN</strong>:</p>
<ul style="padding-left:20px;line-height:2.2;">
  <li>Kegel Khởi Đầu (199k) được giới thiệu: <strong>40.000đ hoa hồng</strong></li>
  <li>Mật Mã 21 (686k) được giới thiệu: <strong>140.000đ hoa hồng</strong></li>
  <li>Supplement: <strong>15% hoa hồng</strong></li>
</ul>
<p>Không cần bán công khai. Chỉ cần link cá nhân — share với ai anh thấy phù hợp.</p>
<p>Nhắn <a href="https://t.me/matma21_support" style="color:#2d6a4f;">Telegram @matma21_support</a>: "Tôi muốn đăng ký affiliate" — nhận link trong 24 giờ.</p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 44,
    subject: 'cách anh Tuấn kiếm 3.2 triệu tháng đầu',
    body: wrap(`<p>Anh Tuấn, 38 tuổi, Đà Nẵng — học viên MM21 từ tháng 3.</p>
<p>Tháng đầu tiên làm affiliate: giới thiệu 8 người vào Kegel và 3 người vào MM21. Tổng: <strong>3.2 triệu hoa hồng</strong>.</p>
<p>Anh Tuấn không chạy quảng cáo. Không có fanpage. Chỉ share link trong nhóm bạn cũ và nhóm gym.</p>
<p>Bí quyết: "Tôi chỉ share với người tôi thấy đang gặp vấn đề tương tự. Không ép. Chỉ nói: có thứ này, tôi đã thử, nó hiệu quả."</p>
<p>Nhắn <a href="https://t.me/matma21_support" style="color:#2d6a4f;">Telegram @matma21_support</a> để nhận link affiliate của anh.</p>
<p>—<br>FORMEN</p>`)
  },
  {
    day: 59,
    subject: '60 ngày rồi — anh thế nào?',
    body: wrap(`<p>60 ngày kể từ ngày anh vào Mật Mã 21. Tôi không gửi email này để bán gì. Chỉ muốn hỏi thật: anh thế nào?</p>
<p>Kết quả có duy trì không? Có điều gì anh muốn cải thiện thêm không?</p>
<p>Nếu mọi thứ tốt — tuyệt vời. Đừng quên Kẽm + Magie hàng tháng để duy trì: <a href="${SUPP_URL}" style="color:#2d6a4f;">Đặt mua →</a></p>
<p>Nếu có gì chưa ổn — nhắn tôi. Tôi sẽ xem anh cần điều chỉnh gì.</p>
<p>Cảm ơn anh đã là một phần của FORMEN.</p>
<p>—<br>FORMEN</p>
<p style="font-size:13px;color:#888;">P.S. Nếu anh có feedback muốn chia sẻ công khai (testimonial) — nhắn tôi, có phần quà nhỏ cho anh.</p>`)
  }
];

export const EMAIL_SEQUENCES = {
  registered:  REGISTERED,
  buyer_kegel: BUYER_KEGEL,
  buyer_mm21:  BUYER_MM21
};

/**
 * Returns { day, subject, body } for a given sequence and email index (0-based)
 */
export function getEmailByIndex(sequence, index) {
  return EMAIL_SEQUENCES[sequence]?.[index] ?? null;
}
