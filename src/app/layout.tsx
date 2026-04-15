import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MDLooker | 全球PPE医疗器械合规查询平台",
    template: "%s | MDLooker"
  },
  description: "MDLooker提供全球范围内口罩、个人防护设备（PPE）的注册信息、认证查询、合规标准查询服务，帮助企业快速掌握各国PPE准入要求，降低合规风险。",
  keywords: ["PPE合规", "口罩注册", "医疗器械认证", "合规查询", "CE认证", "FDA注册", "PPE准入标准", "医疗器械合规", "防护设备认证", "全球合规数据库"],
  authors: [{ name: "MDLooker Team" }],
  creator: "MDLooker",
  publisher: "MDLooker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mdlooker.com",
    siteName: "MDLooker",
    title: "MDLooker | 全球PPE医疗器械合规查询平台",
    description: "提供全球PPE医疗器械注册信息、认证查询、合规标准查询服务，助力企业合规出海。",
    images: [
      {
        url: "https://www.mdlooker.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MDLooker Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MDLooker | 全球PPE医疗器械合规查询平台",
    description: "提供全球PPE医疗器械注册信息、认证查询、合规标准查询服务，助力企业合规出海。",
    images: ["https://www.mdlooker.com/og-image.jpg"],
    creator: "@mdlooker",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // 后续替换为实际验证代码
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
