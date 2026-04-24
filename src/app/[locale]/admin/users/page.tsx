'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Loader2, Plus, Edit, Trash2, User, Calendar, Clock } from 'lucide-react';

type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
  usage_count: number;
  plan_expires_at?: string;
  created_at: string;
  updated_at: string;
};

type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function AdminUsersPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'free',
    plan_expires_at: ''
  });

  // 验证管理员身份，未登录跳转到登录页
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push(`/${locale}/admin/login`);
      return;
    }
    fetchUsers();
  }, [router, locale, pagination.page, search, planFilter]);

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      if (search) params.append('search', search);
      if (planFilter && planFilter !== 'all') params.append('plan', planFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
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
      console.error('获取用户列表错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchUsers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 处理套餐筛选变化
  const handlePlanFilterChange = (value: string) => {
    setPlanFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // 打开编辑弹窗
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      plan: user.plan,
      plan_expires_at: user.plan_expires_at ? new Date(user.plan_expires_at).toISOString().split('T')[0] : ''
    });
    setEditDialogOpen(true);
  };

  // 打开创建弹窗
  const handleCreateUser = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      plan: 'free',
      plan_expires_at: ''
    });
    setCreateDialogOpen(true);
  };

  // 打开删除确认
  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  // 提交创建用户
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert(locale === 'zh' ? '请填写邮箱和密码' : 'Please fill in email and password');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setCreateDialogOpen(false);
        fetchUsers();
        alert(locale === 'zh' ? '用户创建成功' : 'User created successfully');
      } else {
        const data = await res.json();
        alert(data.error || (locale === 'zh' ? '创建失败' : 'Creation failed'));
      }
    } catch (error) {
      console.error('创建用户错误:', error);
      alert(locale === 'zh' ? '创建失败，请稍后重试' : 'Creation failed, please try again later');
    } finally {
      setSubmitting(false);
    }
  };

  // 提交编辑用户
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!formData.email) {
      alert(locale === 'zh' ? '邮箱不能为空' : 'Email cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      // 移除空密码字段
      const submitData = { ...formData };
      if (!submitData.password) delete submitData.password;

      const res = await fetch(`/api/admin/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (res.ok) {
        setEditDialogOpen(false);
        fetchUsers();
        alert(locale === 'zh' ? '用户更新成功' : 'User updated successfully');
      } else {
        const data = await res.json();
        alert(data.error || (locale === 'zh' ? '更新失败' : 'Update failed'));
      }
    } catch (error) {
      console.error('更新用户错误:', error);
      alert(locale === 'zh' ? '更新失败，请稍后重试' : 'Update failed, please try again later');
    } finally {
      setSubmitting(false);
    }
  };

  // 确认删除用户
  const confirmDeleteUser = async () => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/users/${currentUser.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setDeleteDialogOpen(false);
        fetchUsers();
        alert(locale === 'zh' ? '用户删除成功' : 'User deleted successfully');
      } else {
        const data = await res.json();
        alert(data.error || (locale === 'zh' ? '删除失败' : 'Deletion failed'));
      }
    } catch (error) {
      console.error('删除用户错误:', error);
      alert(locale === 'zh' ? '删除失败，请稍后重试' : 'Deletion failed, please try again later');
    }
  };

  // 套餐标签配置
  const planConfig = {
    free: { label: locale === 'zh' ? '免费版' : 'Free Plan', color: 'bg-gray-100 text-gray-700' },
    pro: { label: locale === 'zh' ? 'Pro版' : 'Pro Plan', color: 'bg-blue-100 text-blue-700' },
    enterprise: { label: locale === 'zh' ? '企业版' : 'Enterprise Plan', color: 'bg-purple-100 text-purple-700' }
  };

  if (loading && users.length === 0) {
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
            <User className="h-4 w-4 mr-2" />
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
            <span className="text-gray-900 font-medium">{locale === 'zh' ? '用户管理' : 'User Management'}</span>
          </div>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>{locale === 'zh' ? '用户管理' : 'User Management'}</CardTitle>
                <CardDescription>{locale === 'zh' ? '管理所有注册用户，编辑信息、修改套餐' : 'Manage all registered users, edit information, modify plans'}</CardDescription>
              </div>
              <Button
                className="bg-[#339999] hover:bg-[#2d8a8a] text-white"
                onClick={handleCreateUser}
              >
                <Plus className="mr-2 h-4 w-4" />
                {locale === 'zh' ? '创建用户' : 'Create User'}
              </Button>
            </CardHeader>

            <CardContent>
              {/* 筛选栏 */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  placeholder={locale === 'zh' ? '搜索邮箱/姓名' : 'Search email/name'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="md:w-1/3"
                />
                <Select value={planFilter} onValueChange={handlePlanFilterChange}>
                  <SelectTrigger className="md:w-1/4">
                    <SelectValue placeholder={locale === 'zh' ? '筛选套餐' : 'Filter by plan'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'zh' ? '全部套餐' : 'All Plans'}</SelectItem>
                    <SelectItem value="free">{locale === 'zh' ? '免费版' : 'Free Plan'}</SelectItem>
                    <SelectItem value="pro">{locale === 'zh' ? 'Pro版' : 'Pro Plan'}</SelectItem>
                    <SelectItem value="enterprise">{locale === 'zh' ? '企业版' : 'Enterprise Plan'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 用户列表 */}
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 text-[#339999] animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">{locale === 'zh' ? '加载中...' : 'Loading...'}</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{locale === 'zh' ? '暂无用户' : 'No Users'}</h3>
                  <p className="text-gray-500 mb-6">{locale === 'zh' ? '还没有注册用户' : 'No registered users yet'}</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{locale === 'zh' ? '姓名' : 'Name'}</TableHead>
                          <TableHead>{locale === 'zh' ? '邮箱' : 'Email'}</TableHead>
                          <TableHead>{locale === 'zh' ? '套餐' : 'Plan'}</TableHead>
                          <TableHead>{locale === 'zh' ? '使用次数' : 'Usage Count'}</TableHead>
                          <TableHead>{locale === 'zh' ? '注册时间' : 'Registration Time'}</TableHead>
                          <TableHead className="text-right">{locale === 'zh' ? '操作' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={planConfig[user.plan].color}>
                                {planConfig[user.plan].label}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.usage_count}</TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                  className="h-8 px-2 text-blue-600"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  {locale === 'zh' ? '编辑' : 'Edit'}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user)}
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

      {/* 创建用户弹窗 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{locale === 'zh' ? '创建用户' : 'Create User'}</DialogTitle>
            <DialogDescription>{locale === 'zh' ? '填写用户信息创建新账号' : 'Fill in user information to create a new account'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">{locale === 'zh' ? '姓名' : 'Name'}</Label>
                <Input
                  id="create-name"
                  placeholder={locale === 'zh' ? '请输入姓名' : 'Enter name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">{locale === 'zh' ? '邮箱 *' : 'Email *'}</Label>
                <Input
                  id="create-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">{locale === 'zh' ? '密码 *' : 'Password *'}</Label>
                <Input
                  id="create-password"
                  type="password"
                  placeholder={locale === 'zh' ? '不少于6位' : 'At least 6 characters'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-plan">{locale === 'zh' ? '套餐' : 'Plan'}</Label>
                  <Select
                    value={formData.plan}
                    onValueChange={(value) => setFormData({ ...formData, plan: value as any })}
                  >
                    <SelectTrigger id="create-plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">{locale === 'zh' ? '免费版' : 'Free Plan'}</SelectItem>
                      <SelectItem value="pro">{locale === 'zh' ? 'Pro版' : 'Pro Plan'}</SelectItem>
                      <SelectItem value="enterprise">{locale === 'zh' ? '企业版' : 'Enterprise Plan'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-expires">{locale === 'zh' ? '到期时间' : 'Expiration Date'}</Label>
                  <Input
                    id="create-expires"
                    type="date"
                    value={formData.plan_expires_at}
                    onChange={(e) => setFormData({ ...formData, plan_expires_at: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
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

      {/* 编辑用户弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{locale === 'zh' ? '编辑用户' : 'Edit User'}</DialogTitle>
            <DialogDescription>{locale === 'zh' ? '修改用户信息和套餐配置' : 'Modify user information and plan configuration'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{locale === 'zh' ? '姓名' : 'Name'}</Label>
                <Input
                  id="edit-name"
                  placeholder={locale === 'zh' ? '请输入姓名' : 'Enter name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">{locale === 'zh' ? '邮箱' : 'Email'}</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">{locale === 'zh' ? '新密码（选填）' : 'New Password (Optional)'}</Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder={locale === 'zh' ? '不修改请留空' : 'Leave blank to keep unchanged'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-plan">{locale === 'zh' ? '套餐' : 'Plan'}</Label>
                  <Select
                    value={formData.plan}
                    onValueChange={(value) => setFormData({ ...formData, plan: value as any })}
                  >
                    <SelectTrigger id="edit-plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">{locale === 'zh' ? '免费版' : 'Free Plan'}</SelectItem>
                      <SelectItem value="pro">{locale === 'zh' ? 'Pro版' : 'Pro Plan'}</SelectItem>
                      <SelectItem value="enterprise">{locale === 'zh' ? '企业版' : 'Enterprise Plan'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expires">{locale === 'zh' ? '到期时间' : 'Expiration Date'}</Label>
                  <Input
                    id="edit-expires"
                    type="date"
                    value={formData.plan_expires_at}
                    onChange={(e) => setFormData({ ...formData, plan_expires_at: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
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

      {/* 删除用户确认弹窗 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{locale === 'zh' ? '确认删除用户' : 'Confirm Delete User'}</AlertDialogTitle>
            <AlertDialogDescription>
              {locale === 'zh'
                ? `确定要删除用户 ${currentUser?.name} (${currentUser?.email}) 吗？此操作无法撤销，用户所有数据将被永久删除。`
                : `Are you sure you want to delete user ${currentUser?.name} (${currentUser?.email})? This action cannot be undone and all user data will be permanently deleted.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
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
