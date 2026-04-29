import type { Metadata } from 'next'
import AuthProvider from '@/components/auth/AuthProvider.jsx'
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
