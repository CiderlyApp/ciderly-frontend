// FILE: src/app/[locale]/layout.tsx (Финальная, правильная версия)

import type { Metadata } from "next";
import { Inter, Roboto_Mono as RobotoMono } from "next/font/google";
//import "./globals.css";

// Импорты для UI и провайдеров
import { Providers } from "@/components/providers";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WavySeparator } from "@/components/visuals/wavy-separator";

// Импорты для i18n
import { locales } from "@/app/i18n/locales";
import I18nProviderClient from "@/app/i18n/client";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const robotoMono = RobotoMono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ciderly - Ваш гид в мире сидра",
  description: "Открывайте, оценивайте и делитесь лучшими сидрами. Платформа для энтузиастов и производителей.",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  // Указываем, что `params` - это промис, который разрешается в объект с `locale`
  params: Promise<{ locale: string }>; 
}>) {
  // Теперь код соответствует типам: мы ожидаем промис и `await`-им его
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <I18nProviderClient locale={locale}>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <WavySeparator />
              <Footer />
            </div>
            <SonnerToaster />
          </Providers>
        </I18nProviderClient>
      </body>
    </html>
  );
}