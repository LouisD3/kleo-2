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
      className="block bg-white rounded-3xl border border-crema-300 p-6 hover:border-crema-400 transition-all animate-fade-in group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{clase.emoji || '🎓'}</span>
          <div>
            <h3 className="text-lg font-semibold text-tinta truncate">{clase.nombre}</h3>
            <p className="text-sm text-tinta-400">{clase.alumnosCount} alumnos</p>
          </div>
        </div>
        {clase.alumnosBloqueadosCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-full px-2.5 py-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {clase.alumnosBloqueadosCount}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-tinta-400 bg-crema-200 rounded-full px-2.5 py-1">
            <CheckCircle className="w-3.5 h-3.5" />
            OK
          </span>
        )}
      </div>

      {/* Progress section */}
      {clase.bloqueActual && (
        <p className="text-xs text-tinta-400 mb-1.5">
          {clase.bloqueActual.emoji} {clase.bloqueActual.titulo}
        </p>
      )}
      <div className="w-full bg-crema-200 rounded-full h-1.5 mb-1.5">
        <div
          className="bg-amarillo h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(clase.progressPct, 2)}%` }}
        />
      </div>
      <p className="text-xs text-tinta-400 mb-4">{clase.progressPct}% del programa</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-crema-200">
        {clase.ultimaActividad ? (
          <span className="text-xs text-tinta-400">
            {formatTiempoRelativo(clase.ultimaActividad)}
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
