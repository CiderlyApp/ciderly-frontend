// src/hooks/use-users.ts
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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

// --- ХУК для получения одного пользователя ---
export const useGetUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<User> => {
      if (!userId) throw new Error("ID пользователя не предоставлен");
      // Используем админский эндпоинт для получения данных
      const { data } = await api.get(`/admin/users/${userId}`); 
      return data.data;
    },
    enabled: !!userId,
  });
};

// --- ХУК для обновления профиля админом ---
export const useUpdateUserProfileByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData: Partial<User> & { id: string }) => {
      const { id, ...payload } = userData;
      // Используем новый админский эндпоинт
      const { data } = await api.patch(`/admin/users/${id}`, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      // Инвалидируем и список, и конкретного пользователя
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast.success('Профиль пользователя успешно обновлен');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка обновления: ${error.response?.data?.message || 'Произошла ошибка.'}`);
    },
  });
};