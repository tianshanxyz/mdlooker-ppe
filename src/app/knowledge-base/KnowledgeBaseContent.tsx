'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Search, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

// 静态法规数据
const regulations = [
  {
    id: 1,
    category: "masks",
    market: "eu",
    title: "EU 2016/425 个人防护设备法规",
    description: "欧盟PPE法规，规定了个人防护设备的基本健康和安全要求，以及合格评定程序，所有出口欧盟的PPE产品必须符合该法规要求。",
    officialUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0425",
    lastUpdated: "2024-03-15"
  },
  {
    id: 2,
    category: "masks",
    market: "eu",
    title: "EN 149:2001+A1:2009 呼吸防护装置标准",
    description: "欧盟口罩性能标准，规定了过滤效率、呼吸阻力、泄露率等技术要求，分为FFP1、FFP2、FFP3三个防护等级。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:3297,62985319",
    lastUpdated: "2023-11-20"
  },
  {
    id: 3,
    category: "masks",
    market: "us",
    title: "FDA 21 CFR Part 878 医用口罩法规",
    description: "美国FDA关于医用口罩的分类和监管要求，包括510(k)认证流程，医用口罩属于II类医疗器械，需要FDA注册。",
    officialUrl: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?CFRPart=878",
    lastUpdated: "2024-01-05"
  },
  {
    id: 4,
    category: "masks",
    market: "us",
    title: "NIOSH 42 CFR Part 84 呼吸防护认证标准",
    description: "美国NIOSH关于职业用呼吸防护设备的认证标准，包括N95、N99、N100、R95、P95等多个等级要求。",
    officialUrl: "https://www.cdc.gov/niosh/npptl/standards.html",
    lastUpdated: "2023-09-12"
  },
  {
    id: 5,
    category: "masks",
    market: "uk",
    title: "UKCA 个人防护设备法规",
    description: "英国脱欧后的PPE监管要求，取代原来的CE认证在英国市场的效力，2025年1月1日起CE认证在英国不再有效。",
    officialUrl: "https://www.gov.uk/guidance/using-the-ukca-marking",
    lastUpdated: "2024-02-28"
  },
  {
    id: 6,
    category: "masks",
    market: "middle_east",
    title: "GCC 个人防护设备技术法规",
    description: "海湾阿拉伯国家合作委员会的PPE产品认证要求，获得G-mark可进入沙特、阿联酋、卡塔尔等所有GCC国家市场。",
    officialUrl: "https://www.gso.org.sa/standards/technical-regulations/PPE",
    lastUpdated: "2023-12-01"
  },
  {
    id: 7,
    category: "protective_clothing",
    market: "eu",
    title: "EN 14126:2003 防护服防感染性能标准",
    description: "欧盟防护服防微生物穿透性能的测试方法和要求，适用于医用防护服、隔离衣等产品。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:2764,62985319",
    lastUpdated: "2023-08-15"
  },
  {
    id: 8,
    category: "protective_clothing",
    market: "us",
    title: "NFPA 1999 急救用防护服标准",
    description: "美国消防协会关于急救人员用防护服的性能要求，包括血液、体液穿透防护等指标。",
    officialUrl: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=1999",
    lastUpdated: "2024-03-01"
  },
  {
    id: 9,
    category: "gloves",
    market: "eu",
    title: "EN 455 医用手套标准系列",
    description: "欧盟医用手套的性能、测试方法和标识要求，分为EN 455-1到EN 455-4四个部分，包括生物相容性、防水性等要求。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:1987,62985319",
    lastUpdated: "2023-10-10"
  },
  {
    id: 10,
    category: "gloves",
    market: "us",
    title: "ASTM D3577 橡胶检查手套标准规范",
    description: "美国材料与试验协会关于橡胶检查手套的性能要求，包括拉伸强度、伸长率、蛋白含量等指标。",
    officialUrl: "https://www.astm.org/d3578-21.html",
    lastUpdated: "2023-07-20"
  },
  // 新增20条法规
  {
    id: 11,
    category: "masks",
    market: "australia",
    title: "澳大利亚TGA 医用口罩监管要求",
    description: "澳大利亚治疗用品管理局关于医用口罩的分类和监管要求，所有医用口罩必须在TGA注册后方可进入澳洲市场。",
    officialUrl: "https://www.tga.gov.au/medical-devices/masks-and-respirators",
    lastUpdated: "2024-01-20"
  },
  {
    id: 12,
    category: "masks",
    market: "australia",
    title: "AS/NZS 1716:2012 呼吸防护设备标准",
    description: "澳大利亚和新西兰联合发布的呼吸防护设备标准，规定了口罩的性能要求和测试方法，分为P1、P2、P3等级。",
    officialUrl: "https://www.standards.org.au/standards-catalogue/sa/snz/1716/2012",
    lastUpdated: "2023-06-15"
  },
  {
    id: 13,
    category: "masks",
    market: "japan",
    title: "日本厚生劳动省 医用口罩认证标准",
    description: "日本厚生劳动省发布的医用口罩认证要求，分为DS1、DS2、DS3等级，所有出口日本的医用口罩必须取得厚劳省认证。",
    officialUrl: "https://www.mhlw.go.jp/english/topics/medicaldevices/",
    lastUpdated: "2023-11-01"
  },
  {
    id: 14,
    category: "masks",
    market: "japan",
    title: "JIS T 8151:2018 防尘口罩标准",
    description: "日本工业标准关于防尘口罩的性能要求，规定了过滤效率、呼吸阻力等技术指标。",
    officialUrl: "https://www.jisc.go.jp/standard/detail/e/e201802217003.html",
    lastUpdated: "2023-09-10"
  },
  {
    id: 15,
    category: "masks",
    market: "china",
    title: "GB 19083-2010 医用防护口罩技术要求",
    description: "中国医用防护口罩国家标准，规定了医用防护口罩的技术要求、测试方法、标识与使用说明等内容。",
    officialUrl: "https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=080901B2010000013",
    lastUpdated: "2023-05-20"
  },
  {
    id: 16,
    category: "masks",
    market: "china",
    title: "GB 2626-2019 呼吸防护自吸过滤式防颗粒物呼吸器",
    description: "中国呼吸防护用品国家标准，规定了KN95、KN100等等级口罩的性能要求和测试方法。",
    officialUrl: "https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=080901B2019000061",
    lastUpdated: "2023-07-01"
  },
  {
    id: 17,
    category: "protective_clothing",
    market: "eu",
    title: "EN ISO 13688:2013 防护服通用要求",
    description: "欧盟防护服通用性能标准，规定了防护服的基本要求、标识、测试方法等内容。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:3427,62985319",
    lastUpdated: "2023-04-15"
  },
  {
    id: 18,
    category: "protective_clothing",
    market: "eu",
    title: "EN 14325:2004 化学防护服标准",
    description: "欧盟化学防护服性能标准，规定了防化学渗透、穿透的测试方法和性能要求，分为6个防护等级。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:2307,62985319",
    lastUpdated: "2023-03-10"
  },
  {
    id: 19,
    category: "protective_clothing",
    market: "us",
    title: "ASTM F1671 防血液传播病原体防护服标准",
    description: "美国材料与试验协会关于防护服防血液、体液穿透的测试方法和性能要求，适用于医用防护服。",
    officialUrl: "https://www.astm.org/standards/f1671.html",
    lastUpdated: "2024-02-05"
  },
  {
    id: 20,
    category: "protective_clothing",
    market: "us",
    title: "OSHA 29 CFR 1910.134 个人防护设备要求",
    description: "美国职业安全与健康管理局关于个人防护设备的使用要求，规定了雇主必须为员工提供的防护装备要求。",
    officialUrl: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.134",
    lastUpdated: "2023-08-20"
  },
  {
    id: 21,
    category: "protective_clothing",
    market: "middle_east",
    title: "GSO ISO 13688:2013 防护服通用要求",
    description: "海湾国家标准化组织发布的防护服通用标准，等效采用欧盟EN ISO 13688标准，是G-mark认证的依据。",
    officialUrl: "https://www.gso.org.sa/standards/standard-details?id=3456",
    lastUpdated: "2023-10-05"
  },
  {
    id: 22,
    category: "gloves",
    market: "eu",
    title: "EN 374 化学防护手套标准系列",
    description: "欧盟化学防护手套性能标准，分为EN 374-1到EN 374-5五个部分，规定了防化学渗透的性能要求和测试方法。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:2107,62985319",
    lastUpdated: "2023-12-10"
  },
  {
    id: 23,
    category: "gloves",
    market: "eu",
    title: "EN 420:2003+A1:2009 防护手套通用要求",
    description: "欧盟防护手套通用性能标准，规定了手套的尺寸、舒适性、标识等基本要求，适用于所有类型的防护手套。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:1867,62985319",
    lastUpdated: "2023-07-25"
  },
  {
    id: 24,
    category: "gloves",
    market: "us",
    title: "ASTM D3578 橡胶外科手套标准规范",
    description: "美国材料与试验协会关于橡胶外科手套的性能要求，包括拉伸强度、伸长率、无菌要求等指标。",
    officialUrl: "https://www.astm.org/d3578.html",
    lastUpdated: "2023-06-30"
  },
  {
    id: 25,
    category: "gloves",
    market: "us",
    title: "ASTM F2010 防化学品手套评估标准",
    description: "美国材料与试验协会关于防化学品手套的性能评估标准，规定了化学渗透测试的方法和分级要求。",
    officialUrl: "https://www.astm.org/f2010.html",
    lastUpdated: "2023-11-15"
  },
  {
    id: 26,
    category: "eye_protection",
    market: "eu",
    title: "EN 166:2001 个人眼面防护设备标准",
    description: "欧盟眼面防护设备通用标准，规定了防护眼镜、护目镜、面罩的性能要求和测试方法。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:1567,62985319",
    lastUpdated: "2023-04-20"
  },
  {
    id: 27,
    category: "eye_protection",
    market: "us",
    title: "ANSI Z87.1 职业和教育用个人眼面部防护标准",
    description: "美国国家标准学会关于职业和教育用个人眼面部防护设备的标准，规定了防护眼镜的性能要求和测试方法。",
    officialUrl: "https://www.ansi.org/standards_detail/standard/21367",
    lastUpdated: "2023-09-25"
  },
  {
    id: 28,
    category: "head_protection",
    market: "eu",
    title: "EN 397:2012+A1:2012 工业安全帽标准",
    description: "欧盟工业安全帽性能标准，规定了安全帽的冲击吸收、耐穿刺、耐高低温等性能要求和测试方法。",
    officialUrl: "https://standards.cen.eu/dyn/www/f?p=204:110:0::::FSP_PROJECT,FSP_ORG_ID:1267,62985319",
    lastUpdated: "2023-05-30"
  },
  {
    id: 29,
    category: "head_protection",
    market: "us",
    title: "ANSI Z89.1 工业头部防护标准",
    description: "美国国家标准学会关于工业安全帽的性能标准，规定了安全帽的类型、性能要求和测试方法。",
    officialUrl: "https://www.ansi.org/standards_detail/standard/21366",
    lastUpdated: "2023-08-10"
  },
  {
    id: 30,
    category: "head_protection",
    market: "australia",
    title: "AS/NZS 1801:2019 职业安全帽标准",
    description: "澳大利亚和新西兰联合发布的职业安全帽性能标准，规定了安全帽的冲击吸收、耐穿刺等性能要求。",
    officialUrl: "https://www.standards.org.au/standards-catalogue/sa/snz/1801/2019",
    lastUpdated: "2023-12-15"
  }
];

