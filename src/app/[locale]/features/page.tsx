// FILE: src/app/[locale]/features/page.tsx
'use client'; // <-- Добавляем 'use client' для использования хуков

import { PageHeader } from "@/components/page-header";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/client"; // <-- Импортируем хук

const FeatureDetail = ({ title, children, imageUrl, reverse = false }: { title: string, children: React.ReactNode, imageUrl: string, reverse?: boolean }) => (
  <div className={`grid items-center gap-12 md:grid-cols-2 ${reverse ? "md:grid-flow-row-dense" : ""}`}>
    <div className={`space-y-4 ${reverse ? "md:col-start-2" : ""}`}>
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
    <div className="flex items-center justify-center">
      <div className="w-full h-80 rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground/50">{imageUrl}</p>
      </div>
    </div>
  </div>
);

export default function FeaturesPage() {
  // ИСПОЛЬЗУЕМ ХУК ДЛЯ ПОЛУЧЕНИЯ ПЕРЕВОДОВ
  const { t } = useTranslation('features');

  return (
    <div className="container py-12 md:py-20">
      <PageHeader
        title={t('title')}
        description={t('description')}
      />
      <div className="mt-16 space-y-24">
        <FeatureDetail title={t('scanner_title')} imageUrl="Изображение сканера">
          <p>{t('scanner_p')}</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('scanner_li_1')}</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('scanner_li_2')}</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('scanner_li_3')}</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail title={t('taste_title')} imageUrl="Изображение радара вкуса" reverse>
          <p>{t('taste_p')}</p>
           <ul className="mt-4 space-y-2">
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('taste_li_1')}</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('taste_li_2')}</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('taste_li_3')}</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail title={t('map_title')} imageUrl="Изображение карты и календаря">
          <p>{t('map_p')}</p>
           <ul className="mt-4 space-y-2">
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('map_li_1')}</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('map_li_2')}</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('map_li_3')}</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail title={t('social_title')} imageUrl="Изображение ленты и профиля" reverse>
          <p>{t('social_p')}</p>
           <ul className="mt-4 space-y-2">
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('social_li_1')}</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('social_li_2')}</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />{t('social_li_3')}</li>
          </ul>
        </FeatureDetail>
      </div>
    </div>
  );
}