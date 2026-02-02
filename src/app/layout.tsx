import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Minuto com Deus Pai",
  description: "Uma mensagem de paz e paternidade divina todos os dias.",
  manifest: '/manifest.json',
  themeColor: '#FFFDFB',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <Script id="service-worker-registration" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                  console.log('SW registered: ', registration);
                }).catch(registrationError => {
                  console.log('SW registration failed: ', registrationError);
                });
              });
            }
          `}
        </Script>
        <Script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async strategy="lazyOnload" />
        <Script id="onesignal-init" strategy="lazyOnload">
          {`
            window.OneSignal = window.OneSignal || [];
            OneSignal.push(function() {
              OneSignal.init({
                appId: "942880a3-350b-454f-8d96-72f6763ae4ac",
              });
            });
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
