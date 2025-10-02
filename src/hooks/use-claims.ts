// src/hooks/use-claims.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

// Тип для заявки (чтобы использовать в компонентах)
export type Claim = {
  id: string;
  userId: string;
  userNickname: string;
  entityType: 'PLACE' | 'MANUFACTURER';
  entityId: string;
  entityName: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment: string | null;
  createdAt: string;
};

// Хук для обработки (одобрения/отклонения) заявки
export const useProcessClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ claimId, action, adminComment }: { claimId: string, action: 'approve' | 'reject', adminComment?: string }) => {
      const endpoint = `/admin/claims/${claimId}/${action}`;
      const payload = adminComment ? { adminComment } : {};
      const { data } = await api.patch(endpoint, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      // Инвалидируем кэш заявок, чтобы таблица обновилась
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success(variables.action === 'approve' ? 'Заявка успешно одобрена' : 'Заявка успешно отклонена');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Не удалось обработать заявку.';
      toast.error(`Ошибка: ${errorMessage}`);
    }
  });
};