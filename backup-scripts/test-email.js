const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imap = new Imap({
  user: 'milly@h-guardian.com',
  password: 'U6m@WQWP4wuJ2rKf',
  host: 'imap.ym.163.com',
  port: 993,
  tls: true,
  authTimeout: 10000,
  connTimeout: 10000
});

imap.once('ready', () => {
  console.log('✅ 邮箱连接成功！');
  
  imap.openBox('INBOX', false, (err, box) => {
    if (err) throw err;
    
    console.log(`📥 收件箱共有 ${box.messages.total} 封邮件`);
    
    // 获取最新的5封邮件
    const fetch = imap.seq.fetch(`${box.messages.total - 4}:${box.messages.total}`, { bodies: '' });
    
    fetch.on('message', (msg, seqno) => {
      msg.on('body', (stream, info) => {
        simpleParser(stream, (err, parsed) => {
          if (err) throw err;
          
          console.log(`
=== 邮件 #${seqno} ===
📅 日期: ${parsed.date?.toLocaleString('zh-CN')}
📤 发件人: ${parsed.from?.text}
📩 主题: ${parsed.subject}
📄 内容预览: ${parsed.text?.substring(0, 200)}...
          `);
        });
      });
    });
    
    fetch.once('end', () => {
      console.log('✅ 邮件读取完成');
      imap.end();
    });
  });
});

imap.once('error', (err) => {
  console.error('❌ 邮箱连接出错:', err);
});

imap.once('end', () => {
  console.log('🔌 邮箱连接已关闭');
});

imap.connect();
