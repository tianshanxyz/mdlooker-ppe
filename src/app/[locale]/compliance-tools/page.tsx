"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComplianceCheckContent from "../compliance-check/ComplianceCheckContent";
import CompliancePackageContent from "../compliance-package/CompliancePackageContent";
import TemplatesContent from "../templates/TemplatesContent";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PPE合规工具中心 | 合规检查 文档模板 合规包生成",
  description: "MDLOOKER合规工具中心，提供免费PPE合规检查工具、专业合规文档模板、一键生成合规包服务，覆盖欧盟CE、美国FDA、英国UKCA等全球市场合规需求。",
  keywords: ["PPE合规工具", "CE认证模板", "合规包生成", "FDA合规检查", "PPE出口工具"],
  alternates: {
    canonical: "https://www.mdlooker.com/compliance-tools",
  },
};

export default function ComplianceToolsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "check");

  useEffect(() => {
    if (tabParam && ["check", "package", "templates"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#339999]/5 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">合规工具中心</h1>
            <p className="text-xl text-gray-600">一站式满足您的PPE产品合规出海全流程需求</p>
          </div>

          <Tabs defaultValue="check" value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="check" className="text-lg py-3">
                合规检查向导
              </TabsTrigger>
              <TabsTrigger value="package" className="text-lg py-3">
                合规包生成
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-lg py-3">
                文档模板库
              </TabsTrigger>
            </TabsList>
            <TabsContent value="check" className="mt-0">
              <ComplianceCheckContent />
            </TabsContent>
            <TabsContent value="package" className="mt-0">
              <CompliancePackageContent />
            </TabsContent>
            <TabsContent value="templates" className="mt-0">
              <TemplatesContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
