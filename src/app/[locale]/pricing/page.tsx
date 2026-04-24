import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "定价方案 | MDLooker PPE合规查询平台",
  description: "MDLooker提供灵活的定价方案，包含免费版、Pro版、企业版，满足个人、中小企业、大型外贸企业不同的合规查询需求，支持7天无理由退款。",
  keywords: ["PPE合规系统价格", "合规查询工具定价", "MDLooker价格", "企业合规系统收费", "PPE认证查询费用"],
  alternates: {
    canonical: "https://www.mdlooker.com/pricing",
  },
};
import { Button } from "@/components/ui/button";
import { Check, X, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "免费版",
    price: "¥0",
    description: "适合个人用户和小型外贸企业试用",
    features: [
      { name: "合规检查工具（每月3次）", available: true },
      { name: "法规知识库基础访问", available: true },
      { name: "3份文档模板下载/月", available: true },
      { name: "邮件订阅法规更新", available: true },
      { name: "无API访问权限", available: false },
      { name: "无专属客服支持", available: false },
      { name: "无企业定制功能", available: false }
    ],
    cta: "免费开始使用",
    popular: false
  },
  {
    name: "Pro版",
    price: "¥1999/年",
    description: "适合中小型外贸企业和工厂日常使用",
    features: [
      { name: "合规检查工具（无限次）", available: true },
      { name: "法规知识库完整访问", available: true },
      { name: "无限次文档模板下载", available: true },
      { name: "定制化法规更新推送", available: true },
      { name: "API访问（500次/月）", available: true },
      { name: "专属客服支持（工作日响应）", available: true },
      { name: "无企业定制功能", available: false }
    ],
    cta: "支付功能即将上线",
    popular: true
  },
  {
    name: "企业版",
    price: "¥5999/年起",
    description: "适合中大型外贸企业和认证咨询机构",
    features: [
      { name: "包含Pro版所有功能", available: true },
      { name: "无限API调用次数", available: true },
      { name: "7*24小时专属技术支持", available: true },
      { name: "企业定制功能开发", available: true },
      { name: "法规合规咨询服务", available: true },
      { name: "员工子账号管理", available: true },
      { name: "企业数据看板和分析", available: true }
    ],
    cta: "联系我们定制方案",
    popular: false
  }
];

const faq = [
  {
    question: "支持哪些支付方式？",
    answer: "支持微信支付、支付宝、对公转账、信用卡支付，可开具正规增值税发票。"
  },
  {
    question: "购买后可以退款吗？",
    answer: "支持7天无理由退款，如使用过程中遇到任何问题请随时联系我们的客服团队。"
  },
  {
    question: "可以升级套餐吗？",
    answer: "可以，随时可以从免费版升级到Pro版，或者从Pro版升级到企业版，费用按比例折算。"
  },
  {
    question: "企业版可以定制功能吗？",
    answer: "是的，企业版支持定制开发专属功能，包括对接您的企业ERP、CRM系统，定制合规报告模板等。"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <ShieldCheck className="h-12 w-12 text-[#339999] mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">简单透明的定价方案</h1>
          <p className="text-xl text-gray-600">
            选择适合您的方案，助力外贸业务合规出海。所有方案均包含7天无理由退款保障。
          </p>
        </div>

        {/* 支付提示 */}
        <div className="max-w-6xl mx-auto mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-yellow-800 text-sm">⚠️ 在线支付功能正在开发中，如需升级套餐请联系客服 <a href="mailto:sales@mdlooker.com" className="underline font-medium">sales@mdlooker.com</a> 办理</p>
        </div>

        {/* 定价卡片 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative h-full flex flex-col ${plan.popular ? 'border-[#339999] shadow-lg' : 'border-gray-200 hover:shadow-md transition-shadow'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#339999] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  最受欢迎
                </div>
              )}
              <CardHeader className={`text-center ${plan.popular ? 'pb-6' : 'pb-8'}`}>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="mt-2 h-12">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.name !== "企业版" && <span className="text-gray-500 ml-1">/年</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.available ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.available ? 'text-gray-700' : 'text-gray-500'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.name === "企业版" ? (
                  <Link href="mailto:sales@mdlooker.com" className="w-full">
                    <Button className={`w-full ${plan.popular ? 'bg-[#339999] hover:bg-[#2d8a8a]' : 'bg-gray-800 hover:bg-gray-900'} text-white`}>
                      {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : plan.name === "Pro版" ? (
                  <Button 
                    className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white"
                    onClick={() => alert("在线支付功能正在开发中，如需升级Pro版请联系客服 sales@mdlooker.com 办理")}
                  >
                    {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Link href="/compliance-check" className="w-full">
                    <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                      {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ部分 */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">常见问题</h2>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">还有其他问题？随时联系我们的客服团队</p>
            <Link href="mailto:support@mdlooker.com">
              <Button variant="secondary">联系客服</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
