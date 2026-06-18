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
    body: wrap(`<p>Câu hỏi hợp lý. Tôi trả lời thẳng.</p>

<p>Không phải bài tập YouTube. Không phải tài liệu PDF. Là <strong>hệ thống 7 bài tập theo đúng thứ tự tiến trình</strong> — từ kỹ thuật cô lập cơ đến tập với cường độ tăng dần, đúng nhịp, đúng thời gian nghỉ.</p>

<p>Tại sao thứ tự quan trọng?</p>

<p>Kegel sai thứ tự thì cơ không phát triển đúng. Anh tập 2 tuần không thấy gì — rồi bỏ. Đó là lý do 80% người tự tập YouTube thất bại.</p>

<p>Cơ sàn chậu cần được "dạy" theo từng giai đoạn: nhận diện → kích hoạt → tăng lực → tăng bền → tự động hóa.</p>

<p>Bỏ qua giai đoạn nào — cả hệ thống không hoàn chỉnh.</p>

<p>199k không phải trả cho video. Là trả cho đúng thứ tự và tiến trình.</p>

<p style="text-align:center;margin:28px 0;"><a href="${KEGEL_URL}" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Kegel Khởi Đầu — 199.000đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 7 ngày nếu anh không cảm nhận được sự khác biệt gì.</p>`)
  },

  // ── EMAIL 7 (Day 17): Pain #3 — Lo lắng trước "chuyện đó" ─────────────
  {
    day: 17,
    subject: 'tim đập nhanh — nhưng không phải vì hưng phấn',
    body: wrap(`<p>Anh biết cái cảm giác đó không?</p>

<p>Vài phút trước khi bắt đầu — tim đập nhanh hơn, đầu nghĩ nhanh hơn. Nhưng không phải vì háo hức. Là vì lo.</p>

<p>"Lần này có được không?"<br>
"Sẽ kéo dài bao lâu?"<br>
"Nếu lại như lần trước thì sao?"</p>

<p>Và trong khi anh đang lo lắng — cơ thể anh đang phản ứng theo đúng chiều hướng đó. Vòng lặp tự cản hoạt động hoàn hảo.</p>

<p>Đây là điều ít ai giải thích: vấn đề không chỉ ở cơ bắp. Hệ thần kinh lo lắng tạo ra phản xạ quá nhanh. Tâm lý lo sợ tạo ra vòng lặp tự cản.</p>

<p>Kegel phá vỡ vòng lặp đó từ nền tảng — khi anh cảm nhận được kiểm soát thật sự, lo lắng giảm theo tự nhiên.</p>

<p>Ngày 3-4 là lúc nhiều học viên bắt đầu cảm nhận điều này. Không rõ ràng lắm. Nhưng nó có.</p>

<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — bắt đầu từ hôm nay →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 8 (Day 20): Gain #2 — Nhìn thấy vợ/người yêu thỏa mãn thật ─
  {
    day: 20,
    subject: 'lần đầu tiên thấy cô ấy thật sự thỏa mãn',
    body: wrap(`<p>Một học viên nhắn tôi lúc 11 giờ đêm, sau tuần 2 Kegel:</p>

<p><em>"Tôi không biết mô tả thế nào. Nhưng hôm nay cô ấy nhìn tôi theo cách khác. Khác hơn nhiều năm nay. Tôi chưa từng thấy cô ấy nhìn tôi như vậy."</em></p>

<p>Tôi đọc lại tin nhắn đó nhiều lần. Vì đó là điều thật sự mà đàn ông muốn — không phải con số. Là cái nhìn đó của người mình yêu thương.</p>

<p>Không phải nhìn vì lịch sự. Không phải nhìn vì không muốn làm anh buồn. Mà nhìn vì cô ấy thật sự thỏa mãn.</p>

<p>Đó là Gain #1 mà học viên Kegel thường kể. Không phải "thêm được 5 phút" — mà là cái khoảnh khắc nhìn vào mắt nhau sau đó và biết mình đã làm tốt.</p>

<p>7 ngày. 10 phút mỗi ngày.</p>

<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 9 (Day 23): Proof — Anh Tuấn 8 tuần ────────────────────────
  {
    day: 23,
    subject: 'vợ anh Tuấn hỏi: "anh đang làm gì vậy?"',
    body: wrap(`<p>Anh Tuấn, 41 tuổi, TP.HCM. Kỹ sư phần mềm. Hay làm việc đến 11 giờ đêm, ít vận động.</p>

<p>Anh mua Kegel Khởi Đầu sau khi đọc email thứ 2 của tôi. "Thử xem sao. Nếu không hiệu quả thì hoàn tiền."</p>

<p>Sau ngày 7: <em>"Khác một chút nhưng chưa rõ."</em><br>
Sau 3 tuần: <em>"Rõ hơn. Rõ hơn nhiều."</em><br>
Sau 8 tuần: <em>"Vợ tôi hỏi tôi đang làm gì khác không. Tôi chỉ cười."</em></p>

<p>Anh Tuấn không có gì đặc biệt. Không phải thể thao viên. Không trẻ. Không có nhiều thời gian.</p>

<p>Chỉ tập đúng. Tập đủ. Tập 10 phút mỗi ngày trong 7 ngày đầu.</p>

<p>Nếu anh chưa bắt đầu — đây là lúc.</p>

<p><a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ, hoàn tiền 7 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 10 (Day 26): Urgency nhẹ — lần cuối nhắc Kegel ──────────────
  {
    day: 26,
    subject: 'lần cuối tôi nhắc anh về điều này',
    body: wrap(`<p>Tôi đã gửi 9 email. Không ép. Không deadline giả. Chỉ chia sẻ thật.</p>

<p>Và đây là lần cuối tôi nhắc về Kegel Khởi Đầu với anh.</p>

<p>Tôi muốn nói thẳng một điều:</p>

<p>Vấn đề này không biến mất nếu anh bỏ qua. Nó im lặng một thời gian. Rồi lại hiện ra — trong phòng ngủ, trong suy nghĩ lúc 2 giờ sáng, trong ánh mắt của người bạn đời.</p>

<p>199k là mức thấp nhất anh có thể trả để bắt đầu thay đổi thật sự. Hoàn tiền 7 ngày nếu anh không cảm nhận bất kỳ sự khác biệt nào — tôi không có gì để mất từ lời hứa đó.</p>

<p style="text-align:center;margin:28px 0;"><a href="${KEGEL_URL}" style="background:#2d6a4f;color:#fff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Kegel Khởi Đầu — 199.000đ →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">Từ email tới tôi sẽ chia sẻ với anh về bước tiếp theo — xa hơn Kegel.</p>`)
  },

  // ── EMAIL 11 (Day 29): Bridge → MM21 — Kegel chỉ là tầng 1 ───────────
  {
    day: 29,
    subject: 'Kegel chỉ giải quyết 20% vấn đề',
    body: wrap(`<p>Tôi muốn nói thật với anh điều mà nhiều người bán hàng không dám nói.</p>

<p>Kegel rất hiệu quả. Nhưng chỉ cho tầng 1: cơ sàn chậu.</p>

<p>3-5 phút thêm là thật. Nhiều học viên đạt được điều đó trong 7 ngày.</p>

<p>Nhưng vấn đề kiểm soát hoàn toàn — tự chủ 15-30 phút, không lo lắng, không đếm giây — đòi hỏi cả 5 tầng:</p>

<p>
Tầng 1: Cơ sàn chậu ✓ (Kegel làm được)<br>
Tầng 2: Hệ thần kinh tự chủ — phản xạ tự động<br>
Tầng 3: Nội tiết tố — testosterone và cortisol<br>
Tầng 4: Tâm lý — phá vỡ vòng lặp lo lắng<br>
Tầng 5: Tuần hoàn — điều chỉnh độ nhạy cảm
</p>

<p>Mật Mã 21 xây cả 5 tầng trong 21 ngày. Đó là lý do kết quả của nó khác — 15-30 phút kiểm soát bền vững, không phụ thuộc vào thuốc hay gel.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Tìm hiểu Mật Mã 21 →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 12 (Day 32): Gain #4 — Cảm giác "đàn ông thật sự" ──────────
  {
    day: 32,
    subject: 'cảm giác mà anh chưa từng có',
    body: wrap(`<p>Tôi muốn anh tưởng tượng một khoảnh khắc.</p>

<p>Anh bước vào phòng. Không cần chuẩn bị tâm lý trước. Không tính toán. Không cầu mong "lần này được không."</p>

<p>Chỉ là hiện diện. Hoàn toàn. Với người mình yêu thương.</p>

<p>Học viên Mật Mã 21 hay mô tả điều này vào tuần 3: <em>"Tôi cảm thấy như đàn ông thật sự lần đầu tiên trong cuộc đời."</em></p>

<p>Không phải cường điệu. Đó là kết quả tự nhiên khi cả 5 hệ thống kiểm soát hoạt động đồng bộ. Não bộ không còn phải lo lắng — nên toàn bộ sự hiện diện được dành cho khoảnh khắc đó.</p>

<p>Đó là mục tiêu thật sự. Không phải kỷ lục thời gian.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 13 (Day 35): Proof — Anh Hùng 2 phút → 22 phút ─────────────
  {
    day: 35,
    subject: 'từ 2 phút lên 22 phút — câu chuyện thật',
    body: wrap(`<p>Anh Hùng, 32 tuổi. Đã có vợ 3 năm.</p>

<p>Anh nhắn tôi: <em>"Tôi chỉ kéo dài được 2-3 phút là cùng. Vợ tôi chưa bao giờ nói gì, nhưng tôi biết. Chúng tôi ngày càng ít gần nhau hơn."</em></p>

<p>Anh Hùng bắt đầu với Kegel 7 ngày. Cảm nhận khác biệt nhỏ nhưng rõ ràng. Rồi vào Mật Mã 21.</p>

<p>Sau 21 ngày, anh nhắn: <em>"Lần đầu tiên trong 3 năm vợ tôi thật sự thỏa mãn. Tôi ngạc nhiên. Cô ấy còn ngạc nhiên hơn. Buổi tối hôm đó chúng tôi ôm nhau ngủ và không ai nói gì — nhưng tôi biết mọi thứ khác rồi."</em></p>

<p>Từ 2 phút lên 22 phút — sau 21 ngày.</p>

<p>Kegel là nền móng. Mật Mã 21 là ngôi nhà anh xây trên đó.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — xem chi tiết →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 14 (Day 38): Pain #8 — Mối quan hệ lạnh dần ────────────────
  {
    day: 38,
    subject: 'khoảng cách mà không ai nhắc đến',
    body: wrap(`<p>Có một loại khoảng cách trong mối quan hệ mà không ai nói thẳng ra.</p>

<p>Không có cãi vã. Không có sự kiện lớn. Không có lý do rõ ràng.</p>

<p>Chỉ là... ít chạm vào nhau hơn. Ít nói chuyện trước khi ngủ hơn. Ít kế hoạch cuối tuần hơn. Ít ánh mắt tìm nhau hơn.</p>

<p>Không phải vì tình cảm phai. Mà vì có điều gì đó chưa được giải quyết — và cả hai chọn im lặng. Mỗi ngày.</p>

<p>Nhiều học viên Mật Mã 21 kể với tôi về điều này sau chương trình: <em>"Vợ tôi bắt đầu chủ động trở lại. Không hiểu sao. Nhưng chúng tôi nói chuyện nhiều hơn, cười nhiều hơn."</em></p>

<p>Giải quyết vấn đề thể chất không chỉ là giải quyết vấn đề thể chất. Nó mở lại cánh cửa mà cả hai đã âm thầm đóng lại.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 15 (Day 41): Email cuối — Nói thẳng ─────────────────────────
  {
    day: 41,
    subject: 'email cuối — tôi nói thật một điều',
    body: wrap(`<p>Đây là email cuối trong chuỗi này.</p>

<p>Tôi đã gửi 14 email. Không ép. Không deadline giả. Chỉ chia sẻ thật.</p>

<p>Và anh vẫn đang đọc — điều đó cho thấy vấn đề này vẫn quan trọng với anh. Tôi trân trọng sự kiên nhẫn đó.</p>

<p>Tôi chỉ nói một điều cuối:</p>

<p>Vấn đề này không tự biến mất theo thời gian. Nó cần được giải quyết chủ động. Và mỗi tháng trôi qua mà không làm gì — là thêm một tháng anh và người bạn đời tiếp tục sống với khoảng cách đó.</p>

<p><strong>Mật Mã 21</strong> — 21 ngày, xây 5 hệ thống kiểm soát, 686.868đ, hoàn tiền 3 ngày vô điều kiện.</p>

<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Bắt Đầu Mật Mã 21 →</a></p>

<p>Nếu anh muốn bắt đầu với bước nhỏ hơn: <a href="${KEGEL_URL}" style="color:#2d6a4f;">Kegel Khởi Đầu — 199.000đ →</a></p>

<p>Cảm ơn anh đã đọc. Dù anh quyết định gì — tôi tôn trọng.</p>

<p>—<br>FORMEN</p>`)
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

<p>Phần lớn đàn ông biết mình cần làm điều gì đó. Nhưng không làm. Lần lữa. Rồi thôi.</p>

<p>Anh không phải người đó. Đó là lý do anh ở đây.</p>

<p><strong>3 điều anh cần biết trước bài 1:</strong></p>

<p><strong>1. Thời điểm:</strong> Sáng sau khi thức dậy hoặc tối trước khi ngủ. Chọn 1 giờ cố định và giữ suốt 7 ngày. Não bộ học theo thói quen — nhất quán quan trọng hơn cường độ.</p>

<p><strong>2. Kỹ thuật hơn số lần:</strong> Ngày 1-2 anh có thể không chắc mình đang làm đúng không. Bình thường. Bài học sẽ giải thích rõ. Tập sai 30 phút tệ hơn tập đúng 10 phút.</p>

<p><strong>3. Ngày 3-4 là cột mốc:</strong> Đây là lúc nhiều người bắt đầu cảm nhận cơ đang "sống" lại. Không rõ ràng. Nhưng anh sẽ nhận ra.</p>

<p style="text-align:center;margin:24px 0;"><a href="${PORTAL_URL}" style="background:#2d6a4f;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Vào Portal Học Ngay →</a></p>

<p style="text-align:center;"><a href="${TG_GROUP}" style="background:#229ED9;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">📱 Nhóm Hỗ Trợ Telegram →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 2 (Day 2): Check-in — Kỹ thuật đúng ────────────────────────
  {
    day: 2,
    subject: 'ngày 3 — cái bẫy thường gặp',
    body: wrap(`<p>Anh đã xong bài 1, 2, 3 chưa?</p>

<p>Ngày 3 có một cái bẫy hay gặp: nhiều người bắt đầu tập nhiều hơn lịch, nghĩ rằng "tập thêm = kết quả nhanh hơn."</p>

<p>Không đúng. Ngược lại.</p>

<p>Cơ sàn chậu cần 24-48 giờ phục hồi sau mỗi buổi tập. Tập dồn dập không giúp cơ phát triển nhanh hơn — chỉ làm cơ bị kích thích quá mức và khó cô lập đúng cách.</p>

<p>Giai đoạn đầu: kỹ thuật quan trọng hơn tất cả. Đúng cơ, đúng nhịp, đúng thời gian nghỉ.</p>

<p>Nếu ngày nào đó anh quên — không sao. Tập vào buổi sáng hôm sau. Đừng tập bù.</p>

<p><a href="${PORTAL_URL}" style="color:#2d6a4f;">Vào portal học bài tiếp theo →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 3 (Day 6): Hoàn thành tuần 1 — cầu nối ────────────────────
  {
    day: 6,
    subject: '7 ngày xong rồi — anh cảm thấy gì?',
    body: wrap(`<p>7 ngày. Anh làm được.</p>

<p>Tôi muốn hỏi thật: Anh cảm thấy gì khác so với tuần trước?</p>

<p>Không cần kết quả hoàn hảo. Nhưng nếu để ý kỹ — có gì đó đang thay đổi. Một cảm giác kiểm soát nhỏ mà trước đây không có.</p>

<p>Đây là nền móng. Và nó thật.</p>

<p>Tôi muốn nói thật với anh một điều: 3-5 phút mà Kegel mang lại — đó chỉ là tầng 1 của 5 tầng kiểm soát.</p>

<p>Nếu anh muốn dừng ở đây — hoàn toàn được. Đã tốt hơn trước rồi.</p>

<p>Nhưng nếu anh muốn đến điểm đích thật sự — không còn lo lắng, không còn đếm giây, tự chủ hoàn toàn — thì có bước tiếp theo.</p>

<p>Tôi sẽ nói về điều này trong 2 ngày tới.</p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 4 (Day 9): Upsell MM21 — Ưu đãi 100k trong 48h ─────────────
  {
    day: 9,
    subject: 'ưu đãi dành riêng cho anh — 48 giờ',
    body: wrap(`<p>Anh vừa hoàn thành Kegel 7 ngày. Anh đã xây tầng 1.</p>

<p>Hôm nay tôi muốn mời anh vào <strong>Mật Mã 21</strong> — chương trình xây tiếp 4 tầng còn lại.</p>

<p>Kết quả: 15-30 phút kiểm soát bền vững. Không phụ thuộc thuốc. Không cần kìm nén.</p>

<p>Tôi có một ưu đãi dành riêng cho học viên Kegel đã hoàn thành 7 ngày:</p>

<p><strong>Giảm 100.000đ — còn 586.868đ trong 48 giờ.</strong></p>

<p>Tại sao chỉ 48 giờ? Vì anh vừa xây nền móng — đây là thời điểm tốt nhất để tiếp tục, khi cơ thể và thói quen vẫn đang "nóng."</p>

<p>Anh Hùng, học viên từ Hà Nội: <em>"Từ 2 phút lên 22 phút sau 21 ngày. Lần đầu tiên trong 3 năm vợ tôi thật sự thỏa mãn."</em></p>

<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Nhận Ưu Đãi — Mật Mã 21 →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Hoàn tiền 3 ngày vô điều kiện.</p>`)
  },

  // ── EMAIL 5 (Day 13): Upsell MM21 — Email cuối ưu đãi ────────────────
  {
    day: 13,
    subject: 'ưu đãi hết hôm nay — nói thật không?',
    body: wrap(`<p>Đây là email cuối về ưu đãi 100k. Sau hôm nay — giá trở về 686.868đ.</p>

<p>Tôi muốn nói thật một điều, không phải để ép anh mua.</p>

<p>3-5 phút Kegel đã cho anh — anh biết nó là thật. Anh cảm nhận được.</p>

<p>Nhưng anh cũng biết — nó chưa đủ. Vẫn còn đó cái lo lắng trước khi bắt đầu. Vẫn còn đó cảm giác "chưa chắc lần này."</p>

<p>Mật Mã 21 giải quyết chỗ đó. Không phải bằng cơ bắp. Bằng hệ thần kinh, nội tiết tố, và tâm lý — 4 tầng còn lại mà Kegel không chạm đến.</p>

<p style="text-align:center;margin:28px 0;"><a href="${MM21_URL}" style="background:#0D2B1A;color:#D4AF37;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Mật Mã 21 — 586.868đ (ưu đãi cuối) →</a></p>

<p>Nếu chưa sẵn sàng — tôi hiểu. Tôi vẫn sẽ gửi email chia sẻ kiến thức hữu ích cho anh.</p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 6 (Day 16): Job #7 — Không còn gánh nặng ──────────────────
  {
    day: 16,
    subject: 'cái gánh nặng anh đang mang',
    body: wrap(`<p>Sau 7 ngày Kegel — anh đã cảm thấy khác hơn rồi. Tôi biết.</p>

<p>Nhưng tôi muốn hỏi anh một điều thật thẳng thắn:</p>

<p>Anh vẫn còn mang cái gánh nặng đó không?</p>

<p>Không phải gánh nặng thể chất. Mà là gánh nặng tinh thần. Cái mà anh không đặt xuống được — dù đang ăn, đang làm việc, đang nói chuyện với ai.</p>

<p>Nó cứ ở đó. Âm thầm.</p>

<p>Học viên Mật Mã 21 hay kể về tuần 3: <em>"Tôi nhận ra mình đã không nghĩ đến chuyện đó nữa. Tự nhiên thôi. Không phải vì cố quên — mà vì nó không còn là vấn đề nữa."</em></p>

<p>Đó là mục tiêu thật sự: không phải thêm phút giây — là không còn gánh nặng đó nữa.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — bước tiếp theo →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 7 (Day 19): Gain #3 — Bước vào không còn lo ────────────────
  {
    day: 19,
    subject: 'buổi sáng không còn nghĩ đến chuyện đó',
    body: wrap(`<p>Tưởng tượng một buổi sáng.</p>

<p>Anh thức dậy. Pha cà phê. Đọc tin tức. Chuẩn bị đi làm.</p>

<p>Và không có cái ý nghĩ đó chen vào.</p>

<p>Không phải vì anh cố quên. Mà vì nó không còn là vấn đề nữa. Anh biết mình đã có đủ kiểm soát.</p>

<p>Nhiều học viên Mật Mã 21 mô tả điều này sau tuần 3 như một sự nhẹ nhõm kỳ lạ — không ai nói với họ trước rằng điều đó sẽ xảy ra.</p>

<p><em>"Tôi ngủ ngon hơn. Họp hành tốt hơn. Ít cáu kỉnh hơn. Tôi không ngờ nó ảnh hưởng đến nhiều thứ như vậy."</em></p>

<p>Khi một nguồn lo lắng mãn tính được giải phóng — toàn bộ cuộc sống thay đổi theo.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 8 (Day 22): Gain #6 — Mối quan hệ ấm lại ──────────────────
  {
    day: 22,
    subject: '"vợ tôi bắt đầu chủ động trở lại"',
    body: wrap(`<p>Một học viên nhắn tôi tuần trước:</p>

<p><em>"Không hiểu sao. Tự nhiên vợ tôi chủ động hơn. Cười nhiều hơn. Nói chuyện trước khi ngủ nhiều hơn. Hôm qua cô ấy đề nghị đi chơi cả ngày cuối tuần — điều mà không xảy ra nhiều năm nay."</em></p>

<p>Anh ấy không nói Mật Mã 21 làm được tất cả những điều đó. Anh ấy chỉ kể lại những gì xảy ra sau khi vấn đề kia được giải quyết.</p>

<p>Khi cái rào cản vô hình không còn — mối quan hệ tự nhiên ấm lại. Không cần nỗ lực. Không cần kế hoạch. Chỉ là tự nhiên thôi.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 9 (Day 25): Pain #4 — Cảm giác không xứng đáng ────────────
  {
    day: 25,
    subject: 'không phải lỗi của anh',
    body: wrap(`<p>Có một điều ít ai nói thẳng với đàn ông đang gặp vấn đề này.</p>

<p>Không phải lỗi của anh.</p>

<p>Không phải vì anh yếu. Không phải vì anh không đủ đàn ông. Không phải vì anh làm gì sai trong quá khứ.</p>

<p>Đây là vấn đề sinh lý — cơ chưa được huấn luyện đúng, hệ thần kinh quá nhạy, tâm lý bị kẹt trong vòng lặp lo lắng. Ba điều đó có thể học lại được. Có thể huấn luyện được.</p>

<p>Cái cảm giác "mình không xứng đáng" mà anh đang mang — nó không đúng. Và nó không cần tồn tại thêm một ngày nào nữa.</p>

<p>Mật Mã 21 không bán cho anh tự tin. Nó giúp anh xây lại nền tảng để tự tin xuất hiện tự nhiên.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 10 (Day 28): Gain #4 — Cảm giác đàn ông thật sự ───────────
  {
    day: 28,
    subject: '"lần đầu tiên cảm thấy mình là đàn ông thật sự"',
    body: wrap(`<p>Đó là lời một học viên 38 tuổi, đã có vợ và hai con.</p>

<p>Anh ấy không nói điều đó với ai. Chỉ nhắn cho tôi sau tuần 3 Mật Mã 21.</p>

<p><em>"Tôi không biết mô tả thế nào khác. Chỉ là... lần đầu tiên tôi cảm thấy mình là đàn ông thật sự. Không phải diễn. Không phải cố. Là thật."</em></p>

<p>Đó là kết quả khi cả 5 hệ thống kiểm soát hoạt động đúng cùng lúc. Não bộ không còn phải quản lý nỗi lo đó — nên toàn bộ sự tự tin được giải phóng.</p>

<p>Và nó lan ra ngoài. Họp hành tốt hơn. Tự tin hơn với con cái. Ít cáu kỉnh hơn.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 → bắt đầu hành trình</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 11 (Day 31): Job #1 — Giữ hôn nhân ─────────────────────────
  {
    day: 31,
    subject: 'điều anh thật sự đang cố bảo vệ',
    body: wrap(`<p>Sâu bên trong — anh không chỉ muốn kéo dài thêm vài phút.</p>

<p>Anh muốn hôn nhân ổn. Anh muốn người bạn đời hạnh phúc. Anh muốn không còn cái khoảng cách vô hình đó nữa.</p>

<p>Anh muốn buổi tối về nhà mà không mang theo nỗi lo đó. Anh muốn cuối tuần không còn phải tìm cách tránh né.</p>

<p>Đó mới là điều thật sự đang bị đặt cược.</p>

<p>Mật Mã 21 không chỉ dạy kỹ thuật. Nó dạy anh cách hiện diện hoàn toàn — không lo, không đếm, không tính. Chỉ là có mặt cho người mình yêu thương.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 12 (Day 34): Job #5 — Chữa lành tổn thương nhiều năm ────────
  {
    day: 34,
    subject: 'vết thương tích lũy nhiều năm',
    body: wrap(`<p>Với nhiều anh — vấn đề này không phải mới xảy ra. Nó đã ở đó nhiều năm.</p>

<p>Và trong nhiều năm đó — mỗi lần thất vọng là một lớp nhỏ. Tích lũy thành cái gánh nặng anh đang mang hôm nay.</p>

<p>Không phải lỗi của ai. Chỉ là chưa có ai chỉ anh cách giải quyết đúng.</p>

<p>Giải quyết vấn đề này không chỉ là thêm vài phút. Là trả lại cho anh thứ đã bị lấy đi trong nhiều năm: sự tự tin, cảm giác xứng đáng, và sự bình yên trong mối quan hệ.</p>

<p>21 ngày để chữa lành những gì nhiều năm để lại.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 13 (Day 37): Pain #3 — Vòng lặp lo lắng ────────────────────
  {
    day: 37,
    subject: 'vòng lặp lo lắng tự phá hoại anh',
    body: wrap(`<p>Đây là điều ít ai giải thích rõ ràng:</p>

<p>Lo lắng tạo ra phản xạ nhanh hơn. Phản xạ nhanh tạo ra thất vọng. Thất vọng tạo ra lo lắng nhiều hơn cho lần sau.</p>

<p>Vòng lặp tự phá hoại. Và nó hoạt động hoàn hảo — theo chiều ngược với điều anh muốn.</p>

<p>Đây là lý do anh có thể làm Kegel tốt — cơ đã mạnh hơn — nhưng vẫn còn lo lắng trước "lúc đó." Vì cơ và hệ thần kinh là hai chuyện khác nhau.</p>

<p>Mật Mã 21 có một tuần hoàn toàn dành cho hệ thần kinh và tâm lý — phá vỡ vòng lặp này từ gốc rễ. Không phải bằng ý chí. Bằng kỹ thuật.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 14 (Day 40): Gain #5 — Tự tin lan ra ngoài ─────────────────
  {
    day: 40,
    subject: 'tự tin trong phòng ngủ → tự tin ngoài đời thật',
    body: wrap(`<p>Điều này nghe có vẻ khó tin — nhưng học viên kể cho tôi nghe rất nhiều lần:</p>

<p>Sau khi giải quyết xong vấn đề kiểm soát — cuộc sống bên ngoài cũng thay đổi.</p>

<p>Tự tin hơn trong cuộc họp. Kiên nhẫn hơn với con cái. Quyết đoán hơn trong công việc. Ít căng thẳng vô cớ hơn.</p>

<p>Không phải ngẫu nhiên. Khi một gánh nặng tâm lý được giải phóng — toàn bộ năng lượng tinh thần dành cho những thứ quan trọng hơn.</p>

<p>Anh đang đọc email này vì anh muốn tốt hơn. Không phải cho điểm số. Cho cuộc sống thật của mình.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — bắt đầu hành trình →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 15 (Day 43): Job #3 — Không để vợ thiếu thốn ──────────────
  {
    day: 43,
    subject: 'không phải cho bản thân — là cho cô ấy',
    body: wrap(`<p>Có một điều đàn ông thường không nói ra:</p>

<p>Nỗi sợ khiến người mình yêu thương thất vọng.</p>

<p>Không phải vì ích kỷ hay tự ái. Mà vì yêu thật sự — anh muốn người bên cạnh được hạnh phúc đầy đủ. Muốn cô ấy không thiếu thốn điều gì.</p>

<p>Đó là Customer Job thật sự của phần lớn học viên FORMEN: không phải "tôi muốn cảm giác tốt hơn" — mà là "tôi không muốn cô ấy thiếu thốn."</p>

<p>Mật Mã 21 là 21 ngày để anh trở thành người bạn đời mà anh muốn là — không phải vì áp lực, mà vì anh có đủ công cụ.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 16 (Day 46): Pain #8 — Quan hệ lạnh dần ───────────────────
  {
    day: 46,
    subject: 'khoảng cách không ai nhắc đến',
    body: wrap(`<p>Nhiều cặp đôi không xa nhau vì to tiếng. Họ xa dần vì những khoảng cách nhỏ tích lũy.</p>

<p>Ít chạm vào nhau hơn. Ít nói chuyện sâu hơn. Ít kế hoạch chung hơn. Ít ánh mắt tìm nhau hơn.</p>

<p>Không ai nói lý do. Nhưng cả hai đều cảm nhận.</p>

<p>Giải quyết vấn đề thể chất thường mở ra lại những cuộc trò chuyện đó — vì cái rào cản vô hình không còn nữa. Cả hai không biết lý do tại sao mọi thứ ấm lại. Nhưng nó ấm thật.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 17 (Day 49): Gain #9 — Tự hào thầm với bản thân ───────────
  {
    day: 49,
    subject: 'cái tự hào không cần ai biết',
    body: wrap(`<p>Có một loại tự hào mà anh không kể với ai.</p>

<p>Không phải tự hào đăng Facebook. Không phải kể với bạn bè.</p>

<p>Chỉ là một buổi tối anh nhìn vào gương và thầm biết: "Mình đã giải quyết được. Mình đã làm được."</p>

<p>Học viên hay nhắn tôi về khoảnh khắc đó. Không phô trương. Chỉ là một câu ngắn — nhưng tôi đọc được trọng lượng của nó.</p>

<p>Đó là cái mà không có thuốc nào mua được. Phải tự xây.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 18 (Day 52): Pain #6 — Giả vờ mệt ─────────────────────────
  {
    day: 52,
    subject: '"hôm nay mệt" — anh đã nói bao nhiêu lần?',
    body: wrap(`<p>Tôi biết cái câu đó.</p>

<p>"Hôm nay mệt." Hoặc "Sáng mai còn họp sớm." Hoặc đơn giản là giả vờ ngủ trước.</p>

<p>Không phải vì anh không muốn. Mà vì anh sợ. Sợ lại thất vọng cô ấy. Sợ lại phải nhìn cái ánh mắt đó — dù cô ấy không nói gì.</p>

<p>Vậy mà tránh né lại làm mọi thứ tệ hơn. Khoảng cách rộng thêm. Cô ấy nghĩ anh không còn muốn. Anh biết lý do thật nhưng không nói được.</p>

<p>Không ai nên sống như vậy trong mối quan hệ của mình.</p>

<p>Mật Mã 21 là 21 ngày để anh không cần tránh né nữa.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 19 (Day 55): Khoa học — Tại sao 3-5 phút chưa đủ ──────────
  {
    day: 55,
    subject: '3-5 phút tốt hơn rồi — nhưng chưa đủ, phải không?',
    body: wrap(`<p>Tôi không nói điều này để làm anh buồn.</p>

<p>Anh biết điều này rồi.</p>

<p>3-5 phút là tiến bộ thật. Nhưng vẫn chưa đủ để anh thật sự tự tin. Vẫn còn đó chút lo lắng trước khi bắt đầu. Vẫn còn đó cảm giác "chưa chắc lần này."</p>

<p>Đó là tầng 2-5 vẫn chưa được xây. Hệ thần kinh. Nội tiết tố. Tâm lý. Tuần hoàn.</p>

<p>Kegel làm tốt việc của nó. Nhưng nó chỉ làm được việc của nó thôi.</p>

<p>Bước tiếp theo cần một hệ thống toàn diện hơn.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 20 (Day 58): Job #2 — Cảm thấy đủ tư cách ─────────────────
  {
    day: 58,
    subject: 'cảm thấy đủ tư cách là người đàn ông của gia đình',
    body: wrap(`<p>Có một điều sâu hơn bất kỳ con số nào:</p>

<p>Cảm giác đủ tư cách.</p>

<p>Đủ tư cách là người chồng. Người cha. Người đàn ông trong gia đình này.</p>

<p>Khi vấn đề kiểm soát chưa được giải quyết — cảm giác đó không trọn vẹn. Dù anh làm tốt mọi thứ khác. Dù anh kiếm tiền tốt, chăm sóc gia đình tốt.</p>

<p>Vẫn có một góc khuất nhỏ. Và anh biết nó ở đó.</p>

<p>Mật Mã 21 là 21 ngày để lấp đầy góc khuất đó — bằng công cụ thật, kết quả thật.</p>

<p><a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 21 (Day 61): Email cuối — Tôn trọng ────────────────────────
  {
    day: 61,
    subject: 'email cuối — tôi tôn trọng anh',
    body: wrap(`<p>Đây là email cuối trong chuỗi này.</p>

<p>Tôi đã gửi 21 email. Không ép. Không deadline giả. Chỉ chia sẻ thật những gì tôi nghĩ có giá trị cho anh.</p>

<p>Anh vẫn đang đọc sau tất cả những email đó — điều đó có ý nghĩa.</p>

<p>Nếu anh chưa sẵn sàng cho Mật Mã 21 — tôi hoàn toàn tôn trọng. Mỗi người có thời điểm của riêng mình. Không ai nên bị ép.</p>

<p>Nhưng nếu anh đã sẵn sàng — link vẫn ở đây:<br>
<a href="${MM21_URL}" style="color:#2d6a4f;">Mật Mã 21 — 686.868đ, hoàn tiền 3 ngày →</a></p>

<p>Cảm ơn anh đã tin tưởng FORMEN. Dù anh quyết định gì — tôi mong anh tìm được điều mình cần.</p>

<p>—<br>FORMEN</p>`)
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

<p>Điều này không nhỏ. Anh biết nó không nhỏ.</p>

<p>Đây không phải lời nói xã giao — anh vừa làm điều mà phần lớn đàn ông biết mình cần nhưng không làm. Họ chờ thêm, suy nghĩ thêm, rồi thôi. Anh không phải người đó.</p>

<p><strong>3 điều để 21 ngày này không bị lãng phí:</strong></p>

<p><strong>1. Đừng bỏ qua bài học tâm lý.</strong> 60% kiểm soát đến từ hệ thần kinh và tâm lý — không phải cơ bắp. Đây là phần mà thuốc không làm được.</p>

<p><strong>2. Không tập thêm ngoài lịch.</strong> Cơ thể cần 72 giờ thích nghi sau mỗi bài cường độ mới. Tập thêm = làm chậm kết quả.</p>

<p><strong>3. Tuần 2 là thời điểm nhiều người bỏ.</strong> Hưng phấn ban đầu qua đi nhưng kết quả rõ chưa đến. Đây là lúc quan trọng nhất để kiên trì.</p>

<p style="text-align:center;margin:24px 0;"><a href="https://www.thuthach21ngay.org/portal" style="background:#2d6a4f;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Vào Portal Học Ngay →</a></p>

<p style="text-align:center;"><a href="${TG_GROUP}" style="background:#229ED9;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">📱 Nhóm Hỗ Trợ →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 2 (Day 2): Check-in tuần 1 ─────────────────────────────────
  {
    day: 2,
    subject: 'ngày 3 — anh cảm thấy thế nào?',
    body: wrap(`<p>Ngày 3 rồi. Bài 1, 2, 3 xong chưa anh?</p>

<p>Sau 3 ngày Kegel nâng cao — nhiều người cảm thấy mỏi nhẹ ở vùng đáy chậu. Không đau, chỉ là cảm giác "cơ vừa được dùng đúng cách lần đầu." Đó là dấu hiệu tốt.</p>

<p>Nếu chưa cảm thấy gì — không sao. Mỗi người khác nhau. Cứ tiếp tục đúng lịch.</p>

<p>Quan trọng nhất giai đoạn này: <strong>kỹ thuật cô lập đúng cơ.</strong> Nếu anh đang co cả vùng bụng hay mông — xem lại bài 2.</p>

<p><a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào portal học bài tiếp theo →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 3 (Day 6): Tuần 2 briefing ─────────────────────────────────
  {
    day: 6,
    subject: 'xong tuần 1 — đây là điều cần biết cho tuần 2',
    body: wrap(`<p>7 ngày xong. Tuần 2 sẽ khác — và tốt hơn.</p>

<p>Tuần 1 là về cơ bắp và kỹ thuật cô lập cơ. Tuần 2 bắt đầu đi vào <strong>hệ thần kinh</strong> — cách huấn luyện phản xạ tự động để không còn bị "bất ngờ."</p>

<p>Đây là phần mà phần lớn phương pháp tự tập bỏ qua. Và là lý do nhiều người Kegel thật tốt nhưng vẫn không kiểm soát được hoàn toàn.</p>

<p>Cơ khỏe thôi chưa đủ — phải dạy hệ thần kinh nhận ra tín hiệu và phản hồi đúng cách.</p>

<p><strong>Gợi ý thực tế:</strong> Tuần 2 tập vào buổi tối, khi đầu óc thư giãn nhất. Hệ thần kinh cần trạng thái bình tĩnh để học kỹ năng mới.</p>

<p><a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào học bài 8 →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 4 (Day 13): Giữa chặng — Giới thiệu Supplement nhẹ nhàng ───
  {
    day: 13,
    subject: 'ngày 14 — cơ thể cần gì thêm không?',
    body: wrap(`<p>Ngày 14. Nửa hành trình.</p>

<p>Anh đang cảm nhận được sự khác biệt rõ hơn chưa? Nhiều học viên ở giai đoạn này bắt đầu thấy kiểm soát được rõ hơn — đặc biệt khi không lo lắng nhiều.</p>

<p>Hôm nay tôi muốn chia sẻ điều nhiều học viên hỏi ở giai đoạn này:</p>

<p><strong>"Có gì hỗ trợ thêm không?"</strong></p>

<p><strong>Kẽm và Magie</strong> là 2 vi chất ảnh hưởng trực tiếp đến kết quả Mật Mã 21:</p>

<p>
— Kẽm: hỗ trợ testosterone tự nhiên và kiểm soát cơ<br>
— Magie: cải thiện giấc ngủ sâu, giảm cortisol, tăng phục hồi hệ thần kinh
</p>

<p>Phần lớn nam giới Việt Nam thiếu cả 2. Thiếu kẽm = testosterone thấp hơn mức tối ưu. Thiếu magie = khó phục hồi sau tập và ngủ không sâu.</p>

<p>Tôi chưa bán gì trong email này. Chỉ muốn anh biết điều này tồn tại. Chia sẻ thêm sau khi anh hoàn thành 21 ngày.</p>

<p>Giờ tập trung bài 14: <a href="https://www.thuthach21ngay.org/portal" style="color:#2d6a4f;">Vào portal →</a></p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 5 (Day 20): Hoàn thành 21 ngày — Xin feedback ─────────────
  {
    day: 20,
    subject: 'anh vừa hoàn thành điều 95% không làm được',
    body: wrap(`<p>21 ngày. Anh làm được.</p>

<p>Chỉ khoảng 1 trong 20 người bắt đầu mà hoàn thành đủ. Không phải vì chương trình khó. Mà vì kiên trì khó. Anh là người đó.</p>

<p>Tôi muốn hỏi thật lòng:</p>

<p><strong>Sau 21 ngày — anh cảm nhận được gì khác so với trước?</strong></p>

<p>Reply email này, hoặc nhắn nhóm Telegram. Tôi đọc mọi tin nhắn.</p>

<p>Feedback của anh giúp tôi cải thiện chương trình cho người tiếp theo. Và đôi khi chỉ cần viết ra — anh sẽ nhận ra mình đã thay đổi nhiều hơn mình nghĩ.</p>

<p><a href="${TG_GROUP}" style="color:#2d6a4f;">Nhắn nhóm Telegram →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Cảm ơn anh đã tin tưởng FORMEN. Thật sự.</p>`)
  },

  // ── EMAIL 6 (Day 27): Supplement upsell — Duy trì kết quả dài hạn ────
  {
    day: 27,
    subject: 'cách giữ kết quả lâu dài',
    body: wrap(`<p>Anh đã hoàn thành 21 ngày. Câu hỏi tiếp theo: làm thế nào để kết quả này kéo dài?</p>

<p>Cơ thể cần nguồn nguyên liệu đúng để duy trì và phát triển tiếp. Hai vi chất quan trọng nhất:</p>

<p>
<strong>Kẽm</strong> — hỗ trợ testosterone tự nhiên, kiểm soát cơ, sức bền<br>
<strong>Magie</strong> — cải thiện giấc ngủ sâu, giảm cortisol, tăng kiểm soát thần kinh
</p>

<p>Combo Kẽm + Magie: <strong>499.000đ/tháng</strong></p>

<p><strong>Ưu đãi học viên MM21:</strong> Giảm thêm 50.000đ — còn <strong>449.000đ</strong> cho đơn đầu tiên trong 7 ngày tới.</p>

<p style="text-align:center;margin:28px 0;"><a href="${SUPP_URL}" style="background:#2d6a4f;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">Đặt Mua Supplement →</a></p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Không bắt buộc. Nhiều học viên duy trì tốt mà không cần. Nhưng nếu muốn tối ưu — đây là bước hỗ trợ tốt nhất tôi biết.</p>`)
  },

  // ── EMAIL 7 (Day 34): Affiliate — Giới thiệu tự nhiên ────────────────
  {
    day: 34,
    subject: 'anh có muốn chia sẻ với ai không?',
    body: wrap(`<p>Nhiều học viên sau khi hoàn thành MM21 tự nhiên muốn chia sẻ với bạn bè — vì kết quả thật và họ muốn người khác cũng được như vậy.</p>

<p>Chúng tôi có chương trình <strong>Affiliate FORMEN</strong> — anh không cần bán hàng, không cần fanpage, không cần chạy quảng cáo:</p>

<p>
— Kegel Khởi Đầu (199k) được giới thiệu: <strong>40.000đ hoa hồng</strong><br>
— Mật Mã 21 (686k) được giới thiệu: <strong>140.000đ hoa hồng</strong><br>
— Supplement: <strong>15% hoa hồng</strong>
</p>

<p>Chỉ cần link cá nhân. Khi ai anh thấy phù hợp — share link. Nếu họ mua — anh nhận hoa hồng tự động.</p>

<p>Không ép. Chỉ share với người anh thật sự muốn giúp.</p>

<p>Nhắn <a href="${TG_GROUP}" style="color:#2d6a4f;">nhóm Telegram</a>: "Tôi muốn đăng ký affiliate" — nhận link trong 24 giờ.</p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 8 (Day 44): Affiliate proof — Anh Tuấn ─────────────────────
  {
    day: 44,
    subject: 'anh Tuấn kiếm thêm 3 triệu tháng đầu — không chạy ads',
    body: wrap(`<p>Anh Tuấn, 38 tuổi, Đà Nẵng — học viên MM21 từ tháng 3.</p>

<p>Anh không có fanpage. Không chạy quảng cáo. Không phải chuyên gia marketing.</p>

<p>Tháng đầu làm affiliate: giới thiệu 8 người vào Kegel và 3 người vào MM21. Tổng: <strong>~3 triệu hoa hồng</strong>.</p>

<p>Bí quyết của anh: <em>"Tôi chỉ share với người tôi thấy đang gặp vấn đề tương tự. Không ép. Chỉ nói: có thứ này, tôi đã thử, nó hiệu quả. Họ tự quyết định."</em></p>

<p>Nếu anh chưa đăng ký affiliate — hôm nay là lúc:</p>

<p>Nhắn <a href="${TG_GROUP}" style="color:#2d6a4f;">nhóm Telegram</a>: "Đăng ký affiliate" — nhận link trong 24 giờ.</p>

<p>—<br>FORMEN</p>`)
  },

  // ── EMAIL 9 (Day 59): 60 ngày — Check-in ─────────────────────────────
  {
    day: 59,
    subject: '60 ngày rồi — anh thế nào?',
    body: wrap(`<p>60 ngày kể từ ngày anh vào Mật Mã 21.</p>

<p>Tôi không gửi email này để bán gì. Chỉ muốn hỏi thật: anh thế nào?</p>

<p>Kết quả có duy trì không? Mối quan hệ có khác không? Có điều gì anh muốn cải thiện thêm không?</p>

<p>Nếu mọi thứ tốt — tuyệt vời. Nhớ bổ sung Kẽm + Magie hàng tháng để duy trì: <a href="${SUPP_URL}" style="color:#2d6a4f;">Đặt mua →</a></p>

<p>Nếu có gì chưa ổn — nhắn tôi qua <a href="${TG_GROUP}" style="color:#2d6a4f;">Telegram</a>. Tôi sẽ xem anh cần điều chỉnh gì.</p>

<p>Cảm ơn anh đã là một phần của FORMEN. Điều đó không nhỏ với tôi.</p>

<p>—<br>FORMEN</p>

<p style="font-size:13px;color:#888;">P.S. Nếu anh có feedback muốn chia sẻ công khai — nhắn tôi. Tôi có phần quà nhỏ cho anh.</p>`)
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
