const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

async function checkTables() {
  console.log('查询当前数据库表...');
  // 查询information_schema看表是否存在
  const { data, error } = await supabase.raw(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('products', 'regulations', 'certifications')
  `);
  
  if (error) {
    console.error('查询失败:', error);
    return;
  }
  
  console.log('查询结果:', data);
  
  if (data.length === 3) {
    console.log('✅ 三张表均已存在于public schema中');
    // 尝试直接插入一条测试数据
    try {
      const { error: insertError } = await supabase.from('regulations').insert({
        country: '测试',
        regulation_code: 'TEST-REG-001',
        regulation_name: '测试法规'
      });
      if (insertError) {
        console.error('插入测试数据失败:', insertError);
      } else {
        console.log('✅ 数据插入正常');
        // 删除测试数据
        await supabase.from('regulations').delete().eq('regulation_code', 'TEST-REG-001');
      }
    } catch (e) {
      console.error('测试插入失败:', e);
    }
  } else {
    console.log('❌ 部分表不存在，需要重新创建');
  }
}

checkTables();
