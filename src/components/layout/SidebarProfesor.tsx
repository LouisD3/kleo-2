'use client'

import { BookOpen, Home, LogOut, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore.js'

const NAV_ITEMS = [
  { href: '/profesor', label: 'Hoy', icon: Home },
  { href: '/profesor/programa', label: 'Programa', icon: BookOpen },
  { href: '/profesor/clase', label: 'Mi clase', icon: Users },
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
    if (href === '/profesor') return pathname === '/profesor'
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-60 bg-white border-r border-gray-100 z-30">
      {/* Logo */}
      <div className="px-6 py-5">
        <Link
          href="/profesor"
          className="text-xl font-bold text-gray-900 hover:text-amarillo transition-colors"
        >
          Kleo
        </Link>
      </div>

      {/* Profile */}
      {profesor && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-sm font-bold text-gray-600">
              {profesor.nombre?.charAt(0)?.toUpperCase() ?? 'P'}
            </span>
            <span className="text-sm font-medium text-gray-700 truncate">{profesor.nombre}</span>
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-amarillo/20 text-gray-900 border-l-4 border-amarillo -ml-0.5 pl-[10px]'
                  : 'text-gray-600 hover:bg-gray-100'
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
        <div className="border-t border-gray-100 mb-3" />
        {SECONDARY_ITEMS.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-amarillo/20 text-gray-900 border-l-4 border-amarillo -ml-0.5 pl-[10px]'
                  : 'text-gray-600 hover:bg-gray-100'
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full"
          aria-label="Salir"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Salir
        </button>
      </div>
    </aside>
  )
}
