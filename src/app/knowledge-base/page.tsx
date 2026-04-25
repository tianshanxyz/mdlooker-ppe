import type { Metadata } from "next";
import KnowledgeBaseContent from "./KnowledgeBaseContent";

export const metadata: Metadata = {
  title: "PPE Regulation Knowledge Base | Global Compliance Standard Database",
  description: "Global PPE regulation standard database, covering latest regulatory requirements for EU CE, US FDA, UK UKCA, Middle East GCC and other markets. All content comes from official sources, updated monthly.",
  keywords: ["PPE regulation database", "CE certification standard", "FDA regulation query", "UKCA regulation", "GCC standard", "PPE regulatory requirements"],
  alternates: {
    canonical: "https://www.mdlooker.com/knowledge-base",
  },
};

export default function KnowledgeBasePage() {
  return <KnowledgeBaseContent />;
}
