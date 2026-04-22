"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Globe, TrendingUp, AlertTriangle, Building2, ShieldCheck, Clock } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const COLORS = ["#339999", "#48b3b3", "#5ccccc", "#70e6e6", "#85ffff", "#99e6e6", "#adcccc", "#c2b3b3", "#d69999", "#eb8080"];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCertifications: 0,
    totalRegulations: 0,
    expiringCount: 0,
  });
  const [countryData, setCountryData] = useState([]);
  const [productTypeData, setProductTypeData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [expiryData, setExpiryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 加载统计数据
      const [productRes, certRes, regRes] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("certifications").select("*", { count: "exact", head: true }),
        supabase.from("regulations").select("*", { count: "exact", head: true }),
      ]);

      // 加载国家分布数据
      const { data: countryRes } = await supabase
        .from("products")
        .select("country")
        .then(({ data }) => {
          const counts: Record<string, number> = {};
          data?.forEach((p) => {
            counts[p.country] = (counts[p.country] || 0) + 1;
          });
          return {
            data: Object.entries(counts)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 10),
          };
        });

      // 加载产品类型分布
      const { data: productTypeRes } = await supabase.from("products").select("name");
      const typeCounts: Record<string, number> = {};
      const types = ["医用口罩", "防护口罩", "KN95", "N95", "FFP2", "FFP3", "防护服", "隔离衣", "手套", "护目镜", "面罩"];
      productTypeRes?.forEach((p) => {
        for (const t of types) {
          if (p.name.includes(t)) {
            typeCounts[t] = (typeCounts[t] || 0) + 1;
            break;
          }
        }
      });
      const productTypeData = Object.entries(typeCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      // 加载品牌排名
      const { data: brandRes } = await supabase.from("products").select("brand");
      const brandCounts: Record<string, number> = {};
      brandRes?.forEach((p) => {
        if (p.brand) {
          brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
        }
      });
      const brandData = Object.entries(brandCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      // 加载到期预警数据
      const { data: expiryRes } = await supabase.from("certifications").select("valid_until, status");
      const expiryCounts: Record<string, number> = {
        "1个月内": 0,
        "1-3个月": 0,
        "3-6个月": 0,
        "6个月以上": 0,
        "已过期": 0,
      };
      expiryRes?.forEach((c) => {
        if (c.status === "expired") {
          expiryCounts["已过期"]++;
          return;
        }
        if (!c.valid_until) return;
        const expiryDate = new Date(c.valid_until);
        const now = new Date();
        const diffMonths = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (diffMonths < 0) expiryCounts["已过期"]++;
        else if (diffMonths < 1) expiryCounts["1个月内"]++;
        else if (diffMonths < 3) expiryCounts["1-3个月"]++;
        else if (diffMonths < 6) expiryCounts["3-6个月"]++;
        else expiryCounts["6个月以上"]++;
      });
      const expiryData = Object.entries(expiryCounts).map(([name, value]) => ({ name, value }));

      // 更新状态
      setStats({
        totalProducts: productRes.count || 0,
        totalCertifications: certRes.count || 0,
        totalRegulations: regRes.count || 0,
        expiringCount: expiryCounts["1个月内"] + expiryCounts["1-3个月"] + expiryCounts["3-6个月"],
      });
      setCountryData(countryRes || []);
      setProductTypeData(productTypeData);
      setBrandData(brandData);
      setExpiryData(expiryData);
    } catch (error) {
      console.error("加载数据失败：", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">数据加载中，请稍候...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* 页面头部 */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">行业数据看板</h1>
          <p className="text-gray-600">全球PPE医疗器械合规数据全景分析</p>
        </div>
      </section>

      {/* 统计卡片 */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#339999]" />
                  产品总数量
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+12.5% 较上月</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#339999]" />
                  认证总数量
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCertifications.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+8.3% 较上月</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#339999]" />
                  法规总数量
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRegulations.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+3.2% 较上月</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  即将到期认证
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">{stats.expiringCount.toLocaleString()}</p>
                <p className="text-xs text-red-600 mt-1">需要在6个月内续期</p>
              </CardContent>
            </Card>
          </div>

          {/* 图表区域 */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="overview">全球分布</TabsTrigger>
              <TabsTrigger value="products">产品分析</TabsTrigger>
              <TabsTrigger value="brands">品牌排名</TabsTrigger>
              <TabsTrigger value="expiry">到期预警</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#339999]" />
                    各地区认证数量分布
                  </CardTitle>
                  <CardDescription>统计全球10个主要市场的PPE产品认证数量</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#339999" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#339999]" />
                    各产品类型数量分布
                  </CardTitle>
                  <CardDescription>统计不同品类PPE产品的认证数量占比</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brands" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#339999]" />
                    品牌合规产品数量排名TOP10
                  </CardTitle>
                  <CardDescription>按各品牌拥有的有效认证产品数量排序</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brandData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={90} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#339999" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expiry" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#339999]" />
                    认证到期时间分布
                  </CardTitle>
                  <CardDescription>统计不同时间段内到期的认证数量</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={expiryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#339999" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
