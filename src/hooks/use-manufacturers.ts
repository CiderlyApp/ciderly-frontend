// src/hooks/use-manufacturers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { Manufacturer } from '@/types/entities';

// Хук для получения одного производителя
export const useGetManufacturer = (manufacturerId: string | null) => {
  return useQuery({
    queryKey: ['manufacturer', manufacturerId],
    queryFn: async (): Promise<Manufacturer> => {
      if (!manufacturerId) throw new Error("ID производителя не предоставлен");
      const { data } = await api.get(`/manufacturers/${manufacturerId}`);
      return data.data; // Бэкенд возвращает { status, data }
    },
    enabled: !!manufacturerId,
  });
};

// Хук для создания или обновления производителя
export const useCreateOrUpdateManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (manufacturerData: Partial<Manufacturer> & { id?: string }) => {
      const { id, ...payload } = manufacturerData;
      if (id) {
        const { data } = await api.patch(`/manufacturers/${id}`, payload);
        return data.data;
      } else {
        const { data } = await api.post('/manufacturers', payload);
        return data.data;
      }
    },
    onSuccess: (data, variables) => {
      const isUpdate = !!variables.id;
      queryClient.invalidateQueries({ queryKey: ['manufacturers'] });
      queryClient.invalidateQueries({ queryKey: ['manufacturer', variables.id] });
      toast.success(isUpdate ? 'Производитель успешно обновлен' : 'Производитель успешно создан');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка: ${error.response?.data?.message || 'Произошла ошибка.'}`);
    },
  });
};

// --- ХУК для смены статуса ---
export const useUpdateManufacturerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ manufacturerId, isClosed }: { manufacturerId: string, isClosed: boolean }) => {
      const { data } = await api.patch(`/admin/manufacturers/${manufacturerId}/status`, { isClosed });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['manufacturers'] });
      queryClient.invalidateQueries({ queryKey: ['my-manufacturers'] });
      toast.success(variables.isClosed ? 'Производитель отмечен как закрытый' : 'Производитель снова открыт');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка: ${error.response?.data?.message || 'Не удалось обновить статус.'}`);
    },
  });
};