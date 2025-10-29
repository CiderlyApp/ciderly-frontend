'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // <-- ИЗМЕНЕНИЕ
import api from '@/lib/api';
import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Manufacturer } from '@/types/entities';
import { PaginationState } from '@tanstack/react-table'; // <-- ИЗМЕНЕНИЕ
import { Input } from '@/components/ui/input'; // <-- ИЗМЕНЕНИЕ
import { useDebounce } from '@/hooks/use-debounce'; // <-- ИЗМЕНЕНИЕ

// <-- ИЗМЕНЕНИЕ: Добавляем тип для ответа API
interface ManufacturersApiResponse {
  data: Manufacturer[];
  pagination: {
    totalPages: number;
    currentPage: number;
    limit: number;
    totalItems: number;
  };
}


// <-- ИЗМЕНЕНИЕ: Функция принимает параметры пагинации и поиска
const fetchManufacturers = async (params: { q?: string, page: number, limit: number }): Promise<ManufacturersApiResponse> => {
  const { data } = await api.get('/manufacturers', { params });
  return data;
};

type OwnedEntity = { id: string, entityType: 'PLACE' | 'MANUFACTURER' } & Omit<Manufacturer, 'id' | 'entityType'>;

const fetchMyOwnedManufacturers = async (): Promise<ManufacturersApiResponse> => {
  const { data } = await api.get('/entities/owned');
  const filteredData = data.data.filter((entity: OwnedEntity) => entity.entityType === 'MANUFACTURER');
  // Имитируем объект пагинации для консистентности
  return {
    data: filteredData,
    pagination: { totalPages: 1, currentPage: 1, limit: filteredData.length, totalItems: filteredData.length }
  };
}

export default function ManufacturersPage() {
  const { user } = useAuth();
  const isBusiness = user?.role === 'business';

  // <-- ИЗМЕНЕНИЕ: Состояния для пагинации и поиска
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryKey = isBusiness ? ['my-manufacturers'] : ['manufacturers', debouncedSearchQuery, pageIndex, pageSize];
  const queryFn = isBusiness
    ? fetchMyOwnedManufacturers
    : () => fetchManufacturers({ q: debouncedSearchQuery, page: pageIndex + 1, limit: pageSize });

  const { data, isLoading, error } = useQuery<ManufacturersApiResponse>({
    queryKey,
    queryFn,
    enabled: !!user,
    placeholderData: keepPreviousData, // <-- ИЗМЕНЕНИЕ: Для плавного перехода между страницами
  });

  if (error) return <div>Ошибка: {error.message}</div>;

  // <-- ИЗМЕНЕНИЕ: Безопасное извлечение данных
  const manufacturers = data?.data ?? [];
  const pageCount = data?.pagination?.totalPages ?? 0;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Управление Производителями</h1>
        {!isBusiness && (
          <Button asChild>
            <Link href="/admin/manufacturers/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить производителя
            </Link>
          </Button>
        )}
      </div>

      {/* --- ПОЛЕ ПОИСКА --- */}
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading && !data ? (
        <div>Загрузка...</div>
      ) : (
        // <-- ИЗМЕНЕНИЕ: Передаем пропсы для пагинации
        <DataTable
          columns={columns}
          data={manufacturers}
          pageCount={pageCount}
          pagination={{ pageIndex, pageSize }}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}