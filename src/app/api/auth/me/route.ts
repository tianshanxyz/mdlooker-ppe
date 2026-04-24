import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url,
        plan: user.plan,
        usageCount: user.usage_count,
        planExpiresAt: user.plan_expires_at,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: '获取用户信息失败' }, { status: 500 });
  }
}