import { NextResponse } from 'next/server';
import { DB } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 验证项目是否属于当前用户
    const project = await DB.getComplianceProjectById(user.id, params.id);
    if (!project) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }

    const data = await request.json();
    if (!data.name) {
      return NextResponse.json({ error: '任务名称不能为空' }, { status: 400 });
    }

    const task = await DB.createProjectTask(params.id, data);
    return NextResponse.json({ task, success: true });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: '创建任务失败' }, { status: 500 });
  }
}
