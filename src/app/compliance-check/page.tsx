import type { Metadata } from "next";
import ComplianceCheckContent from "./ComplianceCheckContent";

export const metadata: Metadata = {
  title: "PPE合规检查工具 | 免费获取全球市场合规报告",
  description: "免费PPE合规检查工具，快速获取欧盟CE、美国FDA、英国UKCA、中东GCC等市场的合规要求、费用预估、周期查询，助力产品合规出海。",
  keywords: ["PPE合规检查", "CE认证要求", "FDA注册流程", "UKCA认证费用", "GCC认证查询", "PPE出口合规评估"],
  alternates: {
    canonical: "https://www.mdlooker.com/compliance-check",
  },
};

export default function ComplianceCheckPage() {
  return <ComplianceCheckContent />;
}
