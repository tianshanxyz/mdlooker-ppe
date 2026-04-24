'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, FileText, Calendar, Clock, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

type Project = {
  id: string;
  name: string;
  product_category: string;
  target_market: string;
  certification_type: string;
  status: 'pending' | 'processing' | 'reviewing' | 'completed' | 'rejected' | 'expired';
  progress: number;
  start_date: string;
  expected_completion_date: string;
  expiration_date?: string;
  created_at: string;
  tasks: { count: number }[];
};

export default function ComplianceTrackerPage() {
  const t = useTranslations('common');
  const ct = useTranslations('complianceTracker');
  const locale = useLocale();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    productCategory: '',
    targetMarket: '',
    certificationType: '',
    expectedCompletionDate: '',
    expirationDate: '',
    description: ''
  });

  // 未登录跳转到登录页
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, loading, router, locale]);

  // 获取项目列表
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      // 模拟数据
      setTimeout(() => {
        setProjects([
          {
            id: '1',
            name: 'FFP2口罩CE认证',
            product_category: 'masks',
            target_market: 'eu',
            certification_type: 'CE',
            status: 'processing',
            progress: 65,
            start_date: '2026-04-01',
            expected_completion_date: '2026-05-15',
            created_at: '2026-04-01T10:00:00Z',
            tasks: [{ count: 8 }]
          },
          {
            id: '2',
            name: '医用防护服FDA认证',
            product_category: 'protective_clothing',
            target_market: 'us',
            certification_type: 'FDA',
            status: 'reviewing',
            progress: 85,
            start_date: '2026-03-10',
            expected_completion_date: '2026-04-30',
            created_at: '2026-03-10T14:30:00Z',
            tasks: [{ count: 12 }]
          },
          {
            id: '3',
            name: '一次性手套UKCA认证',
            product_category: 'gloves',
            target_market: 'uk',
            certification_type: 'UKCA',
            status: 'completed',
            progress: 100,
            start_date: '2026-02-15',
            expected_completion_date: '2026-03-30',
            expiration_date: '2027-03-30',
            created_at: '2026-02-15T09:15:00Z',
            tasks: [{ count: 6 }]
          }
        ]);
        setLoadingProjects(false);
      }, 1000);
    } catch (error) {
      console.error('Fetch projects error:', error);
      setLoadingProjects(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.productCategory || !formData.targetMarket || !formData.certificationType) {
      setError(ct('errorRequiredFields'));
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 模拟创建成功
      setTimeout(() => {
        setDialogOpen(false);
        fetchProjects();
        // 重置表单
        setFormData({
          name: '',
          productCategory: '',
          targetMarket: '',
          certificationType: '',
          expectedCompletionDate: '',
          expirationDate: '',
          description: ''
        });
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Create project error:', error);
      setError(ct('errorCreateFailed'));
      setSubmitting(false);
    }
  };

  // 过滤项目
  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.certification_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // 状态配置
  const statusConfig = {
    pending: { label: ct('statusPending'), color: 'bg-gray-100 text-gray-700', icon: Clock },
    processing: { label: ct('statusProcessing'), color: 'bg-blue-100 text-blue-700', icon: FileText },
    reviewing: { label: ct('statusReviewing'), color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    completed: { label: ct('statusCompleted'), color: 'bg-green-100 text-green-700', icon: FileText },
    rejected: { label: ct('statusRejected'), color: 'bg-red-100 text-red-700', icon: FileText },
    expired: { label: ct('statusExpired'), color: 'bg-purple-100 text-purple-700', icon: Clock }
  };

  const productCategoryLabels = {
    masks: locale === 'zh' ? '口罩' : 'Masks',
    protective_clothing: locale === 'zh' ? '防护服' : 'Protective Clothing',
    gloves: locale === 'zh' ? '防护手套' : 'Protective Gloves',
    goggles: locale === 'zh' ? '护目镜' : 'Goggles',
    face_shield: locale === 'zh' ? '面屏' : 'Face Shield'
  };

  const marketLabels = {
    eu: 'EU',
    us: 'USA',
    uk: 'UK',
    middle_east: locale === 'zh' ? '中东' : 'Middle East',
    jp: 'Japan',
    kr: 'Korea'
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#339999] mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{ct('title')}</h1>
              <p className="text-gray-600">{ct('subtitle')}</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  {ct('createProject')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{ct('createProject')}</DialogTitle>
                  <DialogDescription>{locale === 'zh' ? '填写项目基本信息，开始追踪您的认证进度' : 'Fill in the basic project information to start tracking your certification progress'}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject}>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{ct('projectName')} <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        placeholder={locale === 'zh' ? '例如：FFP2口罩CE认证' : 'e.g. FFP2 Mask CE Certification'}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productCategory">{ct('productCategory')} <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.productCategory}
                          onValueChange={(value) => setFormData({ ...formData, productCategory: value })}
                        >
                          <SelectTrigger id="productCategory">
                            <SelectValue placeholder={locale === 'zh' ? '选择产品类别' : 'Select product category'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masks">{locale === 'zh' ? '口罩' : 'Masks'}</SelectItem>
                            <SelectItem value="protective_clothing">{locale === 'zh' ? '防护服' : 'Protective Clothing'}</SelectItem>
                            <SelectItem value="gloves">{locale === 'zh' ? '防护手套' : 'Protective Gloves'}</SelectItem>
                            <SelectItem value="goggles">{locale === 'zh' ? '护目镜' : 'Goggles'}</SelectItem>
                            <SelectItem value="face_shield">{locale === 'zh' ? '面屏' : 'Face Shield'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetMarket">{ct('targetMarket')} <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.targetMarket}
                          onValueChange={(value) => setFormData({ ...formData, targetMarket: value })}
                        >
                          <SelectTrigger id="targetMarket">
                            <SelectValue placeholder={locale === 'zh' ? '选择目标市场' : 'Select target market'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eu">EU</SelectItem>
                            <SelectItem value="us">USA</SelectItem>
                            <SelectItem value="uk">UK</SelectItem>
                            <SelectItem value="middle_east">{locale === 'zh' ? '中东' : 'Middle East'}</SelectItem>
                            <SelectItem value="jp">Japan</SelectItem>
                            <SelectItem value="kr">Korea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="certificationType">{ct('certificationType')} <span className="text-red-500">*</span></Label>
                        <Input
                          id="certificationType"
                          placeholder={locale === 'zh' ? '例如：CE/FDA/UKCA' : 'e.g. CE/FDA/UKCA'}
                          value={formData.certificationType}
                          onChange={(e) => setFormData({ ...formData, certificationType: e.target.value })}
                          disabled={submitting}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expectedCompletionDate">{ct('expectedCompletionDate')}</Label>
                        <Input
                          id="expectedCompletionDate"
                          type="date"
                          value={formData.expectedCompletionDate}
                          onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                          disabled={submitting}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expirationDate">{ct('expirationDate')}</Label>
                      <Input
                        id="expirationDate"
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">{ct('projectDescription')}</Label>
                      <Textarea
                        id="description"
                        placeholder={locale === 'zh' ? '输入项目描述、备注信息' : 'Enter project description and notes'}
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)} disabled={submitting}>
                      {t('cancel')}
                    </Button>
                    <Button type="submit" className="bg-[#339999] hover:bg-[#2d8a8a] text-white" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {locale === 'zh' ? '创建中...' : 'Creating...'}
                        </>
                      ) : (
                        ct('createProject')
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* 筛选栏 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder={ct('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/3"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder={ct('filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'zh' ? '全部状态' : 'All Status'}</SelectItem>
                <SelectItem value="pending">{ct('statusPending')}</SelectItem>
                <SelectItem value="processing">{ct('statusProcessing')}</SelectItem>
                <SelectItem value="reviewing">{ct('statusReviewing')}</SelectItem>
                <SelectItem value="completed">{ct('statusCompleted')}</SelectItem>
                <SelectItem value="rejected">{ct('statusRejected')}</SelectItem>
                <SelectItem value="expired">{ct('statusExpired')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 项目列表 */}
          {loadingProjects ? (
            <div className="text-center py-16">
              <Loader2 className="h-12 w-12 text-[#339999] animate-spin mx-auto mb-4" />
              <p className="text-gray-500">{locale === 'zh' ? '加载项目中...' : 'Loading projects...'}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="max-w-sm mx-auto">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{ct('noProjects')}</h3>
                  <p className="text-gray-500 mb-6">{ct('noProjectsDesc')}</p>
                  <Button
                    className="bg-[#339999] hover:bg-[#2d8a8a] text-white"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {ct('createProject')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const status = statusConfig[project.status];
                const StatusIcon = status.icon;
                return (
                  <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/${locale}/compliance-tracker/${project.id}`)}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {project.certification_type} · {marketLabels[project.target_market as keyof typeof marketLabels]}
                          </CardDescription>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-600">{ct('progress')}</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(project.start_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>{project.tasks[0]?.count || 0} {t('tasks')}</span>
                          </div>
                        </div>
                        {project.expected_completion_date && (
                          <div className="text-sm text-gray-600 flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{ct('expectedCompletionDate')}: {new Date(project.expected_completion_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-end">
                      <Button variant="ghost" size="sm" className="text-[#339999] p-0">
                        {t('details')}
                        <Plus className="ml-1 h-4 w-4 rotate-45" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
