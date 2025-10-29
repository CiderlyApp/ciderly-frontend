// src/app/[locale]/admin/reports/page.tsx
'use client';

import { useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetReports } from '@/hooks/use-reports';
import { columns } from './columns';
// --- НОВЫЙ ИМПОРТ ---
import { PaginationState } from '@tanstack/react-table';

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING');

  // --- ИЗМЕНЕНИЕ №1: ДОБАВЛЯЕМ СОСТОЯНИЕ ДЛЯ ПАГИНАЦИИ ---
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Передаем состояние пагинации в хук (если хук это поддерживает)
  // Если ваш useGetReports не принимает page/limit, его тоже нужно будет обновить
  const { data: response, isLoading, error } = useGetReports(statusFilter);

  const reports = response?.reports ?? [];
  const pageCount = response?.pagination?.totalPages ?? 0;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Жалобы на отзывы</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">В ожидании</SelectItem>
            <SelectItem value="RESOLVED">Принятые</SelectItem>
            <SelectItem value="DISMISSED">Отклоненные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p>Загрузка жалоб...</p>}
      {error && <p className="text-destructive">Ошибка: {error.message}</p>}
      
      {/* --- ИЗМЕНЕНИЕ №2: ПРАВИЛЬНО ПЕРЕДАЕМ ПРОПСЫ --- */}
      {!isLoading && (
        <DataTable 
            columns={columns} 
            data={reports} 
            pageCount={pageCount}
            pagination={{ pageIndex, pageSize }}
            onPaginationChange={setPagination} // Передаем функцию для обновления состояния
        />
      )}
    </div>
  );
}