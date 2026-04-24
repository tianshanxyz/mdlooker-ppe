-- 合规追踪项目表
CREATE TABLE IF NOT EXISTS compliance_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  product_category VARCHAR(100) NOT NULL, -- 产品类别
  target_market VARCHAR(100) NOT NULL, -- 目标市场
  certification_type VARCHAR(100) NOT NULL, -- 认证类型：CE/FDA/UKCA等
  status VARCHAR(50) DEFAULT 'pending', -- 状态：pending/processing/reviewing/completed/rejected/expired
  progress INTEGER DEFAULT 0, -- 进度百分比0-100
  start_date DATE DEFAULT CURRENT_DATE,
  expected_completion_date DATE, -- 预计完成日期
  expiration_date DATE, -- 证书到期日期
  description TEXT,
  notes TEXT, -- 备注信息
  notify_before_expiration BOOLEAN DEFAULT true, -- 是否到期提醒
  notification_days INTEGER DEFAULT 30, -- 提前多少天提醒
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 项目待办事项表
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES compliance_projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending/in_progress/completed/cancelled
  due_date DATE,
  assignee VARCHAR(255), -- 负责人
  priority VARCHAR(50) DEFAULT 'medium', -- low/medium/high/urgent
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 项目附件表
CREATE TABLE IF NOT EXISTS project_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES compliance_projects(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_compliance_projects_user_id ON compliance_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_attachments_project_id ON project_attachments(project_id);
CREATE INDEX IF NOT EXISTS idx_compliance_projects_expiration_date ON compliance_projects(expiration_date);
