// src/app/admin/places/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Place } from '@/types/entities'; 
import { DataTable } from '@/components/admin/data-table';
import { columns } from './columns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/context/AuthContext';

// Тип для параметров запроса
type FetchPlacesParams = {
  q?: string;
  status?: string;
  // Добавьте другие фильтры по мере необходимости
};

// Функция для получения мест
const fetchPlaces = async (params: FetchPlacesParams): Promise<Place[]> => {
  const { data } = await api.get('/places', { params });
  // Предполагаем, что API возвращает { data: [...], pagination: {...} }
  return data.data;
};

// Функция для получения "своих" мест для роли business
const fetchMyOwnedPlaces = async (): Promise<Place[]> => {
  const { data } = await api.get('/entities/owned');
  // Фильтруем, чтобы оставить только 'PLACE'
  return data.data.filter((entity: any) => entity.entityType === 'PLACE');
}

export default function PlacesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Определяем, какую функцию запроса использовать в зависимости от роли
  const isBusiness = user?.role === 'business';
  const queryKey = isBusiness ? ['my-places'] : ['places', debouncedSearchQuery, statusFilter];
  const queryFn = isBusiness
    ? fetchMyOwnedPlaces
    : () => fetchPlaces({ q: debouncedSearchQuery, status: statusFilter });

  const { data: places, isLoading, error } = useQuery({
    queryKey,
    queryFn,
    enabled: !!user, // Запускаем запрос только после того, как пользователь определен
  });

  if (error) return <div>Ошибка при загрузке: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Управление Местами</h1>

      {/* Показываем фильтры только для админов/модераторов */}
      {!isBusiness && (
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Поиск по названию, адресу..."
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
              <SelectItem value="ARCHIVED">Архивные</SelectItem>
              <SelectItem value="all">Все</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {isLoading ? (
        <div>Загрузка...</div>
      ) : places ? (
        <DataTable columns={columns} data={places} />
      ) : (
        <p>Места не найдены.</p>
      )}
    </div>
  );
}