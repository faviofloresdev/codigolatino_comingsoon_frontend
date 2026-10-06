export type Locale = 'es' | 'en'

export const locales: Locale[] = ['es', 'en']
export const defaultLocale: Locale = 'es'

type LinkItem = { label: string; href: string }
type FeatureItem = { title: string; description: string }

type Translation = {
  metaTitle: string
  metaDescription: string
  brandName: string
  nav: LinkItem[]
  primaryCta: string
  processSteps: FeatureItem[]
  contactTitle: string
  contactDescription: string
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
  footer: string
  logoAlt: string
  notFoundBadge: string
  notFoundTitle: string
  notFoundDescription: string
  errorBadge: string
  errorTitle: string
  errorDescription: string
  backHome: string
  retryButton: string
}

export const translations: Record<Locale, Translation> = {
  es: {
    metaTitle: 'Codigo Latino | Web a medida, hosting y branding',
    metaDescription:
      'Creamos sitios web, branding y hosting administrado para marcas que necesitan una presencia digital clara, mantenible y lista para crecer.',
    brandName: 'Codigo Latino',
    nav: [
      { label: 'Inicio', href: '/es' },
      { label: 'Servicios', href: '/es/servicios' },
      { label: 'Calculadora', href: '/es/calculadora' },
      { label: 'Contacto', href: '/es/contacto' },
    ],
    primaryCta: 'Hablemos de tu proyecto',
    processSteps: [
      {
        title: 'Diagnóstico',
        description: 'Revisamos el punto de partida, el objetivo comercial y el nivel de profundidad que realmente necesita el proyecto.',
      },
      {
        title: 'Definición',
        description: 'Ordenamos alcance, contenidos, identidad, estructura web e integraciones antes de construir.',
      },
      {
        title: 'Implementación',
        description: 'Diseñamos, desarrollamos y publicamos una solución bien resuelta en lo visual y en lo técnico.',
      },
      {
        title: 'Continuidad',
        description: 'Acompañamos el crecimiento con soporte, mejoras y ajustes para que la base siga siendo útil.',
      },
    ],
    contactTitle: 'Cuéntanos qué necesitas construir o mejorar.',
    contactDescription: 'Si buscas una web nueva, una marca más clara o una solución integral, te ayudamos a definir el siguiente paso con criterio.',
    emailLabel: 'Correo',
    emailPlaceholder: 'tu@empresa.com',
    phoneLabel: 'Teléfono',
    phonePlaceholder: '+1 (555) 000-0000',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Cuéntanos qué necesitas, en qué etapa estás y qué objetivo quieres resolver.',
    submitButton: 'Enviar consulta',
    submittingButton: 'Enviando...',
    confirmationMessage: 'Recibimos tu mensaje. Te responderemos pronto.',
    errorMessage: 'No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.',
    footer: 'Codigo Latino construye web, branding y hosting administrado para marcas que necesitan una presencia digital clara, seria y lista para crecer.',
    logoAlt: 'Logo de Codigo Latino',
    notFoundBadge: 'Error 404',
    notFoundTitle: 'Contenido no encontrado',
    notFoundDescription: 'La ruta que buscas no está disponible. Puedes volver al inicio y continuar desde ahí.',
    errorBadge: 'Error de navegación',
    errorTitle: 'Algo salió mal',
    errorDescription: 'Ocurrió un problema inesperado al cargar esta vista. Puedes reintentar o volver al inicio.',
    backHome: 'Volver al inicio',
    retryButton: 'Reintentar',
  },
  en: {
    metaTitle: 'Codigo Latino | Custom websites, hosting and branding',
    metaDescription: 'We build websites, branding and managed hosting for brands that need a clear, maintainable and growth-ready digital presence.',
    brandName: 'Codigo Latino',
    nav: [
      { label: 'Home', href: '/en' },
      { label: 'Services', href: '/en/servicios' },
      { label: 'Calculator', href: '/en/calculadora' },
      { label: 'Contact', href: '/en/contacto' },
    ],
    primaryCta: 'Tell us about your project',
    processSteps: [
      {
        title: 'Discovery',
        description: 'We review the starting point, business goal and level of depth the project actually needs.',
      },
      {
        title: 'Definition',
        description: 'We organize scope, content, identity, website structure and integrations before building.',
      },
      {
        title: 'Implementation',
        description: 'We design, develop and launch a solution that is resolved both visually and technically.',
      },
      {
        title: 'Continuity',
        description: 'We support growth with maintenance, improvements and adjustments so the foundation remains useful.',
      },
    ],
    contactTitle: 'Tell us what you need to build or improve.',
    contactDescription: 'If you need a new website, a clearer brand or a complete digital solution, we can help define the right next step.',
    emailLabel: 'Email',
    emailPlaceholder: 'you@company.com',
    phoneLabel: 'Phone',
    phonePlaceholder: '+1 (555) 000-0000',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us what you need, what stage you are in and what outcome you want to achieve.',
    submitButton: 'Send inquiry',
    submittingButton: 'Sending...',
    confirmationMessage: 'We received your message. We will reply soon.',
    errorMessage: 'We could not send your message. Please try again in a few minutes.',
    footer: 'Codigo Latino builds websites, branding and managed hosting for brands that need a clear, credible and growth-ready digital presence.',
    logoAlt: 'Codigo Latino logo',
    notFoundBadge: 'Error 404',
    notFoundTitle: 'Content not found',
    notFoundDescription: 'The requested page is unavailable. You can return home and continue from there.',
    errorBadge: 'Navigation error',
    errorTitle: 'Something went wrong',
    errorDescription: 'An unexpected problem occurred while loading this view. Try again or return home.',
    backHome: 'Back to home',
    retryButton: 'Try again',
  },
}

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}

export function resolveLocale(input: string | undefined): Locale {
  if (!input) return defaultLocale
  const normalized = input.toLowerCase().split('-')[0]
  return isLocale(normalized) ? normalized : defaultLocale
}

export function resolveLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale

  const preferredLanguages = header
    .split(',')
    .map((entry) => entry.trim().split(';')[0])
    .filter(Boolean)

  for (const language of preferredLanguages) {
    const locale = resolveLocale(language)
    if (locale !== defaultLocale || language.toLowerCase().startsWith(defaultLocale)) return locale
  }

  return defaultLocale
}
