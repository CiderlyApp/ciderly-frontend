// src/app/admin/places/[placeId]/edit/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceForm } from "../../place-form";
import { useGetPlace } from '@/hooks/use-places';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPlacePage() {
  const params = useParams();
  const placeId = params.placeId as string;

  const { data: place, isLoading, error } = useGetPlace(placeId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLoading ? "Загрузка..." : `Редактирование: ${place?.name}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {error && <p className="text-destructive">Ошибка загрузки данных: {error.message}</p>}
        {place && <PlaceForm initialData={place} />}
      </CardContent>
    </Card>
  );
}