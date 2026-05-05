import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LocalBoost — Get Found Online, Generate Leads',
  description: 'Quick services for local businesses. SEO audits, Google Business setup, lead capture. Starting at €50.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}