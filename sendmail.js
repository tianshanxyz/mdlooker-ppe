const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function sendReport() {
  // 创建 transporter
  let transporter = nodemailer.createTransport({
    host: 'smtp.ym.163.com',
    port: 465,
    secure: true,
    auth: {
      user: 'milly@h-guardian.com',
      pass: 'U6m@WQWP4wuJ2rKf'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // 读取邮件内容
  const reportContent = fs.readFileSync(path.join(__dirname, 'report_20260422.md'), 'utf8');
  
  // 发送邮件
  let info = await transporter.sendMail({
    from: '"Milly" <milly@h-guardian.com>',
    to: 'freeman@h-guardian.com',
    subject: '【工作汇报】2026年4月21日MDLooker平台开发及数据上传进展',
    text: reportContent,
    attachments: [
      {
        filename: 'report_20260422.md',
        path: path.join(__dirname, 'report_20260422.md')
      }
    ]
  });

  console.log('邮件发送成功:', info.messageId);
}

sendReport().catch(e => {
  console.error('邮件发送失败:', e);
  process.exit(1);
});
