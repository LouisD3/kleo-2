'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import useAuthStore from '@/store/useAuthStore.js'

export default function Registro() {
  const router = useRouter()
  const { registrarse, error, setError } = useAuthStore()
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
