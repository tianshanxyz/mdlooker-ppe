"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, ShieldCheck, Globe, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const countryOptions = [
  { value: "欧盟", label: "欧盟 EU", standards: ["CE认证", "EU PPE法规", "REACH法规"] },
  { value: "美国", label: "美国 USA", standards: ["FDA认证", "NIOSH认证", "ASTM标准"] },
  { value: "英国", label: "英国 UK", standards: ["UKCA认证", "英国PPE法规"] },
  { value: "中国", label: "中国 CN", standards: ["GB标准", "医疗器械注册证"] },
  { value: "日本", label: "日本 JP", standards: ["PSE认证", "厚生劳动省认证"] },
  { value: "韩国", label: "韩国 KR", standards: ["KC认证", "KFDA认证"] },
  { value: "澳大利亚", label: "澳大利亚 AU", standards: ["TGA认证", "AS/NZS标准"] },
  { value: "加拿大", label: "加拿大 CA", standards: ["CSA认证", "Health Canada认证"] },
  { value: "中东GCC", label: "中东 GCC", standards: ["GCC认证", "SASO标准"] },
  { value: "东盟", label: "东盟 ASEAN", standards: ["ASEAN认证", "各国本地准入要求"] },
];

const productTypes = [
  "医用口罩", "防护口罩", "KN95口罩", "N95口罩", "FFP2口罩", "FFP3口罩", 
  "医用防护服", "隔离衣", "一次性手套", "丁腈手套", "乳胶手套", "护目镜", 
  "防护面罩", "防毒面具", "医用手套", "手术衣"
];

const packageTypes = [
  { id: "basic", name: "基础合规包", desc: "包含基础认证要求、标准文档模板", items: ["认证要求清单", "标准法规原文", "申请流程指南"] },
  { id: "standard", name: "标准合规包", desc: "包含基础包全部内容+申请材料模板+测试标准", items: ["基础包全部内容", "申请材料模板", "测试标准文档", "样本报告参考"] },
  { id: "premium", name: "高级合规包", desc: "包含标准包全部内容+定制化方案+专家咨询服务", items: ["标准包全部内容", "定制化合规方案", "专家1对1咨询", "风险评估报告"] },
];

