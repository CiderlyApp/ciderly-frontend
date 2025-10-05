import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

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

// Мутация для создания заявки
export const useCreateClaim = () => {
    return useMutation({
        mutationFn: async (claimData: any) => {
            const { data } = await api.post('/claims/request', claimData);
            return data;
        },
        onSuccess: () => {
            toast.success('Заявка успешно отправлена!', {
                description: 'Мы рассмотрим ее в ближайшее время и свяжемся с вами.',
            });
        },
        onError: (error: any) => {
            toast.error('Ошибка при отправке заявки', {
                description: error.response?.data?.message || 'Пожалуйста, попробуйте снова.',
            });
        },
    });
};