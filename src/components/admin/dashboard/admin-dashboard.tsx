// src/components/admin/dashboard/admin-dashboard.tsx
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useGetAdminStats, useGetAdminActivityChart } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { KpiCard } from './widgets/kpi-card';
import { ActivityChart } from './widgets/activity-chart';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data: stats, isLoading: isLoadingStats, isFetching: isFetchingStats } = useGetAdminStats();
  const { data: activityData, isLoading: isLoadingActivity, isFetching: isFetchingActivity } = useGetAdminActivityChart();

  const isRefreshing = isFetchingStats || isFetchingActivity;

  const handleRefresh = () => {
    toast.info("Обновление данных...");
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    queryClient.invalidateQueries({ queryKey: ['admin-activity-chart'] });
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Пользователи" value={stats?.totalUsers} isLoading={isLoadingStats} />
        {/* --- ИСПРАВЛЕНИЕ: Добавлено `?? 0` чтобы избежать "N/A" --- */}
        <KpiCard title="Сидры" value={stats?.totalApprovedCiders ?? 0} isLoading={isLoadingStats} />
        <KpiCard title="Места" value={stats?.totalApprovedPlaces ?? 0} isLoading={isLoadingStats} />
        <KpiCard title="Отзывы" value={stats?.totalReviews} isLoading={isLoadingStats} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Очередь модерации</CardTitle>
            <CardDescription>Объекты, требующие вашего внимания.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingStats ? (
                <Skeleton className="h-24 w-full" />
            ) : (
                <>
                    <Link href="/admin/claims?status=PENDING" className="flex justify-between items-center hover:bg-muted p-2 rounded-md">
                        <span>Заявки на владение</span>
                        <span className="font-bold">{stats?.moderationQueue.claims}</span>
                    </Link>
                    <Link href="/admin/ciders?status=pending" className="flex justify-between items-center hover:bg-muted p-2 rounded-md">
                        <span>Сидры на модерации</span>
                        <span className="font-bold">{stats?.moderationQueue.ciders}</span>
                    </Link>
                    <Link href="/admin/places?status=PENDING" className="flex justify-between items-center hover:bg-muted p-2 rounded-md">
                        <span>Места на модерации</span>
                        <span className="font-bold">{stats?.moderationQueue.places}</span>
                    </Link>
                </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Активность за 30 дней</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityChart data={activityData} isLoading={isLoadingActivity} />
        </CardContent>
      </Card>
    </div>
  );
}