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
          <div className="fixed bottom-0 inset-x-0 bg-white z-50 md:hidden rounded-t-3xl border-t border-crema-300 animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-crema-300">
              <span className="font-semibold text-tinta">Menú</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-crema-100"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5 text-tinta-400" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              <Link
                href="/profesor/ajustes"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-tinta-400 hover:bg-crema-100 hover:text-tinta"
              >
                <Settings className="w-5 h-5" />
                Ajustes
              </Link>
              <button
                onClick={handleSalir}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-tinta-400 hover:bg-crema-100 hover:text-tinta w-full"
              >
                <LogOut className="w-5 h-5" />
                Salir
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-3 inset-x-3 z-30 bg-white rounded-full border border-crema-300 md:hidden">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-medium transition-colors ${
                  active ? 'text-tinta' : 'text-tinta-400'
                }`}
                aria-label={item.label}
              >
                <div className={`p-1 rounded-full ${active ? 'bg-tinta text-amarillo' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {item.label}
              </Link>
            )
          })}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-medium text-tinta-400"
            aria-label="Menú"
          >
            <div className="p-1">
              <Menu className="w-5 h-5" />
            </div>
            Más
          </button>
        </div>
      </nav>
    </>
  )
}
