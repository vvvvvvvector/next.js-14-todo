import type { Viewport, Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '~/components/ui/sonner';

import { cn } from '~/lib/utils';

import '~/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProps = {
  children: React.ReactNode;
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false
};

export const metadata: Metadata = {
  title: 'Next.js 14 ToDo',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <head />
      <body className={cn('min-h-screen', `${inter.className}`)}>
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
