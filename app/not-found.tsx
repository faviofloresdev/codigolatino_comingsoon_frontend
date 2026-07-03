import { headers } from 'next/headers'
import { ErrorShell } from '@/components/error-shell'
import { resolveLocaleFromAcceptLanguage, translations } from '@/lib/i18n'

export default async function NotFound() {
  const acceptLanguage = (await headers()).get('accept-language')
  const locale = resolveLocaleFromAcceptLanguage(acceptLanguage)
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
