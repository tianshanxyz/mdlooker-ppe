'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Send, CheckCircle, AlertTriangle, FileDown } from "lucide-react";
import Link from "next/link";

const complianceRules = {
  masks: {
    eu: {
      certifications: ["CE (PPE Regulation 2016/425)", "EN 149:2001+A1:2009", "公告机构审核"],
      cost: "¥70,000 - ¥120,000",
      time: "4 - 6周",
      riskLevel: "Medium",
    },
    us: {
      certifications: ["FDA 510(k) Clearance", "NIOSH Approval", "ASTM F2100 Level 测试"],
      cost: "¥180,000 - ¥300,000",
      time: "8 - 12周",
      riskLevel: "High",
    },
    uk: {
      certifications: ["UKCA Marking", "BS EN 149:2001+A1:2009", "英国授权机构认证"],
      cost: "¥60,000 - ¥100,000",
      time: "3 - 5周",
      riskLevel: "Medium",
    },
    middle_east: {
      certifications: ["GCC Conformity Mark", "SASO Certification", "本地代理商注册"],
      cost: "¥50,000 - ¥80,000",
      time: "2 - 4周",
      riskLevel: "Low",
    }
  },
  protective_clothing: {
    eu: {
      certifications: ["CE (PPE Regulation 2016/425)", "EN 14126:2003 感染防护测试", "EN ISO 13688:2013"],
      cost: "¥100,000 - ¥150,000",
      time: "5 - 7周",
      riskLevel: "Medium",
    },
    us: {
      certifications: ["FDA Clearance", "NFPA 1999 认证", "ASTM F1670/F1671 测试"],
      cost: "¥200,000 - ¥350,000",
      time: "10 - 14周",
      riskLevel: "High",
    },
    uk: {
      certifications: ["UKCA Marking", "BS EN 14126:2003", "英国授权机构审核"],
      cost: "¥80,000 - ¥120,000",
      time: "4 - 6周",
      riskLevel: "Medium",
    },
    middle_east: {
      certifications: ["GCC Mark", "GSO 标准认证", "本地注册"],
      cost: "¥60,000 - ¥90,000",
      time: "3 - 5周",
      riskLevel: "Low",
    }
  },
  gloves: {
    eu: {
      certifications: ["CE (PPE Regulation 2016/425)", "EN 455 系列测试", "EN 374 化学防护测试（如需）"],
      cost: "¥50,000 - ¥80,000",
      time: "3 - 5周",
      riskLevel: "Low",
    },
    us: {
      certifications: ["FDA 510(k) / 21 CFR Part 820", "ASTM D3577 测试", "NIOSH Approval（如需）"],
      cost: "¥100,000 - ¥180,000",
      time: "6 - 10周",
      riskLevel: "Medium",
    },
    uk: {
      certifications: ["UKCA Marking", "BS EN 455 系列测试", "英国授权机构认证"],
      cost: "¥45,000 - ¥70,000",
      time: "2 - 4周",
      riskLevel: "Low",
    },
    middle_east: {
      certifications: ["GCC Conformity Mark", "GSO EN 455 认证", "本地进口注册"],
      cost: "¥40,000 - ¥60,000",
      time: "2 - 3周",
      riskLevel: "Low",
    }
  }
};

const categoryLabels = {
  masks: "口罩（医用/防护/一次性）",
  protective_clothing: "防护服（隔离衣/手术衣/防护衣）",
  gloves: "防护手套（医用/工业/一次性）"
};

const marketLabels = {
  eu: "欧盟（EU）",
  us: "美国（USA）",
  uk: "英国（UK）",
  middle_east: "中东（GCC）"
};

