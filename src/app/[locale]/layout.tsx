import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const titles = {
    zh: "MDLOOKER | 全球PPE医疗器械合规平台",
    en: "MDLOOKER | Global PPE Medical Device Compliance Platform"
  };
  const descriptions = {
    zh: "MDLOOKER为口罩及个人防护装备（PPE）提供全球注册信息、认证查询、合规标准查询服务，帮助企业快速掌握各国PPE准入要求，降低合规风险。",
    en: "MDLOOKER provides global registration information, certification inquiry, compliance standard inquiry services for masks and personal protective equipment (PPE), helping enterprises quickly grasp the PPE access requirements of various countries and reduce compliance risks."
  };

  return {
    title: {
      default: titles[locale as keyof typeof titles],
      template: "%s | MDLOOKER"
    },
    description: descriptions[locale as keyof typeof descriptions],
    keywords: ["PPE compliance", "mask registration", "medical device certification", "compliance query", "CE certification", "FDA registration", "PPE access standards", "medical device compliance", "protective equipment certification", "global compliance database"],
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
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: "https://www.mdlooker.com",
      siteName: "MDLOOKER",
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
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
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
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
}

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
