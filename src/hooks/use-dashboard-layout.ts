// src/hooks/use-dashboard-layout.ts
'use client';

import { useState, useEffect } from 'react';

export type Widget = {
  id: string;
  name: string;
  visible: boolean;
};

const DEFAULT_WIDGETS: Widget[] = [
  { id: 'kpi', name: 'Ключевые показатели', visible: true },
  { id: 'usersByCountry', name: 'Пользователи по странам', visible: true },
  { id: 'usersByGender', name: 'Пользователи по полу', visible: true },
  { id: 'usersByAge', name: 'Пользователи по возрасту', visible: true },
];

const LOCAL_STORAGE_KEY = 'dashboard-layout';

export const useDashboardLayout = () => {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout) as Widget[];
        // Синхронизируем с дефолтным списком, если были добавлены новые виджеты
        const updatedWidgets = DEFAULT_WIDGETS.map(defaultWidget => 
          parsedLayout.find(savedWidget => savedWidget.id === defaultWidget.id) || defaultWidget
        );
        setWidgets(updatedWidgets);
      }
    } catch (error) {
      console.error("Failed to load dashboard layout from localStorage", error);
      setWidgets(DEFAULT_WIDGETS);
    }
    setIsInitialized(true);
  }, []);

  const saveLayout = (newLayout: Widget[]) => {
    setWidgets(newLayout);
    if (isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLayout));
    }
  };

  const reorderWidgets = (fromId: string, toId: string) => {
    const fromIndex = widgets.findIndex(w => w.id === fromId);
    const toIndex = widgets.findIndex(w => w.id === toId);

    if (fromIndex !== -1 && toIndex !== -1) {
      const newWidgets = Array.from(widgets);
      const [movedItem] = newWidgets.splice(fromIndex, 1);
      newWidgets.splice(toIndex, 0, movedItem);
      saveLayout(newWidgets);
    }
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const newWidgets = widgets.map(w =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    saveLayout(newWidgets);
  };

  return { widgets, reorderWidgets, toggleWidgetVisibility, isInitialized };
};