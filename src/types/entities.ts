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
  // Добавьте сюда другие поля, если они понадобятся, например, для формы редактирования
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  // ... и так далее
};

// Перенесем сюда и другие типы для чистоты
export type User = {
  id: string
  nickname: string
  email: string
  role: 'user' | 'moderator' | 'business' | 'admin'
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