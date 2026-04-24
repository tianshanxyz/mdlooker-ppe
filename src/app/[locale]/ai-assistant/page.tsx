import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import AIAssistantContent from "./AIAssistantContent";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const titles = {
    zh: "AI合规助手 | 7*24小时解答您的合规问题",
    en: "AI Compliance Assistant | 24/7 Answer Your Compliance Questions"
  };
  const descriptions = {
    zh: "MDLOOKER AI合规助手，支持法规咨询、文档审核、报告生成、政策解读，7*24小时在线为您解答所有PPE合规相关问题。",
    en: "MDLOOKER AI Compliance Assistant supports compliance consultation, document review, report generation, policy interpretation, 24/7 online to answer all your PPE compliance related questions."
  };

  return {
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    keywords: ["AI compliance assistant", "PPE consultation", "document review", "policy interpretation", "compliance report generation"],
  };
}

export default function AIAssistantPage() {
  return <AIAssistantContent />;
}