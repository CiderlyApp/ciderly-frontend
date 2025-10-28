// src/hooks/use-dashboard.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AdminStats, CiderAnalyticsData, ActivityChartDataPoint} from '@/types/dashboard'; // Добавляем BusinessReview
import { Cider, BusinessReview  } from '@/types/entities';

// Тип для ответа по сущностям, которыми владеет пользователь
type OwnedEntity = {
  id: string;
  name: string;
  entityType: 'PLACE' | 'MANUFACTURER';
};

// --- Хуки для Администратора ---

export const useGetAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => (await api.get('/dashboard/admin/stats')).data,
    staleTime: 1000 * 60 * 5, // Кэшируем на 5 минут
  });
};

export const useGetAdminActivityChart = () => {
  return useQuery<ActivityChartDataPoint[]>({
    queryKey: ['admin-activity-chart'],
    queryFn: async () => (await api.get('/dashboard/admin/activity-chart')).data,
    staleTime: 1000 * 60 * 5, // Кэшируем на 5 минут
  });
};

// --- Хуки для Бизнеса ---

export const useGetOwnedEntities = () => {
  return useQuery<OwnedEntity[]>({
    queryKey: ['my-owned-entities'],
    queryFn: async () => (await api.get('/entities/owned')).data.data,
  });
};

export const useGetManufacturerCiders = (manufacturerId: string | null) => {
  return useQuery<Cider[]>({
    queryKey: ['manufacturer-ciders', manufacturerId],
    queryFn: async () => {
      if (!manufacturerId) return []; // Добавляем защиту от null
      const { data } = await api.get(`/manufacturers/${manufacturerId}/ciders`);
      return data.ciders; // Эндпоинт возвращает { ciders: [], pagination: {} }
    },
    enabled: !!manufacturerId,
  });
};

export const useGetCiderAnalytics = (ciderId: string | null, filters: { gender: string; ageRange: string }) => {
  return useQuery<CiderAnalyticsData>({
    queryKey: ['cider-analytics', ciderId, filters],
    queryFn: async () => {
      if (!ciderId) throw new Error('Cider ID is required'); // Улучшаем обработку null
      const params = new URLSearchParams();
      if (filters.gender && filters.gender !== 'all') params.append('gender', filters.gender);
      if (filters.ageRange && filters.ageRange !== 'all') params.append('ageRange', filters.ageRange);
      
      const { data } = await api.get(`/dashboard/business/ciders/${ciderId}/analytics?${params.toString()}`);
      return data;
    },
    enabled: !!ciderId,
    staleTime: 1000 * 60, // Кэшируем на 1 минуту
  });
};

// --- Хук для отзывов бизнеса ---
export const useGetBusinessReviews = (entity: { id: string; type: 'PLACE' | 'MANUFACTURER' } | null) => {
  return useQuery<BusinessReview[]>({
    queryKey: ['business-reviews', entity?.id],
    queryFn: async () => {
      if (!entity) return [];
      const endpoint = entity.type === 'MANUFACTURER'
        ? `/business/manufacturers/${entity.id}/reviews`
        : `/business/places/${entity.id}/reviews`; // Исправляем синтаксис шаблонных строк
      const { data } = await api.get(endpoint);
      return data.data;
    },
    enabled: !!entity,
    staleTime: 1000 * 60, // Добавляем staleTime для консистентности
  });
};