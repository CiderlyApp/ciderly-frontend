// src/hooks/use-ciders.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { Cider } from '@/types/entities';

// --- ИСПРАВЛЕНИЕ: Тип вынесен за пределы функции ---
type CiderDirectoryItem = Pick<Cider, 'id' | 'name' | 'manufacturerName'>;

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
      return data.data;
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
export const useGetCiders = () => {
  return useQuery<Cider[]>({
    queryKey: ['ciders'],
    queryFn: async () => {
      const { data } = await api.get('/ciders');
      // API возвращает { pagination: {...}, data: [...] }
      return data.data; 
    },
  });
};
// <-- ХУК ДЛЯ СМЕНЫ СТАТУСА -->
export const useUpdateCiderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ciderId, status }: { ciderId: string; status: Cider['status'] }) => {
      const { data } = await api.patch(`/ciders/${ciderId}`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ciders'] });
      queryClient.invalidateQueries({ queryKey: ['cider', variables.ciderId] });
      toast.success(`Статус напитка изменен на "${variables.status}"`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка: ${error.response?.data?.message || 'Не удалось изменить статус.'}`);
    },
  });
};



// Получение полного списка сидров для справочников
export const useGetCidersDirectory = () => {
    return useQuery({
        queryKey: ['ciders-directory'],
        queryFn: async (): Promise<CiderDirectoryItem[]> => {
            const { data } = await api.get('/ciders/directory');
            return data;
        },
        staleTime: 1000 * 60 * 10, // Кэшируем на 10 минут
    });
};