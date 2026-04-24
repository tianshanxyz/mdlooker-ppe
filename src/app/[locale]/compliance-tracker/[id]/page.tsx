'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Plus, FileText, Calendar, Clock, Trash2, Upload, Download, Loader2, User, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

type Task = {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
};

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
  description?: string;
  notes?: string;
  notify_before_expiration: boolean;
  notification_days: number;
  created_at: string;
  tasks: Task[];
  attachments: any[];
};

export default function ComplianceProjectDetailPage() {
  const t = useTranslations('common');
  const ct = useTranslations('complianceTracker');
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { user, loading } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 编辑表单数据
  const [editFormData, setEditFormData] = useState({
    name: '',
    productCategory: '',
    targetMarket: '',
    certificationType: '',
    status: '',
    progress: 0,
    expectedCompletionDate: '',
    expirationDate: '',
    description: '',
    notifyBeforeExpiration: true,
    notificationDays: 30
  });

  // 新建任务表单
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'medium' as const
  });

  // 未登录跳转到登录页
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, loading, router, locale]);

  // 获取项目详情
  useEffect(() => {
    if (user && projectId) {
      fetchProject();
    }
  }, [user, projectId, locale]);

  const fetchProject = async () => {
    try {
      setLoadingProject(true);
      // 模拟数据
      setTimeout(() => {
        setProject({
          id: projectId,
          name: 'FFP2口罩CE认证',
          product_category: 'masks',
          target_market: 'eu',
          certification_type: 'CE',
          status: 'processing',
          progress: 65,
          start_date: '2026-04-01',
          expected_completion_date: '2026-05-15',
          expiration_date: '2027-05-15',
          description: 'FFP2防护口罩欧盟CE认证项目，符合EN 149:2001+A1:2009标准',
          notify_before_expiration: true,
          notification_days: 30,
          created_at: '2026-04-01T10:00:00Z',
          tasks: [
            {
              id: '1',
              name: '提交技术文档',
              description: '提交产品规格、测试报告、风险评估等技术文档',
              status: 'completed',
              due_date: '2026-04-10',
              assignee: '张三',
              priority: 'high',
              created_at: '2026-04-01T10:30:00Z'
            },
            {
              id: '2',
              name: '样品测试',
              description: '送样到公告机构进行性能测试',
              status: 'in_progress',
              due_date: '2026-04-30',
              assignee: '李四',
              priority: 'high',
              created_at: '2026-04-02T09:15:00Z'
            },
            {
              id: '3',
              name: '工厂审核',
              description: '公告机构到生产工厂进行质量管理体系审核',
              status: 'pending',
              due_date: '2026-05-10',
              assignee: '王五',
              priority: 'medium',
              created_at: '2026-04-02T14:45:00Z'
            }
          ],
          attachments: []
        });
        // 初始化编辑表单
        setEditFormData({
          name: 'FFP2口罩CE认证',
          productCategory: 'masks',
          targetMarket: 'eu',
          certificationType: 'CE',
          status: 'processing',
          progress: 65,
          expectedCompletionDate: '2026-05-15',
          expirationDate: '2027-05-15',
          description: 'FFP2防护口罩欧盟CE认证项目，符合EN 149:2001+A1:2009标准',
          notifyBeforeExpiration: true,
          notificationDays: 30
        });
        setLoadingProject(false);
      }, 1000);
    } catch (error) {
      console.error('Fetch project error:', error);
      router.push(`/${locale}/compliance-tracker`);
    } finally {
      setLoadingProject(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // 模拟更新成功
      setTimeout(() => {
        setEditDialogOpen(false);
        setSuccess(ct('updateSuccess'));
        setTimeout(() => setSuccess(''), 3000);
        fetchProject();
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Update project error:', error);
      setError(locale === 'zh' ? '更新失败，请稍后重试' : 'Update failed, please try again later');
      setSubmitting(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskFormData.name) {
      setError(locale === 'zh' ? '任务名称不能为空' : 'Task name cannot be empty');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      // 模拟创建成功
      setTimeout(() => {
        setTaskDialogOpen(false);
        setSuccess(ct('taskCreateSuccess'));
        setTimeout(() => setSuccess(''), 3000);
        // 重置表单
        setTaskFormData({
          name: '',
          description: '',
          dueDate: '',
          assignee: '',
          priority: 'medium'
        });
        fetchProject();
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Create task error:', error);
      setError(locale === 'zh' ? '创建失败，请稍后重试' : 'Creation failed, please try again later');
      setSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      // 模拟更新成功
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        };
      });
      // 重新计算进度
      setProject(prev => {
        if (!prev) return prev;
        const completedTasks = prev.tasks.filter(t => t.status === 'completed').length;
        const totalTasks = prev.tasks.length;
        const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return { ...prev, progress: newProgress };
      });
    } catch (error) {
      console.error('Update task status error:', error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      // 模拟删除成功
      router.push(`/${locale}/compliance-tracker`);
    } catch (error) {
      console.error('Delete project error:', error);
    }
  };

  // 状态配置
  const statusConfig = {
    pending: { label: ct('statusPending'), color: 'bg-gray-100 text-gray-700', icon: Clock },
    processing: { label: ct('statusProcessing'), color: 'bg-blue-100 text-blue-700', icon: FileText },
    reviewing: { label: ct('statusReviewing'), color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    completed: { label: ct('statusCompleted'), color: 'bg-green-100 text-green-700', icon: FileText },
    rejected: { label: ct('statusRejected'), color: 'bg-red-100 text-red-700', icon: FileText },
    expired: { label: ct('statusExpired'), color: 'bg-purple-100 text-purple-700', icon: Clock }
  };

  // 优先级配置
  const priorityConfig = {
    low: { label: ct('priorityLow'), color: 'bg-gray-100 text-gray-700' },
    medium: { label: ct('priorityMedium'), color: 'bg-blue-100 text-blue-700' },
    high: { label: ct('priorityHigh'), color: 'bg-orange-100 text-orange-700' },
    urgent: { label: ct('priorityUrgent'), color: 'bg-red-100 text-red-700' }
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

  const taskStatusLabels = {
    pending: locale === 'zh' ? '待处理' : 'Pending',
    in_progress: locale === 'zh' ? '进行中' : 'In Progress',
    completed: locale === 'zh' ? '已完成' : 'Completed',
    cancelled: locale === 'zh' ? '已取消' : 'Cancelled'
  };

  if (loading || !user || loadingProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#339999] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{locale === 'zh' ? '项目不存在' : 'Project Not Found'}</h1>
          <p className="text-gray-500 mb-6">{locale === 'zh' ? '您访问的项目不存在或已被删除' : 'The project you visited does not exist or has been deleted'}</p>
          <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[project.status];
  const StatusIcon = status.icon;
  const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = project.tasks.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 顶部导航 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-500">{project.certification_type} · {marketLabels[project.target_market as keyof typeof marketLabels]}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color} flex items-center gap-1`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </span>
            </div>
            <div className="flex gap-2">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    {ct('editProject')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{ct('editProject')}</DialogTitle>
                    <DialogDescription>{locale === 'zh' ? '修改项目基本信息和设置' : 'Modify project basic information and settings'}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdateProject}>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">{ct('projectName')}</Label>
                        <Input
                          id="edit-name"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-productCategory">{ct('productCategory')}</Label>
                          <Select
                            value={editFormData.productCategory}
                            onValueChange={(value) => setEditFormData({ ...editFormData, productCategory: value })}
                          >
                            <SelectTrigger id="edit-productCategory">
                              <SelectValue />
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
                          <Label htmlFor="edit-targetMarket">{ct('targetMarket')}</Label>
                          <Select
                            value={editFormData.targetMarket}
                            onValueChange={(value) => setEditFormData({ ...editFormData, targetMarket: value })}
                          >
                            <SelectTrigger id="edit-targetMarket">
                              <SelectValue />
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
                          <Label htmlFor="edit-certificationType">{ct('certificationType')}</Label>
                          <Input
                            id="edit-certificationType"
                            value={editFormData.certificationType}
                            onChange={(e) => setEditFormData({ ...editFormData, certificationType: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-status">{t('status')}</Label>
                          <Select
                            value={editFormData.status}
                            onValueChange={(value) => setEditFormData({ ...editFormData, status: value as any })}
                          >
                            <SelectTrigger id="edit-status">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{ct('statusPending')}</SelectItem>
                              <SelectItem value="processing">{ct('statusProcessing')}</SelectItem>
                              <SelectItem value="reviewing">{ct('statusReviewing')}</SelectItem>
                              <SelectItem value="completed">{ct('statusCompleted')}</SelectItem>
                              <SelectItem value="rejected">{ct('statusRejected')}</SelectItem>
                              <SelectItem value="expired">{ct('statusExpired')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-progress">{t('progress')} (%)</Label>
                          <Input
                            id="edit-progress"
                            type="number"
                            min={0}
                            max={100}
                            value={editFormData.progress}
                            onChange={(e) => setEditFormData({ ...editFormData, progress: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-expectedCompletionDate">{ct('expectedCompletionDate')}</Label>
                          <Input
                            id="edit-expectedCompletionDate"
                            type="date"
                            value={editFormData.expectedCompletionDate}
                            onChange={(e) => setEditFormData({ ...editFormData, expectedCompletionDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-expirationDate">{ct('expirationDate')}</Label>
                        <Input
                          id="edit-expirationDate"
                          type="date"
                          value={editFormData.expirationDate}
                          onChange={(e) => setEditFormData({ ...editFormData, expirationDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">{ct('projectDescription')}</Label>
                        <Textarea
                          id="edit-description"
                          rows={3}
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="edit-notify"
                            checked={editFormData.notifyBeforeExpiration}
                            onCheckedChange={(checked) => setEditFormData({ ...editFormData, notifyBeforeExpiration: checked as boolean })}
                          />
                          <Label htmlFor="edit-notify">{ct('expirationReminder')}</Label>
                        </div>
                        {editFormData.notifyBeforeExpiration && (
                          <div className="pl-6 space-y-2">
                            <Label htmlFor="edit-notificationDays">{ct('reminderDays')}</Label>
                            <Input
                              id="edit-notificationDays"
                              type="number"
                              min={7}
                              max={180}
                              value={editFormData.notificationDays}
                              onChange={(e) => setEditFormData({ ...editFormData, notificationDays: parseInt(e.target.value) || 30 })}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter className="flex justify-between">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {ct('deleteProject')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{ct('deleteConfirm')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {ct('deleteConfirmDesc')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
                              {locale === 'zh' ? '确认删除' : 'Confirm Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={() => setEditDialogOpen(false)} disabled={submitting}>
                          {t('cancel')}
                        </Button>
                        <Button type="submit" className="bg-[#339999] hover:bg-[#2d8a8a] text-white" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {locale === 'zh' ? '保存中...' : 'Saving...'}
                            </>
                          ) : (
                            t('save')
                          )}
                        </Button>
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 成功提示 */}
          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* 项目概览卡片 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{ct('projectOverview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('progress')}</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex justify-between text-sm pt-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{t('tasks')}</span>
                    </div>
                    <span className="font-medium">{completedTasks}/{totalTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{ct('timeInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{ct('startDate')}</span>
                  <span className="font-medium">{new Date(project.start_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                </div>
                {project.expected_completion_date && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{ct('expectedCompletionDate')}</span>
                    <span className="font-medium">{new Date(project.expected_completion_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                  </div>
                )}
                {project.expiration_date && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{ct('expirationDate')}</span>
                    <span className="font-medium text-orange-600">{new Date(project.expiration_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{ct('notificationSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{ct('expirationReminder')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.notify_before_expiration ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {project.notify_before_expiration ? ct('enabled') : ct('disabled')}
                  </span>
                </div>
                {project.notify_before_expiration && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{ct('reminderDays')}</span>
                    <span className="font-medium">{project.notification_days} {ct('days')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabs内容 */}
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tasks" className="text-base px-6">
                <FileText className="h-4 w-4 mr-2" />
                {ct('taskManagement')}
              </TabsTrigger>
              <TabsTrigger value="details" className="text-base px-6">
                <FileText className="h-4 w-4 mr-2" />
                {ct('projectDetails')}
              </TabsTrigger>
              <TabsTrigger value="attachments" className="text-base px-6">
                <Upload className="h-4 w-4 mr-2" />
                {ct('attachmentManagement')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>{t('tasks')}</CardTitle>
                    <CardDescription>{locale === 'zh' ? '管理项目的所有待办任务，跟踪进度' : 'Manage all to-do tasks of the project, track progress'}</CardDescription>
                  </div>
                  <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        {ct('createTask')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{ct('createTask')}</DialogTitle>
                        <DialogDescription>{locale === 'zh' ? '添加新的待办任务到项目中' : 'Add a new to-do task to the project'}</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateTask}>
                        {error && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="task-name">{ct('taskName')} <span className="text-red-500">*</span></Label>
                            <Input
                              id="task-name"
                              placeholder={locale === 'zh' ? '例如：提交技术文档' : 'e.g. Submit technical documentation'}
                              value={taskFormData.name}
                              onChange={(e) => setTaskFormData({ ...taskFormData, name: e.target.value })}
                              disabled={submitting}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="task-description">{ct('taskDescription')}</Label>
                            <Textarea
                              id="task-description"
                              placeholder={locale === 'zh' ? '输入任务详细描述' : 'Enter detailed task description'}
                              rows={3}
                              value={taskFormData.description}
                              onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                              disabled={submitting}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="task-dueDate">{t('dueDate')}</Label>
                              <Input
                                id="task-dueDate"
                                type="date"
                                value={taskFormData.dueDate}
                                onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                                disabled={submitting}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="task-priority">{t('priority')}</Label>
                              <Select
                                value={taskFormData.priority}
                                onValueChange={(value) => setTaskFormData({ ...taskFormData, priority: value as any })}
                              >
                                <SelectTrigger id="task-priority">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">{ct('priorityLow')}</SelectItem>
                                  <SelectItem value="medium">{ct('priorityMedium')}</SelectItem>
                                  <SelectItem value="high">{ct('priorityHigh')}</SelectItem>
                                  <SelectItem value="urgent">{ct('priorityUrgent')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="task-assignee">{t('assignee')}</Label>
                            <Input
                              id="task-assignee"
                              placeholder={locale === 'zh' ? '输入负责人姓名' : 'Enter assignee name'}
                              value={taskFormData.assignee}
                              onChange={(e) => setTaskFormData({ ...taskFormData, assignee: e.target.value })}
                              disabled={submitting}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="secondary" onClick={() => setTaskDialogOpen(false)} disabled={submitting}>
                            {t('cancel')}
                          </Button>
                          <Button type="submit" className="bg-[#339999] hover:bg-[#2d8a8a] text-white" disabled={submitting}>
                            {submitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {locale === 'zh' ? '创建中...' : 'Creating...'}
                              </>
                            ) : (
                              ct('createTask')
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {project.tasks.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{ct('noTasks')}</h3>
                      <p className="text-gray-500 mb-6">{ct('noTasksDesc')}</p>
                      <Button
                        className="bg-[#339999] hover:bg-[#2d8a8a] text-white"
                        onClick={() => setTaskDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {ct('createTask')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {project.tasks.map((task) => {
                        const priority = priorityConfig[task.priority];
                        const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                        return (
                          <div key={task.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-start gap-3">
                              <div className="pt-0.5">
                                <Checkbox
                                  checked={task.status === 'completed'}
                                  onCheckedChange={(checked) => handleUpdateTaskStatus(task.id, checked ? 'completed' : 'pending')}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {task.name}
                                  </h4>
                                  <Badge className={priority.color}>{priority.label}</Badge>
                                  {isOverdue && (
                                    <Badge className="bg-red-100 text-red-700">{ct('overdue')}</Badge>
                                  )}
                                </div>
                                {task.description && (
                                  <p className={`text-sm mt-1 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  {task.due_date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      <span>{t('dueDate')}: {new Date(task.due_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                                    </div>
                                  )}
                                  {task.assignee && (
                                    <div className="flex items-center gap-1">
                                      <User className="h-3.5 w-3.5" />
                                      <span>{t('assignee')}: {task.assignee}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{ct('createdAt')}: {new Date(task.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Select
                              defaultValue={task.status}
                              onValueChange={(value) => handleUpdateTaskStatus(task.id, value as any)}
                            >
                              <SelectTrigger className="w-28 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">{locale === 'zh' ? '待处理' : 'Pending'}</SelectItem>
                                <SelectItem value="in_progress">{locale === 'zh' ? '进行中' : 'In Progress'}</SelectItem>
                                <SelectItem value="completed">{locale === 'zh' ? '已完成' : 'Completed'}</SelectItem>
                                <SelectItem value="cancelled">{locale === 'zh' ? '已取消' : 'Cancelled'}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>{ct('projectDetails')}</CardTitle>
                  <CardDescription>{locale === 'zh' ? '项目的详细信息和描述' : 'Detailed information and description of the project'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{ct('productInfo')}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{ct('productCategory')}: </span>
                        <span className="font-medium">
                          {productCategoryLabels[project.product_category as keyof typeof productCategoryLabels]}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">{ct('targetMarket')}: </span>
                        <span className="font-medium">
                          {marketLabels[project.target_market as keyof typeof marketLabels]}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">{ct('certificationType')}: </span>
                        <span className="font-medium">{project.certification_type}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {project.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">{ct('projectDescription')}</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                    </div>
                  )}

                  {project.notes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">{locale === 'zh' ? '备注信息' : 'Notes'}</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{project.notes}</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{locale === 'zh' ? '创建信息' : 'Creation Information'}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{ct('createdAt')}: </span>
                        <span className="font-medium">{new Date(project.created_at).toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>{ct('attachmentManagement')}</CardTitle>
                    <CardDescription>{locale === 'zh' ? '上传和管理项目相关的文件、证书、文档' : 'Upload and manage project related files, certificates, documents'}</CardDescription>
                  </div>
                  <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">
                    <Upload className="mr-2 h-4 w-4" />
                    {ct('uploadFile')}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{ct('noAttachments')}</h3>
                    <p className="text-gray-500 mb-6">{ct('noAttachmentsDesc')}</p>
                    <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">
                      <Upload className="mr-2 h-4 w-4" />
                      {ct('uploadAttachment')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
