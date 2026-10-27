import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/sections/header.css';
import '../styles/sections/hero.css';
import '../styles/sections/problem.css';
import '../styles/sections/features.css';
import '../styles/sections/steps.css';
import '../styles/sections/why-us.css';
import '../styles/sections/stats.css';
import '../styles/sections/pricing.css';
import '../styles/sections/consultation.css';
import '../styles/sections/faq.css';
import '../styles/sections/cta-banner.css';
import '../styles/sections/footer.css';

import { initNavigation } from './menu.js';
import { initPricing } from './pricing.js';
import { initFaqAccordion } from './faq.js';
import { initConsultationForm } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  // Khởi chạy thanh điều hướng & mobile menu
  initNavigation();

  // Khởi chạy bảng giá tương tác
  initPricing();

  // Khởi chạy form đăng ký tư vấn kết nối Google Form
  initConsultationForm();

  // Khởi chạy Accordion FAQ
  initFaqAccordion();

  // Khởi tạo ngày hiện tại cho footer copyright
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
