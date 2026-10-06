import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalPage } from '@/components/legal-page'
import { SiteShell } from '@/components/site-shell'
import { Locale, isLocale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

const cookieCopy: Record<Locale, Parameters<typeof LegalPage>[0]> = {
  es: {
    locale: 'es',
    label: 'Control y transparencia',
    title: 'Política de cookies',
    intro:
      'Esta página identifica las tecnologías de almacenamiento y medición utilizadas en el sitio y te permite entender qué es obligatorio y qué puedes decidir.',
    updated: 'Última actualización: 6 de octubre de 2026',
    relatedHref: 'privacidad',
    relatedLabel: 'Ver política de privacidad',
    sections: [
      {
        title: 'Qué utilizamos',
        paragraphs: [
          'El sitio utiliza almacenamiento local para recordar tu elección de privacidad, Google reCAPTCHA para proteger el formulario y Vercel Web Analytics para obtener estadísticas agregadas cuando das tu consentimiento.',
        ],
      },
      {
        title: 'Tecnologías necesarias',
        items: [
          'codigo-latino-consent-v2: registro local de tu preferencia. No se envía a nuestros servidores y permanece hasta que lo eliminas o actualizamos el sistema.',
          'codigo-latino-quote-v1: conserva el alcance generado en la calculadora cuando decides continuar al brief.',
          'codigo-latino-brief-v2: guarda temporalmente tus respuestas del brief para permitirte avanzar entre etapas. La cotización y el brief se trasladan al formulario y no se envían hasta que revisas y envías la consulta.',
          'Google reCAPTCHA: puede establecer una cookie necesaria y recopilar señales técnicas para detectar abuso cuando visitas los formularios de contacto o envío de proyecto. Se carga desde recaptcha.net para reducir otras cookies potenciales de Google.',
        ],
      },
      {
        title: 'Analítica opcional',
        paragraphs: [
          'Vercel Web Analytics mide páginas visitadas, referencias, país aproximado, navegador, sistema operativo y tipo de dispositivo. No utiliza cookies de terceros ni crea perfiles entre sitios. En esta web solo se carga después de aceptar la categoría Analítica.',
        ],
      },
      {
        title: 'Cómo cambiar tu elección',
        paragraphs: [
          'Puedes abrir “Preferencias de cookies” desde el footer en cualquier momento. También puedes borrar el almacenamiento local desde la configuración de tu navegador; al volver, te pediremos elegir nuevamente.',
        ],
      },
      {
        title: 'Proveedores',
        items: [
          'Google reCAPTCHA: seguridad y prevención de spam.',
          'Vercel: alojamiento y analítica agregada.',
          'Código Latino: almacenamiento local de la preferencia de consentimiento.',
        ],
      },
      {
        title: 'Actualizaciones',
        paragraphs: [
          'Actualizaremos esta política si incorporamos nuevas tecnologías o cambia su finalidad. Cuando el cambio afecte tu elección, volveremos a solicitar consentimiento.',
        ],
      },
    ],
  },
  en: {
    locale: 'en',
    label: 'Control and transparency',
    title: 'Cookie policy',
    intro: 'This page identifies the storage and measurement technologies used on the site and explains what is required and what you can choose.',
    updated: 'Last updated: October 6, 2026',
    relatedHref: 'privacidad',
    relatedLabel: 'View privacy policy',
    sections: [
      {
        title: 'What we use',
        paragraphs: [
          'The site uses local storage to remember your privacy choice, Google reCAPTCHA to protect the form and Vercel Web Analytics for aggregated statistics when you consent.',
        ],
      },
      {
        title: 'Necessary technologies',
        items: [
          'codigo-latino-consent-v2: a local record of your preference. It is not sent to our servers and remains until you remove it or we update the consent system.',
          'codigo-latino-quote-v1: stores the scope generated in the calculator when you continue to the brief.',
          'codigo-latino-brief-v2: temporarily stores your brief responses so you can move between stages. The estimate and brief are transferred to the form and are not sent until you review and submit the inquiry.',
          'Google reCAPTCHA: may set a necessary cookie and collect technical signals to detect abuse when you visit the contact or project submission forms. It loads from recaptcha.net to reduce other potential Google cookies.',
        ],
      },
      {
        title: 'Optional analytics',
        paragraphs: [
          'Vercel Web Analytics measures visited pages, referrers, approximate country, browser, operating system and device type. It does not use third-party cookies or create cross-site profiles. On this website it loads only after you accept Analytics.',
        ],
      },
      {
        title: 'How to change your choice',
        paragraphs: [
          'You can open “Cookie preferences” from the footer at any time. You may also clear local storage in your browser settings; when you return, we will ask you to choose again.',
        ],
      },
      {
        title: 'Providers',
        items: [
          'Google reCAPTCHA: security and spam prevention.',
          'Vercel: hosting and aggregated analytics.',
          'Codigo Latino: local storage of your consent preference.',
        ],
      },
      {
        title: 'Updates',
        paragraphs: [
          'We will update this policy if we add new technologies or change their purpose. When a change affects your choice, we will request consent again.',
        ],
      },
    ],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'es'

  return {
    title: locale === 'es' ? 'Política de cookies | Código Latino' : 'Cookie policy | Codigo Latino',
    description:
      locale === 'es'
        ? 'Información y preferencias sobre cookies y tecnologías de medición utilizadas por Código Latino.'
        : 'Information and preferences for cookies and measurement technologies used by Codigo Latino.',
  }
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) {
    notFound()
  }

  const locale: Locale = routeLocale
  return (
    <SiteShell locale={locale}>
      <LegalPage {...cookieCopy[locale]} />
    </SiteShell>
  )
}
