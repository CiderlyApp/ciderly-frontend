// src/app/admin/places/place-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Place } from '@/types/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateOrUpdatePlace } from '@/hooks/use-places';
import { useRouter } from 'next/navigation';

// Схема валидации
const formSchema = z.object({
  name: z.string().min(2, { message: "Название должно быть не менее 2 символов." }),
  type: z.enum(['BAR', 'SHOP', 'RESTAURANT', 'FESTIVAL', 'OTHER']),
  address: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).refine(val => val === '' || !isNaN(Number(val)), {
    message: "Должно быть числом",
  }).refine(val => val === '' || (Number(val) >= -90 && Number(val) <= 90), {
    message: "Широта должна быть от -90 до 90",
  }),
  longitude: z.union([z.string(), z.number()]).refine(val => val === '' || !isNaN(Number(val)), {
    message: "Должно быть числом",
  }).refine(val => val === '' || (Number(val) >= -180 && Number(val) <= 180), {
    message: "Долгота должна быть от -180 до 180",
  }),
});

type PlaceFormValues = z.infer<typeof formSchema>;

interface PlaceFormProps {
  initialData?: Place | null;
}

export function PlaceForm({ initialData }: PlaceFormProps) {
  const router = useRouter();
  const { mutate: savePlace, isPending } = useCreateOrUpdatePlace();

  const isEditMode = !!initialData;
  
  const form = useForm<PlaceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'BAR',
      address: initialData?.address || '',
      city: initialData?.city || '',
      description: initialData?.description || '',
      latitude: initialData?.latitude?.toString() ?? '',
      longitude: initialData?.longitude?.toString() ?? '',
    },
  });

  const onSubmit = (values: PlaceFormValues) => {
    const payload = {
      id: initialData?.id,
      ...values,
      address: values.address || null,
      city: values.city || null,
      description: values.description || null,
      latitude: values.latitude === '' ? null : Number(values.latitude),
      longitude: values.longitude === '' ? null : Number(values.longitude),
    };
    
    savePlace(payload, {
      onSuccess: () => {
        router.push('/admin/places');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Название места" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип места" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BAR">Бар</SelectItem>
                  <SelectItem value="SHOP">Магазин</SelectItem>
                  <SelectItem value="RESTAURANT">Ресторан</SelectItem>
                  <SelectItem value="FESTIVAL">Фестиваль</SelectItem>
                  <SelectItem value="OTHER">Другое</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                <FormLabel>Город</FormLabel>
                <FormControl><Input placeholder="Москва" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                <FormLabel>Адрес</FormLabel>
                <FormControl><Input placeholder="ул. Пушкина, д. Колотушкина" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
        </div>
        
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
            <FormLabel>Описание</FormLabel>
            <FormControl><Textarea placeholder="Краткое описание места..." {...field} /></FormControl>
            <FormMessage />
            </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="latitude" render={({ field }) => (
                <FormItem>
                <FormLabel>Широта</FormLabel>
                <FormControl><Input type="number" step="any" placeholder="55.7558" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="longitude" render={({ field }) => (
                <FormItem>
                <FormLabel>Долгота</FormLabel>
                {/* --- ИСПРАВЛЕНИЕ: Убраны лишние скобки и опечатки --- */}
                <FormControl><Input type="number" step="any" placeholder="37.6173" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )} />
        </div>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Отмена</Button>
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Создать место')}
            </Button>
        </div>
      </form>
    </Form>
  );
}