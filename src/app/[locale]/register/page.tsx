'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 如果已经登录，跳转到首页
  if (user) {
    router.push(`/${locale}`);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError(locale === 'zh' ? '请填写所有必填项' : 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError(locale === 'zh' ? '两次输入的密码不一致' : 'The two passwords entered do not match');
      return;
    }

    if (password.length < 6) {
      setError(locale === 'zh' ? '密码长度不能少于6位' : 'Password length cannot be less than 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(email, password, name || email.split('@')[0]);
    if (result.success) {
      router.push(`/${locale}`);
    } else {
      setError(result.error || (locale === 'zh' ? '注册失败' : 'Registration failed'));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Link href={`/${locale}`} className="inline-flex items-center text-gray-600 hover:text-[#339999] mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'zh' ? '返回首页' : 'Back to Home'}
          </Link>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img src="/logo.png" alt="MDLOOKER Logo" className="h-12 w-12" />
              </div>
              <CardTitle className="text-2xl font-bold">{locale === 'zh' ? '注册账号' : 'Create an Account'}</CardTitle>
              <CardDescription>{locale === 'zh' ? '创建您的MDLOOKER账号，开始使用专业合规工具' : 'Create your MDLOOKER account and start using professional compliance tools'}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">{locale === 'zh' ? '姓名（选填）' : 'Name (Optional)'}</Label>
                  <Input
                    id="name"
                    placeholder={locale === 'zh' ? '请输入您的姓名' : 'Enter your name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{locale === 'zh' ? '邮箱' : 'Email'}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{locale === 'zh' ? '密码' : 'Password'}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={locale === 'zh' ? '不少于6位' : 'At least 6 characters'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{locale === 'zh' ? '确认密码' : 'Confirm Password'}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={locale === 'zh' ? '再次输入密码' : 'Re-enter password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white h-12 text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {locale === 'zh' ? '注册中...' : 'Registering...'}
                    </>
                  ) : (
                    <>
                      {t('register')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  {locale === 'zh' ? '已有账号？' : 'Already have an account?'}
                  <Link href={`/${locale}/login`} className="text-[#339999] hover:underline ml-1">
                    {locale === 'zh' ? '立即登录' : 'Login Now'}
                  </Link>
                </div>

                <div className="text-center text-xs text-gray-500 mt-4">
                  {locale === 'zh' ? '注册即表示您同意我们的' : 'By registering, you agree to our'}
                  <Link href="/terms" className="text-[#339999] hover:underline mx-1">
                    {locale === 'zh' ? '服务条款' : 'Terms of Service'}
                  </Link>
                  {locale === 'zh' ? '和' : 'and'}
                  <Link href="/privacy" className="text-[#339999] hover:underline ml-1">
                    {locale === 'zh' ? '隐私政策' : 'Privacy Policy'}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}