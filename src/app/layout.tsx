import type { Metadata } from 'next'
import AuthProvider from '@/components/auth/AuthProvider.jsx'
import QueryProvider from '@/components/providers/QueryProvider.jsx'
import PostHogProvider from '@/components/providers/PostHogProvider'
import '../index.css'

export const metadata: Metadata = {
  title: 'Kleo — Tareas con IA',
  description:
    'Plataforma educativa mexicana para generar y corregir tareas con inteligencia artificial.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
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
