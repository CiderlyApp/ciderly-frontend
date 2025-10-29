// src/hooks/use-upload.ts
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import axios from 'axios';
import { toast } from 'sonner';

export type UploadType = 'avatar' | 'manufacturerLogo' | 'ciderImage' | 'reviewImage'| 'placeImage';

// Хук для получения presigned URL
const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: async ({ file, type }: { file: File, type: UploadType }) => {
      const endpointMap = {
        avatar: '/upload/avatar-url',
        manufacturerLogo: '/upload/manufacturer-logo-url',
        ciderImage: '/upload/cider-image-url',
        reviewImage: '/upload/review-image-url',
        placeImage: '/upload/place-image-url',
      };
      
      const params = new URLSearchParams({
        filename: file.name,
        contentType: file.type,
      });

      const { data } = await api.get(`${endpointMap[type]}?${params.toString()}`);
      return data as { uploadUrl: string; fileKey: string };
    },
  });
};

// Хук для загрузки файла напрямую в S3
export const useS3Upload = () => {
  const getPresignedUrlMutation = useGetPresignedUrl();

  const uploadFile = async (file: File, type: UploadType): Promise<string> => {
    try {
      // 1. Получаем presigned URL
      const { uploadUrl, fileKey } = await getPresignedUrlMutation.mutateAsync({ file, type });

      // 2. Загружаем файл по этому URL
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });
      
      toast.success("Изображение успешно загружено.");
      return fileKey; // Возвращаем ключ для сохранения в БД
      
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Ошибка загрузки изображения.");
      throw error;
    }
  };

  return {
    uploadFile,
    isPending: getPresignedUrlMutation.isPending,
  };
};