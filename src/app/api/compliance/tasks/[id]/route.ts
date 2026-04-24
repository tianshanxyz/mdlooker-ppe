import { NextResponse } from 'next/server';
import { DB } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

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
    const task = await DB.updateProjectTask(params.id, data);
    
    return NextResponse.json({ task, success: true });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: '更新任务失败' }, { status: 500 });
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

    await DB.deleteProjectTask(params.id);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: '删除任务失败' }, { status: 500 });
  }
}
