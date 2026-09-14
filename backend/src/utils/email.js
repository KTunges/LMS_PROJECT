const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, template, data }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ EMAIL_USER or EMAIL_PASS is not configured in .env. Falling back to console log.');
      console.log(`\n\n[MOCK EMAIL TO ${to}]\nSubject: ${subject}\nBody: ${html}\n\n`);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let finalHtml = html;
    
    if (template === 'welcome') {
      finalHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #3b82f6; text-align: center;">Chào mừng đến với LMS!</h2>
        <p>Xin chào <strong>${data.name}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống của chúng tôi.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;">Email đăng nhập: <strong>${to}</strong></p>
        </div>
        <p>Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173/auth" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Đăng nhập ngay</a>
        </div>
      </div>`;
    } else if (template === 'otp') {
      finalHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #3b82f6; text-align: center;">Xác thực tài khoản LMS</h2>
        <p>Xin chào,</p>
        <p>Đây là mã OTP để xác minh tài khoản của bạn. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h1 style="margin: 0; color: #1e293b; letter-spacing: 5px;">${data.otp}</h1>
        </div>
        <p style="color: #64748b; font-size: 0.9em;">Mã này sẽ hết hạn sau 10 phút.</p>
      </div>`;
    } else if (template === 'reset_password') {
      finalHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #3b82f6; text-align: center;">Khôi phục mật khẩu</h2>
        <p>Xin chào,</p>
        <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu từ tài khoản của bạn.</p>
        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
          <a href="http://localhost:5173/reset-password?token=${data.token}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Đặt lại mật khẩu</a>
        </div>
        <p style="color: #64748b; font-size: 0.9em;">Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
      </div>`;
    }

    const mailOptions = {
      from: `"Hệ thống LMS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: finalHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
};

module.exports = {
  sendEmail,
};
