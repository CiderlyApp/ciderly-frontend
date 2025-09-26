// src/app/admin/users/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { columns, User } from './columns'; // <-- Объединили импорты
import { DataTable } from '@/components/admin/data-table';

// Функция для получения пользователей
const fetchUsers = async (): Promise<User[]> => {
    const { data } = await api.get('/admin/users');
    // Бэкенд возвращает { status, pagination, data: [...] }
    // Нам нужен сам массив пользователей
    return data.data; 
};

export default function UsersPage() {
    // Исправляем вызов useQuery
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'], // Ключ для кэширования
        queryFn: fetchUsers, // Функция для получения данных
    });

    if (isLoading) return <div>Загрузка пользователей...</div>;
    
    // Добавляем более информативное сообщение об ошибке
    if (error) return <div>Ошибка при загрузке данных: {error.message}</div>;

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Управление пользователями</h1>
            {/* Убедимся, что users не undefined перед передачей в DataTable */}
            {users ? (
                <DataTable columns={columns} data={users} />
            ) : (
                <p>Пользователи не найдены.</p>
            )}
        </div>
    );
}