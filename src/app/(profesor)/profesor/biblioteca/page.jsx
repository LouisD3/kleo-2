'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import RecursoCard from '@/components/profesor/RecursoCard.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useBibliotecaSearch, useFavoritos, useToggleFavorito } from '@/hooks/useBiblioteca.js'
import useAuthStore from '@/store/useAuthStore.js'

const MATERIAS = [
  'Matemáticas',
  'Lenguajes',
  'Inglés',
  'Historia de México',
  'Historia Mundial',
  'Formación Cívica y Ética',
  'Biología',
  'Física',
  'Química',
  'Geografía',
]

const GRADOS = ['1° Secundaria', '2° Secundaria', '3° Secundaria']

const METODOLOGIAS = [
  'Feynman',
  'Memorización activa',
  'Resolución de problemas',
  'Práctica directa',
]

export default function Biblioteca() {
  const router = useRouter()
  const { profesor } = useAuthStore()

  const [busqueda, setBusqueda] = useState('')
  const [materia, setMateria] = useState('')
  const [grado, setGrado] = useState('')
  const [metodologia, setMetodologia] = useState('')
  const [soloFavoritos, setSoloFavoritos] = useState(false)

  const { data: recursos, isLoading } = useBibliotecaSearch({
    materia,
    grado,
    busqueda: busqueda.trim(),
    metodologia,
  })
  const { data: favoritosSet } = useFavoritos(profesor?.id)
  const toggleFavoritoMut = useToggleFavorito()

  const recursosFiltrados = soloFavoritos
    ? (recursos ?? []).filter((r) => favoritosSet?.has(r.id))
    : (recursos ?? [])

  function handleToggleFavorito(recursoId) {
    if (!profesor?.id) return
    const isFav = favoritosSet?.has(recursoId) ?? false
    toggleFavoritoMut.mutate({ profesorId: profesor.id, recursoId, isFavorito: isFav })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Biblioteca" volver="/profesor" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por PDA, tema o contenido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-base w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            className="input-base text-sm py-2 px-3"
          >
            <option value="">Todas las materias</option>
            {MATERIAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            className="input-base text-sm py-2 px-3"
          >
            <option value="">Todos los grados</option>
            {GRADOS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={metodologia}
            onChange={(e) => setMetodologia(e.target.value)}
            className="input-base text-sm py-2 px-3"
          >
            <option value="">Todas las metodologías</option>
            {METODOLOGIAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setSoloFavoritos(!soloFavoritos)}
            className={`text-sm px-3 py-2 rounded-xl border transition-colors ${
              soloFavoritos
                ? 'bg-amarillo border-amarillo text-gray-900 font-semibold'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            Favoritos
          </button>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : recursosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-medium">Sin resultados</p>
            <p className="text-sm text-gray-400 mt-1">
              Intenta con otros filtros o términos de búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recursosFiltrados.map((recurso) => (
              <RecursoCard
                key={recurso.id}
                recurso={recurso}
                isFavorito={favoritosSet?.has(recurso.id) ?? false}
                onToggleFavorito={() => handleToggleFavorito(recurso.id)}
                onUsar={() => router.push(`/profesor/generar?from_biblioteca=${recurso.id}`)}
              />
            ))}
          </div>
        )}

        {/* Count */}
        {!isLoading && recursosFiltrados.length > 0 && (
          <p className="text-xs text-gray-400 mt-4 text-center">
            {recursosFiltrados.length} recurso{recursosFiltrados.length !== 1 ? 's' : ''} encontrado
            {recursosFiltrados.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    </div>
  )
}
