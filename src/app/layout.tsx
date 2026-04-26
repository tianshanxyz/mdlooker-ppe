import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    default: "MDLOOKER | 全球PPE医疗器械合规平台",
    template: "%s | MDLOOKER"
  },
  description: "MDLOOKER为口罩及个人防护装备（PPE）提供全球注册信息、认证查询、合规标准查询服务，帮助企业快速掌握各国PPE准入要求，降低合规风险。",
  keywords: ["PPE合规", "口罩注册", "医疗器械认证", "合规查询", "CE认证", "FDA注册", "PPE准入标准", "医疗器械合规", "防护装备认证", "全球合规数据库"],
  authors: [{ name: "MDLOOKER Team" }],
  creator: "MDLOOKER",
  publisher: "MDLOOKER",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://www.mdlooker.com",
    siteName: "MDLOOKER",
    title: "MDLOOKER | 全球PPE医疗器械合规平台",
    description: "MDLOOKER为口罩及个人防护装备（PPE）提供全球注册信息、认证查询、合规标准查询服务，帮助企业快速掌握各国PPE准入要求，降低合规风险。",
    images: [
      {
        url: "https://www.mdlooker.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MDLOOKER Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MDLOOKER | 全球PPE医疗器械合规平台",
    description: "MDLOOKER为口罩及个人防护装备（PPE）提供全球注册信息、认证查询、合规标准查询服务，帮助企业快速掌握各国PPE准入要求，降低合规风险。",
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
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
