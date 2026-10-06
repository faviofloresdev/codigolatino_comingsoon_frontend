import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.codigolatino.studio'
export const siteName = 'Código Latino'

const localeSettings = {
  es: { openGraph: 'es_ES', alternate: 'en_US' },
  en: { openGraph: 'en_US', alternate: 'es_ES' },
} as const

type PageMetadataOptions = {
  locale: Locale
  path?: string
  title: string
  description: string
  index?: boolean
}

function localizedPath(locale: Locale, path: string) {
  return `/${locale}${path}`
}

export function buildPageMetadata({
  locale,
  path = '',
  title,
  description,
  index = true,
}: PageMetadataOptions): Metadata {
  const currentPath = localizedPath(locale, path)
  const settings = localeSettings[locale]

  return {
    title,
    description,
    alternates: {
      canonical: currentPath,
      languages: {
        es: localizedPath('es', path),
        en: localizedPath('en', path),
        'x-default': localizedPath('es', path),
      },
    },
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url: currentPath,
      locale: settings.openGraph,
      alternateLocale: settings.alternate,
      images: [
        {
          url: '/services-digital-product.jpg',
          alt: locale === 'es'
            ? 'Código Latino, estudio digital para marcas en crecimiento'
            : 'Codigo Latino, digital studio for growing brands',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/services-digital-product.jpg'],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true, nocache: true },
  }
}

export function getOrganizationSchema(locale: Locale) {
  const inLanguage = locale === 'es' ? 'es' : 'en'
  const description = locale === 'es'
    ? 'Estudio digital de desarrollo web, aplicaciones, branding y hosting administrado.'
    : 'Digital studio for web development, applications, branding and managed hosting.'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/mask.png`,
        description,
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description,
        inLanguage,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  }
}
