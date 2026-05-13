'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TirasFraccionesSpec } from '@/types/tarea-cpa'

interface Props {
  spec: TirasFraccionesSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  selecciones: Record<number, number> // fila index -> number of pieces selected
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

const COLOR_MAP: Record<string, string> = {
  amarillo: '#FFD700',
  azul: '#3B82F6',
  verde: '#10B981',
  rojo: '#EF4444',
  morado: '#8B5CF6',
}

/** Lighten a hex color for the unselected fill */
function lighten(hex: string, amount = 0.35): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const lr = Math.round(r + (255 - r) * amount)
  const lg = Math.round(g + (255 - g) * amount)
  const lb = Math.round(b + (255 - b) * amount)
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`
}

/** Build initial selection state from soluciones_validas for the locked row (row 0) */
function buildInitialSelecciones(spec: TirasFraccionesSpec): Record<number, number> {
  const locked = spec.soluciones_validas.find((s) => s.fila === 0)
  const selecciones: Record<number, number> = {}
  if (locked) {
    selecciones[0] = locked.piezas
  }
  return selecciones
}

export default function TirasFracciones({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [seleccionPorFila, setSeleccionPorFila] = useState<Record<number, Set<number>>>(
    () => {
      // Rebuild per-piece sets from the count-based estado
      const sets: Record<number, Set<number>> = {}
      if (estadoInicial?.selecciones) {
        for (const [filaStr, count] of Object.entries(estadoInicial.selecciones)) {
          const fila = Number(filaStr)
          const set = new Set<number>()
          // Select the first `count` pieces
          for (let i = 0; i < count; i++) set.add(i)
          sets[fila] = set
        }
      } else {
        // Lock the first row with the correct pieces
        const locked = spec.soluciones_validas.find((s) => s.fila === 0)
        if (locked) {
          const set = new Set<number>()
          for (let i = 0; i < locked.piezas; i++) set.add(i)
          sets[0] = set
        }
      }
      return sets
    },
  )
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  // Derive count-based selecciones for onChange
  function toSelecciones(sets: Record<number, Set<number>>): Record<number, number> {
    const result: Record<number, number> = {}
    for (const [k, v] of Object.entries(sets)) {
      result[Number(k)] = v.size
    }
    return result
  }

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({
      selecciones: toSelecciones(seleccionPorFila),
      intentos,
      pistaVisible,
      validado,
    })
  }, [seleccionPorFila, intentos, pistaVisible, validado])

  function togglePieza(filaIdx: number, piezaIdx: number) {
    if (validado) return
    if (filaIdx === 0) return // first row is locked

    setSeleccionPorFila((prev) => {
      const next = { ...prev }
      const set = new Set(next[filaIdx] ?? [])
      if (set.has(piezaIdx)) {
        set.delete(piezaIdx)
      } else {
        set.add(piezaIdx)
      }
      next[filaIdx] = set
      return next
    })
  }

  // Count how many non-locked rows have at least one piece selected
  const filasConSeleccion = spec.filas.filter(
    (_, idx) => idx !== 0 && (seleccionPorFila[idx]?.size ?? 0) > 0,
  ).length

  const verificar = useCallback(() => {
    if (validado) return

    // Check: for each row that has selections, is the count in soluciones_validas?
    let todasCorrectas = true
    let haySeleccionNoLocked = false

    for (let filaIdx = 0; filaIdx < spec.filas.length; filaIdx++) {
      if (filaIdx === 0) continue // locked row, skip
      const count = seleccionPorFila[filaIdx]?.size ?? 0
      if (count === 0) continue // no selection in this row, ok

      haySeleccionNoLocked = true
      const esValida = spec.soluciones_validas.some(
        (sol) => sol.fila === filaIdx && sol.piezas === count,
      )
      if (!esValida) {
        todasCorrectas = false
        break
      }
    }

    const nuevoIntentos = intentos + 1
    setIntentos(nuevoIntentos)

    if (todasCorrectas && haySeleccionNoLocked) {
      setValidado(true)
      onValidado(nuevoIntentos, pistaVisible)
    } else {
      setErrorFlash(true)
      setTimeout(() => setErrorFlash(false), 600)
      if (nuevoIntentos >= intentos_para_pista && spec.pista) {
        setPistaVisible(true)
      }
    }
  }, [validado, seleccionPorFila, spec, intentos, intentos_para_pista, pistaVisible, onValidado])

  // ── SVG dimensions ──
  const labelW = 48
  const padding = 8
  const stripH = 44 // height of each strip (large touch targets)
  const rowGap = 6
  const stripW = 280 // width of the strip area
  const svgW = labelW + stripW + padding * 2
  const svgH = spec.filas.length * (stripH + rowGap) - rowGap + padding * 2

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Fraction wall */}
      <div className="flex justify-center overflow-x-auto">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="max-w-full h-auto"
        >
          {spec.filas.map((fila, filaIdx) => {
            const y = padding + filaIdx * (stripH + rowGap)
            const baseColor = COLOR_MAP[fila.color] ?? fila.color
            const lightColor = lighten(baseColor)
            const isLocked = filaIdx === 0
            const pieceW = stripW / fila.divisiones
            const selectedSet = seleccionPorFila[filaIdx] ?? new Set()

            // Label: "1/N"
            const labelText = `1/${fila.divisiones}`

            return (
              <g key={filaIdx}>
                {/* Row label */}
                <text
                  x={padding + labelW - 8}
                  y={y + stripH / 2 + 5}
                  textAnchor="end"
                  fontSize="13"
                  fontWeight="600"
                  fill="#374151"
                >
                  {labelText}
                </text>

                {/* Strip background */}
                <rect
                  x={padding + labelW}
                  y={y}
                  width={stripW}
                  height={stripH}
                  rx="6"
                  fill="#F3F4F6"
                  stroke="#D1D5DB"
                  strokeWidth="1"
                />

                {/* Individual pieces */}
                {Array.from({ length: fila.divisiones }, (_, pIdx) => {
                  const px = padding + labelW + pIdx * pieceW
                  const isSelected = selectedSet.has(pIdx)
                  const fill = isSelected ? baseColor : lightColor
                  const isFirst = pIdx === 0
                  const isLast = pIdx === fila.divisiones - 1

                  return (
                    <g
                      key={pIdx}
                      onClick={() => togglePieza(filaIdx, pIdx)}
                      className={isLocked ? 'cursor-default' : 'cursor-pointer'}
                      role={isLocked ? undefined : 'button'}
                      tabIndex={isLocked ? undefined : 0}
                    >
                      {/* Piece rect with rounded corners on edges */}
                      <rect
                        x={px + 0.5}
                        y={y + 0.5}
                        width={pieceW - 1}
                        height={stripH - 1}
                        rx={isFirst || isLast ? 5 : 0}
                        fill={fill}
                        stroke={isSelected ? baseColor : '#D1D5DB'}
                        strokeWidth={isSelected ? 2.5 : 0.5}
                        className="transition-all duration-100"
                      />

                      {/* Shine on top */}
                      <rect
                        x={px + 4}
                        y={y + 3}
                        width={Math.max(pieceW - 8, 4)}
                        height={6}
                        rx="3"
                        fill="white"
                        opacity={isSelected ? 0.35 : 0.2}
                      />

                      {/* Check mark for selected pieces */}
                      {isSelected && (
                        <text
                          x={px + pieceW / 2}
                          y={y + stripH / 2 + 5}
                          textAnchor="middle"
                          fontSize="16"
                          fill="white"
                          fontWeight="bold"
                        >
                          {isLocked ? '' : ''}
                        </text>
                      )}

                      {/* Lock indicator for row 0 */}
                      {isLocked && isSelected && pIdx === 0 && (
                        <text
                          x={px + pieceW / 2}
                          y={y + stripH / 2 + 5}
                          textAnchor="middle"
                          fontSize="14"
                          fill="white"
                          fontWeight="bold"
                          className="select-none"
                        >
                          *
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* Locked row overlay label */}
                {isLocked && (
                  <text
                    x={padding + labelW + stripW + 6}
                    y={y + stripH / 2 + 5}
                    fontSize="11"
                    fill="#9CA3AF"
                  >
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selection summary */}
      <p className="text-center text-sm text-gray-500">
        Objetivo: <span className="font-semibold text-gray-700">{spec.fraccion_objetivo}</span>
        {filasConSeleccion > 0 && (
          <span className="ml-2">
            — {filasConSeleccion} tira{filasConSeleccion > 1 ? 's' : ''} seleccionada{filasConSeleccion > 1 ? 's' : ''}
          </span>
        )}
      </p>

      {/* Hint */}
      <AnimatePresence>
        {pistaVisible && spec.pista && !validado && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700"
          >
            <span className="font-semibold">Pista:</span> {spec.pista}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validate button */}
      {!validado && (
        <button
          type="button"
          onClick={verificar}
          disabled={filasConSeleccion === 0}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              filasConSeleccion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : errorFlash
                  ? 'bg-red-500 text-white animate-[shake_0.3s_ease-in-out]'
                  : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
            }
          `}
        >
          Verificar
        </button>
      )}

      {/* Success */}
      <AnimatePresence>
        {validado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-center"
          >
            <p className="text-lg font-bold text-green-700">Correcto!</p>
            <p className="text-sm text-green-600 mt-1">
              Lo lograste en {intentos} intento{intentos > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
