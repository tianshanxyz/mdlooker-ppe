"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="MDLOOKER Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">MDLOOKER</span>
            </div>
            <p className="text-gray-400 mb-4">
              您的专业PPE合规伙伴，帮助企业高效完成全球市场合规准入。
            </p>
            <p className="text-gray-400">邮箱：support@mdlooker.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">核心功能</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/compliance-check" className="hover:text-[#339999]">合规检查向导</Link></li>
              <li><Link href="/compliance-tools" className="hover:text-[#339999]">合规工具中心</Link></li>
              <li><Link href="/knowledge-base" className="hover:text-[#339999]">法规知识库</Link></li>
              <li><Link href="/templates" className="hover:text-[#339999]">文档模板库</Link></li>
              <li><Link href="/pricing" className="hover:text-[#339999]">定价方案</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">合规市场</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/knowledge-base?market=eu" className="hover:text-[#339999]">欧盟CE认证</Link></li>
              <li><Link href="/knowledge-base?market=us" className="hover:text-[#339999]">美国FDA认证</Link></li>
              <li><Link href="/knowledge-base?market=uk" className="hover:text-[#339999]">英国UKCA认证</Link></li>
              <li><Link href="/knowledge-base?market=middle_east" className="hover:text-[#339999]">中东GCC认证</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2026 MDLOOKER. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}