// src/app/admin/ciders/cider-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { Cider } from '@/types/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateOrUpdateCider } from '@/hooks/use-ciders';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// Типы для справочников
type DirectoryItem = { id: number | string; name: string };

const formSchema = z.object({
  name: z.string().min(2, { message: "Название обязательно." }),
  type: z.string().min(1, { message: "Тип обязателен." }),
  abv: z.any().optional(),
  manufacturerId: z.string().uuid({ message: "Выберите производителя." }),
  countryId: z.string().min(1, { message: "Выберите страну." }),
  regionId: z.string().min(1, { message: "Выберите регион." }),
  description: z.string().optional(),
});

type CiderFormValues = z.infer<typeof formSchema>;

interface CiderFormProps {
  initialData?: Cider | null;
}

export function CiderForm({ initialData }: CiderFormProps) {
  const router = useRouter();
  const { mutate: saveCider, isPending } = useCreateOrUpdateCider();
  // --- ИСПРАВЛЕНИЕ: Удаляем неиспользуемую переменную ---
  // const isEditMode = !!initialData;
  
  const form = useForm<CiderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || '',
      abv: initialData?.abv || '',
      manufacturerId: initialData?.manufacturerId || undefined,
      countryId: initialData?.countryId?.toString() || undefined,
      regionId: initialData?.regionId?.toString() || undefined,
      description: initialData?.description || '',
    },
  });

  const selectedCountryId = form.watch('countryId');

  const { data: countries, isLoading: isLoadingCountries } = useQuery<DirectoryItem[]>({
    queryKey: ['countries'],
    queryFn: async () => (await api.get('/countries')).data.data,
  });

  const { data: regions, isLoading: isLoadingRegions } = useQuery<DirectoryItem[]>({
    queryKey: ['regions', selectedCountryId],
    queryFn: async () => (await api.get(`/regions?countryId=${selectedCountryId}`)).data.data,
    enabled: !!selectedCountryId,
  });

  const { data: manufacturers, isLoading: isLoadingManufacturers } = useQuery<DirectoryItem[]>({
    queryKey: ['manufacturers-directory'],
    queryFn: async () => (await api.get('/manufacturers/directory')).data.data,
  });

  const onSubmit = (values: CiderFormValues) => {
    let abvValue: number | null = null;
    if (values.abv !== '' && values.abv !== undefined && values.abv !== null) {
        const parsedAbv = parseFloat(values.abv);
        if (!isNaN(parsedAbv)) {
            abvValue = parsedAbv;
        }
    }

    saveCider({
      id: initialData?.id,
      name: values.name,
      type: values.type,
      manufacturerId: values.manufacturerId,
      countryId: Number(values.countryId),
      regionId: Number(values.regionId),
      description: values.description,
      abv: abvValue,
    }, {
      onSuccess: () => router.push('/admin/ciders')
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Название</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem><FormLabel>Тип</FormLabel><FormControl><Input placeholder="Напр., Сухой" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {isLoadingManufacturers ? <Skeleton className="h-10 w-full" /> : (
            <FormField control={form.control} name="manufacturerId" render={({ field }) => (
                <FormItem><FormLabel>Производитель</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Выберите производителя" /></SelectTrigger></FormControl>
                    <SelectContent>{manufacturers?.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage /></FormItem>
            )} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoadingCountries ? <Skeleton className="h-10 w-full" /> : (
            <FormField control={form.control} name="countryId" render={({ field }) => (
                <FormItem><FormLabel>Страна</FormLabel>
                <Select onValueChange={(value) => { field.onChange(value); form.resetField('regionId'); }} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Выберите страну" /></SelectTrigger></FormControl>
                    <SelectContent>{countries?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage /></FormItem>
            )} />
          )}

          {isLoadingRegions || !selectedCountryId ? <Skeleton className="h-10 w-full" /> : (
            <FormField control={form.control} name="regionId" render={({ field }) => (
                <FormItem><FormLabel>Регион</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Выберите регион" /></SelectTrigger></FormControl>
                    <SelectContent>{regions?.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage /></FormItem>
            )} />
          )}
        </div>

        <FormField control={form.control} name="abv" render={({ field }) => (
            <FormItem><FormLabel>Крепость (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Описание</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Отмена</Button>
            {/* --- ИСПРАВЛЕНИЕ: Используем initialData напрямую для определения текста кнопки --- */}
            <Button type="submit" disabled={isPending}>{isPending ? 'Сохранение...' : (!!initialData ? 'Сохранить' : 'Создать')}</Button>
        </div>
      </form>
    </Form>
  );
}