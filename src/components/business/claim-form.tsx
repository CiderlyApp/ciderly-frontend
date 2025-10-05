'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from '@/hooks/use-debounce';
import { useCheckEmail, useGetEntitiesDirectory, useCreateClaim } from '@/hooks/use-business';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// --- ИСПРАВЛЕНИЕ: Добавлен импорт FormDescription ---
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  hasAccount: z.boolean(),
  existingUserEmail: z.string().optional(),
  claimType: z.enum(['new', 'existing']),
  entityType: z.enum(['MANUFACTURER', 'PLACE']),
  
  // Поля для существующей сущности
  entityId: z.string().optional(),
  
  // Общие поля для новой сущности
  name: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  
  // Поля для нового производителя
  manufacturerCity: z.string().optional(),
  manufacturerCountryId: z.string().optional(),
  manufacturerRegionId: z.string().optional(),

  // Поля для нового места
  placeType: z.enum(['BAR', 'SHOP', 'RESTAURANT', 'FESTIVAL', 'OTHER']).optional(),
  placeAddress: z.string().optional(),
  placeCity: z.string().optional(),
  placeCountryId: z.string().optional(),
  placeRegionId: z.string().optional(),

  // Поля для доказательства
  message: z.string().min(10, { message: 'Пожалуйста, предоставьте больше информации.' }),
});

