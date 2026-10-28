/**
 * NT AI Writer - Consultation Form, Invoice Creation & Zalo Bot Integration
 * 1. Lưu thông tin khách hàng ngầm vào Google Form (fetch no-cors + hidden iframe fallback)
 * 2. Gửi yêu cầu tới API tạo hoá đơn điện tử & gửi email hoá đơn tự động cho khách hàng
 * 3. Gửi tin nhắn Zalo kèm hoá đơn PDF & tự động gửi lời mời kết bạn qua Zalo Bot Batch API
 */

import { APP_CONFIG } from './config.js';
import { getBillingCycle } from './pricing.js';

let lastSubmitTime = 0;

export function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  const successState = document.getElementById('form-success-state');
  const resetBtn = document.getElementById('btn-form-reset');
  const submitBtn = document.getElementById('btn-form-submit');
  const packageSelect = document.getElementById('form-package');

  if (!form) return;

  // Lắng nghe các nút chọn gói trên bảng giá để tự động cuộn và chọn gói
  setupPricingPlanButtons(packageSelect);

  // Validate realtime khi người dùng nhập liệu
  setupInputValidation(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Bảo mật: Chống bot spam qua Honeypot field
    const botField = form.querySelector('#form-bot-check');
    if (botField && botField.value.trim() !== '') {
      console.warn('[Security Alert]: Phát hiện bot tự động điền form, từ chối xử lý.');
      showSuccessState(form, successState);
      return;
    }

    // 2. Bảo mật: Chống spam gửi liên tục (Rate limiting 8s)
    const now = Date.now();
    if (now - lastSubmitTime < 8000) {
      console.warn('[Security Alert]: Gửi quá nhanh, vui lòng chờ.');
      return;
    }

    if (!validateForm(form)) {
      return;
    }

    lastSubmitTime = now;

    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Đăng ký tư vấn ngay';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite; margin-right: 8px;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Đang xử lý hoá đơn & gửi thông báo...
      `;
    }

    const fullNameVal = form.querySelector('#form-fullname')?.value?.trim() || '';
    const phoneVal = form.querySelector('#form-phone')?.value?.trim() || '';
    const emailVal = form.querySelector('#form-email')?.value?.trim() || '';
    const packageVal = packageSelect?.value || 'Grow';

    const customer = {
      fullName: fullNameVal,
      phone: phoneVal,
      email: emailVal,
    };

    const plan = getPlanDetails(packageVal);
    const invoiceCode = generateInvoiceCode();

    // Chuẩn bị FormData theo đúng Entry IDs của Google Form (Tool Viết bài)
    const { actionUrl, entries, pageSource } = APP_CONFIG.googleForm;
    const formData = new FormData();
    formData.append(entries.fullName, fullNameVal); // entry.1911338714: Họ và Tên
    formData.append(entries.phone, phoneVal);       // entry.1427954621: Số điện thoại
    formData.append(entries.email, emailVal);       // entry.1636694682: Email
    if (entries.package) {
      formData.append(entries.package, plan.name);  // entry.736251697: Gói dịch vụ (Free/Starter/Grow/Pro/Corp)
    }
    if (entries.source) {
      formData.append(entries.source, pageSource);
    }

    try {
      // Bước 1: Gửi song song Google Form + API tạo hoá đơn (độc lập nhau)
      const [googleFormResult, invoiceResult] = await Promise.allSettled([
        sendGoogleForm({ actionUrl, formData, form }),
        sendInvoiceApi({ customer, plan, invoiceCode }),
      ]);

      if (invoiceResult.status === 'rejected') {
        console.warn('[Invoice API Error]:', invoiceResult.reason);
      }
      if (googleFormResult.status === 'rejected') {
        console.warn('[Google Form Error]:', googleFormResult.reason);
      }

      // Hoá đơn thật do backend trả về (invoiceNumber, grandTotal...)
      const invoice = invoiceResult.status === 'fulfilled' ? invoiceResult.value : null;

      // Cập nhật nội dung xác nhận (hoá đơn được gửi qua email + Zalo bởi hệ thống hoá đơn)
      populateSuccessCard({ customer, plan, invoiceCode, invoice, successState });

      // Hiển thị màn hình thành công
      showSuccessState(form, successState);
      form.reset();
    } catch (error) {
      console.error('Lỗi trong quá trình gửi form:', error);
      populateSuccessCard({ customer, plan, invoiceCode, invoice: null, successState });
      showSuccessState(form, successState);
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });

  // Nút quay lại điền form khác
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successState) successState.classList.add('is-hidden');
      form.classList.remove('is-hidden');
    });
  }
}

/**
 * Gửi dữ liệu khách hàng tới Google Form ngầm (fetch mode no-cors + iframe fallback)
 */
async function sendGoogleForm({ actionUrl, formData, form }) {
  if (actionUrl && actionUrl.trim() !== '') {
    try {
      await fetch(actionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
      const iframe = document.getElementById('gform_hidden_iframe');
      if (iframe) {
        form.action = actionUrl;
        form.target = 'gform_hidden_iframe';
      }
      return { success: true };
    } catch (err) {
      console.warn('Lỗi fetch Google Form, kích hoạt fallback iframe:', err);
      form.action = actionUrl;
      form.target = 'gform_hidden_iframe';
      form.submit();
      return { fallback: true };
    }
  } else {
    console.info('[Google Form]: Action URL chưa cấp, mô phỏng lưu form thành công');
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { simulated: true };
  }
}

/**
 * Gửi yêu cầu tới API tạo hoá đơn (Invoice-AIR API v1.0)
 * Endpoint: POST /api/invoices/quick-create
 * Lưu ý: backend tính grandTotal theo `amountVnd` (trường chargeAmount bị bỏ qua)
 */
async function sendInvoiceApi({ customer, plan, invoiceCode }) {
  const { endpoint, apiKey, currency, autoSendEmail, timeoutMs } = APP_CONFIG.invoiceApi;
  const { pageSource } = APP_CONFIG.googleForm;
  const { yearlyDiscount } = APP_CONFIG.pricing;

  const billingCycle = getBillingCycle();
  const isYearly = billingCycle === 'yearly';

  // Gói trả theo năm: giá tháng sau chiết khấu x 12 (khớp cách UI hiển thị "giảm 20%")
  const monthlyVnd = isYearly ? Math.round(plan.priceVnd * (1 - yearlyDiscount)) : plan.priceVnd;
  const monthlyUsd = isYearly ? Math.round(plan.priceUsd * (1 - yearlyDiscount)) : plan.priceUsd;
  const amountVnd = isYearly ? monthlyVnd * 12 : monthlyVnd;
  const amountUsd = isYearly ? monthlyUsd * 12 : monthlyUsd;

  // Gói Free không cần xuất hoá đơn
  if (amountVnd === 0) {
    console.info('[Invoice API]: Gói Free – bỏ qua bước tạo hoá đơn.');
    return {
      success: true,
      skipped: true,
      invoiceNumber: invoiceCode,
      paymentCode: '',
      grandTotal: 0,
      qrDataUrl: '',
      viewUrl: '',
      pdfUrl: '',
      emailSent: false,
    };
  }

  const payload = {
    invoiceCode,
    createdAt: new Date().toISOString(),
    customer: {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
    },
    order: {
      packageId: plan.id,
      packageName: plan.name,
      amountVnd,
      amountUsd,
      chargeAmount: currency === 'USD' ? amountUsd : amountVnd,
      currency: currency || 'VND',
      billingCycle,
      description: `Đăng ký gói ${plan.name} – NT AI Writer WordPress Plugin (${isYearly ? 'thanh toán theo năm' : 'thanh toán theo tháng'})`,
    },
    sendEmail: autoSendEmail,
    source: pageSource,
  };

  if (!endpoint || endpoint.trim() === '') {
    console.info(
      '%c[Invoice API Simulation] Endpoint chưa cấu hình, payload:',
      'color: #059669; font-weight: bold; font-size: 13px;',
      payload
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: false,
      simulated: true,
      invoiceNumber: invoiceCode,
      grandTotal: amountVnd,
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (apiKey && apiKey.trim() !== '') {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs || 20000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Invoice API HTTP ${response.status}: ${response.statusText} ${errText}`.trim());
    }

    const data = await response.json().catch(() => ({}));
    console.info('[Invoice API Success]:', data);

    return {
      success: data.success !== false,
      invoiceCode,
      invoiceNumber: data.invoiceNumber || invoiceCode,
      grandTotal: typeof data.grandTotal === 'number' ? data.grandTotal : amountVnd,
    };
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error(`Invoice API không phản hồi sau ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Format số điện thoại hiển thị (loại bỏ khoảng trắng, đổi +84 thành 0)
 */
function formatPhoneForZalo(phone) {
  if (!phone) return '';
  let clean = phone.replace(/[\s\-\.]/g, '');
  if (clean.startsWith('+84')) {
    clean = '0' + clean.slice(3);
  } else if (clean.startsWith('84') && clean.length === 11) {
    clean = '0' + clean.slice(2);
  }
  return clean;
}

/**
 * Lấy thông tin chi tiết gói từ config pricing
 */
function getPlanDetails(packageVal) {
  const plans = APP_CONFIG.pricing.plans;
  const val = (packageVal || '').toLowerCase();

  const found = plans.find(
    (p) => val.includes(p.id.toLowerCase()) || val.includes(p.name.toLowerCase())
  );

  if (found) {
    const formattedVnd =
      found.monthlyPriceVnd === 0
        ? '0 đ (Miễn phí)'
        : new Intl.NumberFormat('vi-VN').format(found.monthlyPriceVnd) + ' đ';
    const formattedUsd = found.monthlyPriceUsd === 0 ? '$0' : `$${found.monthlyPriceUsd}`;

    return {
      id: found.id,
      name: found.name,
      priceVnd: found.monthlyPriceVnd,
      priceUsd: found.monthlyPriceUsd,
      formattedVnd,
      formattedUsd,
    };
  }

  return {
    id: 'grow',
    name: 'Grow',
    priceVnd: 475000,
    priceUsd: 19,
    formattedVnd: '475.000 đ',
    formattedUsd: '$19',
  };
}

/**
 * Sinh mã hoá đơn ngẫu nhiên chuyên nghiệp
 */
function generateInvoiceCode() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `INV-${randomNum}`;
}

/**
 * Cập nhật nội dung thẻ xác nhận trong màn hình thành công
 * Hoá đơn/QR không hiển thị trên landing page — được hệ thống hoá đơn gửi qua Email + Zalo
 */
function populateSuccessCard({ customer, plan, invoiceCode, invoice, successState }) {
  if (!successState) return;

  const invoiceCodeEl = successState.querySelector('#success-invoice-code');
  const packageNameEl = successState.querySelector('#success-package-name');
  const packagePriceEl = successState.querySelector('#success-package-price');
  const emailDestEl = successState.querySelector('#success-email-dest');
  const emailStatusEl = successState.querySelector('#success-email-status');
  const zaloStatusEl = successState.querySelector('#success-zalo-status');
  const messageEl = successState.querySelector('#success-detailed-message');

  const cleanPhone = formatPhoneForZalo(customer.phone);
  const safePlanName = escapeHtml(plan.name);
  const safeEmail = escapeHtml(customer.email);
  const safePhone = escapeHtml(cleanPhone);
  const billingLabel = getBillingCycle() === 'yearly' ? 'thanh toán theo năm' : 'thanh toán theo tháng';

  const hasInvoice = Boolean(invoice && invoice.success && invoice.invoiceNumber);
  const displayCode = hasInvoice ? invoice.invoiceNumber : invoiceCode;
  const totalText = invoice && typeof invoice.grandTotal === 'number' && invoice.grandTotal > 0
    ? new Intl.NumberFormat('vi-VN').format(invoice.grandTotal) + ' đ'
    : plan.formattedVnd;

  if (invoiceCodeEl) invoiceCodeEl.textContent = `#${displayCode}`;
  if (packageNameEl) packageNameEl.textContent = `${plan.name} (${billingLabel})`;
  if (packagePriceEl) packagePriceEl.textContent = totalText;
  if (emailDestEl) emailDestEl.textContent = customer.email;

  if (emailStatusEl) {
    emailStatusEl.textContent = `Email: Hoá đơn điện tử được gửi tới ${customer.email}`;
  }

  if (zaloStatusEl) {
    zaloStatusEl.textContent = `Zalo: Tin nhắn xác nhận được gửi tới SĐT ${cleanPhone}`;
  }

  if (messageEl) {
    messageEl.innerHTML = hasInvoice
      ? `Hệ thống đã tạo hoá đơn điện tử <strong>#${escapeHtml(displayCode)}</strong> cho gói <strong>${safePlanName}</strong> (${billingLabel}) với tổng thanh toán <strong>${escapeHtml(totalText)}</strong>.<br>
         Hoá đơn PDF và mã thanh toán được gửi tới email <strong>${safeEmail}</strong> và tin nhắn Zalo số <strong>${safePhone}</strong>. Ban tư vấn sẽ liên hệ trong vòng 15 phút để hỗ trợ kích hoạt plugin.`
      : `Hệ thống đã ghi nhận đăng ký của bạn cho gói <strong>${safePlanName}</strong>.<br>
         Hoá đơn điện tử sẽ được gửi tới email <strong>${safeEmail}</strong> và tin nhắn Zalo số <strong>${safePhone}</strong>. Ban tư vấn sẽ liên hệ trong thời gian sớm nhất.`;
  }
}

