# NT AI Writer – Landing Page

Landing Page giới thiệu và chọn gói sử dụng cho **NT AI Writer** (Plugin viết bài chuẩn SEO bằng AI tích hợp trực tiếp trên WordPress).

---

## 1. Yêu cầu hệ thống & Công nghệ
- **Node.js**: Phiên bản LTS `>= 20.0.0` (khuyên dùng Node 20 hoặc Node 22).
- **Công nghệ**: Vite (Vanilla) + HTML5 Semantic + Modern CSS3 (Custom Properties & Tokens) + ES Modules.
- **Không phụ thuộc**: Không dùng React/Vue, TypeScript, TailwindCSS hay thư viện UI bên ngoài.
- **Triển khai (Deploy)**: Tự động lên GitHub Pages bằng GitHub Actions (`.github/workflows/deploy.yml`).

---

## 2. Hướng dẫn cài đặt & Chạy cục bộ

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy môi trường phát triển (Dev server)
npm run dev
# Mở trình duyệt tại: http://localhost:3000/

# 3. Biên dịch bản đóng gói tối ưu cho Production
npm run build

# 4. Kiểm tra trước bản build (Preview server)
npm run preview
# Mở trình duyệt tại: http://localhost:4173/toolwriteseo/
```

---

## 3. Cấu hình Biến Môi Trường (`.env`)

Sao chép file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

Các biến môi trường hỗ trợ:
- `VITE_SITE_URL`: Domain chính thức của website (dùng cho thẻ Canonical, Open Graph, Sitemap). Mặc định: `https://username.github.io/toolwriteseo`
- `VITE_BASE_PATH`: Đường dẫn base khi deploy (ví dụ: `'/toolwriteseo/'` cho repo thường, `'/'` nếu dùng custom domain).
- `VITE_WP_API_URL`: Endpoint WordPress REST API lấy bài viết (Mặc định: `https://share4happy.com/wp-json/wp/v2/posts`).
- `VITE_WP_CATEGORY_ID`: ID chuyên mục lấy bài (Mặc định: `208`).
- `VITE_WP_POSTS_COUNT`: Số lượng bài viết nạp vào Carousel (Mặc định: `5`).

---

## 4. Hướng dẫn chỉnh sửa & Vận hành

### 4.1 Thay thế hình ảnh thật (Quy tắc "Khung trước, ảnh sau")
- Toàn bộ hình ảnh được cấu hình và xuất khẩu tại file: `src/scripts/images.js`.
- Bảng đối chiếu kích thước, tỉ lệ `aspect-ratio` được ghi rõ trong `docs/ASSETS_TODO.md`.
- Khi bạn có ảnh thật: chỉ cần đặt file vào thư mục `src/assets/images/` với đúng tên file tương ứng (ví dụ: `hero-dashboard.webp`, `feature-keyword.webp`), website sẽ tự động hiển thị hình ảnh thật mà không cần sửa cấu trúc layout hay CSS.

### 4.2 Chỉnh sửa bảng giá & các gói dịch vụ
- File cấu hình: `src/scripts/config.js`.
- Chỉnh sửa mảng `APP_CONFIG.pricing.plans` để cập nhật tên gói, giá tiền (USD/VND), mô tả và danh sách quyền lợi.
- Hệ thống hỗ trợ nút chuyển đổi chu kỳ **Thanh toán theo tháng** và **Thanh toán theo năm** (tự động chiết khấu 20%).

### 4.3 Chỉnh sửa câu hỏi thường gặp (FAQ)
- Mở file `index.html`, tìm đến section `#faq`.
- Thêm hoặc sửa các thẻ `<div class="faq-item">` theo mẫu có sẵn. Accordion được viết bằng CSS Grid và JS thuần, tự động nhận diện tương tác và đảm bảo chuẩn tiếp cận bàn phím (WCAG).

