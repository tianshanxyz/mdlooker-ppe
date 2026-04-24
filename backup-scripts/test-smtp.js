const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ym.163.com',
  port: 465,
  secure: true,
  auth: {
    user: 'milly@h-guardian.com',
    pass: 'swj2mepMUA@e2qFk',
    method: 'LOGIN'
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function testSMTP() {
  try {
    await transporter.verify();
    console.log('✅ SMTP连接成功，邮箱可用！');
    
    // 发送测试邮件
    const info = await transporter.sendMail({
      from: '"Milly" <milly@h-guardian.com>',
      to: 'milly@h-guardian.com',
      subject: '邮箱功能测试',
      text: '这是一封测试邮件，确认SMTP发送功能正常。'
    });
    
    console.log(`📤 测试邮件已发送: ${info.messageId}`);
  } catch (err) {
    console.error('❌ SMTP连接失败:', err);
  }
}

testSMTP();
