// src/app/admin/claims/page.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Claim } from '@/hooks/use-claims';
// Функция для получения заявок
const fetchClaims = async (filters: { status: string }): Promise<Claim[]> => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  
  const { data } = await api.get(`/admin/claims?${params.toString()}`);
  return data.data; 
};

export default function ClaimsPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING'); // По умолчанию показываем заявки в ожидании

  const { data: claims, isLoading, error } = useQuery({
    queryKey: ['claims', statusFilter],
    queryFn: () => fetchClaims({ status: statusFilter }),
  });

  if (error) return <div>Ошибка при загрузке заявок: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Управление Заявками</h1>
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

      {isLoading ? (
        <div>Загрузка заявок...</div>
      ) : claims ? (
        <DataTable columns={columns} data={claims} />
      ) : (
        <p>Заявки не найдены.</p>
      )}
    </div>
  );
}