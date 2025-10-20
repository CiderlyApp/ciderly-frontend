// src/app/admin/ciders/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CiderForm } from "../cider-form";

export default function NewCiderPage() {
  return (
    <Card>
      <CardHeader><CardTitle>Добавление нового напитка</CardTitle></CardHeader>
      <CardContent><CiderForm /></CardContent>
    </Card>
  );
}