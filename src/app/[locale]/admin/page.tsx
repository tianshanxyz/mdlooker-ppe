'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, BookOpen, ShoppingBag, TrendingUp, LogOut, Loader2, User } from 'lucide-react';

export default function AdminDashboardPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalRegulations: 0,
    totalTemplates: 0,
    newUsersToday: 0
  });

  // 验证管理员权限
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push(`/${locale}/admin/login`);
      return;
    }

    // 模拟获取统计数据
    setTimeout(() => {
      setStats({
        totalUsers: 1246,
        totalProjects: 3582,
        totalRegulations: 1258,
        totalTemplates: 156,
        newUsersToday: 28
      });
      setLoading(false);
    }, 1000);
  }, [router, locale]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push(`/${locale}/admin/login`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#339999] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MDLOOKER Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-gray-900">MDLOOKER 管理后台</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                总用户数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                今日新增 {stats.newUsersToday}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                项目总数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-600" />
                法规条目
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegulations.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-orange-600" />
                模板数量
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTemplates.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* 功能模块 */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="text-base px-6">
              <Users className="h-4 w-4 mr-2" />
              用户管理
            </TabsTrigger>
            <TabsTrigger value="regulations" className="text-base px-6">
              <BookOpen className="h-4 w-4 mr-2" />
              法规管理
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-base px-6">
              <FileText className="h-4 w-4 mr-2" />
              模板管理
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-base px-6">
              <FileText className="h-4 w-4 mr-2" />
              项目管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>{locale === 'zh' ? '用户管理' : 'User Management'}</CardTitle>
                  <CardDescription>{locale === 'zh' ? '管理所有注册用户信息、套餐权限' : 'Manage all registered user information, plan permissions'}</CardDescription>
                </div>
                <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white" onClick={() => router.push(`/${locale}/admin/users`)}>
                  {locale === 'zh' ? '进入用户管理' : 'Go to User Management'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">{locale === 'zh' ? '用户管理模块已迁移到独立页面' : 'User management module has been migrated to a separate page'}</p>
                  <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white" onClick={() => router.push(`/${locale}/admin/users`)}>
                    {locale === 'zh' ? '立即前往' : 'Go Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regulations">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>{locale === 'zh' ? '法规管理' : 'Regulation Management'}</CardTitle>
                  <CardDescription>{locale === 'zh' ? '管理法规知识库内容，新增、编辑、更新法规' : 'Manage regulation knowledge base content, add, edit, update regulations'}</CardDescription>
                </div>
                <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white" onClick={() => router.push(`/${locale}/admin/regulations`)}>
                  {locale === 'zh' ? '进入法规管理' : 'Go to Regulation Management'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">{locale === 'zh' ? '法规管理模块已迁移到独立页面' : 'Regulation management module has been migrated to a separate page'}</p>
                  <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white" onClick={() => router.push(`/${locale}/admin/regulations`)}>
                    {locale === 'zh' ? '立即前往' : 'Go Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>模板管理</CardTitle>
                  <CardDescription>管理文档模板库，新增、编辑、更新模板文件</CardDescription>
                </div>
                <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">
                  上传新模板
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  功能开发中...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>项目管理</CardTitle>
                  <CardDescription>查看所有用户的合规项目，管理项目状态</CardDescription>
                </div>
                <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">
                  导出项目数据
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  功能开发中...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
