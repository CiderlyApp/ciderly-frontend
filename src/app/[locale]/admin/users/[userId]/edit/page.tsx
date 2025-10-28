// src/app/admin/users/[userId]/edit/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "../../user-form"; // Создадим этот компонент
import { useGetUser } from '@/hooks/use-users'; // Создадим этот хук
import { Skeleton } from '@/components/ui/skeleton';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.userId as string;

  // Используем хук для загрузки данных пользователя
  const { data: user, isLoading, error } = useGetUser(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLoading ? "Загрузка профиля..." : `Редактирование: ${user?.nickname}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {error && <p className="text-destructive">Ошибка загрузки данных: {error.message}</p>}
        {user && <UserForm initialData={user} />}
      </CardContent>
    </Card>
  );
}