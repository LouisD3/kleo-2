'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { getTareasParaAlumno, useTareasAlumno } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function DashboardAlumno() {
  const router = useRouter()
  const { alumno } = useAuthStore()
  const { data, isLoading } = useTareasAlumno(alumno?.clase_id)

  if (!alumno) return null

  const tareasRaw = data?.tareas ?? []
  const resultados = data?.resultados ?? {}
  const tareas = getTareasParaAlumno(tareasRaw, resultados, alumno.id)
  const completadas = tareas.filter((t) => t.estadoAlumno === 'completada').length
  const pendientes = tareas.filter((t) => t.estadoAlumno !== 'completada').length

  function promedioPersonal() {
    const conNota = tareas.filter((t) => t.resultadoAlumno?.calificacion != null)
    if (conNota.length === 0) return null
    const suma = conNota.reduce(
      (a, t) => a + (t.resultadoAlumno.calificacion_manual ?? t.resultadoAlumno.calificacion),
      0,
    )
    return Math.round((suma / conNota.length) * 10) / 10
  }

  const promedio = promedioPersonal()

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Mis tareas" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Saludo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hola, {alumno.nombre.split(' ')[0]}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pendientes > 0
              ? `Tienes ${pendientes} tarea${pendientes > 1 ? 's' : ''} pendiente${pendientes > 1 ? 's' : ''}.`
              : 'Todo al corriente.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: 'Completadas',
              valor: completadas,
              color: 'text-green-600',
              bg: 'bg-green-50',
            },
            { label: 'Pendientes', valor: pendientes, color: 'text-blue-600', bg: 'bg-blue-50' },
            {
              label: 'Mi promedio',
              valor: promedio !== null ? `${promedio}/10` : '—',
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
        ) : tareas.length === 0 ? (
          <div className="card p-16 text-center text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
              />
            </svg>
            <p className="font-medium">Sin tareas disponibles</p>
            <p className="text-sm mt-1">Tu profesor aún no ha publicado ninguna tarea.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tareas.map((tarea) => {
              const puedeRealizar = tarea.estadoAlumno === 'en_curso'
              const completada = tarea.estadoAlumno === 'completada'
              const fechaLimite = tarea.fecha_limite ? new Date(tarea.fecha_limite) : null
              const vencida = fechaLimite && fechaLimite < new Date() && !completada

              return (
                <div
                  key={tarea.id}
                  className={`card p-5 transition-all ${puedeRealizar && !vencida ? 'hover:shadow-md cursor-pointer' : ''}`}
                  onClick={() =>
                    puedeRealizar && !vencida && router.push(`/alumno/tarea/${tarea.id}`)
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{tarea.nombre}</h3>
                        <Badge valor={tarea.estadoAlumno} texto={estadoTexto(tarea.estadoAlumno)} />
                        {vencida && (
                          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            Vencida
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>Matematicas</span>
                        <span>·</span>
                        <span>{tarea.dificultad}</span>
                        {fechaLimite && (
                          <>
                            <span>·</span>
                            <span className={vencida ? 'text-red-500' : ''}>
                              Límite:{' '}
                              {fechaLimite.toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {completada && tarea.resultadoAlumno?.calificacion != null && (
                        <span
                          className={`text-2xl font-bold ${
                            (
                              tarea.resultadoAlumno.calificacion_manual ??
                                tarea.resultadoAlumno.calificacion
                            ) >= 8
                              ? 'text-green-600'
                              : (tarea.resultadoAlumno.calificacion_manual ??
                                    tarea.resultadoAlumno.calificacion) >= 6
                                ? 'text-orange-500'
                                : 'text-red-500'
                          }`}
                        >
                          {tarea.resultadoAlumno.calificacion_manual ??
                            tarea.resultadoAlumno.calificacion}
                          <span className="text-sm font-normal text-gray-400">/10</span>
                        </span>
                      )}
                      {puedeRealizar && !vencida && (
                        <Boton
                          variante="primario"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/alumno/tarea/${tarea.id}`)
                          }}
                        >
                          Realizar
                        </Boton>
                      )}
                      {completada && (
                        <Boton
                          variante="secundario"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/alumno/resultado/${tarea.id}`)
                          }}
                        >
                          Ver resultado
                        </Boton>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function estadoTexto(estado) {
  const mapa = {
    completada: 'Completada',
    en_curso: 'Por entregar',
    pendiente: 'Pendiente',
  }
  return mapa[estado] ?? estado
}
