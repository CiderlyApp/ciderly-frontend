// src/types/api.ts

// Тип для стандартной ошибки, которую возвращает ваш бэкенд
export interface ApiErrorResponse {
  status: 'error';
  errorCode: string;
  message: string;
}