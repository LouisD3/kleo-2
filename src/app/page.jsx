'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '@/store/useAuthStore.js'
import { useEffect } from 'react'

export default function SeleccionarPerfil() {
  const router = useRouter()
  const { rol } = useAuthStore()

  useEffect(() => {
    if (rol === 'profesor') router.push('/profesor')
    if (rol === 'alumno') router.push('/alumno')
  }, [rol, router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center">
        <span className="text-2xl font-bold text-gray-900">Kleo</span>
        <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          Tareas con IA
        </span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Aprende más.<br />
            <span className="text-amarillo">Enseña mejor.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Plataforma educativa con inteligencia artificial para generar, entregar y corregir tareas de forma automática.
          </p>
        </div>

        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
          ¿Cómo entras hoy?
        </p>

        <div className="grid sm:grid-cols-2 gap-5 w-full max-w-lg">
          {/* Tarjeta Profesor */}
          <button
            onClick={() => router.push('/login')}
            className="group card p-8 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-amarillo focus:ring-offset-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amarillo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1.5">Soy Profesor</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Genera tareas con IA, publícalas para tu grupo y revisa el progreso de cada alumno.
            </p>
            <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-gray-900 group-hover:gap-2 transition-all">
              Entrar como profesor
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {/* Tarjeta Alumno */}
          <button
            onClick={() => router.push('/acceso-alumno')}
            className="group card p-8 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-amarillo focus:ring-offset-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-amarillo flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1.5">Soy Alumno</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Realiza tus tareas, recibe retroalimentación instantánea y descubre tus áreas de mejora.
            </p>
            <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-gray-900 group-hover:gap-2 transition-all">
              Entrar con mi código
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400 space-x-3">
        <span>Kleo — Plataforma educativa mexicana</span>
        <span>·</span>
        <Link href="/legal/privacidad" className="hover:text-gray-600 transition-colors">Privacidad</Link>
        <Link href="/legal/terminos" className="hover:text-gray-600 transition-colors">Términos</Link>
      </footer>
    </div>
  )
}
