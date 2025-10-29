// src/types/entities.ts

// 1. Определяем строгие типы для часов работы, чтобы избавиться от 'any'
type DayWorkingHours = {
  status: 'open' | 'closed';
  open?: string;
  close?: string;
};

type WorkingHours = {
  monday?: DayWorkingHours;
  tuesday?: DayWorkingHours;
  wednesday?: DayWorkingHours;
  thursday?: DayWorkingHours;
  friday?: DayWorkingHours;
  saturday?: DayWorkingHours;
  sunday?: DayWorkingHours;
};


// 2. Обновляем типы сущностей, используя новый тип WorkingHours
export type Place = {
  id: string;
  name: string;
  type: 'BAR' | 'SHOP' | 'RESTAURANT' | 'FESTIVAL' | 'OTHER';
  city: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  averageRating: number | null;
  createdAt: string;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  countryId?: number | null;
  regionId?: number | null;
  serves_food?: boolean;
  serves_by_glass?: boolean;
  offers_tastings?: boolean;
  outdoor_seating?: boolean;
  workingHours?: WorkingHours; // <-- ИСПРАВЛЕНО
  imageUrl?: string | null; // <-- Добавлено поле, которое используется в формах
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
  isClosed?: boolean;
  address?: string | null;
  street?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  servesFood?: boolean;
  servesByGlass?: boolean;
  offersTastings?: boolean;
  outdoorSeating?: boolean;
  workingHours?: WorkingHours | null; // <-- ИСПРАВЛЕНО
};

// 3. Дополняем тип User полями, которые используются в UserForm
export type User = {
  id: string;
  nickname: string;
  email: string;
  role: 'user' | 'moderator' | 'business' | 'admin' | 'blogger';
  isBlocked: boolean;
  createdAt: string;
  // Добавленные поля из формы редактирования профиля
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  city?: string | null;
  country?: string | null;
  gender?: 'male' | 'female' | null;
};

// Остальные типы остаются без изменений, так как они уже корректны
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
  style?: string | null;
  imageUrl?: string | null;
  tags?: string[] | null;
  tasteProfile?: {
    sugar: number;
    acidity: number;
    tannin: number;
    carbonation: number;
    body: number;
  } | null;
};

export type BusinessReview = {
  id: string;
  userId: string;
  userNickname: string;
  userAvatarUrl: string | null;
  ratingValue: number;
  commentText: string | null;
  createdAt: string;
  reviewType: 'CIDER' | 'PLACE' | 'MANUFACTURER';
  subjectName: string; // Название сидра или места/производителя
};