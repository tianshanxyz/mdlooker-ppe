'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, FileText, Search, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export default function KnowledgeBaseContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 从Supabase加载法规数据
  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('regulations')
          .select('*')
          .order('last_updated', { ascending: false });
        
        if (error) throw error;
        
        // 转换字段名匹配之前的格式
        const formattedData = data.map(item => ({
          id: item.id,
          category: item.category,
          market: item.market,
          title: item.title,
          description: item.description,
          officialUrl: item.official_url,
          lastUpdated: item.last_updated
        }));
        
        setRegulations(formattedData);
      } catch (err) {
        console.error('加载法规数据失败:', err);
        setError('数据加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchRegulations();
  }, []);

  // 过滤数据
  const filteredRegulations = regulations.filter(reg => {
    const matchesSearch = reg.title.toLowerCase().includes(searchTerm.toLowerCase()) || reg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reg.category === selectedCategory;
    const matchesMarket = selectedMarket === 'all' || reg.market === selectedMarket;
    return matchesSearch && matchesCategory && matchesMarket;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <img src="/logo.png" alt="MDLOOKER Logo" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">PPE Regulation Knowledge Base</h1>
          <p className="text-xl text-gray-600">
            Global PPE regulation and standard database, all content with official source references, updated monthly.
          </p>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search regulation name, standard title or content..." 
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="口罩">Face Mask</SelectItem>
                    <SelectItem value="防护服">Protective Clothing</SelectItem>
                    <SelectItem value="手套">Protective Gloves</SelectItem>
                    <SelectItem value="眼面">Eye & Face Protection</SelectItem>
                    <SelectItem value="头部">Head Protection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Target Market</label>
                <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target market" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Markets</SelectItem>
                    <SelectItem value="欧盟">EU</SelectItem>
                    <SelectItem value="美国">USA</SelectItem>
                    <SelectItem value="英国">UK</SelectItem>
                    <SelectItem value="中东">GCC</SelectItem>
                    <SelectItem value="中国">China</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="col-span-2 text-center py-16 text-gray-500">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-[#339999] animate-spin" />
            <p>正在加载法规数据，请稍候...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && !loading && (
          <div className="col-span-2 text-center py-16 text-red-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* 法规列表 */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filteredRegulations.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No matching regulations found, please adjust your search criteria.</p>
              </div>
            ) : (
              filteredRegulations.map(reg => (
                <Card key={reg.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{reg.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className="inline-block px-2 py-1 bg-[#339999]/10 text-[#339999] rounded text-xs font-medium mr-2">
                            {reg.category === '口罩' ? 'Face Mask' : reg.category === '防护服' ? 'Protective Clothing' : reg.category === '手套' ? 'Gloves' : reg.category}
                          </span>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mr-2">
                            {reg.market === '欧盟' ? 'EU' : reg.market === '美国' ? 'USA' : reg.market === '英国' ? 'UK' : reg.market === '中东' ? 'GCC' : reg.market}
                          </span>
                          <span className="text-xs text-gray-500">Updated at {reg.lastUpdated}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm">{reg.description}</p>
                    <Link 
                      href={reg.officialUrl} 
                      target="_blank" 
                      className="inline-flex items-center text-[#339999] hover:underline text-sm font-medium"
                    >
                      View Official Source <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* 底部提示 */}
        <div className="max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
          <p>Database is continuously updated. For specific regulations or standards, please contact <a href="mailto:support@mdlooker.com" className="text-[#339999] hover:underline">support@mdlooker.com</a></p>
        </div>
      </div>
    </div>
  );
}
