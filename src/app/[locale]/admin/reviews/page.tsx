// src/app/admin/reviews/page.tsx
'use client';

import { useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetReviewsForModeration } from '@/hooks/use-reviews';
import { columns } from './columns';

export default function ReviewsModerationPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const { data: response, isLoading, error } = useGetReviewsForModeration(statusFilter);

  const reviews = response?.reviews ?? [];
  const pageCount = response?.pagination?.totalPages ?? 0;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Модерация Отзывов</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">В ожидании</SelectItem>
            <SelectItem value="APPROVED">Одобренные</SelectItem>
            <SelectItem value="REJECTED">Отклоненные</SelectItem>
            <SelectItem value="ALL">Все</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p>Загрузка отзывов...</p>}
      {error && <p className="text-destructive">Ошибка: {error.message}</p>}
      {!isLoading && <DataTable columns={columns} data={reviews} pageCount={pageCount} pagination={{pageIndex: 0, pageSize: 20}} onPaginationChange={() => {}} />}
    </div>
  );
}