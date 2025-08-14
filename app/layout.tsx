import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PWAProvider from "@/components/PWAProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WP Blog',
  },
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
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'WP Blog',
    'apple-mobile-web-app-title': 'WP Blog',
    'theme-color': '#2563eb',
    'msapplication-TileColor': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WP Blog" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="WP Blog" />
      </head>
      <body className={`${dmSans.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors`}>
        <ThemeProvider>
          <PWAProvider />
          <Navigation />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
          <footer className="bg-gray-900 dark:bg-gray-950 text-white">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">WordPress + Next.js</h3>
                  <p className="text-gray-300 dark:text-gray-400 text-sm">
                    A comprehensive headless WordPress blog implementation using Next.js 14+ 
                    with TypeScript and full WordPress REST API integration.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">API Features</h3>
                  <ul className="text-gray-300 dark:text-gray-400 text-sm space-y-2">
                    <li>• Posts, Pages, Media</li>
                    <li>• Categories, Tags, Users</li>
                    <li>• Comments, Search</li>
                    <li>• Batch Operations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
                  <ul className="text-gray-300 dark:text-gray-400 text-sm space-y-2">
                    <li>• Next.js 14+ App Router</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• WordPress REST API</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                <p>&copy; 2024 WordPress + Next.js Blog. Comprehensive REST API Implementation.</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
