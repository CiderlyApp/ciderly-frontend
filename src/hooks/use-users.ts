// src/hooks/use-users.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

// Хук для мутации (изменения) статуса блокировки
export const useUpdateUserBlockStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isBlocked }: { userId: string, isBlocked: boolean }) => {
      const endpoint = isBlocked ? `/admin/users/${userId}/block` : `/admin/users/${userId}/unblock`;
      // Для блокировки можно передавать причину, пока оставим пустым
      const payload = isBlocked ? { reason: 'Blocked by admin' } : {};
      const { data } = await api.patch(endpoint, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      // После успешной мутации, инвалидируем кэш пользователей, чтобы таблица обновилась
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(variables.isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован');
    },
    onError: (error) => {
      toast.error(`Ошибка: ${error.message}`);
    }
  });
};