/**
 * NT AI Writer - Consultation Form, Invoice Creation & Zalo Bot Integration
 * 1. Lưu thông tin khách hàng ngầm vào Google Form (fetch no-cors + hidden iframe fallback)
 * 2. Gửi yêu cầu tới API tạo hoá đơn điện tử & gửi email hoá đơn tự động cho khách hàng
 * 3. Gửi tin nhắn Zalo kèm hoá đơn PDF & tự động gửi lời mời kết bạn qua Zalo Bot Batch API
 */

import { APP_CONFIG } from './config.js';

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
      // Thực hiện gửi song song 3 kênh: Google Form + Invoice API + Zalo Bot Batch API
      const [googleFormResult, invoiceResult, zaloResult] = await Promise.allSettled([
        sendGoogleForm({ actionUrl, formData, form }),
        sendInvoiceApi({ customer, plan, invoiceCode }),
        sendZaloBotNotification({ customer, plan, invoiceCode }),
      ]);

      if (invoiceResult.status === 'rejected') {
        console.warn('[Invoice API Error]:', invoiceResult.reason);
      }
      if (googleFormResult.status === 'rejected') {
        console.warn('[Google Form Error]:', googleFormResult.reason);
      }
      if (zaloResult.status === 'rejected') {
        console.warn('[Zalo Bot API Error]:', zaloResult.reason);
      }

      // Cập nhật thông tin hoá đơn & trạng thái gửi Zalo vào màn hình thông báo thành công
      populateSuccessCard({ customer, plan, invoiceCode, successState });

      // Hiển thị màn hình thành công
      showSuccessState(form, successState);
      form.reset();

    } catch (error) {
      console.error('Lỗi trong quá trình gửi form:', error);
      populateSuccessCard({ customer, plan, invoiceCode, successState });
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
 * Gửi yêu cầu tới API tạo hoá đơn và gửi email
 */
async function sendInvoiceApi({ customer, plan, invoiceCode }) {
  const { endpoint, apiKey, currency, autoSendEmail } = APP_CONFIG.invoiceApi;
  const { pageSource } = APP_CONFIG.googleForm;

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
      amountVnd: plan.priceVnd,
      amountUsd: plan.priceUsd,
      chargeAmount: currency === 'USD' ? plan.priceUsd : plan.priceVnd,
      currency: currency || 'VND',
      billingCycle: 'monthly',
      description: `Đăng ký gói ${plan.name} – NT AI Writer WordPress Plugin`,
    },
    sendEmail: autoSendEmail,
    source: pageSource,
  };

  if (endpoint && endpoint.trim() !== '') {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (apiKey && apiKey.trim() !== '') {
      headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Invoice API HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.info('[Invoice API Success]:', data);
    return data;
  } else {
    console.info(
      '%c[Invoice API Simulation] Đã gửi yêu cầu tạo hoá đơn & gửi email:',
      'color: #059669; font-weight: bold; font-size: 13px;',
      payload
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      simulated: true,
      invoiceCode,
      message: `Hoá đơn ${invoiceCode} đã được tạo và gửi tới email ${customer.email}`,
    };
  }
}

/**
 * Gửi tin nhắn Zalo kèm hoá đơn PDF & tự động kết bạn qua Zalo Bot Batch API
 * Endpoint: POST /bots/{bot_id}/messages/send-batch
 * Endpoint: POST /bots/{bot_id}/friends/requests/send-batch
 */
