const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

// 模拟15000+条合规数据生成（实际场景替换为真实爬取逻辑）
async function generateSampleData() {
  console.log('开始生成PPE合规数据...');
  
  // 生成法规数据（100条）
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
  
  // 批量插入法规
  const { error: regError, data: insertedRegs } = await supabase.from('regulations').insert(regulations).select('id, regulation_code');
  if (regError) throw regError;
  console.log(`✅ 成功插入${insertedRegs.length}条法规数据`);
  
  // 生成产品数据（10000条）
  const products = [];
  const productTypes = ['医用口罩', '防护口罩', 'KN95口罩', 'N95口罩', 'FFP2口罩', 'FFP3口罩', '医用防护服', '隔离衣', '一次性手套', '丁腈手套', '乳胶手套', '护目镜', '防护面罩', '防毒面具'];
  const brands = ['3M', '霍尼韦尔', '稳健医疗', '振德医疗', '鱼跃医疗', '比亚迪', '金发科技', '大胜', '朝美', '宝顺安', '南核', '思创', '代尔塔', '梅思安'];
  const manufacturers = ['湖北佳联防护用品有限公司', '稳健医疗用品股份有限公司', '振德医疗用品股份有限公司', '3M中国有限公司', '霍尼韦尔(中国)有限公司', '浙江比亚迪精密制造有限公司'];
  
  for (let i = 0; i < 10000; i++) {
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const model = `${brand.slice(0, 2).toUpperCase()}-${productType.slice(0, 2).toUpperCase()}${String(i + 1).padStart(6, '0')}`;
    const regNumber = `REG-${String(i + 1).padStart(8, '0')}-${['CN', 'EU', 'US', 'GB'][Math.floor(Math.random() * 4)]}`;
    const country = countries[Math.floor(Math.random() * countries.length)];
    const expDate = new Date(2025 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0];
    
    products.push({
      name: `${brand} ${productType}`,
      brand,
      model,
      registration_number: regNumber,
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      country,
      expiration_date: expDate,
      certification_type: ['CE', 'FDA', 'UKCA', 'GB', 'PSE', 'KC', 'GCC'][Math.floor(Math.random() * 7)],
      regulation_reference: insertedRegs[Math.floor(Math.random() * insertedRegs.length)].regulation_code,
      description: `${productType}，符合${country}相关标准要求，过滤效率≥95%，佩戴舒适，适用于日常防护、工业防护、医疗防护等场景。`
    });
  }
  
  // 批量插入产品（每1000条一批）
  const batchSize = 1000;
  let totalProductsInserted = 0;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const { error: prodError, data: insertedProds } = await supabase.from('products').insert(batch).select('id');
    if (prodError) {
      console.error('产品插入失败:', prodError);
      continue;
    }
    totalProductsInserted += insertedProds.length;
    console.log(`✅ 已插入${totalProductsInserted}/10000条产品数据`);
  }
  
  // 生成认证数据（5000条）
  const certifications = [];
  const issuingAuthorities = ['欧盟公告机构', '美国FDA', '英国UKCA认证机构', '中国药监局', '日本厚生劳动省', '韩国KFDA', 'GCC认证中心', 'SGS', 'BV', 'TÜV'];
  
  // 获取所有产品ID
  const { data: allProducts } = await supabase.from('products').select('id, registration_number');
  // 获取所有法规ID
  const regMap = {};
  insertedRegs.forEach(r => regMap[r.regulation_code] = r.id);
  
  for (let i = 0; i < 5000; i++) {
    const product = allProducts[Math.floor(Math.random() * allProducts.length)];
    const certType = ['CE认证', 'FDA注册', 'UKCA认证', 'GB认证', 'PSE认证', 'KC认证', 'GCC认证'][Math.floor(Math.random() * 7)];
    const certNumber = `CERT-${String(i + 1).padStart(8, '0')}`;
    const issueDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0];
    const validUntil = new Date(2024 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0];
    const regulation = insertedRegs[Math.floor(Math.random() * insertedRegs.length)];
    
    certifications.push({
      certification_number: certNumber,
      certification_type: certType,
      issuing_authority: issuingAuthorities[Math.floor(Math.random() * issuingAuthorities.length)],
      issue_date: issueDate,
      valid_until: validUntil,
      product_id: product.id,
      regulation_id: regulation.id,
      status: Math.random() > 0.1 ? 'valid' : 'expired'
    });
  }
  
  // 批量插入认证
  let totalCertsInserted = 0;
  for (let i = 0; i < certifications.length; i += batchSize) {
    const batch = certifications.slice(i, i + batchSize);
    const { error: certError, data: insertedCerts } = await supabase.from('certifications').insert(batch).select('id');
    if (certError) {
      console.error('认证插入失败:', certError);
      continue;
    }
    totalCertsInserted += insertedCerts.length;
    console.log(`✅ 已插入${totalCertsInserted}/5000条认证数据`);
  }
  
  console.log('\n🎉 全部数据导入完成！');
  console.log('数据统计:');
  console.log(`- 法规数据: ${insertedRegs.length}条`);
  console.log(`- 产品数据: ${totalProductsInserted}条`);
  console.log(`- 认证数据: ${totalCertsInserted}条`);
  console.log(`合计: ${insertedRegs.length + totalProductsInserted + totalCertsInserted}条`);
}

generateSampleData().catch(e => {
  console.error('数据导入失败:', e);
  process.exit(1);
});
