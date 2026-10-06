import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Manrope, Sora } from 'next/font/google'
import { headers } from 'next/headers'
import { CustomCursor } from '@/components/custom-cursor'
import './globals.css'

const heading = Sora({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
})

const body = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.codigolatino.studio'),
  title: 'Código Latino | Web a medida, hosting y branding',
  description:
    'Creamos sitios web, branding y hosting administrado para negocios que necesitan una presencia digital clara, mantenible y lista para crecer.',
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '512x512' }],
    shortcut: '/favicon.png',
    apple: [{ url: '/favicon.png', type: 'image/png', sizes: '512x512' }],
  },
  applicationName: 'Código Latino',
  authors: [{ name: 'Código Latino', url: 'https://www.codigolatino.studio' }],
  creator: 'Código Latino',
  publisher: 'Código Latino',
  category: 'technology',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1c1c1c',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const locale = requestHeaders.get('x-site-locale') === 'en' ? 'en' : 'es'

  return (
    <html lang={locale} className={`${heading.variable} ${body.variable} ${mono.variable} bg-[var(--brand-paper)]`}>
      <body className="font-sans antialiased">
        {children}
        <CustomCursor />
      </body>
    </html>
  )
}
