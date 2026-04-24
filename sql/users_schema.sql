-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  plan_expires_at TIMESTAMP,
  usage_count INTEGER DEFAULT 0, -- 当月使用次数
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 合规检查记录表
CREATE TABLE IF NOT EXISTS compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_category VARCHAR(100) NOT NULL,
  target_market VARCHAR(100) NOT NULL,
  product_name VARCHAR(255),
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 下载记录表
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_type VARCHAR(100) NOT NULL, -- template, compliance_package, report
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 套餐配置表
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL,
  max_usage_per_month INTEGER, -- 每月使用次数，null表示无限
  max_downloads_per_month INTEGER, -- 每月下载次数，null表示无限
  priority_support BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认套餐数据
INSERT INTO plans (id, name, price, price_yearly, features, max_usage_per_month, max_downloads_per_month, priority_support)
VALUES 
('free', '免费版', 0, 0, '["合规检查每月3次", "基础知识库访问", "每月3次模板下载", "邮件订阅"]', 3, 3, false),
('pro', 'Pro版', 29.99, 299, '["无限次合规检查", "完整知识库访问", "无限次模板下载", "自定义法规推送", "API每月500次", "工作日客服支持"]', null, null, false),
('enterprise', '企业版', 99.99, 999, '["包含Pro版所有功能", "无限API调用", "7*24小时专属支持", "功能定制开发", "合规咨询服务", "子账号管理", "数据看板"]', null, null, true)
ON CONFLICT (id) DO NOTHING;

-- 索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_user_id ON compliance_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);