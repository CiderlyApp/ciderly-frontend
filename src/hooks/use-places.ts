// src/hooks/use-places.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';

// Тип для места
export type Place = {
  id: string;
  name: string;
  type: 'BAR' | 'SHOP' | 'RESTAURANT' | 'FESTIVAL' | 'OTHER';
  city: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  averageRating: number | null;
  createdAt: string;
};

// Хук для модерации (одобрения/отклонения)
export const useModeratePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ placeId, status, moderationComment }: { placeId: string, status: 'APPROVED' | 'REJECTED', moderationComment?: string }) => {
      const { data } = await api.patch(`/api/places/${placeId}/moderate`, { status, moderationComment });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      toast.success(`Место успешно ${variables.status === 'APPROVED' ? 'одобрено' : 'отклонено'}`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка модерации: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Хук для архивирования (удаления)
export const useArchivePlace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (placeId: string) => {
      return api.delete(`/api/places/${placeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      toast.success('Место успешно архивировано');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка архивации: ${error.response?.data?.message || error.message}`);
    },
  });
};

// --- НОВОЕ: Хук для получения одного места ---
export const useGetPlace = (placeId: string | null) => {
  return useQuery({
    queryKey: ['place', placeId],
    queryFn: async (): Promise<Place> => {
      if (!placeId) throw new Error("ID места не предоставлен");
      const { data } = await api.get(`/places/${placeId}`);
      return data.data;
    },
    enabled: !!placeId, // Запрос будет выполнен только если placeId существует
  });
};


// --- НОВОЕ: Хук для создания/обновления места ---
export const useCreateOrUpdatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (placeData: Partial<Place> & { id?: string }) => {
      const { id, ...payload } = placeData;
      if (id) {
        // Режим обновления
        const { data } = await api.patch(`/places/${id}`, payload);
        return data.data;
      } else {
        // Режим создания
        const { data } = await api.post('/places', payload);
        return data.data;
      }
    },
    onSuccess: (data, variables) => {
      const isUpdate = !!variables.id;
      // Инвалидируем и список мест, и конкретное место
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: ['place', variables.id] });
      toast.success(isUpdate ? 'Место успешно обновлено' : 'Место успешно создано');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Произошла ошибка.';
      toast.error(`Ошибка: ${errorMessage}`);
    },
  });
};