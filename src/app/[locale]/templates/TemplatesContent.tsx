'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Globe, FileCheck, FileIcon, Loader2, AlertCircle } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export default function TemplatesContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 从Supabase加载模板数据
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // 转换字段名匹配之前的格式
        const formattedData = data.map(item => ({
          id: item.id,
          category: item.category,
          market: item.market,
          title: item.title,
          description: item.description,
          format: item.format,
          size: item.size,
          downloadUrl: item.download_url
        }));
        
        setTemplates(formattedData);
      } catch (err) {
        console.error('加载模板数据失败:', err);
        setError('数据加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesMarket = selectedMarket === 'all' || template.market === selectedMarket;
    return matchesCategory && matchesMarket;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <img src="/logo.png" alt="H-Guardian Logo" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">合规文档模板库</h1>
          <p className="text-xl text-gray-600">
            经过专业律师和认证机构审核的合规文档模板，直接编辑即可使用，节省大量时间。
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
                  <SelectItem value="all">全部类别</SelectItem>
                  <SelectItem value="DoC声明">DoC声明</SelectItem>
                  <SelectItem value="标签模板">标签模板</SelectItem>
                  <SelectItem value="技术文档">技术文档</SelectItem>
                  <SelectItem value="报关文件">报关文件</SelectItem>
                  <SelectItem value="其他模板">其他模板</SelectItem>
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
                  <SelectItem value="all">全部市场</SelectItem>
                  <SelectItem value="欧盟">欧盟（EU）</SelectItem>
                  <SelectItem value="美国">美国（USA）</SelectItem>
                  <SelectItem value="英国">英国（UK）</SelectItem>
                  <SelectItem value="中东">中东（GCC）</SelectItem>
                  <SelectItem value="通用">通用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-16 text-gray-500 max-w-6xl mx-auto">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-[#339999] animate-spin" />
            <p>正在加载模板数据，请稍候...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && !loading && (
          <div className="text-center py-16 text-red-500 max-w-6xl mx-auto">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* 模板列表 */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredTemplates.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <FileIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No matching templates found, please adjust your search criteria.</p>
              </div>
            ) : (
              filteredTemplates.map(template => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
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
                          <Globe className="h-3 w-3 mr-1" /> {template.market}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm h-12">{template.description}</p>
                    <a href={template.downloadUrl} className="block w-full">
                      <Button className="w-full bg-[#339999] hover:bg-[#2d8a8a] text-white">
                        <Download className="mr-2 h-4 w-4" /> 下载模板
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

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
