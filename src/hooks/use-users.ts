// src/hooks/use-users.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { User } from '@/types/entities'; 
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
export const useUpdateUserBlockStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isBlocked }: { userId: string, isBlocked: boolean }) => {
      const endpoint = isBlocked ? `/admin/users/${userId}/block` : `/admin/users/${userId}/unblock`;
      const payload = isBlocked ? { reason: 'Blocked by admin' } : {};
      const { data } = await api.patch(endpoint, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(variables.isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: User['role'] }) => {
      const { data } = await api.patch(`/admin/users/${userId}/role`, { newRole });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Роль пользователя успешно изменена на "${variables.newRole}"`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Не удалось изменить роль.';
      toast.error(`Ошибка: ${errorMessage}`);
    }
  });
};