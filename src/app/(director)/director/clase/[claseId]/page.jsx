'use client'

import { useParams, useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useEscuela, useEscuelaData } from '@/hooks/useDirector.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function ClaseDirectorDetail() {
  const { claseId } = useParams()
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

  const { profesores, clases, alumnos, tareas, resultados } = data ?? {}
  const clase = clases?.find((c) => c.id === claseId)

  if (!clase) {
    router.push('/director')
    return null
  }

  const profClase = profesores?.find((p) => p.id === clase.profesor_id)
  const alumnosClase = alumnos?.filter((a) => a.clase_id === claseId) ?? []
  const tareasClase = tareas?.filter((t) => t.clase_id === claseId) ?? []
  const resultadosClase =
    resultados?.filter((r) => tareasClase.some((t) => t.id === r.tarea_id)) ?? []

  // Per-student stats
  const alumnosConStats = alumnosClase.map((alumno) => {
    const resAlumno = resultadosClase.filter((r) => r.alumno_id === alumno.id)
    const cals = resAlumno
      .map((r) => r.calificacion_manual ?? r.calificacion)
      .filter((c) => c != null)
    const promedio =
      cals.length > 0 ? Math.round((cals.reduce((a, b) => a + b, 0) / cals.length) * 10) / 10 : null
    const tareasCompletadas = resAlumno.length

    return {
      ...alumno,
      promedio,
      tareas_completadas: tareasCompletadas,
      total_tareas: tareasClase.filter((t) => t.estado !== 'borrador').length,
    }
  })

  // Tareas overview
  const tareasConStats = tareasClase.map((tarea) => {
    const resTarea = resultadosClase.filter((r) => r.tarea_id === tarea.id)
    const cals = resTarea
      .map((r) => r.calificacion_manual ?? r.calificacion)
      .filter((c) => c != null)
    const promedio =
      cals.length > 0 ? Math.round((cals.reduce((a, b) => a + b, 0) / cals.length) * 10) / 10 : null

    return {
      ...tarea,
      entregados: resTarea.length,
      total_alumnos: alumnosClase.length,
      promedio,
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={`${clase.nombre} · ${clase.grado ?? ''}`} volver="/director" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{clase.nombre}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Profesor: {profClase?.nombre ?? '—'} · {alumnosClase.length} alumnos ·{' '}
                {tareasClase.length} tareas
              </p>
            </div>
          </div>
        </div>

        {/* Alumnos */}
        <div className="card p-0 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Alumnos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Alumno
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Tareas completadas
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alumnosConStats.map((alumno) => (
                  <tr
                    key={alumno.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/director/alumno/${alumno.id}`)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 ${alumno.avatar_color}`}
                        >
                          {alumno.avatar_iniciales}
                        </span>
                        <span className="font-medium text-gray-900">{alumno.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {alumno.tareas_completadas}/{alumno.total_tareas}
                    </td>
                    <td className="px-4 py-3.5">
                      {alumno.promedio != null ? (
                        <span
                          className={`font-bold ${
                            alumno.promedio >= 8
                              ? 'text-green-600'
                              : alumno.promedio >= 6
                                ? 'text-orange-500'
                                : 'text-red-500'
                          }`}
                        >
                          {alumno.promedio}/10
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tareas */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Tareas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Tarea
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Entregados
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Promedio
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tareasConStats.map((tarea) => (
                  <tr key={tarea.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-gray-900">{tarea.nombre}</span>
                      <span className="text-xs text-gray-400 ml-2">{tarea.materia}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge valor={tarea.estado} />
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {tarea.entregados}/{tarea.total_alumnos}
                    </td>
                    <td className="px-4 py-3.5">
                      {tarea.promedio != null ? (
                        <span
                          className={`font-bold ${
                            tarea.promedio >= 8
                              ? 'text-green-600'
                              : tarea.promedio >= 6
                                ? 'text-orange-500'
                                : 'text-red-500'
                          }`}
                        >
                          {tarea.promedio}/10
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs">
                      {new Date(tarea.created_at).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
