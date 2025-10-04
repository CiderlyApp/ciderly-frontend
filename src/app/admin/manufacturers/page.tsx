// src/app/admin/manufacturers/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns} from './columns';
import { DataTable } from '@/components/admin/data-table';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Manufacturer } from '@/types/entities';

const fetchManufacturers = async (): Promise<Manufacturer[]> => {
    const { data } = await api.get('/manufacturers');
    return data.data; 
};

type OwnedEntity = { id: string, entityType: 'PLACE' | 'MANUFACTURER' } & Omit<Manufacturer, 'id' | 'entityType'>;

const fetchMyOwnedManufacturers = async (): Promise<Manufacturer[]> => {
  const { data } = await api.get('/entities/owned');
  return data.data.filter((entity: OwnedEntity) => entity.entityType === 'MANUFACTURER');
}

export default function ManufacturersPage() {
    const { user } = useAuth();
    
    const isBusiness = user?.role === 'business';
    const queryKey = isBusiness ? ['my-manufacturers'] : ['manufacturers'];
    const queryFn = isBusiness ? fetchMyOwnedManufacturers : fetchManufacturers;

    const { data: manufacturers, isLoading, error } = useQuery({
        queryKey,
        queryFn,
        enabled: !!user,
    });

    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Управление Производителями</h1>
                <Button asChild>
                    <Link href="/admin/manufacturers/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить производителя
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div>Загрузка...</div>
            ) : manufacturers ? (
                <DataTable columns={columns} data={manufacturers} />
            ) : (
                <p>Производители не найдены.</p>
            )}
        </div>
    );
}