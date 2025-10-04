// src/hooks/use-ciders.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { Cider } from '@/types/entities';

export const useDeleteCider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ciderId: string) => api.delete(`/ciders/${ciderId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ciders'] });
      toast.success('Напиток успешно удален');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка: ${error.response?.data?.message || 'Не удалось удалить напиток'}`);
    },
  });
};

// Получение одного напитка
export const useGetCider = (ciderId: string | null) => {
  return useQuery({
    queryKey: ['cider', ciderId],
    queryFn: async (): Promise<Cider> => {
      if (!ciderId) throw new Error("ID напитка не предоставлен");
      const { data } = await api.get(`/ciders/${ciderId}`);
      return data.data; // Предполагается, что API возвращает { data: {...} }
    },
    enabled: !!ciderId,
  });
};

// Создание/обновление напитка
export const useCreateOrUpdateCider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ciderData: Partial<Cider> & { id?: string }) => {
      const { id, ...payload } = ciderData;
      if (id) {
        const { data } = await api.patch(`/ciders/${id}`, payload);
        return data.data;
      } else {
        const { data } = await api.post('/ciders', payload);
        return data.data;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ciders'] });
      queryClient.invalidateQueries({ queryKey: ['cider', variables.id] });
      toast.success(variables.id ? 'Напиток успешно обновлен' : 'Напиток успешно создан');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка: ${error.response?.data?.message || 'Произошла ошибка.'}`);
    },
  });
};