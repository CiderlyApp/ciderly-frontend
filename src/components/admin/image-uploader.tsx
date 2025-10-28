// src/components/admin/image-uploader.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useS3Upload, UploadType } from '@/hooks/use-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { getFileUrlFromKey } from '@/lib/utils';

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onUploadComplete: (fileKey: string) => void;
  uploadType: UploadType;
}

export function ImageUploader({ currentImageUrl, onUploadComplete, uploadType }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const { uploadFile, isPending } = useS3Upload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Показываем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    }; 
    reader.readAsDataURL(file);
    
    // Загружаем файл
    const fileKey = await uploadFile(file, uploadType);
    onUploadComplete(fileKey);
    setPreview(getFileUrlFromKey(fileKey));

  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUploadComplete(''); // Передаем пустую строку, чтобы форма могла обработать удаление
  }

  return (
    <div className="space-y-4">
      <Label>Изображение</Label>
      <div className="relative w-48 h-48 rounded-md border-2 border-dashed border-muted-foreground/50 flex items-center justify-center overflow-hidden">
        {isPending ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : preview ? (
          <>
            <Image src={preview} alt="Превью" layout="fill" objectFit="cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center">
            <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Нажмите для загрузки</p>
          </div>
        )}
        <Input
          type="file"
          id="image-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          disabled={isPending}
        />
      </div>
    </div>
  );
}