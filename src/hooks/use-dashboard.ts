// src/hooks/use-dashboard.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AdminStats, CiderAnalyticsData, ActivityChartDataPoint } from '@/types/dashboard'; 
import { Cider } from '@/types/entities';

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
      staleTime: 1000 * 60 * 5,
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
            const { data } = await api.get(`/manufacturers/${manufacturerId}/ciders`);
            return data.ciders; // Эндпоинт возвращает { ciders: [], pagination: {} }
        },
        enabled: !!manufacturerId,
    });
};

export const useGetCiderAnalytics = (ciderId: string | null, filters: { gender: string, ageRange: string }) => {
    return useQuery<CiderAnalyticsData>({
        queryKey: ['cider-analytics', ciderId, filters],
        queryFn: async () => {
            if (!ciderId) return null;
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