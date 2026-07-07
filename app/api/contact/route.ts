import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const contactToEmail = process.env.CONTACT_TO_EMAIL
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || 'Codigo Latino <onboarding@resend.dev>'

type ContactPayload = {
  email?: string
  phone?: string
  message?: string
  locale?: 'es' | 'en'
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getErrorMessage(locale: 'es' | 'en', key: 'missing_contact' | 'invalid_email' | 'invalid_message') {
  const messages = {
    es: {
      missing_contact: 'Ingresa un correo o un numero de telefono.',
      invalid_email: 'Ingresa un correo valido.',
      invalid_message: 'Escribe un mensaje un poco mas detallado.',
    },
    en: {
      missing_contact: 'Enter an email or a phone number.',
      invalid_email: 'Enter a valid email address.',
      invalid_message: 'Write a slightly more detailed message.',
    },
  } as const

  return messages[locale][key]
}

export async function POST(request: Request) {
  if (!resendApiKey || !contactToEmail) {
    return NextResponse.json({ error: 'Missing email configuration' }, { status: 500 })
  }

  const body = (await request.json()) as ContactPayload
  const email = body.email?.trim() || ''
  const phone = body.phone?.trim() || ''
  const message = body.message?.trim() || ''
  const locale = body.locale === 'en' ? 'en' : 'es'

  if (!email && !phone) {
    return NextResponse.json({ error: getErrorMessage(locale, 'missing_contact') }, { status: 400 })
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: getErrorMessage(locale, 'invalid_email') }, { status: 400 })
  }

  if (!message || message.length < 3) {
    return NextResponse.json({ error: getErrorMessage(locale, 'invalid_message') }, { status: 400 })
  }

  const resend = new Resend(resendApiKey)
  const subject =
    locale === 'en' ? 'New contact from Codigo Latino website' : 'Nuevo contacto desde la web de Codigo Latino'

  const text =
    locale === 'en'
      ? `You received a new website contact.\n\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`
      : `Recibiste un nuevo contacto desde la web.\n\nCorreo: ${email}\nTelefono: ${phone || 'No proporcionado'}\n\nMensaje:\n${message}`

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
