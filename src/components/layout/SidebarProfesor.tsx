'use client'

import { BookOpen, Film, GraduationCap, LogOut, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import useAuthStore from '@/store/useAuthStore.js'

const NAV_ITEMS = [
  { href: '/profesor', label: 'Mis clases', icon: GraduationCap },
  { href: '/profesor/programa', label: 'Programa', icon: BookOpen },
  { href: '/profesor/recursos', label: 'Recursos', icon: Film },
]

function NavIcon({
  href,
  label,
  icon: Icon,
  active,
}: { href: string; label: string; icon: typeof GraduationCap; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors group ${
        active
          ? 'bg-tinta text-amarillo'
          : 'text-tinta-400 hover:bg-crema-100 hover:text-tinta'
      }`}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-tinta text-tinta-50 text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
        {label}
      </span>
    </Link>
  )
}

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

  const handleAccionRapida = useCallback(() => {
    document.dispatchEvent(new CustomEvent('accion-rapida'))
  }, [])

  return (
    <div className="hidden md:flex md:flex-col md:items-center md:fixed md:inset-y-3 md:left-3 md:w-[68px] z-30 gap-3">
      {/* Sidebar pill */}
      <aside className="flex-1 flex flex-col items-center bg-white rounded-3xl border border-crema-300 py-4 gap-1.5 min-h-0">
        {/* Main nav */}
        <nav className="flex-1 flex flex-col items-center gap-1.5 pt-1">
          {NAV_ITEMS.map((item) => (
            <NavIcon key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col items-center gap-1.5 pt-2">
          <div className="w-8 border-t border-crema-200 mb-1" />

          {/* Quick action */}
          <button
            onClick={handleAccionRapida}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amarillo text-tinta hover:bg-amarillo-hover active:scale-95 transition-all group"
            aria-label="Accion rapida"
          >
            <Plus className="w-5 h-5" />
            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-tinta text-tinta-50 text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
              Accion rapida
            </span>
          </button>

          {/* Settings */}
          <NavIcon href="/profesor/ajustes" label="Ajustes" icon={Settings} active={isActive('/profesor/ajustes')} />

          {/* Logout */}
          <button
            onClick={handleSalir}
            className="relative flex items-center justify-center w-10 h-10 rounded-full text-tinta-400 hover:bg-crema-100 hover:text-tinta transition-colors group"
            aria-label="Salir"
          >
            <LogOut className="w-5 h-5" />
            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-tinta text-tinta-50 text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
              Salir
            </span>
          </button>

          {/* Avatar */}
          {profesor && (
            <Link
              href="/profesor/ajustes"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-tinta text-amarillo text-xs font-bold mt-1 hover:ring-2 hover:ring-amarillo transition-all group"
              aria-label={profesor.nombre ?? 'Perfil'}
            >
              {profesor.nombre?.charAt(0)?.toUpperCase() ?? 'P'}
              <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-tinta text-tinta-50 text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                {profesor.nombre}
              </span>
            </Link>
          )}
        </div>
      </aside>
    </div>
  )
}
