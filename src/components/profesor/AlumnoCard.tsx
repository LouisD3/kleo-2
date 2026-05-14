'use client'

import Link from 'next/link'

function formatTiempoRelativo(fecha: string | null) {
  if (!fecha) return null
  const diff = Date.now() - new Date(fecha).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const horas = Math.floor(mins / 60)
  if (horas < 24) return `hace ${horas}h`
  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'ayer'
  return `hace ${dias}d`
}

interface AlumnoCardProps {
  alumno: {
    id: string
    nombre: string
    avatar_iniciales: string
    avatar_color: string
  }
  claseId: string
  ultimaActividad?: string | null
  scoresCPA?: {
    concreto?: { completada?: boolean }
    pictorico?: { completada?: boolean }
    abstracto?: { completada?: boolean }
  } | null
  secuenciaEnCurso?: string | null
}

export default function AlumnoCard({
  alumno,
  claseId,
  ultimaActividad,
  scoresCPA,
  secuenciaEnCurso,
}: AlumnoCardProps) {
  return (
    <Link
      href={`/profesor/clase/${claseId}/alumno/${alumno.id}`}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-amarillo transition-all group"
    >
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold flex-shrink-0 ${alumno.avatar_color}`}
        >
          {alumno.avatar_iniciales}
        </span>
        <p className="font-medium text-gray-900 truncate text-sm">{alumno.nombre}</p>
      </div>

      {/* CPA dots */}
      {scoresCPA && (
        <div className="flex items-center gap-2 mb-2">
          <CPADot label="C" completed={scoresCPA.concreto?.completada} />
          <CPADot label="P" completed={scoresCPA.pictorico?.completada} />
          <CPADot label="A" completed={scoresCPA.abstracto?.completada} />
        </div>
      )}

      {secuenciaEnCurso && <p className="text-xs text-gray-500 mb-1">Sec {secuenciaEnCurso}</p>}

      {ultimaActividad && (
        <p className="text-xs text-gray-400">{formatTiempoRelativo(ultimaActividad)}</p>
      )}
    </Link>
  )
}

function CPADot({ label, completed }: { label: string; completed?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
      <div
        className={`w-2.5 h-2.5 rounded-full ${
          completed === true
            ? 'bg-green-400'
            : completed === false
              ? 'bg-yellow-400'
              : 'bg-gray-200'
        }`}
      />
    </div>
  )
}
