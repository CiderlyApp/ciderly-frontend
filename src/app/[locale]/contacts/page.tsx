// FILE: src/app/[locale]/contacts/page.tsx
import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// ИСПРАВЛЕНО: Удален неиспользуемый CardContent
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Briefcase } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="container py-12 md:py-20">
      <PageHeader
        title="Контакты и FAQ"
        description="Свяжитесь с нами или найдите ответы на часто задаваемые вопросы."
      />
      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-6">Свяжитесь с нами</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-base">Общие вопросы</CardTitle>
                  <a href="mailto:hello@ciderly.app" className="text-sm text-muted-foreground hover:underline">hello@ciderly.app</a>
                </div>
              </CardHeader>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Briefcase className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-base">Для бизнеса</CardTitle>
                  <a href="mailto:business@ciderly.app" className="text-sm text-muted-foreground hover:underline">business@ciderly.app</a>
                </div>
              </CardHeader>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <MessageSquare className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-base">Поддержка</CardTitle>
                  <a href="mailto:support@ciderly.app" className="text-sm text-muted-foreground hover:underline">support@ciderly.app</a>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div>
           <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Как добавить сидр, которого нет в базе?</AccordionTrigger>
              <AccordionContent>
                {/* ИСПРАВЛЕНО: Использованы одинарные кавычки для обертки */}
                Вы можете добавить новый сидр прямо в приложении. Нажмите на кнопку {'"'+'"'} на экране поиска и заполните форму. Ваша заявка отправится на модерацию.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Что делать, если сканер не распознал этикетку?</AccordionTrigger>
              <AccordionContent>
                Убедитесь, что освещение хорошее, а этикетка не повреждена. Если проблема повторяется, воспользуйтесь ручным поиском. Мы постоянно улучшаем наш алгоритм распознавания.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Как заявить права на страницу своего заведения?</AccordionTrigger>
              <AccordionContent>
                {/* ИСПРАВЛЕНО: Использованы кавычки-елочки для стилистики */}
                Перейдите в раздел «Для бизнеса» на нашем сайте и заполните форму заявки. Мы свяжемся с вами после проверки данных для предоставления доступа.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}