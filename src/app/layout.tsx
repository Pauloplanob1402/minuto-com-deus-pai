import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'Minuto com Deus Pai',
  description: 'Uma mensagem diária para inspirar seu dia.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Minuto com Deus Pai',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#A0CFEC',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
