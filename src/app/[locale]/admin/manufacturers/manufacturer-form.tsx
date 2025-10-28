// src/app/admin/manufacturers/manufacturer-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Manufacturer } from '@/types/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateOrUpdateManufacturer } from '@/hooks/use-manufacturers';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUploader } from '@/components/admin/image-uploader';
import { WorkingHoursInput } from '@/components/admin/working-hours-input';

type DirectoryItem = { id: number | string; name: string };

// Обновленная схема валидации
const formSchema = z.object({
  name: z.string().min(2, "Название обязательно."),
  countryId: z.string().min(1, "Страна обязательна."),
  regionId: z.string().min(1, "Регион обязателен."),
  city: z.string().optional(),
  address: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).transform(v => v === '' ? null : Number(v)).nullable(),
  longitude: z.union([z.string(), z.number()]).transform(v => v === '' ? null : Number(v)).nullable(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  servesFood: z.boolean().default(false),
  servesByGlass: z.boolean().default(false),
  offersTastings: z.boolean().default(false),
  outdoorSeating: z.boolean().default(false),
  workingHours: z.any().optional(),
});

type ManufacturerFormValues = z.infer<typeof formSchema>;

export function ManufacturerForm({ initialData }: { initialData?: Manufacturer | null }) {
  const router = useRouter();
  const { mutate: saveManufacturer, isPending } = useCreateOrUpdateManufacturer();

  const form = useForm<ManufacturerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      countryId: initialData?.countryId?.toString() || undefined,
      regionId: initialData?.regionId?.toString() || undefined,
      city: initialData?.city || '',
      address: initialData?.address || '',
      latitude: initialData?.latitude ?? '',
      longitude: initialData?.longitude ?? '',
      website: initialData?.website || '',
      phone: initialData?.phone || '',
      description: initialData?.description || '',
      logoUrl: initialData?.logoUrl || '',
      servesFood: initialData?.servesFood || false,
      servesByGlass: initialData?.servesByGlass || false,
      offersTastings: initialData?.offersTastings || false,
      outdoorSeating: initialData?.outdoorSeating || false,
      workingHours: initialData?.workingHours || {},
    },
  });

  const selectedCountryId = form.watch('countryId');
  const { data: countries, isLoading: isLoadingCountries } = useQuery<DirectoryItem[]>({ queryKey: ['countries'], queryFn: async () => (await api.get('/countries')).data.data });
  const { data: regions, isLoading: isLoadingRegions } = useQuery<DirectoryItem[]>({ queryKey: ['regions', selectedCountryId], queryFn: async () => (await api.get(`/regions?countryId=${selectedCountryId}`)).data.data, enabled: !!selectedCountryId });

  const onSubmit = (values: ManufacturerFormValues) => {
    saveManufacturer({ 
      id: initialData?.id, 
      ...values,
      countryId: Number(values.countryId),
      regionId: Number(values.regionId)
    }, {
      onSuccess: () => router.push('/admin/manufacturers')
    });
  };

  const getFileUrlFromKey = (key: string) => {
    if (!key) return '';
    const baseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;
    return `${baseUrl}/${key}`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Название</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoadingCountries ? <Skeleton className="h-10 w-full" /> : ( <FormField control={form.control} name="countryId" render={({ field }) => ( <FormItem><FormLabel>Страна</FormLabel><Select onValueChange={(value) => { field.onChange(value); form.resetField('regionId'); }} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите страну" /></SelectTrigger></FormControl><SelectContent>{countries?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} /> )}
              {isLoadingRegions || !selectedCountryId ? <Skeleton className="h-10 w-full" /> : ( <FormField control={form.control} name="regionId" render={({ field }) => ( <FormItem><FormLabel>Регион</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Выберите регион" /></SelectTrigger></FormControl><SelectContent>{regions?.map(r => <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} /> )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormLabel>Город</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Адрес</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
            </div>

            {/* Координаты. В будущем здесь будет карта. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="latitude" render={({ field }) => ( <FormItem><FormLabel>Широта</FormLabel><FormControl><Input type="number" step="any" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="longitude" render={({ field }) => ( <FormItem><FormLabel>Долгота</FormLabel><FormControl><Input type="number" step="any" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="website" render={({ field }) => ( <FormItem><FormLabel>Веб-сайт</FormLabel><FormControl><Input placeholder="https://example.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Телефон</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Описание</FormLabel><FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} />
          </div>
          
          <div className="md:col-span-1">
            <FormField control={form.control} name="logoUrl" render={({ field }) => ( <FormItem><FormControl><ImageUploader currentImageUrl={field.value} onUploadComplete={(fileKey) => field.onChange(getFileUrlFromKey(fileKey))} uploadType="manufacturerLogo" /></FormControl><FormMessage /></FormItem> )} />
          </div>
        </div>

        <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-md font-medium">Опции (для дегустационного зала)</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="servesFood" render={({ field }) => ( <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Есть еда</FormLabel></FormItem> )} />
                <FormField control={form.control} name="servesByGlass" render={({ field }) => ( <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Наливают по бокалам</FormLabel></FormItem> )} />
                <FormField control={form.control} name="offersTastings" render={({ field }) => ( <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Есть дегустации</FormLabel></FormItem> )} />
                <FormField control={form.control} name="outdoorSeating" render={({ field }) => ( <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Есть веранда</FormLabel></FormItem> )} />
            </div>
        </div>

        <FormField control={form.control} name="workingHours" render={({ field }) => ( <FormItem><FormLabel>Часы работы</FormLabel><FormControl><WorkingHoursInput {...field} /></FormControl><FormMessage /></FormItem> )} />

        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Отмена</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Сохранение...' : (initialData ? 'Сохранить' : 'Создать')}</Button>
        </div>
      </form>
    </Form>
  );
}