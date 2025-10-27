// src/app/admin/ciders/[ciderId]/edit/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CiderForm } from "../../cider-form";
import { useGetCider } from '@/hooks/use-ciders'; // Убедитесь, что хук есть
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCiderPage() {
  const params = useParams();
  const ciderId = params.ciderId as string;

  const { data: cider, isLoading, error } = useGetCider(ciderId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLoading ? "Загрузка..." : `Редактирование: ${cider?.name}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-60 w-full" />}
        {error && <p className="text-destructive">Ошибка: {error.message}</p>}
        {cider && <CiderForm initialData={cider} />}
      </CardContent>
    </Card>
  );
}