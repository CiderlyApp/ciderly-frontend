// src/app/admin/places/new/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceForm } from "../place-form";

export default function NewPlacePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Создание нового места</CardTitle>
      </CardHeader>
      <CardContent>
        <PlaceForm />
      </CardContent>
    </Card>
  );
}