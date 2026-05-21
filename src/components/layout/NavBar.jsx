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
    <header className="fixed top-4 left-0 right-0 z-40 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 h-12 flex items-center justify-between gap-4 bg-white/80 backdrop-blur-lg shadow-[0_1px_2px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.02)] rounded-full">
        <div className="flex items-center gap-3">
          {volver && (
            <button
              onClick={() => router.push(volver)}
              className="p-1.5 rounded-full text-tinta-400 hover:text-tinta hover:bg-crema-200 transition-colors"
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
                router.push(rol === 'profesor' ? '/profesor' : rol === 'alumno' ? '/alumno' : '/')
              }
              className="text-xl font-bold text-tinta hover:text-tinta-600 transition-colors"
            >
              Kleo
            </button>
            {titulo && (
              <>
                <span className="text-crema-400">/</span>
                <span className="text-sm text-tinta-400 font-medium">{titulo}</span>
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
              <span className="text-sm font-medium text-tinta-600 hidden sm:block">
                {alumno.nombre}
              </span>
            </div>
          )}
          {rol === 'profesor' && profesor && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-tinta text-tinta-50 text-xs font-bold">
                {profesor.nombre?.charAt(0)?.toUpperCase() ?? 'P'}
              </span>
              <span className="text-sm font-medium text-tinta-600 hidden sm:block">
                {profesor.nombre}
              </span>
            </div>
          )}
          {rol === 'profesor' && (
            <button
              onClick={() => router.push('/profesor/biblioteca')}
              className="p-1.5 rounded-full text-tinta-400 hover:text-tinta hover:bg-crema-200 transition-colors"
              title="Biblioteca"
            >
              <BookOpen className="w-[18px] h-[18px]" />
            </button>
          )}
          {rol === 'profesor' && (
            <button
              onClick={() => router.push('/profesor/ajustes')}
              className="p-1.5 rounded-full text-tinta-400 hover:text-tinta hover:bg-crema-200 transition-colors"
              title="Ajustes"
            >
              <Settings className="w-[18px] h-[18px]" />
            </button>
          )}
          <button
            onClick={handleSalir}
            className="p-1.5 rounded-full text-tinta-400 hover:text-tinta hover:bg-crema-200 transition-colors"
            title="Salir"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  )
}
