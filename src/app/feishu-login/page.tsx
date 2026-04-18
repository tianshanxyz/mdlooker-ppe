"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const FEISHU_APP_ID = "cli_a969b7b56b78dbc3";
const REDIRECT_URI = encodeURIComponent(window.location.origin + "/api/feishu/callback");

export default function FeishuLoginPage() {
  const [loginUrl, setLoginUrl] = useState("");
  const [status, setStatus] = useState<"init" | "loading" | "success" | "error">("init");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 生成飞书官方扫码登录链接
    const state = Math.random().toString(36).substring(2, 15);
    const url = `https://open.feishu.cn/open-apis/authen/v1/index?app_id=${FEISHU_APP_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;
    setLoginUrl(url);
  }, []);

  const handleScanComplete = () => {
    setStatus("loading");
    setMessage("正在验证登录信息，请稍候...");
    setTimeout(() => {
      setStatus("success");
      setMessage("登录成功！正在跳转到首页...");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="H-Guardian Logo" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">飞书账号登录</CardTitle>
          <CardDescription>使用飞书APP扫码登录Milly助手平台</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "init" && loginUrl && (
            <div className="text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg inline-block">
                <QrCode className="h-48 w-48 text-[#339999]" />
              </div>
              <p className="text-sm text-gray-600">
                请打开飞书APP，扫描上方二维码完成登录
              </p>
              <div className="pt-4">
                <Button 
                  className="bg-[#339999] hover:bg-[#2d8a8a] text-white w-full"
                  onClick={handleScanComplete}
                >
                  我已扫码完成登录
                </Button>
              </div>
              <div className="pt-2">
                <a 
                  href={loginUrl} 
                  target="_blank" 
                  className="text-sm text-[#339999] hover:underline"
                  rel="noreferrer"
                >
                  如果二维码无法显示，请点击这里跳转飞书官方登录页面
                </a>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 text-[#339999] animate-spin mx-auto" />
              <p className="text-gray-700 font-medium">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-gray-700 font-medium">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-gray-700 font-medium">{message}</p>
              <Button 
                className="bg-[#339999] hover:bg-[#2d8a8a] text-white mt-2"
                onClick={() => window.location.reload()}
              >
                重新登录
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 text-center text-sm text-gray-500">
          登录成功后即可访问所有飞书文档和平台功能
        </CardFooter>
      </Card>
    </div>
  );
}
