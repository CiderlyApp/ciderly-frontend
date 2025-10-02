// src/hooks/use-claims.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios'; 
import { ApiErrorResponse } from '@/types/api';
// ... тип Claim  ...
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
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success(variables.action === 'approve' ? 'Заявка успешно одобрена' : 'Заявка успешно отклонена');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Не удалось обработать заявку.';
      toast.error(`Ошибка: ${errorMessage}`);
    }
  });
};