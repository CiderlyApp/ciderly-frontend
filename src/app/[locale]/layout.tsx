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

// ✨ ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ✨
export default async function RootLayout({ // 1. Добавляем `async`
  children,
  params, // 2. Принимаем `params` как единый объект
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string }; // Тип остается прежним
}>) {
  const { locale } = await params; // 3. Получаем `locale` через `await`

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