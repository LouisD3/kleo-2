'use client'

import { Search } from 'lucide-react'
import { useCallback } from 'react'
import useAuthStore from '@/store/useAuthStore.js'

function extractFirstName(nombre?: string | null): string {
  if (!nombre) return 'Profesor'
  // If it looks like an email, take the part before @
  const cleaned = nombre.includes('@') ? nombre.split('@')[0] : nombre
  // Take the first word and capitalize
  const first = cleaned.split(/[\s._-]/)[0]
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

export default function TopBarProfesor() {
  const { profesor } = useAuthStore()

  const handleSearchClick = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }, [])

  return (
    <header className="hidden md:flex sticky top-0 z-20 h-14 items-center justify-between gap-4 px-6 bg-crema-100/80 backdrop-blur-md border-b border-crema-200">
      {/* Search */}
      <button
        onClick={handleSearchClick}
        className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white ring-1 ring-crema-300 text-sm text-tinta-400 hover:ring-crema-400 transition-colors w-full max-w-sm"
      >
        <Search className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left">Buscar...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-crema-100 text-[10px] font-mono text-tinta-400">
          ⌘K
        </kbd>
      </button>

      {/* Right side: greeting */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {profesor && (
          <span className="text-sm text-tinta-400">
            Hola, <span className="font-medium text-tinta">{extractFirstName(profesor.nombre)}</span>
          </span>
        )}
      </div>
    </header>
  )
}
