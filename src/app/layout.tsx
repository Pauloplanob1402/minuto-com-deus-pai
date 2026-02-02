import { Inter } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
