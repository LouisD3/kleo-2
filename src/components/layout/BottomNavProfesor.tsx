'use client'

import { BookOpen, Film, GraduationCap, LogOut, Menu, Settings, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import useAuthStore from '@/store/useAuthStore.js'

const NAV_ITEMS = [
  { href: '/profesor', label: 'Mis clases', icon: GraduationCap },
  { href: '/profesor/programa', label: 'Programa', icon: BookOpen },
  { href: '/profesor/recursos', label: 'Recursos', icon: Film },
]

export default function BottomNavProfesor() {
  const pathname = usePathname()
  const router = useRouter()
  const { cerrarSesion } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/profesor')
      return pathname === '/profesor' || pathname.startsWith('/profesor/clase')
    return pathname.startsWith(href)
  }

  async function handleSalir() {
    await cerrarSesion()
    router.push('/')
  }

  return (
    <>
      {/* Mobile menu overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-white z-50 md:hidden shadow-xl animate-slide-up">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menú</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              <Link
                href="/profesor/ajustes"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
                Ajustes
              </Link>
              <button
                onClick={handleSalir}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 w-full"
              >
                <LogOut className="w-5 h-5" />
                Salir
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 md:hidden">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-medium transition-colors ${
                  active ? 'text-gray-900' : 'text-gray-400'
                }`}
                aria-label={item.label}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-amarillo' : ''}`} />
                {item.label}
              </Link>
            )
          })}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-medium text-gray-400"
            aria-label="Menú"
          >
            <Menu className="w-5 h-5" />
            Más
          </button>
        </div>
      </nav>
    </>
  )
}
