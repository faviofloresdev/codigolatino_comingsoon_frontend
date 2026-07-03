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
  contactLabel: string
  contactPlaceholder: string
  submitButton: string
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
}

export const translations: Record<Locale, Translation> = {
  es: {
    statusBadge: 'Proximamente',
    subheading: 'Pagina web en',
    headlineWord: 'REMODELACION',
    descriptionStart: 'Estamos construyendo una ',
    descriptionHighlight: 'nueva experiencia digital',
    descriptionEnd:
      '. Mientras tanto, dejanos tu correo o numero de telefono y te contactaremos para ayudarte con lo que necesites.',
    logoAlt: 'Logo de la empresa',
    contactLabel: 'Correo o numero de contacto',
    contactPlaceholder: 'Correo o numero de contacto',
    submitButton: 'Enviar',
    metaTitle: 'En remodelacion · Proximamente',
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
    confirmationMessage: 'Gracias. Recibimos tu contacto y te responderemos pronto.',
  },
  en: {
    statusBadge: 'Coming soon',
    subheading: 'Website in',
    headlineWord: 'REMODELING',
    descriptionStart: 'We are building a ',
    descriptionHighlight: 'new digital experience',
    descriptionEnd:
      '. In the meantime, leave us your email or phone number and we will contact you to help with anything you need.',
    logoAlt: 'Company logo',
    contactLabel: 'Email or contact number',
    contactPlaceholder: 'Email or contact number',
    submitButton: 'Send',
    metaTitle: 'Remodeling · Coming Soon',
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
    confirmationMessage: 'Thanks. We received your contact details and will reach out soon.',
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
