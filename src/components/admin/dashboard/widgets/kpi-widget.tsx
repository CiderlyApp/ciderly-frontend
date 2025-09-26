// src/components/admin/dashboard/widgets/kpi-widget.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardProps {
  title: string;
  value: number | undefined;
  isLoading: boolean;
}

// ---> ИСПРАВЛЕНИЕ: Добавлено ключевое слово 'export' <---
export function KpiCard({ title, value, isLoading }: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-8 w-1/5" />
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value?.toLocaleString('ru-RU') ?? 'N/A'}</p>
    </div>
  );
}