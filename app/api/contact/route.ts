import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const contactToEmail = process.env.CONTACT_TO_EMAIL
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || 'Codigo Latino <onboarding@resend.dev>'
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY
const recaptchaAction = 'contact_form'
const configuredMinScore = Number(process.env.RECAPTCHA_MIN_SCORE || '0.5')
const recaptchaMinScore = Number.isFinite(configuredMinScore) ? configuredMinScore : 0.5

type ContactPayload = {
  name?: string
  email?: string
  phone?: string
  message?: string
  locale?: 'es' | 'en'
  recaptchaToken?: string
  privacyAccepted?: boolean
  kind?: 'contact' | 'project'
}

type RecaptchaVerification = {
  success: boolean
  score?: number
  action?: string
  hostname?: string
  'error-codes'?: string[]
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string) {
  return /^(?:\d{10}|1\d{10})$/.test(phone)
}

function getErrorMessage(
  locale: 'es' | 'en',
  key: 'missing_contact' | 'invalid_name' | 'invalid_email' | 'invalid_phone' | 'invalid_message' | 'privacy_required' | 'recaptcha_failed',
) {
  const messages = {
    es: {
      missing_contact: 'Ingresa un correo o un número de teléfono.',
      invalid_name: 'Ingresa tu nombre para enviar la solicitud.',
      invalid_email: 'Ingresa un correo valido.',
      invalid_phone: 'Ingresa un número de teléfono válido de 10 dígitos.',
      invalid_message: 'Escribe un mensaje un poco más detallado.',
      privacy_required: 'Debes aceptar la politica de privacidad para enviar el formulario.',
      recaptcha_failed: 'No pudimos validar el envío. Recarga la página e inténtalo de nuevo.',
    },
    en: {
      missing_contact: 'Enter an email or a phone number.',
      invalid_name: 'Enter your name to submit the request.',
      invalid_email: 'Enter a valid email address.',
      invalid_phone: 'Enter a valid 10-digit phone number.',
      invalid_message: 'Write a slightly more detailed message.',
      privacy_required: 'You must accept the privacy policy before submitting the form.',
      recaptcha_failed: 'We could not validate your request. Reload the page and try again.',
    },
  } as const

  return messages[locale][key]
}

async function verifyRecaptcha(token: string) {
  if (!recaptchaSecretKey || !token) {
    return false
  }

  try {
    const parameters = new URLSearchParams({
      secret: recaptchaSecretKey,
      response: token,
    })
    const response = await fetch('https://www.recaptcha.net/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: parameters,
      cache: 'no-store',
    })

    if (!response.ok) {
      return false
    }

    const verification = (await response.json()) as RecaptchaVerification
    return (
      verification.success &&
      verification.action === recaptchaAction &&
      typeof verification.score === 'number' &&
      verification.score >= recaptchaMinScore
    )
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!resendApiKey || !contactToEmail || !recaptchaSecretKey) {
    return NextResponse.json({ error: 'Missing contact form configuration' }, { status: 500 })
  }

  const body = (await request.json()) as ContactPayload
  const email = body.email?.trim() || ''
  const name = body.name?.trim() || ''
  const phone = body.phone?.trim() || ''
  const message = body.message?.trim() || ''
  const recaptchaToken = body.recaptchaToken?.trim() || ''
  const locale = body.locale === 'en' ? 'en' : 'es'

  if (!email && !phone) {
    return NextResponse.json({ error: getErrorMessage(locale, 'missing_contact') }, { status: 400 })
  }

  if (body.kind === 'project' && name.length < 2) {
    return NextResponse.json({ error: getErrorMessage(locale, 'invalid_name') }, { status: 400 })
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: getErrorMessage(locale, 'invalid_email') }, { status: 400 })
  }

  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: getErrorMessage(locale, 'invalid_phone') }, { status: 400 })
  }

  if (!message || message.length < 3) {
    return NextResponse.json({ error: getErrorMessage(locale, 'invalid_message') }, { status: 400 })
  }

  if (body.privacyAccepted !== true) {
    return NextResponse.json({ error: getErrorMessage(locale, 'privacy_required') }, { status: 400 })
  }

  if (!(await verifyRecaptcha(recaptchaToken))) {
    return NextResponse.json({ error: getErrorMessage(locale, 'recaptcha_failed') }, { status: 403 })
  }

  const resend = new Resend(resendApiKey)
  const isProjectSubmission = body.kind === 'project'
  const subject = isProjectSubmission
    ? (locale === 'en' ? 'New project request from Codigo Latino website' : 'Nueva solicitud de proyecto desde Codigo Latino')
    : (locale === 'en' ? 'New contact from Codigo Latino website' : 'Nuevo contacto desde la web de Codigo Latino')

  const text =
    locale === 'en'
      ? `You received a new ${isProjectSubmission ? 'project request' : 'website contact'}.\n\nName: ${name || 'Not provided'}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`
      : `Recibiste una nueva ${isProjectSubmission ? 'solicitud de proyecto' : 'consulta desde la web'}.\n\nNombre: ${name || 'No proporcionado'}\nCorreo: ${email}\nTeléfono: ${phone || 'No proporcionado'}\n\nMensaje:\n${message}`

  const { error } = await resend.emails.send({
    from: contactFromEmail,
    to: [contactToEmail],
    subject,
    text,
    replyTo: email || undefined,
  })

  if (error) {
    return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
