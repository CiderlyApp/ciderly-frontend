// FILE: src/components/layout/footer.tsx
'use client'; //  Добавляем 'use client' т.к. используем хук

import Link from "next/link";
import { Wine } from "lucide-react";
import { useTranslation } from "@/app/i18n/client";


export function Footer() {
  const { t } = useTranslation('common'); //  Получаем функцию перевода

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 py-12 text-sm">
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold">{t('footer_nav')}</h4>
          <Link href="/features" className="text-muted-foreground hover:text-foreground">{t('nav_features')}</Link>
          <Link href="/contacts" className="text-muted-foreground hover:text-foreground">{t('nav_contacts')}</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-semibold">{t('footer_business')}</h4>
          <Link href="/for-business" className="text-muted-foreground hover:text-foreground">{t('nav_for_business')}</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-semibold">{t('footer_legal')}</h4>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">{t('footer_privacy')}</Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">{t('footer_terms')}</Link>
        </div>

        <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <Wine className="h-6 w-6 text-primary" />
            <h4 className="font-semibold text-lg">{t('ciderly')}</h4>
          </div>
          <p className="text-muted-foreground">{t('footer_about')}</p>
          <span className="text-muted-foreground">&copy; {t('ciderly')} {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}