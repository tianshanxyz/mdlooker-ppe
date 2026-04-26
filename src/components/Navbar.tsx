"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function Navbar() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
    // 后续集成next-intl后这里会切换路由语言前缀
    alert(`语言切换为${language === 'zh' ? 'English' : '中文'}，完整多语言功能开发中`);
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
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full">
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-sm">{language === 'zh' ? 'EN' : '中文'}</span>
          </Button>
          <Link href="/compliance-check">
            <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">{language === 'zh' ? '免费合规检查' : 'Free Compliance Check'}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}