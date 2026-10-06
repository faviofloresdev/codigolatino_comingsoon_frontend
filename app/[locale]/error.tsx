'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ErrorShell } from '@/components/error-shell'
import { Locale, isLocale, translations } from '@/lib/i18n'

interface LocaleErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LocaleError({ error, reset }: LocaleErrorProps) {
  const params = useParams<{ locale?: string }>()
  const locale: Locale = isLocale(params?.locale) ? params.locale : 'es'
  const t = translations[locale]

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorShell
      badge={t.errorBadge}
      code="500"
      title={t.errorTitle}
      description={t.errorDescription}
      homeHref={`/${locale}`}
      homeLabel={t.backHome}
      secondaryAction={
        <>
          <button
            type="button"
            onClick={reset}
            className="brand-button-secondary min-w-44"
          >
            {t.retryButton}
          </button>
          {locale === 'es' ? (
            <Link href="/en" className="text-sm font-medium text-[var(--brand-ink-soft)] transition hover:text-[var(--brand-ink)]">
              English
            </Link>
          ) : (
            <Link href="/es" className="text-sm font-medium text-[var(--brand-ink-soft)] transition hover:text-[var(--brand-ink)]">
              Español
            </Link>
          )}
        </>
      }
    />
  )
}
