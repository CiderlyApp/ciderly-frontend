// FILE: src/components/layout/header.tsx
'use client';

import Link from "next/link";
import { LogIn, Wine } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/login-form";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useTranslation } from "@/app/i18n/client"; 
import { LanguageSwitcher } from "../language-switcher";

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation('common');

  const navigationItems = [
    { href: "/features", label: t('nav_features') },
    { href: "/for-business", label: t('nav_for_business') },
    { href: "/contacts", label: t('nav_contacts') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Wine className="h-6 w-6 text-primary" />
          <span className="font-bold">{t('ciderly')}</span>
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname.startsWith(item.href) ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                {t('login')}
              </Button>
            </DialogTrigger>
            {/* ИСПРАВЛЕНО: Добавлен DialogHeader с заголовком и описанием для доступности (accessibility). */}
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Вход в аккаунт</DialogTitle>
                <DialogDescription>
                  Введите ваш email и пароль для доступа к панели управления.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <LoginForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}