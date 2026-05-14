'use client'

import { AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import Spinner from '@/components/ui/Spinner.jsx'
import { getAllSecuencias } from '@/content/biblioteca/matematicas-1'
import { getTareasReferencia } from '@/data/tareas-referencia'
import { useAlumnosBloqueados } from '@/hooks/useAlumnosBloqueados.js'
import { useAlumnos, useTareasProfesor } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

const secuencias = getAllSecuencias()

function formatFecha() {
  return new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function saludoDelDia() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function PaginaHoy() {
  const { profesor, clase } = useAuthStore()
  const { data, isLoading } = useTareasProfesor(profesor?.id)
  const tareas = data?.tareas ?? []
  const resultados = data?.resultados ?? {}
  const { data: alumnos = [] } = useAlumnos(clase?.id)

  const tareasEnCurso = useMemo(() => tareas.filter((t) => t.estado === 'en_curso'), [tareas])

  // Suggestion: find next unassigned secuencia
  const sugerencia = useMemo(() => {
    const secuenciasAsignadas = new Set(tareas.map((t) => t.secuencia_ref).filter(Boolean))
    for (let i = 1; i <= 36; i++) {
      if (!secuenciasAsignadas.has(i) && getTareasReferencia(i).length > 0) {
        const sec = secuencias.find((s) => s.secuencia === i)
        return sec ?? null
      }
    }
    return null
  }, [tareas])

  // Blocked students — uses intentos table via hook
  const { data: alumnosBloqueados = [] } = useAlumnosBloqueados(profesor?.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {saludoDelDia()}, {profesor?.nombre?.split(' ')[0] ?? 'Profe'}
        </h1>
        <p className="text-lg text-gray-600 mt-1">Hoy es {formatFecha()}</p>
      </div>

      {/* Blocked students banner */}
      {alumnosBloqueados.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">
                {alumnosBloqueados.length} alumno{alumnosBloqueados.length > 1 ? 's' : ''} sin
                avanzar desde hace 3+ días
              </h2>
              <div className="mt-2 space-y-1">
                {alumnosBloqueados.slice(0, 5).map((b, i) => (
                  <Link
                    key={i}
                    href={`/profesor/clase/${b.alumno_id}`}
                    className="block text-sm text-gray-700 hover:text-gray-900"
                  >
                    <span className="font-medium">{b.alumno_nombre}</span>
                    <span className="text-gray-400">
                      {' '}
                      — {b.tarea_nombre}, etapa {b.etapa}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tareas en curso */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Tareas en curso</h2>
        {tareasEnCurso.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-sm">No hay tareas activas.</p>
            <Link
              href="/profesor/programa"
              className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
            >
              Asignar una desde el Programa
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tareasEnCurso.map((tarea) => {
              const resTarea = resultados[tarea.id] ?? {}
              const completados = Object.keys(resTarea).length
              const totalAlumnos = alumnos.length
              const pct = totalAlumnos > 0 ? Math.round((completados / totalAlumnos) * 100) : 0

              return (
                <Link
                  key={tarea.id}
                  href={`/profesor/tarea/${tarea.id}`}
                  className="card p-5 hover:shadow-md hover:border-amarillo transition-all group"
                >
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{tarea.nombre}</h3>
                  {tarea.secuencia_ref && (
                    <p className="text-xs text-gray-400 mt-0.5">Sec {tarea.secuencia_ref}</p>
                  )}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amarillo h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {completados}/{totalAlumnos} completaron
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 mt-3 transition-colors">
                    Ver detalle <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Suggestion */}
      {sugerencia && (
        <div className="card p-6 bg-amarillo-soft border-amarillo/30">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Sugerencia</h2>
          <p className="text-sm text-gray-600 mb-3">
            Tu clase esta lista para empezar Sec {sugerencia.secuencia} ({sugerencia.titulo}).
          </p>
          <Link
            href={`/profesor/programa/${sugerencia.secuencia}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-amarillo-hover transition-colors"
          >
            Asignar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
