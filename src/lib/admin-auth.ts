import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mdlooker_admin_jwt_secret_2026';

// 验证管理员Token
export function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // 验证是否是管理员角色
    if (decoded.role !== 'admin') {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
}

// 从请求头获取管理员信息
export async function getAdminFromRequest(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const admin = verifyAdminToken(token);
  return admin;
}
