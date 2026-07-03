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
            className="inline-flex min-w-44 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
          >
            {t.retryButton}
          </button>
          {locale === 'es' ? (
            <Link href="/en" className="text-sm text-zinc-500 transition hover:text-zinc-300">
              English
            </Link>
          ) : (
            <Link href="/es" className="text-sm text-zinc-500 transition hover:text-zinc-300">
              Espanol
            </Link>
          )}
        </>
      }
    />
  )
}
