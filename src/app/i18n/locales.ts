// src/app/i18n/locales.ts
export const locales = ['ru', 'en'] as const;
export const defaultLocale = 'ru';

export type Locale = (typeof locales)[number];