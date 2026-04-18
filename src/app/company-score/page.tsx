"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Search, Building2, Award, TrendingUp, Globe, ShieldCheck, Calendar, CheckCircle2, FileText, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleCompanies = [
  { id: 1, name: "湖北佳联防护用品有限公司", score: 92, productCount: 120, certCount: 245, marketCount: 18, validRate: 98 },
  { id: 2, name: "稳健医疗用品股份有限公司", score: 96, productCount: 280, certCount: 560, marketCount: 32, validRate: 99 },
  { id: 3, name: "振德医疗用品股份有限公司", score: 94, productCount: 230, certCount: 480, marketCount: 28, validRate: 98 },
  { id: 4, name: "3M中国有限公司", score: 98, productCount: 450, certCount: 890, marketCount: 56, validRate: 99 },
  { id: 5, name: "霍尼韦尔(中国)有限公司", score: 97, productCount: 380, certCount: 760, marketCount: 48, validRate: 99 },
  { id: 6, name: "浙江比亚迪精密制造有限公司", score: 88, productCount: 80, certCount: 120, marketCount: 12, validRate: 95 },
  { id: 7, name: "英科医疗科技股份有限公司", score: 91, productCount: 180, certCount: 320, marketCount: 22, validRate: 97 },
  { id: 8, name: "蓝帆医疗股份有限公司", score: 89, productCount: 150, certCount: 280, marketCount: 19, validRate: 96 },
];

const dimensionLabels = [
  { key: "certCoverage", name: "认证覆盖度", desc: "覆盖的认证类型数量和含金量" },
  { key: "marketCoverage", name: "市场覆盖度", desc: "产品出口的国家和地区数量" },
  { key: "productRichness", name: "产品丰富度", desc: "合规产品的品类数量和规模" },
  { key: "certValidRate", name: "认证有效性", desc: "有效认证占比、剩余有效期平均长度" },
  { key: "complianceRecord", name: "合规记录", desc: "历史合规情况、是否有违规记录" },
];

