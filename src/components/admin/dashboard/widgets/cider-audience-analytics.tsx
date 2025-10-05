// src/components/admin/dashboard/cider-audience-analytics.tsx
'use client';
import { useState } from 'react';
import { useGetCiderAnalytics } from '@/hooks/use-dashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { TopTag } from '@/types/dashboard'; // <-- Импортируем тип

interface CiderAnalyticsProps {
  ciderId: string;
}

export function CiderAudienceAnalytics({ ciderId }: CiderAnalyticsProps) {
  const [gender, setGender] = useState('all');
  const [ageRange, setAgeRange] = useState('all');

  const { data, isLoading } = useGetCiderAnalytics(ciderId, { gender, ageRange });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Фильтры */}
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Пол" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="male">Мужчины</SelectItem>
            <SelectItem value="female">Женщины</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ageRange} onValueChange={setAgeRange}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Возраст" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="18-24">18-24</SelectItem>
            <SelectItem value="25-34">25-34</SelectItem>
            <SelectItem value="35-44">35-44</SelectItem>
            <SelectItem value="45-55">45-55</SelectItem>
            <SelectItem value="56-100">56+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : data ? (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Оценок</p>
            <p className="text-2xl font-bold">{data.reviewCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Средний рейтинг</p>
            <p className="text-2xl font-bold">{data.averageRating?.toFixed(2) ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Топ теги</p>
            <ul className="text-sm">
              {/* --- ИСПРАВЛЕНИЕ: Добавляем явный тип для 't' --- */}
              {data.topTags.map((t: TopTag) => (
                <li key={t.tag}>{t.tag} ({t.count})</li>
              ))}
            </ul>
          </div>
        </div>
      ) : <p>Нет данных для отображения.</p>}
    </div>
  );
}