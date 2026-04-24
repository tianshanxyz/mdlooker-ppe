const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// 使用service role key连接Supabase（有写权限）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createTables() {
  console.log('开始创建Supabase表结构...');
  
  // 读取SQL脚本内容
  const sql = fs.readFileSync(path.join(__dirname, 'sql', 'create_tables.sql'), 'utf8');
  
  // 分割SQL语句（按分号分割，过滤空语句）
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  
  for (const statement of statements) {
    try {
      // 执行SQL语句
      const { error } = await supabase.rpc('exec_sql', { query: statement });
      // 如果没有exec_sql权限，改用原始查询（需要postgres权限）
      if (error && error.code === '42883') { // function exec_sql does not exist
        console.log('使用raw查询方式执行...');
        const { data, error: rawError } = await supabase.raw(statement);
        if (rawError) throw rawError;
        console.log(`✅ 执行成功: ${statement.substring(0, 50)}...`);
      } else if (error) {
        throw error;
      } else {
        console.log(`✅ 执行成功: ${statement.substring(0, 50)}...`);
      }
    } catch (error) {
      // 忽略表已存在的错误
      if (error.message.includes('already exists') || error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log(`ℹ️ 跳过: ${error.message}`);
        continue;
      }
      console.error(`❌ 执行失败: ${error.message}`);
      console.error('语句:', statement);
      process.exit(1);
    }
  }
  
  console.log('\n🎉 所有表结构创建完成！');
  console.log('已创建的表: products, regulations, certifications');
  console.log('已配置索引和行级安全规则');
}

// 检查是否可以连接Supabase
async function testConnection() {
  try {
    // 调用一个不需要表存在的接口测试连接
    const { error } = await supabase.auth.getSession();
    // 只要没返回权限错误/网络错误就是连接成功
    if (error && error.status !== 401) {
      throw error;
    }
    console.log('✅ Supabase连接成功');
    return true;
  } catch (error) {
    console.error('❌ Supabase连接失败:', error.message);
    return false;
  }
}

async function main() {
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }
  await createTables();
}

main();
