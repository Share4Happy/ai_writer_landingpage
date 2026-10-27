/**
 * NT AI Writer - Quản lý và khai báo tập trung toàn bộ hình ảnh dự án
 * Thực hiện theo quy tắc "khung trước, ảnh sau":
 * Nếu file ảnh chưa tồn tại trên đĩa, trả về hàm renderPlaceholder để giữ vững bố cục layout.
 */

export const SITE_IMAGES = {
  heroDashboard: {
    src: '/src/assets/images/hero-dashboard.webp',
    width: 1200,
    height: 750,
    aspectRatio: '16/10',
    alt: 'Giao diện viết bài chuẩn SEO và Task Manager của NT AI Writer trên WordPress',
    label: 'Ảnh giao diện plugin NT AI Writer (Task Manager & Editor)',
  },
  featureKeyword: {
    src: '/src/assets/images/feature-keyword.webp',
    width: 600,
    height: 400,
    aspectRatio: '3/2',
    alt: 'Minh họa tính năng nghiên cứu và mở rộng từ khóa AI',
    label: 'Ảnh minh họa Nghiên cứu từ khóa',
  },
  featureEditor: {
    src: '/src/assets/images/feature-editor.webp',
    width: 600,
    height: 400,
    aspectRatio: '3/2',
    alt: 'Minh họa trình soạn thảo chuẩn SEO và cấu hình bài viết',
    label: 'Ảnh minh họa Trình soạn thảo chuẩn SEO',
  },
  featureAutomation: {
    src: '/src/assets/images/feature-automation.webp',
    width: 600,
    height: 400,
    aspectRatio: '3/2',
    alt: 'Minh họa cơ chế lên lịch xuất bản tự động trên WordPress',
    label: 'Ảnh minh họa Tự động hóa đăng bài theo lịch',
  },
  avatarUser1: {
    src: '/src/assets/images/avatar-user-1.webp',
    width: 80,
    height: 80,
    aspectRatio: '1/1',
    alt: 'Nguyễn Văn Hùng - Founder Blog Du Lịch',
    label: 'Avatar User 1',
  },
  avatarUser2: {
    src: '/src/assets/images/avatar-user-2.webp',
    width: 80,
    height: 80,
    aspectRatio: '1/1',
    alt: 'Trần Thị Mai - SEO Team Lead tại Digital Agency',
    label: 'Avatar User 2',
  },
  avatarUser3: {
    src: '/src/assets/images/avatar-user-3.webp',
    width: 80,
    height: 80,
    aspectRatio: '1/1',
    alt: 'Lê Hoàng Nam - Quản trị viên hệ thống 20 website',
    label: 'Avatar User 3',
  },
};

/**
 * Tạo HTML thẻ hình ảnh hoặc placeholder tương thích
 * @param {keyof typeof SITE_IMAGES} key 
 * @param {string} [extraClass='']
 * @param {boolean} [isPriority=false]
 * @returns {string}
 */
export function renderImageHtml(key, extraClass = '', isPriority = false) {
  const img = SITE_IMAGES[key];
  if (!img) return '';

  const loadingAttr = isPriority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  
  // Trả về thẻ picture/img kèm onerror tự động chuyển sang placeholder nếu file chưa có
  return `
    <div class="img-wrapper ${extraClass}" style="aspect-ratio: ${img.aspectRatio};">
      <img
        src="${img.src}"
        alt="${img.alt}"
        width="${img.width}"
        height="${img.height}"
        ${loadingAttr}
        class="responsive-img"
        onerror="this.onerror=null; this.classList.add('is-hidden'); this.nextElementSibling.classList.remove('is-hidden');"
      />
      <div class="img-placeholder is-hidden" aria-hidden="true">
        <div class="placeholder-content">
          <svg class="placeholder-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span class="placeholder-text">${img.label}</span>
          <span class="placeholder-size">${img.width}x${img.height} (${img.aspectRatio})</span>
        </div>
      </div>
    </div>
  `;
}
