import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import ErrorBoundary from '@/components/polish/ErrorBoundary'

export const metadata: Metadata = {
  title: 'LocalBoost — Get Found Online, Generate Leads',
  description: 'Gratis tools voor lokale bedrijven. SEO scanner, lead finder, review generator en meer. Geen aanmelding nodig.',
  keywords: ['lokaal', 'marketing', 'SEO', 'Google', 'bedrijf', 'Nederland'],
  authors: [{ name: 'LocalBoost' }],
  openGraph: {
    title: 'LocalBoost — Gratis Tools voor Lokale Groei',
    description: '10+ gratis tools voor lokale bedrijven. Geen aanmelding nodig.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}