/**
 * NT AI Writer - Cấu hình tập trung toàn bộ ứng dụng
 */

export const APP_CONFIG = {
  siteName: 'NT AI Writer',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://share4happy.github.io/tool_ai_writer',
  basePath: import.meta.env.VITE_BASE_PATH || '/',
  
  // Cấu hình WordPress REST API lấy bài viết động
  wpApi: {
    endpoint: import.meta.env.VITE_WP_API_URL || 'https://share4happy.com/wp-json/wp/v2/posts',
    categoryId: Number(import.meta.env.VITE_WP_CATEGORY_ID) || 208,
    perPage: Number(import.meta.env.VITE_WP_POSTS_COUNT) || 5,
    embed: true,
  },

  // Cấu hình Google Form (Từ form: Tool Viết bài)
  googleForm: {
    // Action URL chính thức của Google Form
    actionUrl: import.meta.env.VITE_GOOGLE_FORM_ACTION_URL || 'https://docs.google.com/forms/d/e/1FAIpQLSfU8mUDgnxzP6xs50LBUCgVbeR9o0D6evM3sQwZyXCYQzyM9Q/formResponse',
    entries: {
      fullName: 'entry.1911338714', // Họ và Tên
      phone: 'entry.1427954621',    // Số điện thoại
      email: 'entry.1636694682',    // Email
      package: 'entry.736251697',   // Gói dịch vụ muốn sử dụng (Free, Starter, Grow, Pro, Corp)
    },
    pageSource: 'Landing Page NT AI Writer',
  },

  // Cấu hình API Tạo Hoá Đơn & Gửi Email
  invoiceApi: {
    // Endpoint API tạo hoá đơn (điền URL tại đây hoặc qua biến môi trường VITE_INVOICE_API_URL)
    endpoint: import.meta.env.VITE_INVOICE_API_URL || '',
    // API Key / Bearer Token xác thực nếu có
    apiKey: import.meta.env.VITE_INVOICE_API_KEY || '',
    currency: 'VND',
    autoSendEmail: true,
  },

  // Cấu hình Zalo Bot API (Gửi tin nhắn & kết bạn tự động)
  zaloBotApi: {
    // URL gateway (ví dụ: https://sms-service.talab.io.vn/api/gateway/v1.0 hoặc proxy)
    baseUrl: import.meta.env.VITE_ZALO_API_BASE_URL || 'https://sms-service.talab.io.vn/api/gateway/v1.0',
    botId: import.meta.env.VITE_ZALO_BOT_ID || '',
    apiKey: import.meta.env.VITE_ZALO_API_KEY || '',
    mode: 'safe',
    autoFriendRequest: true,
    aliasPrefix: 'KH_NTAI_',
  },

  // Carousel settings
  carousel: {
    durationSeconds: 45, // Thời gian 1 vòng trôi marquee
    pauseOnHover: true,
    pauseOnFocus: true,
  },

  // Giá các gói dịch vụ
  pricing: {
    yearlyDiscount: 0.2, // Giảm giá 20% khi thanh toán theo năm
    plans: [
      {
        id: 'free',
        name: 'Free',
        monthlyPriceUsd: 0,
        monthlyPriceVnd: 0,
        badge: 'Trải nghiệm',
        highlight: false,
        description: 'Dành cho cá nhân muốn làm quen và thử nghiệm sức mạnh của AI trong WordPress.',
        features: [
          '5 bài viết chuẩn SEO / tháng',
          'Gợi ý từ khóa cơ bản',
          'Sinh tiêu đề tự động',
          'Hỗ trợ cộng đồng',
        ],
        buttonText: 'Bắt đầu miễn phí',
        buttonLink: '#pricing',
      },
      {
        id: 'starter',
        name: 'Starter',
        monthlyPriceUsd: 9,
        monthlyPriceVnd: 225000,
        badge: 'Cá nhân',
        highlight: false,
        description: 'Tối ưu cho blogger và trang web vệ tinh nhỏ cần đều đặn nội dung chất lượng.',
        features: [
          '30 bài viết chuẩn SEO / tháng',
          'Nghiên cứu từ khóa nâng cao',
          'Tự động chèn liên kết nội bộ',
          'Tự động tạo ảnh đại diện AI',
          'Hỗ trợ qua email trong 24h',
        ],
        buttonText: 'Chọn gói Starter',
        buttonLink: '#pricing',
      },
      {
        id: 'grow',
        name: 'Grow',
        monthlyPriceUsd: 19,
        monthlyPriceVnd: 475000,
        badge: 'Phổ biến nhất ✨',
        highlight: true,
        description: 'Lựa chọn hàng đầu cho website kinh doanh, shop bán hàng và affiliate marketing.',
        features: [
          '80 bài viết chuẩn SEO / tháng',
          'Lên lịch đăng bài tự động ngầm',
          'Tự động chèn link ngoài uy tín',
          'Quản lý Task Manager & thống kê',
          'Tương thích Yoast & Rank Math',
          'Hỗ trợ ưu tiên qua Zalo/Email',
        ],
        buttonText: 'Chọn gói Grow',
        buttonLink: '#pricing',
      },
      {
        id: 'pro',
        name: 'Pro',
        monthlyPriceUsd: 29,
        monthlyPriceVnd: 725000,
        badge: 'Chuyên nghiệp',
        highlight: false,
        description: 'Dành cho đội ngũ phát triển nội dung chuyên sâu và các website tin tức, blog lớn.',
        features: [
          '180 bài viết chuẩn SEO / tháng',
          'Đa ngôn ngữ (Anh, Việt, Pháp...)',
          'Tùy chỉnh văn phong nâng cao',
          'Hàng chờ tác vụ không giới hạn',
          'Duyệt dàn ý hàng loạt',
          'Hỗ trợ kỹ thuật 1-1 chuyên sâu',
        ],
        buttonText: 'Chọn gói Pro',
        buttonLink: '#pricing',
      },
      {
        id: 'corp',
        name: 'Corp',
        monthlyPriceUsd: 49,
        monthlyPriceVnd: 1225000,
        badge: 'Doanh nghiệp / Agency',
        highlight: false,
        description: 'Giải pháp toàn diện cho Agency SEO và hệ thống PBN / đa website quy mô lớn.',
        features: [
          'Không giới hạn website WordPress',
          '400 bài viết chuẩn SEO / tháng',
          'Tích hợp API key AI tùy chỉnh',
          'Báo cáo hiệu suất tác giả chi tiết',
          'Backup & Đồng bộ tự động',
          'Dedicated Account Manager 24/7',
        ],
        buttonText: 'Chọn gói Corp',
        buttonLink: '#pricing',
      },
    ],
  },
};
