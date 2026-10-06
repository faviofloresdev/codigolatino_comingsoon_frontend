import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/seo'

const publicRoutes = ['', '/servicios', '/calculadora', '/contacto', '/privacidad', '/cookies']

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.flatMap((path) => locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
    priority: path === '' ? 1 : path === '/servicios' ? 0.9 : path === '/contacto' ? 0.8 : 0.7,
    alternates: {
      languages: {
        es: `${siteUrl}/es${path}`,
        en: `${siteUrl}/en${path}`,
      },
    },
  })))
}
