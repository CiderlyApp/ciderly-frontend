// src/app/admin/ciders/cider-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

import { Cider } from '@/types/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateOrUpdateCider } from '@/hooks/use-ciders';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUploader } from '@/components/admin/image-uploader';
import { Slider } from '@/components/ui/slider';

type DirectoryItem = { id: number | string; name: string };

const formSchema = z.object({
  name: z.string().min(2, "Название обязательно."),
  type: z.string().min(1, "Тип обязателен."),
  style: z.string().optional(),
  abv: z.any().optional(),
  manufacturerId: z.string().uuid({ message: "Выберите производителя." }),
  countryId: z.string().min(1, "Выберите страну."),
  regionId: z.string().min(1, "Выберите регион."),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.string().optional(),
  // --- ИЗМЕНЕНИЕ: tasteProfile теперь не .default(), а .optional() для соответствия ---
  tasteProfile: z.object({
    sugar: z.number().min(0).max(10),
    acidity: z.number().min(0).max(10),
    tannin: z.number().min(0).max(10),
    carbonation: z.number().min(0).max(10),
    body: z.number().min(0).max(10),
  }).optional(),
});

type CiderFormValues = z.infer<typeof formSchema>;

export function CiderForm({ initialData }: { initialData?: Cider | null }) {
  const router = useRouter();
  const { mutate: saveCider, isPending } = useCreateOrUpdateCider();
  
  const form = useForm<CiderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || '',
      style: initialData?.style || '',
      abv: initialData?.abv ?? '',
      manufacturerId: initialData?.manufacturerId || undefined,
      countryId: initialData?.countryId?.toString() || undefined,
      regionId: initialData?.regionId?.toString() || undefined,
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '',
      tags: initialData?.tags?.join(', ') || '',
      // --- ИЗМЕНЕНИЕ: Безопасно устанавливаем tasteProfile ---
      tasteProfile: initialData?.tasteProfile || { sugar: 5, acidity: 5, tannin: 5, carbonation: 5, body: 5 },
    },
  });

  const selectedCountryId = form.watch('countryId');

  const { data: countries, isLoading: isLoadingCountries } = useQuery<DirectoryItem[]>({ queryKey: ['countries'], queryFn: async () => (await api.get('/countries')).data.data });
  const { data: regions, isLoading: isLoadingRegions } = useQuery<DirectoryItem[]>({ queryKey: ['regions', selectedCountryId], queryFn: async () => (await api.get(`/regions?countryId=${selectedCountryId}`)).data.data, enabled: !!selectedCountryId });
  const { data: manufacturers, isLoading: isLoadingManufacturers } = useQuery<DirectoryItem[]>({ queryKey: ['manufacturers-directory'], queryFn: async () => (await api.get('/manufacturers/directory')).data });

  const onSubmit = (values: CiderFormValues) => {
    let abvValue: number | null = null;
    if (values.abv !== '' && values.abv !== undefined && values.abv !== null) {
        const parsedAbv = parseFloat(String(values.abv).replace(',', '.'));
        if (!isNaN(parsedAbv)) abvValue = parsedAbv;
    }
    
    const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    saveCider({
      id: initialData?.id,
      name: values.name,
      type: values.type,
      style: values.style,
      manufacturerId: values.manufacturerId,
      countryId: Number(values.countryId),
      regionId: Number(values.regionId),
      description: values.description,
      abv: abvValue,
      imageUrl: values.imageUrl,
      tags: tagsArray,
      tasteProfile: values.tasteProfile,
    }, {
      onSuccess: () => router.push('/admin/ciders')
    });
  };
  
  const getFileUrlFromKey = (key: string) => {
    if (!key) return '';
    const baseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || 'https://ciderly.app/media';
    return `${baseUrl}/${key}`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Название</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="type" render={({ field }) => ( <FormItem><FormLabel>Тип</FormLabel><FormControl><Input placeholder="Напр., Сухой" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="style" render={({ field }) => ( <FormItem><FormLabel>Стиль</FormLabel><FormControl><Input placeholder="Напр., Английский" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )}/>
                </div>
                {isLoadingManufacturers ? <Skeleton className="h-10 w-full" /> : ( <FormField control={form.control} name="manufacturerId" render={({ field }) => ( <FormItem><FormLabel>Производитель</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите производителя" /></SelectTrigger></FormControl><SelectContent>{manufacturers?.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} /> )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoadingCountries ? <Skeleton className="h-10 w-full" /> : ( <FormField control={form.control} name="countryId" render={({ field }) => ( <FormItem><FormLabel>Страна</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.resetField('regionId'); }} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите страну" /></SelectTrigger></FormControl><SelectContent>{countries?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} /> )}
                    {isLoadingRegions || !selectedCountryId ? <Skeleton className="h-10 w-full" /> : ( <FormField control={form.control} name="regionId" render={({ field }) => ( <FormItem><FormLabel>Регион</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите регион" /></SelectTrigger></FormControl><SelectContent>{regions?.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} /> )}
                </div>
                <FormField control={form.control} name="abv" render={({ field }) => ( <FormItem><FormLabel>Крепость (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                <FormField control={form.control} name="tags" render={({ field }) => ( <FormItem><FormLabel>Теги</FormLabel><FormControl><Input {...field} value={field.value ?? ''}/></FormControl><FormDescription>Введите теги через запятую</FormDescription><FormMessage /></FormItem> )}/>
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Описание</FormLabel><FormControl><Textarea {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem> )}/>
            </div>
            <div className="md:col-span-1 space-y-6">
                <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem><FormControl><ImageUploader currentImageUrl={field.value} onUploadComplete={(fileKey) => field.onChange(getFileUrlFromKey(fileKey))} uploadType="ciderImage" /></FormControl><FormMessage /></FormItem> )} />
            </div>
        </div>
        <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-md font-medium">Вкусовой профиль (официальный)</h3>
            {(['sugar', 'acidity', 'tannin', 'carbonation', 'body'] as const).map(prop => (
                <FormField key={prop} control={form.control} name={`tasteProfile.${prop}`} render={({ field }) => (
                    <FormItem>
                        <FormLabel className="capitalize">{prop} ({field.value})</FormLabel>
                        <FormControl>
                            <Slider
                                defaultValue={[field.value]}
                                onValueChange={(value: number[]) => field.onChange(value[0])}
                                max={10} step={0.5}
                            />
                        </FormControl>
                    </FormItem>
                )} />
            ))}
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Отмена</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Сохранение...' : (initialData ? 'Сохранить' : 'Создать')}</Button>
        </div>
      </form>
    </Form>
  );
}