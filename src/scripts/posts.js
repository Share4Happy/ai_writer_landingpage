/**
 * NT AI Writer - WordPress REST API Posts Fetcher & Infinite Marquee Carousel
 * Lấy 5 bài viết mới nhất từ chuyên mục 208 và hiển thị trôi chậm mượt mà
 */

import { APP_CONFIG } from './config.js';

/**
 * Giải mã HTML entities và loại bỏ các thẻ HTML nguy hiểm
 * @param {string} rawHtml 
 * @returns {string}
 */
export function sanitizeAndDecode(rawHtml) {
  if (!rawHtml) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Định dạng ngày theo chuẩn Việt Nam (DD/MM/YYYY)
 * @param {string} isoDate 
 * @returns {string}
 */
export function formatDate(isoDate) {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoDate.split('T')[0] || '';
  }
}

/**
 * Lấy dữ liệu bài viết từ WordPress REST API
 * @returns {Promise<Array<{id: number, title: string, excerpt: string, url: string, imageUrl: string, imageAlt: string, date: string, categoryName: string}>>}
 */
export async function fetchWpPosts() {
  const { endpoint, categoryId, perPage, embed } = APP_CONFIG.wpApi;
  const url = `${endpoint}?categories=${categoryId}&per_page=${perPage}${embed ? '&_embed=1' : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Lỗi tải dữ liệu WordPress API: HTTP ${response.status}`);
  }

  const posts = await response.json();
  if (!Array.isArray(posts)) {
    throw new Error('Dữ liệu API không đúng định dạng mảng bài viết');
  }

  return posts.map((post) => {
    const titleClean = sanitizeAndDecode(post.title?.rendered || 'Bài viết không có tiêu đề');
    let excerptClean = sanitizeAndDecode(post.excerpt?.rendered || '');
    if (excerptClean.length > 110) {
      excerptClean = excerptClean.slice(0, 107).trim() + '...';
    }

    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const category = post._embedded?.['wp:term']?.[0]?.[0];

    const imageUrl = featuredMedia?.source_url || '';
    const imageAlt = featuredMedia?.alt_text?.trim() || titleClean;
    const categoryName = category?.name || 'Kiến thức SEO';

    return {
      id: post.id,
      title: titleClean,
      excerpt: excerptClean,
      url: post.link || '#',
      imageUrl,
      imageAlt,
      date: formatDate(post.date),
      categoryName,
    };
  });
}

/**
 * Render thẻ bài viết
 * @param {Object} post 
 * @param {boolean} isClone 
 * @returns {HTMLElement}
 */
