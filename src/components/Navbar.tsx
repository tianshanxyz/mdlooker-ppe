"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MDLOOKER Logo" className="h-8 w-8" />
          <Link href="/" className="font-bold text-xl">MDLOOKER</Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-[#339999] transition-colors">首页</Link>
          <Link href="/compliance-tools" className="text-sm font-medium hover:text-[#339999] transition-colors">合规工具中心</Link>
          <Link href="/knowledge-base" className="text-sm font-medium hover:text-[#339999] transition-colors">法规知识库</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-[#339999] transition-colors">定价方案</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/compliance-check">
            <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">免费合规检查</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}