'use client'

import { ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

const CLASS_COLORS = [
  { bg: 'bg-blue-50', icon: 'bg-blue-500', accent: 'text-blue-600', bar: 'bg-blue-400', glow: 'shadow-blue-200/50', statBg: 'bg-blue-100/50' },
  { bg: 'bg-amber-50', icon: 'bg-amber-500', accent: 'text-amber-600', bar: 'bg-amber-400', glow: 'shadow-amber-200/50', statBg: 'bg-amber-100/50' },
  { bg: 'bg-purple-50', icon: 'bg-purple-500', accent: 'text-purple-600', bar: 'bg-purple-400', glow: 'shadow-purple-200/50', statBg: 'bg-purple-100/50' },
  { bg: 'bg-emerald-50', icon: 'bg-emerald-500', accent: 'text-emerald-600', bar: 'bg-emerald-400', glow: 'shadow-emerald-200/50', statBg: 'bg-emerald-100/50' },
  { bg: 'bg-rose-50', icon: 'bg-rose-500', accent: 'text-rose-600', bar: 'bg-rose-400', glow: 'shadow-rose-200/50', statBg: 'bg-rose-100/50' },
]

export { CLASS_COLORS }

export default function ClaseCard({ clase, tareas = [], resultados = {}, colorIdx = 0, selected, onClick }) {
  const colors = CLASS_COLORS[colorIdx % CLASS_COLORS.length]
  const claseId = clase.id

  const { enCurso, completadasClase, totalTareas, promedio, entregas } = useMemo(() => {
    const tareasClase = tareas.filter((t) => t.clase_id === claseId)
    const ec = tareasClase.filter((t) => t.estado === 'en_curso').length
    const cc = tareasClase.filter((t) => t.estado === 'completada').length

    const notas = []
    let ent = 0
    for (const t of tareasClase) {
      const resMap = resultados[t.id] ?? {}
      const keys = Object.keys(resMap)
      if (t.estado !== 'borrador') ent += keys.length
      for (const alumnoId of keys) {
        const r = resMap[alumnoId]
        const nota = r.calificacion_manual ?? r.calificacion
        if (nota !== null && nota !== undefined) notas.push(nota)
      }
    }
    const prom = notas.length === 0 ? null : (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1)

    return { enCurso: ec, completadasClase: cc, totalTareas: tareasClase.length, promedio: prom, entregas: ent }
  }, [tareas, resultados, claseId])

  const progressPct = totalTareas > 0 ? Math.round((completadasClase / totalTareas) * 100) : 0

  return (
    <button
      onClick={onClick}
      className={`${colors.bg} rounded-2xl p-5 text-left shadow-sm hover:shadow-lg ${colors.glow} hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] cursor-pointer w-full group`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 ${colors.icon} rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:rotate-3`}>
            <span className="text-white text-base font-bold">
              {clase.nombre?.charAt(0)?.toUpperCase() ?? 'C'}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{clase.nombre}</p>
            {clase.grado && (
              <p className="text-xs text-gray-500 mt-0.5">{clase.grado}</p>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`${colors.statBg} rounded-2xl px-3 py-3`}>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Promedio</p>
          <div className="flex items-baseline gap-1">
            <p className={`text-xl font-extrabold tracking-tight ${promedio !== null ? colors.accent : 'text-gray-300'}`}>
              {promedio !== null ? promedio : '--'}
            </p>
            {promedio !== null && <span className="text-xs text-gray-400">/10</span>}
          </div>
        </div>
        <div className={`${colors.statBg} rounded-2xl px-3 py-3`}>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Entregas</p>
          <p className={`text-xl font-extrabold tracking-tight ${entregas > 0 ? colors.accent : 'text-gray-300'}`}>
            {entregas}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {totalTareas > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-gray-500">
              {completadasClase}/{totalTareas} completadas
            </span>
            <span className={`text-[11px] font-bold ${colors.accent}`}>
              {progressPct}%
            </span>
          </div>
          <div className={`h-1.5 ${colors.statBg} rounded-full overflow-hidden`}>
            <div
              className={`h-full ${colors.bar} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-black/5">
        {enCurso > 0 ? (
          <p className="text-xs text-gray-600">
            <span className="font-semibold">{enCurso}</span> tarea{enCurso !== 1 ? 's' : ''} en curso
          </p>
        ) : totalTareas === 0 ? (
          <p className={`text-xs font-semibold ${colors.accent}`}>Asignar tareas →</p>
        ) : (
          <p className="text-xs text-gray-500">
            {completadasClase} completada{completadasClase !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </button>
  )
}
