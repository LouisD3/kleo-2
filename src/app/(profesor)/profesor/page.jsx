'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import ChecklistOnboarding from '@/components/profesor/ChecklistOnboarding.jsx'
import TablaTareas from '@/components/profesor/TablaTareas.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useAlumnos, useEliminarTarea, useTareasProfesor } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function DashboardProfesor() {
  const router = useRouter()
  const { profesor, clase, clases } = useAuthStore()
  const { data, isLoading } = useTareasProfesor(profesor?.id)
  const tareas = data?.tareas ?? []
  const resultados = data?.resultados ?? {}
  const { data: alumnos = [] } = useAlumnos(clase?.id)

  const eliminarTareaMut = useEliminarTarea()
  const [filtroClases, setFiltroClases] = useState([])

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
              Gestiona y revisa el progreso de tus grupos
            </p>
          </div>
          <div className="flex gap-3">
            <Boton onClick={() => router.push('/profesor/clase')} variante="secundario" size="md">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Mis clases
            </Boton>
            <Boton onClick={() => router.push('/profesor/generar')} variante="primario" size="md">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Generar nueva tarea
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

        <ChecklistOnboarding
          tieneClase={clases.length > 0}
          tieneAlumnos={alumnos.length > 0}
          tieneTareas={tareas.length > 0}
        />

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

        {isLoading ? (
          <div className="card p-16 flex items-center justify-center">
            <Spinner size="lg" />
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
