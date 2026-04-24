import { NextResponse } from 'next/server';
import { DB } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const projects = await DB.getUserComplianceProjects(user.id);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: '获取项目列表失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.name || !data.productCategory || !data.targetMarket || !data.certificationType) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }

    const project = await DB.createComplianceProject(user.id, data);
    return NextResponse.json({ project, success: true });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: '创建项目失败' }, { status: 500 });
  }
}
