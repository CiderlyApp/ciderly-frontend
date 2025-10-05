// src/components/admin/dashboard/widgets/activity-chart.tsx
'use client';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityChartDataPoint } from '@/types/dashboard';

interface ActivityChartProps {
  data: ActivityChartDataPoint[] | undefined; // <-- ИСПРАВЛЕНО
  isLoading: boolean;
}

export function ActivityChart({ data, isLoading }: ActivityChartProps) {
  if (isLoading || !data) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  const formattedData = data.map(item => ({
      ...item,
      day: new Date(item.day).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="newUsers" name="Новые пользователи" stroke="hsl(var(--primary))" />
        <Line type="monotone" dataKey="newReviews" name="Новые отзывы" stroke="hsl(var(--chart-2))" />
      </LineChart>
    </ResponsiveContainer>
  );
}