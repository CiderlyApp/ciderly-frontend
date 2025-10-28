// src/hooks/use-reviews.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';

// --- ИЗМЕНЕНИЕ: Все поля теперь в camelCase ---
export interface ModerationReview {
  id: string;
  reviewType: 'CIDER' | 'PLACE' | 'MANUFACTURER';
  commentText: string | null;
  rating: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  userNickname: string;
  entityName: string;
}

interface ReviewsApiResponse {
  reviews: ModerationReview[];
  pagination: { totalPages: number; /* ... */ };
}

export const useGetReviewsForModeration = (status: string) => {
  return useQuery<ReviewsApiResponse>({
    queryKey: ['moderation-reviews', status],
    queryFn: async () => {
      const { data } = await api.get(`/admin/reviews?status=${status}`);
      return data; // Axios вернет уже сконвертированные данные
    },
  });
};

export const useModerateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, reviewType, status, moderationComment }: { 
      reviewId: string; 
      reviewType: ModerationReview['reviewType']; 
      status: 'APPROVED' | 'REJECTED';
      moderationComment?: string;
    }) => {
      const { data } = await api.patch(`/admin/reviews/${reviewType}/${reviewId}`, { status, moderationComment });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moderation-reviews'] });
      toast.success(`Отзыв успешно ${variables.status === 'APPROVED' ? 'одобрен' : 'отклонен'}.`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(`Ошибка: ${error.response?.data?.message || 'Не удалось модерировать отзыв.'}`);
    },
  });
};