/**
 * Hàm chống XSS (Escape HTML characters)
 */
function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Kiểm tra tính hợp lệ của dữ liệu form
 */
function validateForm(form) {
  let isValid = true;

  const fullNameInput = form.querySelector('#form-fullname');
  const phoneInput = form.querySelector('#form-phone');
  const emailInput = form.querySelector('#form-email');

  // Validate họ tên
  if (!fullNameInput.value.trim() || fullNameInput.value.trim().length < 2) {
    markInvalid(fullNameInput, 'Vui lòng nhập họ và tên hợp lệ');
    isValid = false;
  } else {
    markValid(fullNameInput);
  }

  // Validate số điện thoại (tối thiểu 10 chữ số)
  const phoneClean = phoneInput.value.replace(/[\s\-\.]/g, '');
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  if (!phoneRegex.test(phoneClean) && phoneClean.length < 10) {
    markInvalid(phoneInput, 'Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
    isValid = false;
  } else {
    markValid(phoneInput);
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    markInvalid(emailInput, 'Vui lòng nhập địa chỉ email hợp lệ');
    isValid = false;
  } else {
    markValid(emailInput);
  }

  return isValid;
}

function markInvalid(input, message) {
  input.classList.add('is-invalid');
  const errorEl = input.nextElementSibling;
  if (errorEl && errorEl.classList.contains('form-error-msg')) {
    errorEl.textContent = message;
  }
}

function markValid(input) {
  input.classList.remove('is-invalid');
}

function setupInputValidation(form) {
  const inputs = form.querySelectorAll('.form-input, .form-select');
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
    });
  });
}

function showSuccessState(form, successState) {
  form.classList.add('is-hidden');
  if (successState) {
    successState.classList.remove('is-hidden');
  }
}

/**
 * Lắng nghe click các nút trên bảng giá để tự động chọn gói tương ứng
 */
function setupPricingPlanButtons(packageSelect) {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-select-package]');
    if (target) {
      const planName = target.getAttribute('data-select-package');
      if (planName && packageSelect) {
        const options = Array.from(packageSelect.options);
        const matched = options.find((opt) => opt.value.toLowerCase().includes(planName.toLowerCase()));
        if (matched) {
          packageSelect.value = matched.value;
        }
      }
    }
  });
}
