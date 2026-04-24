import { NextResponse } from 'next/server';
import { DB } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const project = await DB.getComplianceProjectById(user.id, params.id);
    if (!project) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: '获取项目详情失败' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const data = await request.json();
    const project = await DB.updateComplianceProject(user.id, params.id, data);
    
    return NextResponse.json({ project, success: true });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: '更新项目失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    await DB.deleteComplianceProject(user.id, params.id);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: '删除项目失败' }, { status: 500 });
  }
}
