'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '@/store/useAuthStore.js'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'

export default function AccesoAlumno() {
  const router = useRouter()
  const { loginAlumno, error, setError } = useAuthStore()
  const [codigo, setCodigo] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!codigo.trim()) {
      setError('Escribe tu código de acceso.')
      return
    }
    setCargando(true)
    const ok = await loginAlumno(codigo)
    setCargando(false)
    if (ok) router.push('/alumno')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-5 flex items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">Kleo</Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amarillo flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Acceso alumno</h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Escribe el código de 6 letras que te dio tu profesor
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                placeholder="Ej. ABC123"
                className="input-base text-center text-2xl tracking-[0.3em] font-mono font-bold uppercase"
                maxLength={6}
                autoFocus
              />
            </div>

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            <Boton
              type="submit"
              variante="primario"
              size="lg"
              disabled={cargando || codigo.length < 6}
              className="w-full"
            >
              {cargando ? 'Buscando...' : 'Entrar'}
            </Boton>
          </form>

          <p className="text-sm text-gray-400 text-center mt-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
