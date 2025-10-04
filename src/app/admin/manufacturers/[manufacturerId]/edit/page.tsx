// src/app/admin/manufacturers/[manufacturerId]/edit/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ManufacturerForm } from "../../manufacturer-form";
import { useGetManufacturer } from '@/hooks/use-manufacturers';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditManufacturerPage() {
  const params = useParams();
  const manufacturerId = params.manufacturerId as string;

  const { data: manufacturer, isLoading, error } = useGetManufacturer(manufacturerId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLoading ? "Загрузка..." : `Редактирование: ${manufacturer?.name}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-40 w-full" />}
        {error && <p className="text-destructive">Ошибка загрузки данных: {error.message}</p>}
        {manufacturer && <ManufacturerForm initialData={manufacturer} />}
      </CardContent>
    </Card>
  );
}