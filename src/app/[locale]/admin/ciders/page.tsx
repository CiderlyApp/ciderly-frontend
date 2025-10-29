// src/app/[locale]/admin/ciders/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Cider } from '@/types/entities';
import { PaginationState } from '@tanstack/react-table';
import { Input } from '@/components/ui/input'; // <-- ИМПОРТ
import { useDebounce } from '@/hooks/use-debounce'; // <-- ИМПОРТ

interface CidersApiResponse {
  data: Cider[];
  pagination: {
    totalPages: number;
    currentPage: number;
    limit: number;
    totalItems: number;
  };
}

const fetchCiders = async (filters: {
  q?: string;
  page: number;
  limit: number;
}): Promise<CidersApiResponse> => {
  const params = new URLSearchParams();
  if (filters.q) params.append('q', filters.q);
  params.append('page', filters.page.toString());
  params.append('limit', filters.limit.toString());
  // Запрашиваем все статусы для админки
  params.append('status', 'ALL');

  const { data } = await api.get(`/ciders?${params.toString()}`);
  return data;
};

export default function CidersPage() {
  const [searchQuery, setSearchQuery] = useState(''); // <-- СОСТОЯНИЕ ДЛЯ ПОИСКА
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // <-- DEBOUNCE

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, error } = useQuery<CidersApiResponse>({
    queryKey: ['ciders', debouncedSearchQuery, pageIndex, pageSize],
    queryFn: () => fetchCiders({
      q: debouncedSearchQuery,
      page: pageIndex + 1,
      limit: pageSize,
    }),
    placeholderData: keepPreviousData,
  });

  if (error) return <div>Ошибка: {error.message}</div>;

  const ciders = data?.data ?? [];
  const pageCount = data?.pagination?.totalPages ?? 0;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Управление Напитками</h1>
        <Button asChild>
          <Link href="/admin/ciders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить напиток
          </Link>
        </Button>
      </div>

      {/* --- ПОЛЕ ПОИСКА --- */}
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Поиск по названию, производителю..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading && !data ? (
        <div>Загрузка...</div>
      ) : (
        <DataTable
          columns={columns}
          data={ciders}
          pageCount={pageCount}
          pagination={{ pageIndex, pageSize }}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}