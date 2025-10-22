import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Edit, Megaphone, Users } from "lucide-react";
import Link from "next/link";

const FeatureCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  // ИСПРАВЛЕНО: Убран класс text-left, чтобы карточка наследовала центрирование от родителя.
  <Card> 
    <CardHeader>
      {/* ИСПРАВЛЕНО: Обертка для иконки, чтобы она тоже была по центру в своей ячейке. */}
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{children}</CardDescription>
    </CardHeader>
  </Card>
);

const Step = ({ number, title, children }: { number: string, title: string, children: React.ReactNode }) => (
  // ИСПРАВЛЕНО: Убран text-left, чтобы текст шага также был выровнен по центру.
  <div className="flex flex-col items-center gap-4"> 
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-lg text-primary-foreground">
      {number}
    </div>
    <div className="text-center">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  </div>
);

export default function ForBusinessPage() {
  return (
    // Этот контейнер уже правильно центрирует всю страницу.
    <div className="container py-12 md:py-20">
      {/* Этот вложенный блок обеспечивает максимальную ширину и центрирование всего содержимого. */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-y-24 text-center">
        
        <PageHeader
          title="Привлекайте клиентов с Ciderly"
          description="Бесплатная платформа для сидрерий, баров, ресторанов и магазинов для управления своим брендом и взаимодействия с аудиторией."
        />

        <section className="w-full">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ваши возможности</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={Edit} title="Управляйте профилем">
              Редактируйте описание, фото, часы работы и публикуйте актуальное меню вашего заведения.
            </FeatureCard>
            <FeatureCard icon={Megaphone} title="Анонсируйте события">
              Создавайте и продвигайте мероприятия — от дегустаций до фестивалей — прямо в приложении.
            </FeatureCard>
            <FeatureCard icon={Users} title="Взаимодействуйте с гостями">
              Получайте отзывы, отвечайте на них и следите за упоминаниями вашего бренда в ленте.
            </FeatureCard>
            <FeatureCard icon={BarChart} title="Получайте аналитику">
              Узнайте, кто ваша аудитория и какие напитки пользуются наибольшей популярностью.
            </FeatureCard>
          </div>
        </section>

        <section className="w-full">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Как это работает?</h2>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-3">
            <Step number="1" title="Найдите или добавьте свой бренд">
              Проверьте, есть ли ваша компания в нашей базе, или подайте заявку на создание новой страницы.
            </Step>
            <Step number="2" title="Подайте заявку">
              Заполните простую форму, чтобы подтвердить свои права на управление страницей.
            </Step>
            <Step number="3" title="Получите доступ">
              После быстрой модерации вы получите доступ к панели управления вашим бизнесом.
            </Step>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold">Готовы начать?</h3>
          <p className="mt-2 text-muted-foreground">Присоединяйтесь к платформе Ciderly уже сегодня.</p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/claim-business">Подать заявку</Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}