import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import AuthProvider from '@/components/auth/AuthProvider.jsx'
import PostHogProvider from '@/components/providers/PostHogProvider'
import QueryProvider from '@/components/providers/QueryProvider.jsx'
import '../index.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kleo — Tareas con IA',
  description:
    'Plataforma educativa mexicana para generar y corregir tareas con inteligencia artificial.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={plusJakarta.className}>
      <body>
        <PostHogProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