export default function CompliancePackagePage() {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    targetCountry: "",
    packageType: "standard",
    includeTestStandards: true,
    includeTemplates: true,
    includeRiskAssessment: false,
  });
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | {
    packageName: string;
    files: { name: string; size: string; type: string }[];
    totalSize: string;
    warning: string;
  }>(null);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePackage = async () => {
    if (!formData.productName || !formData.productType || !formData.targetCountry) {
      setError("请完善所有必填信息");
      return;
    }

    setError("");
    setGenerating(true);
    setProgress(0);
    setResult(null);

    try {
      // 模拟生成进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      // 查询相关法规和认证数据
      const countryStandards = countryOptions.find(c => c.value === formData.targetCountry)?.standards || [];
      
      // 模拟生成文件
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);

      // 生成结果
      const baseFiles = [
        { name: `${formData.targetCountry}市场准入要求清单.docx`, size: "1.2MB", type: "文档" },
        { name: `${formData.productType}产品认证要求说明.pdf`, size: "2.8MB", type: "PDF" },
        { name: "合规申请流程指南.md", size: "320KB", type: "文档" },
      ];

      if (formData.includeTemplates) {
        baseFiles.push(
          { name: "认证申请材料模板.zip", size: "5.7MB", type: "压缩包" },
          { name: "测试报告样本参考.docx", size: "3.4MB", type: "文档" }
        );
      }

      if (formData.includeTestStandards) {
        countryStandards.forEach(standard => {
          baseFiles.push({ name: `${standard}标准原文.pdf`, size: `${Math.floor(Math.random() * 10 + 2)}MB`, type: "PDF" });
        });
      }

      if (formData.includeRiskAssessment) {
        baseFiles.push({ name: `${formData.productName}合规风险评估报告.docx`, size: "1.8MB", type: "文档" });
      }

      const totalSize = (baseFiles.reduce((sum, f) => sum + parseFloat(f.size), 0)).toFixed(1) + "MB";

      setResult({
        packageName: `${formData.productName}${formData.targetCountry}出口合规包`,
        files: baseFiles,
        totalSize,
        warning: countryStandards.length > 0 ? `该产品出口${formData.targetCountry}需要满足${countryStandards.join("、")}等要求，合规包已包含全部相关文档。` : "未查询到对应国家的特殊合规要求，已生成通用合规包。"
      });

    } catch (err) {
      console.error("生成失败:", err);
      setError("生成合规包失败，请稍后重试");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPackage = () => {
    alert("合规包已开始下载，请注意保存文件");
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
            <a href="/compliance-package" className="text-[#339999] font-medium font-bold">合规包生成</a>
            <a href="/compliance-check" className="text-gray-600 hover:text-[#339999] font-medium">合规检查</a>
          </div>
        </div>
      </nav>

      {/* 页面头部 */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8 text-[#339999]" />
            一键生成合规包
          </h1>
          <p className="text-gray-600">输入产品信息和目标市场，自动生成全套合规文档包，包含认证要求、测试标准、申请材料模板、风险评估报告等</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* 左侧表单 */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>基础信息</CardTitle>
                  <CardDescription>填写产品信息和出口目标市场</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">产品名称 <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="例如：医用防护口罩N95级"
                      value={formData.productName}
                      onChange={(e) => handleInputChange("productName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">产品类型 <span className="text-red-500">*</span></label>
                    <Select 
                      value={formData.productType} 
                      onValueChange={(v) => handleInputChange("productType", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择产品类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">目标出口国家/地区 <span className="text-red-500">*</span></label>
                    <Select 
                      value={formData.targetCountry} 
                      onValueChange={(v) => handleInputChange("targetCountry", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择目标市场" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map(country => (
                          <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>合规包配置</CardTitle>
                  <CardDescription>选择需要生成的文档内容</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">合规包类型</label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {packageTypes.map(type => (
                        <div
                          key={type.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.packageType === type.id ? "border-[#339999] bg-[#339999]/5" : "border-gray-200 hover:border-gray-300"}`}
                          onClick={() => handleInputChange("packageType", type.id)}
                        >
                          <div className="font-medium text-gray-900 mb-1">{type.name}</div>
                          <p className="text-xs text-gray-600 mb-2">{type.desc}</p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            {type.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-[#339999]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">可选内容</label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="testStandards" 
                        checked={formData.includeTestStandards}
                        onCheckedChange={(checked) => handleInputChange("includeTestStandards", checked)}
                      />
                      <label htmlFor="testStandards" className="text-sm text-gray-700 cursor-pointer">
                        包含测试标准原文文档
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="templates" 
                        checked={formData.includeTemplates}
                        onCheckedChange={(checked) => handleInputChange("includeTemplates", checked)}
                      />
                      <label htmlFor="templates" className="text-sm text-gray-700 cursor-pointer">
                        包含申请材料模板、报告样本
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="riskAssessment" 
                        checked={formData.includeRiskAssessment}
                        onCheckedChange={(checked) => handleInputChange("includeRiskAssessment", checked)}
                      />
                      <label htmlFor="riskAssessment" className="text-sm text-gray-700 cursor-pointer">
                        生成定制化合规风险评估报告（高级版功能）
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white text-lg py-6 h-auto"
                    onClick={generatePackage}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        正在生成合规包...
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5 mr-2" />
                        一键生成合规包
                      </>
                    )}
                  </Button>
                  {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
                </CardFooter>
              </Card>

              {/* 生成进度 */}
              {generating && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">生成进度</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-gray-600 text-center">
                      {progress < 30 ? "正在查询目标市场合规要求..." : 
                       progress < 60 ? "正在生成文档模板..." : 
                       progress < 90 ? "正在整理测试标准和法规原文..." : 
                       "正在打包生成下载文件..."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 右侧结果 */}
            <div className="space-y-6">
              {result ? (
                <Card className="border-l-4 border-l-[#339999] sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      合规包生成完成
                    </CardTitle>
                    <CardDescription>{result.packageName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p>{result.warning}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">包含文件</h3>
                        <span className="text-sm text-gray-500">总计 {result.totalSize}</span>
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {result.files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-[#339999]" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button 
                      className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white"
                      onClick={downloadPackage}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下载全部合规包
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="bg-gray-50 border-dashed border-gray-300 sticky top-24">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-700 font-medium mb-2">等待生成合规包</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      填写左侧产品信息和目标市场，点击生成按钮，将自动生成全套合规文档包
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* 优势说明 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">合规包优势</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">官方标准最新</p>
                      <p className="text-xs text-gray-600">所有文档同步最新官方标准，每月更新</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">通过率提升80%</p>
                      <p className="text-xs text-gray-600">基于数十万成功案例整理，大幅提高申请通过率</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">节省90%时间</p>
                      <p className="text-xs text-gray-600">不用再手动查找资料，几分钟生成全套合规材料</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
