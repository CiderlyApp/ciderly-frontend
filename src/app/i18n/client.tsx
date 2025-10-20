'use client';

import i18next from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { defaultLocale, locales } from './locales';

interface I18nProviderClientProps {
  children: React.ReactNode;
  locale: string;
}

// ✨ Создаем функцию для инициализации, чтобы не делать это глобально ✨
const createI18nextClient = (locale: string) => {
  const i18n = i18next.createInstance(); // Создаем новый экземпляр
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.json`)
    ))
    .init({
      supportedLngs: locales,
      fallbackLng: defaultLocale,
      // ✨ Важнейшее изменение: Устанавливаем язык СРАЗУ из пропсов ✨
      lng: locale, 
      detection: {
        order: ['path', 'cookie'], // Убираем navigator, чтобы избежать конфликтов
      },
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      defaultNS: 'common',
      ns: ['common', 'privacy'], 

      // Отключаем отладку в продакшене
      debug: process.env.NODE_ENV === 'development',
    });
  return i18n;
};

export default function I18nProviderClient({ children, locale }: I18nProviderClientProps) {
  // ✨ Создаем экземпляр i18next с правильной локалью ✨
  const i18n = createI18nextClient(locale);

  // ✨ Убираем useEffect, так как инициализация теперь синхронна ✨

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

// ✨ Экспортируем хук useTranslation из этого файла для удобства ✨
// Это гарантирует, что все клиентские компоненты используют один и тот же настроенный экземпляр
export { useTranslation };