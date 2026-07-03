'use client'

import { useParams } from 'next/navigation'
import { ErrorShell } from '@/components/error-shell'
import { Locale, defaultLocale, isLocale, translations } from '@/lib/i18n'

export default function LocaleNotFound() {
  const params = useParams<{ locale?: string }>()
  const locale: Locale = isLocale(params?.locale) ? params.locale : defaultLocale
  const t = translations[locale]

  return (
    <ErrorShell
      badge={t.notFoundBadge}
      code="404"
      title={t.notFoundTitle}
      description={t.notFoundDescription}
      homeHref={`/${locale}`}
      homeLabel={t.backHome}
    />
  )
}
