'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Edit, Trash2, BookOpen, Calendar, Globe, FileText } from 'lucide-react';

type Regulation = {
  id: string;
  title: string;
  standard_no?: string;
  category: 'masks' | 'protective_clothing' | 'gloves' | 'goggles' | 'face_shield' | 'other';
  target_market: 'eu' | 'us' | 'uk' | 'middle_east' | 'jp' | 'kr' | 'other';
  content?: string;
  official_url?: string;
  effective_date?: string;
  expiration_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// 分类选项
const categoryOptions = [
  { value: 'masks', label: '口罩', enLabel: 'Masks' },
  { value: 'protective_clothing', label: '防护服', enLabel: 'Protective Clothing' },
  { value: 'gloves', label: '防护手套', enLabel: 'Gloves' },
  { value: 'goggles', label: '护目镜', enLabel: 'Goggles' },
  { value: 'face_shield', label: '面屏', enLabel: 'Face Shield' },
  { value: 'other', label: '其他', enLabel: 'Other' }
];

// 地区选项
const marketOptions = [
  { value: 'eu', label: '欧盟', enLabel: 'EU' },
  { value: 'us', label: '美国', enLabel: 'USA' },
  { value: 'uk', label: '英国', enLabel: 'UK' },
  { value: 'middle_east', label: '中东', enLabel: 'Middle East' },
  { value: 'jp', label: '日本', enLabel: 'Japan' },
  { value: 'kr', label: '韩国', enLabel: 'Korea' },
  { value: 'other', label: '其他', enLabel: 'Other' }
];

export default function AdminRegulationsPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [marketFilter, setMarketFilter] = useState('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentRegulation, setCurrentRegulation] = useState<Regulation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    title: '',
    standard_no: '',
    category: 'masks',
    target_market: 'eu',
    content: '',
    official_url: '',
    effective_date: '',
    expiration_date: '',
    is_active: true
  });

  // 验证管理员身份，未登录跳转到登录页
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push(`/${locale}/admin/login`);
      return;
    }
    fetchRegulations();
  }, [router, locale, pagination.page, search, categoryFilter, marketFilter]);

  // 获取法规列表
  const fetchRegulations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      if (search) params.append('search', search);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
      if (marketFilter && marketFilter !== 'all') params.append('target_market', marketFilter);

      const res = await fetch(`/api/admin/regulations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setRegulations(data.regulations);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        }));
      } else if (res.status === 401) {
        // Token过期，跳转到登录页
        localStorage.removeItem('adminToken');
        router.push(`/${locale}/admin/login`);
      }
    } catch (error) {
      console.error('获取法规列表错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchRegulations();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 处理分类筛选变化
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 处理地区筛选变化
  const handleMarketFilterChange = (value: string) => {
    setMarketFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // 获取分类标签
  const getCategoryLabel = (category: string) => {
    const option = categoryOptions.find(item => item.value === category);
    if (!option) return category;
    return locale === 'zh' ? option.label : option.enLabel;
  };

  // 获取地区标签
  const getMarketLabel = (market: string) => {
    const option = marketOptions.find(item => item.value === market);
    if (!option) return market;
    return locale === 'zh' ? option.label : option.enLabel;
  };

  // 打开编辑弹窗
  const handleEditRegulation = (regulation: Regulation) => {
    setCurrentRegulation(regulation);
    setFormData({
      title: regulation.title,
      standard_no: regulation.standard_no || '',
      category: regulation.category,
      target_market: regulation.target_market,
      content: regulation.content || '',
      official_url: regulation.official_url || '',
      effective_date: regulation.effective_date ? new Date(regulation.effective_date).toISOString().split('T')[0] : '',
      expiration_date: regulation.expiration_date ? new Date(regulation.expiration_date).toISOString().split('T')[0] : '',
      is_active: regulation.is_active
    });
    setEditDialogOpen(true);
  };

  // 打开创建弹窗
  const handleCreateRegulation = () => {
    setFormData({
      title: '',
      standard_no: '',
      category: 'masks',
      target_market: 'eu',
      content: '',
      official_url: '',
      effective_date: '',
      expiration_date: '',
      is_active: true
    });
    setCreateDialogOpen(true);
  };

  // 打开删除确认
  const handleDeleteRegulation = (regulation: Regulation) => {
    setCurrentRegulation(regulation);
    setDeleteDialogOpen(true);
  };

  // 提交创建法规
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.target_market) {
      alert(locale === 'zh' ? '请填写必填项（标题、分类、目标市场）' : 'Please fill in required fields (title, category, target market)');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/regulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setCreateDialogOpen(false);
        fetchRegulations();
        alert(locale === 'zh' ? '法规创建成功' : 'Regulation created successfully');
      } else {
        const data = await res.json();
        alert(data.error || (locale === 'zh' ? '创建失败' : 'Creation failed'));
      }
    } catch (error) {
      console.error('创建法规错误:', error);
      alert(locale === 'zh' ? '创建失败，请稍后重试' : 'Creation failed, please try again later');
    } finally {
      setSubmitting(false);
    }
  };

  // 提交编辑法规
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRegulation) return;
    if (!formData.title || !formData.category || !formData.target_market) {
      alert(locale === 'zh' ? '请填写必填项（标题、分类、目标市场）' : 'Please fill in required fields (title, category, target market)');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/regulations/${currentRegulation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setEditDialogOpen(false);
        fetchRegulations();
        alert(locale === 'zh' ? '法规更新成功' : 'Regulation updated successfully');
      } else {
        const data = await res.json();
        alert(data.error || (locale === 'zh' ? '更新失败' : 'Update failed'));
      }
    } catch (error) {
      console.error('更新法规错误:', error);
      alert(locale === 'zh' ? '更新失败，请稍后重试' : 'Update failed, please try again later');
    } finally {
      setSubmitting(false);
    }
  };

  // 确认删除法规
  const confirmDeleteRegulation = async () => {
    if (!currentRegulation) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/regulations/${currentRegulation.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setDeleteDialogOpen(false);
        fetchRegulations();
        alert(locale === 'zh' ? '法规删除成功' : 'Regulation deleted successfully');
      } else {
        const data = await res.json();
        alert(data.error || (locale === 'zh' ? '删除失败' : 'Deletion failed'));
      }
    } catch (error) {
      console.error('删除法规错误:', error);
      alert(locale === 'zh' ? '删除失败，请稍后重试' : 'Deletion failed, please try again later');
    }
  };

  if (loading && regulations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#339999] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{locale === 'zh' ? '加载中...' : 'Loading...'}</p>
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
            <span className="font-bold text-xl text-gray-900">MDLOOKER {locale === 'zh' ? '管理后台' : 'Admin'}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem('adminToken');
              router.push(`/${locale}/admin/login`);
            }}
            className="text-red-600"
          >
            <FileText className="h-4 w-4 mr-2" />
            {locale === 'zh' ? '退出登录' : 'Logout'}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 面包屑 */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/admin`)} className="p-0 h-auto text-gray-600">
              {locale === 'zh' ? '首页' : 'Home'}
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{locale === 'zh' ? '法规管理' : 'Regulation Management'}</span>
          </div>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>{locale === 'zh' ? '法规管理' : 'Regulation Management'}</CardTitle>
                <CardDescription>{locale === 'zh' ? '管理全球法规标准，新增、编辑、更新内容' : 'Manage global regulation standards, add, edit, update content'}</CardDescription>
              </div>
              <Button
                className="bg-[#339999] hover:bg-[#2d8a8a] text-white"
                onClick={handleCreateRegulation}
              >
                <Plus className="mr-2 h-4 w-4" />
                {locale === 'zh' ? '新增法规' : 'Add Regulation'}
              </Button>
            </CardHeader>

            <CardContent>
              {/* 筛选栏 */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  placeholder={locale === 'zh' ? '搜索标题/标准号/内容' : 'Search title/standard no/content'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="md:w-1/3"
                />
                <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                  <SelectTrigger className="md:w-1/5">
                    <SelectValue placeholder={locale === 'zh' ? '筛选分类' : 'Filter by category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'zh' ? '全部分类' : 'All Categories'}</SelectItem>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {locale === 'zh' ? option.label : option.enLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={marketFilter} onValueChange={handleMarketFilterChange}>
                  <SelectTrigger className="md:w-1/5">
                    <SelectValue placeholder={locale === 'zh' ? '筛选地区' : 'Filter by region'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'zh' ? '全部地区' : 'All Regions'}</SelectItem>
                    {marketOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {locale === 'zh' ? option.label : option.enLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 法规列表 */}
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-[#339999] animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">{locale === 'zh' ? '加载中...' : 'Loading...'}</p>
                </div>
              ) : regulations.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{locale === 'zh' ? '暂无法规' : 'No Regulations'}</h3>
                  <p className="text-gray-500 mb-6">{locale === 'zh' ? '还没有添加任何法规标准' : 'No regulation standards have been added yet'}</p>
                  <Button
                    className="bg-[#339999] hover:bg-[#2d8a8a] text-white"
                    onClick={handleCreateRegulation}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {locale === 'zh' ? '新增法规' : 'Add Regulation'}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{locale === 'zh' ? '标题' : 'Title'}</TableHead>
                          <TableHead>{locale === 'zh' ? '标准号' : 'Standard No.'}</TableHead>
                          <TableHead>{locale === 'zh' ? '分类' : 'Category'}</TableHead>
                          <TableHead>{locale === 'zh' ? '目标市场' : 'Target Market'}</TableHead>
                          <TableHead>{locale === 'zh' ? '生效日期' : 'Effective Date'}</TableHead>
                          <TableHead>{locale === 'zh' ? '状态' : 'Status'}</TableHead>
                          <TableHead className="text-right">{locale === 'zh' ? '操作' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {regulations.map((regulation) => (
                          <TableRow key={regulation.id}>
                            <TableCell className="font-medium max-w-xs truncate">{regulation.title}</TableCell>
                            <TableCell>{regulation.standard_no || '-'}</TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700">
                                {getCategoryLabel(regulation.category)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-purple-100 text-purple-700">
                                {getMarketLabel(regulation.target_market)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {regulation.effective_date ? new Date(regulation.effective_date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US') : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge className={regulation.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                {regulation.is_active ? (locale === 'zh' ? '启用' : 'Active') : (locale === 'zh' ? '禁用' : 'Inactive')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRegulation(regulation)}
                                  className="h-8 px-2 text-blue-600"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  {locale === 'zh' ? '编辑' : 'Edit'}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRegulation(regulation)}
                                  className="h-8 px-2 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  {locale === 'zh' ? '删除' : 'Delete'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 分页 */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePageChange(pagination.page > 1 ? pagination.page - 1 : 1)}
                              className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                            // 显示当前页前后2页
                            let pageToShow = i + 1;
                            if (pagination.page > 3) {
                              pageToShow = pagination.page - 2 + i;
                            }
                            if (pageToShow > pagination.totalPages) return null;
                            return (
                              <PaginationItem key={pageToShow}>
                                <PaginationLink
                                  onClick={() => handlePageChange(pageToShow)}
                                  isActive={pagination.page === pageToShow}
                                  className="cursor-pointer"
                                >
                                  {pageToShow}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePageChange(pagination.page < pagination.totalPages ? pagination.page + 1 : pagination.totalPages)}
                              className={pagination.page >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 创建法规弹窗 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{locale === 'zh' ? '新增法规' : 'Add Regulation'}</DialogTitle>
            <DialogDescription>{locale === 'zh' ? '填写法规基本信息和内容' : 'Fill in basic regulation information and content'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="info" className="flex-1">{locale === 'zh' ? '基本信息' : 'Basic Info'}</TabsTrigger>
                <TabsTrigger value="content" className="flex-1">{locale === 'zh' ? '法规内容' : 'Content'}</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-title">{locale === 'zh' ? '标题 *' : 'Title *'}</Label>
                  <Input
                    id="create-title"
                    placeholder={locale === 'zh' ? '请输入法规标题' : 'Enter regulation title'}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-standard">{locale === 'zh' ? '标准号' : 'Standard No.'}</Label>
                  <Input
                    id="create-standard"
                    placeholder={locale === 'zh' ? '如：EN 149:2001' : 'e.g. EN 149:2001'}
                    value={formData.standard_no}
                    onChange={(e) => setFormData({ ...formData, standard_no: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-category">{locale === 'zh' ? '分类 *' : 'Category *'}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                    >
                      <SelectTrigger id="create-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {locale === 'zh' ? option.label : option.enLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-market">{locale === 'zh' ? '目标市场 *' : 'Target Market *'}</Label>
                    <Select
                      value={formData.target_market}
                      onValueChange={(value) => setFormData({ ...formData, target_market: value as any })}
                    >
                      <SelectTrigger id="create-market">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {marketOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {locale === 'zh' ? option.label : option.enLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-effective">{locale === 'zh' ? '生效日期' : 'Effective Date'}</Label>
                    <Input
                      id="create-effective"
                      type="date"
                      value={formData.effective_date}
                      onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-expiration">{locale === 'zh' ? '失效日期' : 'Expiration Date'}</Label>
                    <Input
                      id="create-expiration"
                      type="date"
                      value={formData.expiration_date}
                      onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-url">{locale === 'zh' ? '官方链接' : 'Official URL'}</Label>
                  <Input
                    id="create-url"
                    placeholder="https://"
                    value={formData.official_url}
                    onChange={(e) => setFormData({ ...formData, official_url: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="create-active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="create-active">{locale === 'zh' ? '启用该法规' : 'Enable this regulation'}</Label>
                </div>
              </TabsContent>
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-content">{locale === 'zh' ? '法规内容' : 'Regulation Content'}</Label>
                  <Textarea
                    id="create-content"
                    placeholder={locale === 'zh' ? '输入法规详细内容，支持Markdown格式' : 'Enter detailed regulation content, supports Markdown format'}
                    rows={15}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">{locale === 'zh' ? '提示：后续将集成富文本编辑器，目前支持纯文本和Markdown格式' : 'Tip: Rich text editor will be integrated later, currently supports plain text and Markdown format'}</p>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateDialogOpen(false)}
                disabled={submitting}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="bg-[#339999] hover:bg-[#2d8a8a] text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {locale === 'zh' ? '创建中...' : 'Creating...'}
                  </>
                ) : (
                  t('submit')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 编辑法规弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{locale === 'zh' ? '编辑法规' : 'Edit Regulation'}</DialogTitle>
            <DialogDescription>{locale === 'zh' ? '修改法规信息和内容' : 'Modify regulation information and content'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="info" className="flex-1">{locale === 'zh' ? '基本信息' : 'Basic Info'}</TabsTrigger>
                <TabsTrigger value="content" className="flex-1">{locale === 'zh' ? '法规内容' : 'Content'}</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">{locale === 'zh' ? '标题 *' : 'Title *'}</Label>
                  <Input
                    id="edit-title"
                    placeholder={locale === 'zh' ? '请输入法规标题' : 'Enter regulation title'}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-standard">{locale === 'zh' ? '标准号' : 'Standard No.'}</Label>
                  <Input
                    id="edit-standard"
                    placeholder={locale === 'zh' ? '如：EN 149:2001' : 'e.g. EN 149:2001'}
                    value={formData.standard_no}
                    onChange={(e) => setFormData({ ...formData, standard_no: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">{locale === 'zh' ? '分类 *' : 'Category *'}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {locale === 'zh' ? option.label : option.enLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-market">{locale === 'zh' ? '目标市场 *' : 'Target Market *'}</Label>
                    <Select
                      value={formData.target_market}
                      onValueChange={(value) => setFormData({ ...formData, target_market: value as any })}
                    >
                      <SelectTrigger id="edit-market">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {marketOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {locale === 'zh' ? option.label : option.enLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-effective">{locale === 'zh' ? '生效日期' : 'Effective Date'}</Label>
                    <Input
                      id="edit-effective"
                      type="date"
                      value={formData.effective_date}
                      onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-expiration">{locale === 'zh' ? '失效日期' : 'Expiration Date'}</Label>
                    <Input
                      id="edit-expiration"
                      type="date"
                      value={formData.expiration_date}
                      onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-url">{locale === 'zh' ? '官方链接' : 'Official URL'}</Label>
                  <Input
                    id="edit-url"
                    placeholder="https://"
                    value={formData.official_url}
                    onChange={(e) => setFormData({ ...formData, official_url: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="edit-active">{locale === 'zh' ? '启用该法规' : 'Enable this regulation'}</Label>
                </div>
              </TabsContent>
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-content">{locale === 'zh' ? '法规内容' : 'Regulation Content'}</Label>
                  <Textarea
                    id="edit-content"
                    placeholder={locale === 'zh' ? '输入法规详细内容，支持Markdown格式' : 'Enter detailed regulation content, supports Markdown format'}
                    rows={15}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">{locale === 'zh' ? '提示：后续将集成富文本编辑器，目前支持纯文本和Markdown格式' : 'Tip: Rich text editor will be integrated later, currently supports plain text and Markdown format'}</p>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditDialogOpen(false)}
                disabled={submitting}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="bg-[#339999] hover:bg-[#2d8a8a] text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {locale === 'zh' ? '保存中...' : 'Saving...'}
                  </>
                ) : (
                  t('save')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 删除法规确认弹窗 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{locale === 'zh' ? '确认删除法规' : 'Confirm Delete Regulation'}</AlertDialogTitle>
            <AlertDialogDescription>
              {locale === 'zh'
                ? `确定要删除法规 "${currentRegulation?.title}" 吗？此操作无法撤销，该法规将从知识库中永久移除。`
                : `Are you sure you want to delete regulation "${currentRegulation?.title}"? This action cannot be undone and the regulation will be permanently removed from the knowledge base.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRegulation}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {locale === 'zh' ? '确认删除' : 'Confirm Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
