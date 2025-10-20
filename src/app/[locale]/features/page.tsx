// FILE: src/app/[locale]/features/page.tsx
import { PageHeader } from "@/components/page-header";
import { CheckCircle } from "lucide-react";
// ИСПРАВЛЕНО: Удален неиспользуемый импорт Image
// import Image from "next/image"; 

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
  return (
    <div className="container py-12 md:py-20">
      <PageHeader
        title="Все возможности Ciderly"
        description="Откройте для себя весь функционал, который делает наше приложение незаменимым помощником для любителя сидра."
      />
      <div className="mt-16 space-y-24">
        <FeatureDetail title="Умный поиск и сканер" imageUrl="Изображение сканера">
          <p>Забудьте о ручном поиске. Наша технология распознавания изображений позволяет мгновенно идентифицировать сидр по этикетке и даже найти напитки в меню бара. Вся информация — в одно касание.</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Сканирование этикеток бутылок и банок.</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Распознавание текста в меню заведений (OCR).</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Быстрый доступ к отзывам, рейтингу и деталям.</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail title="Персональный вкусовой паспорт" imageUrl="Изображение радара вкуса" reverse>
          <p>Оценивайте сидр не просто по звездам, а по детальным вкусовым характеристикам. Наша система помогает вам лучше понимать свои предпочтения и находить напитки, которые вам точно понравятся.</p>
           <ul className="mt-4 space-y-2">
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Шкалы: сладость, кислотность, танины, карбонизация, тело.</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Радар-диаграмма для визуализации вашего профиля.</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Персональные рекомендации на основе ваших оценок.</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail title="Интерактивная карта и события" imageUrl="Изображение карты и календаря">
          <p>Ciderly — это ваш гид по сидровой жизни города. Находите новые места, планируйте визиты и не пропускайте самые интересные мероприятия.</p>
           <ul className="mt-4 space-y-2">
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Карта баров, ресторанов и магазинов с сидром.</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Календарь фестивалей, дегустаций и других событий.</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Фильтры по типу заведения и поиск поблизости.</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail title="Социальная платформа и избранное" imageUrl="Изображение ленты и профиля" reverse>
          <p>Делитесь своими находками, следите за активностью друзей и создавайте личные коллекции сидров. Ciderly — это место для общения и обмена опытом.</p>
           <ul className="mt-4 space-y-2">
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Лента активности с отзывами ваших друзей.</li>
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Профиль с вашей статистикой и достижениями.</li>
             {/* ИСПРАВЛЕНО: Использованы кавычки-елочки */}
            <li className="flex items-start"><CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />Списки избранного: «Хочу попробовать», «В холодильнике», «Любимое».</li>
          </ul>
        </FeatureDetail>
      </div>
    </div>
  );
}