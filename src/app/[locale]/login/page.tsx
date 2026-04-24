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

export default function LoginPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 如果已经登录，跳转到首页
  if (user) {
    router.push(`/${locale}`);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(locale === 'zh' ? '请填写邮箱和密码' : 'Please fill in email and password');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      router.push(`/${locale}`);
    } else {
      setError(result.error || (locale === 'zh' ? '登录失败，邮箱或密码错误' : 'Login failed, email or password is incorrect'));
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
              <CardTitle className="text-2xl font-bold">{locale === 'zh' ? '登录账号' : 'Login to Your Account'}</CardTitle>
              <CardDescription>{locale === 'zh' ? '欢迎回来，请登录您的MDLOOKER账号' : 'Welcome back, please login to your MDLOOKER account'}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">{locale === 'zh' ? '密码' : 'Password'}</Label>
                    <Link href="/forgot-password" className="text-sm text-[#339999] hover:underline">
                      {locale === 'zh' ? '忘记密码？' : 'Forgot Password?'}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      {locale === 'zh' ? '登录中...' : 'Logging in...'}
                    </>
                  ) : (
                    <>
                      {t('login')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  {locale === 'zh' ? '还没有账号？' : 'Don\'t have an account?'}
                  <Link href={`/${locale}/register`} className="text-[#339999] hover:underline ml-1">
                    {locale === 'zh' ? '立即注册' : 'Register Now'}
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