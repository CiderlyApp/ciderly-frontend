import { ClaimBusinessForm } from "@/components/business/claim-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClaimBusinessPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Заявка на добавление или управление</CardTitle>
          <CardDescription>
            Заполните форму, чтобы добавить новую сидрерию, бар или магазин, или чтобы получить права на управление уже существующим объектом.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClaimBusinessForm />
        </CardContent>
      </Card>
    </div>
  );
}