export default function CompanyScorePage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scoreData, setScoreData] = useState<any>(null);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<any[]>([]);
  const [advantageList, setAdvantageList] = useState<string[]>([]);
  const [weaknessList, setWeaknessList] = useState<string[]>([]);

  useEffect(() => {
    if (searchKeyword.trim()) {
      const results = sampleCompanies.filter(c => c.name.includes(searchKeyword.trim()));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchKeyword]);

  const selectCompany = (company: any) => {
    setSelectedCompany(company);
    generateScore(company);
    setSearchResults([]);
    setSearchKeyword("");
  };

  const generateScore = async (company: any) => {
    setLoading(true);
    try {
      // 模拟查询数据
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 生成各维度得分
      const dimensions = {
        certCoverage: Math.floor(Math.random() * 15) + 80,
        marketCoverage: Math.floor(Math.random() * 20) + 75,
        productRichness: Math.floor(Math.random() * 25) + 70,
        certValidRate: Math.floor(Math.random() * 10) + 85,
        complianceRecord: Math.floor(Math.random() * 8) + 88,
      };

      const totalScore = Math.round(Object.values(dimensions).reduce((sum: number, val: any) => sum + val, 0) / Object.keys(dimensions).length);

      // 雷达图数据
      const radar = Object.entries(dimensions).map(([key, value]) => ({
        subject: dimensionLabels.find(d => d.key === key)?.name || key,
        score: value,
        fullMark: 100,
      }));

      // 行业对比数据
      const compare = [
        { name: "该企业", value: totalScore },
        { name: "行业平均", value: 72 },
        { name: "行业Top20", value: 88 },
        { name: "行业Top10", value: 93 },
      ];

      // 优势劣势
      const advantages: string[] = [];
      const weaknesses: string[] = [];

      if (dimensions.certCoverage >= 85) advantages.push("认证覆盖全面，含金量高，全球主流市场认证齐全");
      else weaknesses.push("认证覆盖度不足，部分主流市场认证缺失");

      if (dimensions.marketCoverage >= 85) advantages.push("全球市场覆盖广，出口经验丰富，符合多国准入要求");
      else weaknesses.push("市场覆盖范围较窄，国际市场经验不足");

      if (dimensions.productRichness >= 85) advantages.push("产品品类丰富，可满足不同客户多样化需求");
      else weaknesses.push("产品品类较少，供应能力有限");

      if (dimensions.certValidRate >= 90) advantages.push("认证有效性高，几乎无过期认证，合规风险低");
      else weaknesses.push("部分认证即将到期，需要尽快续期，存在一定合规风险");

      if (dimensions.complianceRecord >= 90) advantages.push("历史合规记录良好，无违规处罚记录，信誉优良");
      else weaknesses.push("存在历史合规不良记录，需要重点关注");

      setScoreData({
        totalScore,
        dimensions,
        totalCert: company.certCount,
        totalProduct: company.productCount,
        totalMarket: company.marketCount,
        validRate: company.validRate,
      });
      setRadarData(radar);
      setCompareData(compare);
      setAdvantageList(advantages);
      setWeaknessList(weaknesses);

    } catch (error) {
      console.error("生成评分失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "S级", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
    if (score >= 80) return { level: "A级", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" };
    if (score >= 70) return { level: "B级", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
    if (score >= 60) return { level: "C级", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
    return { level: "D级", color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="H-Guardian Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-gray-900">H-GUARDIAN</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-600 hover:text-[#339999] font-medium">首页</a>
            <a href="/search" className="text-gray-600 hover:text-[#339999] font-medium">数据检索</a>
            <a href="/dashboard" className="text-gray-600 hover:text-[#339999] font-medium">行业看板</a>
            <a href="/warning" className="text-gray-600 hover:text-[#339999] font-medium">预警中心</a>
            <a href="/compliance-package" className="text-gray-600 hover:text-[#339999] font-medium">合规包生成</a>
            <a href="/company-score" className="text-[#339999] font-medium font-bold">企业评分</a>
            <a href="/compliance-check" className="text-gray-600 hover:text-[#339999] font-medium">合规检查</a>
          </div>
        </div>
      </nav>

      {/* 页面头部 */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Award className="h-8 w-8 text-[#339999]" />
            企业合规竞争力评分
          </h1>
          <p className="text-gray-600">基于企业的合规认证数量、市场覆盖范围、产品丰富度、合规历史记录等多维度生成综合竞争力评分，为供应商选择提供参考</p>
        </div>
      </section>

      {/* 搜索栏 */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="搜索企业名称，例如：湖北佳联防护用品有限公司"
                className="pl-10 h-12 text-lg"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((company) => (
                    <div
                      key={company.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b last:border-b-0"
                      onClick={() => selectCompany(company)}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#339999]" />
                        <span>{company.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">评分: {company.score}分</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              支持搜索国内所有医疗防护用品生产企业，数据每日更新
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="h-12 w-12 text-[#339999] animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">正在生成企业评分，请稍候...</p>
        </div>
      ) : scoreData && selectedCompany ? (
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* 企业基本信息和总评分 */}
            <Card className="mb-8 border-l-4 border-l-[#339999]">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#339999]/10 rounded-full p-3">
                      <Building2 className="h-10 w-10 text-[#339999]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedCompany.name}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="h-4 w-4 text-[#339999]" />
                          <span>有效认证: {scoreData.totalCert}项</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-[#339999]" />
                          <span>合规产品: {scoreData.totalProduct}款</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4 text-[#339999]" />
                          <span>覆盖市场: {scoreData.totalMarket}个国家/地区</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-[#339999]" />
                          <span>认证有效率: {scoreData.validRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-center rounded-lg p-4 border ${getScoreLevel(scoreData.totalScore).borderColor} ${getScoreLevel(scoreData.totalScore).bgColor}`}>
                      <div className={`text-5xl font-bold ${getScoreLevel(scoreData.totalScore).color}`}>
                        {scoreData.totalScore}
                      </div>
                      <div className="text-sm font-medium text-gray-600 mt-1">综合竞争力评分</div>
                      <div className={`text-xs font-medium mt-1 ${getScoreLevel(scoreData.totalScore).color}`}>
                        {getScoreLevel(scoreData.totalScore).level}
                      </div>
                    </div>
                    <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">
                      下载完整评估报告
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* 各维度得分 */}
              <Card>
                <CardHeader>
                  <CardTitle>各维度得分详情</CardTitle>
                  <CardDescription>5大维度详细评分，满分100分</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {Object.entries(scoreData.dimensions).map(([key, value]) => {
                    const label = dimensionLabels.find(d => d.key === key);
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{label?.name}</span>
                            <span className="text-xs text-gray-500">({label?.desc})</span>
                          </div>
                          <span className={`text-sm font-bold ${value >= 85 ? "text-green-600" : value >= 70 ? "text-yellow-600" : "text-red-600"}`}>
                            {value}分
                          </span>
                        </div>
                        <Progress 
                          value={value} 
                          className="h-2"
                          style={{
                            background: '#e5e7eb',
                            '--progress-background': value >= 85 ? '#10b981' : value >= 70 ? '#eab308' : '#ef4444'
                          } as React.CSSProperties}
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* 雷达图 */}
              <Card>
                <CardHeader>
                  <CardTitle>能力雷达图</CardTitle>
                  <CardDescription>各维度能力分布可视化</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="得分" dataKey="score" stroke="#339999" fill="#339999" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* 行业对比 */}
              <Card>
                <CardHeader>
                  <CardTitle>行业水平对比</CardTitle>
                  <CardDescription>该企业在行业中的位置</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#339999" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 优劣势分析 */}
              <Card>
                <CardHeader>
                  <CardTitle>优劣势分析</CardTitle>
                  <CardDescription>基于评分生成的分析结果</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-green-700 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      优势项 ({advantageList.length}项)
                    </h3>
                    <div className="space-y-2">
                      {advantageList.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-green-50 p-2 rounded-md">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-700 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      待改进项 ({weaknessList.length}项)
                    </h3>
                    <div className="space-y-2">
                      {weaknessList.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-red-50 p-2 rounded-md">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 采购建议 */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  采购参考建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {scoreData.totalScore >= 90 ? (
                    <p className="text-gray-700">
                      <strong className="text-green-700">建议优先采购：</strong>该企业属于行业顶级供应商，合规能力强、产品丰富、市场覆盖广、风险低，可以作为核心稳定供应商长期合作。
                    </p>
                  ) : scoreData.totalScore >= 80 ? (
                    <p className="text-gray-700">
                      <strong className="text-green-700">建议采购：</strong>该企业属于行业优质供应商，合规能力较强，风险可控，可作为常规合作供应商。
                    </p>
                  ) : scoreData.totalScore >= 70 ? (
                    <p className="text-gray-700">
                      <strong className="text-yellow-700">谨慎采购：</strong>该企业合规能力一般，存在一定风险，建议要求对方补充相关合规证明材料，验证通过后再合作。
                    </p>
                  ) : (
                    <p className="text-gray-700">
                      <strong className="text-red-700">不建议采购：</strong>该企业合规能力较弱，风险较高，建议谨慎合作，优先选择评分更高的供应商。
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <section className="py-16 text-center">
          <div className="bg-gray-50 inline-block rounded-full p-8 mb-4">
            <Building2 className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">搜索企业名称查看合规竞争力评分</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            基于企业的认证覆盖、市场覆盖、产品规模、合规记录等多维度综合评分，帮助你选择优质合规的供应商
          </p>
        </section>
      )}
    </div>
  );
}
