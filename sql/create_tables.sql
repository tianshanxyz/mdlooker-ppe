-- 创建产品表（存储PPE产品基础信息）
CREATE TABLE IF NOT EXISTS products (
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
);

-- 创建法规表（存储各国PPE相关法规信息）
CREATE TABLE IF NOT EXISTS regulations (
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
);

-- 创建认证表（存储PPE产品认证信息）
CREATE TABLE IF NOT EXISTS certifications (
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
);

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_products_registration_number ON products(registration_number);
CREATE INDEX IF NOT EXISTS idx_products_country ON products(country);
CREATE INDEX IF NOT EXISTS idx_regulations_country ON regulations(country);
CREATE INDEX IF NOT EXISTS idx_regulations_code ON regulations(regulation_code);
CREATE INDEX IF NOT EXISTS idx_certifications_number ON certifications(certification_number);
CREATE INDEX IF NOT EXISTS idx_certifications_product_id ON certifications(product_id);
CREATE INDEX IF NOT EXISTS idx_certifications_regulation_id ON certifications(regulation_id);

-- 启用Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- 创建公开读权限（前台用户可以查询数据）
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read regulations" ON regulations FOR SELECT USING (true);
CREATE POLICY "Public can read certifications" ON certifications FOR SELECT USING (true);
