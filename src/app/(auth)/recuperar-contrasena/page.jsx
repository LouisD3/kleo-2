'use client'

import Link from 'next/link'
import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import useAuthStore from '@/store/useAuthStore.js'

export default function RecuperarContrasena() {
  const { recuperarContrasena, error, setError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [cargando, setCargando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico.')
      return
    }
    setCargando(true)
    const ok = await recuperarContrasena(email)
    setCargando(false)
    if (ok) setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="px-6 py-5 flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
          >
            Kleo
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 pb-16">
          <div className="w-full max-w-sm text-center animate-fade-in">
            <div className="text-5xl mb-6">✉️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Correo enviado</h1>
            <p className="text-sm text-gray-500 mb-6">
              Si existe una cuenta con <span className="font-medium text-gray-700">{email}</span>,
              recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="text-xs text-gray-400 mb-8">Revisa también tu carpeta de spam.</p>
            <Link href="/login" className="text-sm font-semibold text-gray-900 hover:underline">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-5 flex items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
        >
          Kleo
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Recupera tu contraseña
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="profesor@escuela.edu.mx"
                className="input-base"
                autoFocus
              />
            </div>

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            <Boton
              type="submit"
              variante="primario"
              size="lg"
              disabled={cargando}
              className="w-full"
            >
              {cargando ? 'Enviando...' : 'Enviar enlace'}
            </Boton>
          </form>

          <p className="text-sm text-gray-400 text-center mt-6">
            <Link href="/login" className="hover:text-gray-600 transition-colors">
              ← Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
