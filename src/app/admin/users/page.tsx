// src/app/admin/users/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns, User } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';

// --- ИЗМЕНЕНИЕ: Функция теперь принимает фильтры ---
const fetchUsers = async (filters: { q?: string; role?: string; isBlocked?: string }): Promise<User[]> => {
  // Формируем параметры запроса
  const params = new URLSearchParams();
  if (filters.q) params.append('q', filters.q);
  if (filters.role && filters.role !== 'all') params.append('role', filters.role);
  if (filters.isBlocked && filters.isBlocked !== 'all') params.append('isBlocked', filters.isBlocked);

  const { data } = await api.get(`/admin/users?${params.toString()}`);
  return data.data; 
};

export default function UsersPage() {
  // --- НОВОЕ: Состояния для фильтров и поиска ---
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [blockedStatus, setBlockedStatus] = useState('all');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: users, isLoading, error } = useQuery({
    // --- ИЗМЕНЕНИЕ: Ключ запроса теперь включает фильтры ---
    queryKey: ['users', debouncedSearchQuery, roleFilter, blockedStatus],
    queryFn: () => fetchUsers({ q: debouncedSearchQuery, role: roleFilter, isBlocked: blockedStatus }),
    // keepPreviousData: true, // Раскомментируйте для более плавного UX
  });

  if (error) return <div>Ошибка при загрузке данных: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Управление пользователями</h1>

      {/* --- НОВОЕ: Панель фильтров --- */}
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Поиск по никнейму, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по роли" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={blockedStatus} onValueChange={setBlockedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="false">Активные</SelectItem>
            <SelectItem value="true">Заблокированные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- ИЗМЕНЕНИЕ: Показываем скелет или данные --- */}
      {isLoading ? (
        <div>Загрузка пользователей...</div>
      ) : users ? (
        <DataTable columns={columns} data={users} />
      ) : (
        <p>Пользователи не найдены.</p>
      )}
    </div>
  );
}