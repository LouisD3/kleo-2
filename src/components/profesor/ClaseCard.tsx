'use client'

import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function formatTiempoRelativo(fecha: Date | null) {
  if (!fecha) return null
  const diff = Date.now() - fecha.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const horas = Math.floor(mins / 60)
  if (horas < 24) return `hace ${horas} hora${horas > 1 ? 's' : ''}`
  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'ayer'
  if (dias < 7) return `hace ${dias} días`
  return `hace ${Math.floor(dias / 7)} sem`
}

interface ClaseEnriched {
  id: string
  nombre: string
  emoji?: string
  alumnosCount: number
  tareasActivas: number
  tareasCompletadas: number
  bloqueActual: { titulo: string; emoji: string } | null
  progressPct: number
  alumnosBloqueadosCount: number
  ultimaActividad: Date | null
}

export default function ClaseCard({ clase }: { clase: ClaseEnriched }) {
  return (
    <Link
      href={`/profesor/clase/${clase.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-amarillo transition-all animate-fade-in group"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{clase.emoji || '🎓'}</span>
        <h3 className="text-lg font-bold text-gray-900 truncate">{clase.nombre}</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">{clase.alumnosCount} alumnos</p>

      {/* Progress section */}
      <div className="mb-4">
        {clase.bloqueActual && (
          <p className="text-xs text-gray-500 mb-1">
            {clase.bloqueActual.emoji} {clase.bloqueActual.titulo}
          </p>
        )}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
          <div
            className="bg-amarillo h-2 rounded-full transition-all duration-500"
            style={{ width: `${clase.progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">{clase.progressPct}% del programa</p>
      </div>

      {/* Alerts */}
      {clase.alumnosBloqueadosCount > 0 ? (
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-lg px-3 py-2 mb-4">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            {clase.alumnosBloqueadosCount} alumno{clase.alumnosBloqueadosCount > 1 ? 's' : ''}{' '}
            necesita{clase.alumnosBloqueadosCount > 1 ? 'n' : ''} atención
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-4">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Todo en orden</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {clase.ultimaActividad ? (
          <span className="text-xs text-gray-400">
            Última actividad: {formatTiempoRelativo(clase.ultimaActividad)}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Sin actividad</span>
        )}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
          Entrar <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}
