// src/app/admin/ciders/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Cider } from '@/types/entities';
const fetchCiders = async (): Promise<Cider[]> => {
    const { data } = await api.get('/ciders');
    return data.data; 
};

export default function CidersPage() {
    const { data: ciders, isLoading, error } = useQuery({
        queryKey: ['ciders'],
        queryFn: fetchCiders,
    });

    if (error) return <div>Ошибка: {error.message}</div>;

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
            ) : ciders ? (
                <DataTable columns={columns} data={ciders} />
            ) : (
                <p>Напитки не найдены.</p>
            )}
        </div>
    );
}