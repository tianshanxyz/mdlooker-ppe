"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileText, Calculator, Globe, Check } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MDLOOKER",
              "url": "https://www.mdlooker.com",
              "description": "全球PPE医疗器械合规平台，为口罩及个人防护装备（PPE）提供全球注册信息、认证查询、合规标准查询服务，帮助企业快速掌握各国PPE准入要求，降低合规风险。",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.mdlooker.com/knowledge-base?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MDLOOKER",
              "url": "https://www.mdlooker.com",
              "logo": "https://www.mdlooker.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@mdlooker.com",
                "telephone": "+86 138 0000 0000",
                "contactType": "customer service"
              },
              "sameAs": []
            }
          ])
        }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#339999]/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              全球PPE医疗器械合规平台
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              为PPE产品提供全球合规查询、认证指南、文档模板服务，帮助企业快速掌握各国准入要求，降低合规风险。
            </p>
            
            {/* 搜索框 */}
            <div className="relative w-full max-w-2xl mx-auto mb-8">
              <input
                type="text"
                placeholder="搜索产品、认证、合规标准..."
                className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#339999] focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                    window.location.href = `/knowledge-base?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                  }
                }}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/compliance-check">
                <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white text-lg px-8 py-6 h-auto">
                  免费合规检查
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" className="text-lg px-8 py-6 h-auto">
                  查看定价
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-[#339999]" />
                <span>CE、FDA、UKCA认证指南</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-[#339999]" />
                <span>覆盖30+国家地区合规标准</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-[#339999]" />
                <span>99%准确率的合规报告</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">一站式合规解决方案</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">满足PPE企业出海全流程合规需求。</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#339999]/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-[#339999]" />
                </div>
                <CardTitle>合规检查向导</CardTitle>
                <CardDescription>30秒生成完整合规方案</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                选择产品类别和目标市场，自动获取所需认证清单、费用预估、周期说明。
              </CardContent>
              <CardFooter>
                <Link href="/compliance-check" className="text-[#339999] font-medium hover:underline">
                  立即使用 →
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#339999]/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-[#339999]" />
                </div>
                <CardTitle>文档模板库</CardTitle>
                <CardDescription>专业合规文档直接使用</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                DoC声明、标签模板、技术文件、报关资料等专业模板，节省90%文档准备时间。
              </CardContent>
              <CardFooter>
                <Link href="/templates" className="text-[#339999] font-medium hover:underline">
                  查看模板 →
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#339999]/10 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-[#339999]" />
                </div>
                <CardTitle>合规包生成</CardTitle>
                <CardDescription>一键生成全套合规资料</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                自定义配置生成全套合规资料包，包含认证要求、测试标准、申请材料模板。
              </CardContent>
              <CardFooter>
                <Link href="/compliance-package" className="text-[#339999] font-medium hover:underline">
                  生成合规包 →
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#339999]/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-[#339999]" />
                </div>
                <CardTitle>法规知识库</CardTitle>
                <CardDescription>最新全球合规标准库</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                实时更新欧盟、美国、英国、中东等全球最新PPE法规标准，官方来源可追溯。
              </CardContent>
              <CardFooter>
                <Link href="/knowledge-base" className="text-[#339999] font-medium hover:underline">
                  浏览知识库 →
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#339999]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[#339999] rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好简化您的PPE合规流程？</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              立即开始免费合规检查，获取您的产品进入目标市场的完整合规方案。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/compliance-check">
                <Button className="bg-white text-[#339999] hover:bg-gray-100 text-lg px-8 py-6 h-auto">
                  免费合规检查
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" className="bg-[#339999]/20 text-white border-white hover:bg-[#339999]/30 text-lg px-8 py-6 h-auto">
                  查看定价
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}