export function ClaimBusinessForm() {
  const [hasAccount, setHasAccount] = useState(false);
  const [claimType, setClaimType] = useState<'new' | 'existing'>('new');
  const [entityType, setEntityType] = useState<'MANUFACTURER' | 'PLACE'>('MANUFACTURER');
  const [emailToValidate, setEmailToValidate] = useState('');
  const debouncedEmail = useDebounce(emailToValidate, 500);

  const { data: emailCheck, isLoading: isEmailChecking, isError: isEmailError } = useCheckEmail(debouncedEmail);
  const { data: entities, isLoading: isLoadingEntities } = useGetEntitiesDirectory(entityType);
  const { mutate: createClaim, isPending } = useCreateClaim();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasAccount: false,
      claimType: 'new',
      entityType: 'MANUFACTURER',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    let payload: any = {
      entityType: values.entityType,
      message: values.message,
    };
    if (values.hasAccount) {
      payload.existingUserEmail = values.existingUserEmail;
    }

    if (values.claimType === 'existing') {
      payload.entityId = values.entityId;
    } else {
      payload.entityData = {
        name: values.name,
        description: values.description,
        website: values.website,
      };
      if (values.entityType === 'MANUFACTURER') {
        payload.entityData.city = values.manufacturerCity;
        payload.entityData.countryId = Number(values.manufacturerCountryId);
        payload.entityData.regionId = Number(values.manufacturerRegionId);
      } else {
        payload.entityData.type = values.placeType;
        payload.entityData.address = values.placeAddress;
        payload.entityData.city = values.placeCity;
        payload.entityData.countryId = Number(values.placeCountryId);
        payload.entityData.regionId = Number(values.placeRegionId);
      }
    }
    
    createClaim(payload, { onSuccess: () => form.reset() });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Блок аккаунта */}
        <div className="flex items-center space-x-2">
          <Controller name="hasAccount" control={form.control} render={({ field }) => (
              // --- ИСПРАВЛЕНИЕ: Добавлен тип для 'checked' ---
              <Checkbox id="hasAccount" checked={field.value} onCheckedChange={(checked: boolean | 'indeterminate') => {
                field.onChange(checked);
                setHasAccount(!!checked);
              }} />
          )} />
          <label htmlFor="hasAccount" className="text-sm font-medium">У меня уже есть аккаунт в Ciderly</label>
        </div>

        {hasAccount && (
          <FormField control={form.control} name="existingUserEmail" render={({ field }) => (
            <FormItem>
              <FormLabel>Email вашего аккаунта</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="user@example.com" {...field} onChange={(e) => {
                    field.onChange(e);
                    setEmailToValidate(e.target.value);
                  }} />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isEmailChecking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {!isEmailChecking && debouncedEmail && emailCheck?.exists && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {!isEmailChecking && debouncedEmail && (!emailCheck?.exists || isEmailError) && <XCircle className="h-4 w-4 text-destructive" />}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        )}
        
        <Separator />

        {/* Выбор типа заявки и сущности */}
        <div className="grid md:grid-cols-2 gap-6">
          <FormField control={form.control} name="claimType" render={({ field }) => (
            <FormItem>
                <FormLabel>Тип заявки</FormLabel>
                <Select onValueChange={(value) => { field.onChange(value); setClaimType(value as any); }} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="new">Добавить новый объект</SelectItem>
                        <SelectItem value="existing">Получить права на существующий</SelectItem>
                    </SelectContent>
                </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="entityType" render={({ field }) => (
            <FormItem>
                <FormLabel>Тип объекта</FormLabel>
                <Select onValueChange={(value) => { field.onChange(value); setEntityType(value as any); }} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="MANUFACTURER">Производитель / Сидрерия</SelectItem>
                        <SelectItem value="PLACE">Место (Бар, Магазин и т.д.)</SelectItem>
                    </SelectContent>
                </Select>
            </FormItem>
          )} />
        </div>
        
        <Separator />

        {/* Динамическая часть формы */}
        {claimType === 'existing' ? (
            <FormField control={form.control} name="entityId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Выберите существующий объект</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger disabled={isLoadingEntities}>
                            <SelectValue placeholder={isLoadingEntities ? "Загрузка..." : `Выберите ${entityType === 'MANUFACTURER' ? 'производителя' : 'место'}`} />
                        </SelectTrigger></FormControl>
                        <SelectContent>
                            {entities?.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </FormItem>
            )} />
        ) : (
            // Форма для нового объекта
            <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Информация о новом объекте</h3>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Название</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                {entityType === 'MANUFACTURER' ? (
                  <>
                    <FormField control={form.control} name="manufacturerCity" render={({ field }) => (
                      <FormItem><FormLabel>Город</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {/* TODO: Заменить на Select с загрузкой стран/регионов */}
                    <FormField control={form.control} name="manufacturerCountryId" render={({ field }) => (
                      <FormItem><FormLabel>ID Страны (временно)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="manufacturerRegionId" render={({ field }) => (
                      <FormItem><FormLabel>ID Региона (временно)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </>
                ) : (
                  <>
                     <FormField control={form.control} name="placeType" render={({ field }) => (
                        <FormItem><FormLabel>Тип места</FormLabel>
                          <Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="BAR">Бар</SelectItem>
                              <SelectItem value="SHOP">Магазин</SelectItem>
                              <SelectItem value="RESTAURANT">Ресторан</SelectItem>
                              <SelectItem value="OTHER">Другое</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="placeAddress" render={({ field }) => (
                        <FormItem><FormLabel>Адрес</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                  </>
                )}
                 <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Описание</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="website" render={({ field }) => (
                  <FormItem><FormLabel>Веб-сайт</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        )}

        <Separator />
        
        {/* Поля для доказательств */}
        <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">Подтверждение</h3>
            <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem>
                    <FormLabel>Сообщение для модератора</FormLabel>
                    <FormDescription>Опишите, на каком основании вы представляете этот объект, и приложите ссылки на подтверждающие документы, если это необходимо.</FormDescription>
                    <FormControl><Textarea rows={5} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            {/* TODO: Добавить загрузчик для файлов-доказательств */}
             <div className="space-y-2">
                <Label>Прикрепить файлы</Label>
                <Input type="file" multiple disabled />
                <p className="text-sm text-muted-foreground">Загрузка файлов будет доступна в ближайшее время.</p>
            </div>
        </div>

        <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Отправить заявку
        </Button>
      </form>
    </Form>
  );
}