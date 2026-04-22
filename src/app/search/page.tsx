"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Globe, ShieldCheck, Building2, Star } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const countries = ["All", "EU", "US", "UK", "CN", "JP", "KR", "AU", "CA", "GCC", "ASEAN"];
const certificationTypes = ["All", "CE", "FDA", "UKCA", "GB", "PSE", "KC", "G-mark", "TGA", "ANVISA", "FDA 510(k)"];
const productTypes = ["All", "Medical Mask", "Protective Mask", "KN95 Mask", "N95 Mask", "FFP2 Mask", "FFP3 Mask", "Medical Protective Suit", "Isolation Gown", "Disposable Gloves", "Nitrile Gloves", "Latex Gloves", "Goggles", "Face Shield", "Gas Mask"];
const statusOptions = ["All", "valid", "expired", "suspended"];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    productType: "全部",
    certificationType: "全部",
    country: "全部",
    status: "全部",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let query = supabase.from("products").select(`
        id, name, brand, model, registration_number, manufacturer, country, 
        certification_type, expiration_date, description,
        certifications (certification_number, status, valid_until, issuing_authority),
        regulations (regulation_name, country, issue_date)
      `, { count: "exact" });

      // 搜索关键词
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%, brand.ilike.%${searchQuery}%, model.ilike.%${searchQuery}%, manufacturer.ilike.%${searchQuery}%`);
      }

      // 过滤条件
      if (filters.productType !== "全部") {
        query = query.ilike("name", `%${filters.productType}%`);
      }
      if (filters.certificationType !== "全部") {
        query = query.eq("certification_type", filters.certificationType);
      }
      if (filters.country !== "全部") {
        query = query.eq("country", filters.country);
      }
      if (filters.status !== "全部") {
        query = query.eq("certifications.status", filters.status);
      }

      // 排序
      query = query.order("expiration_date", { ascending: false });

      const { data, count, error } = await query.limit(50);
      if (error) throw error;
      setResults(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("搜索失败：", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid": return "Valid";
      case "expired": return "Expired";
      case "suspended": return "Suspended";
      default: return status;
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* 搜索头部 */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">PPE合规数据检索</h1>
          
          {/* 搜索框 */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="搜索产品名称、品牌、型号、生产商..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              className="bg-[#339999] hover:bg-[#2d8a8a] h-12 px-6 text-lg"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "搜索中..." : "搜索"}
            </Button>
            <Button
              variant="secondary"
              className="h-12 px-4"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              筛选
            </Button>
          </div>

          {/* 筛选条件 */}
          {showFilters && (
            <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">产品类型</label>
                <Select value={filters.productType} onValueChange={(v) => setFilters({ ...filters, productType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择产品类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">认证类型</label>
                <Select value={filters.certificationType} onValueChange={(v) => setFilters({ ...filters, certificationType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择认证类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificationTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">国家/地区</label>
                <Select value={filters.country} onValueChange={(v) => setFilters({ ...filters, country: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择国家/地区" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">认证状态</label>
                <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择认证状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s === "全部" ? "全部" : getStatusText(s)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">找到 {totalCount} 条相关结果</p>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Searching, please wait...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">No matching results found</p>
              <p className="text-gray-400 mt-2">Please try adjusting your search keywords or filters</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((product: any) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">{product.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className="font-medium">{product.brand}</span> | Model: {product.model} | Registration No.: {product.registration_number}
                        </CardDescription>
                      </div>
                      {product.certifications?.[0] && (
                        <Badge className={`${getStatusColor(product.certifications[0].status)}`}>
                          {getStatusText(product.certifications[0].status)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="h-4 w-4 text-[#339999]" />
                          <span>Manufacturer: {product.manufacturer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="h-4 w-4 text-[#339999]" />
                          <span>Market: {product.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <ShieldCheck className="h-4 w-4 text-[#339999]" />
                          <span>Certification Type: {product.certification_type}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {product.certifications?.[0] && (
                          <>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4 text-[#339999]" />
                              <span>Valid Until: {product.certifications[0].valid_until}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <span className="h-4 w-4 text-[#339999]">🏢</span>
                              <span>Issuing Authority: {product.certifications[0].issuing_authority}</span>
                            </div>
                          </>
                        )}
                        {product.regulations?.[0] && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="h-4 w-4 text-[#339999]">📜</span>
                            <span>Compliant with Regulation: {product.regulations[0].regulation_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {product.description && (
                      <p className="text-gray-600 mt-4 line-clamp-2">{product.description}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex gap-2">
                      <Badge variant="outline">{product.certification_type}</Badge>
                      <Badge variant="outline">{product.country}</Badge>
                    </div>
                    <Button size="sm" className="bg-[#339999] hover:bg-[#2d8a8a] text-white">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
