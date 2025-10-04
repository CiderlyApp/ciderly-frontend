// src/app/admin/manufacturers/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ManufacturerForm } from "../manufacturer-form";

export default function NewManufacturerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Создание нового производителя</CardTitle>
      </CardHeader>
      <CardContent>
        <ManufacturerForm />
      </CardContent>
    </Card>
  );
}