# TÀI LIỆU PHÂN TÍCH THIẾT KẾ & KẾ HOẠCH TRIỂN KHAI
**Dự án:** Landing Page NT AI Writer (Tool viết bài SEO cho WordPress)  
**Ngày lập:** 27/10/2026  
**Trạng thái:** Hoàn thành Giai đoạn 1 đến 7 – Sẵn sàng bàn giao (Production-Ready)  

---

## 1. Tổng quan dự án
- **Thương hiệu / Sản phẩm:** NT AI Writer – Plugin viết bài chuẩn SEO bằng AI tích hợp trực tiếp trong WordPress.
- **Mục tiêu chuyển đổi chính:** Giới thiệu giải pháp toàn diện và điều hướng người dùng xem bảng giá / chọn gói sử dụng (Free, Starter, Grow, Pro, Corp).
- **Ngôn ngữ:** Tiếng Việt (`lang="vi"`).
- **Số trang:** 1 Landing Page duy nhất (Single-page layout).
- **Công nghệ cốt lõi:**
  - Build tool: **Vite** (vanilla template).
  - Ngôn ngữ: **HTML5 Semantic, CSS3 thuần (Modern CSS Custom Properties), JavaScript ES Modules**.
  - Không sử dụng React/Vue, TypeScript, TailwindCSS hay thư viện UI cồng kềnh.
  - Tự viết 100% Carousel trôi chậm, Accordion FAQ, Mobile menu drawer bằng Vanilla JS & CSS.
  - Node.js LTS (v22.x); cấu hình `engines` trong `package.json`.
- **Triển khai (Deploy):** GitHub Pages thông qua GitHub Actions (`.github/workflows/deploy.yml`).

---

## 2. Phân tích cấu trúc giao diện & Design System

