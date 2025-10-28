// src/app/admin/users/user-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/types/entities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateUserProfileByAdmin } from '@/hooks/use-users';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Схема валидации для формы
const formSchema = z.object({
  nickname: z.string().min(3, { message: "Никнейм должен быть не менее 3 символов." }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  gender: z.enum(['male', 'female', '']).optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData: User;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const { mutate: updateUser, isPending } = useUpdateUserProfileByAdmin();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: initialData.nickname || '',
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      bio: initialData.bio || '',
      city: initialData.city || '',
      country: initialData.country || '',
      gender: initialData.gender || '',
    },
  });

  const onSubmit = (values: UserFormValues) => {
    // Преобразуем пустую строку в null для поля gender
    const payload = {
      ...values,
      gender: values.gender === '' ? null : values.gender,
    };
    
    updateUser({ id: initialData.id, ...payload }, {
      onSuccess: () => {
        toast.success(`Профиль пользователя ${initialData.nickname} обновлен.`);
        router.push('/admin/users');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="nickname" render={({ field }) => (
            <FormItem><FormLabel>Никнейм</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem><FormLabel>Пол</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Не указан" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="">Не указан</SelectItem>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                </SelectContent>
              </Select>
            <FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>Имя</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Фамилия</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem><FormLabel>Страна</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>Город</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <FormField control={form.control} name="bio" render={({ field }) => (
            <FormItem><FormLabel>О себе</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Отмена</Button>
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
        </div>
      </form>
    </Form>
  );
}