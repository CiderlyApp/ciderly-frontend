import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // !!! ВАЖНО: Замените это на ваш настоящий домен, когда сайт будет в сети
  const baseUrl = 'https://ciderly.app' 

 
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/app`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
  
  // Здесь в будущем можно будет добавлять динамические страницы (например, посты из блога)
  // const dynamicRoutes = ...

  return staticRoutes;
}