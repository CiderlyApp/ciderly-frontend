// src/components/admin/dashboard/widgets/kpi-card.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardProps {
  title: string;
  value: number | string | undefined;
  isLoading: boolean;
}

export function KpiCard({ title, value, isLoading }: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 rounded-lg border p-4">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-8 w-2/5" />
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value?.toLocaleString('ru-RU') ?? 'N/A'}</p>
    </div>
  );
}