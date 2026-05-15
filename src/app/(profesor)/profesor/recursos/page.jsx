'use client'

import { BookOpen, FileText, Presentation, Search, Video } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { getAllSecuencias } from '@/content/biblioteca/matematicas-1'
import { BLOQUES_NEM } from '@/lib/bloques-nem'

const secuencias = getAllSecuencias()

const TIPOS = [
  { id: 'todos', label: 'Todos', icon: null },
  { id: 'libro', label: 'Libros', icon: BookOpen },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'diapositiva', label: 'Slides', icon: Presentation },
  { id: 'orientacion', label: 'Guías', icon: FileText },
]

export default function RecursosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('todos')

  const secuenciasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return secuencias
    const q = busqueda.toLowerCase()
    return secuencias.filter(
      (s) =>
        s.titulo?.toLowerCase().includes(q) ||
        s.contenido?.toLowerCase().includes(q) ||
        String(s.secuencia).includes(q),
    )
  }, [busqueda])

  return (
    <div className="px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recursos</h1>
        <p className="text-lg text-gray-600 mt-1">
          Biblioteca de contenido pedagógico — 36 secuencias
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por título, contenido o número..."
          className="input-base pl-10"
        />
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TIPOS.map((tipo) => (
          <button
            key={tipo.id}
            onClick={() => setTipoFiltro(tipo.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              tipoFiltro === tipo.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tipo.icon && <tipo.icon className="w-3.5 h-3.5" />}
            {tipo.label}
          </button>
        ))}
      </div>

      {/* Grouped by bloque */}
      <div className="space-y-10">
        {BLOQUES_NEM.map((bloque) => {
          const bloqueSecuencias = secuenciasFiltradas.filter((s) =>
            bloque.secuencias.includes(s.secuencia),
          )
          if (bloqueSecuencias.length === 0) return null

          return (
            <div key={bloque.id}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {bloque.emoji} Bloque {bloque.id} — {bloque.titulo}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bloqueSecuencias.map((sec) => (
                  <div key={sec.secuencia} className="card p-5 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-black text-gray-300">{sec.secuencia}</span>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {sec.titulo}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(tipoFiltro === 'todos' || tipoFiltro === 'libro') && (
                        <Link
                          href={`/profesor/biblioteca/${sec.secuencia}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-amarillo/10 hover:text-gray-900 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Libro
                        </Link>
                      )}
                      {(tipoFiltro === 'todos' || tipoFiltro === 'video') && (
                        <Link
                          href={`/profesor/biblioteca/${sec.secuencia}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-amarillo/10 hover:text-gray-900 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Video
                        </Link>
                      )}
                      {(tipoFiltro === 'todos' || tipoFiltro === 'diapositiva') && (
                        <Link
                          href={`/profesor/biblioteca/${sec.secuencia}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-amarillo/10 hover:text-gray-900 transition-colors"
                        >
                          <Presentation className="w-3.5 h-3.5" />
                          Slides
                        </Link>
                      )}
                      {(tipoFiltro === 'todos' || tipoFiltro === 'orientacion') && (
                        <Link
                          href={`/profesor/biblioteca/${sec.secuencia}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-amarillo/10 hover:text-gray-900 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Guía
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
