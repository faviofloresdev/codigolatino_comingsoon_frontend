'use client'

import Script from 'next/script'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const recaptchaAction = 'contact_form'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

type ContactFormProps = {
  locale: 'es' | 'en'
  mode?: 'contact' | 'project'
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submitButton: string
  submittingButton: string
  confirmationMessage: string
  errorMessage: string
  onSuccess?: () => void
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  const hasCountryCode = digits.startsWith('1')
  const nationalNumber = hasCountryCode ? digits.slice(1) : digits
  const areaCode = nationalNumber.slice(0, 3)
  const prefix = nationalNumber.slice(3, 6)
  const lineNumber = nationalNumber.slice(6, 10)

  let formattedNumber = areaCode ? `(${areaCode}` : ''

  if (areaCode.length === 3) {
    formattedNumber += ')'
  }

  if (prefix) {
    formattedNumber += ` ${prefix}`
  }

  if (lineNumber) {
    formattedNumber += `-${lineNumber}`
  }

  return hasCountryCode ? `+1${formattedNumber ? ` ${formattedNumber}` : ''}` : formattedNumber
}

export function ContactForm({
  locale,
  mode = 'contact',
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  messageLabel,
  messagePlaceholder,
  submitButton,
  submittingButton,
  confirmationMessage,
  errorMessage,
  onSuccess,
}: ContactFormProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [projectSummary, setProjectSummary] = useState('')
  const [name, setName] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (mode !== 'project') return

    try {
      const storedQuote = window.localStorage.getItem('codigo-latino-quote-v1')
      const storedBrief = window.localStorage.getItem('codigo-latino-brief-v2')
      if (!storedQuote && !storedBrief) return

      const quote = storedQuote ? JSON.parse(storedQuote) as {
        project?: string
        pages?: number
        design?: string
        features?: string[]
        extras?: string[]
        timing?: string
        maintenance?: boolean
        seoAnalysis?: boolean
        total?: number
        rangeLow?: number
        rangeHigh?: number
      } : {}
      const brief = storedBrief ? JSON.parse(storedBrief) as Record<string, string | string[]> : {}
      if (!quote.project && !brief.business) return

      const money = (value: number) => `US$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`
      const selectedItems = [...(quote.features || []), ...(quote.extras || [])]
      const list = (value: string | string[] | undefined) => Array.isArray(value) ? value.join(', ') : value || ''
      const summary = locale === 'es'
        ? [
            ...(quote.project && typeof quote.total === 'number' ? [
              'COTIZACIÓN INICIAL',
              `Proyecto: ${quote.project}`,
              `Páginas o vistas: ${quote.pages || 1}`,
              `Dirección visual: ${quote.design || 'Por definir'}`,
              `Funciones y adicionales: ${selectedItems.length ? selectedItems.join(', ') : 'Ninguno'}`,
              `Ritmo: ${quote.timing || 'Estándar'}`,
              `Hosting administrado: ${quote.maintenance ? 'Sí' : 'No'}`,
              `Análisis SEO continuo: ${quote.seoAnalysis ? 'Sí' : 'No'}`,
              `Inversión orientativa: ${money(quote.total)} (${money(quote.rangeLow || quote.total)} – ${money(quote.rangeHigh || quote.total)})`,
            ] : []),
            ...(brief.business ? [
              '',
              'BRIEF DEL PROYECTO',
              `Negocio: ${list(brief.business)}`,
              `Valores: ${list(brief.brandValues)}`,
              `Diferenciadores: ${list(brief.differentiators)}`,
              `Percepción deseada: ${list(brief.brandPerception)}`,
              `Audiencia: ${list(brief.audience)}`,
              `Objetivo: ${list(brief.objectiveLabel)}`,
              `Acción principal: ${list(brief.primaryActionLabel)}`,
              `Identidad: ${list(brief.brandAssetsLabel)}`,
              `Estilo visual: ${list(brief.visualStyle) || 'Por definir'}`,
              `Contenido: ${list(brief.contentStatusLabel)}`,
              `Publicación: ${list(brief.deadlineLabel)}`,
              `Requisitos: ${list(brief.requirements) || 'Por definir'}`,
            ] : []),
            '',
            'Quiero revisar este alcance y recibir una propuesta.',
          ]
        : [
            ...(quote.project && typeof quote.total === 'number' ? [
              'INITIAL ESTIMATE',
              `Project: ${quote.project}`,
              `Pages or views: ${quote.pages || 1}`,
              `Visual direction: ${quote.design || 'To be defined'}`,
              `Capabilities and add-ons: ${selectedItems.length ? selectedItems.join(', ') : 'None'}`,
              `Pace: ${quote.timing || 'Standard'}`,
              `Managed hosting: ${quote.maintenance ? 'Yes' : 'No'}`,
              `Ongoing SEO analysis: ${quote.seoAnalysis ? 'Yes' : 'No'}`,
              `Indicative investment: ${money(quote.total)} (${money(quote.rangeLow || quote.total)} – ${money(quote.rangeHigh || quote.total)})`,
            ] : []),
            ...(brief.business ? [
              '',
              'PROJECT BRIEF',
              `Business: ${list(brief.business)}`,
              `Values: ${list(brief.brandValues)}`,
              `Differentiators: ${list(brief.differentiators)}`,
              `Desired perception: ${list(brief.brandPerception)}`,
              `Audience: ${list(brief.audience)}`,
              `Objective: ${list(brief.objectiveLabel)}`,
              `Primary action: ${list(brief.primaryActionLabel)}`,
              `Identity: ${list(brief.brandAssetsLabel)}`,
              `Visual style: ${list(brief.visualStyle) || 'To be defined'}`,
              `Content: ${list(brief.contentStatusLabel)}`,
              `Launch: ${list(brief.deadlineLabel)}`,
              `Requirements: ${list(brief.requirements) || 'To be defined'}`,
            ] : []),
            '',
            'I would like to review this scope and receive a proposal.',
          ]

      setProjectSummary(summary.join('\n'))
    } catch {
      // Invalid local data should never block the contact form.
    }
  }, [locale, mode])

  async function getRecaptchaToken() {
    const recaptcha = window.grecaptcha
    if (!recaptchaSiteKey || !recaptcha) {
      throw new Error(
        locale === 'es'
          ? 'La protección anti-spam no está disponible. Inténtalo de nuevo en unos minutos.'
          : 'Spam protection is unavailable. Please try again in a few minutes.',
      )
    }

    return new Promise<string>((resolve, reject) => {
      recaptcha.ready(() => {
        recaptcha.execute(recaptchaSiteKey, { action: recaptchaAction }).then(resolve).catch(reject)
      })
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setStatus('idle')
      setErrorText('')

      const recaptchaToken = await getRecaptchaToken()

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: mode === 'project'
            ? `${projectSummary}\n\n${locale === 'es' ? 'COMENTARIO ADICIONAL' : 'ADDITIONAL NOTE'}\n${message.trim() || (locale === 'es' ? 'Sin comentarios adicionales.' : 'No additional notes.')}`
            : message,
          privacyAccepted,
          locale,
          kind: mode,
          recaptchaToken,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || 'Request failed')
      }

      setEmail('')
      setPhone('')
      setMessage('')
      setName('')
      setPrivacyAccepted(false)
      if (mode === 'project') {
        window.localStorage.removeItem('codigo-latino-quote-v1')
        window.localStorage.removeItem('codigo-latino-brief-v2')
      }
      setStatus('success')
      onSuccess?.()
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : errorMessage)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName =
    'w-full border border-[var(--brand-line)] bg-[var(--brand-primary)] px-4 py-4 text-sm text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-soft)] outline-none focus:border-[var(--brand-secondary)] focus:bg-[var(--brand-primary)] focus:ring-4 focus:ring-[color:color-mix(in_srgb,var(--brand-secondary)_12%,transparent)] sm:text-base'

  return (
    <div className="w-full">
      {recaptchaSiteKey ? (
        <Script
          src={`https://www.recaptcha.net/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-4">
        {mode === 'project' ? (
          <div className="space-y-2">
            <label htmlFor="project-name" className="brand-kicker">
              {locale === 'es' ? 'Nombre y apellido' : 'Full name'}
            </label>
            <input
              id="project-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={locale === 'es' ? 'Tu nombre' : 'Your name'}
              autoComplete="name"
              className={inputClassName}
              required
            />
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="email" className="brand-kicker">
              {emailLabel}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status !== 'idle') {
                  setStatus('idle')
                }
              }}
              placeholder={emailPlaceholder}
              className={inputClassName}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="brand-kicker">
              {phoneLabel}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={17}
              autoComplete="tel"
              value={formatPhoneNumber(phone)}
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, '').slice(0, 11))
                if (status !== 'idle') {
                  setStatus('idle')
                }
              }}
              placeholder={phonePlaceholder}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="brand-kicker">
            {mode === 'project'
              ? (locale === 'es' ? 'Comentario adicional (opcional)' : 'Additional note (optional)')
              : messageLabel}
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value)
              if (status !== 'idle') {
                setStatus('idle')
              }
            }}
            placeholder={mode === 'project'
              ? (locale === 'es' ? 'Añade solo algo que no aparezca en el brief.' : 'Add only something not covered in the brief.')
              : messagePlaceholder}
            className={`${inputClassName} min-h-44 resize-none`}
            required={mode === 'contact'}
            minLength={mode === 'contact' ? 3 : undefined}
          />
        </div>

        <label className="contact-privacy-consent">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(event) => setPrivacyAccepted(event.target.checked)}
            required
          />
          <span>
            {locale === 'es' ? 'He leído la ' : 'I have read the '}
            <Link href={`/${locale}/privacidad`} target="_blank">
              {locale === 'es' ? 'Política de privacidad' : 'Privacy policy'}
            </Link>
            {locale === 'es'
              ? ' y autorizo el tratamiento de mis datos para responder esta consulta.'
              : ' and authorize the processing of my data to respond to this inquiry.'}
          </span>
        </label>

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" disabled={isSubmitting} className="brand-button-primary disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting
              ? submittingButton
              : mode === 'project'
                ? (locale === 'es' ? 'Enviar información' : 'Submit information')
                : submitButton}
          </button>

          <p className="max-w-sm text-sm leading-6 text-[var(--brand-ink-soft)]">
            {mode === 'project'
              ? (locale === 'es'
                  ? 'Revisaremos la información y responderemos con el alcance final.'
                  : 'We will review the information and reply with the final scope.')
              : (locale === 'es'
                  ? 'Respondemos con una recomendación concreta sobre alcance y siguiente paso.'
                  : 'We reply with a concrete recommendation on scope and the next step.')}
          </p>
        </div>
      </form>

      {status === 'success' ? (
        <p className="mt-5 text-sm font-medium text-[var(--brand-success)]" role="status" aria-live="polite">
          {confirmationMessage}
        </p>
      ) : null}

      {status === 'error' ? (
        <p className="mt-5 text-sm font-medium text-[var(--brand-danger)]" role="alert">
          {errorText || errorMessage}
        </p>
      ) : null}
    </div>
  )
}
