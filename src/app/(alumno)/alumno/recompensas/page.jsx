'use client'

import NavBar from '@/components/layout/NavBar.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { usePuntosAlumno } from '@/hooks/useTareas.js'
import { getSiguienteRecompensa, RECOMPENSAS } from '@/lib/recompensas.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function RecompensasAlumno() {
  const { alumno } = useAuthStore()
  const { data: historial = [], isLoading } = usePuntosAlumno(alumno?.id)
  const puntos = alumno?.puntos ?? 0

  if (!alumno) return null

  const siguiente = getSiguienteRecompensa(puntos)
  const progreso = siguiente ? Math.min(100, Math.round((puntos / siguiente.puntos) * 100)) : 100
  const todasDesbloqueadas = !siguiente

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Mis recompensas" volver="/alumno" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Hero: total points */}
        <div className="card p-8 text-center mb-8 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-200">
          <p className="text-6xl font-bold text-yellow-600 mb-1">{puntos}</p>
          <p className="text-sm font-medium text-gray-600">puntos acumulados</p>

          {!todasDesbloqueadas && siguiente && (
            <div className="mt-6 max-w-xs mx-auto">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>
                  Siguiente: {siguiente.emoji} {siguiente.nombre}
                </span>
                <span>{siguiente.puntos - puntos} más</span>
              </div>
              <div className="h-3 bg-yellow-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>
          )}

          {todasDesbloqueadas && (
            <p className="mt-4 text-sm text-amber-700 font-medium">
              ¡Todas las recompensas desbloqueadas!
            </p>
          )}
        </div>

        {/* Badges grid */}
        <div className="card p-0 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recompensas</h2>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RECOMPENSAS.map((r) => {
              const desbloqueada = puntos >= r.puntos
              return (
                <div
                  key={r.puntos}
                  className={`p-4 rounded-xl border transition-all ${
                    desbloqueada
                      ? `bg-gradient-to-r ${r.color}`
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl ${desbloqueada ? '' : 'grayscale'}`}>{r.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.nombre}</p>
                      <p className="text-xs text-gray-500">{r.puntos} puntos</p>
                    </div>
                    {desbloqueada && (
                      <svg
                        className="w-5 h-5 text-green-500 ml-auto flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{r.descripcion}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* History */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Historial de puntos</h2>
          </div>
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Spinner size="sm" />
            </div>
          ) : historial.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Completa tareas para ganar tus primeros puntos.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {historial.map((entry) => (
                <div key={entry.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                      +{entry.cantidad}
                    </span>
                    <span className="text-sm text-gray-700">{entry.motivo}</span>
                  </div>
                  <span className="text-xs text-gray-400">
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
      </main>
    </div>
  )
}
