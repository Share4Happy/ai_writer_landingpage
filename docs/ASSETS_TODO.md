# BẢNG ĐỐI CHIẾU ASSETS - NT AI WRITER LANDING PAGE

Tài liệu này theo dõi toàn bộ hình ảnh và icon cần thiết cho Landing Page NT AI Writer theo quy tắc **"khung trước, ảnh sau"**.
Mọi hình ảnh thiếu sẽ được tạo khung layout với class `.img-placeholder` có đúng tỉ lệ `aspect-ratio` và kích thước tương ứng, khai báo tập trung trong `src/scripts/images.js`.

---

## 1. Bảng đối chiếu hình ảnh (Images)

| STT | Tên file dự kiến | Kích thước đề xuất (W x H) | Aspect Ratio | Vị trí sử dụng | Mô tả & Alt Text | Trạng thái |
|---|---|---|---|---|---|---|
| 1 | `logo.svg` (hoặc `logo.png`) | 180 x 44 px | ~4:1 | Header & Footer | Logo nhận diện thương hiệu "NT AI Writer" | ⏳ Còn thiếu (dùng text + badge SVG) |
| 2 | `hero-dashboard.webp` | 1200 x 750 px (Desktop)<br>600 x 375 px (Mobile) | 16:10 | Hero Section | Ảnh chụp giao diện màn hình tạo bài viết tự động & Task Manager của plugin | ⏳ Còn thiếu (khung placeholder 16:10) |
| 3 | `feature-keyword.webp` | 600 x 400 px | 3:2 | Tính năng 1 | Minh họa tính năng nghiên cứu và mở rộng từ khóa AI | ⏳ Còn thiếu (khung placeholder 3:2) |
| 4 | `feature-editor.webp` | 600 x 400 px | 3:2 | Tính năng 3 | Minh họa trình soạn thảo chuẩn SEO và cấu hình bài viết | ⏳ Còn thiếu (khung placeholder 3:2) |
| 5 | `feature-automation.webp` | 600 x 400 px | 3:2 | Tính năng 5 | Minh họa cơ chế lên lịch xuất bản tự động trên WordPress | ⏳ Còn thiếu (khung placeholder 3:2) |
| 6 | `og-image.jpg` | 1200 x 630 px | 1.91:1 | Meta Tag (SEO/Social) | Ảnh đại diện khi chia sẻ link lên Facebook, Zalo, Twitter/X | ⏳ Còn thiếu (dùng placeholder SVG 1200x630 trong public/) |
| 7 | `favicon.svg` / `favicon.ico` | 32 x 32 px / 48 x 48 px | 1:1 | Browser tab / Bookmark | Favicon biểu tượng ngòi bút / tia sáng AI | ⏳ Còn thiếu (dùng favicon SVG tự dựng trong public/) |
| 8 | `avatar-user-1.webp` | 80 x 80 px | 1:1 | Section Đánh giá | Ảnh đại diện khách hàng nhận xét 1 | ⏳ Còn thiếu (placeholder tròn 1:1) |
| 9 | `avatar-user-2.webp` | 80 x 80 px | 1:1 | Section Đánh giá | Ảnh đại diện khách hàng nhận xét 2 | ⏳ Còn thiếu (placeholder tròn 1:1) |
| 10 | `avatar-user-3.webp` | 80 x 80 px | 1:1 | Section Đánh giá | Ảnh đại diện khách hàng nhận xét 3 | ⏳ Còn thiếu (placeholder tròn 1:1) |

*(Lưu ý: Ảnh bài viết trong Carousel không nằm trong danh sách này vì được nạp động từ WordPress REST API).*

---

## 2. Bảng đối chiếu Icons

Hệ thống icon sử dụng **SVG inline** thuần (không phụ thuộc thư viện bên ngoài như FontAwesome hay Lucide icon bundle) để đảm bảo tốc độ tải tối ưu, không phát sinh HTTP request và dễ tùy biến màu sắc:

| Icon | Vị trí | Mục đích | Trạng thái |
|---|---|---|---|
| `icon-sparkles` | Header / Hero badge | Biểu tượng AI sáng tạo | ✅ Tự dựng SVG inline |
| `icon-check` | Bảng giá & Lợi ích | Đánh dấu tính năng hỗ trợ | ✅ Tự dựng SVG inline |
| `icon-arrow-right` | Nút CTA | Mũi tên điều hướng | ✅ Tự dựng SVG inline |
| `icon-chevron-down` | FAQ Accordion | Mũi tên mở/đóng câu hỏi | ✅ Tự dựng SVG inline |
| `icon-play` / `icon-pause` | Carousel WordPress | Điều khiển tạm dừng/chạy carousel | ✅ Tự dựng SVG inline |
| `icon-external-link` | Carousel bài viết | Biểu tượng liên kết bài gốc | ✅ Tự dựng SVG inline |
| `icon-menu` / `icon-close` | Mobile Header | Mở/đóng navigation drawer | ✅ Tự dựng SVG inline |
| `icon-wordpress` | Hero / Feature | Logo WordPress tương thích | ✅ Tự dựng SVG inline |

---

## 3. Quy tắc xử lý Placeholder hình ảnh

1. **Class dùng chung:** `.img-placeholder` kết hợp gradient trung tính nhẹ nhàng (`background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)`).
2. **Khai báo tập trung:** Toàn bộ đường dẫn hình ảnh được export từ file `src/scripts/images.js`:
   ```javascript
   export const siteImages = {
     heroDashboard: {
       src: '/src/assets/images/hero-dashboard.webp',
       alt: 'Giao diện viết bài chuẩn SEO và Task Manager của NT AI Writer',
       width: 1200,
       height: 750,
       aspectRatio: '16/10'
     },
     // ...
   };
   ```
3. Khi người dùng bổ sung ảnh thật vào `src/assets/images/`, chỉ cần giữ đúng tên file, giao diện sẽ tự động hiển thị mượt mà mà không phải sửa cấu trúc layout hay CSS.
