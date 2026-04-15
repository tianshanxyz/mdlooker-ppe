import type { Metadata } from "next";
import KnowledgeBaseContent from "./KnowledgeBaseContent";

export const metadata: Metadata = {
  title: "PPE法规知识库 | 全球各国合规标准数据库",
  description: "全球PPE法规标准数据库，涵盖欧盟CE、美国FDA、英国UKCA、中东GCC等市场的最新监管要求，所有内容均来自官方来源，每月同步更新。",
  keywords: ["PPE法规数据库", "CE认证标准", "FDA法规查询", "UKCA法规", "GCC标准", "PPE监管要求"],
  alternates: {
    canonical: "https://www.mdlooker.com/knowledge-base",
  },
};

export default function KnowledgeBasePage() {
  return <KnowledgeBaseContent />;
}