### 4.4 Cấu hình Form tư vấn kết nối Google Form
- Form đăng ký tư vấn nằm tại section `#dang-ky`.
- Khi người dùng gửi form, dữ liệu được truyền ngầm qua `fetch(mode: 'no-cors')` kết hợp fallback hidden iframe (không reload hay redirect trang).
- Khi có **Action URL** chính thức từ Google Form:
  1. Cách 1: Mở file `.env` và thêm:
     ```env
     VITE_GOOGLE_FORM_ACTION_URL=https://docs.google.com/forms/u/0/d/e/.../formResponse
     ```
  2. Cách 2: Mở file `src/scripts/config.js`, điền trực tiếp vào `APP_CONFIG.googleForm.actionUrl`.
- Mapping chính xác các Entry IDs từ biểu mẫu Google Form (Tool Viết bài):
  - Họ và Tên: `entry.1911338714`
  - Số điện thoại: `entry.1427954621`
  - Email: `entry.1636694682`
  - Gói dịch vụ muốn sử dụng: `entry.736251697` (Free, Starter, Grow, Pro, Corp)

### 4.5 Cấu hình API Tạo Hoá Đơn & Gửi Email Tự Động
- Khi khách hàng bấm nộp form, hệ thống gửi song song:
  1. Dữ liệu ngầm vào Google Form.
  2. Gửi yêu cầu HTTP POST JSON tới API tạo hoá đơn điện tử của hệ thống.
- Cấu hình qua file `.env`:
  ```env
  VITE_INVOICE_API_URL=https://api.yourdomain.com/invoices/create-and-send
  VITE_INVOICE_API_KEY=your_secret_token_here
  ```
  *(Hoặc cấu hình trực tiếp trong `src/scripts/config.js` tại mục `invoiceApi`)*.
- **Định dạng dữ liệu JSON Payload gửi tới API**:
  ```json
  {
    "invoiceCode": "INV-833350",
    "createdAt": "2026-10-27T11:15:00.000Z",
    "customer": {
      "fullName": "Trần Anh Tuấn",
      "phone": "0934567890",
      "email": "anhtuan.tran@example.com"
    },
    "order": {
      "packageId": "pro",
      "packageName": "Pro",
      "amountVnd": 725000,
      "amountUsd": 29,
      "chargeAmount": 725000,
      "currency": "VND",
      "billingCycle": "monthly",
      "description": "Đăng ký gói Pro – NT AI Writer WordPress Plugin"
    },
    "sendEmail": true,
    "source": "Landing Page NT AI Writer"
  }
  ```
- **Khi chưa có API URL thật:** Hệ thống tự động kích hoạt **Simulation Mode** (ghi log payload chi tiết với màu sắc nổi bật trong DevTools Console và trả về mã hoá đơn ngẫu nhiên kèm chi tiết thanh toán cho khách hàng xem trên giao diện).

### 4.6 Cấu hình Zalo Bot Batch API (Gửi tin nhắn & kết bạn tự động)
- Sau khi gửi email hoá đơn, hệ thống tự động gọi API Zalo Bot để gửi tin nhắn kèm mã hóa đơn và link tải file PDF trực tiếp tới số điện thoại của khách hàng.
- Đồng thời tự động gửi lời mời kết bạn qua Zalo kèm tiền tố `alias_prefix: "KH_NT_"` để bot phân loại và lưu danh bạ.
- Cấu hình qua file `.env`:
  ```env
  VITE_ZALO_API_BASE_URL=https://api.yourdomain.com/api/gateway/v1.0
  VITE_ZALO_BOT_ID=YOUR_BOT_ID
  VITE_ZALO_API_KEY=YOUR_ZALO_API_KEY
  ```
- **Endpoint gọi tự động:**
  - Nhắn tin: `POST /bots/{bot_id}/messages/send-batch` (với `mode: "safe"`)
  - Kết bạn: `POST /bots/{bot_id}/friends/requests/send-batch` (với `alias_prefix: "KH_NT_"`)