export default function ComplianceCheckContent() {
  const [formData, setFormData] = useState({
    productCategory: "",
    targetMarket: "",
    productName: "",
    userName: "",
    userEmail: "",
  });
  const [result, setResult] = useState<null | typeof complianceRules.masks.eu>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCalculate = () => {
    if (!formData.productCategory || !formData.targetMarket) {
      setNotification({ type: 'error', message: "请先选择产品类别和目标市场" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    const rule = complianceRules[formData.productCategory as keyof typeof complianceRules][formData.targetMarket as keyof typeof complianceRules.masks];
    setResult(rule);
    window.scrollTo({ top: document.getElementById('result-section')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || !formData.userName || !formData.userEmail) {
      setNotification({ type: 'error', message: "请填写所有必填字段" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setLoading(true);
    try {
      // 模拟发送邮件
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setNotification({ type: 'success', message: "报告已成功发送到您的邮箱！请注意查收" });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: "发送报告失败，请稍后重试或联系客服 support@mdlooker.com" });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">报告发送成功！</CardTitle>
                <CardDescription>
                  您的完整合规报告已发送到 <strong>{formData.userEmail}</strong>，请查收收件箱（如未找到请检查垃圾邮件）。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  报告包含以下内容：
                </p>
                <ul className="text-left max-w-sm mx-auto space-y-2 text-gray-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#339999]" />
                    <span>所需认证完整清单及官方参考链接</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#339999]" />
                    <span>详细费用明细和周期预估</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#339999]" />
                    <span>申请流程分步指南</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#339999]" />
                    <span>推荐公告机构和测试实验室清单</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Button variant="secondary" onClick={() => {
                  setSubmitted(false);
                  setResult(null);
                  setFormData({
                    productCategory: "",
                    targetMarket: "",
                    productName: "",
                    userName: "",
                    userEmail: "",
                  });
                }}>
                  生成新报告
                </Button>
                <Link href="/pricing">
                  <Button className="bg-[#339999] hover:bg-[#2d8a8a]">
                    查看定价方案
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* 全局通知 */}
      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg max-w-md w-full flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <img src="/logo.png" alt="H-Guardian Logo" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">PPE合规检查工具</h1>
          <p className="text-xl text-gray-600">
            快速获取PPE产品进入全球市场的合规报告，减少认证时间，避免合规风险。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>填写产品信息</CardTitle>
              <CardDescription>带 * 的为必填字段</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span>产品类别 *</span>
                <Select 
                  value={formData.productCategory} 
                  onValueChange={(value) => setFormData({...formData, productCategory: value})}
                >
                  <SelectTrigger id="product-category">
                    <SelectValue placeholder="请选择产品类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <span>目标市场 *</span>
                <Select 
                  value={formData.targetMarket} 
                  onValueChange={(value) => setFormData({...formData, targetMarket: value})}
                >
                  <SelectTrigger id="target-market">
                    <SelectValue placeholder="请选择目标市场" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(marketLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <span>产品名称/型号</span>
                <Input 
                  id="product-name" 
                  placeholder="例如：FFP2 一次性防护口罩" 
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                />
              </div>

              <Button 
                className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white mt-4" 
                onClick={handleCalculate}
              >
                计算合规要求
              </Button>
            </CardContent>
          </Card>

          <Card id="result-section">
            <CardHeader>
              <CardTitle>合规结果</CardTitle>
              <CardDescription>
                {result ? "基于您选择的产品和市场" : "填写左侧表单查看结果"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>点击计算后将显示合规摘要</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">所需认证</h3>
                    <ul className="space-y-2">
                      {result.certifications.map((cert, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <CheckCircle className="h-5 w-5 text-[#339999] mt-0.5 flex-shrink-0" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">预估费用</p>
                      <p className="font-semibold text-gray-900">{result.cost}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">处理周期</p>
                      <p className="font-semibold text-gray-900">{result.time}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">风险等级</p>
                      <p className={`font-semibold ${
                        result.riskLevel === 'High' ? 'text-red-600' : 
                        result.riskLevel === 'Medium' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {result.riskLevel === 'High' ? '高风险' : result.riskLevel === 'Medium' ? '中风险' : '低风险'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">获取完整详细报告</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <span>您的姓名 *</span>
                        <Input 
                          id="user-name" 
                          placeholder="请输入您的姓名" 
                          value={formData.userName}
                          onChange={(e) => setFormData({...formData, userName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <span>您的邮箱 *</span>
                        <Input 
                          id="user-email" 
                          type="email" 
                          placeholder="请输入您的邮箱地址" 
                          value={formData.userEmail}
                          onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            发送报告中...
                          </>
                        ) : (
                          <>
                            发送完整报告到我的邮箱
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}