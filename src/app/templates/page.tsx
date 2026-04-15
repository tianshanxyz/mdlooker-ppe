import type { Metadata } from "next";
import TemplatesContent from "./TemplatesContent";

export const metadata: Metadata = {
  title: "合规文档模板库 | DoC声明/标签/技术文档模板下载",
  description: "专业合规文档模板库，提供欧盟CE、美国FDA、英国UKCA等市场的DoC符合性声明、标签、技术文档、报关单等模板下载，可直接编辑使用。",
  keywords: ["DoC模板下载", "CE声明模板", "FDA声明模板", "PPE技术文档模板", "出口报关单模板", "产品标签模板"],
  alternates: {
    canonical: "https://www.mdlooker.com/templates",
  },
};

export default function TemplatesPage() {
  return <TemplatesContent />;
}
