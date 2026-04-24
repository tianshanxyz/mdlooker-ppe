import { NextResponse } from 'next/server';
import { DB } from '@/lib/supabase';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码是必填项' }, { status: 400 });
    }

    // 查询用户
    const user = await DB.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    // 生成Token
    const token = generateToken(user);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url,
        plan: user.plan,
        usageCount: user.usage_count,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}