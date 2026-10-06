import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalPage } from '@/components/legal-page'
import { SiteShell } from '@/components/site-shell'
import { Locale, isLocale } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{ locale: string }>
}

const privacyCopy: Record<Locale, Parameters<typeof LegalPage>[0]> = {
  es: {
    locale: 'es',
    label: 'Información legal',
    title: 'Política de privacidad',
    intro:
      'Explicamos qué datos tratamos cuando visitas el sitio o nos escribes, para qué los utilizamos y qué opciones tienes.',
    updated: 'Última actualización: 6 de octubre de 2026',
    relatedHref: 'cookies',
    relatedLabel: 'Ver política de cookies',
    sections: [
      {
        title: 'Responsable y contacto',
        paragraphs: [
          'Código Latino es responsable del tratamiento de los datos recogidos a través de este sitio. Para consultas de privacidad o para ejercer tus derechos, puedes utilizar el formulario de contacto indicando “Privacidad” en el mensaje.',
        ],
      },
      {
        title: 'Datos que tratamos',
        items: [
          'Datos que proporcionas en los formularios: nombre, correo electrónico, teléfono y contenido del mensaje.',
          'Información del proyecto incluida en la cotización y el brief cuando envías una solicitud: alcance, presupuesto orientativo, negocio, audiencia, objetivos, identidad, contenido y requisitos.',
          'Datos técnicos necesarios para la seguridad, como la evaluación anti-spam generada por Google reCAPTCHA.',
          'Datos agregados de navegación, como página visitada, dispositivo, navegador, país aproximado y referencia, únicamente si autorizas la analítica.',
          'La preferencia de privacidad que guardamos localmente en tu navegador.',
        ],
      },
      {
        title: 'Finalidades y base del tratamiento',
        items: [
          'Responder consultas, preparar propuestas y mantener comunicaciones precontractuales solicitadas por ti.',
          'Proteger el formulario y el sitio frente a fraude, spam y abuso sobre la base de nuestro interés legítimo en mantener el servicio seguro.',
          'Medir el uso agregado del sitio para mejorarlo, únicamente con tu consentimiento previo.',
          'Cumplir obligaciones legales y defender reclamaciones cuando resulte necesario.',
        ],
      },
      {
        title: 'Proveedores y transferencias',
        paragraphs: [
          'Utilizamos Vercel para alojamiento y analítica, Resend para entregar los correos del formulario y Google reCAPTCHA para prevenir abuso. Estos proveedores pueden procesar datos fuera de tu país y aplican sus propios mecanismos contractuales y de protección de datos.',
          'No vendemos tus datos ni los utilizamos para publicidad comportamental.',
        ],
      },
      {
        title: 'Conservación',
        paragraphs: [
          'Conservamos los mensajes durante el tiempo necesario para responder, gestionar una posible relación comercial y atender obligaciones legales. La preferencia de cookies permanece en tu navegador hasta que la cambias, eliminas el almacenamiento local o actualizamos el sistema de consentimiento.',
        ],
      },
      {
        title: 'Tus derechos',
        paragraphs: [
          'Puedes solicitar acceso, rectificación, eliminación, limitación u oposición al tratamiento y, cuando corresponda, portabilidad. También puedes retirar el consentimiento de analítica en cualquier momento desde “Preferencias de cookies” en el footer.',
          'Si consideras que el tratamiento no cumple la normativa aplicable, puedes presentar una reclamación ante la autoridad de protección de datos competente en tu jurisdicción.',
        ],
      },
      {
        title: 'Cambios en esta política',
        paragraphs: [
          'Podemos actualizar esta política cuando cambien el sitio, los proveedores o las obligaciones legales. La fecha indicada al inicio permite identificar la versión vigente.',
        ],
      },
    ],
  },
  en: {
    locale: 'en',
    label: 'Legal information',
    title: 'Privacy policy',
    intro: 'We explain what data we process when you visit the site or contact us, why we use it and what choices you have.',
    updated: 'Last updated: October 6, 2026',
    relatedHref: 'cookies',
    relatedLabel: 'View cookie policy',
    sections: [
      {
        title: 'Controller and contact',
        paragraphs: [
          'Codigo Latino is responsible for personal data collected through this site. For privacy questions or to exercise your rights, use the contact form and include “Privacy” in your message.',
        ],
      },
      {
        title: 'Data we process',
        items: [
          'Information you provide through the forms: name, email address, phone number and message content.',
          'Project information included in the estimate and brief when you submit a request: scope, indicative budget, business, audience, goals, identity, content and requirements.',
          'Technical security information, such as the anti-spam assessment generated by Google reCAPTCHA.',
          'Aggregated navigation data, such as visited page, device, browser, approximate country and referrer, only when you authorize analytics.',
          'Your privacy preference, stored locally in your browser.',
        ],
      },
      {
        title: 'Purposes and legal bases',
        items: [
          'Responding to inquiries, preparing proposals and handling pre-contractual communications requested by you.',
          'Protecting the form and website from fraud, spam and abuse based on our legitimate interest in keeping the service secure.',
          'Measuring aggregated site usage to improve it, only with your prior consent.',
          'Meeting legal obligations and defending claims when necessary.',
        ],
      },
      {
        title: 'Providers and transfers',
        paragraphs: [
          'We use Vercel for hosting and analytics, Resend to deliver form emails and Google reCAPTCHA to prevent abuse. These providers may process data outside your country and apply their own contractual and data protection safeguards.',
          'We do not sell your data or use it for behavioral advertising.',
        ],
      },
      {
        title: 'Retention',
        paragraphs: [
          'We retain messages for as long as needed to respond, manage a potential business relationship and meet legal obligations. Your cookie preference remains in your browser until you change it, clear local storage or we update the consent system.',
        ],
      },
      {
        title: 'Your rights',
        paragraphs: [
          'You may request access, correction, deletion, restriction or objection and, where applicable, portability. You can also withdraw analytics consent at any time through “Cookie preferences” in the footer.',
          'If you believe processing does not comply with applicable law, you may complain to the competent data protection authority in your jurisdiction.',
        ],
      },
      {
        title: 'Changes to this policy',
        paragraphs: [
          'We may update this policy when the site, providers or legal obligations change. The date at the top identifies the current version.',
        ],
      },
    ],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'es'

  return buildPageMetadata({
    locale,
    path: '/privacidad',
    title: locale === 'es' ? 'Política de privacidad' : 'Privacy policy',
    description:
      locale === 'es'
        ? 'Información sobre el tratamiento de datos personales en el sitio de Código Latino.'
        : 'Information about personal data processing on the Codigo Latino website.',
  })
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) {
    notFound()
  }

  const locale: Locale = routeLocale
  return (
    <SiteShell locale={locale}>
      <LegalPage {...privacyCopy[locale]} />
    </SiteShell>
  )
}
