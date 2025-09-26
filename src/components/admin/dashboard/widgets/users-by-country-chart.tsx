// src/components/admin/dashboard/widgets/users-by-country-chart.tsx
'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

type ChartData = {
  country: string;
  count: number;
}

interface UsersByCountryChartProps {
  data: ChartData[] | undefined;
  isLoading: boolean;
}

export function UsersByCountryChart({ data, isLoading }: UsersByCountryChartProps) {
  if (isLoading || !data) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="country" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}