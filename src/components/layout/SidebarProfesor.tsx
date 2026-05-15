'use client'

import { BookOpen, Film, GraduationCap, LogOut, Plus, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import useAuthStore from '@/store/useAuthStore.js'

const NAV_ITEMS = [
  { href: '/profesor', label: 'Mis clases', icon: GraduationCap },
  { href: '/profesor/programa', label: 'Programa', icon: BookOpen },
  { href: '/profesor/recursos', label: 'Recursos', icon: Film },
]

const SECONDARY_ITEMS = [{ href: '/profesor/ajustes', label: 'Ajustes', icon: Settings }]

export default function SidebarProfesor() {
  const pathname = usePathname()
  const router = useRouter()
  const { profesor, cerrarSesion } = useAuthStore()

  async function handleSalir() {
    await cerrarSesion()
    router.push('/')
  }

  function isActive(href: string) {
    if (href === '/profesor')
      return pathname === '/profesor' || pathname.startsWith('/profesor/clase')
    return pathname.startsWith(href)
  }

  const handleSearchClick = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }, [])

  const handleAccionRapida = useCallback(() => {
    document.dispatchEvent(new CustomEvent('accion-rapida'))
  }, [])

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-4 md:left-4 md:w-56 bg-white rounded-3xl border border-crema-300 z-30">
      {/* Logo */}
      <div className="px-6 py-5">
        <Link
          href="/profesor"
          className="text-xl font-bold text-tinta hover:text-tinta-600 transition-colors"
        >
          Kleo
        </Link>
      </div>

      {/* Search bar */}
      <div className="px-3 pb-3">
        <button
          onClick={handleSearchClick}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-full bg-crema-100 border border-crema-300 text-sm text-tinta-400 hover:bg-crema-200 hover:border-crema-400 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Buscar...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-crema-200 border border-crema-300 text-[10px] font-mono text-tinta-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-tinta text-tinta-50'
                  : 'text-tinta-400 hover:bg-crema-100 hover:text-tinta'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Secondary nav */}
      <div className="px-3 pb-4 space-y-1">
        <div className="border-t border-crema-300 mb-3" />
        {/* Profile */}
        {profesor && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-tinta text-tinta-50 text-xs font-bold flex-shrink-0">
              {profesor.nombre?.charAt(0)?.toUpperCase() ?? 'P'}
            </span>
            <span className="text-sm font-medium text-tinta truncate">{profesor.nombre}</span>
          </div>
        )}
        {SECONDARY_ITEMS.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-tinta text-tinta-50'
                  : 'text-tinta-400 hover:bg-crema-100 hover:text-tinta'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
        <button
          onClick={handleSalir}
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-tinta-400 hover:bg-crema-100 hover:text-tinta transition-colors w-full"
          aria-label="Salir"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Salir
        </button>
      </div>

      {/* Acción rápida */}
      <div className="px-3 pb-4">
        <button
          onClick={handleAccionRapida}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-full bg-tinta text-tinta-50 text-sm font-medium hover:bg-tinta-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Acción rápida
        </button>
      </div>
    </aside>
  )
}
