// src/app/[locale]/admin/ciders/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Cider } from '@/types/entities';

// --- ИЗМЕНЕНИЕ №1: УТОЧНЯЕМ ТИП ВОЗВРАЩАЕМЫХ ДАННЫХ ИЗ API ---
// Предполагаем, что API возвращает объект с данными и пагинацией
interface CidersApiResponse {
  data: Cider[];
  pagination: {
    totalPages: number;
    // ...другие поля пагинации
  };
}

const fetchCiders = async (): Promise<CidersApiResponse> => {
    const { data } = await api.get('/ciders');
    return data; 
};

export default function CidersPage() {
    // --- ИЗМЕНЕНИЕ №2: УКАЗЫВАЕМ ПРАВИЛЬНЫЙ ТИП ДЛЯ useQuery ---
    const { data: response, isLoading, error } = useQuery<CidersApiResponse>({
        queryKey: ['ciders'],
        queryFn: fetchCiders,
    });

    if (error) return <div>Ошибка: {error.message}</div>;

    // --- ИЗМЕНЕНИЕ №3: ИЗВЛЕКАЕМ ДАННЫЕ ИЗ ОТВЕТА ---
    // Используем пустой массив как fallback, чтобы избежать ошибок
    const ciders = response?.data ?? [];

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
            {isLoading ? (
                <div>Загрузка...</div>
            // --- ИЗМЕНЕНИЕ №4: ПРОВЕРЯЕМ `response` И ПЕРЕДАЕМ ТОЛЬКО НУЖНЫЕ ПРОПСЫ ---
            ) : response ? (
                // Так как мы не передаем pageCount, DataTable автоматически включит клиентскую пагинацию
                <DataTable columns={columns} data={ciders} />
            ) : (
                <p>Напитки не найдены.</p>
            )}
        </div>
    );
}