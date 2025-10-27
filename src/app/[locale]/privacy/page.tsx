'use client';

import { PageHeader } from "@/components/page-header";
import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation('privacy');

  return (
    <div className="container py-12 md:py-20">
      <PageHeader
        title={t('title')}
        description={t('last_updated')}
      />
      <article className="prose prose-stone dark:prose-invert max-w-4xl mt-12 mx-auto">
        {/* Раздел 1: Введение */}
        <h3>{t('intro_title')}</h3>
        <p>{t('intro_text')}</p>

        {/* Раздел 2: Какие данные мы собираем */}
        <h3>{t('section2_title')}</h3>
        <h4>{t('section2_1_title')}</h4>
        <ul>
          <li><strong>{t('section2_1_list_item1_title')}</strong>{t('section2_1_list_item1_text')}</li>
          <li><strong>{t('section2_1_list_item2_title')}</strong>{t('section2_1_list_item2_text')}</li>
          <li><strong>{t('section2_1_list_item3_title')}</strong>{t('section2_1_list_item3_text')}</li>
          <li><strong>{t('section2_1_list_item4_title')}</strong>{t('section2_1_list_item4_text')}</li>
        </ul>
        
        <h4>{t('section2_2_title')}</h4>
        <ul>
          <li><strong>{t('section2_2_list_item1_title')}</strong>{t('section2_2_list_item1_text')}</li>
          <li><strong>{t('section2_2_list_item2_title')}</strong>{t('section2_2_list_item2_text')}</li>
          <li><strong>{t('section2_2_list_item3_title')}</strong>{t('section2_2_list_item3_text')}</li>
        </ul>

        <h4>{t('section2_3_title')}</h4>
        <p>{t('section2_3_text')}</p>

        {/* Раздел 3: Как мы используем данные */}
        <h3>{t('section3_title')}</h3>
        <ul>
          <li>{t('section3_list_item1')}</li>
          <li>{t('section3_list_item2')}</li>
          <li>{t('section3_list_item3')}</li>
          <li>{t('section3_list_item4')}</li>
          <li>{t('section3_list_item5')}</li>
        </ul>
        
        {/* Раздел 4: Разрешения устройства */}
        <h3>{t('section4_title')}</h3>
        <ul>
            <li><strong>{t('section4_list_item1_title')}</strong>{t('section4_list_item1_text')}</li>
            <li><strong>{t('section4_list_item2_title')}</strong>{t('section4_list_item2_text')}</li>
            <li><strong>{t('section4_list_item3_title')}</strong>{t('section4_list_item3_text')}</li>
        </ul>
        
        {/* Раздел 5: Как мы делимся данными */}
        <h3>{t('section5_title')}</h3>
        <p>{t('section5_text')}</p>

        {/* Раздел 6: Безопасность */}
        <h3>{t('section6_title')}</h3>
        <p>{t('section6_text')}</p>

        {/* Раздел 7: Ваши права */}
        <h3>{t('section7_title')}</h3>
        <p>{t('section7_text')}</p>

        {/* Раздел 8: Конфиденциальность детей */}
        <h3>{t('section8_title')}</h3>
        <p>{t('section8_text')}</p>

        {/* Раздел 9: Изменения */}
        <h3>{t('section9_title')}</h3>
        <p>{t('section9_text')}</p>

        {/* Раздел 10: Контакты */}
        <h3>{t('section10_title')}</h3>
        <p>{t('section10_text')}</p>
      </article>
    </div>
  );
}