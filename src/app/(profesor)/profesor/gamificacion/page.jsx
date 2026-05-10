'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useAlumnos, useDarPuntos } from '@/hooks/useTareas.js'
import { getBadgesDesbloqueados } from '@/lib/recompensas.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

function usePuntosLogClase(claseId) {
  return useQuery({
    queryKey: ['puntos-log-clase', claseId],
    queryFn: async () => {
      // Get alumno IDs for this class
      const { data: alumnos } = await supabase
        .from('alumnos')
        .select('id, nombre')
        .eq('clase_id', claseId)
      if (!alumnos?.length) return []
      const ids = alumnos.map((a) => a.id)
      const nombresMap = Object.fromEntries(alumnos.map((a) => [a.id, a.nombre]))

      const { data } = await supabase
        .from('puntos_log')
        .select('*')
        .in('alumno_id', ids)
        .order('created_at', { ascending: false })
        .limit(30)

      return (data ?? []).map((p) => ({
        ...p,
        alumno_nombre: nombresMap[p.alumno_id] ?? 'Alumno',
      }))
    },
    enabled: !!claseId,
  })
}

export default function GamificacionProfesor() {
  const { profesor, clases } = useAuthStore()
  const [claseSeleccionada, setClaseSeleccionada] = useState(clases?.[0]?.id ?? null)
  const { data: alumnos = [], isLoading } = useAlumnos(claseSeleccionada)
  const { data: historial = [], isLoading: historialLoading } = usePuntosLogClase(claseSeleccionada)
  const darPuntosMut = useDarPuntos()

  const ranking = useMemo(
    () => [...alumnos].sort((a, b) => (b.puntos ?? 0) - (a.puntos ?? 0)),
    [alumnos],
  )

  const totalPuntos = useMemo(() => alumnos.reduce((acc, a) => acc + (a.puntos ?? 0), 0), [alumnos])

  const totalBadges = useMemo(
    () => alumnos.reduce((acc, a) => acc + getBadgesDesbloqueados(a.puntos ?? 0).length, 0),
    [alumnos],
  )

  const promedioPuntos =
    alumnos.length > 0 ? Math.round((totalPuntos / alumnos.length) * 10) / 10 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Gamificación" volver="/profesor" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Puntos y recompensas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Motiva a tus alumnos con puntos y badges desbloqueables.
          </p>
        </div>

        {/* Class tabs */}
        {clases.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {clases.map((c) => (
              <button
                key={c.id}
                onClick={() => setClaseSeleccionada(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all ${
                  claseSeleccionada === c.id
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-5 bg-yellow-50">
            <p className="text-3xl font-bold text-yellow-600">{totalPuntos}</p>
            <p className="text-sm text-gray-500 mt-1">Puntos totales</p>
          </div>
          <div className="card p-5 bg-blue-50">
            <p className="text-3xl font-bold text-blue-600">{promedioPuntos}</p>
            <p className="text-sm text-gray-500 mt-1">Promedio por alumno</p>
          </div>
          <div className="card p-5 bg-purple-50">
            <p className="text-3xl font-bold text-purple-600">{totalBadges}</p>
            <p className="text-sm text-gray-500 mt-1">Badges desbloqueados</p>
          </div>
        </div>

        {isLoading ? (
          <div className="card p-16 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : alumnos.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <p className="font-medium">Sin alumnos en esta clase</p>
          </div>
        ) : (
          <>
            {/* Ranking table */}
            <div className="card p-0 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Clasificación</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {ranking.map((alumno, i) => {
                  const badges = getBadgesDesbloqueados(alumno.puntos ?? 0)
                  const medal =
                    i === 0 ? '\u{1F947}' : i === 1 ? '\u{1F948}' : i === 2 ? '\u{1F949}' : null
                  return (
                    <div
                      key={alumno.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Position */}
                      <span className="flex-shrink-0 w-8 text-center">
                        {medal ? (
                          <span className="text-lg">{medal}</span>
                        ) : (
                          <span className="text-sm font-bold text-gray-400">{i + 1}</span>
                        )}
                      </span>

                      {/* Avatar + name */}
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 ${alumno.avatar_color}`}
                        >
                          {alumno.avatar_iniciales}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{alumno.nombre}</p>
                          {badges.length > 0 && (
                            <div className="flex gap-1 mt-0.5">
                              {badges.map((b) => (
                                <span key={b.puntos} title={b.nombre} className="text-xs">
                                  {b.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Points + actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-lg font-bold text-yellow-600 min-w-[3ch] text-right">
                          {alumno.puntos ?? 0}
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 5].map((n) => (
                            <button
                              key={n}
                              onClick={() =>
                                darPuntosMut.mutate({
                                  alumnoId: alumno.id,
                                  profesorId: profesor.id,
                                  cantidad: n,
                                  motivo: 'Buen trabajo',
                                })
                              }
                              className="px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors"
                            >
                              +{n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activity history */}
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Actividad reciente</h2>
              </div>
              {historialLoading ? (
                <div className="p-8 flex justify-center">
                  <Spinner size="sm" />
                </div>
              ) : historial.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Aún no se han otorgado puntos en esta clase.
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {historial.map((entry) => (
                    <div
                      key={entry.id}
                      className="px-6 py-3 flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium text-yellow-600">+{entry.cantidad}</span>
                        <span className="text-gray-700 truncate">{entry.alumno_nombre}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-400 truncate">{entry.motivo}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {new Date(entry.created_at).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
