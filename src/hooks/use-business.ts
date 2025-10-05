import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

// Проверка email
export const useCheckEmail = (email: string) => {
  return useQuery({
    queryKey: ['checkEmail', email],
    queryFn: async () => {
      const { data } = await api.get(`/auth/check-email/${email}`);
      return data.data as { exists: boolean };
    },
    enabled: !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), // Только для валидных email
    staleTime: Infinity,
    retry: 1,
  });
};

// Получение списка сущностей для клейма
export const useGetEntitiesDirectory = (entityType: 'MANUFACTURER' | 'PLACE') => {
    return useQuery({
        queryKey: ['entitiesDirectory', entityType],
        queryFn: async () => {
            const endpoint = entityType === 'MANUFACTURER' ? '/manufacturers' : '/places';
            const { data } = await api.get(endpoint, { params: { limit: 1000 } }); // Получаем большой список
            return data.data as { id: string; name: string }[];
        },
        staleTime: 5 * 60 * 1000, // 5 минут
    });
};

// --- ИСПРАВЛЕНИЕ: Добавлен строгий тип для данных заявки ---
export interface ClaimPayload {
  entityType: 'MANUFACTURER' | 'PLACE';
  message: string;
  existingUserEmail?: string;
  entityId?: string;
  entityData?: {
    name?: string;
    description?: string;
    website?: string;
    // Поля производителя
    city?: string;
    countryId?: number;
    regionId?: number;
    // Поля места
    type?: 'BAR' | 'SHOP' | 'RESTAURANT' | 'FESTIVAL' | 'OTHER';
    address?: string;
  };
}


// Мутация для создания заявки
export const useCreateClaim = () => {
    return useMutation({
        // --- ИСПРАВЛЕНИЕ: Использован тип ClaimPayload вместо any ---
        mutationFn: async (claimData: ClaimPayload) => {
            const { data } = await api.post('/claims/request', claimData);
            return data;
        },
        onSuccess: () => {
            toast.success('Заявка успешно отправлена!', {
                description: 'Мы рассмотрим ее в ближайшее время и свяжемся с вами.',
            });
        },
        // --- ИСПРАВЛЕНИЕ: Добавлен тип для ошибки ---
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error('Ошибка при отправке заявки', {
                description: error.response?.data?.message || 'Пожалуйста, попробуйте снова.',
            });
        },
    });
};