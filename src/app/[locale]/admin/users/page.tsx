'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // <-- ИМПОРТ keepPreviousData
import { PaginationState } from '@tanstack/react-table';
import api from '@/lib/api';
import { columns } from './columns';
import { User } from '@/types/entities'; 
import { DataTable } from '@/components/admin/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';

interface UsersApiResponse {
  data: User[];
  pagination: {
    currentPage: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

const fetchUsers = async (filters: { 
  q?: string; 
  role?: string; 
  isBlocked?: string;
  page: number;
  limit: number;
}): Promise<UsersApiResponse> => {
  const params = new URLSearchParams();
  if (filters.q) params.append('q', filters.q);
  if (filters.role && filters.role !== 'all') params.append('role', filters.role);
  if (filters.isBlocked && filters.isBlocked !== 'all') params.append('isBlocked', filters.isBlocked);
  params.append('page', filters.page.toString());
  params.append('limit', filters.limit.toString());

  const { data } = await api.get(`/admin/users?${params.toString()}`);
  return data; 
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [blockedStatus, setBlockedStatus] = useState('all');
  
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, isLoading, error } = useQuery<UsersApiResponse>({ // <-- Указываем тип явно
    queryKey: ['users', debouncedSearchQuery, roleFilter, blockedStatus, pageIndex, pageSize],
    queryFn: () => fetchUsers({ 
      q: debouncedSearchQuery, 
      role: roleFilter, 
      isBlocked: blockedStatus,
      page: pageIndex + 1,
      limit: pageSize,
    }),
    // --- ИЗМЕНЕНИЕ: Используем новый синтаксис для сохранения предыдущих данных ---
    placeholderData: keepPreviousData,
  });

  if (error) return <div>Ошибка при загрузке данных: {error.message}</div>;
  
  // --- ИЗМЕНЕНИЕ: Безопасное извлечение данных с fallback-значениями ---
  const users = data?.data ?? [];
  const pageCount = data?.pagination?.totalPages ?? 0;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Управление пользователями</h1>

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
            <SelectItem value="blogger">Blogger</SelectItem>
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

      {/* --- ИЗМЕНЕНИЕ: Показываем скелет только при самой первой загрузке --- */}
      {isLoading && !data ? (
        <div>Загрузка пользователей...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={users} 
          pageCount={pageCount}
          pagination={{ pageIndex, pageSize }}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}