'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/context/AuthContext';
import { Place } from '@/types/entities';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { PaginationState } from '@tanstack/react-table';

// <-- ИЗМЕНЕНИЕ: Добавляем тип для ответа API
interface PlacesApiResponse {
  data: Place[];
  pagination: {
    totalPages: number;
    // ...
  };
}

// <-- ИЗМЕНЕНИЕ: Добавляем тип OwnedEntity
type OwnedEntity = {
  id: string;
  name: string;
  imageUrl: string | null;
  roleInEntity: string;
  entityType: 'PLACE' | 'MANUFACTURER';
}

const fetchPlaces = async (params: { q?: string; status?: string; page: number; limit: number }): Promise<PlacesApiResponse> => {
  const { data } = await api.get('/places', { params });
  return data;
};

// <-- ИЗМЕНЕНИЕ: Добавляем недостающую функцию
const fetchMyOwnedPlaces = async (): Promise<PlacesApiResponse> => {
  const { data } = await api.get('/entities/owned');
  const filteredData = data.data.filter((entity: OwnedEntity) => entity.entityType === 'PLACE');
  return {
    data: filteredData as Place[], // Приводим тип для TypeScript
    pagination: { totalPages: 1 }
  };
}


export default function PlacesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isBusiness = user?.role === 'business';
  
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryKey = isBusiness ? ['my-places'] : ['places', debouncedSearchQuery, statusFilter, pageIndex, pageSize];
  
  // <-- ИЗМЕНЕНИЕ: Упрощаем логику вызова функции
  const queryFn = isBusiness
    ? fetchMyOwnedPlaces
    : () => fetchPlaces({ q: debouncedSearchQuery, status: statusFilter, page: pageIndex + 1, limit: pageSize });

  const { data, isLoading, error } = useQuery<PlacesApiResponse>({
    queryKey,
    queryFn,
    enabled: !!user,
    placeholderData: keepPreviousData,
  });

  if (error) return <div>Ошибка при загрузке: {error.message}</div>;

  const places = data?.data ?? [];
  const pageCount = data?.pagination?.totalPages ?? 0;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Управление Местами</h1>
        <Button asChild>
          <Link href="/admin/places/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить место
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Поиск по названию, адресу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {!isBusiness && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">В ожидании</SelectItem>
              <SelectItem value="APPROVED">Одобренные</SelectItem>
              <SelectItem value="REJECTED">Отклоненные</SelectItem>
              <SelectItem value="ARCHIVED">Архивные</SelectItem>
              <SelectItem value="ALL">Все</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      {isLoading && !data ? (
        <div>Загрузка...</div>
      ) : (
        <DataTable
          columns={columns}
          data={places}
          pageCount={pageCount}
          pagination={{ pageIndex, pageSize }}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
}