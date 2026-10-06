import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { defaultLocale, isLocale, translations } from '@/lib/i18n'
import { buildPageMetadata, getOrganizationSchema } from '@/lib/seo'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale
  const t = translations[locale]

  return buildPageMetadata({ locale, title: t.metaTitle, description: t.metaDescription })
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) {
    notFound()
  }

  const locale = routeLocale

  const organizationSchema = getOrganizationSchema(locale)

  return (
    <section lang={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
      />
      {children}
    </section>
  )
}
