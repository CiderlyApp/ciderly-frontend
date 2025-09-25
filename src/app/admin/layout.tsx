// src/app/admin/layout.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/admin/sidebar'; // Создадим этот компонент

const ADMIN_ROLES = ['admin', 'moderator', 'business'];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Ждем окончания проверки токена

    if (!isAuthenticated) {
      router.push('/login'); // Если не аутентифицирован, на страницу входа
      return;
    }
    
    // Если роль пользователя не входит в список разрешенных
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      router.push('/'); // На главную (или на страницу "Доступ запрещен")
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Пока идет проверка, можно показать загрузчик
  if (isLoading || !isAuthenticated || !user || !ADMIN_ROLES.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Загрузка...</p> 
      </div>
    );
  }

  // Если все проверки пройдены, показываем layout админки
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 bg-muted/40">
        {children}
      </main>
    </div>
  );
}