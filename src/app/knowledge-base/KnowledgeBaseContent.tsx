'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, FileText, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// 模拟数据，后面换成Supabase里的真实数据
const regulations = [
  {
    id: 1,
    category: "口罩",
    market: "欧盟",
    title: "EU 2016/425 个人防护设备法规",
    description: "欧盟PPE法规，规定了个人防护设备的基本健康和安全要求，以及合格评定程序。",
    officialUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0425",
    lastUpdated: "2024-03-15"
  },
  {
    id: 2,
    category: "口罩",
    market: "欧盟",
    title: "EN 149:2001+A1:2009 呼吸防护装置标准",
    description: "欧盟口罩性能标准，规定了过滤效率、呼吸阻力、泄露率等技术要求。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:3297,62985319",
    lastUpdated: "2023-11-20"
  },
  {
    id: 3,
    category: "口罩",
    market: "美国",
    title: "FDA 21 CFR Part 878 医用口罩法规",
    description: "美国FDA关于医用口罩的分类和监管要求，包括510(k)认证流程。",
    officialUrl: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?CFRPart=878",
    lastUpdated: "2024-01-05"
  },
  {
    id: 4,
    category: "口罩",
    market: "美国",
    title: "NIOSH 42 CFR Part 84 呼吸防护认证标准",
    description: "美国NIOSH关于职业用呼吸防护设备的认证标准，包括N95、N99等等级要求。",
    officialUrl: "https://www.cdc.gov/niosh/npptl/standards.html",
    lastUpdated: "2023-09-12"
  },
  {
    id: 5,
    category: "口罩",
    market: "英国",
    title: "UKCA 个人防护设备法规",
    description: "英国脱欧后的PPE监管要求，取代原来的CE认证在英国市场的效力。",
    officialUrl: "https://www.gov.uk/guidance/using-the-ukca-marking",
    lastUpdated: "2024-02-28"
  },
  {
    id: 6,
    category: "口罩",
    market: "中东",
    title: "GCC 个人防护设备技术法规",
    description: "海湾阿拉伯国家合作委员会的PPE产品认证要求，获得G-mark可进入所有GCC国家市场。",
    officialUrl: "https://www.gso.org.sa/standards/technical-regulations/PPE",
    lastUpdated: "2023-12-01"
  },
  {
    id: 7,
    category: "防护服",
    market: "欧盟",
    title: "EN 14126:2003 防护服防感染性能标准",
    description: "欧盟防护服防微生物穿透性能的测试方法和要求。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:2764,62985319",
    lastUpdated: "2023-08-15"
  },
  {
    id: 8,
    category: "防护服",
    market: "美国",
    title: "NFPA 1999 急救用防护服标准",
    description: "美国消防协会关于急救人员用防护服的性能要求。",
    officialUrl: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=1999",
    lastUpdated: "2024-03-01"
  },
  {
    id: 9,
    category: "手套",
    market: "欧盟",
    title: "EN 455 医用手套标准系列",
    description: "欧盟医用手套的性能、测试方法和标识要求。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:1987,62985319",
    lastUpdated: "2023-10-10"
  },
  {
    id: 10,
    category: "手套",
    market: "美国",
    title: "ASTM D3577 橡胶检查手套标准规范",
    description: "美国材料与试验协会关于橡胶检查手套的性能要求。",
    officialUrl: "https://www.astm.org/d3578-21.html",
    lastUpdated: "2023-07-20"
  }
];

export default function KnowledgeBaseContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');

  // 过滤数据
  const filteredRegulations = regulations.filter(reg => {
    const matchesSearch = reg.title.toLowerCase().includes(searchTerm.toLowerCase()) || reg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reg.category === selectedCategory;
    const matchesMarket = selectedMarket === 'all' || reg.market === selectedMarket;
    return matchesSearch && matchesCategory && matchesMarket;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />
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

        {/* 法规列表 */}
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

        {/* 底部提示 */}
        <div className="max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
          <p>Database is continuously updated. For specific regulations or standards, please contact <a href="mailto:support@mdlooker.com" className="text-[#339999] hover:underline">support@mdlooker.com</a></p>
        </div>
      </div>
    </div>
  );
}
