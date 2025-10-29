// src/app/admin/my-reviews/page.tsx
'use client';

import { useState } from 'react';
import { useGetOwnedEntities, useGetBusinessReviews } from '@/hooks/use-dashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReviewCard } from '@/components/business/review-card';
import { Skeleton } from '@/components/ui/skeleton';

type OwnedEntity = {
  id: string;
  name: string;
  entityType: 'PLACE' | 'MANUFACTURER';
};

export default function MyReviewsPage() {
  const [selectedEntity, setSelectedEntity] = useState<OwnedEntity | null>(null);

  const { data: ownedEntities, isLoading: isLoadingEntities } = useGetOwnedEntities();
  const { data: reviews, isLoading: isLoadingReviews } = useGetBusinessReviews(
    selectedEntity ? { id: selectedEntity.id, type: selectedEntity.entityType } : null
  );

  const handleEntityChange = (entityId: string) => {
    const entity = ownedEntities?.find(e => e.id === entityId) || null;
    setSelectedEntity(entity);
  };
  
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Мои Отзывы</h1>
        <p className="text-muted-foreground">Просматривайте отзывы о ваших местах и продукции.</p>
      </div>

      {isLoadingEntities ? <Skeleton className="h-10 w-full max-w-sm" /> : (
        <Select onValueChange={handleEntityChange}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Выберите место или производителя..." />
          </SelectTrigger>
          <SelectContent>
            {ownedEntities?.map(entity => (
              <SelectItem key={entity.id} value={entity.id}>
                {entity.name} ({entity.entityType === 'MANUFACTURER' ? 'Производитель' : 'Место'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoadingReviews && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        
        {reviews && reviews.length > 0 && reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
        
        {reviews && reviews.length === 0 && selectedEntity && !isLoadingReviews && (
          <p className="col-span-full text-center text-muted-foreground mt-8">
            Для этого объекта пока нет отзывов.
          </p>
        )}
      </div>
    </div>
  );
}