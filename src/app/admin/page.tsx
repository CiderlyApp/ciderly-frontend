// src/app/admin/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
// ---> ИСПРАВЛЕНИЕ: 'arrayMove' удален из этой строки <---
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDashboardLayout, Widget } from '@/hooks/use-dashboard-layout';
import { DashboardSettings } from '@/components/admin/dashboard/dashboard-settings';
import { WidgetCard } from '@/components/admin/dashboard/widget-card';
import { KpiCard } from '@/components/admin/dashboard/widgets/kpi-widget';
import { UsersByCountryChart } from '@/components/admin/dashboard/widgets/users-by-country-chart';
import { mockDashboardApi } from '@/lib/mock-api';

// Компонент-обертка для D&D
const SortableWidget = ({ widget, children }: { widget: Widget, children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: widget.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: mockDashboardApi,
  });
  
  const { widgets, reorderWidgets, toggleWidgetVisibility } = useDashboardLayout();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderWidgets(active.id as string, over.id as string);
    }
  };

  const visibleWidgets = widgets.filter(w => w.visible);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Дашборд</h1>
        <DashboardSettings widgets={widgets} onToggle={toggleWidgetVisibility}>
           <Settings className="h-5 w-5" />
           Настроить
        </DashboardSettings>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleWidgets} strategy={verticalListSortingStrategy}>
          <div className="grid gap-6">
            {visibleWidgets.map((widget) => {
              let content = null;
              switch (widget.id) {
                case 'kpi':
                  content = (
                    <WidgetCard title="Ключевые показатели">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KpiCard title="Пользователи" value={data?.kpi.totalUsers} isLoading={isLoading} />
                        <KpiCard title="Места" value={data?.kpi.totalPlaces} isLoading={isLoading} />
                        <KpiCard title="Напитки" value={data?.kpi.totalCiders} isLoading={isLoading} />
                        <KpiCard title="Отзывы" value={data?.kpi.totalReviews.total} isLoading={isLoading} />
                      </div>
                    </WidgetCard>
                  );
                  break;
                case 'usersByCountry':
                  content = (
                    <WidgetCard title="Пользователи по странам" description="Топ-4 страны по количеству регистраций">
                      <UsersByCountryChart data={data?.userDemographics.byCountry} isLoading={isLoading} />
                    </WidgetCard>
                  );
                  break;
                // Добавьте сюда другие виджеты (usersByGender, usersByAge)
                default:
                  content = <WidgetCard title={widget.name}>В разработке...</WidgetCard>;
              }

              return (
                <SortableWidget key={widget.id} widget={widget}>
                  {content}
                </SortableWidget>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}