function createPostCardElement(post, isClone = false) {
  const card = document.createElement('article');
  card.className = 'carousel-card';
  if (isClone) {
    card.setAttribute('aria-hidden', 'true');
    card.setAttribute('tabindex', '-1');
  }

  // Anchor link
  const link = document.createElement('a');
  link.href = post.url;
  link.className = 'carousel-card-link';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', post.title);
  if (isClone) {
    link.setAttribute('tabindex', '-1');
  }

  // Image container
  const imgBox = document.createElement('div');
  imgBox.className = 'carousel-card-media';

  if (post.imageUrl) {
    const img = document.createElement('img');
    img.src = post.imageUrl;
    img.alt = post.imageAlt;
    img.loading = 'lazy';
    img.width = 400;
    img.height = 250;
    img.className = 'carousel-card-img';
    img.onerror = () => {
      img.classList.add('is-hidden');
      const placeholder = document.createElement('div');
      placeholder.className = 'img-placeholder';
      placeholder.textContent = 'Hình ảnh bài viết';
      imgBox.appendChild(placeholder);
    };
    imgBox.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'img-placeholder';
    placeholder.textContent = 'Hình ảnh bài viết';
    imgBox.appendChild(placeholder);
  }

  // Content
  const body = document.createElement('div');
  body.className = 'carousel-card-body';

  const meta = document.createElement('div');
  meta.className = 'carousel-card-meta';

  const badge = document.createElement('span');
  badge.className = 'carousel-card-tag';
  badge.textContent = post.categoryName;

  const dateSpan = document.createElement('time');
  dateSpan.className = 'carousel-card-date';
  dateSpan.textContent = post.date;

  meta.appendChild(badge);
  meta.appendChild(dateSpan);

  const title = document.createElement('h3');
  title.className = 'carousel-card-title';
  title.textContent = post.title;

  const desc = document.createElement('p');
  desc.className = 'carousel-card-desc';
  desc.textContent = post.excerpt;

  const readMore = document.createElement('span');
  readMore.className = 'carousel-card-action';
  readMore.innerHTML = `Đọc tiếp <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

  body.appendChild(meta);
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(readMore);

  link.appendChild(imgBox);
  link.appendChild(body);
  card.appendChild(link);

  return card;
}

/**
 * Khởi tạo Carousel bài viết WordPress
 */
export async function initWpCarousel() {
  const container = document.getElementById('wp-carousel-container');
  if (!container) return;

  // Hiển thị skeleton loading
  renderSkeleton(container);

  try {
    const posts = await fetchWpPosts();

    if (!posts || posts.length === 0) {
      container.innerHTML = `
        <div class="carousel-empty">
          <p>Hiện chưa có bài viết mới. Vui lòng quay lại sau!</p>
        </div>
      `;
      return;
    }

    // Xóa skeleton
    container.innerHTML = '';

    // Tạo track marquee
    const marqueeTrack = document.createElement('div');
    marqueeTrack.className = 'carousel-marquee-track';
    marqueeTrack.id = 'carousel-marquee-track';

    // Tạo track 1 (chính thức)
    const set1 = document.createElement('div');
    set1.className = 'carousel-card-group';
    posts.forEach((post) => {
      set1.appendChild(createPostCardElement(post, false));
    });

    // Tạo track 2 (bản sao aria-hidden cho vòng lặp vô tận)
    const set2 = document.createElement('div');
    set2.className = 'carousel-card-group';
    set2.setAttribute('aria-hidden', 'true');
    posts.forEach((post) => {
      set2.appendChild(createPostCardElement(post, true));
    });

    marqueeTrack.appendChild(set1);
    marqueeTrack.appendChild(set2);
    container.appendChild(marqueeTrack);

    // Xử lý nút Tạm dừng / Tiếp tục (WCAG 2.2.2)
    setupCarouselControls(container, marqueeTrack);

    // Hỗ trợ touch swipe trên mobile
    setupTouchControls(marqueeTrack);

  } catch (error) {
    console.error('Lỗi khi nạp WordPress posts:', error);
    container.innerHTML = `
      <div class="carousel-error">
        <p>Không thể kết nối đến nguồn bài viết vào lúc này.</p>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-retry-posts">Thử lại</button>
      </div>
    `;
    const retryBtn = document.getElementById('btn-retry-posts');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => initWpCarousel());
    }
  }
}

/**
 * Hiển thị skeleton loading
 * @param {HTMLElement} container 
 */
function renderSkeleton(container) {
  container.innerHTML = `
    <div class="carousel-skeleton-row" aria-busy="true" aria-label="Đang tải danh sách bài viết">
      ${Array.from({ length: 4 }).map(() => `
        <div class="carousel-skeleton-card">
          <div class="skeleton-media"></div>
          <div class="skeleton-body">
            <div class="skeleton-line skeleton-meta"></div>
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-title short"></div>
            <div class="skeleton-line skeleton-desc"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Điều khiển Pause / Play cho Carousel
 * @param {HTMLElement} container 
 * @param {HTMLElement} track 
 */
function setupCarouselControls(container, track) {
  const toggleBtn = document.getElementById('btn-carousel-toggle');
  if (!toggleBtn) return;

  let isPaused = false;

  toggleBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
      track.classList.add('is-paused');
      toggleBtn.setAttribute('aria-label', 'Tiếp tục trôi bài viết');
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span>Phát</span>
      `;
    } else {
      track.classList.remove('is-paused');
      toggleBtn.setAttribute('aria-label', 'Tạm dừng trôi bài viết');
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        <span>Tạm dừng</span>
      `;
    }
  });
}

/**
 * Touch gesture cho mobile
 * @param {HTMLElement} track 
 */
function setupTouchControls(track) {
  let touchStartX = 0;
  let currentScrollX = 0;

  track.addEventListener('touchstart', (e) => {
    track.classList.add('is-paused');
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    track.classList.remove('is-paused');
  }, { passive: true });
}
