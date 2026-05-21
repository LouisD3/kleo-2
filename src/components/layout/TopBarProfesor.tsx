'use client'

import { BookOpen, GraduationCap, LogOut, Plus, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import useAuthStore from '@/store/useAuthStore.js'

const NAV_PILLS = [
  { href: '/profesor', label: 'Mis clases', icon: GraduationCap },
  { href: '/profesor/programa', label: 'Programa', icon: BookOpen },
]

export default function TopBarProfesor() {
  const pathname = usePathname()
  const router = useRouter()
  const { profesor, cerrarSesion } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleSearchClick = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }, [])

  const handleAccionRapida = useCallback(() => {
    document.dispatchEvent(new CustomEvent('accion-rapida'))
  }, [])

  function isActive(href: string) {
    if (href === '/profesor')
      return pathname === '/profesor' || pathname.startsWith('/profesor/clase')
    return pathname.startsWith(href)
  }

  return (
    <header className="hidden md:block sticky top-0 z-20 pt-3 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="h-16 flex items-center gap-4 px-6 bg-white/80 backdrop-blur-lg shadow-[0_1px_2px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.02)] rounded-full">
      {/* Logo */}
      <Link
        href="/profesor"
        className="flex items-center gap-2 flex-shrink-0 mr-2"
      >
        <div className="w-10 h-10 rounded-full bg-tinta flex items-center justify-center">
          <GraduationCap className="w-4.5 h-4.5 text-amarillo" />
        </div>
        <span className="text-lg font-bold text-tinta tracking-tight">Kleo</span>
      </Link>

      {/* Search */}
      <button
        onClick={handleSearchClick}
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-crema-300 text-sm text-tinta-400 hover:border-tinta-400/30 transition-colors w-full max-w-xs"
      >
        <Search className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left">Buscar...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-crema-100 text-[10px] font-mono text-tinta-400">
          Cmd+K
        </kbd>
      </button>

      {/* Nav pills */}
      <nav className="flex items-center gap-1.5">
        {NAV_PILLS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                active
                  ? 'bg-tinta text-amarillo border-tinta'
                  : 'bg-white text-tinta-400 border-crema-300 hover:border-tinta-400/30 hover:text-tinta'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Quick action */}
        <button
          onClick={handleAccionRapida}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-tinta bg-tinta text-amarillo text-sm font-medium hover:bg-tinta-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden lg:inline">Nueva tarea</span>
        </button>

        {/* Avatar + dropdown */}
        {profesor && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              onBlur={(e) => {
                if (!menuRef.current?.contains(e.relatedTarget as Node)) setMenuOpen(false)
              }}
              className="w-10 h-10 rounded-full bg-tinta text-amarillo text-sm font-bold flex items-center justify-center hover:ring-2 hover:ring-amarillo transition-all flex-shrink-0"
              aria-label={profesor.nombre ?? 'Perfil'}
            >
              {profesor.nombre?.charAt(0)?.toUpperCase() ?? 'P'}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-crema-300 shadow-sm py-1 z-50">
                <Link
                  href="/profesor/ajustes"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-tinta hover:bg-crema-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 text-tinta-400" />
                  Ajustes
                </Link>
                <button
                  onClick={async () => {
                    setMenuOpen(false)
                    await cerrarSesion()
                    router.push('/')
                  }}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-tinta hover:bg-crema-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4 text-tinta-400" />
                  Salir
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      </div>
    </header>
  )
}
