'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, CreditCard, User, Calendar, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/Link';

export default function DashboardPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checks, setChecks] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // 未登录跳转到登录页
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, loading, router, locale]);

  // 获取用户数据
  useEffect(() => {
    if (user) {
      // 模拟获取数据，后续对接真实API
      setChecks([
        {
          id: '1',
          productCategory: 'masks',
          productName: 'FFP2 防护口罩',
          targetMarket: 'eu',
          createdAt: '2026-04-20 14:30'
        },
        {
          id: '2',
          productCategory: 'protective_clothing',
          productName: '医用防护服',
          targetMarket: 'us',
          createdAt: '2026-04-18 09:15'
        }
      ]);

      setDownloads([
        {
          id: '1',
          fileName: 'EU PPE DoC符合性声明模板.docx',
          fileType: 'template',
          fileSize: '24KB',
          createdAt: '2026-04-20 14:35'
        },
        {
          id: '2',
          fileName: 'FFP2口罩欧盟合规报告.pdf',
          fileType: 'report',
          fileSize: '2.4MB',
          createdAt: '2026-04-18 09:20'
        }
      ]);

      setLoadingData(false);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#339999] mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const planNames = {
    free: '免费版',
    pro: 'Pro版',
    enterprise: '企业版'
  };

  const planColors = {
    free: 'bg-gray-100 text-gray-700',
    pro: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">个人中心</h1>
            <p className="text-gray-600">欢迎回来，{user.name}，查看您的使用记录和账号信息</p>
          </div>

          {/* 账号概览 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-[#339999]" />
                  账号信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">邮箱</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">当前套餐</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[user.plan]}`}>
                      {planNames[user.plan]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">注册时间</span>
                    <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#339999]" />
                  使用统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">本月使用次数</span>
                    <span className="font-medium">
                      {user.usageCount} / {user.plan === 'free' ? '3' : '无限'}
                    </span>
                  </div>
                  {user.plan === 'free' && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-[#339999] h-2.5 rounded-full" 
                        style={{ width: `${Math.min((user.usageCount / 3) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">最近使用</span>
                    <span className="font-medium">{user.last_used_at ? new Date(user.last_used_at).toLocaleDateString('zh-CN') : '暂无'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#339999]" />
                  套餐升级
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.plan === 'free' && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800 text-sm">
                      升级到Pro版，解锁无限次合规检查、完整知识库访问、无限次模板下载等高级功能
                    </AlertDescription>
                  </Alert>
                )}
                <Link href={`/${locale}/pricing`}>
                  <Button className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white">
                    查看套餐方案
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 功能Tabs */}
          <Tabs defaultValue="checks" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="checks" className="text-base px-6">
                <FileText className="h-4 w-4 mr-2" />
                合规检查记录
              </TabsTrigger>
              <TabsTrigger value="downloads" className="text-base px-6">
                <Download className="h-4 w-4 mr-2" />
                下载历史
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checks">
              <Card>
                <CardHeader>
                  <CardTitle>合规检查记录</CardTitle>
                  <CardDescription>您最近的合规检查历史，点击可以查看详情</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#339999] mx-auto mb-2"></div>
                      <p className="text-gray-500">加载中...</p>
                    </div>
                  ) : checks.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">暂无合规检查记录</p>
                      <Link href={`/${locale}/compliance-tools`}>
                        <Button variant="secondary" className="mt-4">
                          开始第一次检查
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-3 font-medium text-gray-600">产品名称</th>
                            <th className="pb-3 font-medium text-gray-600">产品类别</th>
                            <th className="pb-3 font-medium text-gray-600">目标市场</th>
                            <th className="pb-3 font-medium text-gray-600">检查时间</th>
                            <th className="pb-3 font-medium text-gray-600 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {checks.map((check) => (
                            <tr key={check.id} className="border-b last:border-0">
                              <td className="py-4">{check.productName}</td>
                              <td className="py-4">
                                {check.productCategory === 'masks' ? '口罩' : 
                                 check.productCategory === 'protective_clothing' ? '防护服' : '手套'}
                              </td>
                              <td className="py-4">
                                {check.targetMarket === 'eu' ? '欧盟' : 
                                 check.targetMarket === 'us' ? '美国' : 
                                 check.targetMarket === 'uk' ? '英国' : '其他'}
                              </td>
                              <td className="py-4">{check.createdAt}</td>
                              <td className="py-4 text-right">
                                <Button variant="ghost" size="sm" className="text-[#339999]">
                                  查看详情
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="downloads">
              <Card>
                <CardHeader>
                  <CardTitle>下载历史</CardTitle>
                  <CardDescription>您下载过的所有文件记录</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#339999] mx-auto mb-2"></div>
                      <p className="text-gray-500">加载中...</p>
                    </div>
                  ) : downloads.length === 0 ? (
                    <div className="text-center py-8">
                      <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">暂无下载记录</p>
                      <Link href={`/${locale}/compliance-tools?tab=templates`}>
                        <Button variant="secondary" className="mt-4">
                          浏览模板库
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="pb-3 font-medium text-gray-600">文件名</th>
                            <th className="pb-3 font-medium text-gray-600">文件类型</th>
                            <th className="pb-3 font-medium text-gray-600">文件大小</th>
                            <th className="pb-3 font-medium text-gray-600">下载时间</th>
                            <th className="pb-3 font-medium text-gray-600 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {downloads.map((download) => (
                            <tr key={download.id} className="border-b last:border-0">
                              <td className="py-4">{download.fileName}</td>
                              <td className="py-4">
                                {download.fileType === 'template' ? '模板' : 
                                 download.fileType === 'report' ? '报告' : 
                                 download.fileType === 'compliance_package' ? '合规包' : '其他'}
                              </td>
                              <td className="py-4">{download.fileSize}</td>
                              <td className="py-4">{download.createdAt}</td>
                              <td className="py-4 text-right">
                                <Button variant="ghost" size="sm" className="text-[#339999]">
                                  重新下载
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}