import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Minuto com Deus Pai",
  description: "Uma mensagem de paz e paternidade divina todos os dias.",
  manifest: '/manifest.json',
  themeColor: '#FFFDFB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        {children}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignal = window.OneSignal || [];
              OneSignal.push(function() {
                OneSignal.init({
                  appId: "942880a3-350b-454f-8d96-72f6763ae4ac",
                });
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
