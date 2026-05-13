'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import { getAllSecuencias } from '@/content/biblioteca/matematicas-1'
import { getTareasReferencia } from '@/data/tareas-referencia'

const secuencias = getAllSecuencias()

export default function BibliotecaPage() {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')

  const filtradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return secuencias
    return secuencias.filter(
      (s) =>
        s.titulo.toLowerCase().includes(q) ||
        s.contenido.toLowerCase().includes(q) ||
        s.pda.toLowerCase().includes(q),
    )
  }, [busqueda])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Biblioteca" volver="/profesor" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca pedagogica</h1>
          <p className="text-sm text-gray-500 mt-1">
            36 secuencias del programa NEM — Matematicas 1° Secundaria
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por titulo, contenido o PDA..."
            className="input-base max-w-md"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtradas.map((sec) => {
            const numTareas = getTareasReferencia(sec.secuencia).length
            return (
              <button
                key={sec.secuencia}
                type="button"
                onClick={() => router.push(`/profesor/biblioteca/${sec.secuencia}`)}
                className="card p-5 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-3xl font-black text-gray-200 group-hover:text-gray-300 transition-colors leading-none">
                    {String(sec.secuencia).padStart(2, '0')}
                  </span>
                  {numTareas > 0 ? (
                    <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                      {numTareas} tarea{numTareas > 1 ? 's' : ''} CPA
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                      Solo recursos
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{sec.titulo}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{sec.contenido}</p>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-snug">{sec.pda}</p>
              </button>
            )
          })}
        </div>

        {filtradas.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">Sin resultados</p>
            <p className="text-sm mt-1">Intenta con otro termino de busqueda.</p>
          </div>
        )}
      </main>
    </div>
  )
}
