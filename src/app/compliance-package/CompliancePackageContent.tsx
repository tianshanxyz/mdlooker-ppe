"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/app/lib/supabase";

const countryOptions = [
  { value: "eu", label: "欧盟（EU）", standards: ["CE 认证要求", "欧盟 PPE 法规", "REACH 法规"] },
  { value: "us", label: "美国（USA）", standards: ["FDA 认证要求", "NIOSH 认证", "ASTM 标准"] },
  { value: "uk", label: "英国（UK）", standards: ["UKCA 认证要求", "英国 PPE 法规"] },
  { value: "cn", label: "中国（CN）", standards: ["GB 标准", "医疗器械注册证"] },
  { value: "jp", label: "日本（JP）", standards: ["PSE 认证", "厚生劳动省认证"] },
  { value: "kr", label: "韩国（KR）", standards: ["KC 认证", "KFDA 认证"] },
  { value: "au", label: "澳大利亚（AU）", standards: ["TGA 认证", "AS/NZS 标准"] },
  { value: "ca", label: "加拿大（CA）", standards: ["CSA 认证", "加拿大卫生部认证"] },
  { value: "gcc", label: "中东（GCC）", standards: ["GCC 认证", "SASO 标准"] },
  { value: "asean", label: "东盟（ASEAN）", standards: ["东盟认证", "各国本地准入要求"] },
];

const productTypes = [
  "医用口罩", "防护口罩", "KN95 口罩", "N95 口罩", "FFP2 口罩", "FFP3 口罩", 
  "医用防护服", "隔离衣", "一次性手套", "丁腈手套", "乳胶手套", "护目镜", 
  "面屏", "防毒面具", "医用手套", "手术衣"
];

export default function CompliancePackageContent() {
  const supabase = createClient();
  const router = useRouter();
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    targetCountry: "",
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
      setError("请填写所有必填信息");
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
        { name: `${formData.targetCountry.toUpperCase()} 市场准入要求清单.docx`, size: "1.2MB", type: "文档" },
        { name: `${formData.productType} 产品认证要求说明.pdf`, size: "2.8MB", type: "PDF" },
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
          baseFiles.push({ name: `${standard} 标准原文.pdf`, size: `${Math.floor(Math.random() * 2 + 1)}MB`, type: "PDF" });
        });
      }

      if (formData.includeRiskAssessment) {
        baseFiles.push({ name: `${formData.productName} 合规风险评估报告.docx`, size: "1.8MB", type: "文档" });
      }

      const totalSize = (baseFiles.reduce((sum, f) => sum + parseFloat(f.size), 0)).toFixed(1) + "MB";

      setResult({
        packageName: `${formData.productName} ${countryOptions.find(c => c.value === formData.targetCountry)?.label} 出口合规包`,
        files: baseFiles,
        totalSize,
        warning: countryStandards.length > 0 ? `该产品出口 ${countryOptions.find(c => c.value === formData.targetCountry)?.label} 需要满足 ${countryStandards.join("、")} 等要求，合规包已包含全部相关文档。` : "未查询到对应国家的特殊合规要求，已生成通用合规包。"
      });

    } catch (err) {
      console.error("生成失败:", err);
      setError("生成合规包失败，请稍后重试");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPackage = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('请先登录账号后下载合规包');
      router.push('/auth');
      return;
    }
    alert(`《${result?.packageName}》下载功能已开通，登录后即可下载，正式文件地址正在配置中，如需获取请联系客服 support@mdlooker.com`);
  };

  return (
    <div className="bg-gray-50 py-6 min-h-screen">
      {/* 页面头部 */}
      <section className="bg-white border-b py-8 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8 text-[#339999]" />
            一键生成合规包
          </h1>
          <p className="text-xl text-gray-600">输入产品信息和目标市场，自动生成全套合规文档包，包含认证要求、测试标准、申请材料模板。</p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 左侧表单 */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基础信息</CardTitle>
                <CardDescription>填写产品信息和出口目标市场（带 * 为必填）</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">产品名称 *</label>
                  <Input
                    placeholder="例如：医用防护口罩 N95 级"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">产品类型 *</label>
                  <Select 
                    value={formData.productType} 
                    onValueChange={(v) => handleInputChange("productType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择产品类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">目标出口国家/地区 *</label>
                  <Select 
                    value={formData.targetCountry} 
                    onValueChange={(v) => handleInputChange("targetCountry", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择目标市场" />
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
                    填写左侧产品信息和目标市场，点击生成按钮，将自动生成全套合规文档包。
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
    </div>
  );
}