- **Khi chưa có API Key:** Hệ thống kích hoạt **Zalo Simulation Mode** (tự động chuẩn hóa số điện thoại theo định dạng chuẩn Việt Nam `09...`, ghi log payload ra console và cập nhật huy hiệu Zalo trên màn hình thành công).

---

## 5. Hướng dẫn Kích hoạt GitHub Pages

1. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: NT AI Writer production-ready landing page"
   git remote add origin https://github.com/<username>/<ten-repo>.git
   git branch -M main
   git push -u origin main
   ```
2. **Kích hoạt GitHub Actions cho Pages**:
   - Truy cập vào Repository trên GitHub: **Settings** > **Pages**.
   - Tại mục **Build and deployment** > **Source**, chọn: **GitHub Actions**.
3. **Theo dõi tiến trình Deploy**:
   - Chuyển sang tab **Actions** trên GitHub để xem workflow `Deploy to GitHub Pages` tự động chạy.
   - Khi workflow hoàn tất, website sẽ có sẵn tại URL: `https://<username>.github.io/<ten-repo>/`.
4. **Trường hợp dùng Tên miền riêng (Custom Domain)**:
   - Trong **Settings** > **Pages** > **Custom domain**, nhập tên miền của bạn (ví dụ: `aiwriter.vn`).
   - Tích chọn **Enforce HTTPS**.
   - Sửa biến `VITE_BASE_PATH=/` trong file `.env.production` và chạy lại build.
5. **Lưu ý sự cố trang trắng**:
   - Nếu sau khi deploy thấy trang trắng, hãy kiểm tra lại đường dẫn `base` trong `vite.config.js` đã khớp với tên repository GitHub chưa.
   - GitHub Pages có thể cache CDN từ 5 - 10 phút sau khi deploy lần đầu.

---

## 6. Cấu trúc thư mục dự án

```
toolwriteseo/
├── index.html                  # Khung HTML5 ngữ nghĩa, tối ưu SEO, Open Graph, Schema JSON-LD
├── vite.config.js              # Cấu hình Vite & Base path GitHub Pages
├── package.json                # scripts (dev, build, preview), engines Node.js LTS
├── .env.example                # File mẫu biến môi trường
├── .gitignore                  # Bỏ qua dist, node_modules, .env
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow deploy chính thức
├── public/
│   ├── robots.txt              # File robots cho search bots
│   ├── sitemap.xml             # Sitemap XML chuẩn
│   ├── 404.html                # Trang 404 tùy chỉnh
│   ├── favicon.svg             # Favicon SVG sắc nét
│   └── og-image.svg            # Ảnh chia sẻ mạng xã hội (1200x630)
├── src/
│   ├── styles/
│   │   ├── tokens.css          # Design tokens (màu sắc, typography, spacing, shadows)
│   │   ├── base.css            # Reset hiện đại, container, typography cơ bản
│   │   ├── components.css      # Nút bấm, card, pill badges, image placeholders
│   │   └── sections/           # CSS riêng biệt cho từng section (12 sections)
│   ├── scripts/
│   │   ├── config.js           # Cấu hình tập trung toàn bộ ứng dụng
│   │   ├── images.js           # Quản lý hình ảnh và placeholder tập trung
│   │   ├── menu.js             # Mobile drawer navigation & smooth scrolling
│   │   ├── posts.js            # WordPress REST API fetcher & infinite marquee carousel
│   │   ├── pricing.js          # Xử lý tương tác bảng giá và chu kỳ thanh toán
│   │   ├── faq.js              # Accordion FAQ tiếp cận bàn phím
│   │   └── main.js             # Điểm khởi chạy chính gom các modules
│   └── assets/
│       ├── images/             # Nơi chứa các hình ảnh thực tế (WebP/PNG/JPG)
│       └── icons/              # Icons SVG
└── docs/
    ├── PROJECT_NOTES.md        # Ghi chú phân tích thiết kế, kiểm tra API & quyết định kỹ thuật
    └── ASSETS_TODO.md          # Bảng đối chiếu hình ảnh theo quy tắc khung trước ảnh sau
```
