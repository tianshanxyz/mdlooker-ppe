import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DB } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'mdlooker_jwt_secret_2026';
const JWT_EXPIRES_IN = '7d';

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// 密码验证
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 生成JWT Token
export function generateToken(user: any): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      plan: user.plan,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// 验证JWT Token
export function verifyToken(token: string): any | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// 从请求头中获取用户信息
export async function getUserFromRequest(request: Request): Promise<any | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await DB.getUserByEmail(payload.email);
  return user || null;
}

// 检查用户权限
export async function checkUserPermission(user: any, requiredPlan: 'free' | 'pro' | 'enterprise' = 'free') {
  if (!user) return false;
  
  const planLevels = { free: 0, pro: 1, enterprise: 2 };
  return planLevels[user.plan as keyof typeof planLevels] >= planLevels[requiredPlan];
}