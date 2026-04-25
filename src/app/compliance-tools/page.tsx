import type { Metadata } from "next";
import ComplianceToolsContent from "./ComplianceToolsContent";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "PPE合规工具中心 | 合规检查 文档模板 合规包生成",
  description: "MDLOOKER合规工具中心，提供免费PPE合规检查工具、专业合规文档模板、一键生成合规包服务，覆盖欧盟CE、美国FDA、英国UKCA等全球市场合规需求。",
  keywords: ["PPE合规工具", "CE认证模板", "合规包生成", "FDA合规检查", "PPE出口工具"],
  alternates: {
    canonical: "https://www.mdlooker.com/compliance-tools",
  },
};

export default function ComplianceToolsPage() {
  return <ComplianceToolsContent />;
}
