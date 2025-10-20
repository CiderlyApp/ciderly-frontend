'use client'; //  Переводим в клиентский компонент для использования хука

import { PageHeader } from "@/components/page-header";
import { useTranslation } from "react-i18next"; //  Импортируем хук

export default function PrivacyPage() {
  const { t } = useTranslation('privacy'); //  Используем неймспейс 'privacy'

  return (
    <div className="container py-12 md:py-20">
      <PageHeader
        title={t('title')}
        description={t('last_updated')}
      />
      <article className="prose prose-stone dark:prose-invert max-w-4xl mt-12 mx-auto">
        <h3>{t('intro_title')}</h3>
        <p>{t('intro_text')}</p>

        {/* 
          Здесь вы можете продолжить добавлять ключи и переводы 
          для остальных секций вашей Политики конфиденциальности.
          Например: <h3>{t('data_collection_title')}</h3>
                    <p>{t('data_collection_text')}</p>
        */}
      </article>
    </div>
  );
}