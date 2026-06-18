/**
 * Email sequences data for FORMEN automated email system.
 * All 3 sequences: registered, buyer_kegel, buyer_mm21
 * Content is Vietnamese, plain-text style HTML.
 * Rewritten with avatar-based emotional targeting (pains, gains, customer jobs).
 */

const KEGEL_URL  = 'https://www.thuthach21ngay.org/kegel-khoi-dau';
const MM21_URL   = 'https://www.thuthach21ngay.org/#offer-section';
const SUPP_URL   = 'https://www.thuthach21ngay.org/#supplement';
const TG_GROUP   = 'https://web.telegram.org/a/#-5282773244';
const PORTAL_URL = 'https://www.thuthach21ngay.org/kegel-portal';

function wrap(body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 24px;color:#1a1a1a;font-size:16px;line-height:1.9;">
${body}
<hr style="border:none;border-top:1px solid #eeeeee;margin:32px 0;">
<p style="font-size:12px;color:#aaaaaa;">FORMEN · Email tự động · Để ngừng nhận, reply "DỪNG"</p>
</div></body></html>`;
}

// ─── LUỒNG 1: REGISTERED → KEGEL → MM21 ──────────────────────────────────
// 15 emails · Day 0,2,5,8,11,14,17,20,23,26,29,32,35,38,41
// Email 1-5: Nurture thuần (đồng cảm, giáo dục, 0 bán hàng)
// Email 6-10: Giới thiệu Kegel 199k
// Email 11-15: Bridge sang Mật Mã 21
const REGISTERED = [

  // ── EMAIL 1 (Day 0): Chào — đồng cảm sâu, không bán ──────────────────
  {
    day: 0,
    subject: 'tôi biết anh đang cảm thấy gì',
    body: wrap(`<p>Anh vừa đăng ký FORMEN.</p>

<p>Tôi không biết chính xác câu chuyện của anh. Nhưng tôi đoán được một phần.</p>

<p>Bởi vì tôi đã nhận hàng trăm tin nhắn từ những người đàn ông giống anh. Và họ đều bắt đầu giống nhau — không phải bằng một câu hỏi, mà bằng một sự im lặng rất dài trước khi gõ dòng đầu tiên.</p>

<p>Có điều gì đó đang làm anh không yên. Không hẳn là đau đớn thể xác. Mà là một loại gánh nặng khác — loại không nói với ai được. Không hỏi bạn bè được. Không hỏi bác sĩ được vì quá xấu hổ.</p>

<p>Loại gánh nặng mà anh mang một mình. Đêm nào cũng vậy. Sáng nào cũng vậy. Mỗi lần nhìn vợ/người yêu, nó lại nhắc anh rằng nó vẫn ở đó.</p>

<p>Tôi muốn anh biết một điều trước khi đọc tiếp:</p>

<p><strong>Anh không phải người duy nhất.</strong></p>

<p>Có khoảng 30% nam giới trưởng thành ở Việt Nam đang sống với vấn đề này. Nghĩa là trong phòng họp 10 người — có 3 người đang mang cùng nỗi lo như anh. Chỉ là không ai nói ra.</p>

<p>Và quan trọng hơn — vấn đề này giải quyết được. Không phải bằng thuốc. Không phải bằng ý chí. Không phải bằng cách "nghĩ chuyện khác." Mà bằng phương pháp đúng — phương pháp mà khoa học đã chứng minh, nhưng ít ai ở Việt Nam được tiếp cận đúng cách.</p>

<p>Trong những ngày tới, tôi sẽ chia sẻ với anh một số thứ thiết thực. Không phải để bán hàng ngay. Tôi hứa điều đó.</p>

<p>Mà để anh thật sự hiểu cơ thể mình. Hiểu tâm lý mình. Hiểu tại sao anh đã thử nhiều cách mà vẫn chưa được — và điều gì thật sự sẽ tạo ra sự khác biệt.</p>

<p>Anh chỉ cần đọc. Tôi sẽ viết ngắn gọn, thật lòng, và không vòng vo.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Nếu anh muốn bắt đầu ngay hôm nay — <a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu (199k)</a> là bước đầu tiên. Nhưng không vội. Đọc email của tôi trước. Tôi muốn anh hiểu rõ trước khi quyết định bất cứ điều gì.</p>`)
  },

  // ── EMAIL 2 (Day 2): Pain #1 — Kết thúc quá nhanh ─────────────────────
  {
    day: 2,
    subject: '"nhanh quá, không kiểm soát được"',
    body: wrap(`<p>Đó là 6 từ tôi nghe nhiều nhất từ đàn ông liên lạc với FORMEN.</p>

<p>"Nhanh quá. Không kiểm soát được."</p>

<p>Họ không nói thêm gì. Không cần. 6 từ đó chứa cả một câu chuyện dài.</p>

<p>Chứa những lần nằm im sau đó, nhìn lên trần nhà, không biết nói gì.<br>
Chứa ánh mắt của vợ/người yêu — không trách, nhưng cũng không nói gì. Cái im lặng đó đau hơn bất kỳ lời trách nào.<br>
Chứa cái cảm giác "mình vừa lại thất vọng cô ấy rồi." Lần này. Lần trước. Và có lẽ lần sau cũng vậy.</p>

<p>Anh biết cảm giác đó không? Cái khoảnh khắc ngay sau khi kết thúc — khi mọi thứ đang tốt đẹp bỗng dưng dừng lại. Và anh ước mình có thể quay ngược lại 30 giây. Chỉ 30 giây thôi.</p>

<p>Nhưng không được. Và cái cảm giác đó theo anh ra ngoài phòng ngủ. Theo vào giấc ngủ. Theo đến sáng hôm sau. Theo vào cuộc họp, vào bữa cơm gia đình, vào mỗi lần cô ấy chạm vào tay anh mà anh không dám đáp lại vì sợ "lại đến lúc đó."</p>

<p>Anh có biết không — vấn đề này ảnh hưởng khoảng 30% nam giới trưởng thành ở Việt Nam. Nhưng chỉ 6% tìm đến giải pháp thật sự. Số còn lại tự chịu đựng. Giả vờ ổn. Giả vờ mệt. Giả vờ bận. Rồi sống như vậy nhiều năm — cho đến khi khoảng cách giữa hai người lớn đến mức không ai nhớ nó bắt đầu từ đâu.</p>

<p>Anh đang đọc email này. Điều đó có nghĩa anh không muốn giả vờ nữa.</p>

<p>Đó là bước quan trọng nhất. Thật sự. Dũng cảm nhất không phải là giải quyết vấn đề — mà là thừa nhận nó tồn tại.</p>

<p>Trong email tới, tôi sẽ giải thích tại sao thuốc và gel không hiệu quả — và cơ thể anh thật sự cần gì để thay đổi từ gốc rễ.</p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 3 (Day 5): Pain #5 — Thuốc không hiệu quả ───────────────────
  {
    day: 5,
    subject: 'tại sao anh thử đủ cách mà vẫn thế?',
    body: wrap(`<p>Hầu hết đàn ông đến với FORMEN đều kể tôi nghe một danh sách dài.</p>

<p>Thuốc kê đơn. Gel bôi. Bao cao su dày hơn. Đá lạnh trước khi bắt đầu. Kìm nén. Thở sâu. Nghĩ chuyện khác — từ đề thi đại học đến bảng cửu chương. Video YouTube hướng dẫn "kéo dài 30 phút." Thậm chí uống nước thật nhiều trước khi bắt đầu.</p>

<p>Mỗi lần thử một cách mới, anh lại có chút hy vọng. "Lần này chắc được." Và mỗi lần thất bại, chút hy vọng đó lại biến thành thất vọng sâu hơn lần trước.</p>

<p>Đến một lúc, anh không còn muốn thử nữa. Vì thử mà thất bại — đau hơn là không thử.</p>

<p>Nhưng tôi muốn nói thật với anh: <strong>không phải vì anh thiếu thông minh hay thiếu ý chí.</strong> Mà vì không ai giải thích cho anh nguyên nhân thật sự.</p>

<p>Vấn đề không nằm ở một chỗ. Nó nằm ở 5 hệ thống hoạt động đồng thời trong cơ thể anh:</p>

<p>
1. <strong>Cơ sàn chậu</strong> — nhóm cơ kiểm soát trực tiếp, chưa bao giờ được huấn luyện đúng cách. Giống như cầm lái mà không có phanh.<br>
2. <strong>Hệ thần kinh</strong> — phản xạ tự động quá nhạy, não gửi tín hiệu quá sớm mà anh không kịp can thiệp.<br>
3. <strong>Nội tiết tố</strong> — testosterone và cortisol mất cân bằng, đặc biệt khi căng thẳng kéo dài.<br>
4. <strong>Tâm lý</strong> — vòng lặp lo lắng: sợ thất bại → căng thẳng → thất bại → sợ hơn lần sau. Mỗi vòng lặp mạnh hơn vòng trước.<br>
5. <strong>Tuần hoàn</strong> — độ nhạy cảm chưa được điều chỉnh, khiến cơ thể phản ứng quá mức với kích thích nhỏ.
</p>

<p>Thuốc chỉ đụng đến 1 trong 5 hệ thống — và thường không đúng hệ thống nào thật sự cần. Gel bôi làm tê vùng da — nhưng hệ thần kinh bên trong vẫn hoạt động giống hệt. Kìm nén bằng ý chí giống như bảo tim đừng đập — không ai làm được lâu dài.</p>

<p>Đó là lý do anh uống xong vẫn thất vọng. Hoặc bôi xong thì tê liệt, không cảm nhận được gì — mà cảm xúc và kết nối mới là thứ quan trọng nhất.</p>

<p>Giải pháp thật sự phải xây cả 5 hệ thống. Từng bước. Đúng thứ tự. Không có đường tắt.</p>

<p>Trong email tới, tôi sẽ kể anh nghe về anh Minh — 34 tuổi, Hà Nội, và điều thật sự mà anh ấy đang cố bảo vệ khi tìm đến FORMEN.</p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 4 (Day 8): Customer Job #1 — Giữ gìn hôn nhân ───────────────
  {
    day: 8,
    subject: 'điều anh thật sự đang cố bảo vệ',
    body: wrap(`<p>Anh Minh, 34 tuổi, Hà Nội. Kỹ sư phần mềm. Vợ làm giáo viên. Có 1 con gái 3 tuổi.</p>

<p>Anh nhắn cho tôi lúc 1 giờ sáng. Tin nhắn rất ngắn:</p>

<p><em>"Vợ tôi không nói gì. Nhưng tôi thấy cô ấy dần ít chủ động hơn. Ít muốn gần nhau hơn. Tôi biết lý do nhưng không biết làm sao."</em></p>

<p>Tôi đọc đi đọc lại tin nhắn đó nhiều lần. Vì nó chứa rất nhiều thứ không được nói ra.</p>

<p>Nó chứa những buổi tối hai vợ chồng nằm quay lưng lại nhau — không phải vì giận, mà vì không biết phải làm gì. Nó chứa những lần anh muốn chạm vào vợ nhưng rụt tay lại vì sợ "lại đến lúc đó." Nó chứa nụ cười của con gái mỗi sáng — và cái ý nghĩ đau đớn rằng gia đình này đang dần lỏng ra ở một chỗ mà con bé không biết.</p>

<p>Anh Minh không sợ mất "kỷ lục." Anh sợ mất vợ.</p>

<p>Anh muốn là người chồng tốt. Muốn vợ hạnh phúc. Muốn hôn nhân ổn — không phải vì trách nhiệm. Không phải vì "phải." Mà vì anh yêu cô ấy thật sự. Và vì anh biết — nếu khoảng cách này kéo dài thêm, nó sẽ trở thành thứ không ai sửa được.</p>

<p><strong>Đó mới là điều thật sự đang bị đặt cược.</strong></p>

<p>Không phải phút giây. Không phải thể diện. Là hôn nhân. Là gia đình. Là người phụ nữ đã chọn sống cả đời với anh.</p>

<p>Anh Minh thử Kegel Khởi Đầu sau khi đọc email thứ 3 của tôi. Anh không kỳ vọng nhiều — "thử xem sao, 199k thì mất gì." Sau ngày 3, anh nhận ra mình đang co đúng cơ. Sau ngày 5, anh nhắn tôi:</p>

<p><em>"Cảm giác kiểm soát khác hẳn. Vợ tôi cũng thấy. Cô ấy không nói gì nhưng tối hôm đó cô ấy nằm sát tôi hơn. Lần đầu tiên sau rất lâu."</em></p>

<p>7 ngày. 10 phút mỗi ngày. Không ai biết anh đang làm gì. Không cần dụng cụ. Không cần thuốc. Chỉ cần đúng phương pháp, đúng thứ tự.</p>

<p>Kegel không phải kỳ tích. Nhưng đó là bước đầu tiên mà khoa học đã xác nhận — xây cơ sàn chậu, tầng kiểm soát nền tảng nhất. Và đôi khi, bước đầu tiên là bước quan trọng nhất.</p>

<p>Nếu câu chuyện anh Minh nghe quen thuộc — có lẽ anh biết phải làm gì tiếp.</p>

<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ, hoàn tiền 7 ngày nếu không thấy khác biệt →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 5 (Day 11): Pain #2 — Vợ thở dài, không nói ────────────────
  {
    day: 11,
    subject: '"vợ mình chắc thất vọng lắm nhưng không nói"',
    body: wrap(`<p>Đó là câu một anh học viên nhắn cho tôi lúc 11 giờ đêm.</p>

<p>Không hỏi gì. Không nhờ giúp đỡ. Chỉ gửi câu đó rồi thôi.</p>

<p>Tôi nghĩ anh ấy không cần câu trả lời. Anh ấy chỉ cần ai đó biết mình đang cảm thấy gì. Chỉ cần một người — dù là người lạ — hiểu được cái nặng nề đó.</p>

<p>Tôi ngồi nhìn tin nhắn đó rất lâu trước khi trả lời. Vì tôi biết — phía sau màn hình kia là một người đàn ông đang ngồi một mình trong bóng tối, vợ có lẽ đã ngủ cạnh bên, và anh ấy đang cảm thấy cô đơn ngay trong chính ngôi nhà của mình.</p>

<p>Cái khó nhất không phải là vấn đề thể chất. Cái khó nhất là <strong>sự im lặng</strong>.</p>

<p>Vợ/người yêu không nói. Không phải vì không quan tâm — mà vì sợ làm anh đau thêm. Cô ấy thấy anh đã tự giày vò đủ rồi. Nói ra chỉ thêm nặng nề.</p>

<p>Anh không hỏi. Không phải vì không biết — mà vì biết quá rõ. Hỏi nghĩa là phải đối mặt. Và đối mặt mà không có giải pháp — thì chỉ thêm đau.</p>

<p>Cả hai đều biết. Nhưng không ai đụng vào. Và cái im lặng đó nằm giữa hai người như một bức tường kính — nhìn thấy nhau, nhưng không chạm được nhau.</p>

<p>Mỗi ngày trôi qua, khoảng cách đó rộng thêm một chút. Không ồn ào. Không kịch tính. Chỉ là ít đi một chút — ít chạm, ít cười, ít nhìn vào mắt nhau.</p>

<p>Cho đến một ngày, cả hai nhận ra mình đang sống như hai người bạn cùng phòng hơn là vợ chồng. Và không ai nhớ mọi thứ bắt đầu thay đổi từ lúc nào.</p>

<p>Anh đang đọc email này lúc mấy giờ? Tôi đoán là tối muộn. Khi vợ con đã ngủ. Khi không ai nhìn.</p>

<p>Đó là khoảnh khắc anh dũng cảm nhất — khi chịu thừa nhận với bản thân rằng mình muốn thay đổi. Rằng mình xứng đáng được tốt hơn. Rằng người bên cạnh mình xứng đáng được tốt hơn.</p>

<p>Bước đầu tiên nhỏ thôi. 7 ngày. 10 phút/ngày. Tự tập tại nhà, không ai biết. Không cần giải thích với ai. Không cần kể với ai. Chỉ cần bắt đầu.</p>

<p>Và nếu sau 7 ngày anh không cảm nhận bất kỳ sự khác biệt nào — hoàn tiền. Không hỏi lý do.</p>

<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Anh không cần phải sẵn sàng 100%. Không ai sẵn sàng 100% khi bắt đầu điều gì mới. Chỉ cần đủ muốn thay đổi — và anh đang ở đây, nên tôi biết anh đủ rồi.</p>`)
  },

  // ── EMAIL 6 (Day 14): Giới thiệu Kegel — Logic ─────────────────────────
  {
    day: 14,
    subject: '"199k mua được cái gì?"',
    body: wrap(`<p>Câu hỏi hợp lý. Tôi muốn trả lời thẳng — không vòng vo.</p>

<p>Trước tiên, những thứ anh KHÔNG mua:</p>

<p>Không phải video YouTube đóng gói lại. Không phải tài liệu PDF chụp từ sách y khoa. Không phải "bí quyết" nào đó anh có thể Google ra trong 5 phút.</p>

<p>Đây là những gì 199k thật sự mua được:</p>

<p><strong>Một hệ thống 7 bài tập theo đúng thứ tự tiến trình</strong> — từ kỹ thuật cô lập cơ sàn chậu, qua kích hoạt cơ có ý thức, đến tăng dần cường độ theo từng ngày, với đúng nhịp co-giãn và đúng thời gian nghỉ giữa các set.</p>

<p>Tại sao thứ tự quan trọng đến vậy?</p>

<p>Vì cơ sàn chậu cần được "dạy" theo từng giai đoạn. Nếu bỏ qua bất kỳ giai đoạn nào — cả hệ thống không hoàn chỉnh:</p>

<p>
Giai đoạn 1: <strong>Nhận diện</strong> — biết chính xác mình đang co cơ nào, không co nhầm cơ bụng hay cơ mông<br>
Giai đoạn 2: <strong>Kích hoạt</strong> — tập co cơ có ý thức trong điều kiện bình thường<br>
Giai đoạn 3: <strong>Tăng lực</strong> — tăng cường độ co theo ngưỡng chịu đựng của cơ<br>
Giai đoạn 4: <strong>Tăng bền</strong> — duy trì lực co trong thời gian dài hơn<br>
Giai đoạn 5: <strong>Tự động hóa</strong> — cơ phản xạ đúng mà không cần anh nghĩ đến
</p>

<p>Đây là lý do 80% đàn ông tự tập Kegel theo YouTube thất bại. Họ nhảy thẳng vào giai đoạn 3-4 mà bỏ qua giai đoạn 1-2. Tập 2 tuần không thấy gì — rồi bỏ. Và tự kết luận rằng "Kegel không hiệu quả với mình."</p>

<p>Không phải Kegel không hiệu quả. Là họ chưa tập đúng cách.</p>

<p>199k không phải trả cho nội dung. Là trả cho <strong>đúng thứ tự, đúng tiến trình, đúng kỹ thuật</strong> — những thứ mà một video YouTube 15 phút không thể truyền tải đầy đủ.</p>

<p>7 ngày. 10 phút mỗi ngày. Kết quả đủ để anh cảm nhận rõ trong vòng 1 tuần. Nếu không — hoàn tiền, không hỏi lý do.</p>

<p style="text-align:center;margin:28px 0;"><a href="${KEGEL_URL}" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Kegel Khởi Đầu — 199.000đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 7 ngày nếu anh không cảm nhận được sự khác biệt gì. Tôi tự tin vào điều đó.</p>`)
  },

  // ── EMAIL 7 (Day 17): Pain #3 — Lo lắng trước "chuyện đó" ─────────────
  {
    day: 17,
    subject: 'tim đập nhanh — nhưng không phải vì hưng phấn',
    body: wrap(`<p>Anh có biết cái cảm giác đó không?</p>

<p>Vài phút trước khi bắt đầu — tim đập nhanh hơn bình thường, đầu óc bắt đầu chạy nhanh hơn. Không gian trong phòng bỗng dưng trở nên nhỏ lại.</p>

<p>Nhưng không phải vì háo hức. Là vì lo.</p>

<p><em>"Lần này có được không?"</em><br>
<em>"Sẽ kéo dài được bao lâu?"</em><br>
<em>"Nếu lại như lần trước thì sao? Mặt mình sẽ ra sao? Cô ấy sẽ nghĩ gì?"</em></p>

<p>Và trong khi anh đang xoáy trong những câu hỏi đó — cơ thể anh đang phản ứng theo đúng chiều hướng mà não bộ ra lệnh. Lo lắng kích hoạt cortisol. Cortisol tăng độ nhạy của hệ thần kinh. Hệ thần kinh nhạy hơn dẫn đến phản xạ nhanh hơn. Phản xạ nhanh hơn dẫn đến kết quả mà anh lo sợ.</p>

<p>Vòng lặp tự cản. Hoạt động hoàn hảo. Mỗi lần một lần.</p>

<p>Và cái tệ nhất của vòng lặp này? Ý chí không phá được nó. Anh càng cố gắng kiểm soát bằng suy nghĩ — não bộ càng phân tán, cơ thể càng căng thẳng, phản xạ càng nhanh hơn.</p>

<p>Đây là điều mà thuốc và gel không giải quyết được. Chúng có thể làm chậm cơ thể — nhưng không thể tắt vòng lặp lo lắng trong đầu anh.</p>

<p>Kegel làm điều đó theo cách khác. Khi anh xây được cơ sàn chậu mạnh và có ý thức kiểm soát thật sự — não bộ nhận được tín hiệu: "mình có thể kiểm soát được." Và khi não bộ tin điều đó, lo lắng giảm theo tự nhiên. Không cần ý chí. Không cần cố gắng. Chỉ là tự tin có căn cứ.</p>

<p>Nhiều học viên kể rằng ngày 3-4 của Kegel Khởi Đầu là lần đầu tiên họ bước vào phòng ngủ mà không thấy tim đập theo kiểu đó. Không rõ ràng hoàn toàn — nhưng khác. Và cái "khác" nhỏ đó quan trọng hơn họ nghĩ.</p>

<p>Vì nó chứng minh vòng lặp có thể bị phá.</p>

<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — bắt đầu từ hôm nay →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 8 (Day 20): Gain #2 — Nhìn thấy vợ/người yêu thỏa mãn thật ─
  {
    day: 20,
    subject: 'lần đầu tiên thấy cô ấy thật sự thỏa mãn',
    body: wrap(`<p>Một học viên nhắn tôi lúc 11 giờ đêm, sau khi kết thúc tuần 2 tập Kegel:</p>

<p><em>"Tôi không biết mô tả thế nào. Nhưng hôm nay cô ấy nhìn tôi theo cách khác. Khác hơn nhiều năm nay. Tôi chưa từng thấy cô ấy nhìn tôi như vậy. Tôi ngồi đây nhìn cô ấy ngủ mà cứ nghĩ mãi về ánh mắt đó."</em></p>

<p>Tôi đọc lại tin nhắn đó nhiều lần.</p>

<p>Không phải vì nó hay. Mà vì nó chứa đúng điều mà phần lớn đàn ông không dám nói ra — điều thật sự họ muốn, sâu hơn bất kỳ con số hay thành tích nào.</p>

<p>Không phải "tôi muốn kéo dài thêm 10 phút."</p>

<p>Là "tôi muốn thấy cô ấy nhìn tôi như vậy."</p>

<p>Không phải nhìn vì lịch sự. Không phải nhìn vì muốn anh bớt tự ti. Không phải cái nụ cười trấn an mà anh đã nhận quá nhiều lần và biết rõ đằng sau nó là gì.</p>

<p>Mà nhìn vì cô ấy <strong>thật sự</strong> thỏa mãn. Thật sự hạnh phúc. Thật sự muốn ở đây với anh.</p>

<p>Cái nhìn đó — anh không thể mua được bằng quà. Không thể đền bù bằng lời xin lỗi. Không thể giả tạo được. Nó chỉ đến khi mọi thứ thật sự ổn.</p>

<p>Và khi nó đến — anh biết ngay. Không cần ai nói. Không cần xác nhận. Chỉ biết.</p>

<p>Đó là điều mà học viên Kegel hay kể lại nhất. Không phải "tôi thêm được bao nhiêu phút" — mà là cái khoảnh khắc sau đó, nhìn vào mắt nhau, và biết rằng lần này mình đã làm được.</p>

<p>7 ngày. 10 phút mỗi ngày. Một cái nhìn như vậy — có lẽ xứng đáng hơn bất kỳ thứ gì khác anh đang chi tiền cho.</p>

<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 9 (Day 23): Proof — Anh Tuấn 8 tuần ────────────────────────
  {
    day: 23,
    subject: 'vợ anh Tuấn hỏi: "anh đang làm gì vậy?"',
    body: wrap(`<p>Anh Tuấn, 41 tuổi, TP.HCM. Kỹ sư phần mềm 15 năm kinh nghiệm. Công việc áp lực cao, hay làm đến 11-12 giờ đêm. Ít vận động. Hay uống cà phê nhiều.</p>

<p>Anh tìm đến FORMEN sau một đêm nằm không ngủ được — không phải vì mất ngủ, mà vì cứ nghĩ mãi về một lần thất vọng tuần trước đó. Anh tự hỏi "đến bao giờ thì khác?"</p>

<p>Anh mua Kegel Khởi Đầu ngay tối hôm đó. "Thử xem sao. 199k thì nếu không hiệu quả thì hoàn tiền, mất gì đâu."</p>

<p>Anh không kỳ vọng nhiều. Đã thử nhiều thứ rồi, quen với việc thất vọng rồi.</p>

<p>Sau ngày 7 đầu tiên, anh nhắn tôi: <em>"Khác một chút nhưng chưa rõ. Tiếp tục xem."</em></p>

<p>Tôi trả lời: "Tốt. Tiếp tục. Đừng đánh giá quá sớm."</p>

<p>Sau 3 tuần: <em>"Rõ hơn rồi. Rõ hơn nhiều. Không ngờ."</em></p>

<p>Sau 8 tuần — anh nhắn tôi một tin nhắn ngắn nhưng tôi đọc xong mỉm cười một mình:</p>

<p><em>"Vợ tôi hỏi tôi đang làm gì khác không, tại sao dạo này khác vậy. Tôi chỉ cười. Không nói gì."</em></p>

<p>Anh Tuấn không có gì đặc biệt so với anh. Không phải vận động viên. 41 tuổi. Công việc nhiều áp lực. Ít ngủ. Không có nhiều thời gian rảnh.</p>

<p>Chỉ tập đúng cách. Tập đủ 7 ngày đầu. Không thêm, không bớt. Sau đó tiếp tục duy trì.</p>

<p>Vợ anh Tuấn hỏi anh "đang làm gì khác không." Anh chỉ cười. Cái cười đó — tôi nghĩ nó ngon hơn bất kỳ câu trả lời nào.</p>

<p>Nếu anh chưa bắt đầu — không cần chờ thêm.</p>

<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ, hoàn tiền 7 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 10 (Day 26): Urgency nhẹ — lần cuối nhắc Kegel ──────────────
  {
    day: 26,
    subject: 'lần cuối tôi nhắc anh về điều này',
    body: wrap(`<p>Tôi đã gửi cho anh 9 email trong gần 4 tuần qua.</p>

<p>Không ép. Không đặt deadline giả. Không dùng chiêu "chỉ còn 2 suất" hay "giá tăng sau 24 giờ." Tôi không tin vào những thứ đó.</p>

<p>Tôi chỉ kể sự thật — về vấn đề, về cơ thể, về những người đàn ông đã tìm đến FORMEN và thay đổi.</p>

<p>Và đây là lần cuối tôi nhắc anh về Kegel Khởi Đầu.</p>

<p>Không phải vì tôi sắp xóa anh khỏi danh sách. Mà vì tôi tôn trọng anh đủ để không lặp đi lặp lại cùng một lời mời mãi. Anh đã nghe đủ rồi. Quyết định là của anh.</p>

<p>Nhưng trước khi kết thúc — tôi muốn nói thẳng một điều:</p>

<p>Vấn đề này không tự biến mất theo thời gian. Nó có thể im lặng một tuần, một tháng, khi anh bận rộn đủ để không nghĩ đến. Nhưng nó vẫn ở đó. Và nó sẽ hiện ra lại — trong phòng ngủ, trong suy nghĩ lúc 2 giờ sáng, trong khoảng cách nhỏ dần giữa anh và người anh yêu thương.</p>

<p>Mỗi tháng không làm gì là một tháng mà cơ thể không được huấn luyện, hệ thần kinh không được điều chỉnh, và mối quan hệ tiếp tục sống với cái rào cản vô hình đó.</p>

<p>199k. 7 ngày. 10 phút mỗi ngày. Hoàn tiền nếu không thấy khác biệt — tôi không có gì để mất từ lời hứa đó, vì tôi biết nó hoạt động.</p>

<p>Nếu anh sẵn sàng — link vẫn ở đây:</p>

<p style="text-align:center;margin:28px 0;"><a href="${KEGEL_URL}" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Kegel Khởi Đầu — 199.000đ →</a></p>

<p>Nếu anh chưa sẵn sàng — tôi hiểu. Và tôi vẫn sẽ tiếp tục gửi cho anh những thứ có giá trị. Không dừng lại vì anh chưa mua.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">Email tới — tôi sẽ nói thật với anh điều mà nhiều người bán hàng không dám nói: Kegel giải quyết được bao nhiêu phần trăm vấn đề, và cần gì để đến đích thật sự.</p>`)
  },

  // ── EMAIL 11 (Day 29): Bridge → MM21 — Kegel chỉ là tầng 1 ───────────
  {
    day: 29,
    subject: 'Kegel chỉ giải quyết 20% vấn đề',
    body: wrap(`<p>Tôi muốn nói thật với anh điều mà nhiều người bán hàng không dám nói.</p>

<p>Kegel rất hiệu quả. Kết quả của nó là thật — nhiều học viên cảm nhận rõ ràng chỉ sau 7 ngày đầu tiên. Cơ sàn chậu mạnh hơn, kiểm soát được hơn, tự tin hơn một chút.</p>

<p>Nhưng Kegel chỉ làm được 20% công việc. Chỉ tầng 1 trong 5 tầng.</p>

<p>Để đến điểm đích thật sự — tự chủ 15-30 phút, bước vào phòng ngủ mà không có bất kỳ lo lắng nào, không còn đếm giây, không còn cầu mong "lần này được không" — anh cần cả 5 tầng hoạt động đồng bộ:</p>

<p>
<strong>Tầng 1: Cơ sàn chậu</strong> ✓ — Kegel làm được. Đây là nền móng. Không có nền móng, không xây được gì cả.<br><br>
<strong>Tầng 2: Hệ thần kinh tự chủ</strong> — Huấn luyện phản xạ tự động để não bộ không còn "bắn" tín hiệu quá sớm. Không có thuốc nào làm được điều này — chỉ có luyện tập đúng cách.<br><br>
<strong>Tầng 3: Nội tiết tố</strong> — Cân bằng testosterone và cortisol. Stress mãn tính, thiếu ngủ, ăn uống kém — tất cả đều ảnh hưởng trực tiếp đến tầng này. Và phần lớn đàn ông Việt Nam đang có vấn đề ở đây mà không biết.<br><br>
<strong>Tầng 4: Tâm lý và vòng lặp</strong> — Phá vỡ vòng lặp lo lắng từ gốc rễ. Không phải bằng ý chí. Bằng kỹ thuật nhận thức và thở có kiểm soát đã được nghiên cứu lâm sàng.<br><br>
<strong>Tầng 5: Tuần hoàn và độ nhạy cảm</strong> — Điều chỉnh ngưỡng kích thích để cơ thể phản ứng đúng mức, không quá mức.
</p>

<p>Mật Mã 21 xây cả 5 tầng trong 21 ngày theo đúng thứ tự — tuần 1 cơ bắp và kỹ thuật, tuần 2 hệ thần kinh và tâm lý, tuần 3 tổng hợp và duy trì. Đó là lý do kết quả của nó bền vững — không phụ thuộc thuốc, không biến mất sau vài tuần dừng tập.</p>

<p>Nếu anh đã tập Kegel và cảm nhận được sự khác biệt nhỏ — anh đã có nền móng rồi. Bước tiếp theo là xây ngôi nhà lên đó.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Tìm hiểu Mật Mã 21 — 21 ngày, 5 tầng kiểm soát →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 12 (Day 32): Gain #4 — Cảm giác "đàn ông thật sự" ──────────
  {
    day: 32,
    subject: 'cảm giác mà anh chưa từng có',
    body: wrap(`<p>Tôi muốn anh tưởng tượng một khoảnh khắc.</p>

<p>Không phải khoảnh khắc trong phòng ngủ. Khoảnh khắc trước đó.</p>

<p>Anh đang ngồi ở phòng khách. Vợ/người yêu bước qua, chạm tay vào vai anh. Một cử chỉ nhỏ — có lẽ cô ấy không nghĩ nhiều về nó. Nhưng anh thì hiểu ý đó là gì.</p>

<p>Và anh không cảm thấy gì ngoài... hưng phấn. Không lo lắng. Không tính toán. Không cái tiếng thì thầm trong đầu: "Liệu lần này có ổn không? Mình có làm được không?"</p>

<p>Chỉ là hưng phấn. Chỉ là muốn ở gần cô ấy. Chỉ là hiện diện hoàn toàn với người mình yêu.</p>

<p>Đó là điều học viên Mật Mã 21 hay mô tả vào tuần 3 — không phải bằng con số, mà bằng cảm giác:</p>

<p><em>"Tôi cảm thấy như đàn ông thật sự lần đầu tiên trong cuộc đời. Không phải diễn. Không phải cố. Là thật."</em></p>

<p><em>"Tôi không còn sợ cái khoảnh khắc đó nữa. Tôi chờ đợi nó."</em></p>

<p><em>"Vợ tôi nói tôi khác rồi. Tự tin hơn. Cô ấy không biết tại sao — nhưng cô ấy thích."</em></p>

<p>Điều này không phải cường điệu. Đó là kết quả tự nhiên khi cả 5 hệ thống kiểm soát hoạt động đồng bộ. Khi não bộ không còn phải dành năng lượng để quản lý nỗi lo đó — toàn bộ sự hiện diện, toàn bộ sự chú ý, toàn bộ cảm xúc được dành cho khoảnh khắc đó.</p>

<p>Và điều kỳ lạ là — nó lan ra ngoài phòng ngủ. Học viên kể rằng họ tự tin hơn trong cuộc họp. Kiên nhẫn hơn với con cái. Ít cáu gắt hơn vì những chuyện nhỏ. Vì khi một nguồn lo lắng mãn tính được giải phóng — năng lượng đó được dùng cho những thứ quan trọng hơn.</p>

<p>Đó là mục tiêu thật sự của Mật Mã 21. Không phải con số phút giây. Là cảm giác đó.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 13 (Day 35): Proof — Anh Hùng 2 phút → 22 phút ─────────────
  {
    day: 35,
    subject: 'từ 2 phút lên 22 phút — câu chuyện thật',
    body: wrap(`<p>Anh Hùng, 32 tuổi. Đã có vợ 3 năm. Làm việc trong ngành xây dựng, công việc ngoài trời nhiều, tưởng chừng thể lực tốt.</p>

<p>Nhưng anh nhắn cho tôi với 2 câu ngắn:</p>

<p><em>"Tôi chỉ kéo dài được 2-3 phút là cùng. Vợ tôi chưa bao giờ nói gì, nhưng tôi biết. Chúng tôi ngày càng ít gần nhau hơn. Tôi không biết phải làm gì."</em></p>

<p>Tôi hỏi anh Hùng đã thử gì chưa. Anh kể: thuốc, gel bôi, kìm nén bằng ý chí. Thuốc làm anh tê — "không cảm nhận được gì, như đang ở ngoài cơ thể mình." Gel thì "hôi, vợ hỏi mùi gì vậy, ngại lắm." Kìm nén bằng ý chí — "được vài lần rồi lại đâu vào đó."</p>

<p>Anh Hùng bắt đầu với Kegel Khởi Đầu. Không kỳ vọng nhiều. Sau ngày 7, anh nói "có gì đó khác, không rõ lắm nhưng khác." Tôi bảo anh tiếp tục vào Mật Mã 21.</p>

<p>21 ngày sau — anh nhắn tôi một tin nhắn dài. Tôi xin phép anh được chia sẻ một phần:</p>

<p><em>"Lần đầu tiên trong 3 năm vợ tôi thật sự thỏa mãn. Không phải tôi đoán — là tôi biết chắc. Tôi ngạc nhiên. Cô ấy còn ngạc nhiên hơn tôi. Buổi tối hôm đó chúng tôi ôm nhau ngủ và không ai nói gì — nhưng tôi biết mọi thứ đã khác rồi. Cảm ơn anh."</em></p>

<p>Từ 2-3 phút lên 22 phút. Sau 7 ngày Kegel và 21 ngày Mật Mã 21.</p>

<p>Tôi không hứa với anh rằng anh sẽ đạt đúng con số đó. Mỗi người khác nhau — cơ thể khác nhau, xuất phát điểm khác nhau. Nhưng tôi có thể nói: nếu anh đi đúng hướng, đúng thứ tự, đúng phương pháp — cơ thể anh sẽ phản ứng. Nó được thiết kế để phản ứng.</p>

<p>Kegel là nền móng. Mật Mã 21 là ngôi nhà anh xây trên đó. Và câu chuyện anh Hùng — chỉ là một trong nhiều câu chuyện tôi nhận được mỗi tháng.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — xem chi tiết và bắt đầu →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 14 (Day 38): Pain #8 — Mối quan hệ lạnh dần ────────────────
  {
    day: 38,
    subject: 'khoảng cách mà không ai nhắc đến',
    body: wrap(`<p>Có một loại khoảng cách trong mối quan hệ mà không ai muốn nhắc đến.</p>

<p>Không phải vì nó không thật. Mà vì nói ra thì phải đối mặt với nó.</p>

<p>Không có cãi vã lớn. Không có sự kiện rõ ràng. Không có lý do cụ thể nào để chỉ vào và nói "đây là lúc mọi thứ thay đổi."</p>

<p>Chỉ là một ngày anh nhận ra — ít chạm vào nhau hơn so với năm ngoái. Ít nói chuyện trước khi ngủ hơn. Ít đề xuất đi đâu đó cùng nhau hơn. Ít ánh mắt tìm nhau qua phòng hơn.</p>

<p>Và cả hai đều cảm nhận được điều đó — nhưng không ai đặt tên cho nó. Vì đặt tên nghĩa là phải thừa nhận. Và thừa nhận nghĩa là phải làm gì đó.</p>

<p>Anh tự hỏi: "Vợ mình có nhận ra không? Hay chỉ mình mình thấy?" Nhưng anh biết câu trả lời rồi. Cô ấy nhận ra. Cô ấy chỉ không nói.</p>

<p>Đây là điều ít ai hiểu đúng về mối quan hệ: vấn đề thể chất chưa được giải quyết không chỉ ảnh hưởng đến phòng ngủ. Nó ảnh hưởng đến cả mối quan hệ bên ngoài — vì nó tạo ra một rào cản vô hình mà cả hai đều biết nhưng không ai dám vượt qua.</p>

<p>Rào cản đó khiến anh tránh né. Khiến cô ấy không chủ động. Khiến cả hai dần dần thu mình lại, sống song song thay vì cùng nhau.</p>

<p>Điều tôi thấy qua hàng trăm học viên Mật Mã 21: khi vấn đề được giải quyết, mối quan hệ ấm lại không phải vì họ cố gắng ấm lại. Mà vì rào cản không còn nữa. Tự nhiên thôi.</p>

<p><em>"Vợ tôi bắt đầu chủ động trở lại. Chúng tôi nói chuyện nhiều hơn, cười nhiều hơn. Cô ấy đề nghị đi du lịch — điều không xảy ra mấy năm nay."</em></p>

<p>Giải quyết vấn đề thể chất không chỉ là giải quyết vấn đề thể chất. Nó mở lại những cánh cửa mà cả hai đã âm thầm đóng lại — không biết từ bao giờ.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 15 (Day 41): Email cuối — Nói thẳng ─────────────────────────
  {
    day: 41,
    subject: 'email cuối — tôi nói thật một điều',
    body: wrap(`<p>Đây là email cuối trong chuỗi này.</p>

<p>Tôi đã gửi 14 email trong suốt 41 ngày qua. Không ép. Không deadline giả. Không "chỉ còn 3 suất." Chỉ chia sẻ thật — những gì tôi thật sự tin là có giá trị cho anh.</p>

<p>Và anh vẫn đang đọc email này. Sau 41 ngày.</p>

<p>Điều đó nói lên một điều: vấn đề này vẫn quan trọng với anh. Anh vẫn chưa tìm được câu trả lời mà anh cần. Hoặc anh đã bắt đầu nhưng biết mình vẫn còn đường để đi tiếp.</p>

<p>Tôi chỉ nói một điều thật trước khi kết thúc chuỗi này:</p>

<p>Vấn đề này không tự biến mất. Không phải vì thời gian, không phải vì tuổi tác. Nó cần được giải quyết chủ động. Bằng đúng phương pháp, đúng thứ tự, đủ kiên trì.</p>

<p>Mỗi tháng trôi qua mà không làm gì — là thêm một tháng anh và người bạn đời tiếp tục sống với cái khoảng cách vô hình đó. Không to tiếng. Không kịch tính. Chỉ lặng lẽ rộng thêm.</p>

<p>Nếu anh muốn bắt đầu từ bước nhỏ nhất — <a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu, 199.000đ</a>. 7 ngày. 10 phút/ngày. Hoàn tiền nếu không thấy khác biệt.</p>

<p>Nếu anh đã sẵn sàng cho bước đầy đủ hơn — <strong>Mật Mã 21</strong> xây cả 5 hệ thống trong 21 ngày. Kết quả bền vững. Không phụ thuộc thuốc. Hoàn tiền 3 ngày vô điều kiện.</p>

<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Bắt Đầu Mật Mã 21 — 686.868đ →</a></p>

<p>Dù anh quyết định gì — tôi tôn trọng. Không có lựa chọn nào sai khi anh đang chủ động tìm cách tốt hơn cho cuộc sống của mình.</p>

<p>Cảm ơn anh đã đọc. Thật lòng.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Nếu có câu hỏi gì — reply email này. Tôi đọc từng tin nhắn.</p>`)
  }
];

// ─── LUỒNG 2: KEGEL BUYER → MM21 ─────────────────────────────────────────
// 21 emails · Day 0,2,6,9,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61
// Email 1-3: Onboarding
// Email 4-5: Upsell Mật Mã 21 với 100k discount trong 48h
// Email 6-21: Follow-up xen kẽ pain/gain/job
const BUYER_KEGEL = [

  // ── EMAIL 1 (Day 0): Onboarding — Welcome ─────────────────────────────
  {
    day: 0,
    subject: 'anh vừa làm điều mà 94% không làm',
    body: wrap(`<p>Anh vừa mua Kegel Khởi Đầu.</p>

<p>Tôi muốn nói thẳng một điều trước khi anh vào bài học đầu tiên:</p>

<p>Phần lớn đàn ông gặp vấn đề này biết mình cần làm điều gì đó. Họ đọc, tìm hiểu, nghĩ "hôm nay mình sẽ bắt đầu." Rồi ngày mai. Rồi tuần sau. Rồi thôi. Lần lữa cho đến khi vấn đề không còn là vấn đề nữa — không phải vì nó biến mất, mà vì họ đã quen sống với nó.</p>

<p>Anh không phải người đó. Anh đã bấm mua. Anh đã bắt đầu. Và bước đó — dù có vẻ nhỏ — là bước khó nhất.</p>

<p>Bây giờ tôi cần anh làm tốt 7 ngày này. Đây là 3 điều quan trọng nhất trước khi vào bài 1:</p>

<p><strong>1. Chọn 1 giờ cố định và giữ suốt 7 ngày.</strong><br>
Sáng sau khi thức dậy hoặc tối trước khi ngủ — chọn 1 trong 2. Não bộ học Kegel theo thói quen, không phải theo cường độ. Tập lúc 7h sáng mỗi ngày hiệu quả hơn tập 3 lần/ngày không đều giờ.</p>

<p><strong>2. Kỹ thuật quan trọng hơn số lần.</strong><br>
Ngày 1-2, anh có thể chưa chắc mình đang co đúng cơ chưa. Hoàn toàn bình thường — bài 2 sẽ giải thích rõ 3 dấu hiệu nhận biết đang làm đúng. Tập sai 30 phút không bằng tập đúng 10 phút. Đừng vội.</p>

<p><strong>3. Ngày 3-4 là cột mốc đầu tiên.</strong><br>
Đây là lúc nhiều học viên bắt đầu cảm nhận cơ đang "sống" lại — một cảm giác nhẹ nhàng ở vùng đáy chậu, như thể cơ thể đang thức dậy ở chỗ mà trước đây anh không để ý. Không rõ ràng hoàn toàn. Nhưng anh sẽ nhận ra nếu để ý.</p>

<p>Một lưu ý cuối: nếu anh bỏ lỡ 1 ngày — không sao. Đừng tập bù. Cứ tiếp tục từ hôm sau. Nhất quán quan trọng hơn hoàn hảo.</p>

<p style="text-align:center;margin:28px 0;"><a href="${PORTAL_URL}" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Vào Portal Học Bài 1 Ngay →</a></p>

<p style="text-align:center;"><a href="${TG_GROUP}" style="background:#229ED9;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">📱 Tham Gia Nhóm Hỗ Trợ Telegram →</a></p>

<p>Nhóm Telegram có học viên đang tập cùng anh — nếu có câu hỏi kỹ thuật hay cần động viên giữa chặng, đây là chỗ tốt nhất.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. 7 ngày tới, tôi sẽ gửi cho anh một số điểm cần chú ý theo từng giai đoạn. Anh không tập một mình đâu.</p>`)
  },

  // ── EMAIL 2 (Day 2): Check-in — Kỹ thuật đúng ────────────────────────
  {
    day: 2,
    subject: 'ngày 3 — cái bẫy phổ biến nhất',
    body: wrap(`<p>Ngày 3 rồi. Anh đã xong bài 1, 2, 3 chưa?</p>

<p>Tôi muốn hỏi thẳng — không phải để kiểm tra, mà vì ngày 3 có một cái bẫy rất phổ biến mà tôi muốn anh tránh.</p>

<p>Bẫy đó là: <strong>tập thêm ngoài lịch vì nghĩ "tập nhiều hơn = kết quả nhanh hơn."</strong></p>

<p>Nghe có vẻ hợp lý. Nhưng với cơ sàn chậu — điều ngược lại mới đúng.</p>

<p>Cơ sàn chậu khác với cơ tay hay cơ bụng. Nó cần 24-48 giờ để phục hồi sau mỗi buổi tập. Nếu anh tập dồn dập — cơ bị kích thích quá mức, khó cô lập đúng, và anh sẽ bắt đầu co cả cơ mông hoặc cơ bụng mà không nhận ra. Tập như vậy 2 tuần sẽ không thấy kết quả — không phải vì Kegel không hiệu quả, mà vì anh đang tập sai mà không biết.</p>

<p>Giai đoạn đầu, thứ duy nhất quan trọng là: <strong>đúng cơ, đúng nhịp co-giãn, đúng thời gian nghỉ giữa các set.</strong> Không cần nhiều hơn.</p>

<p>Một dấu hiệu để biết anh đang làm đúng: khi co cơ PC, anh chỉ cảm thấy co ở vùng đáy chậu — không căng ở bụng, không siết ở mông, không nín thở. Nếu anh đang nín thở khi co — đó là dấu hiệu đang cố quá mức. Thả ra, thở bình thường, co nhẹ hơn.</p>

<p>Còn nếu ngày nào đó anh quên tập — không sao. Không cần tập bù. Chỉ cần tiếp tục từ sáng hôm sau. Việc bỏ 1 ngày không làm mất đi những gì đã xây. Nhưng tập bù có thể làm cơ mệt sai cách.</p>

<p><a href="${PORTAL_URL}" style="color:#2d6a4f;">Vào portal học bài tiếp theo →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Nếu có gì không chắc về kỹ thuật — nhắn nhóm Telegram. Học viên khác và tôi sẽ phản hồi trong ngày.</p>`)
  },

  // ── EMAIL 3 (Day 6): Hoàn thành tuần 1 — cầu nối ─────────────────────
  {
    day: 6,
    subject: '7 ngày xong rồi — anh cảm thấy gì?',
    body: wrap(`<p>7 ngày.</p>

<p>Anh làm được. Không phải ai cũng làm được — thật sự.</p>

<p>Tôi muốn hỏi thật, không phải xã giao: Anh cảm thấy gì khác so với 7 ngày trước?</p>

<p>Không cần phải là kết quả hoàn hảo. Không cần phải là con số ấn tượng. Chỉ là — có gì đó khác không? Dù nhỏ?</p>

<p>Nhiều học viên ở giai đoạn này kể rằng họ cảm nhận được một sự khác biệt nhỏ — một cảm giác kiểm soát nhẹ mà trước đây không có. Không rõ ràng như họ mong đợi. Nhưng nó thật. Và họ biết nó thật vì họ đã từng cố gắng cảm nhận điều này trước đây mà không được.</p>

<p>Đây là nền móng. Cơ sàn chậu của anh đang được đánh thức sau nhiều năm không được sử dụng đúng cách. 7 ngày chưa phải là kết quả cuối cùng — nhưng là bằng chứng rằng cơ thể anh đang phản ứng.</p>

<p>Bây giờ tôi muốn nói thật một điều:</p>

<p>3-5 phút thêm mà Kegel mang lại — đó chỉ là tầng 1 của 5 tầng kiểm soát. Cơ sàn chậu mạnh hơn là nền móng, nhưng không phải ngôi nhà. Vẫn còn đó hệ thần kinh tự chủ chưa được huấn luyện. Vẫn còn đó vòng lặp lo lắng tâm lý chưa được phá vỡ. Vẫn còn đó nội tiết tố chưa được tối ưu.</p>

<p>Nếu anh muốn dừng ở đây — hoàn toàn được. Anh đã tốt hơn rồi. Thật sự.</p>

<p>Nhưng nếu anh muốn đến điểm đích thật sự — bước vào phòng ngủ mà không còn lo lắng, không còn đếm giây, tự chủ 15-30 phút bền vững — thì có bước tiếp theo.</p>

<p>Tôi sẽ chia sẻ với anh trong email tới. Và tôi có một ưu đãi dành riêng cho học viên Kegel đã hoàn thành 7 ngày — anh xứng đáng được ưu đãi đó vì anh đã làm được điều mà phần lớn không làm.</p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 4 (Day 9): Upsell MM21 — Ưu đãi 100k trong 48h ─────────────
  {
    day: 9,
    subject: 'ưu đãi dành riêng cho anh — còn 48 giờ',
    body: wrap(`<p>Anh vừa hoàn thành 7 ngày Kegel Khởi Đầu.</p>

<p>Anh đã xây tầng 1 — cơ sàn chậu. Nền móng quan trọng nhất. Và anh đã cảm nhận được sự khác biệt. Nhỏ thôi, nhưng thật.</p>

<p>Hôm nay tôi muốn mời anh vào bước tiếp theo: <strong>Mật Mã 21</strong>.</p>

<p>21 ngày. Xây tiếp 4 tầng còn lại — hệ thần kinh tự chủ, nội tiết tố, tâm lý và vòng lặp lo lắng, tuần hoàn và độ nhạy cảm. Kết quả mà học viên đạt được sau 21 ngày: tự chủ 15-30 phút bền vững. Không phụ thuộc thuốc. Không cần kìm nén. Không còn lo lắng trước khi bắt đầu.</p>

<p>Tôi có một ưu đãi dành riêng cho học viên Kegel đã hoàn thành 7 ngày — những người đã chứng minh được họ cam kết thật sự:</p>

<p style="background:#f5f5f5;padding:20px;border-radius:8px;text-align:center;"><strong>Giảm 100.000đ</strong><br>Còn <strong style="font-size:20px;">586.868đ</strong> thay vì 686.868đ<br><em style="font-size:13px;">Chỉ trong 48 giờ kể từ khi nhận email này</em></p>

<p>Tại sao chỉ 48 giờ? Không phải chiêu marketing. Mà vì đây là thời điểm tốt nhất về mặt sinh lý để tiếp tục — cơ thể anh đang "nóng," thói quen tập luyện vừa được xây, và cơ sàn chậu vừa được kích hoạt đúng cách. Nếu dừng lại quá lâu, anh phải bắt đầu lại từ đầu.</p>

<p>Anh Hùng, 32 tuổi, Hà Nội — bắt đầu từ Kegel rồi vào Mật Mã 21 ngay tuần sau:<br>
<em>"Từ 2-3 phút lên 22 phút sau 21 ngày. Lần đầu tiên trong 3 năm vợ tôi thật sự thỏa mãn. Buổi tối hôm đó chúng tôi ôm nhau ngủ và không ai nói gì — nhưng tôi biết mọi thứ đã khác rồi."</em></p>

<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Nhận Ưu Đãi — Mật Mã 21 (586.868đ) →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày vô điều kiện nếu anh không thấy phù hợp. Tôi không giữ tiền của ai khi họ không hài lòng.</p>`)
  },

  // ── EMAIL 5 (Day 13): Upsell MM21 — Email cuối ưu đãi ────────────────
  {
    day: 13,
    subject: 'ưu đãi hết hôm nay — tôi nói thật',
    body: wrap(`<p>Hôm nay là ngày cuối của ưu đãi 100k dành cho học viên Kegel.</p>

<p>Sau hôm nay, Mật Mã 21 trở về giá 686.868đ.</p>

<p>Tôi không muốn ép anh bằng cảm giác gấp gáp. Nhưng tôi cũng muốn nói thật — vì tôi nghĩ anh xứng đáng được nghe thật hơn là được nghe những gì anh muốn nghe.</p>

<p>Anh đã tập 7 ngày Kegel. Anh biết nó là thật — không phải ảo giác, không phải tự kỷ ám thị. Cơ thể anh đã phản ứng. Cảm giác kiểm soát nhỏ đó là thật.</p>

<p>Nhưng anh cũng biết — nó chưa đủ. Vẫn còn đó cái lo lắng mỗi lần "đến lúc đó." Vẫn còn đó cảm giác "chưa chắc lần này." Vẫn còn đó khoảnh khắc anh muốn nhưng không dám.</p>

<p>Đó là 4 tầng còn lại mà Kegel chưa chạm đến. Hệ thần kinh vẫn đang phản xạ theo thói quen cũ. Vòng lặp lo lắng vẫn chưa bị phá vỡ. Nội tiết tố vẫn chưa được tối ưu.</p>

<p>Mật Mã 21 giải quyết chính xác những chỗ đó. Không phải bằng cơ bắp — mà bằng hệ thần kinh, tâm lý, và nội tiết tố. Bằng 21 ngày có hệ thống, đúng thứ tự, đúng tiến trình.</p>

<p>Nếu anh biết mình muốn tiến tiếp — đây là thời điểm:</p>

<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Mật Mã 21 — 586.868đ (ưu đãi cuối hôm nay) →</a></p>

<p>Nếu anh chưa sẵn sàng — tôi hoàn toàn tôn trọng. Tôi vẫn sẽ tiếp tục gửi cho anh những nội dung có giá trị. Không dừng email vì anh chưa mua thêm.</p>

<p>Nhưng nếu anh đang đọc email này và trong lòng đang có câu hỏi "liệu Mật Mã 21 có phải cho mình không" — câu trả lời thường là có. Vì người không cần thì không hỏi.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày. Anh thử 3 ngày đầu — nếu không thấy hướng đi phù hợp, tôi hoàn tiền ngay.</p>`)
  },

  // ── EMAIL 6 (Day 16): Job #7 — Không còn gánh nặng ──────────────────
  {
    day: 16,
    subject: 'cái gánh nặng anh đang mang',
    body: wrap(`<p>Tôi muốn hỏi anh một điều thật thẳng thắn.</p>

<p>Không phải về cơ thể. Về tâm trí.</p>

<p>Mỗi ngày — khi anh đang ăn, đang làm việc, đang ngồi họp, đang nói chuyện với người khác — có một phần nhỏ trong đầu anh vẫn đang nghĩ về chuyện đó không?</p>

<p>Không phải cả ngày. Không phải rõ ràng. Nhưng nó ở đó. Như một màn hình nền không tắt được.</p>

<p>Anh nghĩ đến buổi tối hôm đó. Đến lần tiếp theo. Đến cái câu hỏi "liệu lần này có ổn không?" Và dù không muốn để nó chi phối — nó vẫn chiếm một phần năng lượng tinh thần của anh mỗi ngày.</p>

<p>Đó là gánh nặng tinh thần mãn tính. Và nó khác hoàn toàn với gánh nặng thể chất — vì không ai nhìn thấy nó. Không ai biết anh đang mang nó. Và anh cũng không thể đặt xuống bằng ý chí.</p>

<p>Đây là điều mà Kegel không giải quyết được — vì Kegel chỉ tăng sức mạnh cơ bắp. Gánh nặng tinh thần nằm ở hệ thần kinh và tâm lý — một tầng khác hoàn toàn.</p>

<p>Học viên Mật Mã 21 hay kể về tuần 3 bằng một câu rất bình thường:</p>

<p><em>"Tôi nhận ra mình đã không nghĩ đến chuyện đó nữa. Tự nhiên thôi. Không phải vì cố quên — mà vì nó không còn là vấn đề nữa."</em></p>

<p>Không ai hứa với họ điều đó sẽ xảy ra. Nó xảy ra tự nhiên khi vấn đề được giải quyết thật sự ở cả 5 tầng.</p>

<p>Đó là mục tiêu thật sự — không phải thêm vài phút giây. Là không còn phải mang cái gánh đó nữa.</p>

<p>Khi gánh nặng đó được đặt xuống — anh sẽ ngạc nhiên vì bao nhiêu năng lượng bấy lâu nay nó đã ngốn mất. Và bây giờ anh có lại năng lượng đó — để dành cho công việc, cho gia đình, cho bản thân.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 21 ngày đặt gánh xuống →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Mật Mã 21 có một tuần hoàn toàn dành cho hệ thần kinh và tâm lý — không phải cơ bắp. Đây là phần mà hầu hết phương pháp khác bỏ qua.</p>`)
  },

  // ── EMAIL 7 (Day 19): Gain #3 — Bước vào không còn lo ────────────────
  {
    day: 19,
    subject: 'buổi sáng không còn nghĩ đến chuyện đó',
    body: wrap(`<p>Tôi muốn anh tưởng tượng một buổi sáng.</p>

<p>Anh thức dậy lúc 6h30. Cốc cà phê đầu tiên. Mở điện thoại đọc tin. Chuẩn bị đi làm.</p>

<p>Và trong toàn bộ 30 phút đó — không có cái ý nghĩ đó chen vào lần nào.</p>

<p>Không phải vì anh cố quên. Không phải vì anh xao lãng vào thứ gì khác. Mà vì nó đơn giản là không còn là vấn đề nữa. Anh đã có đủ kiểm soát — không cần phải lo về nó.</p>

<p>Nghe đơn giản. Nhưng nếu anh đã sống với vấn đề này nhiều năm — anh hiểu đó không phải điều nhỏ. Nó là cả một sự thay đổi về chất lượng tinh thần.</p>

<p>Anh Thắng, 35 tuổi, kỹ sư phần mềm ở Hà Nội, chia sẻ sau tuần 3 Mật Mã 21:</p>

<p><em>"Tôi ngủ ngon hơn — mà không hiểu tại sao ngủ ngon hơn. Buổi sáng tỉnh giấc không còn cái cảm giác nặng nề đó nữa. Họp hành tập trung hơn. Ít cáu kỉnh hơn với vợ vì chuyện nhỏ. Tôi không ngờ giải quyết một vấn đề mà lại ảnh hưởng đến nhiều thứ như vậy trong cuộc sống."</em></p>

<p>Không phải ngẫu nhiên. Đây là sinh lý học cơ bản: cortisol — hormone stress — tăng cao khi có một nguồn lo lắng mãn tính chưa được giải quyết. Khi nguồn đó biến mất, cortisol giảm. Và hàng loạt thứ khác cải thiện theo — giấc ngủ, tập trung, tâm trạng, thậm chí cả năng lượng thể chất.</p>

<p>Đó là lý do học viên Mật Mã 21 hay nói "tôi không ngờ nó ảnh hưởng đến nhiều thứ như vậy." Họ vào để giải quyết một vấn đề cụ thể — và nhận được nhiều hơn những gì họ tưởng.</p>

<p>Anh Kegel đã 7 ngày — cơ đã mạnh hơn. Nền móng đã có. Bây giờ là lúc xây phần còn lại.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 8 (Day 22): Gain #6 — Mối quan hệ ấm lại ──────────────────
  {
    day: 22,
    subject: '"vợ tôi bắt đầu chủ động trở lại"',
    body: wrap(`<p>Anh Minh, 39 tuổi, nhắn tôi vào một buổi chiều thứ Bảy:</p>

<p><em>"Không hiểu sao. Tuần này tự nhiên vợ tôi chủ động hơn. Cười nhiều hơn. Nói chuyện trước khi ngủ nhiều hơn — những chuyện nhỏ trong ngày, kiểu trước đây chúng tôi hay nói với nhau. Hôm qua cô ấy đề nghị đi chơi cả ngày cuối tuần chỉ hai vợ chồng — điều mà không xảy ra mấy năm nay. Tôi không biết cô ấy có nhận ra điều gì đã thay đổi không. Nhưng tôi thì biết."</em></p>

<p>Anh Minh không nói Mật Mã 21 trực tiếp làm được tất cả những điều đó. Anh ấy chỉ kể lại những gì đã xảy ra — tự nhiên — sau khi vấn đề kia được giải quyết.</p>

<p>Đây là điều ít ai hiểu về mối quan hệ vợ chồng: khi có một vấn đề thể chất chưa được giải quyết — nó tạo ra một rào cản vô hình. Không ai đặt tên cho nó. Không ai nhắc đến nó. Nhưng cả hai đều cảm nhận.</p>

<p>Rào cản đó khiến anh tránh né. Khiến cô ấy không chủ động — vì cô ấy không muốn tạo áp lực. Khiến cả hai dần sống song song thay vì cùng nhau. Ít chạm. Ít nói. Ít kế hoạch chung.</p>

<p>Và rào cản đó không tự biến mất khi cả hai đều "cố gắng giao tiếp tốt hơn" hay "dành thời gian cho nhau nhiều hơn." Nó biến mất khi vấn đề gốc rễ được giải quyết.</p>

<p>Anh Minh sau 21 ngày — không phải chỉ có kết quả thể chất. Là cả một mối quan hệ ấm lại theo cách anh ấy không ngờ đến.</p>

<p>Đó là thứ mà con số phút giây không diễn đạt được.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày vô điều kiện. Nếu sau 3 ngày đầu anh không thấy phương pháp phù hợp — tôi hoàn tiền ngay.</p>`)
  },

  // ── EMAIL 9 (Day 25): Pain #4 — Cảm giác không xứng đáng ────────────
  {
    day: 25,
    subject: 'không phải lỗi của anh — tôi nói thật',
    body: wrap(`<p>Tôi muốn nói thẳng một điều mà ít ai nói với đàn ông đang gặp vấn đề này.</p>

<p><strong>Không phải lỗi của anh.</strong></p>

<p>Không phải vì anh yếu. Không phải vì anh không đủ đàn ông. Không phải vì anh đã làm gì sai trong quá khứ. Không phải vì di truyền, không phải vì thói quen xấu, không phải vì "anh không cố đủ."</p>

<p>Đây là một vấn đề sinh lý — và nó có thể được huấn luyện lại.</p>

<p>Giải phẫu học rất rõ ràng: cơ sàn chậu chưa được huấn luyện đúng cách (điều Kegel đang sửa), hệ thần kinh giao cảm phản ứng quá mức dưới áp lực, và vòng lặp lo lắng tâm lý tự duy trì và khuếch đại nhau. Ba yếu tố này có thể học lại được. Có thể huấn luyện được. Đã có phương pháp rõ ràng cho từng tầng.</p>

<p>Nhưng cái cảm giác "mình không xứng đáng" mà anh đang mang — nó không nằm trong sinh lý. Nó nằm trong câu chuyện anh đang kể cho bản thân nghe mỗi ngày.</p>

<p>"Mình không đủ tốt."<br>
"Mình làm vợ/người yêu thất vọng."<br>
"Đàn ông khác không như vậy."<br>
"Có lẽ mình sẽ không bao giờ thay đổi được."</p>

<p>Những câu đó — anh chưa bao giờ nói với ai. Nhưng anh biết chúng. Và chúng nặng hơn bất kỳ vấn đề thể chất nào.</p>

<p>Tôi muốn anh nghe điều này: hàng trăm người đã ngồi ở chỗ anh đang ngồi. Mang cùng câu chuyện đó. Và họ đã thay đổi được — không phải vì họ đặc biệt, mà vì họ tìm được đúng phương pháp và bắt đầu.</p>

<p>Mật Mã 21 không bán cho anh tự tin bằng lời nói. Nó giúp anh xây lại nền tảng thể chất và tâm lý để tự tin xuất hiện tự nhiên — vì nó có lý do thật để xuất hiện.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 10 (Day 28): Gain #4 — Cảm giác đàn ông thật sự ───────────
  {
    day: 28,
    subject: '"lần đầu tiên cảm thấy mình là đàn ông thật sự"',
    body: wrap(`<p>Đó là lời anh Nam, 38 tuổi, kế toán tại TP.HCM. Đã có vợ 7 năm, hai con nhỏ.</p>

<p>Anh ấy không nói điều đó với ai. Chỉ nhắn riêng cho tôi — sau ngày 21 của Mật Mã 21.</p>

<p>Tôi hỏi: "Anh có thể mô tả cụ thể hơn không?"</p>

<p>Anh Nam trả lời:</p>

<p><em>"Tôi không biết mô tả thế nào khác. Trước đây, mỗi lần vợ chạm vào tôi — dù chỉ là chạm tay qua bàn ăn — tôi cảm thấy ngay cái lo lắng đó. Như một cái chuông reo. Tôi thích cô ấy, nhưng lại sợ khoảnh khắc đó dẫn đến đâu.</em></p>

<p><em>Sau 21 ngày — lần đầu tiên tôi chạm lại tay cô ấy mà không có cái chuông đó. Chỉ là thích. Chỉ là muốn ở gần. Chỉ là hiện diện hoàn toàn. Lần đầu tiên trong 7 năm."</em></p>

<p>Anh Nam không dùng từ "đàn ông thật sự" theo nghĩa hào hùng. Anh dùng nó để mô tả một điều rất cụ thể: cảm giác hiện diện hoàn toàn, không bị lo lắng chi phối, với người mình yêu.</p>

<p>Đó là điều xảy ra khi cả 5 hệ thống kiểm soát hoạt động đúng cùng lúc. Não bộ không còn phải phân chia năng lượng để quản lý nỗi lo đó — nên toàn bộ sự chú ý, toàn bộ cảm xúc, toàn bộ hiện diện được trao cho khoảnh khắc và người bên cạnh.</p>

<p>Và nó lan ra ngoài theo những cách anh ấy không ngờ: họp hành quyết đoán hơn, kiên nhẫn hơn với con cái khi chúng quấy, ít cáu gắt hơn vì những chuyện không đáng. Vì khi một gánh nặng tinh thần mãn tính được giải phóng — năng lượng đó được dùng cho những thứ quan trọng hơn.</p>

<p>Anh đã có nền móng từ 7 ngày Kegel. Câu chuyện anh Nam bắt đầu từ đúng chỗ anh đang đứng.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày vô điều kiện. Anh thử 3 ngày đầu — nếu không thấy phù hợp, tôi hoàn tiền không hỏi lý do.</p>`)
  },

  // ── EMAIL 11 (Day 31): Job #1 — Giữ hôn nhân ─────────────────────────
  {
    day: 31,
    subject: 'điều anh thật sự đang cố bảo vệ',
    body: wrap(`<p>Tôi muốn hỏi anh một điều — không phải về cơ thể, mà về điều sâu hơn.</p>

<p>Sâu bên trong, anh không chỉ muốn kéo dài thêm vài phút. Anh biết điều đó.</p>

<p>Điều anh thật sự muốn — điều anh đang cố bảo vệ mà không nói ra — là hôn nhân ổn. Là người bạn đời hạnh phúc. Là không còn cái khoảng cách vô hình lớn dần mỗi tháng.</p>

<p>Anh muốn buổi tối về nhà mà không mang theo cái lo lắng đó. Anh muốn cuối tuần không cần phải tìm cách tránh né — giả vờ mệt, giả vờ ngủ sớm, giả vờ bận điện thoại. Anh muốn có mặt thật sự với người bên cạnh — không phải một nửa hiện diện, nửa còn lại đang quản lý nỗi lo.</p>

<p>Đó mới là điều thật sự đang bị đặt cược. Không phải vài phút đồng hồ.</p>

<p>Anh Tuấn, 41 tuổi, kỹ sư xây dựng ở TP.HCM, nhắn tôi vào tuần 3 Mật Mã 21:</p>

<p><em>"Lần đầu tiên trong nhiều năm tôi không nghĩ gì cả. Chỉ là ở đó. Với vợ. Không lo. Không đếm. Không tính. Tôi không ngờ đó là thứ mình đang thiếu."</em></p>

<p>Đó là điều Mật Mã 21 xây — không phải bằng cơ bắp, mà bằng sự hiện diện. Khả năng thật sự có mặt với người mình yêu — không có màn hình nền lo lắng chen vào.</p>

<p>Phần lớn học viên vào với mục tiêu thể chất. Họ ở lại vì nhận ra thứ họ lấy lại còn lớn hơn nhiều.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 12 (Day 34): Job #5 — Chữa lành tổn thương nhiều năm ────────
  {
    day: 34,
    subject: 'vết thương tích lũy nhiều năm',
    body: wrap(`<p>Với nhiều anh — vấn đề này không phải mới xuất hiện. Nó đã ở đó nhiều năm.</p>

<p>Có thể từ năm đầu tiên với người yêu, khi anh lần đầu nhận ra mình không kiểm soát được. Có thể từ đêm tân hôn. Có thể từ một khoảnh khắc cụ thể nào đó mà anh vẫn nhớ rõ — dù không muốn nhớ.</p>

<p>Và trong suốt những năm đó — mỗi lần thất vọng là thêm một lớp nhỏ. Mỗi cái thở dài không nói thành lời của cô ấy là thêm một vết. Mỗi lần giả vờ không sao nhưng trong lòng biết rõ — là thêm một lớp nữa. Tích lũy thành cái gánh nặng anh đang mang hôm nay.</p>

<p>Không phải lỗi của ai. Không phải vì anh yếu. Chỉ là chưa có ai chỉ anh cách giải quyết đúng — và anh đã tự xoay xở một mình trong quá lâu.</p>

<p>Điều này quan trọng để anh hiểu: giải quyết vấn đề này không chỉ là thêm vài phút đồng hồ. Không phải chỉ là kỹ thuật. Nó là quá trình trả lại cho anh thứ đã bị lấy đi trong nhiều năm — sự tự tin, cảm giác xứng đáng, và sự bình yên trong mối quan hệ.</p>

<p>21 ngày không thể xóa hết mấy năm. Nhưng nó có thể đặt anh ở một điểm mà từ đó mọi thứ bắt đầu khác.</p>

<p>Và câu chuyện đó — anh bắt đầu viết lại được ngay hôm nay.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày. Anh thử 3 ngày đầu — nếu không thấy hướng đi phù hợp, tôi hoàn tiền ngay không hỏi lý do.</p>`)
  },

  // ── EMAIL 13 (Day 37): Pain #3 — Vòng lặp lo lắng ────────────────────
  {
    day: 37,
    subject: 'vòng lặp tự phá hoại — và cách thoát ra',
    body: wrap(`<p>Tôi muốn giải thích một điều mà ít phương pháp nào nói rõ.</p>

<p>Đây là vòng lặp mà hầu hết đàn ông gặp phải — và không biết đó là một vòng lặp:</p>

<p><strong>Lo lắng trước → kích hoạt hệ thần kinh giao cảm → cơ thể tăng tốc phản xạ → kết quả ngắn hơn → thất vọng → lo lắng nhiều hơn cho lần sau.</strong></p>

<p>Vòng tự phá hoại. Và nó hoạt động hoàn hảo — theo chiều ngược với điều anh muốn. Càng lo lắng → càng khó kiểm soát → càng lo lắng hơn.</p>

<p>Đây là lý do kìm nén bằng ý chí không hoạt động lâu dài — vì ý chí không điều khiển được hệ thần kinh giao cảm. Ý chí là ý thức. Hệ thần kinh giao cảm là tự động.</p>

<p>Và đây cũng là lý do anh có thể làm Kegel 7 ngày, cơ đã mạnh hơn — nhưng vẫn còn lo lắng trước "lúc đó." Không phải vì Kegel không hiệu quả. Mà vì cơ và hệ thần kinh là hai hệ thống khác nhau. Kegel rèn cơ. Hệ thần kinh cần một loại huấn luyện khác hoàn toàn.</p>

<p>Mật Mã 21 có một tuần — tuần 2 — dành hoàn toàn cho hệ thần kinh và tâm lý. Không phải bằng ý chí hay "cứ bình tĩnh thôi." Mà bằng kỹ thuật cụ thể: kỹ thuật thở 4-7-8 điều chỉnh nhịp tim, kỹ thuật tập trung nhận thức phá vỡ chu kỳ lo lắng, và phương pháp huấn luyện phản xạ tự động trong 14 ngày.</p>

<p>Thoát khỏi vòng lặp không cần ý chí. Cần kỹ thuật đúng.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 14 (Day 40): Gain #5 — Tự tin lan ra ngoài ─────────────────
  {
    day: 40,
    subject: 'tự tin trong phòng ngủ → tự tin ngoài đời thật',
    body: wrap(`<p>Tôi muốn kể cho anh nghe điều mà học viên kể cho tôi nghe nhiều lần — và mỗi lần tôi vẫn ngạc nhiên.</p>

<p>Sau khi giải quyết xong vấn đề kiểm soát — cuộc sống bên ngoài cũng thay đổi. Theo những cách mà họ không đặt mục tiêu cho.</p>

<p>Anh Phong, 36 tuổi, quản lý cấp trung ở Hà Nội, kể lại sau tuần 3:</p>

<p><em>"Tôi tự tin hơn trong cuộc họp. Kiên nhẫn hơn khi con ăn vạ. Quyết đoán hơn khi đưa ra quyết định công việc. Vợ tôi hỏi tôi dạo này có gì mà tự tin vậy — tôi chỉ cười. Tôi không biết giải thích sao."</em></p>

<p>Không phải ngẫu nhiên. Có cơ chế sinh lý rõ ràng đằng sau điều này.</p>

<p>Khi một nguồn lo lắng mãn tính — thứ chiếm một phần năng lượng tinh thần của anh mỗi ngày trong nhiều tháng, nhiều năm — được giải phóng hoàn toàn: cortisol giảm, testosterone ổn định hơn, não không còn phải phân chia tài nguyên cho mối đe dọa ngầm đó nữa.</p>

<p>Kết quả: toàn bộ năng lượng tinh thần — sự tập trung, sự tự tin, sự kiên nhẫn — được dành cho những thứ quan trọng hơn. Công việc. Gia đình. Bản thân.</p>

<p>Học viên thường không biết điều này trước khi vào Mật Mã 21. Họ đến để giải quyết một vấn đề cụ thể. Và nhận được nhiều hơn nhiều những gì họ tưởng.</p>

<p>Anh đã có 7 ngày Kegel — nền móng đã có. Câu chuyện của anh Phong bắt đầu từ đúng chỗ anh đang đứng.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 15 (Day 43): Job #3 — Không để vợ thiếu thốn ──────────────
  {
    day: 43,
    subject: 'không phải cho bản thân — là cho cô ấy',
    body: wrap(`<p>Tôi muốn nói về một điều mà đàn ông thường không nói ra thẳng — nhưng tôi biết nó đang ở đó.</p>

<p>Không phải nỗi sợ mất mặt. Không phải tự ái. Không phải cái tôi.</p>

<p>Mà là nỗi sợ khiến người mình yêu thương thất vọng.</p>

<p>Anh làm mọi thứ đúng. Đi làm chăm chỉ. Chăm lo gia đình. Cố gắng là người chồng tốt, người cha tốt. Nhưng có một điều — một điều thôi — mà anh không kiểm soát được. Và nó khiến anh cảm thấy mình chưa đủ cho cô ấy.</p>

<p>Không phải vì cô ấy nói gì. Có thể cô ấy chưa bao giờ phàn nàn. Nhưng anh biết. Và cái "anh biết" đó nặng hơn bất kỳ lời nói nào.</p>

<p>Đây là customer job thật sự của phần lớn người đến với FORMEN. Không phải "tôi muốn cảm giác tốt hơn." Mà là: "Tôi không muốn cô ấy thiếu thốn. Tôi muốn là người đàn ông đủ cho cô ấy — ở mọi khía cạnh."</p>

<p>Đó không phải điểm yếu. Đó là tình yêu thật sự.</p>

<p>Và đó cũng là lý do anh xứng đáng có công cụ tốt nhất để giải quyết điều này — không phải bằng ý chí, không phải bằng kìm nén, mà bằng phương pháp có hệ thống, được thiết kế để hoạt động bền vững.</p>

<p>Mật Mã 21 là 21 ngày để anh trở thành người bạn đời mà anh muốn là — không phải vì áp lực, mà vì anh đã có đủ công cụ để tự tin là chính mình.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày vô điều kiện. Anh thử 3 ngày đầu không rủi ro gì.</p>`)
  },

  // ── EMAIL 16 (Day 46): Pain #8 — Quan hệ lạnh dần ───────────────────
  {
    day: 46,
    subject: 'khoảng cách không ai nhắc đến',
    body: wrap(`<p>Nhiều cặp đôi không xa nhau vì to tiếng hay cãi vã lớn.</p>

<p>Họ xa dần vì những khoảng cách nhỏ tích lũy. Từng tháng một, từng tuần một — không ai để ý cho đến khi cả hai nhìn lại và tự hỏi "Chúng tôi đã xa nhau từ bao giờ vậy?"</p>

<p>Ít chạm vào nhau hơn. Ít nói chuyện sâu hơn — kiểu chuyện thật sự, không phải hỏi thăm xã giao. Ít cười với nhau hơn. Ít kế hoạch chung hơn. Ít ánh mắt tìm nhau khi đang ở cùng phòng.</p>

<p>Không ai nói lý do. Vì nói ra thì phải đối mặt.</p>

<p>Và điều khó nhất là: cả hai đều cảm nhận khoảng cách đó — nhưng không ai đặt tên cho nó. Không ai muốn là người đầu tiên nói "mình đang xa nhau." Vì nói nghĩa là thừa nhận. Và thừa nhận nghĩa là phải làm gì đó.</p>

<p>Tôi đã thấy điều này trong hàng trăm mối quan hệ qua câu chuyện của học viên. Không phải mối quan hệ xấu. Không phải cặp đôi không yêu nhau. Chỉ là một vấn đề thể chất chưa được giải quyết — tạo ra một rào cản vô hình — và cả hai sống với rào cản đó đủ lâu để quên mất nó không cần phải ở đó.</p>

<p>Điều tôi thấy sau khi học viên giải quyết vấn đề này: mối quan hệ ấm lại không phải vì họ cố gắng ấm lại. Mà vì rào cản không còn. Tự nhiên. Không cần kế hoạch.</p>

<p><em>"Tự nhiên vợ tôi cười nhiều hơn. Tôi không biết tại sao. Cô ấy cũng không biết. Nhưng chúng tôi đều cảm thấy."</em></p>

<p>Anh và người bên cạnh xứng đáng được có lại điều đó.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 17 (Day 49): Gain #9 — Tự hào thầm với bản thân ───────────
  {
    day: 49,
    subject: 'cái tự hào không cần ai biết',
    body: wrap(`<p>Có một loại tự hào mà anh sẽ không kể với ai.</p>

<p>Không phải tự hào đăng Facebook. Không phải kể với bạn bè nhậu. Không phải khoe với anh em.</p>

<p>Chỉ là một buổi tối — có thể là một thứ Ba bình thường — anh nhìn vào gương trong nhà tắm và thầm biết: "Mình đã làm được."</p>

<p>Không cần ai xác nhận. Không cần ai hay biết. Chỉ là anh và cái khoảnh khắc đó.</p>

<p>Học viên hay nhắn tôi về khoảnh khắc đó. Không bao giờ phô trương — thường chỉ là một câu ngắn, gửi lúc 10h tối, đôi khi chỉ là một emoji. Nhưng tôi biết trọng lượng của nó. Vì tôi biết họ đã ở đâu trước đó.</p>

<p>Cái tự hào đó khác hoàn toàn với cảm giác mua được một thứ gì đó. Nó khác với cảm giác khi nhận thưởng, khi thăng chức, khi được khen ngợi. Những thứ đó đến từ bên ngoài — có thể biến mất khi hoàn cảnh thay đổi.</p>

<p>Cái tự hào này đến từ bên trong. Từ việc anh đã đối mặt với điều mình sợ nhất, làm điều khó nhất — tự mình, riêng tư — và đã đến được chỗ kia.</p>

<p>Đó là thứ không có thuốc nào mua được. Không có phím tắt nào đến được. Phải tự xây, từng ngày.</p>

<p>Và anh đang xây được — dù chỉ mới 7 ngày đầu. Đó là bằng chứng anh có thể tiếp tục.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 18 (Day 52): Pain #6 — Giả vờ mệt ─────────────────────────
  {
    day: 52,
    subject: '"hôm nay mệt" — anh đã nói câu đó bao nhiêu lần?',
    body: wrap(`<p>Tôi biết cái câu đó.</p>

<p>"Hôm nay mệt quá anh ơi." Hoặc "Sáng mai còn họp sớm, ngủ trước nhé." Hoặc đơn giản hơn — giả vờ ngủ trước khi cô ấy vào phòng.</p>

<p>Không phải vì anh không muốn. Anh muốn — nhưng anh sợ. Sợ lại thất vọng cô ấy. Sợ lại phải nhìn cái ánh mắt đó — dù cô ấy không nói gì, dù cô ấy rất khéo léo không để lộ. Nhưng anh nhìn thấy.</p>

<p>Vậy là tránh né trở thành giải pháp. An toàn hơn. Ít rủi ro hơn. Không ai bị tổn thương trong đêm hôm đó.</p>

<p>Ngoại trừ — tránh né không giải quyết được gì. Nó chỉ trì hoãn.</p>

<p>Và hậu quả của tránh né thường tệ hơn nhiều so với đối mặt: Cô ấy bắt đầu nghĩ anh không còn muốn gần cô ấy nữa. Cô ấy thu mình lại — không phải vì giận, mà vì không muốn tạo áp lực cho anh. Cả hai xa nhau thêm một chút. Rồi thêm một chút nữa.</p>

<p>Không ai nói chuyện về nó. Vì nói ra khó quá.</p>

<p>Đây là điều nhiều học viên hay kể: "Tôi không ngờ tránh né lại làm mọi thứ tệ hơn đến vậy. Tôi tưởng là đang bảo vệ mối quan hệ — nhưng thật ra đang làm rộng thêm khoảng cách."</p>

<p>Không ai nên sống như vậy trong mối quan hệ của mình. Không phải vì anh tệ — mà vì anh xứng đáng có cách tốt hơn để đối mặt với điều này.</p>

<p>Mật Mã 21 là 21 ngày để anh không cần phải tránh né nữa. Không phải vì ép bản thân. Vì anh có đủ công cụ để không còn sợ nữa.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 19 (Day 55): Khoa học — Tại sao 3-5 phút chưa đủ ──────────
  {
    day: 55,
    subject: 'Kegel thêm 3-5 phút — nhưng anh biết chưa đủ',
    body: wrap(`<p>Tôi không nói điều này để làm anh buồn hay tạo áp lực.</p>

<p>Tôi nói vì tôi nghĩ anh xứng đáng được nghe thật hơn là được dỗ dành.</p>

<p>7 ngày Kegel đã cho anh thêm 3-5 phút. Đó là tiến bộ thật — không phải ảo giác. Cơ đã mạnh hơn. Anh cảm nhận được sự khác biệt.</p>

<p>Nhưng anh cũng biết — nó chưa đủ để anh thật sự tự tin. Vẫn còn đó cái lo lắng trước khi bắt đầu. Vẫn còn đó cảm giác "chưa chắc lần này sẽ ổn." Vẫn còn đó một phần nhỏ của anh đang theo dõi, đang đếm, đang quản lý — thay vì chỉ đơn giản là có mặt.</p>

<p>Đó không phải vì Kegel thất bại. Kegel làm đúng việc của nó: tăng sức mạnh cơ sàn chậu. Tầng 1 trong 5 tầng.</p>

<p>Tầng 2-5 — hệ thần kinh tự chủ, nội tiết tố và testosterone, tâm lý và vòng lặp lo lắng, tuần hoàn và độ nhạy cảm — vẫn chưa được xây.</p>

<p>Và đây là điều quan trọng nhất tôi muốn anh hiểu: 3-5 phút thêm không xóa được cái lo lắng trước "lúc đó." Vì lo lắng không phải do cơ yếu — nó đến từ hệ thần kinh chưa được huấn luyện và vòng lặp tâm lý chưa bị phá vỡ.</p>

<p>Kegel là nền móng đúng. Nhưng để đến điểm mà anh không còn lo lắng, không còn đếm, không còn quản lý — cần thêm 4 tầng còn lại.</p>

<p>Đó là những gì Mật Mã 21 xây trong 21 ngày tiếp theo.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 20 (Day 58): Job #2 — Cảm thấy đủ tư cách ─────────────────
  {
    day: 58,
    subject: 'đủ tư cách là người đàn ông của gia đình này',
    body: wrap(`<p>Có một điều sâu hơn bất kỳ con số hay kỹ thuật nào mà học viên FORMEN chia sẻ với tôi.</p>

<p>Cảm giác đủ tư cách.</p>

<p>Đủ tư cách là người chồng — không phải chỉ kiếm tiền tốt, không phải chỉ chăm lo gia đình — mà là đủ toàn diện. Đủ tư cách là người cha mà con cái nhìn lên. Đủ tư cách là người đàn ông của ngôi nhà này.</p>

<p>Khi một vấn đề thể chất chưa được giải quyết — cảm giác đó không bao giờ trọn vẹn. Dù anh làm tốt mọi thứ khác. Dù công việc ổn, dù thu nhập tốt, dù anh là người cha chăm chỉ và người chồng có trách nhiệm.</p>

<p>Vẫn có một góc khuất nhỏ. Một chỗ mà anh biết mình chưa giải quyết được. Và nó ở đó — âm thầm — dù ngày hôm đó diễn ra tốt đẹp thế nào.</p>

<p>Đây không phải yếu đuối. Đây không phải tự ti quá mức. Đây là sự trung thực của một người đàn ông nhìn thẳng vào bản thân và biết mình còn chỗ chưa trọn vẹn.</p>

<p>Và điều quan trọng nhất tôi muốn anh nghe là: chỗ chưa trọn vẹn đó — có thể trọn vẹn được. Không phải bằng cách tự thuyết phục, không phải bằng cách chấp nhận và sống chung. Mà bằng cách thật sự giải quyết nó.</p>

<p>Mật Mã 21 là 21 ngày để anh lấp đầy góc khuất đó — bằng phương pháp có hệ thống, kết quả thật, bền vững.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày. Anh thử 3 ngày đầu không rủi ro gì — nếu không thấy phù hợp, tôi hoàn tiền ngay.</p>`)
  },

  // ── EMAIL 21 (Day 61): Email cuối — Tôn trọng ────────────────────────
  {
    day: 61,
    subject: 'email cuối — tôi tôn trọng anh',
    body: wrap(`<p>Đây là email cuối trong chuỗi này.</p>

<p>61 ngày. 21 email. Tôi đã không ép bao giờ. Không deadline giả. Không "chỉ còn 3 suất." Chỉ chia sẻ thật — những điều tôi nghĩ có giá trị thực sự cho anh.</p>

<p>Và anh vẫn đang đọc email này. Sau tất cả những email đó. Điều đó nói lên một điều rõ ràng: vấn đề này vẫn quan trọng với anh. Anh vẫn chưa tìm được câu trả lời mà anh biết mình cần.</p>

<p>Tôi nói thật một lần cuối — không phải để ép, mà vì tôi nghĩ anh xứng đáng được nghe thật:</p>

<p>7 ngày Kegel đã cho anh nền móng. Đó là điều thật, không phải ảo giác. Nhưng nền móng không phải ngôi nhà. Và những gì anh thật sự muốn — sự tự chủ hoàn toàn, không còn lo lắng, cảm giác đủ cho người mình yêu — không đến từ tầng 1 một mình.</p>

<p>Mật Mã 21 xây 4 tầng còn lại. Trong 21 ngày. Với hoàn tiền 3 ngày vô điều kiện — anh thử mà không có rủi ro gì.</p>

<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Mật Mã 21 — 686.868đ →</a></p>

<p>Nếu anh chưa sẵn sàng — tôi hoàn toàn tôn trọng. Mỗi người có thời điểm của riêng mình. Không ai nên bị ép vào bất cứ điều gì.</p>

<p>Cảm ơn anh đã đọc. Đã tin tưởng đủ để đọc đến đây. Dù anh quyết định gì — tôi mong anh tìm được điều mình cần. Thật lòng.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Nếu có câu hỏi gì — reply email này hoặc nhắn nhóm Telegram. Tôi đọc từng tin nhắn.</p>`)
  }
];

// ─── LUỒNG 3: MM21 BUYER → SUPPLEMENT + AFFILIATE ────────────────────────
// 9 emails · Day 0,2,6,13,20,27,34,44,59
const BUYER_MM21 = [

  // ── EMAIL 1 (Day 0): Welcome — Onboarding ─────────────────────────────
  {
    day: 0,
    subject: 'anh vừa làm điều quan trọng nhất',
    body: wrap(`<p>Anh vừa vào Mật Mã 21.</p>

<p>Điều này không nhỏ. Và tôi không nói xã giao.</p>

<p>Anh vừa làm điều mà phần lớn đàn ông biết mình cần nhưng không làm — vì ngại, vì không biết bắt đầu từ đâu, vì sợ lại thất vọng sau khi đã thử nhiều thứ trước đó. Họ chờ thêm, suy nghĩ thêm, rồi thôi.</p>

<p>Anh không phải người đó. Anh đã bấm mua. Anh đã bắt đầu.</p>

<p>Trước khi vào bài 1, tôi muốn anh biết 3 điều quan trọng nhất để 21 ngày này không bị lãng phí:</p>

<p><strong>1. Đừng bỏ qua bài học hệ thần kinh và tâm lý.</strong><br>
Nhiều người vào Mật Mã 21 với tâm lý "tôi sẽ tập cơ thật chăm chỉ." Nhưng 60% kiểm soát đến từ hệ thần kinh và tâm lý — không phải cơ bắp. Đây là phần mà thuốc không làm được, ý chí không làm được. Nếu bỏ qua tuần 2 và 3 — anh sẽ thấy tiến bộ nhưng không đến được điểm đích thật sự.</p>

<p><strong>2. Không tập thêm ngoài lịch.</strong><br>
Cơ thể cần 48-72 giờ thích nghi sau mỗi buổi tập cường độ mới. Tập thêm không làm kết quả nhanh hơn — nó làm cơ bị kích thích sai cách và khó cô lập đúng. Đúng lịch, đúng kỹ thuật — quan trọng hơn nhiều lần/tuần.</p>

<p><strong>3. Tuần 2 là thời điểm nhiều người bỏ.</strong><br>
Hưng phấn ban đầu qua đi. Kết quả rõ ràng chưa đến. Đây là giai đoạn cơ thể đang tái cấu trúc — bên dưới, âm thầm. Nếu anh kiên trì qua tuần 2 — tuần 3 sẽ là nơi mọi thứ bắt đầu khác.</p>

<p style="text-align:center;margin:28px 0;"><a href="https://www.thuthach21ngay.org/portal" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Vào Portal Học Bài 1 Ngay →</a></p>

<p style="text-align:center;"><a href="${TG_GROUP}" style="background:#229ED9;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">📱 Nhóm Hỗ Trợ Telegram →</a></p>

<p>Tôi sẽ theo dõi hành trình của anh và gửi hướng dẫn cụ thể cho từng giai đoạn. Anh không tập một mình.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Nếu có câu hỏi kỹ thuật hay cần hỗ trợ — nhóm Telegram là nơi nhanh nhất. Học viên khác và tôi phản hồi trong ngày.</p>`)
  },

  // ── EMAIL 2 (Day 2): Check-in tuần 1 ─────────────────────────────────
  {
    day: 2,
    subject: 'ngày 3 — cảm thấy thế nào anh?',
    body: wrap(`<p>Ngày 3 rồi.</p>

<p>Tôi hỏi thật — không phải hỏi cho có: Bài 1, 2, 3 xong chưa? Anh cảm thấy thế nào sau 3 buổi đầu?</p>

<p>Ở giai đoạn này, học viên thường rơi vào một trong hai trường hợp:</p>

<p><strong>Trường hợp 1:</strong> Cảm thấy mỏi nhẹ hoặc "ấm" ở vùng đáy chậu sau khi tập. Không đau — chỉ là cảm giác "cơ vừa được dùng đúng cách." Đây là dấu hiệu tốt. Đúng hướng rồi.</p>

<p><strong>Trường hợp 2:</strong> Chưa cảm thấy gì rõ ràng, hoặc không chắc đang co đúng cơ chưa. Hoàn toàn bình thường. Cơ PC là cơ ít được dùng nhất trong cuộc đời — cần thêm vài ngày để não bộ "tìm" lại đường kết nối với nó.</p>

<p>Dấu hiệu để biết anh đang co đúng cơ: Khi co, chỉ cảm thấy co ở vùng đáy chậu — không căng ở bụng, không siết ở mông, không nín thở. Nếu anh đang nín thở khi co — thả ra, thở bình thường, co nhẹ hơn.</p>

<p>Một điều quan trọng ở giai đoạn đầu: <strong>kỹ thuật cô lập đúng cơ quan trọng hơn số lần co.</strong> Nếu anh đang co cả vùng bụng hay mông — xem lại bài 2 để điều chỉnh trước khi tiếp tục.</p>

<p>Tập sai 30 phút tệ hơn tập đúng 10 phút. Không cần vội.</p>

<p><a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào portal học bài 4, 5, 6 →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Nếu không chắc đang làm đúng không — nhắn nhóm Telegram mô tả cảm giác. Tôi hoặc học viên khác sẽ giúp anh xác nhận ngay.</p>`)
  },

  // ── EMAIL 3 (Day 6): Tuần 2 briefing ─────────────────────────────────
  {
    day: 6,
    subject: 'xong tuần 1 — tuần 2 sẽ khác hoàn toàn',
    body: wrap(`<p>7 ngày xong rồi.</p>

<p>Tuần 1 là về cơ bắp và kỹ thuật cô lập — xây nền móng. Anh đã làm được phần khó nhất: bắt đầu và duy trì đủ 7 ngày.</p>

<p>Tuần 2 sẽ khác hoàn toàn — và theo cách mà nhiều học viên không ngờ đến.</p>

<p>Từ bài 8 trở đi, chúng ta bắt đầu đi vào <strong>hệ thần kinh tự chủ</strong> — cách huấn luyện phản xạ tự động để không còn bị "bất ngờ" và không còn bị vòng lặp lo lắng chi phối.</p>

<p>Đây là phần mà phần lớn phương pháp tự tập bỏ qua. Và là lý do nhiều người Kegel rất tốt — cơ khỏe thật — nhưng vẫn không kiểm soát được hoàn toàn khi đến lúc thật sự. Vì cơ và hệ thần kinh là hai hệ thống khác nhau. Cơ mạnh không đủ — phải dạy hệ thần kinh nhận ra tín hiệu và phản hồi đúng cách, tự động, mà không cần ý thức can thiệp.</p>

<p>Đây là tầng kiểm soát thứ 2 — và nó thay đổi mọi thứ.</p>

<p><strong>Gợi ý thực tế cho tuần 2:</strong> Tập vào buổi tối, khi đầu óc đã thư giãn sau một ngày làm việc. Hệ thần kinh cần trạng thái bình tĩnh để học kỹ năng mới. Tập lúc căng thẳng hoặc vội vàng sẽ kém hiệu quả hơn hẳn.</p>

<p>Một điều nữa: tuần 2 là giai đoạn nhiều người bỏ. Hưng phấn ban đầu đã qua. Kết quả rõ ràng chưa thấy. Nhưng đây chính xác là lúc quan trọng nhất để tiếp tục. Cơ thể đang tái cấu trúc bên dưới — âm thầm nhưng thật. Tuần 3 là nơi anh sẽ bắt đầu nhận ra sự khác biệt rõ ràng.</p>

<p><a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào học bài 8 — bắt đầu tuần 2 →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 4 (Day 13): Giữa chặng — Giới thiệu Supplement nhẹ nhàng ───
  {
    day: 13,
    subject: 'ngày 14 — giữa hành trình, hỏi thật anh',
    body: wrap(`<p>Ngày 14. Nửa hành trình.</p>

<p>Tôi muốn hỏi thật, không phải hỏi cho có: Anh đang cảm nhận được gì khác so với ngày 1?</p>

<p>Nhiều học viên ở giai đoạn này bắt đầu thấy kiểm soát được rõ hơn — đặc biệt khi không lo lắng nhiều, khi tâm trạng thoải mái. Cơ thể đang phản hồi. Hệ thần kinh đang học lại.</p>

<p>Nếu anh chưa thấy rõ — không sao. Mỗi người có baseline khác nhau. Một số người thấy rõ từ tuần 1, một số thấy rõ hơn ở tuần 3. Cứ tiếp tục đúng lịch.</p>

<p>Hôm nay tôi muốn chia sẻ điều nhiều học viên hỏi ở giai đoạn này — không phải để bán gì, mà để anh có đủ thông tin:</p>

<p><strong>Kẽm và Magie</strong> là 2 vi chất ảnh hưởng trực tiếp đến kết quả Mật Mã 21, và phần lớn nam giới Việt Nam thiếu cả hai:</p>

<p><strong>Kẽm</strong> — vi chất cần thiết cho sản xuất testosterone tự nhiên và co cơ hiệu quả. Khi thiếu kẽm, testosterone thấp hơn mức tối ưu, ảnh hưởng trực tiếp đến sức bền cơ và phục hồi sau tập.<br>
<strong>Magie</strong> — vi chất điều tiết hệ thần kinh và giấc ngủ sâu. Thiếu magie = khó đi vào giấc ngủ sâu = hệ thần kinh phục hồi kém sau mỗi bài học = tiến bộ chậm hơn.</p>

<p>Phần lớn nam giới Việt Nam thiếu cả hai do chế độ ăn không đủ hải sản và hạt ngũ cốc nguyên hạt.</p>

<p>Tôi chưa bán gì trong email này. Chỉ muốn anh biết điều này tồn tại — để khi hoàn thành 21 ngày, anh có thể quyết định có muốn bổ sung thêm không.</p>

<p>Bây giờ tập trung bài 14: <a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào portal →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 5 (Day 20): Hoàn thành 21 ngày — Xin feedback ─────────────
  {
    day: 20,
    subject: 'anh vừa hoàn thành điều 95% không làm được',
    body: wrap(`<p>21 ngày.</p>

<p>Anh làm được. Và tôi không nói điều đó nhẹ nhàng.</p>

<p>Chỉ khoảng 1 trong 20 người bắt đầu một chương trình 21 ngày mà hoàn thành đủ. Không phải vì chương trình quá khó. Mà vì giữ cam kết với bản thân — trong im lặng, không ai nhìn, không có áp lực bên ngoài — là điều cực kỳ khó. Anh là người đó.</p>

<p>Tôi muốn hỏi anh một điều thật lòng — không phải câu hỏi xã giao:</p>

<p><strong>Sau 21 ngày — anh cảm nhận được gì khác so với trước khi bắt đầu?</strong></p>

<p>Không cần phải là kết quả hoàn hảo. Không cần phải là con số ấn tượng. Chỉ là — có gì khác không? Trong cơ thể, trong tâm trí, trong mối quan hệ?</p>

<p>Reply email này, hoặc nhắn nhóm Telegram. Tôi đọc mọi tin nhắn — không phải bot, không phải trợ lý.</p>

<p>Lý do tôi hỏi: feedback của anh giúp tôi cải thiện chương trình cho những người tiếp theo. Và đôi khi — chỉ cần ngồi viết ra những gì đã thay đổi — anh sẽ nhận ra mình đã đi xa hơn mình nghĩ trong 21 ngày đó.</p>

<p>Học viên hay nói: "Tôi không ngờ mình thay đổi nhiều như vậy. Cho đến khi phải viết ra."</p>

<p><a href="${TG_GROUP}" style="color:#2d6a4f;">Nhắn nhóm Telegram →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Cảm ơn anh đã tin tưởng FORMEN đủ để đi đến đây. Thật sự.</p>`)
  },

  // ── EMAIL 6 (Day 27): Supplement upsell — Duy trì kết quả dài hạn ────
  {
    day: 27,
    subject: 'câu hỏi nhiều học viên hỏi sau 21 ngày',
    body: wrap(`<p>Anh đã hoàn thành 21 ngày Mật Mã 21.</p>

<p>Sau khi hoàn thành, câu hỏi phổ biến nhất tôi nhận được từ học viên là:</p>

<p><strong>"Làm thế nào để giữ kết quả này lâu dài? Và có thể tiếp tục cải thiện thêm không?"</strong></p>

<p>Câu trả lời ngắn: có. Và đây là cách.</p>

<p>Mật Mã 21 đã xây lại 5 hệ thống kiểm soát. Nhưng để duy trì và phát triển thêm — cơ thể cần nguyên liệu đúng mỗi ngày. Hai vi chất quan trọng nhất mà tôi khuyên học viên bổ sung sau 21 ngày:</p>

<p><strong>Kẽm</strong> — duy trì testosterone tự nhiên ở mức tối ưu, hỗ trợ sức bền cơ và kiểm soát lâu dài. Khi testosterone ổn định → kiểm soát bền vững hơn theo thời gian.</p>

<p><strong>Magie</strong> — duy trì giấc ngủ sâu và hệ thần kinh ổn định. Thiếu magie → cortisol tăng → kiểm soát thần kinh giảm. Đây là vi chất quan trọng nhất để bảo vệ những gì tuần 2 đã xây.</p>

<p>Combo Kẽm + Magie: <strong>499.000đ/tháng</strong></p>

<p><strong>Ưu đãi đặc biệt cho học viên Mật Mã 21:</strong> Giảm 50.000đ cho đơn đầu tiên — còn <strong>449.000đ</strong> trong 7 ngày tới.</p>

<p style="text-align:center;margin:28px 0;"><a href="${SUPP_URL}" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Đặt Mua Supplement Kẽm + Magie →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Không bắt buộc. Nhiều học viên duy trì tốt mà không cần bổ sung. Nhưng nếu anh muốn tối ưu và giữ kết quả bền vững nhất có thể — đây là bước hỗ trợ tốt nhất tôi biết với mức giá hợp lý.</p>`)
  },

  // ── EMAIL 7 (Day 34): Affiliate — Giới thiệu tự nhiên ────────────────
  {
    day: 34,
    subject: 'có người anh muốn giúp không?',
    body: wrap(`<p>Sau khi hoàn thành Mật Mã 21 — nhiều học viên tự nhiên nghĩ đến những người họ biết đang gặp vấn đề tương tự.</p>

<p>Bạn thân. Anh em. Đồng nghiệp. Những người họ thấy đang mang cái gánh đó — dù không ai nói ra.</p>

<p>Và câu hỏi họ hay hỏi tôi: "Có cách nào để chia sẻ với họ mà không ngại không?"</p>

<p>Có. Đó là chương trình <strong>Affiliate FORMEN</strong>.</p>

<p>Anh không cần bán hàng. Không cần fanpage. Không cần chạy quảng cáo. Không cần thuyết phục ai. Chỉ cần một link cá nhân — khi gặp ai anh nghĩ có thể phù hợp, anh share link. Nếu họ mua — anh nhận hoa hồng tự động:</p>

<p>
— Kegel Khởi Đầu (199k) được giới thiệu: <strong>40.000đ hoa hồng</strong><br>
— Mật Mã 21 (686k) được giới thiệu: <strong>140.000đ hoa hồng</strong><br>
— Supplement Kẽm + Magie: <strong>15% hoa hồng</strong>
</p>

<p>Điều quan trọng nhất: chỉ share với người anh thật sự muốn giúp. Không ép. Không thuyết phục. Chỉ nói: "Có thứ này — tôi đã thử, nó hiệu quả với tôi." Họ tự quyết định.</p>

<p>Đây không phải kiếm tiền bằng cách bán cho người không cần. Đây là chia sẻ điều đã thật sự giúp anh — với những người có thể cần nó.</p>

<p>Nếu anh muốn đăng ký affiliate — nhắn nhóm Telegram: <em>"Tôi muốn đăng ký affiliate"</em>. Tôi sẽ gửi link cá nhân trong 24 giờ.</p>

<p><a href="${TG_GROUP}" style="color:#2d6a4f;">Nhắn nhóm Telegram →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 8 (Day 44): Affiliate proof — Anh Tuấn ─────────────────────
  {
    day: 44,
    subject: 'anh Tuấn kiếm thêm 3 triệu tháng đầu — không chạy ads',
    body: wrap(`<p>Tôi muốn chia sẻ câu chuyện của một học viên — vì tôi nghĩ nó thực tế và không hề phô trương.</p>

<p>Anh Tuấn, 38 tuổi, kế toán, Đà Nẵng. Hoàn thành Mật Mã 21 vào tháng 3. Sau đó đăng ký affiliate.</p>

<p>Anh không có fanpage. Không chạy quảng cáo. Không viết bài bán hàng. Không phải chuyên gia marketing — và cũng không muốn trở thành.</p>

<p>Tháng đầu làm affiliate: anh giới thiệu 8 người vào Kegel Khởi Đầu và 3 người vào Mật Mã 21. Tổng hoa hồng: <strong>khoảng 3 triệu</strong>.</p>

<p>Tôi hỏi anh làm thế nào. Anh kể:</p>

<p><em>"Tôi không làm gì đặc biệt. Tôi chỉ share với người tôi thấy đang gặp vấn đề tương tự. Không ép. Không thuyết phục. Chỉ nói: tôi đã thử cái này, nó hiệu quả với tôi. Nếu anh muốn xem thì đây. Xong. Họ tự quyết định. Một số mua, một số không. Tôi chỉ quan tâm đến người thật sự muốn giúp — không phải hoa hồng."</em></p>

<p>Tôi chia sẻ điều này không phải để nói "kiếm được 3 triệu dễ lắm." Mà để nói: nếu anh có người muốn giúp thật sự — có cách để làm điều đó và được ghi nhận.</p>

<p>Nếu anh chưa đăng ký affiliate và muốn thử — nhắn nhóm Telegram: <em>"Đăng ký affiliate"</em>. Tôi gửi link trong 24 giờ.</p>

<p><a href="${TG_GROUP}" style="color:#2d6a4f;">Nhắn nhóm Telegram →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Không có áp lực doanh số. Không có quota. Anh share khi muốn, với ai anh muốn. Hoàn toàn trong tầm kiểm soát của anh.</p>`)
  },

  // ── EMAIL 9 (Day 59): 60 ngày — Check-in ─────────────────────────────
  {
    day: 59,
    subject: '60 ngày rồi — anh thế nào?',
    body: wrap(`<p>60 ngày kể từ ngày anh vào Mật Mã 21.</p>

<p>Tôi gửi email này không phải để bán gì. Không có offer. Không có deadline. Chỉ đơn giản là — tôi muốn hỏi thật.</p>

<p>Anh thế nào?</p>

<p>Kết quả có duy trì không? Mối quan hệ có khác không — dù chỉ theo những cách nhỏ? Có điều gì anh vẫn muốn cải thiện thêm không?</p>

<p>Tôi hỏi vì tôi thật sự muốn biết. Không phải để lấy dữ liệu. Không phải để viết testimonial. Vì tôi nhớ anh đã ở đâu 60 ngày trước — và tôi muốn biết anh đã đi đến đâu.</p>

<p>Nếu mọi thứ đang tốt — tuyệt vời. Nhớ bổ sung Kẽm + Magie hàng tháng để duy trì những gì đã xây: <a href="${SUPP_URL}" style="color:#2d6a4f;">Đặt mua →</a></p>

<p>Nếu có điều gì chưa như ý — nhắn tôi qua <a href="${TG_GROUP}" style="color:#2d6a4f;">Telegram</a>. Tôi sẽ xem anh cần điều chỉnh gì. Không tính phí. Không điều kiện. Chỉ là tôi muốn anh đến được chỗ anh cần đến.</p>

<p>Cảm ơn anh đã tin tưởng FORMEN. Cảm ơn đã kiên trì 21 ngày khi nhiều người đã bỏ. Điều đó không nhỏ với tôi — thật sự.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Nếu anh có feedback muốn chia sẻ — dù chỉ một câu — nhắn tôi. Câu chuyện của anh có thể giúp một người khác đang ở đúng chỗ anh đã từng ở. Tôi có phần quà nhỏ cho anh nếu muốn chia sẻ công khai.</p>`)
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
