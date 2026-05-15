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
      className="block bg-white border border-crema-300 rounded-3xl p-6 hover:shadow-sm hover:border-crema-400 transition-all animate-fade-in group"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{clase.emoji || '🎓'}</span>
        <h3 className="text-lg font-semibold text-tinta truncate">{clase.nombre}</h3>
      </div>
      <p className="text-sm text-tinta-400 mb-4">{clase.alumnosCount} alumnos</p>

      {/* Progress section */}
      <div className="mb-4">
        {clase.bloqueActual && (
          <p className="text-xs text-tinta-400 mb-1">
            {clase.bloqueActual.emoji} {clase.bloqueActual.titulo}
          </p>
        )}
        <div className="w-full bg-crema-200 rounded-full h-2 mb-1">
          <div
            className="bg-tinta h-2 rounded-full transition-all duration-500"
            style={{ width: `${clase.progressPct}%` }}
          />
        </div>
        <p className="text-xs text-tinta-400">{clase.progressPct}% del programa</p>
      </div>

      {/* Alerts */}
      {clase.alumnosBloqueadosCount > 0 ? (
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-2xl px-3 py-2 mb-4">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            {clase.alumnosBloqueadosCount} alumno{clase.alumnosBloqueadosCount > 1 ? 's' : ''}{' '}
            necesita{clase.alumnosBloqueadosCount > 1 ? 'n' : ''} atención
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-2xl px-3 py-2 mb-4">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Todo en orden</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {clase.ultimaActividad ? (
          <span className="text-xs text-tinta-400">
            Última actividad: {formatTiempoRelativo(clase.ultimaActividad)}
          </span>
        ) : (
          <span className="text-xs text-tinta-400">Sin actividad</span>
        )}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-tinta-400 group-hover:text-tinta transition-colors">
          Entrar <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}
