'use client'

import { useState } from 'react'

type ContactFormProps = {
  locale: 'es' | 'en'
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
}

export function ContactForm({
  locale,
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
}: ContactFormProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setStatus('idle')
      setErrorText('')

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          message,
          locale,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || 'Request failed')
      }

      setEmail('')
      setPhone('')
      setMessage('')
      setStatus('success')
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : errorMessage)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mb-12 flex w-full max-w-xl flex-col items-center gap-3">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <label htmlFor="email" className="sr-only">
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
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 sm:text-base"
        />

        <label htmlFor="phone" className="sr-only">
          {phoneLabel}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value)
            if (status !== 'idle') {
              setStatus('idle')
            }
          }}
          placeholder={phonePlaceholder}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 sm:text-base"
        />

        <label htmlFor="message" className="sr-only">
          {messageLabel}
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
          placeholder={messagePlaceholder}
          className="min-h-32 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 sm:text-base"
          required
          minLength={3}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
        >
          {isSubmitting ? submittingButton : submitButton}
        </button>
      </form>

      {status === 'success' ? (
        <p className="text-sm font-medium text-emerald-300" role="status" aria-live="polite">
          {confirmationMessage}
        </p>
      ) : null}

      {status === 'error' ? (
        <p className="text-sm font-medium text-rose-300" role="alert">
          {errorText || errorMessage}
        </p>
      ) : null}
    </div>
  )
}
