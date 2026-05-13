'use client'

import type { TablaPictoricaSpec } from '@/types/tarea-cpa'

interface Props {
  spec: TablaPictoricaSpec
  className?: string
}

export default function TablaPictorica({ spec, className }: Props) {
  const { columnas, filas, resaltados, titulo } = spec

  const resaltadoMap = new Map<string, string>()
  if (resaltados) {
    for (const r of resaltados) {
      resaltadoMap.set(`${r.fila}-${r.columna}`, r.color)
    }
  }

  return (
    <div className={className}>
      {titulo && <p className="text-sm font-semibold text-gray-700 mb-2">{titulo}</p>}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {columnas.map((col) => (
                <th key={col.key} className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i} className="border-b last:border-b-0">
                {columnas.map((col) => {
                  const color = resaltadoMap.get(`${i}-${col.key}`)
                  const val = fila[col.key]
                  const display = typeof val === 'boolean' ? (val ? 'V' : 'F') : String(val ?? '')

                  return (
                    <td
                      key={col.key}
                      className="px-3 py-2 text-gray-800"
                      style={color ? { backgroundColor: `${color}20` } : undefined}
                    >
                      {display}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
