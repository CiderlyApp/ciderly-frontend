'use client';

import { useTranslation } from "@/app/i18n/client";
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (lang: string) => {
    // Next.js i18n-роутинг автоматически изменит URL (/en/page -> /ru/page)
    // а i18next-browser-languagedetector подхватит изменение и сменит язык
    const newPath = pathname.replace(`/${i18n.language}`, `/${lang}`);
    router.replace(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('ru')} disabled={i18n.language === 'ru'}>
          Русский
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}