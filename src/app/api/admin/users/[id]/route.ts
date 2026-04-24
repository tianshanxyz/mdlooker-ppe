import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// 获取单个用户信息
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

    const userId = params.id;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 移除敏感信息
    const { password_hash, ...userInfo } = user;

    return NextResponse.json({ user: userInfo });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json({ error: '获取用户信息失败' }, { status: 500 });
  }
}

// 更新用户信息
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

    const userId = params.id;
    const updateData = await request.json();

    // 移除敏感字段
    delete updateData.password_hash;

    // 如果有密码更新，加密
    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    // 更新用户
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({
        ...updateData,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // 移除敏感信息
    const { password_hash, ...userInfo } = user;

    return NextResponse.json({ user: userInfo, success: true });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    return NextResponse.json({ error: '更新用户信息失败' }, { status: 500 });
  }
}

// 删除用户
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

    const userId = params.id;

    // 删除用户
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: '用户已删除' });
  } catch (error) {
    console.error('删除用户错误:', error);
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 });
  }
}
