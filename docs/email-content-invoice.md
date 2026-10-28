# Nội dung Email Gửi Hoá Đơn - NT AI Writer

## Subject / Tiêu đề Email:
```
✅ Đăng ký thành công gói {{PACKAGE_NAME}} - Hoá đơn #{{INVOICE_NUMBER}}
```

---

## Nội dung Email (Plain Text):

```
Kính gửi Anh/Chị {{CUSTOMER_NAME}},

Cảm ơn bạn đã đăng ký gói {{PACKAGE_NAME}} của NT AI Writer!

THÔNG TIN ĐƠN HÀNG:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Số hoá đơn: #{{INVOICE_NUMBER}}
• Mã thanh toán: {{PAYMENT_CODE}}
• Gói dịch vụ: {{PACKAGE_NAME}}
• Chu kỳ: {{BILLING_CYCLE}}
• Tổng thanh toán: {{GRAND_TOTAL}} đ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THÔNG TIN THANH TOÁN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ngân hàng: TPBank
Số tài khoản: 00006322633
Chủ tài khoản: NGUYEN VAN A
Số tiền: {{GRAND_TOTAL}} đ
Nội dung CK: {{PAYMENT_CODE}} - {{PACKAGE_NAME}}

👉 Quét QR Code đính kèm để thanh toán nhanh chóng!
👉 Xem hoá đơn chi tiết: {{VIEW_URL}}

CÁC BƯỚC TIẾP THEO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Thanh toán hoá đơn qua QR Code hoặc chuyển khoản
2️⃣ Đội tư vấn sẽ liên hệ bạn qua Zalo/SĐT trong 15 phút
3️⃣ Kỹ thuật viên hỗ trợ cài đặt plugin 1-1
4️⃣ Bắt đầu viết bài SEO tự động ngay!

BẠN SẼ ĐƯỢC TRẢI NGHIỆM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Nghiên cứu từ khóa thông minh
✓ Tạo tiêu đề hàng loạt tự động
✓ Viết bài chuẩn SEO bằng AI
✓ Tự động chèn link nội bộ & hình ảnh
✓ Lên lịch đăng bài tự động
✓ Task Manager theo dõi tiến độ

HỖ TRỢ 24/7:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 Hotline/Zalo: 0812 305 046
✉️ Email: support@ntaiwriter.com
🌐 Website: https://aiwriter.ntcore.io.vn

Chúc bạn có trải nghiệm tuyệt vời với NT AI Writer! 🚀

Trân trọng,
Đội ngũ NT AI Writer

---
© 2026 NT AI Writer - Plugin viết bài chuẩn SEO bằng AI cho WordPress
Bạn nhận được email này vì đã đăng ký dịch vụ tại aiwriter.ntcore.io.vn
```

---

## Variables cần thay thế:

```javascript
{
  CUSTOMER_NAME: "Tên khách hàng",
  INVOICE_NUMBER: "HD-000017",
  PAYMENT_CODE: "UVFPLP",
  PACKAGE_NAME: "Grow",
  BILLING_CYCLE: "Thanh toán theo tháng / Thanh toán theo năm",
  GRAND_TOTAL: "475.000",
  VIEW_URL: "https://invoice.share4happy.com/view/xxx",
  QR_URL: "https://qr.sepay.vn/img?bank=TPBank&acc=...",
  PDF_URL: "https://invoice-backend.../pdf"
}
```

---

## Attachments / Đính kèm:
1. ✅ **Hoá đơn PDF**: invoice-{{INVOICE_NUMBER}}.pdf
2. ✅ **QR Code thanh toán**: qr-payment-{{PAYMENT_CODE}}.png

---

## Email HTML Version (Responsive):

Sử dụng template đã tạo tại: `docs/email-template-welcome.html`

---

## Ghi chú cho Backend Dev:

1. **Gửi ngay sau khi tạo hoá đơn thành công**
2. **Đính kèm PDF và QR code** (inline hoặc attachment)
3. **CC/BCC**: sales@ntaiwriter.com (để team theo dõi)
4. **Reply-To**: support@ntaiwriter.com
5. **From**: "NT AI Writer" <noreply@ntaiwriter.com>
6. **Priority**: High (để nổi bật trong inbox)

---

## Test Email:
- ✅ Đã test với: phatdinh.240904@gmail.com
- ✅ Đã test với: 0988726204 (Zalo)
