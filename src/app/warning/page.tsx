"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Calendar, Globe, ShieldCheck, Building2, Filter, Bell, CheckCircle2, Search } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const levelOptions = ["全部", "紧急", "高", "中", "低"];
const typeOptions = ["全部", "认证到期", "法规更新", "合规风险"];
const statusOptions = ["全部", "未处理", "已处理"];

export default function WarningCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    level: "全部",
    type: "全部",
    status: "全部",
  });
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0,
    processed: 0,
  });

  // 模拟生成预警数据（实际场景从后端接口获取）
  const generateWarningData = async () => {
    setLoading(true);
    try {
      // 获取所有认证数据
      const { data: certifications } = await supabase
        .from("certifications")
        .select("id, certification_number, certification_type, valid_until, status, product_id")
        .order("valid_until", { ascending: true });

      // 获取关联的产品数据
      const productIds = certifications?.map(c => c.product_id) || [];
      const { data: products } = await supabase
        .from("products")
        .select("id, name, brand, model, manufacturer, country")
        .in("id", productIds);

      const productMap = {};
      products?.forEach(p => productMap[p.id] = p);

      // 生成预警数据
      const warningList = [];
      let urgentCount = 0, highCount = 0, mediumCount = 0, lowCount = 0, processedCount = 0;

      certifications?.forEach((cert, index) => {
        if (!cert.valid_until) return;
        const expiryDate = new Date(cert.valid_until);
        const now = new Date();
        const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let level, type, title, description;

        if (diffDays <= 0) {
          // 已过期
          level = "紧急";
          urgentCount++;
          type = "认证到期";
          title = `认证已过期：${cert.certification_number}`;
          description = `产品 ${productMap[cert.product_id]?.name || '未知产品'} 的 ${cert.certification_type} 认证已于 ${cert.valid_until} 过期，请立即处理续期。`;
        } else if (diffDays <= 30) {
          // 1个月内到期
          level = "紧急";
          urgentCount++;
          type = "认证到期";
          title = `认证即将到期：${cert.certification_number}`;
          description = `产品 ${productMap[cert.product_id]?.name || '未知产品'} 的 ${cert.certification_type} 认证还有 ${diffDays} 天到期，请尽快续期。`;
        } else if (diffDays <= 90) {
          // 1-3个月到期
          level = "高";
          highCount++;
          type = "认证到期";
          title = `认证即将到期：${cert.certification_number}`;
          description = `产品 ${productMap[cert.product_id]?.name || '未知产品'} 的 ${cert.certification_type} 认证还有 ${diffDays} 天到期，请提前安排续期。`;
        } else if (diffDays <= 180) {
          // 3-6个月到期
          level = "中";
          mediumCount++;
          type = "认证到期";
          title = `认证即将到期：${cert.certification_number}`;
          description = `产品 ${productMap[cert.product_id]?.name || '未知产品'} 的 ${cert.certification_type} 认证还有 ${diffDays} 天到期，请关注续期进度。`;
        } else {
          // 6个月以上，低风险
          level = "低";
          lowCount++;
          type = "认证到期";
          title = `认证远期到期提醒：${cert.certification_number}`;
          description = `产品 ${productMap[cert.product_id]?.name || '未知产品'} 的 ${cert.certification_type} 认证还有 ${diffDays} 天到期，可提前规划续期。`;
        }

        warningList.push({
          id: cert.id,
          title,
          description,
          level,
          type,
          productName: productMap[cert.product_id]?.name || '未知产品',
          brand: productMap[cert.product_id]?.brand || '未知品牌',
          manufacturer: productMap[cert.product_id]?.manufacturer || '未知厂商',
          country: productMap[cert.product_id]?.country || '未知地区',
          expiryDate: cert.valid_until,
          daysLeft: diffDays,
          status: Math.random() > 0.7 ? "已处理" : "未处理",
          createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
      });

      // 添加模拟的法规更新预警
      const regulationWarnings = [
        {
          id: "reg-001",
          title: "欧盟PPE法规更新通知",
          description: "欧盟PPE法规 (EU) 2016/425 将于2026年7月1日更新，新增呼吸防护产品测试要求，相关产品需要重新认证。",
          level: "高",
          type: "法规更新",
          productName: "所有呼吸防护类产品",
          brand: "全部品牌",
          manufacturer: "所有厂商",
          country: "欧盟",
          expiryDate: "2026-07-01",
          daysLeft: Math.ceil((new Date("2026-07-01").getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          status: "未处理",
          createdAt: "2026-04-15",
        },
        {
          id: "reg-002",
          title: "美国FDA口罩认证要求更新",
          description: "美国FDA更新了医用口罩准入标准，2026年10月1日起所有出口美国的医用口罩需要符合新的细菌过滤效率测试要求。",
          level: "高",
          type: "法规更新",
          productName: "所有医用口罩",
          brand: "全部品牌",
          manufacturer: "所有厂商",
          country: "美国",
          expiryDate: "2026-10-01",
          daysLeft: Math.ceil((new Date("2026-10-01").getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          status: "未处理",
          createdAt: "2026-04-10",
        }
      ];

      warningList.unshift(...regulationWarnings);
      highCount += 2;

      setWarnings(warningList);
      processedCount = warningList.filter(w => w.status === "已处理").length;
      setStats({
        total: warningList.length,
        urgent: urgentCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
        processed: processedCount,
      });
    } catch (error) {
      console.error("加载预警数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateWarningData();
  }, []);

  // 过滤预警数据
  const filteredWarnings = warnings.filter(warning => {
    const matchesSearch = 
      warning.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warning.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warning.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warning.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = filters.level === "全部" || warning.level === filters.level;
    const matchesType = filters.type === "全部" || warning.type === filters.type;
    const matchesStatus = filters.status === "全部" || warning.status === filters.status;

    return matchesSearch && matchesLevel && matchesType && matchesStatus;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "紧急": return "bg-red-100 text-red-800 border-red-200";
      case "高": return "bg-orange-100 text-orange-800 border-orange-200";
      case "中": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "低": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "认证到期": return "bg-blue-100 text-blue-800";
      case "法规更新": return "bg-purple-100 text-purple-800";
      case "合规风险": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const markAsProcessed = async (id: string) => {
    setWarnings(prev => prev.map(w => w.id === id ? { ...w, status: "已处理" } : w));
    setStats(prev => ({ ...prev, processed: prev.processed + 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* 页面头部 */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Bell className="h-8 w-8 text-[#339999]" />
            合规预警中心
          </h1>
          <p className="text-gray-600">实时监控认证到期、法规更新、合规风险，提前预警降低合规风险</p>
        </div>
      </section>

      {/* 统计卡片 */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-6 gap-4">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  紧急预警
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  高风险
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  中风险
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-green-500" />
                  低风险
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{stats.low}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-gray-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-gray-500" />
                  已处理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-600">{stats.processed}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-[#339999]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Bell className="h-4 w-4 text-[#339999]" />
                  全部预警
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#339999]">{stats.total}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 筛选和搜索 */}
      <section className="pb-6">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#339999]" />
                筛选条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">搜索</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索预警标题、产品名称、厂商名称..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#339999] focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">风险等级</label>
                  <Select value={filters.level} onValueChange={(v) => setFilters({ ...filters, level: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择风险等级" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">预警类型</label>
                  <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择预警类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">处理状态</label>
                  <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择处理状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 预警列表 */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">正在加载预警数据，请稍候...</p>
            </div>
          ) : filteredWarnings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">没有找到匹配的预警信息</p>
              <p className="text-gray-400 mt-2">请调整搜索关键词或筛选条件</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredWarnings.map((warning: any) => (
                <Card key={warning.id} className={`border-l-4 ${warning.status === "已处理" ? "border-l-gray-300 opacity-70" : getLevelColor(warning.level).split(" ")[0].replace("bg-", "border-l-")} hover:shadow-md transition-shadow`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getLevelColor(warning.level)}>{warning.level}</Badge>
                          <Badge className={getTypeColor(warning.type)}>{warning.type}</Badge>
                          {warning.status === "已处理" && <Badge variant="outline" className="bg-gray-100 text-gray-600">已处理</Badge>}
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">{warning.title}</CardTitle>
                        <CardDescription className="mt-1">
                          预警时间：{warning.createdAt} | 剩余天数：{warning.daysLeft}天 | 截止日期：{warning.expiryDate}
                        </CardDescription>
                      </div>
                      {warning.status === "未处理" && (
                        <Button
                          size="sm"
                          className="bg-[#339999] hover:bg-[#2d8a8a] text-white"
                          onClick={() => markAsProcessed(warning.id)}
                        >
                          标记已处理
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{warning.description}</p>
                    <div className="grid md:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#339999]" />
                        <span>厂商：{warning.manufacturer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#339999]" />
                        <span>产品：{warning.productName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#339999]" />
                        <span>地区：{warning.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#339999]" />
                        <span>品牌：{warning.brand}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
