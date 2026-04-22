'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MDLOOKER Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-gray-900">MDLOOKER</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-gray-600 hover:text-[#339999] font-medium">Data Search</Link>
          <Link href="/compliance-check" className="text-gray-600 hover:text-[#339999] font-medium">Compliance Check</Link>
          <Link href="/compliance-package" className="text-gray-600 hover:text-[#339999] font-medium">Compliance Package</Link>
          <Link href="/company-score" className="text-gray-600 hover:text-[#339999] font-medium">Company Rating</Link>
          <Link href="/knowledge-base" className="text-gray-600 hover:text-[#339999] font-medium">Knowledge Base</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-[#339999] font-medium">Pricing</Link>
          <Link href="/templates" className="text-gray-600 hover:text-[#339999] font-medium">Templates</Link>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Sign In</Button>
          <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
