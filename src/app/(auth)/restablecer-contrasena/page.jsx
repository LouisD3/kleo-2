'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import useAuthStore from '@/store/useAuthStore.js'

export default function RestablecerContrasena() {
  const router = useRouter()
  const { restablecerContrasena, error, setError } = useAuthStore()
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setCargando(true)
    const ok = await restablecerContrasena(password)
    setCargando(false)
    if (ok) router.push('/profesor')
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
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Nueva contraseña</h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Elige una contraseña segura para tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="input-base"
                autoFocus
              />
            </div>
            <div>
              <label className="label-base">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repite tu contraseña"
                className="input-base"
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
              {cargando ? 'Guardando...' : 'Guardar contraseña'}
            </Boton>
          </form>
        </div>
      </main>
    </div>
  )
}
