'use client'

import { BookOpen, LogOut, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useAuthStore from '../../store/useAuthStore.js'

export default function NavBar({ titulo, volver }) {
  const router = useRouter()
  const { rol, profesor, alumno, cerrarSesion } = useAuthStore()

  async function handleSalir() {
    await cerrarSesion()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {volver && (
            <button
              onClick={() => router.push(volver)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Volver"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                router.push(
                  rol === 'profesor'
                    ? '/profesor'
                    : rol === 'director'
                      ? '/director'
                      : rol === 'alumno'
                        ? '/alumno'
                        : '/',
                )
              }
              className="text-xl font-bold text-gray-900 hover:text-amarillo transition-colors"
            >
              Kleo
            </button>
            {titulo && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-sm text-gray-500 font-medium">{titulo}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {rol === 'alumno' && alumno && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${alumno.color}`}
              >
                {alumno.avatar}
              </span>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {alumno.nombre}
              </span>
            </div>
          )}
          {rol === 'profesor' && profesor && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                {profesor.nombre?.charAt(0)?.toUpperCase() ?? 'P'}
              </span>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {profesor.nombre}
              </span>
            </div>
          )}
          {rol === 'profesor' && (
            <>
              <button
                onClick={() => router.push('/profesor/biblioteca')}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Biblioteca"
              >
                <BookOpen className="w-[18px] h-[18px]" />
              </button>
              <button
                onClick={() => router.push('/profesor/ajustes')}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Ajustes"
              >
                <Settings className="w-[18px] h-[18px]" />
              </button>
            </>
          )}
          <button
            onClick={handleSalir}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Salir"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  )
}
