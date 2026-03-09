import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';
import { InstallPrompt } from '@/components/layout/InstallPrompt';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Interview Trainer',
  description: 'Prepare for fullstack JavaScript/TypeScript technical interviews with flashcards, quizzes, and coding challenges.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Interview Trainer',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Interview Trainer',
    description: 'Fullstack JS/TS interview prep — offline PWA',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        <main className="min-h-screen pb-16">
          {children}
        </main>
        <BottomNav />
        <InstallPrompt />
      </body>
    </html>
  );
}
