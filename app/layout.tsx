import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Manrope, Sora } from 'next/font/google'
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
  title: 'Codigo Latino | Web a medida, hosting y branding',
  description:
    'Creamos sitios web, branding y hosting administrado para negocios que necesitan una presencia digital clara, mantenible y lista para crecer.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1c1c1c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${heading.variable} ${body.variable} ${mono.variable} bg-[var(--brand-paper)]`}>
      <body className="font-sans antialiased">
        {children}
        <CustomCursor />
      </body>
    </html>
  )
}
