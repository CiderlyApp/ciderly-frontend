import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {// 1. Для продакшена (когда URL будет https://ciderly.app/media/...)
      
        protocol: 'https',
        hostname: 'ciderly.app',
        port: '',
        pathname: '/media/**',
      },
      // 2. Для локальной разработки (когда URL http://localhost:8081/media/...)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
        pathname: '/media/**',
      },
      // 3. Для локальной разработки (когда URL http://127.0.0.1:8081/media/...)
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8081', // <-- ВОТ ПРАВИЛЬНЫЙ ПОРТ ДЛЯ NGINX
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
