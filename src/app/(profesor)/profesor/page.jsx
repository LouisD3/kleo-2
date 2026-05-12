'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import HeatmapCPA from '@/components/profesor/HeatmapCPA'
import TablaTareas from '@/components/profesor/TablaTareas.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useAlumnos, useEliminarTarea, useTareasProfesor } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function DashboardProfesor() {
  const router = useRouter()
  const { profesor, clases } = useAuthStore()
  const { data, isLoading } = useTareasProfesor(profesor?.id)
  const tareas = data?.tareas ?? []
  const resultados = data?.resultados ?? {}
  const eliminarTareaMut = useEliminarTarea()
  const [filtroClases, setFiltroClases] = useState([])
  const [vistaHeatmap, setVistaHeatmap] = useState(false)

  // Fetch alumnos for heatmap (use first class or filtered class)
  const claseHeatmapId = filtroClases.length === 1 ? filtroClases[0] : clases[0]?.id
  const { data: alumnosData } = useAlumnos(vistaHeatmap ? claseHeatmapId : undefined)

  const clasesMap = useMemo(() => {
    const map = {}
    for (const c of clases) map[c.id] = c
    return map
  }, [clases])

  const tareasFiltradas = useMemo(() => {
    if (filtroClases.length === 0) return tareas
    return tareas.filter((t) => filtroClases.includes(t.clase_id))
  }, [tareas, filtroClases])

  function toggleFiltroClase(claseId) {
    setFiltroClases((prev) =>
      prev.includes(claseId) ? prev.filter((id) => id !== claseId) : [...prev, claseId],
    )
  }

  const completadas = tareasFiltradas.filter((t) => t.estado === 'completada').length
  const enCurso = tareasFiltradas.filter((t) => t.estado === 'en_curso').length
  const borradores = tareasFiltradas.filter((t) => t.estado === 'borrador').length

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Panel del profesor" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis tareas</h1>
            <p className="text-sm text-gray-500 mt-1">
              Asigna tareas de la biblioteca o genera tareas personalizadas
            </p>
          </div>
          <div className="flex gap-3">
            <Boton
              onClick={() => router.push('/profesor/biblioteca')}
              variante="primario"
              size="md"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Biblioteca
            </Boton>
            <Boton onClick={() => router.push('/profesor/clase')} variante="secundario" size="md">
              Mis clases
            </Boton>
            <Boton onClick={() => router.push('/profesor/generar')} variante="secundario" size="md">
              Generar tarea personalizada
            </Boton>
          </div>
        </div>

        {/* Filtro de clases */}
        {clases.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFiltroClases([])}
              className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all ${
                filtroClases.length === 0
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              Todas
            </button>
            {clases.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleFiltroClase(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all ${
                  filtroClases.includes(c.id)
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: 'Completadas',
              valor: completadas,
              color: 'text-green-600',
              bg: 'bg-green-50',
            },
            { label: 'En curso', valor: enCurso, color: 'text-blue-600', bg: 'bg-blue-50' },
            {
              label: 'Borradores',
              valor: borradores,
              color: 'text-yellow-600',
              bg: 'bg-yellow-50',
            },
          ].map((stat) => (
            <div key={stat.label} className={`card p-5 ${stat.bg}`}>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.valor}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Vista toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setVistaHeatmap(false)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              !vistaHeatmap
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            Tareas
          </button>
          <button
            onClick={() => setVistaHeatmap(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              vistaHeatmap
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            Heatmap CPA
          </button>
        </div>

        {isLoading ? (
          <div className="card p-16 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : vistaHeatmap ? (
          <div className="card p-4 overflow-hidden">
            {filtroClases.length > 1 && (
              <p className="text-xs text-gray-400 mb-3">
                Selecciona una sola clase para ver el heatmap.
              </p>
            )}
            <HeatmapCPA
              alumnos={alumnosData ?? []}
              tareas={tareasFiltradas}
              resultados={resultados}
            />
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <TablaTareas
              tareas={tareasFiltradas}
              clasesMap={clasesMap}
              resultados={resultados}
              onEliminar={(id) => eliminarTareaMut.mutateAsync(id)}
              eliminando={eliminarTareaMut.isPending}
            />
          </div>
        )}
      </main>
    </div>
  )
}
