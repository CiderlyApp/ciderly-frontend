import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

// 1. Импортируем список языков и язык по умолчанию из одного источника
import { locales, defaultLocale } from './app/i18n/locales';

// 2. Функция для получения предпочитаемой локали из заголовка Accept-Language
function getLocale(request: NextRequest): string {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();

  try {
    // Используем импортированные переменные
    return match(languages, locales, defaultLocale);
  } catch {
    // В случае ошибки возвращаем локаль по умолчанию
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 3. Проверяем, есть ли уже префикс локали (/ru, /en) в пути
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return; // Если префикс есть, ничего не делаем
  }

  // 4. Если префикса нет, определяем лучшую локаль и делаем редирект
  const locale = getLocale(request);
  
  // Создаем новый URL для редиректа
  const newUrl = new URL(`/${locale}${pathname}`, request.url);

  // Например, если зашли на /features, а язык браузера 'en',
  // будет редирект на /en/features
  return NextResponse.redirect(newUrl);
}

// 5. Конфигурация для middleware: указываем, на каких путях он должен работать
export const config = {
  matcher: [
    // Пропускаем все внутренние пути (_next) и пути к файлам ресурсов
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|locales|.*\\..*).*)',
  ],
};