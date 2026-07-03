import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { defaultLocale, isLocale, translations } from '@/lib/i18n'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale
  const t = translations[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) {
    notFound()
  }

  const locale = routeLocale

  return <section lang={locale}>{children}</section>
}
