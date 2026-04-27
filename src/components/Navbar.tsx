"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, User, LogOut, Settings, ChevronDown, Menu, X, ShieldCheck, FileText, Calculator } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
    // 后续集成next-intl后这里会切换路由语言前缀
    alert(`语言切换为${language === 'zh' ? 'English' : '中文'}，完整多语言功能开发中`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MDLOOKER Logo" className="h-8 w-8" />
          <Link href="/" className="font-bold text-xl">MDLOOKER</Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-[#339999] transition-colors">{language === 'zh' ? '首页' : 'Home'}</Link>
          <Link href="/compliance-tools" className="text-sm font-medium hover:text-[#339999] transition-colors">{language === 'zh' ? '合规工具中心' : 'Compliance Tools'}</Link>
          <Link href="/knowledge-base" className="text-sm font-medium hover:text-[#339999] transition-colors">{language === 'zh' ? '法规知识库' : 'Regulation Library'}</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-[#339999] transition-colors">{language === 'zh' ? '定价方案' : 'Pricing'}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full hidden md:flex">
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-sm">{language === 'zh' ? 'EN' : '中文'}</span>
          </Button>

          {!user ? (
            <Link href="/auth" className="hidden md:block">
              <Button variant="secondary" className="mr-2">{language === 'zh' ? '登录/注册' : 'Sign In/Up'}</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#339999]/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-[#339999]" />
                  </div>
                  <span className="text-sm hidden md:inline">{user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{language === 'zh' ? '我的账户' : 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{language === 'zh' ? '账户设置' : 'Account Settings'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{language === 'zh' ? '退出登录' : 'Sign Out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* 桌面端显示免费合规检查按钮 */}
          <Link href="/compliance-check" className="hidden md:block">
            <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">{language === 'zh' ? '免费合规检查' : 'Free Compliance Check'}</Button>
          </Link>

          {/* 移动端显示汉堡菜单按钮 */}
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden rounded-full">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* 移动端展开菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4 space-y-4">
            <Link 
              href="/" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="h-8 w-8 rounded-full bg-[#339999]/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-[#339999]" />
              </div>
              <span className="font-medium">{language === 'zh' ? '首页' : 'Home'}</span>
            </Link>

            <Link 
              href="/knowledge-base" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="h-8 w-8 rounded-full bg-[#339999]/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-[#339999]" />
              </div>
              <span className="font-medium">{language === 'zh' ? '法规知识库' : 'Regulation Library'}</span>
            </Link>

            <Link 
              href="/compliance-tools?tab=templates" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="h-8 w-8 rounded-full bg-[#339999]/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-[#339999]" />
              </div>
              <span className="font-medium">{language === 'zh' ? '文档模板库' : 'Template Library'}</span>
            </Link>

            <Link 
              href="/compliance-check" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="h-8 w-8 rounded-full bg-[#339999]/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-[#339999]" />
              </div>
              <span className="font-medium">{language === 'zh' ? '免费合规检查' : 'Free Compliance Check'}</span>
            </Link>

            <Link 
              href="/pricing" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="h-8 w-8 rounded-full bg-[#339999]/10 flex items-center justify-center">
                <Calculator className="h-4 w-4 text-[#339999]" />
              </div>
              <span className="font-medium">{language === 'zh' ? '定价方案' : 'Pricing'}</span>
            </Link>

            {/* 语言切换 */}
            <button 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
              onClick={toggleLanguage}
            >
              <div className="h-8 w-8 rounded-full bg-[#339999]/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-[#339999]" />
              </div>
              <span className="font-medium">{language === 'zh' ? '切换到English' : 'Switch to 中文'}</span>
            </button>

            {/* 登录/注册或者用户信息 */}
            {!user ? (
              <Link 
                href="/auth" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="h-8 w-8 rounded-full bg-[#339999]/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-[#339999]" />
                </div>
                <span className="font-medium">{language === 'zh' ? '登录/注册' : 'Sign In/Up'}</span>
              </Link>
            ) : (
              <div className="space-y-2">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500">{language === 'zh' ? '已登录' : 'Logged in as'}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <button 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                  onClick={async () => {
                    await handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                    <LogOut className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="font-medium">{language === 'zh' ? '退出登录' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}