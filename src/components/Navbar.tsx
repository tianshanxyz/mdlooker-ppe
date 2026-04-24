'use client';

import Link from "next/Link";
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, User, Settings, LogOut, CreditCard } from "lucide-react";

export default function Navbar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MDLOOKER Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-gray-900">MDLOOKER</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href={`/${locale}`} className="text-gray-600 hover:text-[#339999] font-medium">
            {t('home')}
          </Link>
          <Link href={`/${locale}/compliance-tools`} className="text-gray-600 hover:text-[#339999] font-medium">
            {t('complianceTools')}
          </Link>
          <Link href={`/${locale}/compliance-tracker`} className="text-gray-600 hover:text-[#339999] font-medium">
            {t('complianceTracker')}
          </Link>
          <Link href={`/${locale}/knowledge-base`} className="text-gray-600 hover:text-[#339999] font-medium">
            {t('knowledgeBase')}
          </Link>
          <Link href={`/${locale}/ai-assistant`} className="text-gray-600 hover:text-[#339999] font-medium">
            {t('aiAssistant')}
          </Link>
          <Link href={`/${locale}/pricing`} className="text-gray-600 hover:text-[#339999] font-medium">
            {t('pricing')}
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm font-medium flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {locale === 'zh' ? '中文' : 'English'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLanguage('zh')}>
                🇨🇳 中文
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLanguage('en')}>
                🇺🇸 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-[#339999] flex items-center justify-center text-white text-xs font-medium">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        user.plan === 'pro' ? 'bg-blue-100 text-blue-700' : 
                        user.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.plan === 'free' ? t('planFree') : user.plan === 'pro' ? t('planPro') : t('planEnterprise')}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)}>
                      <Settings className="h-4 w-4 mr-2" />
                      {t('profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${locale}/pricing`)}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {t('upgradePlan')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href={`/${locale}/login`}>
                    <Button variant="secondary">{t('login')}</Button>
                  </Link>
                  <Link href={`/${locale}/register`}>
                    <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">{t('register')}</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
