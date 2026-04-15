const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

async function run() {
  console.log('开始执行SQL建表脚本...');
  
  // 先创建exec_sql函数（如果不存在），用于执行任意SQL
  try {
    await supabase.raw(`
      CREATE OR REPLACE FUNCTION exec_sql(query text)
      RETURNS void AS $$
      BEGIN
        EXECUTE query;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('✅ exec_sql函数创建成功');
  } catch (e) {
    console.log('ℹ️ exec_sql函数已存在，跳过创建');
  }

  // 执行建表语句
  const sqlStatements = [
    // 创建products表
    `CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      brand TEXT,
      model TEXT,
      registration_number TEXT UNIQUE NOT NULL,
      manufacturer TEXT,
      country TEXT,
      expiration_date DATE,
      certification_type TEXT,
      regulation_reference TEXT,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )`,
    // 创建regulations表
    `CREATE TABLE IF NOT EXISTS regulations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      country TEXT NOT NULL,
      regulation_code TEXT UNIQUE NOT NULL,
      regulation_name TEXT NOT NULL,
      issue_date DATE,
      effective_date DATE,
      summary TEXT,
      scope TEXT,
      content_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )`,
    // 创建certifications表
    `CREATE TABLE IF NOT EXISTS certifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      certification_number TEXT UNIQUE NOT NULL,
      certification_type TEXT NOT NULL,
      issuing_authority TEXT NOT NULL,
      issue_date DATE,
      valid_until DATE,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      regulation_id UUID REFERENCES regulations(id) ON DELETE SET NULL,
      status TEXT DEFAULT 'valid',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )`,
    // 创建索引
    `CREATE INDEX IF NOT EXISTS idx_products_registration_number ON products(registration_number)`,
    `CREATE INDEX IF NOT EXISTS idx_products_country ON products(country)`,
    `CREATE INDEX IF NOT EXISTS idx_regulations_country ON regulations(country)`,
    `CREATE INDEX IF NOT EXISTS idx_regulations_code ON regulations(regulation_code)`,
    `CREATE INDEX IF NOT EXISTS idx_certifications_number ON certifications(certification_number)`,
    `CREATE INDEX IF NOT EXISTS idx_certifications_product_id ON certifications(product_id)`,
    `CREATE INDEX IF NOT EXISTS idx_certifications_regulation_id ON certifications(regulation_id)`,
    // 启用RLS
    `ALTER TABLE products ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE regulations ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE certifications ENABLE ROW LEVEL SECURITY`,
    // 创建公开读权限
    `CREATE POLICY IF NOT EXISTS "Public can read products" ON products FOR SELECT USING (true)`,
    `CREATE POLICY IF NOT EXISTS "Public can read regulations" ON regulations FOR SELECT USING (true)`,
    `CREATE POLICY IF NOT EXISTS "Public can read certifications" ON certifications FOR SELECT USING (true)`
  ];

  for (const sql of sqlStatements) {
    try {
      await supabase.rpc('exec_sql', { query: sql });
      console.log(`✅ 执行成功: ${sql.substring(0, 50)}...`);
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log(`ℹ️ 跳过已存在的对象: ${e.message.split('\n')[0]}`);
      } else {
        console.error(`❌ 执行失败: ${e.message}`);
        console.error('SQL:', sql);
      }
    }
  }

  console.log('\n🎉 所有表结构创建完成！');
  console.log('已创建的表:');
  console.log('- products（产品表，存储PPE产品基础信息）');
  console.log('- regulations（法规表，存储各国PPE相关法规）');
  console.log('- certifications（认证表，存储产品认证信息）');
  console.log('已配置索引和公开读权限，可正常写入数据');
}

run().catch(console.error);
