import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'WordPress + Next.js Blog',
    template: '%s | WordPress + Next.js Blog',
  },
  description: 'A comprehensive headless WordPress blog built with Next.js 14+ and TypeScript, featuring complete WordPress REST API integration',
  keywords: ['WordPress', 'Next.js', 'TypeScript', 'Headless CMS', 'REST API', 'Blog', 'React'],
  authors: [{ name: 'WordPress + Next.js' }],
  creator: 'WordPress + Next.js',
  publisher: 'WordPress + Next.js',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'WordPress + Next.js Blog',
    title: 'WordPress + Next.js Blog',
    description: 'A comprehensive headless WordPress blog with complete REST API integration',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordPress + Next.js Blog',
    description: 'A comprehensive headless WordPress blog with complete REST API integration',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">WordPress + Next.js</h3>
                <p className="text-gray-300 text-sm">
                  A comprehensive headless WordPress blog implementation using Next.js 14+ 
                  with TypeScript and full WordPress REST API integration.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">API Features</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Posts, Pages, Media</li>
                  <li>• Categories, Tags, Users</li>
                  <li>• Comments, Search</li>
                  <li>• Batch Operations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Next.js 14+ App Router</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• WordPress REST API</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2024 WordPress + Next.js Blog. Comprehensive REST API Implementation.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
