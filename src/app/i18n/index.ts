// src/app/i18n/index.ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { defaultLocale, locales } from './locales';

const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.json`)
    ))
    .init({
      supportedLngs: locales,
      fallbackLng: defaultLocale,
      lng,
      ns,
defaultNS: 'common',    });
  return i18nInstance;
};

export async function getTranslation(lng: string, ns: string | string[] = 'common') {
  const i18nInstance = await initI18next(lng, ns);
  return {
    t: i18nInstance.getFixedT(lng, ns),
    i18n: i18nInstance,
  };
}