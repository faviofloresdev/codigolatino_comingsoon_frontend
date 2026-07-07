export type Locale = 'es' | 'en'

export const locales: Locale[] = ['es', 'en']
export const defaultLocale: Locale = 'es'

type Translation = {
  statusBadge: string
  subheading: string
  headlineWord: string
  descriptionStart: string
  descriptionHighlight: string
  descriptionEnd: string
  logoAlt: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submitButton: string
  submittingButton: string
  metaTitle: string
  metaDescription: string
  notFoundBadge: string
  notFoundTitle: string
  notFoundDescription: string
  errorBadge: string
  errorTitle: string
  errorDescription: string
  backHome: string
  retryButton: string
  confirmationMessage: string
  errorMessage: string
}

export const translations: Record<Locale, Translation> = {
  es: {
    statusBadge: 'Proximamente',
    subheading: 'Pagina web en',
    headlineWord: 'REMODELACION',
    descriptionStart: 'Estamos construyendo una ',
    descriptionHighlight: 'nueva experiencia digital',
    descriptionEnd:
      '. Mientras tanto, dejanos tu correo, tu numero de telefono y un mensaje para ayudarte con lo que necesites.',
    logoAlt: 'Logo de la empresa',
    emailLabel: 'Correo electronico',
    emailPlaceholder: 'Correo electronico',
    phoneLabel: 'Numero de telefono',
    phonePlaceholder: 'Numero de telefono',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Cuentanos en que podemos ayudarte',
    submitButton: 'Enviar',
    submittingButton: 'Enviando...',
    metaTitle: 'En remodelacion | Proximamente',
    metaDescription:
      'Estamos construyendo una nueva experiencia digital. Vuelve pronto para descubrir algo especial.',
    notFoundBadge: 'Error 404',
    notFoundTitle: 'Contenido no encontrado',
    notFoundDescription:
      'La ruta o el recurso que buscas no esta disponible. Podemos llevarte de vuelta al inicio.',
    errorBadge: 'Error de navegacion',
    errorTitle: 'Algo salio mal',
    errorDescription:
      'Ocurrio un problema inesperado mientras cargabamos esta vista. Puedes intentarlo de nuevo o regresar al inicio.',
    backHome: 'Volver al inicio',
    retryButton: 'Reintentar',
    confirmationMessage: 'Gracias. Recibimos tu mensaje y te responderemos pronto.',
    errorMessage: 'No pudimos enviar tu mensaje. Intentalo nuevamente en unos minutos.',
  },
  en: {
    statusBadge: 'Coming soon',
    subheading: 'Website in',
    headlineWord: 'REMODELING',
    descriptionStart: 'We are building a ',
    descriptionHighlight: 'new digital experience',
    descriptionEnd:
      '. In the meantime, leave us your email, phone number, and a message so we can help with anything you need.',
    logoAlt: 'Company logo',
    emailLabel: 'Email address',
    emailPlaceholder: 'Email address',
    phoneLabel: 'Phone number',
    phonePlaceholder: 'Phone number',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us how we can help',
    submitButton: 'Send',
    submittingButton: 'Sending...',
    metaTitle: 'Remodeling | Coming Soon',
    metaDescription:
      'We are building a new digital experience. Check back soon to discover something special.',
    notFoundBadge: 'Error 404',
    notFoundTitle: 'Content not found',
    notFoundDescription:
      'The route or resource you requested is not available. We can take you back to the homepage.',
    errorBadge: 'Navigation error',
    errorTitle: 'Something went wrong',
    errorDescription:
      'An unexpected issue occurred while loading this view. You can try again or return to the homepage.',
    backHome: 'Back to home',
    retryButton: 'Try again',
    confirmationMessage: 'Thanks. We received your message and will reach out soon.',
    errorMessage: 'We could not send your message. Please try again in a few minutes.',
  },
}

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}

export function resolveLocale(input: string | undefined): Locale {
  if (!input) {
    return defaultLocale
  }

  const normalized = input.toLowerCase().split('-')[0]
  return isLocale(normalized) ? normalized : defaultLocale
}

export function resolveLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) {
    return defaultLocale
  }

  const preferredLanguages = header
    .split(',')
    .map((entry) => entry.trim().split(';')[0])
    .filter(Boolean)

  for (const language of preferredLanguages) {
    const locale = resolveLocale(language)
    if (locale !== defaultLocale || language.toLowerCase().startsWith(defaultLocale)) {
      return locale
    }
  }

  return defaultLocale
}
