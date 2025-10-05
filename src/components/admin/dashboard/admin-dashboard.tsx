// src/components/admin/dashboard/admin-dashboard.tsx
'use client';

import { useGetAdminStats, useGetAdminActivityChart } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { KpiCard } from './widgets/kpi-card';
import { ActivityChart } from './widgets/activity-chart';
import Link from 'next/link';

export function AdminDashboard() {
  // Правильно получаем данные: stats для KPI, activityData для графика
  const { data: stats, isLoading: isLoadingStats } = useGetAdminStats();
  const { data: activityData, isLoading: isLoadingActivity } = useGetAdminActivityChart();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Дашборд</h1>
      
      {/* 
        Один блок isLoading для простоты.
        Используем `stats` для KPI, как и положено.
      */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Пользователи" value={stats?.totalUsers} isLoading={isLoadingStats} />
        <KpiCard title="Сидры" value={stats?.totalApprovedCiders} isLoading={isLoadingStats} />
        <KpiCard title="Места" value={stats?.totalApprovedPlaces} isLoading={isLoadingStats} />
        <KpiCard title="Отзывы" value={stats?.totalReviews} isLoading={isLoadingStats} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1"> {/* Изменим сетку для лучшего вида */}
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
        
        {/* Можно добавить еще виджеты сюда, если нужно */}
        
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Активность за 30 дней</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 
            Передаем `activityData` в компонент графика.
            Состояние загрузки `isLoadingActivity` тоже передаем ему.
          */}
          <ActivityChart data={activityData} isLoading={isLoadingActivity} />
        </CardContent>
      </Card>
    </div>
  );
}