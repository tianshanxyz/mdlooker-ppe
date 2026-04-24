import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

// 获取单个法规详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员身份
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '无权限访问' }, { status: 401 });
    }

    const regulationId = params.id;

    const { data: regulation, error } = await supabaseAdmin
      .from('regulations')
      .select('*')
      .eq('id', regulationId)
      .single();

    if (error) throw error;

    if (!regulation) {
      return NextResponse.json({ error: '法规不存在' }, { status: 404 });
    }

    return NextResponse.json({ regulation });
  } catch (error) {
    console.error('获取法规详情错误:', error);
    return NextResponse.json({ error: '获取法规详情失败' }, { status: 500 });
  }
}

// 更新法规
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员身份
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '无权限访问' }, { status: 401 });
    }

    const regulationId = params.id;
    const updateData = await request.json();

    // 更新法规
    const { data: regulation, error } = await supabaseAdmin
      .from('regulations')
      .update({
        ...updateData,
        updated_at: new Date(),
        updated_by: admin.userId
      })
      .eq('id', regulationId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ regulation, success: true });
  } catch (error) {
    console.error('更新法规错误:', error);
    return NextResponse.json({ error: '更新法规失败' }, { status: 500 });
  }
}

// 删除法规
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员身份
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '无权限访问' }, { status: 401 });
    }

    const regulationId = params.id;

    // 删除法规
    const { error } = await supabaseAdmin
      .from('regulations')
      .delete()
      .eq('id', regulationId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: '法规已删除' });
  } catch (error) {
    console.error('删除法规错误:', error);
    return NextResponse.json({ error: '删除法规失败' }, { status: 500 });
  }
}
