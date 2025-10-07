// src/components/admin/dashboard/business-dashboard.tsx
'use client';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetOwnedEntities, useGetManufacturerCiders } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CiderAudienceAnalytics } from './widgets/cider-audience-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Cider } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function BusinessDashboard() {
  const queryClient = useQueryClient();
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [selectedCiderId, setSelectedCiderId] = useState<string>('');

  const { data: ownedEntities, isLoading: isLoadingEntities, isFetching: isFetchingEntities } = useGetOwnedEntities();
  
  const selectedEntity = ownedEntities?.find(e => e.id === selectedEntityId);
  const isManufacturerSelected = selectedEntity?.entityType === 'MANUFACTURER';

  const { data: ciders, isLoading: isLoadingCiders, isFetching: isFetchingCiders } = useGetManufacturerCiders(
    isManufacturerSelected ? selectedEntityId : null
  );

  const isRefreshing = isFetchingEntities || isFetchingCiders;

  const handleRefresh = () => {
    toast.info("Обновление данных...");
    // Инвалидируем все связанные с бизнесом запросы
    queryClient.invalidateQueries({ queryKey: ['my-owned-entities'] });
    queryClient.invalidateQueries({ queryKey: ['manufacturer-ciders'] });
    queryClient.invalidateQueries({ queryKey: ['cider-analytics'] });
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Дашборд</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Аналитика по продуктам</CardTitle>
          <CardDescription>Выберите производителя и напиток для просмотра детальной статистики.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {isLoadingEntities ? <Skeleton className="h-10 w-full sm:w-64" /> : (
              <Select value={selectedEntityId} onValueChange={(val) => { setSelectedEntityId(val); setSelectedCiderId(''); }}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Выберите производителя..." />
                </SelectTrigger>
                <SelectContent>
                  {ownedEntities?.filter(e => e.entityType === 'MANUFACTURER').map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {isLoadingCiders ? <Skeleton className="h-10 w-full sm:w-64" /> : (
              <Select value={selectedCiderId} onValueChange={setSelectedCiderId} disabled={!selectedEntityId || !ciders || ciders.length === 0}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Выберите напиток..." />
                </SelectTrigger>
                <SelectContent>
                  {ciders?.map((cider: Cider) => (
                    <SelectItem key={cider.id} value={cider.id}>{cider.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="pt-4 border-t">
            {selectedCiderId ? (
              <CiderAudienceAnalytics ciderId={selectedCiderId} />
            ) : (
              <p className="text-center text-muted-foreground p-8">
                {selectedEntityId ? 'Теперь выберите напиток' : 'Сначала выберите производителя'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}