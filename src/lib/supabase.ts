import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 客户端用的supabase实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端用的supabase实例，有更高权限
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 数据库操作工具类
export class DB {
  // 用户相关操作
  static async getUserByEmail(email: string) {
    const { data } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return data;
  }

  static async createUser(email: string, passwordHash: string, name?: string) {
    const { data } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name: name || email.split('@')[0]
      })
      .select()
      .single();
    return data;
  }

  static async updateUser(id: string, data: Record<string, any>) {
    const { data: user } = await supabaseAdmin
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    return user;
  }

  static async incrementUsage(userId: string) {
    await supabaseAdmin
      .from('users')
      .update({
        usage_count: supabaseAdmin.raw('usage_count + 1'),
        last_used_at: new Date()
      })
      .eq('id', userId);
  }

  // 合规检查记录
  static async createComplianceCheck(userId: string, data: any) {
    const { data: check } = await supabaseAdmin
      .from('compliance_checks')
      .insert({
        user_id: userId,
        product_category: data.productCategory,
        target_market: data.targetMarket,
        product_name: data.productName,
        result: data.result
      })
      .select()
      .single();
    return check;
  }

  static async getUserComplianceChecks(userId: string, limit = 20) {
    const { data } = await supabaseAdmin
      .from('compliance_checks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  // 下载记录
  static async createDownload(userId: string, data: any) {
    const { data: download } = await supabaseAdmin
      .from('downloads')
      .insert({
        user_id: userId,
        file_type: data.fileType,
        file_name: data.fileName,
        file_size: data.fileSize
      })
      .select()
      .single();
    return download;
  }

  static async getUserDownloads(userId: string, limit = 20) {
    const { data } = await supabaseAdmin
      .from('downloads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  // 合规项目相关
  static async createComplianceProject(userId: string, data: any) {
    const { data: project } = await supabaseAdmin
      .from('compliance_projects')
      .insert({
        user_id: userId,
        name: data.name,
        product_category: data.productCategory,
        target_market: data.targetMarket,
        certification_type: data.certificationType,
        expected_completion_date: data.expectedCompletionDate,
        expiration_date: data.expirationDate,
        description: data.description,
        notify_before_expiration: data.notifyBeforeExpiration ?? true,
        notification_days: data.notificationDays ?? 30
      })
      .select()
      .single();
    return project;
  }

  static async getUserComplianceProjects(userId: string, limit = 50) {
    const { data } = await supabaseAdmin
      .from('compliance_projects')
      .select('*, tasks:project_tasks(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  static async getComplianceProjectById(userId: string, projectId: string) {
    const { data } = await supabaseAdmin
      .from('compliance_projects')
      .select('*, tasks:project_tasks(*), attachments:project_attachments(*)')
      .eq('user_id', userId)
      .eq('id', projectId)
      .single();
    return data;
  }

  static async updateComplianceProject(userId: string, projectId: string, data: any) {
    const { data: project } = await supabaseAdmin
      .from('compliance_projects')
      .update({
        ...data,
        updated_at: new Date()
      })
      .eq('user_id', userId)
      .eq('id', projectId)
      .select()
      .single();
    return project;
  }

  static async deleteComplianceProject(userId: string, projectId: string) {
    await supabaseAdmin
      .from('compliance_projects')
      .delete()
      .eq('user_id', userId)
      .eq('id', projectId);
  }

  // 项目待办任务相关
  static async createProjectTask(projectId: string, data: any) {
    const { data: task } = await supabaseAdmin
      .from('project_tasks')
      .insert({
        project_id: projectId,
        name: data.name,
        description: data.description,
        due_date: data.dueDate,
        assignee: data.assignee,
        priority: data.priority ?? 'medium'
      })
      .select()
      .single();
    return task;
  }

  static async updateProjectTask(taskId: string, data: any) {
    const { data: task } = await supabaseAdmin
      .from('project_tasks')
      .update({
        ...data,
        updated_at: new Date()
      })
      .eq('id', taskId)
      .select()
      .single();
    return task;
  }

  static async deleteProjectTask(taskId: string) {
    await supabaseAdmin
      .from('project_tasks')
      .delete()
      .eq('id', taskId);
  }
}