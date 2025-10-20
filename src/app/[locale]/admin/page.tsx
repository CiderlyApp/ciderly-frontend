// src/app/admin/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { AdminDashboard } from '@/components/admin/dashboard/admin-dashboard';
import { BusinessDashboard } from '@/components/admin/dashboard/business-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'business') {
    return <BusinessDashboard />;
  }

  // Для admin и moderator показываем один и тот же дашборд
  if (user?.role === 'admin' || user?.role === 'moderator') {
    return <AdminDashboard />;
  }
  
  return null; // или компонент-заглушка
}