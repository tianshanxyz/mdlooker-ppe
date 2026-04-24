import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

// 获取用户列表
export async function GET(request: Request) {
  try {
    // 验证管理员身份
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '无权限访问' }, { status: 401 });
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';

    const offset = (page - 1) * pageSize;

    // 构建查询
    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' });

    // 搜索条件
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    // 套餐筛选
    if (plan) {
      query = query.eq('plan', plan);
    }

    // 分页
    const { data: users, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return NextResponse.json({
      users,
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count! / pageSize)
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 });
  }
}

// 创建用户
export async function POST(request: Request) {
  try {
    // 验证管理员身份
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '无权限访问' }, { status: 401 });
    }

    const { email, password, name, plan = 'free' } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码是必填项' }, { status: 400 });
    }

    // 验证邮箱是否已存在
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 });
    }

    // 加密密码
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name: name || email.split('@')[0],
        plan,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ user, success: true });
  } catch (error) {
    console.error('创建用户错误:', error);
    return NextResponse.json({ error: '创建用户失败' }, { status: 500 });
  }
}
