'use client'

import { useParams, useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useEscuela, useEscuelaData } from '@/hooks/useDirector.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function AlumnoDirectorDetail() {
  const { alumnoId } = useParams()
  const router = useRouter()
  const { profesor } = useAuthStore()
  const { data: escuela } = useEscuela(profesor?.id)
  const { data, isLoading } = useEscuelaData(escuela?.id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const { alumnos, tareas, resultados, clases } = data ?? {}
  const alumno = alumnos?.find((a) => a.id === alumnoId)

  if (!alumno) {
    router.push('/director')
    return null
  }

  const clase = clases?.find((c) => c.id === alumno.clase_id)
  const tareasClase = tareas?.filter((t) => t.clase_id === alumno.clase_id) ?? []
  const resultadosAlumno = resultados?.filter((r) => r.alumno_id === alumnoId) ?? []

  // Build per-task results
  const tareasConResultado = tareasClase
    .filter((t) => t.estado !== 'borrador')
    .map((tarea) => {
      const res = resultadosAlumno.find((r) => r.tarea_id === tarea.id)
      return {
        ...tarea,
        resultado: res ?? null,
        calificacion: res ? (res.calificacion_manual ?? res.calificacion) : null,
      }
    })

  // Consolidated weakness areas
  const todasAreas = resultadosAlumno.flatMap((r) => r.areas_de_mejora ?? [])
  const areasCount = {}
  for (const area of todasAreas) {
    areasCount[area] = (areasCount[area] ?? 0) + 1
  }
  const areasOrdenadas = Object.entries(areasCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Overall stats
  const calificaciones = resultadosAlumno
    .map((r) => r.calificacion_manual ?? r.calificacion)
    .filter((c) => c != null)
  const promedio =
    calificaciones.length > 0
      ? Math.round((calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length) * 10) / 10
      : null

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={alumno.nombre} volver={clase ? `/director/clase/${clase.id}` : '/director'} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4">
            <span
              className={`inline-flex items-center justify-center w-14 h-14 rounded-full text-lg font-bold ${alumno.avatar_color}`}
            >
              {alumno.avatar_iniciales}
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{alumno.nombre}</h1>
              <p className="text-sm text-gray-500">
                {clase?.nombre ?? ''} {clase?.grado ? `· ${clase.grado}` : ''}
              </p>
            </div>
            <div className="ml-auto text-center">
              <p className="text-3xl font-bold text-gray-900">
                {promedio != null ? promedio : '—'}
                <span className="text-lg text-gray-400">/10</span>
              </p>
              <p className="text-xs text-gray-400">Promedio</p>
            </div>
          </div>
        </div>

        {/* Weakness profile */}
        {areasOrdenadas.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Perfil de lacunas</h2>
            <div className="space-y-2">
              {areasOrdenadas.map(([area, count]) => (
                <div key={area} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{area}</span>
                      <span className="text-xs text-gray-400">
                        {count} {count === 1 ? 'vez' : 'veces'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{
                          width: `${Math.min((count / resultadosAlumno.length) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks history */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Historial de tareas</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {tareasConResultado.map((tarea) => (
              <div key={tarea.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{tarea.nombre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {tarea.materia} · {new Date(tarea.created_at).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <div className="text-right">
                  {tarea.calificacion != null ? (
                    <span
                      className={`font-bold text-lg ${
                        tarea.calificacion >= 8
                          ? 'text-green-600'
                          : tarea.calificacion >= 6
                            ? 'text-orange-500'
                            : 'text-red-500'
                      }`}
                    >
                      {tarea.calificacion}/10
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Pendiente</span>
                  )}
                </div>
              </div>
            ))}
            {tareasConResultado.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">
                Sin tareas asignadas aún.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
