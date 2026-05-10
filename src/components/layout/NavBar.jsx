'use client'

import { BookOpen, ChevronDown, LogOut, Settings, Trophy } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useAuthStore from '../../store/useAuthStore.js'

export default function NavBar({ titulo, volver }) {
  const router = useRouter()
  const pathname = usePathname()
  const { rol, profesor, alumno, cerrarSesion } = useAuthStore()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false)
      }
    }
    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuAbierto])

  async function handleSalir() {
    setMenuAbierto(false)
    await cerrarSesion()
    router.push('/')
  }

  const navLinks = [
    {
      href: '/profesor/biblioteca',
      label: 'Biblioteca',
      icon: BookOpen,
      activeColor: 'text-gray-900 bg-gray-100',
      hoverColor: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
    },
    {
      href: '/profesor/gamificacion',
      label: 'Logros',
      icon: Trophy,
      activeColor: 'text-yellow-600 bg-yellow-50',
      hoverColor: 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50',
    },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Logo + breadcrumb */}
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

        {/* Right: Nav links + Avatar dropdown */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Alumno: avatar + name */}
          {rol === 'alumno' && alumno && (
            <div className="flex items-center gap-2 mr-1">
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

          {/* Profesor: nav links + avatar dropdown */}
          {rol === 'profesor' && (
            <>
              {/* Nav links */}
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <button
                    key={link.href}
                    onClick={() => router.push(link.href)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? link.activeColor : link.hoverColor
                    }`}
                  >
                    <Icon className="w-[16px] h-[16px]" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </button>
                )
              })}

              {/* Avatar dropdown */}
              <div className="relative ml-1" ref={menuRef}>
                <button
                  onClick={() => setMenuAbierto((prev) => !prev)}
                  className={`flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl transition-colors ${
                    menuAbierto
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-xs font-bold text-white">
                    {profesor?.nombre?.charAt(0)?.toUpperCase() ?? 'P'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuAbierto ? 'rotate-180' : ''}`} />
                </button>

                {menuAbierto && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {profesor?.nombre ?? 'Profesor'}
                      </p>
                      {profesor?.escuela && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {profesor.escuela}
                        </p>
                      )}
                    </div>

                    {/* Menu items */}
                    <button
                      onClick={() => {
                        setMenuAbierto(false)
                        router.push('/profesor/ajustes')
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      Ajustes
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={handleSalir}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Alumno/Director: simple logout */}
          {(rol === 'alumno' || rol === 'director') && (
            <button
              onClick={handleSalir}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Salir"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
