'use client'

import { AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import Spinner from '@/components/ui/Spinner.jsx'
import { useAlumnos, useTareasProfesor } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function AlumnoDetalle() {
  const { alumnoId } = useParams<{ alumnoId: string }>()
  const { profesor, clase } = useAuthStore()
  const { data: alumnos = [], isLoading: loadingAlumnos } = useAlumnos(clase?.id)
  const { data: tareasData, isLoading: loadingTareas } = useTareasProfesor(profesor?.id)
  const tareas = tareasData?.tareas ?? []
  const resultados = (tareasData?.resultados ?? {}) as Record<string, Record<string, any>>

  const alumno = alumnos.find((a: { id: string }) => a.id === alumnoId)

  const tareasAlumno = useMemo(() => {
    const tareasClase = tareas.filter(
      (t: { clase_id: string; estado: string }) =>
        t.clase_id === clase?.id && (t.estado === 'en_curso' || t.estado === 'completada'),
    )
    return tareasClase.map((t: { id: string; nombre: string; estado: string }) => {
      const res = resultados[t.id]?.[alumnoId]
      const score = res?.calificacion_manual ?? res?.calificacion ?? null
      const scoresCPA = res?.scores_cpa ?? null
      return { ...t, score, scoresCPA, completada: !!res }
    })
  }, [tareas, resultados, alumnoId, clase?.id])

  const completadas = tareasAlumno.filter((t: { completada: boolean }) => t.completada).length
  const total = tareasAlumno.length
  const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0

  if (loadingAlumnos || loadingTareas) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!alumno) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <p className="text-gray-500">Alumno no encontrado.</p>
        <Link
          href="/profesor/clase"
          className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
        >
          Volver a Mi clase
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Back */}
      <Link
        href="/profesor/clase"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Mi clase
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <span
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full text-lg font-bold ${alumno.avatar_color}`}
          >
            {alumno.avatar_iniciales}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{alumno.nombre}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Codigo de acceso:{' '}
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                {alumno.codigo_acceso}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Progreso global</h2>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-amarillo h-3 rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {completadas}/{total} tareas completadas ({progreso}%)
        </p>
      </div>

      {/* Tareas asignadas */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Tareas asignadas</h2>
      {tareasAlumno.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="text-sm">Sin tareas asignadas aun.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tareasAlumno.map(
            (t: {
              id: string
              nombre: string
              completada: boolean
              score: number | null
              scoresCPA: {
                concreto?: { nota: number }
                pictorico?: { nota: number }
                abstracto?: { nota: number }
                global?: number
              } | null
            }) => (
              <div key={t.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{t.nombre}</h3>
                  {t.completada ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                {t.completada && t.score != null && (
                  <p className="text-2xl font-bold text-gray-900">{t.score}</p>
                )}
                {t.completada && t.scoresCPA && (
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>C: {t.scoresCPA.concreto?.nota ?? '-'}</span>
                    <span>P: {t.scoresCPA.pictorico?.nota ?? '-'}</span>
                    <span>A: {t.scoresCPA.abstracto?.nota ?? '-'}</span>
                  </div>
                )}
                {!t.completada && <p className="text-sm text-gray-400 mt-1">En curso</p>}
                <Link
                  href={`/profesor/tarea/${t.id}`}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                >
                  Ver detalle
                </Link>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
