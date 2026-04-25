import type { Metadata } from "next";
import PricingContent from "./PricingContent";

export const metadata: Metadata = {
  title: "定价方案 | MDLooker PPE合规查询平台",
  description: "MDLooker提供灵活的定价方案，包含免费版、Pro版、企业版，满足个人、中小企业、大型外贸企业不同的合规查询需求，支持7天无理由退款。",
  keywords: ["PPE合规系统价格", "合规查询工具定价", "MDLooker价格", "企业合规系统收费", "PPE认证查询费用"],
  alternates: {
    canonical: "https://www.mdlooker.com/pricing",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}