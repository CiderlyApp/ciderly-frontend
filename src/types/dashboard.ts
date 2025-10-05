// src/types/dashboard.ts

/**
 * Тип данных для виджетов ключевых метрик (KPIs) на дашборде администратора.
 * Соответствует ответу от GET /api/admin/dashboard/stats
 */
export interface AdminDashboardStats {
  totalUsers: number;
  newUsersLast30Days: number;
  usersByRole: {
    user: number;
    business: number;
    moderator: number;
    admin: number;
    [key: string]: number; // Для гибкости, если появятся новые роли
  };
  totalApprovedCiders: number;
  totalReviews: number;
  totalApprovedPlaces: number;
  totalManufacturers: number;
  moderationQueue: {
    claims: number;
    ciders: number;
    places: number;
  };
}

/**
 * Тип данных для одной точки на графике активности.
 * Используется в ответе от GET /api/admin/dashboard/activity-chart
 */
export interface ActivityChartDataPoint {
  day: string; // Формат "YYYY-MM-DD"
  newUsers: number;
  newReviews: number;
}

/**
 * Тип данных для сводной статистики на дашборде бизнес-пользователя.
 * Соответствует ответу от GET /api/business/dashboard/summary
 */
export interface BusinessDashboardSummary {
  totalSubscribers: number;
  totalCiders: number;
  averageCiderRating: number | null;
  // subscriberChangeLast30Days: number; // Можно добавить в V2
}

/**
 * Тип данных для детальной статистики по одной сущности (производителю).
 * Используется в ответе от GET /api/business/dashboard/entity/:entityId
 */
export interface BusinessEntityDetails {
  entityType: 'MANUFACTURER' | 'PLACE';
  entityId: string;
  name: string;
  subscribersCount: number;
  
  // Поля, специфичные для производителя
  cidersCount?: number;
  topCiders?: {
    id: string;
    name: string;
    averageRating: number | null;
  }[];
  latestReviews?: {
    id: string;
    ciderName: string;
    reviewText: string;
    rating: number;
  }[];
  
  // Поля, специфичные для места (добавить при необходимости)
  // ...
}

/**
 * Тип данных для аналитики аудитории конкретного сидра.
 * Соответствует ответу от GET /api/business/dashboard/ciders/:ciderId/analytics
 */
export interface CiderAudienceAnalytics {
  reviewCount: number;
  averageRating: number | null;
  topTags: {
    tag: string;
    count: number;
  }[];
}

// Тип для одного тега в списке топ-тегов
export interface TopTag {
  tag: string;
  count: number;
}

// Тип для данных аналитики сидра
export interface CiderAnalyticsData {
  reviewCount: number;
  averageRating: number | null;
  topTags: TopTag[];
}

// Тип для ключевых метрик администратора
export interface AdminStats {
  totalUsers: number;
  newUsersLast30Days: number;
  usersByRole: Record<string, number>;
  totalApprovedCiders: number;
  totalReviews: number;
  totalApprovedPlaces: number;
  totalManufacturers: number;
  moderationQueue: {
    claims: number;
    ciders: number;
    places: number;
  };
}

// Тип для данных графика активности
export interface ActivityChartDataPoint {
    day: string; // 'YYYY-MM-DD'
    newUsers: number;
    newReviews: number;
}