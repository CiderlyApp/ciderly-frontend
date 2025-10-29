'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Claim } from '@/hooks/use-claims';
import { PaginationState } from '@tanstack/react-table'; // <-- ИЗМЕНЕНИЕ
import { Input } from '@/components/ui/input'; // <-- ИЗМЕНЕНИЕ
import { useDebounce } from '@/hooks/use-debounce'; // <-- ИЗМЕНЕНИЕ

// <-- ИЗМЕНЕНИЕ: Добавляем тип для ответа API
interface ClaimsApiResponse {
  data: Claim[];
  pagination: {
    totalPages: number;
    // ...
  };
}

const fetchClaims = async (filters: { status: string; q?: string; page: number; limit: number }): Promise<ClaimsApiResponse> => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.q) params.append('q', filters.q);
  params.append('page', filters.page.toString());
  params.append('limit', filters.limit.toString());
  
  const { data } = await api.get(`/admin/claims?${params.toString()}`);
  return data; 
};

export default function ClaimsPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState(''); // <-- ИЗМЕНЕНИЕ
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // <-- ИЗМЕНЕНИЕ

  // <-- ИЗМЕНЕНИЕ: Состояние пагинации
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, error } = useQuery<ClaimsApiResponse>({
    queryKey: ['claims', statusFilter, debouncedSearchQuery, pageIndex, pageSize],
    queryFn: () => fetchClaims({ 
      status: statusFilter, 
      q: debouncedSearchQuery, 
      page: pageIndex + 1, 
      limit: pageSize 
    }),
    placeholderData: keepPreviousData,
  });

  if (error) return <div>Ошибка при загрузке заявок: {error.message}</div>;

  const claims = data?.data ?? [];
  const pageCount = data?.pagination?.totalPages ?? 0;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Управление Заявками</h1>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Поиск по никнейму, названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">В ожидании</SelectItem>
            <SelectItem value="APPROVED">Одобренные</SelectItem>
            <SelectItem value="REJECTED">Отклоненные</SelectItem>
            <SelectItem value="all">Все</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && !data ? (
        <div>Загрузка заявок...</div>
      ) : (
        <DataTable
          columns={columns}
          data={claims}
          pageCount={pageCount}
          pagination={{ pageIndex, pageSize }}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}