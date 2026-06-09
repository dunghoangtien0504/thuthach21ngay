# 🛡️ Mật Mã 21 - Lộ Trình 21 Ngày Tái Sinh Bản Lĩnh Phái Mạnh

Ứng dụng web học tập trực tuyến (LMS Portal) được thiết kế hiện đại, tinh tế với phong cách tối giản và bảo mật cao dành cho khóa học **Lộ Trình 21 Ngày Tái Sinh Bản Lĩnh Phái Mạnh Tại Nhà**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdunghoangtien0504%2Fthuthach21ngay&env=VITE_SITE_TITLE,VITE_PRICE,VITE_ZALO_PHONE,VITE_SUPPORT_EMAIL)

---

## ✨ Tính Năng Nổi Bật

1. **Giao Diện Học Tập Chuyên Nghiệp**: Thiết kế chia đôi màn hình (Split-screen), sidebar điều hướng 22 ngày học (Day 0 - Day 21) mượt mà và trực quan.
2. **Trình Phát Video Tích Hợp**: Nhúng trực tiếp các bài học video/audio hướng dẫn thở phế vị, Kegel và các động tác bổ trợ sức bền.
3. **Bộ Lọc Sàng Lọc Y Khoa**: Checklist kiểm tra an toàn y khoa trước khi bắt đầu lộ trình.
4. **Nhật Ký Theo Dõi Tiến Trình (IELT Tracker)**: Biểu đồ và bảng ghi chép kết quả luyện tập, thời gian thâm nhập ước tính (IELT), mức độ kiểm soát và tự tin. Dữ liệu được lưu trữ an toàn trong trình duyệt của học viên qua `localStorage`.
5. **Cấu Hình Linh Hoạt qua `.env`**: Cho phép dễ dàng thay đổi tiêu đề trang web, giá cả, số điện thoại Zalo hỗ trợ và email liên hệ mà không cần can thiệp vào mã nguồn.

---

## 🛠️ Hướng Dẫn Cài Đặt Cục Bộ (Local Setup)

Để chạy thử nghiệm và phát triển ứng dụng trên máy tính của bạn:

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   Sao chép file `.env.example` thành `.env` và điền thông tin của bạn:
   ```bash
   VITE_SITE_TITLE="Mật Mã 21 - Tái Sinh Bản Lĩnh Phái Mạnh"
   VITE_PRICE="686.868đ"
   VITE_ZALO_PHONE="0377014982"
   VITE_SUPPORT_EMAIL="support@themencode.vn"
   ```

3. **Chạy môi trường phát triển (Development server)**:
   ```bash
   npm run dev
   ```
   *Mở trình duyệt truy cập địa chỉ hiển thị trong terminal (thường là `http://localhost:5173`).*

4. **Biên dịch sản phẩm (Production build)**:
   ```bash
   npm run build
   ```
   *Mã nguồn biên dịch tối ưu sẽ nằm trong thư mục `dist/`.*

---

## 🚀 Hướng Dẫn Đồng Bộ & Triển Khai Lên Vercel

Dự án đã được cấu hình hoàn chỉnh để triển khai lên Vercel chỉ với vài bước:

1. Đăng nhập vào [Vercel](https://vercel.com/).
2. Nhấp chọn **"Add New"** -> **"Project"**.
3. Kết nối tài khoản GitHub của bạn và chọn import kho chứa **`dunghoangtien0504/thuthach21ngay`**.
4. Vercel sẽ tự động nhận diện đây là dự án **Vite**.
5. **Quan Trọng**: Mở phần **"Environment Variables"** và điền 4 biến môi trường từ file `.env` của bạn:
   *   `VITE_SITE_TITLE`
   *   `VITE_PRICE`
   *   `VITE_ZALO_PHONE`
   *   `VITE_SUPPORT_EMAIL`
6. Nhấp nút **"Deploy"**. Vercel sẽ biên dịch và cấp cho bạn một đường dẫn (URL) chạy trực tuyến miễn phí trọn đời.
7. Mỗi khi bạn thực hiện cập nhật mã nguồn và `git push` lên nhánh `main`, Vercel sẽ tự động cập nhật phiên bản mới lên website.
