// src/lib/api.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Указываем базовый URL вашего API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена в каждый запрос
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor для обработки ответа (обновление токена)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Если ошибка 401 и это не повторный запрос после обновления токена
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Если нет refresh токена, перенаправляем на логин
        window.location.href = '/login'; 
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        // Очищаем хранилище и перенаправляем на логин
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default api;