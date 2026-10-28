/**
 * NT AI Writer - Pricing Toggle & Dynamic Render
 */

import { APP_CONFIG } from './config.js';

// Chu kỳ thanh toán đang được chọn trên bảng giá ('monthly' | 'yearly')
let currentBillingCycle = 'monthly';

export function getBillingCycle() {
  return currentBillingCycle;
}

export function initPricing() {
  const toggleMonthly = document.getElementById('billing-monthly');
  const toggleYearly = document.getElementById('billing-yearly');
  const pricingCardsContainer = document.getElementById('pricing-grid');

  if (!pricingCardsContainer) return;

  let isYearly = false;

  function renderPricingCards() {
    const { plans, yearlyDiscount } = APP_CONFIG.pricing;

    // Đồng bộ chu kỳ hiện tại để form tạo hoá đơn dùng đúng giá
    currentBillingCycle = isYearly ? 'yearly' : 'monthly';

    pricingCardsContainer.innerHTML = plans.map((plan) => {
      const isFree = plan.monthlyPriceUsd === 0;
      
      // Tính giá dựa trên chu kỳ thanh toán
      let priceVnd = plan.monthlyPriceVnd;
      let priceUsd = plan.monthlyPriceUsd;

      if (isYearly && !isFree) {
        priceVnd = Math.round(plan.monthlyPriceVnd * (1 - yearlyDiscount));
        priceUsd = Math.round(plan.monthlyPriceUsd * (1 - yearlyDiscount));
      }

      const formattedVnd = isFree ? '0 đ' : new Intl.NumberFormat('vi-VN').format(priceVnd) + ' đ';
      const formattedUsd = isFree ? '$0' : `$${priceUsd}`;
      const periodLabel = isFree ? 'vĩnh viễn' : '/ tháng';
      const billingNote = isYearly && !isFree ? '(Thanh toán theo năm)' : '';

      return `
        <div class="pricing-card ${plan.highlight ? 'is-featured' : ''}" data-plan="${plan.id}">
          ${plan.highlight ? `<div class="pricing-badge-popular">${plan.badge}</div>` : `<div class="pricing-badge-normal">${plan.badge}</div>`}
          
          <div class="pricing-header">
            <h3 class="pricing-name">${plan.name}</h3>
            <p class="pricing-desc">${plan.description}</p>
          </div>

          <div class="pricing-cost">
            <div class="pricing-amount-main">
              <span class="price-val">${formattedVnd}</span>
              <span class="price-period">${periodLabel}</span>
            </div>
            <div class="pricing-amount-sub">
              <span class="price-usd">${formattedUsd}</span> ${billingNote}
            </div>
          </div>

          <a href="#dang-ky" data-select-package="${plan.id}" class="btn ${plan.highlight ? 'btn-primary' : 'btn-outline'} btn-block pricing-btn">
            ${plan.buttonText}
          </a>

          <div class="pricing-divider"></div>

          <div class="pricing-features">
            <span class="pricing-features-title">Bao gồm:</span>
            <ul class="pricing-features-list">
              ${plan.features.map(f => `
                <li>
                  <svg class="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    }).join('');
  }

  // Khởi chạy render lần đầu
  renderPricingCards();

  if (toggleMonthly && toggleYearly) {
    toggleMonthly.addEventListener('click', () => {
      if (!isYearly) return;
      isYearly = false;
      toggleMonthly.classList.add('is-active');
      toggleYearly.classList.remove('is-active');
      toggleMonthly.setAttribute('aria-pressed', 'true');
      toggleYearly.setAttribute('aria-pressed', 'false');
      renderPricingCards();
    });

    toggleYearly.addEventListener('click', () => {
      if (isYearly) return;
      isYearly = true;
      toggleYearly.classList.add('is-active');
      toggleMonthly.classList.remove('is-active');
      toggleYearly.setAttribute('aria-pressed', 'true');
      toggleMonthly.setAttribute('aria-pressed', 'false');
      renderPricingCards();
    });
  }
}
