// src/types/entities.ts

// Тип, который мы переносим
export type Place = {
  id: string;
  name: string;
  type: 'BAR' | 'SHOP' | 'RESTAURANT' | 'FESTIVAL' | 'OTHER';
  city: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  averageRating: number | null;
  createdAt: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

// ИСПРАВЛЕНО: Тип User теперь является единственным источником правды.
export type User = {
  id: string
  nickname: string
  email: string
  role: 'user' | 'moderator' | 'business' | 'admin' | 'blogger' // Добавлена роль blogger
  isBlocked: boolean
  createdAt: string
};

export type Claim = {
  id: string;
  userId: string;
  userNickname: string;
  entityType: 'PLACE' | 'MANUFACTURER';
  entityId: string;
  entityName: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment: string | null;
  createdAt: string;
};

export type Manufacturer = {
  id: string;
  name: string;
  city: string | null;
  countryName: string | null;
  regionName?: string | null;
  subscribersCount?: number;
  createdAt?: string;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  regionId?: number;
  countryId?: number;
};

export type Cider = {
  id: string;
  name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  type: string;
  manufacturerName: string;
  manufacturerId?: string;
  countryId?: number;
  regionId?: number;
  abv?: number | null;
  description?: string | null;
};