const categoryLabels = {
  all: "所有类别",
  masks: "口罩",
  protective_clothing: "防护服",
  gloves: "防护手套",
  eye_protection: "眼面防护",
  head_protection: "头部防护"
};

const marketLabels = {
  all: "所有市场",
  eu: "欧盟",
  us: "美国",
  uk: "英国",
  middle_east: "中东",
  china: "中国"
};

export default function KnowledgeBaseContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [loading, setLoading] = useState(false);

  // 过滤数据
  const filteredRegulations = regulations.filter(reg => {
    const matchesSearch = reg.title.toLowerCase().includes(searchTerm.toLowerCase()) || reg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reg.category === selectedCategory;
    const matchesMarket = selectedMarket === 'all' || reg.market === selectedMarket;
    return matchesSearch && matchesCategory && matchesMarket;
  });

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <img src="/logo.png" alt="MDLOOKER Logo" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">PPE法规知识库</h1>
          <p className="text-xl text-gray-600">
            全球PPE法规标准数据库，所有内容均来自官方权威来源，每月更新。
          </p>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="搜索法规名称、标准标题或内容..." 
                  className="pl-10 h-12 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // 触发搜索
                      setLoading(true);
                      setTimeout(() => setLoading(false), 300);
                    }
                  }}
                />
              </div>
              <Button 
                className="h-12 px-6 bg-[#339999] hover:bg-[#2d8a8a] text-white"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 300);
                }}
              >
                <Search className="h-5 w-5 mr-2" />
                搜索
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">产品类别</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择产品类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">目标市场</label>
                <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择目标市场" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(marketLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
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

        {/* 法规列表 */}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filteredRegulations.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>未找到匹配的法规，请调整搜索条件。</p>
              </div>
            ) : (
              filteredRegulations.map(reg => (
                <Card key={reg.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{reg.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className="inline-block px-2 py-1 bg-[#339999]/10 text-[#339999] rounded text-xs font-medium mr-2">
                            {categoryLabels[reg.category as keyof typeof categoryLabels]}
                          </span>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mr-2">
                            {marketLabels[reg.market as keyof typeof marketLabels]}
                          </span>
                          <span className="text-xs text-gray-500">最后更新：{reg.lastUpdated}</span>
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
                      查看官方原文 <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}