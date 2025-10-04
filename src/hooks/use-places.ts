// src/hooks/use-places.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
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