import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileText, Calculator, Globe, Check } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MDLOOKER | Global PPE Medical Device Compliance Platform",
  description: "MDLOOKER provides global PPE product registration information, certification query, compliance standard query services, supporting CE, FDA, UKCA and other multi-national certification queries, helping enterprises comply with regulations when going global.",
  keywords: ["PPE compliance query", "mask certification query", "CE certification query", "FDA registration query", "medical device compliance", "PPE export compliance"],
  alternates: {
    canonical: "https://www.mdlooker.com",
  },
};

export default function Home() {
  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MDLOOKER",
              "url": "https://www.mdlooker.com",
              "description": "Global PPE medical device compliance query platform, providing multi-national certification query, compliance standard query services.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.mdlooker.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MDLOOKER",
              "url": "https://www.mdlooker.com",
              "logo": "https://www.mdlooker.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@mdlooker.com",
                "telephone": "+86 138 0000 0000",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://twitter.com/mdlooker",
                "https://www.linkedin.com/company/mdlooker"
              ]
            }
          ])
        }}
      />
      <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MDLOOKER Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-gray-900">MDLOOKER</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/search" className="text-gray-600 hover:text-[#339999] font-medium">Data Search</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-[#339999] font-medium">Industry Dashboard</Link>
            <Link href="/warning" className="text-gray-600 hover:text-[#339999] font-medium">Alert Center</Link>
            <Link href="/compliance-package" className="text-gray-600 hover:text-[#339999] font-medium">Compliance Package</Link>
            <Link href="/company-score" className="text-gray-600 hover:text-[#339999] font-medium">Company Rating</Link>
            <Link href="/compliance-check" className="text-gray-600 hover:text-[#339999] font-medium">Compliance Check</Link>
            <Link href="/knowledge-base" className="text-gray-600 hover:text-[#339999] font-medium">Knowledge Base</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-[#339999] font-medium">Pricing</Link>
            <Link href="/templates" className="text-gray-600 hover:text-[#339999] font-medium">Templates</Link>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Sign In</Button>
            <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-[#339999]/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simplify PPE Compliance for Global Markets
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get instant compliance reports, regulatory updates, and document templates for PPE products entering EU, US, UK, and Middle East markets. Save months of certification time and avoid costly compliance mistakes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/compliance-check">
                <Button className="bg-[#339999] hover:bg-[#2d8a8a] text-white text-lg px-8 py-6 h-auto">
                  Free Compliance Check
                </Button>
              </Link>
              <Button variant="secondary" className="text-lg px-8 py-6 h-auto">
                View Pricing
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-[#339999]" />
                <span>CE, FDA, UKCA Certification Guides</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-[#339999]" />
                <span>10,000+ Compliance Professionals Trust Us</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-[#339999]" />
                <span>99% Accuracy Rate on Compliance Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need for PPE Compliance</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">End-to-end compliance solutions tailored for PPE manufacturers, exporters, and importers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#339999]/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-[#339999]" />
                </div>
                <CardTitle>Compliance Checker</CardTitle>
                <CardDescription>Instantly get required certifications for your product</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Select your PPE product category and target market, get a complete list of required certifications, estimated costs, and processing time in 30 seconds.
              </CardContent>
              <CardFooter>
                <Link href="/compliance-check" className="text-[#339999] font-medium hover:underline">
                  Try it Free →
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#339999]/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-[#339999]" />
                </div>
                <CardTitle>Document Templates</CardTitle>
                <CardDescription>Ready-to-use compliance document templates</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Download professionally drafted DoC (Declaration of Conformity), technical file, label, and customs declaration templates aligned with latest regulations.
              </CardContent>
              <CardFooter>
                <Link href="/templates" className="text-[#339999] font-medium hover:underline">
                  Browse Templates →
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#339999]/10 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-[#339999]" />
                </div>
                <CardTitle>Cost Calculator</CardTitle>
                <CardDescription>Accurately calculate your total compliance cost</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Input your product details, quantity, and target markets to get an accurate breakdown of all certification, testing, and consulting costs with no hidden fees.
              </CardContent>
              <CardFooter>
                <Link href="/calculator" className="text-[#339999] font-medium hover:underline">
                  Calculate Now →
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#339999]/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-[#339999]" />
                </div>
                <CardTitle>Regulatory Knowledge Base</CardTitle>
                <CardDescription>Up-to-date global PPE regulation database</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Access the latest EU 2016/425, FDA, UKCA, and GCC PPE regulations, updated monthly with official sources cited for full traceability.
              </CardContent>
              <CardFooter>
                <Link href="/knowledge-base" className="text-[#339999] font-medium hover:underline">
                  Explore Database →
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#339999]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[#339999] rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your PPE Compliance?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Start with a free compliance check for your product, or upgrade to Pro for unlimited access to all tools and templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/compliance-check">
                <Button className="bg-white text-[#339999] hover:bg-gray-100 text-lg px-8 py-6 h-auto">
                  Free Compliance Check
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" className="bg-[#339999]/20 text-white border-white hover:bg-[#339999]/30 text-lg px-8 py-6 h-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="MDLOOKER Logo" className="h-6 w-6" />
                <span className="font-bold text-xl">MDLOOKER</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for PPE compliance solutions, helping businesses navigate global regulatory requirements efficiently.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/search" className="hover:text-[#339999]">Data Search</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#339999]">Industry Dashboard</Link></li>
                <li><Link href="/compliance-check" className="hover:text-[#339999]">Compliance Check</Link></li>
                <li><Link href="/templates" className="hover:text-[#339999]">Document Templates</Link></li>
                <li><Link href="/calculator" className="hover:text-[#339999]">Cost Calculator</Link></li>
                <li><Link href="/knowledge-base" className="hover:text-[#339999]">Knowledge Base</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-[#339999]">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#339999]">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-[#339999]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#339999]">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@mdlooker.com</li>
                <li>Phone: +86 138 0000 0000</li>
                <li>Address: Nanjing, Jiangsu, China</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2026 MDLOOKER. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
