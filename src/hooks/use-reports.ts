// src/hooks/use-reports.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';

// Тип для жалобы
export interface Report {
  id: string;
  reviewId: string;
  reviewType: 'CIDER' | 'PLACE' | 'MANUFACTURER';
  reporterUserId: string;
  reporterNickname: string;
  reason: 'SPAM' | 'OFFENSIVE' | 'HATE_SPEECH' | 'IRRELEVANT' | 'OTHER';
  comment?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  processedBy?: string;
  processorNickname?: string;
  processedAt?: string;
  createdAt: string;
}

// --- ИСПРАВЛЕНО ---
// Определяем конкретную структуру для объекта пагинации
interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

interface ReportsApiResponse {
  reports: Report[];
  pagination: PaginationInfo; // <-- Используем новый, более строгий тип
}

// Хук для получения списка жалоб
export const useGetReports = (status: string) => {
  return useQuery<ReportsApiResponse>({
    queryKey: ['reports', status],
    queryFn: async () => {
      const { data } = await api.get(`/admin/reports?status=${status}`);
      return data;
    },
  });
};

// Хук для обработки жалобы
export const useProcessReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reportId, action }: { reportId: string, action: 'RESOLVED' | 'DISMISSED' }) => {
      const { data } = await api.patch(`/admin/reports/${reportId}`, { action });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success(`Жалоба успешно обработана (статус: ${variables.action})`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка: ${error.response?.data?.message || 'Не удалось обработать жалобу.'}`);
    },
  });
};