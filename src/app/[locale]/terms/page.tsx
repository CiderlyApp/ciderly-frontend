'use client';

import { PageHeader } from "@/components/page-header";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation('terms');

  return (
    <div className="container py-12 md:py-20">
      <PageHeader
        title={t('title')}
        description={t('last_updated')}
      />
      <article className="prose prose-stone dark:prose-invert max-w-4xl mt-12 mx-auto">
        {/* Раздел 1 */}
        <h3>{t('section1_title')}</h3>
        <p>{t('section1_text')}</p>

        {/* Раздел 2 */}
        <h3>{t('section2_title')}</h3>
        <p>{t('section2_text')}</p>

        {/* Раздел 3 */}
        <h3>{t('section3_title')}</h3>
        <p>{t('section3_intro')}</p>
        <p><strong>{t('section3_subsection_license_title')}</strong> {t('section3_subsection_license_text')}</p>
        <p><strong>{t('section3_subsection_prohibited_title')}</strong> {t('section3_subsection_prohibited_text')}</p>
        <p><strong>{t('section3_subsection_moderation_title')}</strong> {t('section3_subsection_moderation_text')}</p>

        {/* Раздел 4 */}
        <h3>{t('section4_title')}</h3>
        <p>{t('section4_intro')}</p>
        <ul>
          <li>{t('section4_list_item1')}</li>
          <li>{t('section4_list_item2')}</li>
          <li>{t('section4_list_item3')}</li>
        </ul>

        {/* Раздел 5 */}
        <h3>{t('section5_title')}</h3>
        <p>{t('section5_text')}</p>

        {/* Раздел 6 */}
        <h3>{t('section6_title')}</h3>
        <p>{t('section6_text')}</p>

        {/* Раздел 7 */}
        <h3>{t('section7_title')}</h3>
        <p>{t('section7_text')}</p>

        {/* Раздел 8 */}
        <h3>{t('section8_title')}</h3>
        <p>{t('section8_text')}</p>

        {/* Раздел 9 */}
        <h3>{t('section9_title')}</h3>
        <p>{t('section9_text')}</p>

        {/* Раздел 10 */}
        <h3>{t('section10_title')}</h3>
        <p>
          {t('section10_text_1')}{' '}
          <a href="mailto:support@ciderly.app">support@ciderly.app</a>{' '}
          {t('section10_text_2')}{' '}
          <a href="https://ciderly.app" target="_blank" rel="noopener noreferrer">https://ciderly.app</a>.
        </p>

      </article>
    </div>
  );
}