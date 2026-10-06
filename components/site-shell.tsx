import Image from 'next/image'
import Link from 'next/link'
import { ArrowUp, ArrowUpRight, Menu } from 'lucide-react'
import { CookieConsent, CookiePreferencesButton } from '@/components/cookie-consent'
import { Locale, translations } from '@/lib/i18n'

type SiteShellProps = {
  locale: Locale
  children: React.ReactNode
  currentPath?: string
}

const localeLabel: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
}

export function SiteShell({ locale, children, currentPath }: SiteShellProps) {
  const t = translations[locale]
  const alternateLocale: Locale = locale === 'es' ? 'en' : 'es'
  const localizedPath = (targetLocale: Locale) =>
    currentPath?.replace(/^\/(es|en)(?=\/|$)/, `/${targetLocale}`) || `/${targetLocale}`
  const footerCopy = {
    es: {
      eyebrow: 'El siguiente paso',
      title: 'Construyamos una presencia digital con dirección.',
      navigation: 'Navegación',
      start: 'Empezar',
      language: 'Idioma',
      services: 'Ver servicios',
      calculator: 'Calcular proyecto',
      contact: 'Contar tu proyecto',
      backToTop: 'Volver arriba',
      rights: 'Todos los derechos reservados.',
      privacy: 'Privacidad',
      cookies: 'Cookies',
    },
    en: {
      eyebrow: 'The next step',
      title: 'Let us build a digital presence with a clear direction.',
      navigation: 'Navigation',
      start: 'Get started',
      language: 'Language',
      services: 'View services',
      calculator: 'Estimate project',
      contact: 'Discuss your project',
      backToTop: 'Back to top',
      rights: 'All rights reserved.',
      privacy: 'Privacy',
      cookies: 'Cookies',
    },
  }[locale]
  const footerNavigation = t.nav

  return (
    <main id="top" className="page-shell text-[var(--brand-ink)]">
      <header className="site-header">
        <div className="brand-shell flex items-center justify-between gap-5 py-5">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
                <div className="relative h-11 w-8 shrink-0 drop-shadow-[0_0_12px_rgba(46,196,182,0.18)]">
                  <Image src="/mask.png" alt={t.logoAlt} fill className="object-contain" sizes="32px" priority />
                </div>
                <div>
                  <p className="brand-display text-sm font-extrabold tracking-[-0.04em] sm:text-base">{t.brandName}</p>
                  <p className="hidden text-xs text-[var(--brand-ink-soft)] sm:block">Digital studio</p>
                </div>
              </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <nav className="hidden items-center gap-1 lg:flex">
                {t.nav.map((item) => (
                   <Link
                     key={item.href}
                     href={item.href}
                     className={currentPath === item.href
                       ? 'rounded-full bg-[var(--brand-mist)] px-3 py-2 text-sm font-semibold text-white'
                       : 'rounded-full px-3 py-2 text-sm font-semibold text-[var(--brand-secondary)] hover:bg-[var(--brand-mist)] hover:text-white'}
                     aria-current={currentPath === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <details className="mobile-menu relative lg:hidden">
                <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--brand-line)] text-[var(--brand-ink)] hover:bg-[var(--brand-mist)]" aria-label={locale === 'es' ? 'Abrir menu' : 'Open menu'}>
                  <Menu size={18} strokeWidth={2.4} />
                </summary>
                <nav className="absolute right-0 top-13 z-50 grid min-w-52 gap-1 rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-surface)] p-2 shadow-[0_18px_55px_rgba(0,0,0,0.32)]">
                  {t.nav.map((item) => (
                    <Link
                     key={item.href}
                     href={item.href}
                     className={currentPath === item.href
                       ? 'rounded-xl bg-[var(--brand-mist)] px-4 py-3 text-sm font-bold text-[var(--brand-ink)]'
                       : 'rounded-xl px-4 py-3 text-sm font-bold text-[var(--brand-ink)] hover:bg-[var(--brand-mist)]'}
                     aria-current={currentPath === item.href ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </details>

              <Link
                href={localizedPath(alternateLocale)}
                className="inline-flex min-w-11 items-center justify-center rounded-full border border-[var(--brand-line)] px-3 py-2 text-xs font-bold text-[var(--brand-ink)] hover:bg-[var(--brand-mist)]"
                aria-label={`Switch to ${alternateLocale === 'es' ? 'Spanish' : 'English'}`}
              >
                {localeLabel[alternateLocale]}
              </Link>

              <Link href={`/${locale}/contacto`} className="brand-button-accent hidden sm:inline-flex">
                {locale === 'es' ? 'Hablemos' : "Let's talk"}
                <ArrowUpRight size={16} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
      </header>

      <div className="brand-shell pb-16 lg:pb-20">
        {children}

        <footer className="site-footer mt-12 overflow-hidden rounded-[1.5rem] text-white">
          <div className="grid gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-14">
            <div className="max-w-3xl">
              <p className="footer-kicker">{footerCopy.eyebrow}</p>
              <h2 className="brand-display mt-5 text-4xl leading-[0.96] font-bold text-balance sm:text-5xl lg:text-6xl">
                {footerCopy.title}
              </h2>
            </div>
            <Link href={`/${locale}/contacto`} className="footer-cta">
              {t.primaryCta} <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <div className="footer-menu-grid">
            <div className="max-w-md">
              <Link href={`/${locale}`} className="inline-flex items-center gap-3">
                <span className="relative h-11 w-8 shrink-0 drop-shadow-[0_0_12px_rgba(46,196,182,0.18)]">
                  <Image src="/mask.png" alt="" fill className="object-contain" sizes="32px" />
                </span>
                <span>
                  <strong className="brand-display block text-lg tracking-[-0.04em]">{t.brandName}</strong>
                  <span className="text-xs text-white/48">Digital studio</span>
                </span>
              </Link>
              <p className="mt-5 text-sm leading-7 text-white/62">{t.footer}</p>
            </div>

            <nav aria-label={footerCopy.navigation}>
              <p className="footer-menu-title">{footerCopy.navigation}</p>
              <div className="mt-4 grid gap-3">
                {footerNavigation.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <nav aria-label={footerCopy.start}>
              <p className="footer-menu-title">{footerCopy.start}</p>
              <div className="mt-4 grid gap-3">
                <Link href={`/${locale}/servicios`} className="footer-link">{footerCopy.services}</Link>
                <Link href={`/${locale}/calculadora`} className="footer-link">{footerCopy.calculator}</Link>
                <Link href={`/${locale}/contacto`} className="footer-link">{footerCopy.contact}</Link>
              </div>
            </nav>

            <nav aria-label={footerCopy.language}>
              <p className="footer-menu-title">{footerCopy.language}</p>
              <div className="mt-4 grid gap-3">
                <Link href={localizedPath('es')} className={locale === 'es' ? 'footer-link is-active' : 'footer-link'}>Español</Link>
                <Link href={localizedPath('en')} className={locale === 'en' ? 'footer-link is-active' : 'footer-link'}>English</Link>
              </div>
            </nav>
          </div>

          <div className="footer-legal">
            <p>© {new Date().getFullYear()} Codigo Latino. {footerCopy.rights}</p>
            <div className="footer-legal-links">
              <Link href={`/${locale}/privacidad`}>{footerCopy.privacy}</Link>
              <Link href={`/${locale}/cookies`}>{footerCopy.cookies}</Link>
              <CookiePreferencesButton locale={locale} />
              <a href="#top" className="inline-flex items-center gap-2 font-bold text-white hover:text-[var(--brand-teal)]">
                {footerCopy.backToTop} <ArrowUp size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </footer>
      </div>
      <CookieConsent locale={locale} />
    </main>
  )
}
