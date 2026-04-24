
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 数据库连接配置
const client = new Client({
  host: 'qlzekiwqzdkauopbrlad.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'AztopRtQ5A9DiTDE',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

// 生成数据的工具函数
function generateRandomDate(startYear, endYear) {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear + 1));
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function importAllData() {
  try {
    await client.connect();
    console.log('✅ 数据库连接成功，开始导入数据...');

    // ==============================
    // 1. 插入100条法规数据
    // ==============================
    console.log('\n📝 开始插入法规数据（100条）...');
    const countries = ['欧盟', '美国', '英国', '中国', '日本', '韩国', '澳大利亚', '加拿大', '中东GCC', '东盟'];
    const regTypes = ['PPE法规', '口罩标准', '防护服标准', '手套标准', '护目镜标准', '口罩注册规范', '认证要求'];
    
    const regulations = [];
    for (let i = 1; i <= 100; i++) {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const regCode = `${country.slice(0, 2).toUpperCase()}-REG-${String(i).padStart(4, '0')}`;
      const regName = `${country}${regTypes[Math.floor(Math.random() * regTypes.length)]} ${2016 + Math.floor(Math.random() * 8)}版`;
      const issueDate = generateRandomDate(2015, 2022);
      const effectiveDate = generateRandomDate(2016, 2023);
      
      regulations.push({
        country,
        regulation_code: regCode,
        regulation_name: regName,
        issue_date: issueDate,
        effective_date: effectiveDate,
        summary: `本法规规定了${country}地区PPE产品的合规要求、测试标准、认证流程等内容，适用于所有进入${country}市场的个人防护装备产品。`,
        scope: '口罩、防护服、防护手套、护目镜、呼吸防护设备等个人防护装备',
        content_url: `https://example.com/regulation/${regCode.toLowerCase()}`
      });
    }

    // 批量插入法规
    let regCount = 0;
    for (let i = 0; i < regulations.length; i += 50) {
      const batch = regulations.slice(i, i + 50);
      const values = batch.map((_, idx) => 
        `($${idx*8 + 1}, $${idx*8 + 2}, $${idx*8 + 3}, $${idx*8 + 4}, $${idx*8 + 5}, $${idx*8 + 6}, $${idx*8 + 7}, $${idx*8 + 8})`
      ).join(',');
      
      const params = batch.flatMap(r => [
        r.country, r.regulation_code, r.regulation_name, r.issue_date, r.effective_date, r.summary, r.scope, r.content_url
      ]);
      
      const res = await client.query(
        `INSERT INTO regulations (country, regulation_code, regulation_name, issue_date, effective_date, summary, scope, content_url) VALUES ${values} ON CONFLICT (regulation_code) DO NOTHING`,
        params
      );
      regCount += res.rowCount;
      console.log(`✅ 已插入法规数据：${regCount}/100条`);
    }

    // 查询插入的法规ID，用于关联认证数据
    const { rows: regRows } = await client.query('SELECT id, regulation_code FROM regulations');
    const regIdMap = {};
    regRows.forEach(r => regIdMap[r.regulation_code] = r.id);

    // ==============================
    // 2. 插入10000条产品数据
    // ==============================
    console.log('\n📝 开始插入产品数据（10000条）...');
    const productTypes = ['医用口罩', '防护口罩', 'KN95口罩', 'N95口罩', 'FFP2口罩', 'FFP3口罩', '医用防护服', '隔离衣', '一次性手套', '丁腈手套', '乳胶手套', '护目镜', '防护面罩', '防毒面具'];
    const brands = ['3M', '霍尼韦尔', '稳健医疗', '振德医疗', '鱼跃医疗', '比亚迪', '金发科技', '大胜', '朝美', '宝顺安', '南核', '思创', '代尔塔', '梅思安', '英科医疗', '蓝帆医疗', '中红医疗', '奥美医疗'];
    const manufacturers = ['湖北佳联防护用品有限公司', '稳健医疗用品股份有限公司', '振德医疗用品股份有限公司', '3M中国有限公司', '霍尼韦尔(中国)有限公司', '浙江比亚迪精密制造有限公司', '英科医疗科技股份有限公司', '蓝帆医疗股份有限公司', '中红普林医疗用品股份有限公司', '奥美医疗用品股份有限公司'];
    const certTypes = ['CE', 'FDA', 'UKCA', 'GB', 'PSE', 'KC', 'G-mark', 'TGA', 'ANVISA', 'FDA 510(k)'];

    const products = [];
    for (let i = 1; i <= 10000; i++) {
      const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const model = `${brand.slice(0, 2).toUpperCase()}-${productType.slice(0, 2).toUpperCase()}${String(i).padStart(6, '0')}`;
      const regNumber = `REG-${String(i).padStart(8, '0')}-${['CN', 'EU', 'US', 'GB', 'JP', 'KR', 'AU', 'CA', 'GC', 'AS'][Math.floor(Math.random() * 10)]}`;
      const country = countries[Math.floor(Math.random() * countries.length)];
      const expDate = generateRandomDate(2026, 2029);
      const certType = certTypes[Math.floor(Math.random() * certTypes.length)];
      const randomReg = regulations[Math.floor(Math.random() * regulations.length)];
      
      products.push({
        name: `${brand} ${productType}`,
        brand,
        model,
        registration_number: regNumber,
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        country,
        expiration_date: expDate,
        certification_type: certType,
        regulation_reference: randomReg.regulation_code,
        description: `${productType}，符合${country}相关标准要求，过滤效率≥95%，佩戴舒适，适用于日常防护、工业防护、医疗防护等场景。`
      });
    }

    // 批量插入产品
    let productCount = 0;
    for (let i = 0; i < products.length; i += 500) {
      const batch = products.slice(i, i + 500);
      const values = batch.map((_, idx) => 
        `($${idx*10 + 1}, $${idx*10 + 2}, $${idx*10 + 3}, $${idx*10 + 4}, $${idx*10 + 5}, $${idx*10 + 6}, $${idx*10 + 7}, $${idx*10 + 8}, $${idx*10 + 9}, $${idx*10 + 10})`
      ).join(',');
      
      const params = batch.flatMap(p => [
        p.name, p.brand, p.model, p.registration_number, p.manufacturer, p.country, p.expiration_date, p.certification_type, p.regulation_reference, p.description
      ]);
      
      const res = await client.query(
        `INSERT INTO products (name, brand, model, registration_number, manufacturer, country, expiration_date, certification_type, regulation_reference, description) VALUES ${values} ON CONFLICT (registration_number) DO NOTHING`,
        params
      );
      productCount += res.rowCount;
      console.log(`✅ 已插入产品数据：${productCount}/10000条`);
    }

    // 查询插入的产品ID，用于关联认证数据
    const { rows: productRows } = await client.query('SELECT id, registration_number FROM products');
    const productIdMap = {};
    productRows.forEach(p => productIdMap[p.registration_number] = p.id);

    // ==============================
    // 3. 插入5000条认证数据
    // ==============================
    console.log('\n📝 开始插入认证数据（5000条）...');
    const issuingAuthorities = ['欧盟公告机构', '美国FDA', '英国UKCA认证机构', '中国NMPA', '日本厚生劳动省', '韩国MFDS', 'GCC认证中心', 'SGS', 'BV', 'TÜV莱茵', 'TÜV南德', '澳大利亚TGA', '巴西ANVISA'];
    const statuses = ['valid', 'valid', 'valid', 'valid', 'valid', 'expired', 'suspended']; // 大部分是有效的

    const certifications = [];
    for (let i = 1; i <= 5000; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const productId = productIdMap[randomProduct.registration_number];
      const randomReg = regulations[Math.floor(Math.random() * regulations.length)];
      const regId = regIdMap[randomReg.regulation_code];
      const certType = certTypes[Math.floor(Math.random() * certTypes.length)];
      const certNumber = `CERT-${String(i).padStart(8, '0')}`;
      const issueDate = generateRandomDate(2019, 2023);
      const validUntil = generateRandomDate(2024, 2028);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      if (productId) { // 只插入有对应产品的认证
        certifications.push({
          certification_number: certNumber,
          certification_type: certType,
          issuing_authority: issuingAuthorities[Math.floor(Math.random() * issuingAuthorities.length)],
          issue_date: issueDate,
          valid_until: validUntil,
          product_id: productId,
          regulation_id: regId,
          status
        });
      }
    }

    // 批量插入认证
    let certCount = 0;
    for (let i = 0; i < certifications.length; i += 500) {
      const batch = certifications.slice(i, i + 500);
      const values = batch.map((_, idx) => 
        `($${idx*8 + 1}, $${idx*8 + 2}, $${idx*8 + 3}, $${idx*8 + 4}, $${idx*8 + 5}, $${idx*8 + 6}, $${idx*8 + 7}, $${idx*8 + 8})`
      ).join(',');
      
      const params = batch.flatMap(c => [
        c.certification_number, c.certification_type, c.issuing_authority, c.issue_date, c.valid_until, c.product_id, c.regulation_id, c.status
      ]);
      
      const res = await client.query(
        `INSERT INTO certifications (certification_number, certification_type, issuing_authority, issue_date, valid_until, product_id, regulation_id, status) VALUES ${values} ON CONFLICT (certification_number) DO NOTHING`,
        params
      );
      certCount += res.rowCount;
      console.log(`✅ 已插入认证数据：${certCount}/5000条`);
    }

    // ==============================
    // 统计结果
    // ==============================
    console.log('\n🎉 全部数据导入完成！');
    const { rows: regStat } = await client.query('SELECT COUNT(*) FROM regulations');
    const { rows: productStat } = await client.query('SELECT COUNT(*) FROM products');
    const { rows: certStat } = await client.query('SELECT COUNT(*) FROM certifications');
    console.log('====================================');
    console.log(`📊 法规数据：${regStat[0].count}条`);
    console.log(`📊 产品数据：${productStat[0].count}条`);
    console.log(`📊 认证数据：${certStat[0].count}条`);
    console.log(`📊 合计数据：${parseInt(regStat[0].count) + parseInt(productStat[0].count) + parseInt(certStat[0].count)}条`);
    console.log('====================================');
    console.log('✅ 数据库全部配置完成，网站可以正常使用所有功能！');

    await client.end();
  } catch (error) {
    console.error('❌ 导入失败：', error);
    process.exit(1);
  }
}

importAllData();
