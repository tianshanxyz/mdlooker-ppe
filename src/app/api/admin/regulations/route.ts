import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

// 获取法规列表
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
    const category = searchParams.get('category') || '';
    const target_market = searchParams.get('target_market') || '';

    const offset = (page - 1) * pageSize;

    // 构建查询
    let query = supabaseAdmin
      .from('regulations')
      .select('*', { count: 'exact' });

    // 搜索条件
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,standard_no.ilike.%${search}%`);
    }

    // 分类筛选
    if (category) {
      query = query.eq('category', category);
    }

    // 地区筛选
    if (target_market) {
      query = query.eq('target_market', target_market);
    }

    // 分页
    const { data: regulations, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return NextResponse.json({
      regulations,
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count! / pageSize)
      }
    });
  } catch (error) {
    console.error('获取法规列表错误:', error);
    return NextResponse.json({ error: '获取法规列表失败' }, { status: 500 });
  }
}

// 创建法规
export async function POST(request: Request) {
  try {
    // 验证管理员身份
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: '无权限访问' }, { status: 401 });
    }

    const regulationData = await request.json();

    // 必填字段验证
    if (!regulationData.title || !regulationData.category || !regulationData.target_market) {
      return NextResponse.json({ error: '标题、分类、目标市场是必填项' }, { status: 400 });
    }

    // 创建法规
    const { data: regulation, error } = await supabaseAdmin
      .from('regulations')
      .insert({
        ...regulationData,
        created_by: admin.userId
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ regulation, success: true });
  } catch (error) {
    console.error('创建法规错误:', error);
    return NextResponse.json({ error: '创建法规失败' }, { status: 500 });
  }
}
