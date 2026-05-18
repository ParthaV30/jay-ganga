import type { Metadata } from 'next'
import ConditionalLayout from '@/components/ConditionalLayout'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Jay Ganga Associates — Architecture & Exhibition Design',
    template: '%s | Jay Ganga Associates',
  },
  description:
    'Jay Ganga Associates is a minimalist architecture and exhibition design firm crafting extraordinary spaces for over 15 years.',
  keywords: ['architecture', 'exhibition design', 'interior design', 'Jay Ganga Associates'],
  openGraph: {
    siteName: 'Jay Ganga Associates',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">

      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
