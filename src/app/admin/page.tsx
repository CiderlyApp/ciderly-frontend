// src/app/admin/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Добро пожаловать, {user?.nickname}!</h1>
      <Card>
        <CardHeader>
          <CardTitle>Статистика</CardTitle>
          <CardDescription>
            Здесь будет отображаться основная статистика по платформе. Раздел находится в разработке.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}