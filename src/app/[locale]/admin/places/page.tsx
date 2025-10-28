// src/app/admin/places/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/context/AuthContext';
import { Place } from '@/types/entities';
import { Button } from '@/components/ui/button'; // <-- НОВЫЙ ИМПОРТ
import Link from 'next/link'; // <-- НОВЫЙ ИМПОРТ
import { PlusCircle } from 'lucide-react'; // <-- НОВЫЙ ИМПОРТ


type OwnedEntity = {
  id: string;
  name: string;
  imageUrl: string | null;
  roleInEntity: string;
  entityType: 'PLACE' | 'MANUFACTURER';
}

const fetchPlaces = async (params: { q?: string; status?: string; }): Promise<Place[]> => {
  const { data } = await api.get('/places', { params });
  return data.data;
};

const fetchMyOwnedPlaces = async (): Promise<Place[]> => {
  const { data } = await api.get('/entities/owned');
  return data.data.filter((entity: OwnedEntity) => entity.entityType === 'PLACE');
}

export default function PlacesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const isBusiness = user?.role === 'business';
  const queryKey = isBusiness ? ['my-places'] : ['places', debouncedSearchQuery, statusFilter];
  const queryFn = isBusiness
    ? fetchMyOwnedPlaces
    : () => fetchPlaces({ q: debouncedSearchQuery, status: statusFilter });

  const { data: places, isLoading, error } = useQuery({
    queryKey,
    queryFn,
    enabled: !!user, 
  });

  if (error) return <div>Ошибка при загрузке: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      {/* --- ИЗМЕНЕНИЕ: Добавляем заголовок с кнопкой --- */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Управление Местами</h1>
        <Button asChild>
          <Link href="/admin/places/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить место
          </Link>
        </Button>
      </div>

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