'use client'

import { useMemo } from 'react'

// ── Types ────────────────────────────────────────────────────────

interface Alumno {
  id: string
  nombre: string
  avatar_iniciales: string
  avatar_color: string
}

interface ScoreEtapa {
  nota: number
  completada: boolean
}

interface ScoresCPA {
  concreto?: ScoreEtapa
  pictorico?: ScoreEtapa
  abstracto?: ScoreEtapa
  global?: number
}

interface Resultado {
  scores_cpa?: ScoresCPA
  calificacion?: number
  calificacion_manual?: number | null
}

interface Tarea {
  id: string
  nombre: string
  estado: string
}

interface Props {
  alumnos: Alumno[]
  tareas: Tarea[]
  /** resultados[tareaId][alumnoId] = Resultado */
  resultados: Record<string, Record<string, Resultado>>
}

// ── Color helpers ────────────────────────────────────────────────

function notaColor(nota: number | undefined): string {
  if (nota === undefined || nota === null) return 'bg-gray-100'
  if (nota >= 8) return 'bg-green-400'
  if (nota >= 6) return 'bg-yellow-400'
  return 'bg-red-400'
}

function notaTextColor(nota: number | undefined): string {
  if (nota === undefined || nota === null) return 'text-gray-300'
  if (nota >= 8) return 'text-green-700'
  if (nota >= 6) return 'text-yellow-700'
  return 'text-red-700'
}

// ── Component ────────────────────────────────────────────────────

export default function HeatmapCPA({ alumnos, tareas, resultados }: Props) {
  // Only show tareas that are published (en_curso or completada)
  const tareasActivas = useMemo(
    () => tareas.filter((t) => t.estado === 'en_curso' || t.estado === 'completada'),
    [tareas],
  )

  if (alumnos.length === 0 || tareasActivas.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-sm">
          {alumnos.length === 0
            ? 'Agrega alumnos para ver el heatmap CPA.'
            : 'Publica tareas para ver el heatmap CPA.'}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider min-w-[140px]">
              Alumno
            </th>
            {tareasActivas.map((t) => (
              <th
                key={t.id}
                className="px-2 py-2 text-center font-semibold text-gray-500 uppercase tracking-wider min-w-[80px]"
                title={t.nombre}
              >
                <span className="block truncate max-w-[80px]">{t.nombre}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {alumnos.map((alumno) => (
            <tr key={alumno.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="sticky left-0 z-10 bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold flex-shrink-0 ${alumno.avatar_color}`}
                  >
                    {alumno.avatar_iniciales}
                  </span>
                  <span className="font-medium text-gray-800 truncate max-w-[100px]">
                    {alumno.nombre}
                  </span>
                </div>
              </td>
              {tareasActivas.map((tarea) => {
                const res = resultados[tarea.id]?.[alumno.id]
                return (
                  <td key={tarea.id} className="px-2 py-2">
                    <CeldaCPA resultado={res} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 px-3 text-[10px] text-gray-400">
        <span className="font-semibold uppercase tracking-wider">Leyenda:</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-green-400" /> ≥8
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-yellow-400" /> 6-7
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-red-400" /> &lt;6
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-gray-100" /> Sin datos
        </span>
        <span className="ml-2">C = Concreto · P = Pictorico · A = Abstracto</span>
      </div>
    </div>
  )
}

// ── Cell ─────────────────────────────────────────────────────────

function CeldaCPA({ resultado }: { resultado: Resultado | undefined }) {
  if (!resultado) {
    return (
      <div className="flex items-center justify-center gap-[2px]">
        <span className="w-4 h-5 rounded-sm bg-gray-100" />
        <span className="w-4 h-5 rounded-sm bg-gray-100" />
        <span className="w-4 h-5 rounded-sm bg-gray-100" />
      </div>
    )
  }

  const scores = resultado.scores_cpa

  // CPA result — show 3 mini bars
  if (scores?.concreto != null) {
    const c = scores.concreto?.nota
    const p = scores.pictorico?.nota
    const a = scores.abstracto?.nota

    return (
      <div
        className="flex flex-col items-center gap-[2px]"
        title={`C:${c ?? '-'} P:${p ?? '-'} A:${a ?? '-'}`}
      >
        <div className="flex items-end gap-[2px]">
          <div className="flex flex-col items-center">
            <span className={`w-4 h-5 rounded-sm ${notaColor(c)}`} />
            <span className={`text-[8px] font-bold ${notaTextColor(c)}`}>C</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`w-4 h-5 rounded-sm ${notaColor(p)}`} />
            <span className={`text-[8px] font-bold ${notaTextColor(p)}`}>P</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`w-4 h-5 rounded-sm ${notaColor(a)}`} />
            <span className={`text-[8px] font-bold ${notaTextColor(a)}`}>A</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold ${notaTextColor(scores.global)}`}>
          {scores.global ?? '-'}
        </span>
      </div>
    )
  }

  // Legacy result — single score
  const nota = resultado.calificacion_manual ?? resultado.calificacion
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <span className={`w-12 h-5 rounded-sm ${notaColor(nota)}`} />
      <span className={`text-[10px] font-bold ${notaTextColor(nota)}`}>{nota ?? '-'}</span>
    </div>
  )
}