Dựa trên tài liệu đặc tả [landing-page-nt-ai-writer.md](file:///d:/Projects/landing-page/toolwriteseo/landing-page-nt-ai-writer.md), trang được thiết kế với giao diện nền trắng hiện đại gồm 11 section:

1. **Header (Navigation bar):** Sticky header trắng mờ (`background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px)`), menu neo điều hướng, nút CTA và mobile drawer.
2. **Hero Section:** H1 chuẩn SEO, badge AI tinh tế, cặp nút CTA, dòng bảo chứng và mockup Dashboard tỉ lệ 16:10.
3. **Problem Section (Vấn đề):** Lưới 3 nỗi đau nội dung của người làm SEO.
4. **Features Section (Tính năng chính):** 6 thẻ tính năng tự động hóa nội dung toàn diện.
5. **How It Works (Cách hoạt động):** 3 bước trực quan kết nối đường line tiến trình.
6. **Why Choose Us (Lợi thế):** 5 ưu điểm vượt trội trên WordPress.
7. **Stats & Social Proof (Số liệu & Đánh giá):** 4 số liệu ấn tượng và 3 thẻ đánh giá thực tế.
8. **Pricing Section (Bảng giá):** 5 gói dịch vụ (Free, Starter, Grow, Pro, Corp), toggle chuyển đổi tháng/năm chiết khấu 20%.
9. **FAQ Section (Câu hỏi thường gặp):** 6 câu hỏi then chốt dạng Accordion CSS Grid.
10. **CTA Banner cuối trang:** Khối card gradient xanh dương - tím nổi bật kích thích chuyển đổi.
11. **Footer:** Chân trang nền xám nhạt tinh tế, bản quyền, liên kết điều khoản và email liên hệ.
    - Thông tin bản quyền © 2026 NT AI Writer.
    - Điều khoản dịch vụ, Chính sách bảo mật, Email liên hệ hỗ trợ.

---

### 2.2 Design System Tokens & Aesthetics
- **Màu sắc chủ đạo (Curated Modern Palette):**
  - Primary Brand (Xanh công nghệ & AI): `#2563EB` (Blue 600) / `#1D4ED8` (Blue 700).
  - Accent Gradient: `linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)`.
  - Surface Dark: `#0B0F19` (Nền chính tối ưu độ tương phản, hiện đại theo phong cách AI/SaaS).
  - Surface Card: `#131B2E` với viền `rgba(255, 255, 255, 0.08)`.
  - Text Primary: `#F8FAFC` (Slate 50), Text Secondary: `#94A3B8` (Slate 400).
  - Success: `#10B981`, Highlight: `#F59E0B`.
- **Typography:**
  - Font gia đình: `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
  - Tải từ Google Fonts với đầy đủ ký tự tiếng Việt (`vietnamese` subset), `display=swap`.
  - Phân cấp kích cỡ chuẩn: H1 (clamp(32px, 5vw, 56px)), H2 (clamp(24px, 3.5vw, 38px)), H3 (clamp(18px, 2.5vw, 22px)), Body (16px, line-height: 1.6).
- **Bố cục & Spacing:**
  - Container Max Width: `1200px` (có padding 24px ở mobile, 32px ở desktop).
  - Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px, 96px.
  - Border radius: sm (6px), md (10px), lg (16px), xl (24px), full (9999px).
  - Shadows: Box shadows nhiều tầng tạo độ sâu cho card và modal.

---

## 3. Kết quả xác minh WordPress REST API

### 3.1 Endpoint kiểm tra
- URL: `https://share4happy.com/wp-json/wp/v2/posts?categories=208&per_page=5&_embed`
- Trạng thái phản hồi: **HTTP 200 OK**.
- Đã chạy kiểm tra thực tế bằng lệnh `curl.exe` và Node.js script.

### 3.2 Kết quả phân tích dữ liệu thực tế
API trả về chính xác **5 bài viết**:
1. **Post 4706**: "Nhựa Resin Trong In 3D Là Gì? Ưu Điểm, Ứng Dụng Và Dịch Vụ In 3D" (Ngày: 2026-10-22)
2. **Post 4701**: "Nhựa TPU Là Gì? Ưu Điểm, Ứng Dụng Và Dịch Vụ In 3D TPU" (Ngày: 2026-10-22)
3. **Post 4685**: "Nhựa ABS Là Gì? Ưu Điểm, Ứng Dụng Và Gia Công In 3D" (Ngày: 2026-10-21)
4. **Post 4679**: "Nhựa PETG Là Gì? Ưu Điểm, Ứng Dụng Và Dịch Vụ In 3D Theo Yêu Cầu" (Ngày: 2026-10-21)
5. **Post 4666**: "Nhựa PLA Trong In 3D: Ưu Điểm, Ứng Dụng Và Khi Nào Nên Sử Dụng?" (Ngày: 2026-10-20)

### 3.3 Đánh giá các yếu tố kỹ thuật WordPress
- **CORS:** Server trả về header `access-control-allow-origin: [Origin của request]`, `access-control-allow-credentials: true`, `vary: Origin`. Trình duyệt gọi trực tiếp an toàn, không bị lỗi CORS trên cả localhost lẫn GitHub Pages.
- **Tiêu đề & Trích dẫn:** `title.rendered` và `excerpt.rendered` có chứa HTML entities (ví dụ `&hellip;`, `&#8211;`) và thẻ HTML (`<p>`). Sẽ dùng `DOMParser` để decode sạch sẽ, chỉ lấy text thuần, không dùng `innerHTML`.
- **Hình ảnh đại diện (Featured Media):** Nằm tại `_embedded['wp:featuredmedia'][0].source_url`. Đều có ảnh phân giải cao. Tuy nhiên `alt_text` trả về rỗng -> Cơ chế fallback sẽ lấy `title.rendered` làm `alt` để đảm bảo chuẩn accessibility và SEO.
- **Chuyên mục:** Lấy từ `_embedded['wp:term'][0][0].name` ("3D Print Studio").
- **Định dạng ngày:** Sử dụng `Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })`.

### 3.4 Giải pháp Carousel trôi chậm (Marquee Pure CSS)
- Tạo một carousel track lặp lại danh sách thẻ 2 lần (`posts` gốc + `posts` clone có `aria-hidden="true"` và `tabindex="-1"`).
- Dùng CSS animation:
  ```css
  @keyframes marqueeSlide {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  }
  ```
- Tốc độ trôi: điều khiển bằng biến CSS `--carousel-speed: 45s;`.
- Tạm dừng khi:
  - Người dùng di chuột (`:hover`).
  - Phần tử con nhận focus (`:focus-within`).
  - Nút Play/Pause được bấm (WCAG AA).
  - Thiết bị bật chế độ giảm chuyển động (`@media (prefers-reduced-motion: reduce)`: chuyển sang thanh cuộn ngang thủ công `overflow-x: auto; scroll-snap-type: x mandatory`).
- Hỗ trợ vuốt chạm trên Mobile bằng touch events thuần (touch start/move/end để tạm dừng và trượt mượt mà).

---

## 4. Đề xuất cấu trúc thư mục & mã nguồn (Giai đoạn 2)

```
/
├── index.html                  # Khung HTML5 ngữ nghĩa đầy đủ, tối ưu SEO, metadata, Open Graph
├── vite.config.js              # Cấu hình Vite (base path cho GitHub Pages, build options)
├── package.json                # scripts (dev, build, preview), engines Node.js LTS
├── .env.example                # Khai báo VITE_SITE_URL, VITE_WP_API_URL
├── .gitignore                  # Bỏ qua node_modules, dist, .env
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deploy tự động lên GitHub Pages
├── public/
│   ├── robots.txt              # Chỉ dẫn crawler công khai
│   ├── sitemap.xml             # Sitemap chuẩn XML
│   ├── 404.html                # Trang 404 tùy chỉnh
│   ├── favicon.svg             # Favicon SVG sắc nét
│   └── og-image.svg            # Ảnh chia sẻ mạng xã hội kích thước 1200x630
├── src/
│   ├── styles/
│   │   ├── tokens.css          # Biến màu, typography, spacing, shadows, transitions, breakpoints
│   │   ├── base.css            # Reset hiện đại, box-sizing, typography base
│   │   ├── components.css      # Nút bấm, badge, card, modal, accordion, placeholder
│   │   └── sections/
│   │       ├── header.css
│   │       ├── hero.css
│   │       ├── features.css
│   │       ├── steps.css
│   │       ├── carousel.css    # CSS animation marquee cho section bài viết
│   │       ├── pricing.css
│   │       ├── faq.css
│   │       └── footer.css
│   ├── scripts/
│   │   ├── config.js           # Cấu hình tập trung API URL, Category ID, App Constants
│   │   ├── images.js           # Khai báo tập trung toàn bộ hình ảnh dự kiến & placeholder
│   │   ├── menu.js             # Xử lý mobile menu drawer & smooth scroll
│   │   ├── posts.js            # Gọi WP REST API, xử lý dữ liệu, render cards & marquee carousel
│   │   ├── pricing.js          # Toggle tháng/năm chuyển đổi mức giá
│   │   ├── faq.js              # Xử lý Accordion tương tác
│   │   └── main.js             # Điểm khởi chạy chính gom các modules
│   └── assets/
│       ├── images/             # Thư mục chứa hình ảnh dự án (WebP/PNG/JPG)
│       └── icons/              # Icons SVG
└── docs/
    ├── PROJECT_NOTES.md        # Tài liệu phân tích thiết kế & kế hoạch này
    └── ASSETS_TODO.md          # Bảng theo dõi hình ảnh theo quy tắc khung trước, ảnh sau
```

---

## 5. Kế hoạch triển khai từng giai đoạn

| Giai đoạn | Nội dung công việc | Tiêu chí hoàn thành (Exit Criteria) |
|---|---|---|
| **Giai đoạn 1** (Hiện tại) | Phân tích thiết kế, gọi thử API, lập bảng assets, kế hoạch kỹ thuật | Hoàn thành `PROJECT_NOTES.md` và `ASSETS_TODO.md`. Dừng chờ duyệt. |
| **Giai đoạn 2** | Khởi tạo cấu trúc Vite vanilla, token CSS, GitHub Actions, scripts skeleton | `npm run dev` & `npm run build` chạy không lỗi, token sẵn sàng. |
| **Giai đoạn 3** | Xây dựng từng section theo thứ tự, tích hợp carousel API WP, áp dụng placeholder | Toàn bộ 12 section hoàn chỉnh trên desktop, carousel hoạt động mượt. |
| **Giai đoạn 4** | Responsive đa thiết bị (320px -> 1920px), bàn phím & A11y | Kiểm tra đầy đủ các breakpoint, không tràn ngang, đạt WCAG AA. |
| **Giai đoạn 5** | SEO On-page: Title, Meta, OG, Canonical, Schema JSON-LD, Sitemap, Robots | Metadata chuẩn, 1 H1 duy nhất, sitemap/robots hợp lệ. |
| **Giai đoạn 6** | Build production, kiểm tra preview với base path, kiểm tra hiệu năng | `npm run preview` không lỗi 404, không console error, tối ưu tải trang. |
| **Giai đoạn 7** | Viết README.md hướng dẫn cài đặt, bật GitHub Pages, bàn giao | Đầy đủ tài liệu bàn giao và hướng dẫn vận hành. |
| **Giai đoạn 8** | Gắn ảnh thật khi người dùng cung cấp | Thay thế placeholder bằng ảnh thật, build pass. |

---

## 6. Quyết định kỹ thuật & Giả định

1. **Giao diện Modern AI Tech SaaS:** Vì NT AI Writer là sản phẩm công nghệ AI cao cấp cho WordPress, giao diện được định hướng theo tông màu tối sang trọng (Dark Slate/Navy) kết hợp gradient sắc nét (Cyan - Blue - Violet), viền thẻ phản quang nhẹ và hiệu ứng kính mờ (glassmorphism), mang lại trải nghiệm chuyên nghiệp, thu hút.
2. **Font chữ:** Lựa chọn `Plus Jakarta Sans` kết hợp `Inter` từ Google Fonts, có hỗ trợ tiếng Việt đầy đủ và tối ưu hiển thị trên màn hình Retina.
3. **Quy tắc khung trước, ảnh sau:** Toàn bộ ảnh chưa có sẽ giữ nguyên bố cục với `.img-placeholder` kèm kích thước và tỉ lệ `aspect-ratio` chuẩn để tránh Layout Shift (CLS = 0).
4. **Vị trí Section WordPress Posts:** Được bố trí giữa mục **Social Proof/Lợi ích** và **Bảng giá**, đóng vai trò là "Trung tâm kiến thức & Cập nhật mới nhất", tạo thêm sự tin cậy trước khi người dùng ra quyết định mua gói.
5. **Khóa gói giá mặc định:** Đặt gói **Grow ($19 / 475.000đ)** làm gói nổi bật nhất ("Phổ biến nhất / Khuyên dùng") với viền gradient và badge riêng.
