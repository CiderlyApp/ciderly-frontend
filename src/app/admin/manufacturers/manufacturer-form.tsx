// src/app/admin/manufacturers/manufacturer-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Manufacturer } from '@/types/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateOrUpdateManufacturer } from '@/hooks/use-manufacturers';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: "Название должно быть не менее 2 символов." }),
  city: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url({ message: "Пожалуйста, введите корректный URL." }).optional().or(z.literal('')),
  // countryId и regionId пока не добавляем в UI, чтобы не усложнять
});

type ManufacturerFormValues = z.infer<typeof formSchema>;

interface ManufacturerFormProps {
  initialData?: Manufacturer | null;
}

export function ManufacturerForm({ initialData }: ManufacturerFormProps) {
  const router = useRouter();
  const { mutate: saveManufacturer, isPending } = useCreateOrUpdateManufacturer();
  const isEditMode = !!initialData;
  
  const form = useForm<ManufacturerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      city: initialData?.city || '',
      description: initialData?.description || '',
      website: initialData?.website || '',
    },
  });

  const onSubmit = (values: ManufacturerFormValues) => {
    saveManufacturer({ id: initialData?.id, ...values }, {
      onSuccess: () => router.push('/admin/manufacturers')
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Название</FormLabel>
            <FormControl><Input placeholder="Название производителя" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem>
            <FormLabel>Город</FormLabel>
            <FormControl><Input placeholder="Город" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="website" render={({ field }) => (
          <FormItem>
            <FormLabel>Веб-сайт</FormLabel>
            <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Описание</FormLabel>
            <FormControl><Textarea placeholder="Краткое описание..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Отмена</Button>
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Сохранение...' : (isEditMode ? 'Сохранить' : 'Создать')}
            </Button>
        </div>
      </form>
    </Form>
  );
}