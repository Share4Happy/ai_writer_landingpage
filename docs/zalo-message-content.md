# Nội dung Tin Nhắn Zalo - NT AI Writer

## Message 1: Xác nhận đăng ký + Hoá đơn

```
🎉 Chào {{CUSTOMER_NAME}}!

Cảm ơn bạn đã đăng ký gói {{PACKAGE_NAME}} - NT AI Writer!

📋 THÔNG TIN ĐƠN HÀNG
━━━━━━━━━━━━━━━━━━━━━
• Hoá đơn: #{{INVOICE_NUMBER}}
• Mã thanh toán: {{PAYMENT_CODE}}
• Gói: {{PACKAGE_NAME}} ({{BILLING_CYCLE}})
• Tổng: {{GRAND_TOTAL}} đ

💳 THANH TOÁN QUA QR CODE
━━━━━━━━━━━━━━━━━━━━━
[Gửi ảnh QR Code]

Hoặc chuyển khoản:
🏦 TPBank - 00006322633
💬 Nội dung: {{PAYMENT_CODE}} - {{PACKAGE_NAME}}

📧 Hoá đơn PDF đã gửi tới email: {{CUSTOMER_EMAIL}}

👉 Xem chi tiết: {{VIEW_URL_SHORT}}

━━━━━━━━━━━━━━━━━━━━━
Tư vấn viên sẽ liên hệ bạn trong 15 phút để hỗ trợ kích hoạt plugin! 🚀

Cần hỗ trợ? Nhắn tin ngay tại đây! 💬
```

---

## Message 2: Nhắc nhở thanh toán (sau 1 giờ nếu chưa thanh toán)

```
Xin chào {{CUSTOMER_NAME}}! 👋

Chúng tôi nhận thấy hoá đơn #{{INVOICE_NUMBER}} chưa được thanh toán.

💰 Tổng thanh toán: {{GRAND_TOTAL}} đ
📝 Mã: {{PAYMENT_CODE}}

Bạn cần hỗ trợ gì không?
Trả lời tin nhắn này, chúng tôi sẵn sàng giúp bạn! 😊

👉 Xem hoá đơn: {{VIEW_URL_SHORT}}
```

---

## Message 3: Xác nhận thanh toán thành công

```
✅ THANH TOÁN THÀNH CÔNG!

Cảm ơn {{CUSTOMER_NAME}} đã thanh toán! 🎉

━━━━━━━━━━━━━━━━━━━━━
• Hoá đơn: #{{INVOICE_NUMBER}}
• Gói: {{PACKAGE_NAME}}
• Đã thanh toán: {{GRAND_TOTAL}} đ
━━━━━━━━━━━━━━━━━━━━━

🚀 BƯỚC TIẾP THEO:

1️⃣ Tư vấn viên sẽ gọi cho bạn trong 5 phút
2️⃣ Hướng dẫn cài đặt plugin WordPress
3️⃣ Kích hoạt tài khoản và bàn giao

📥 TẢI PLUGIN:
{{DOWNLOAD_PLUGIN_URL}}

📚 HƯỚNG DẪN SỬ DỤNG:
{{USER_GUIDE_URL}}

Chúc bạn trải nghiệm tuyệt vời! 💪✨
```

---

## Message 4: Chào mừng + Hướng dẫn nhanh (sau khi kích hoạt)

```
🎊 CHÀO MỪNG BẠN ĐẾN VỚI NT AI WRITER!

Hi {{CUSTOMER_NAME}},

Tài khoản của bạn đã được kích hoạt thành công! 

🚀 BẮT ĐẦU TRONG 3 BƯỚC:

1️⃣ Đăng nhập wp-admin
2️⃣ Vào NT AI Writer → Settings
3️⃣ Nhập License Key: {{LICENSE_KEY}}

✨ TÍNH NĂNG NỔI BẬT:
• Nghiên cứu từ khóa
• Tạo tiêu đề tự động
• Viết bài chuẩn SEO
• Lên lịch đăng bài
• Task Manager

📹 VIDEO HƯỚNG DẪN:
{{VIDEO_TUTORIAL_URL}}

📞 Cần hỗ trợ? Nhắn tin ngay! 
Hotline: 0812 305 046

Happy writing! ✍️🤖
```

---

## Variables cho Zalo:

```javascript
{
  CUSTOMER_NAME: "Phạm Đình",
  INVOICE_NUMBER: "HD-000017",
  PAYMENT_CODE: "UVFPLP",
  PACKAGE_NAME: "Grow",
  BILLING_CYCLE: "thanh toán theo tháng",
  GRAND_TOTAL: "475.000",
  CUSTOMER_EMAIL: "phatdinh.240904@gmail.com",
  VIEW_URL_SHORT: "invoice.share4happy.com/view/xxx",
  DOWNLOAD_PLUGIN_URL: "ntaiwriter.com/download",
  USER_GUIDE_URL: "ntaiwriter.com/docs",
  VIDEO_TUTORIAL_URL: "youtube.com/...",
  LICENSE_KEY: "XXXX-XXXX-XXXX-XXXX"
}
```

---

## Ghi chú:

1. **Gửi QR Code dạng ảnh** (tốt hơn là text)
2. **Limit 2000 ký tự/tin** (Zalo OA)
3. **Dùng emoji** cho dễ nhìn và thân thiện
4. **Rút gọn URL** nếu quá dài
5. **Gửi từng phần** nếu nội dung dài

---

## Timing gửi tin:

- ✅ **Ngay lập tức**: Message 1 (Xác nhận + Hoá đơn)
- ⏰ **Sau 1 giờ**: Message 2 (Nhắc thanh toán - nếu chưa thanh toán)
- ✅ **Ngay khi xác nhận thanh toán**: Message 3
- ✅ **Sau khi kích hoạt**: Message 4

---

Test với: 0988726204 ✅
