import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'mdlooker_admin_jwt_secret_2026';
// 管理员账号密码，生产环境应该存到数据库里，这里先做演示
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mdlooker.com';
// 加密后的密码：默认密码是admin123456
const ADMIN_PASSWORD_HASH = '$2a$10$EixZaY3s7vMRC/.R6x07/OHQ9h1z76lX99m8qU76x55aM7qU76x56'; // bcrypt.hashSync('admin123456', 10)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码是必填项' }, { status: 400 });
    }

    // 验证账号密码
    if (email !== ADMIN_EMAIL || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    // 生成JWT Token，有效期24小时
    const token = jwt.sign(
      { email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({ token, success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}
