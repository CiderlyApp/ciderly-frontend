// src/app/[locale]/admin/places/place-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Place } from '@/types/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateOrUpdatePlace } from '@/hooks/use-places';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkingHoursInput } from '@/components/admin/working-hours-input';
import { ImageUploader } from '@/components/admin/image-uploader';

type DirectoryItem = { id: number | string; name: string };

//  Без .default(), чтобы не ломать совместимость типов react-hook-form
const formSchema = z.object({
  name: z.string().min(2, "Название обязательно."),
  type: z.enum(['BAR', 'SHOP', 'RESTAURANT', 'FESTIVAL', 'OTHER']),
  address: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).optional(),
  longitude: z.union([z.string(), z.number()]).optional(),
  phone: z.string().optional(),
  website: z.string().url({ message: "Некорректный URL" }).optional().or(z.literal('')),
  email: z.string().email({ message: "Некорректный email" }).optional().or(z.literal('')),
  countryId: z.string().optional(),
  regionId: z.string().optional(),
  serves_food: z.boolean(),
  serves_by_glass: z.boolean(),
  offers_tastings: z.boolean(),
  outdoor_seating: z.boolean(),
  imageUrl: z.string().optional(),
  workingHours: z.record(z.string(), z.any()).optional(),
});

type PlaceFormValues = z.infer<typeof formSchema>;

export function PlaceForm({ initialData }: { initialData?: Place | null }) {
  const router = useRouter();
  const { mutate: savePlace, isPending } = useCreateOrUpdatePlace();
  const isEditMode = !!initialData;

  const form = useForm<PlaceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      type: initialData?.type ?? 'BAR',
      address: initialData?.address ?? '',
      city: initialData?.city ?? '',
      description: initialData?.description ?? '',
      latitude: initialData?.latitude?.toString() ?? '',
      longitude: initialData?.longitude?.toString() ?? '',
      phone: initialData?.phone ?? '',
      website: initialData?.website ?? '',
      email: initialData?.email ?? '',
      countryId: initialData?.countryId?.toString() ?? undefined,
      regionId: initialData?.regionId?.toString() ?? undefined,
      serves_food: initialData?.serves_food ?? false,
      serves_by_glass: initialData?.serves_by_glass ?? false,
      offers_tastings: initialData?.offers_tastings ?? false,
      outdoor_seating: initialData?.outdoor_seating ?? false,
      imageUrl: initialData?.imageUrl ?? '',
      workingHours: initialData?.workingHours ?? {},
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

  const onSubmit = (values: PlaceFormValues) => {
    const payload = {
      id: initialData?.id,
      ...values,
      countryId: values.countryId ? Number(values.countryId) : null,
      regionId: values.regionId ? Number(values.regionId) : null,
      latitude:
        values.latitude != null && values.latitude !== ''
          ? parseFloat(String(values.latitude))
          : null,
      longitude:
        values.longitude != null && values.longitude !== ''
          ? parseFloat(String(values.longitude))
          : null,
      address: values.address || null,
      city: values.city || null,
      description: values.description || null,
      phone: values.phone || null,
      website: values.website || null,
      email: values.email || null,
      imageUrl: values.imageUrl || null,
    };

    savePlace(payload, {
      onSuccess: () => router.push('/admin/places'),
    });
  };

  return (
    <Form {...form}>
      <form
        //  Типобезопасно, без any
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Город</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Координаты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Широта</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Долгота</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Контакты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Веб-сайт</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7..." {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@example.com" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Страна / регион */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoadingCountries ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Страна</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.resetField('regionId');
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите страну" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries?.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isLoadingRegions ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <FormField
                  control={form.control}
                  name="regionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Регион</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedCountryId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Сначала выберите страну" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions?.map((r) => (
                            <SelectItem key={r.id} value={r.id.toString()}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Опции */}
            <div className="space-y-4 rounded-md border p-4">
              <h3 className="text-md font-medium">Опции</h3>
              <div className="grid grid-cols-2 gap-4">
                {(['serves_food', 'serves_by_glass', 'offers_tastings', 'outdoor_seating'] as const).map(
                  (fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>
                            {{
                              serves_food: 'Есть еда',
                              serves_by_glass: 'Наливают по бокалам',
                              offers_tastings: 'Есть дегустации',
                              outdoor_seating: 'Есть веранда',
                            }[fieldName]}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Правая колонка (изображение) */}
          <div className="md:col-span-1 space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      currentImageUrl={field.value}
                      onUploadComplete={(fileKey) => field.onChange(fileKey)}
                      uploadType="placeImage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Часы работы */}
        <FormField
          control={form.control}
          name="workingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Часы работы</FormLabel>
              <FormControl>
                <WorkingHoursInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Кнопки */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Отмена
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Сохранение...' : isEditMode ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
