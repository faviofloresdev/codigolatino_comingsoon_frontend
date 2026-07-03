'use client'

import { useState } from 'react'

type ContactFormProps = {
  contactLabel: string
  contactPlaceholder: string
  submitButton: string
  confirmationMessage: string
}

export function ContactForm({
  contactLabel,
  contactPlaceholder,
  submitButton,
  confirmationMessage,
}: ContactFormProps) {
  const [contact, setContact] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShowConfirmation(true)
    setContact('')
  }

  return (
    <div className="mx-auto mb-12 flex w-full max-w-xl flex-col items-center gap-3">
      <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-4 sm:flex-row">
        <label htmlFor="contact" className="sr-only">
          {contactLabel}
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          value={contact}
          onChange={(event) => {
            setContact(event.target.value)
            if (showConfirmation) {
              setShowConfirmation(false)
            }
          }}
          placeholder={contactPlaceholder}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 sm:text-base"
          required
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 sm:text-base"
        >
          {submitButton}
        </button>
      </form>

      {showConfirmation ? (
        <p className="text-sm font-medium text-emerald-300" role="status" aria-live="polite">
          {confirmationMessage}
        </p>
      ) : null}
    </div>
  )
}
