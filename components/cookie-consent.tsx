'use client'

import { Analytics } from '@vercel/analytics/next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Locale } from '@/lib/i18n'

const consentStorageKey = 'codigo-latino-consent-v2'
export const cookiePreferencesEvent = 'codigo-latino:open-cookie-preferences'

type StoredConsent = {
  version: 2
  necessary: true
  analytics: boolean
  updatedAt: string
}

const consentCopy = {
  es: {
    label: 'Tu privacidad',
    title: 'Cookies claras, sin letra pequeña.',
    description:
      'Usamos almacenamiento necesario para recordar tus preferencias y reCAPTCHA para proteger el formulario. La analítica anónima solo se activa si la autorizas.',
    necessaryOnly: 'Solo necesarias',
    acceptAll: 'Aceptar todas',
    configure: 'Configurar',
    save: 'Guardar preferencias',
    close: 'Cerrar preferencias',
    necessaryTitle: 'Necesarias',
    necessaryDescription: 'Seguridad, funcionamiento del formulario y memoria de tu elección. Siempre activas.',
    analyticsTitle: 'Analítica',
    analyticsDescription: 'Medición agregada y sin cookies de terceros mediante Vercel Web Analytics.',
    alwaysActive: 'Siempre activas',
    privacy: 'Privacidad',
    cookies: 'Política de cookies',
  },
  en: {
    label: 'Your privacy',
    title: 'Clear cookies, no fine print.',
    description:
      'We use necessary storage to remember your preferences and reCAPTCHA to protect the form. Anonymous analytics is enabled only with your permission.',
    necessaryOnly: 'Necessary only',
    acceptAll: 'Accept all',
    configure: 'Configure',
    save: 'Save preferences',
    close: 'Close preferences',
    necessaryTitle: 'Necessary',
    necessaryDescription: 'Security, form operation and storage of your choice. Always active.',
    analyticsTitle: 'Analytics',
    analyticsDescription: 'Aggregated measurement without third-party cookies through Vercel Web Analytics.',
    alwaysActive: 'Always active',
    privacy: 'Privacy',
    cookies: 'Cookie policy',
  },
} as const

function readStoredConsent(): StoredConsent | null {
  try {
    const storedValue = window.localStorage.getItem(consentStorageKey)
    if (!storedValue) {
      return null
    }

    const parsedValue = JSON.parse(storedValue) as Partial<StoredConsent>
    if (parsedValue.version !== 2 || parsedValue.necessary !== true || typeof parsedValue.analytics !== 'boolean') {
      return null
    }

    return parsedValue as StoredConsent
  } catch {
    return null
  }
}

export function CookieConsent({ locale }: { locale: Locale }) {
  const copy = consentCopy[locale]
  const [consent, setConsent] = useState<StoredConsent | null | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    const storedConsent = readStoredConsent()
    setConsent(storedConsent)
    setAnalyticsEnabled(storedConsent?.analytics ?? false)
    setIsOpen(storedConsent === null)

    const openPreferences = () => {
      const currentConsent = readStoredConsent()
      setAnalyticsEnabled(currentConsent?.analytics ?? false)
      setShowDetails(true)
      setIsOpen(true)
    }

    window.addEventListener(cookiePreferencesEvent, openPreferences)
    return () => window.removeEventListener(cookiePreferencesEvent, openPreferences)
  }, [])

  function saveConsent(analytics: boolean) {
    const nextConsent: StoredConsent = {
      version: 2,
      necessary: true,
      analytics,
      updatedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(consentStorageKey, JSON.stringify(nextConsent))
    setConsent(nextConsent)
    setAnalyticsEnabled(analytics)
    setIsOpen(false)
    setShowDetails(false)
  }

  return (
    <>
      {process.env.NODE_ENV === 'production' && consent?.analytics ? <Analytics /> : null}

      {isOpen ? (
        <div
          className="cookie-consent-layer"
          data-mode={showDetails ? 'preferences' : 'notice'}
          role={showDetails ? 'dialog' : 'region'}
          aria-modal={showDetails ? true : undefined}
          aria-label={copy.label}
        >
          <div className="cookie-consent-panel">
            {consent ? (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cookie-consent-close"
                aria-label={copy.close}
              >
                <X size={18} aria-hidden="true" />
              </button>
            ) : null}

            <div className="cookie-consent-intro">
              <p className="editorial-label">{copy.label}</p>
              <h2 className="brand-display">{copy.title}</h2>
              <p>{copy.description}</p>
              <div className="cookie-policy-links">
                <Link href={`/${locale}/privacidad`}>{copy.privacy}</Link>
                <Link href={`/${locale}/cookies`}>{copy.cookies}</Link>
              </div>
            </div>

            {showDetails ? (
              <div className="cookie-category-list">
                <div className="cookie-category-row">
                  <div>
                    <strong>{copy.necessaryTitle}</strong>
                    <p>{copy.necessaryDescription}</p>
                  </div>
                  <span>{copy.alwaysActive}</span>
                </div>

                <label className="cookie-category-row cookie-category-toggle">
                  <div>
                    <strong>{copy.analyticsTitle}</strong>
                    <p>{copy.analyticsDescription}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                  />
                </label>
              </div>
            ) : null}

            <div className="cookie-consent-actions">
              {showDetails ? (
                <button type="button" onClick={() => saveConsent(analyticsEnabled)} className="brand-button-primary">
                  {copy.save}
                </button>
              ) : (
                <button type="button" onClick={() => setShowDetails(true)} className="brand-button-secondary">
                  {copy.configure}
                </button>
              )}
              <button type="button" onClick={() => saveConsent(false)} className="cookie-text-button">
                {copy.necessaryOnly}
              </button>
              <button type="button" onClick={() => saveConsent(true)} className="brand-button-accent">
                {copy.acceptAll}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export function CookiePreferencesButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      className="footer-link text-left"
      onClick={() => window.dispatchEvent(new Event(cookiePreferencesEvent))}
    >
      {locale === 'es' ? 'Preferencias de cookies' : 'Cookie preferences'}
    </button>
  )
}
