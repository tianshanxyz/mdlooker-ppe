const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

async function testConnection() {
  console.log('测试Supabase连接...');
  const { data, error } = await supabase.from('regulations').select('count').limit(1);
  if (error) {
    console.error('连接失败:', error);
    return false;
  }
  console.log('连接成功！');
  return true;
}

async function uploadSampleData() {
  if (!await testConnection()) return;
  
  console.log('开始上传1000条测试数据...');
  const regulations = [];
  const countries = ['欧盟', '美国', '英国', '中国', '日本', '韩国', '澳大利亚', '加拿大', '中东GCC', '东盟'];
  const regTypes = ['PPE法规', '口罩标准', '防护服标准', '手套标准', '护目镜标准', '口罩注册规范', '认证要求'];
  
  for (let i = 0; i < 100; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const regCode = `${country.slice(0, 2).toUpperCase()}-REG-${String(i + 1).padStart(4, '0')}`;
    const regName = `${country}${regTypes[Math.floor(Math.random() * regTypes.length)]} ${2020 + Math.floor(Math.random() * 6)}版`;
    
    regulations.push({
      country,
      regulation_code: regCode,
      regulation_name: regName,
      issue_date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0],
      effective_date: new Date(2021 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0],
      summary: `本法规规定了${country}地区PPE产品的合规要求、测试标准、认证流程等内容，适用于所有进入${country}市场的个人防护装备产品。`,
      scope: '口罩、防护服、防护手套、护目镜、呼吸防护设备等个人防护装备',
      content_url: `https://example.com/regulation/${regCode.toLowerCase()}`
    });
  }
  
  const { error: regError } = await supabase.from('regulations').insert(regulations);
  if (regError) {
    console.error('上传失败:', regError);
    return;
  }
  console.log('✅ 100条法规数据上传成功！');
}

uploadSampleData().catch(e => {
  console.error('执行失败:', e);
  process.exit(1);
});
