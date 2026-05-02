'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import useAuthStore from '@/store/useAuthStore.js'

export default function Registro() {
  const router = useRouter()
  const { registrarse, iniciarSesionConGoogle, error, setError } = useAuthStore()
  const [form, setForm] = useState({ nombre: '', escuela: '', email: '', password: '' })
  const [cargando, setCargando] = useState(false)
  const [aceptaCGU, setAceptaCGU] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Completa todos los campos obligatorios.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (!aceptaCGU) {
      setError('Debes aceptar los términos de uso y el aviso de privacidad.')
      return
    }

    setCargando(true)
    const result = await registrarse(form.email, form.password, form.nombre, form.escuela)
    setCargando(false)
    if (result === 'verificar') router.push('/verificar-correo')
    else if (result === true) router.push('/profesor/bienvenida')
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
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
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Crea tu cuenta</h1>
          <p className="text-sm text-gray-500 text-center mb-8">Empieza a generar tareas con IA</p>

          <button
            type="button"
            onClick={() => iniciarSesionConGoogle()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Registrarse con Google
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base">Nombre completo</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => update('nombre', e.target.value)}
                placeholder="Ej. María García López"
                className="input-base"
                autoFocus
              />
            </div>
            <div>
              <label className="label-base">
                Escuela <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.escuela}
                onChange={(e) => update('escuela', e.target.value)}
                placeholder="Ej. Escuela Secundaria Técnica #42"
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="profesor@escuela.edu.mx"
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="input-base"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaCGU}
                onChange={(e) => setAceptaCGU(e.target.checked)}
                className="accent-yellow-400 mt-1 flex-shrink-0"
              />
              <span className="text-xs text-gray-500">
                Acepto los{' '}
                <Link
                  href="/legal/terminos"
                  className="underline hover:text-gray-700"
                  target="_blank"
                >
                  Términos de uso
                </Link>{' '}
                y el{' '}
                <Link
                  href="/legal/privacidad"
                  className="underline hover:text-gray-700"
                  target="_blank"
                >
                  Aviso de privacidad
                </Link>
              </span>
            </label>

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            <Boton
              type="submit"
              variante="primario"
              size="lg"
              disabled={cargando}
              className="w-full"
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </Boton>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-gray-900 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
