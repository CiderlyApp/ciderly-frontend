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
  workingHours?: any; // Оставляем any для сложного объекта
};

export type User = {
  id: string
  nickname: string
  email: string
  role: 'user' | 'moderator' | 'business' | 'admin' | 'blogger' 
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
  workingHours?: any | null; 
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