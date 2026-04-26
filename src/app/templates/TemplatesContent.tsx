'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Globe, FileCheck, FileIcon } from "lucide-react";
import { createClient } from "@/app/lib/supabase";

// 静态模板数据
const templates = [
  {
    id: 1,
    category: "DoC声明",
    market: "eu",
    title: "EU PPE DoC符合性声明模板",
    description: "符合欧盟2016/425法规要求的符合性声明模板，可直接编辑填写产品信息，无需调整格式。",
    format: "Word",
    size: "24KB",
    downloadUrl: "#"
  },
  {
    id: 2,
    category: "DoC声明",
    market: "us",
    title: "美国FDA DoC符合性声明模板",
    description: "符合美国FDA要求的医疗器械/PPE产品符合性声明模板，包含所有必填字段。",
    format: "Word",
    size: "22KB",
    downloadUrl: "#"
  },
  {
    id: 3,
    category: "DoC声明",
    market: "uk",
    title: "UKCA DoC符合性声明模板",
    description: "符合英国UKCA认证要求的符合性声明模板，满足英国市场准入要求。",
    format: "Word",
    size: "21KB",
    downloadUrl: "#"
  },
  {
    id: 4,
    category: "标签模板",
    market: "通用",
    title: "PPE产品包装标签模板",
    description: "包含CE/UKCA/FDA标识、产品信息、生产信息的通用标签模板，支持自定义调整。",
    format: "AI + Word",
    size: "1.2MB",
    downloadUrl: "#"
  },
  {
    id: 5,
    category: "标签模板",
    market: "eu",
    title: "欧盟CE产品说明书模板",
    description: "符合欧盟PPE法规要求的产品说明书模板，包含所有必要信息项和合规标识。",
    format: "Word",
    size: "36KB",
    downloadUrl: "#"
  },
  {
    id: 6,
    category: "技术文档",
    market: "通用",
    title: "PPE产品技术文件全套模板",
    description: "包含风险评估报告、测试报告清单、合格评定流程等全套技术文档模板，公告机构认可。",
    format: "Word 压缩包",
    size: "2.3MB",
    downloadUrl: "#"
  },
  {
    id: 7,
    category: "技术文档",
    market: "us",
    title: "FDA 510(k)申请文件模板",
    description: "美国FDA 510(k)认证申请全套文件模板，包含所有要求的章节和格式，提高申请通过率。",
    format: "Word 压缩包",
    size: "3.7MB",
    downloadUrl: "#"
  },
  {
    id: 8,
    category: "报关文件",
    market: "通用",
    title: "PPE产品出口报关单模板",
    description: "海关报关单、商业发票、装箱单全套模板，符合各国海关申报要求，减少清关问题。",
    format: "Excel + Word",
    size: "128KB",
    downloadUrl: "#"
  },
  {
    id: 9,
    category: "报关文件",
    market: "eu",
    title: "欧盟CE认证清关资料模板",
    description: "欧盟进口清关所需的全套资料模板，包括DoC、测试报告清单等，提高清关效率。",
    format: "Word 压缩包",
    size: "420KB",
    downloadUrl: "#"
  },
  {
    id: 10,
    category: "其他模板",
    market: "通用",
    title: "供应商合规审核检查表模板",
    description: "工厂审核、供应商合规性评估的检查清单模板，可直接使用，覆盖所有合规要点。",
    format: "Excel",
    size: "32KB",
    downloadUrl: "#"
  },
  {
    id: 11,
    category: "其他模板",
    market: "通用",
    title: "产品合规风险评估表模板",
    description: "PPE产品合规风险评估工具，帮助识别和降低合规风险，符合公告机构审核要求。",
    format: "Excel",
    size: "47KB",
    downloadUrl: "#"
  },
  {
    id: 12,
    category: "其他模板",
    market: "通用",
    title: "认证申请进度跟踪表模板",
    description: "跟踪多个认证项目进度、费用、节点的管理模板，提高项目管理效率。",
    format: "Excel",
    size: "28KB",
    downloadUrl: "#"
  }
];

const categoryLabels = {
  all: "所有类别",
  "DoC声明": "DoC声明",
  "标签模板": "标签模板",
  "技术文档": "技术文档",
  "报关文件": "报关文件",
  "其他模板": "其他模板"
};

const marketLabels = {
  all: "所有市场",
  eu: "欧盟",
  us: "美国",
  uk: "英国",
  middle_east: "中东",
  通用: "通用"
};

export default function TemplatesContent() {
  const supabase = createClient();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesMarket = selectedMarket === 'all' || template.market === selectedMarket;
    return matchesCategory && matchesMarket;
  });

  const handleDownload = async (url: string, title: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('请先登录账号后下载模板');
      router.push('/auth');
      return;
    }
    // 后续对接真实下载地址，现在先跳转示例文件
    alert(`《${title}》下载功能已开通，登录后即可下载，正式文件地址正在配置中，如需获取请联系客服 support@mdlooker.com`);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <img src="/logo.png" alt="MDLOOKER Logo" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">合规文档模板库</h1>
          <p className="text-xl text-gray-600">
            经过专业律师和认证机构审核的合规文档模板，直接编辑即可使用，节省90%文档准备时间。
          </p>
        </div>

        {/* 筛选区域 */}
        <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">模板类别</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模板类别" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">适用市场</label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger>
                  <SelectValue placeholder="选择适用市场" />
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

        {/* 模板列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <FileIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>未找到匹配的模板，请调整搜索条件。</p>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-lg bg-[#339999]/10 flex items-center justify-center">
                      <FileIcon className="h-5 w-5 text-[#339999]" />
                    </div>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {template.format} · {template.size}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 mt-3">{template.title}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="inline-block px-2 py-0.5 bg-[#339999]/10 text-[#339999] rounded text-xs font-medium mr-2">
                      {template.category}
                    </span>
                    {template.market !== "通用" && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        <Globe className="h-3 w-3 mr-1" /> {marketLabels[template.market as keyof typeof marketLabels]}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-4 text-sm h-12">{template.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white"
                    onClick={() => handleDownload(template.downloadUrl, template.title)}
                  >
                    <Download className="mr-2 h-4 w-4" /> 下载模板
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* 底部提示 */}
        <div className="max-w-3xl mx-auto mt-16 bg-[#339999]/5 p-6 rounded-xl border border-[#339999]/20">
          <div className="flex items-start gap-4">
            <FileCheck className="h-8 w-8 text-[#339999] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">需要定制模板？</h3>
              <p className="text-gray-600 mb-4">
                如果您需要定制特定产品、特定市场的合规文档模板，或者需要专业律师审核您的现有文档，我们提供付费定制服务。
              </p>
              <a href="mailto:support@mdlooker.com">
                <Button variant="secondary">联系我们定制</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}