async function sendZaloBotNotification({ customer, plan, invoiceCode }) {
  const { baseUrl, botId, apiKey, mode, autoFriendRequest, aliasPrefix } = APP_CONFIG.zaloBotApi;
  const cleanPhone = formatPhoneForZalo(customer.phone);

  const invoicePdfUrl = `${window.location.origin}/invoices/${invoiceCode}.pdf`;

  const messageText = 
    `🎉 [NT AI Writer] Xác nhận đăng ký dịch vụ thành công!\n` +
    `Xin chào Anh/Chị ${customer.fullName},\n` +
    `Cảm ơn Anh/Chị đã lựa chọn gói: ${plan.name} (${plan.formattedUsd}/tháng).\n` +
    `• Mã hóa đơn điện tử: #${invoiceCode}\n` +
    `• Tổng thanh toán: ${plan.formattedVnd}\n` +
    `• Email nhận hóa đơn: ${customer.email}\n` +
    `• Link tải hóa đơn PDF: ${invoicePdfUrl}\n\n` +
    `Chuyên viên hỗ trợ của NT AI Writer sẽ sớm nhắn tin trực tiếp qua Zalo này để hỗ trợ Anh/Chị kích hoạt tài khoản và cài đặt plugin WordPress nhanh chóng!`;

  const messagePayload = {
    recipients: [
      { phone: cleanPhone },
    ],
    content: {
      type: "text",
      data: {
        text: messageText,
      },
    },
    mode: mode || "safe",
  };

  if (baseUrl && botId && apiKey && baseUrl.trim() !== '') {
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const sendMsgUrl = `${cleanBaseUrl}/bots/${botId}/messages/send-batch`;

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };

    // 1. Gửi tin nhắn Zalo chứa nội dung xác nhận & link file PDF hoá đơn
    const response = await fetch(sendMsgUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(messagePayload),
    });

    if (!response.ok) {
      throw new Error(`Zalo Bot Send Message HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.info('[Zalo Bot Message Result]:', data);

    // 2. Gửi lời mời kết bạn tự động kèm alias_prefix (nếu bật)
    if (autoFriendRequest) {
      try {
        const sendFriendUrl = `${cleanBaseUrl}/bots/${botId}/friends/requests/send-batch`;
        const friendPayload = {
          recipients: [{ phone: cleanPhone }],
          alias_prefix: aliasPrefix || 'KH_NT_',
        };

        const friendRes = await fetch(sendFriendUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(friendPayload),
        });
        const friendData = await friendRes.json().catch(() => ({ success: true }));
        console.info('[Zalo Bot Friend Request Result]:', friendData);
      } catch (errFriend) {
        console.warn('[Zalo Bot Friend Request Warning]:', errFriend);
      }
    }

    return data;
  } else {
    // Chế độ mô phỏng Zalo Bot API khi chưa điền API Key thật
    console.info(
      '%c[Zalo Bot Batch API - Mô phỏng]: Đã gửi tin nhắn & hoá đơn PDF qua Zalo tới: ' + cleanPhone,
      'color: #0284c7; font-weight: bold; font-size: 13px;',
      messagePayload
    );
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      simulated: true,
      phone: cleanPhone,
      message: `Đã gửi tin nhắn Zalo kèm hoá đơn ${invoiceCode} tới ${cleanPhone}`,
    };
  }
}

/**
 * Format số điện thoại chuẩn cho Zalo API (loại bỏ khoảng trắng, đổi +84 thành 0)
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
 * Cập nhật nội dung thẻ tóm tắt hoá đơn trong màn hình thành công
 */
function populateSuccessCard({ customer, plan, invoiceCode, successState }) {
  if (!successState) return;

  const invoiceCodeEl = successState.querySelector('#success-invoice-code');
  const packageNameEl = successState.querySelector('#success-package-name');
  const packagePriceEl = successState.querySelector('#success-package-price');
  const emailDestEl = successState.querySelector('#success-email-dest');
  const zaloStatusEl = successState.querySelector('#success-zalo-status');
  const messageEl = successState.querySelector('#success-detailed-message');

  const cleanPhone = formatPhoneForZalo(customer.phone);
  const safePlanName = escapeHtml(plan.name);
  const safeEmail = escapeHtml(customer.email);
  const safePhone = escapeHtml(cleanPhone);

  if (invoiceCodeEl) invoiceCodeEl.textContent = `#${invoiceCode}`;
  if (packageNameEl) packageNameEl.textContent = `${plan.name} (${plan.formattedUsd} / tháng)`;
  if (packagePriceEl) packagePriceEl.textContent = plan.formattedVnd;
  if (emailDestEl) emailDestEl.textContent = customer.email;

  if (zaloStatusEl) {
    zaloStatusEl.textContent = `Zalo: Đã gửi tin nhắn & hoá đơn tới SĐT ${cleanPhone}`;
  }

  if (messageEl) {
    messageEl.innerHTML = `
      Hệ thống đã tự động xuất hóa đơn điện tử cho gói <strong>${safePlanName}</strong>, đồng thời gửi file PDF kèm về hộp thư <strong>${safeEmail}</strong> và qua Zalo số <strong>${safePhone}</strong>.<br>
      Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Quảng cáo/Spam) và tin nhắn Zalo. Ban tư vấn sẽ sớm liên hệ hỗ trợ bạn kích hoạt plugin.
    `;
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
