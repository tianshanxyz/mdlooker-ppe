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
    default: "MDLOOKER | Global PPE Medical Device Compliance Platform",
    template: "%s | MDLOOKER"
  },
  description: "MDLOOKER provides global registration information, certification inquiry, compliance standard inquiry services for masks and personal protective equipment (PPE), helping enterprises quickly grasp the PPE access requirements of various countries and reduce compliance risks.",
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
    locale: "en_US",
    url: "https://www.mdlooker.com",
    siteName: "MDLOOKER",
    title: "MDLOOKER | Global PPE Medical Device Compliance Platform",
    description: "Provides global PPE medical device registration information, certification inquiry, compliance standard inquiry services, helping enterprises comply with regulations when going global.",
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
    title: "MDLOOKER | Global PPE Medical Device Compliance Platform",
    description: "Provides global PPE medical device registration information, certification inquiry, compliance standard inquiry services, helping enterprises comply with regulations when going global.",
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
