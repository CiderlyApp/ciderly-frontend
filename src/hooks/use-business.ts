// src/hooks/use-business.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

// Проверка email (без изменений)
export const useCheckEmail = (email: string) => {
  return useQuery({
    queryKey: ['checkEmail', email],
    queryFn: async () => {
      const { data } = await api.get(`/auth/check-email/${email}`);
      return data.data as { exists: boolean };
    },
    enabled: !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    staleTime: Infinity,
    retry: 1,
  });
};

// Получение списка сущностей для клейма (без изменений)
export const useGetEntitiesDirectory = (entityType: 'MANUFACTURER' | 'PLACE') => {
    return useQuery({
        queryKey: ['entitiesDirectory', entityType],
        queryFn: async () => {
            const endpoint = entityType === 'MANUFACTURER' ? '/manufacturers/directory' : '/places/directory';
            const { data } = await api.get(endpoint);
            return data as { id: string; name: string }[];
        },
        staleTime: 5 * 60 * 1000,
    });
};

// --- ИЗМЕНЕНИЕ: Тип для данных заявки обновлен ---
export interface ClaimPayload {
  email: string; // <-- Email теперь обязательное поле
  entityType: 'MANUFACTURER' | 'PLACE';
  message: string;
  entityId?: string;
  entityData?: {
    name?: string;
    description?: string;
    website?: string;
    city?: string;
    countryId?: number;
    regionId?: number;
    type?: 'BAR' | 'SHOP' | 'RESTAURANT' | 'FESTIVAL' | 'OTHER';
    address?: string;
  };
}

// Мутация для создания заявки (без изменений)
export const useCreateClaim = () => {
    return useMutation({
        mutationFn: async (claimData: ClaimPayload) => {
            const { data } = await api.post('/claims/request', claimData);
            return data;
        },
        onSuccess: () => {
            toast.success('Заявка успешно отправлена!', {
                description: 'Мы рассмотрим ее в ближайшее время и свяжемся с вами.',
            });
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error('Ошибка при отправке заявки', {
                description: error.response?.data?.message || 'Пожалуйста, попробуйте снова.',
            });
        },
    });
};