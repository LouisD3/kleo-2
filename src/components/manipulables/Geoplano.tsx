'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { GeoplanoSpec } from '@/types/tarea-cpa'

interface Props {
  spec: GeoplanoSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  puntosSeleccionados: Array<[number, number]>
  figuraCerrada: boolean
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

/** Spacing between pegs in px */
const SPACING = 48
/** Peg radius */
const PEG_R = 6
/** Padding around the grid */
const PADDING = 24

/**
 * Normalize a polygon's point list for comparison:
 * find the canonical rotation (starting from the "smallest" point)
 * and pick the smaller between CW and CCW traversals.
 */
function normalizePolygon(pts: Array<[number, number]>): string {
  if (pts.length === 0) return ''

  // Find index of the smallest point (row first, then col)
  let minIdx = 0
  for (let i = 1; i < pts.length; i++) {
    if (
      pts[i][0] < pts[minIdx][0] ||
      (pts[i][0] === pts[minIdx][0] && pts[i][1] < pts[minIdx][1])
    ) {
      minIdx = i
    }
  }

  // Rotate so smallest point is first
  const rotated = [...pts.slice(minIdx), ...pts.slice(0, minIdx)]
  // Also consider the reverse direction
  const reversed = [rotated[0], ...rotated.slice(1).reverse()]

  const toString = (arr: Array<[number, number]>) =>
    arr.map((p) => `${p[0]},${p[1]}`).join('|')

  const a = toString(rotated)
  const b = toString(reversed)
  return a < b ? a : b
}

/**
 * Compare two polygons: same set of vertices forming the same shape,
 * regardless of starting point or traversal direction.
 */
function polygonsMatch(
  student: Array<[number, number]>,
  target: Array<[number, number]>,
): boolean {
  if (student.length !== target.length) return false
  return normalizePolygon(student) === normalizePolygon(target)
}

export default function Geoplano({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [puntosSeleccionados, setPuntosSeleccionados] = useState<
    Array<[number, number]>
  >(estadoInicial?.puntosSeleccionados ?? [])
  const [figuraCerrada, setFiguraCerrada] = useState(
    estadoInicial?.figuraCerrada ?? false,
  )
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(
    estadoInicial?.pistaVisible ?? false,
  )
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  // Persist state changes via ref pattern (same as ChocolateSecable)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({
      puntosSeleccionados,
      figuraCerrada,
      intentos,
      pistaVisible,
      validado,
    })
  }, [puntosSeleccionados, figuraCerrada, intentos, pistaVisible, validado])

  // SVG dimensions
  const svgW = (spec.columnas - 1) * SPACING + PADDING * 2
  const svgH = (spec.filas - 1) * SPACING + PADDING * 2

  /** Convert grid coords to SVG pixel coords */
  function toSVG(row: number, col: number): [number, number] {
    return [PADDING + col * SPACING, PADDING + row * SPACING]
  }

  /** Check if a point is already selected */
  function findPointIndex(row: number, col: number): number {
    return puntosSeleccionados.findIndex((p) => p[0] === row && p[1] === col)
  }

  function handlePegClick(row: number, col: number) {
    if (validado || figuraCerrada) return

    const idx = findPointIndex(row, col)

    // If clicking the last selected peg and we have >= 3 points, close the shape
    if (
      idx === puntosSeleccionados.length - 1 &&
      puntosSeleccionados.length >= 3
    ) {
      setFiguraCerrada(true)
      return
    }

    // If point already selected (but not last), ignore
    if (idx !== -1) return

    // Add the peg
    setPuntosSeleccionados((prev) => [...prev, [row, col]])
  }

  function borrar() {
    if (validado) return
    setPuntosSeleccionados([])
    setFiguraCerrada(false)
  }

  const verificar = useCallback(() => {
    if (validado || !figuraCerrada) return

    const esValido = polygonsMatch(puntosSeleccionados, spec.figura_objetivo)

    const nuevoIntentos = intentos + 1
    setIntentos(nuevoIntentos)

    if (esValido) {
      setValidado(true)
      onValidado(nuevoIntentos, pistaVisible)
    } else {
      setErrorFlash(true)
      setTimeout(() => setErrorFlash(false), 600)
      // Re-open shape so student can edit
      setFiguraCerrada(false)
      setPuntosSeleccionados([])
      if (nuevoIntentos >= intentos_para_pista && spec.pista) {
        setPistaVisible(true)
      }
    }
  }, [
    validado,
    figuraCerrada,
    puntosSeleccionados,
    spec.figura_objetivo,
    spec.pista,
    intentos,
    intentos_para_pista,
    pistaVisible,
    onValidado,
  ])

  // Build the closed polygon path
  function buildPolygonPath(): string {
    if (puntosSeleccionados.length < 2) return ''
    const points = puntosSeleccionados.map((p) => toSVG(p[0], p[1]))
    return (
      points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') +
      (figuraCerrada ? ' Z' : '')
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Geoboard */}
      <div className="flex justify-center">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="max-w-full h-auto"
          role="application"
          aria-label="Geoplano interactivo"
        >
          {/* Board background */}
          <rect
            x="4"
            y="4"
            width={svgW - 8}
            height={svgH - 8}
            rx="12"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="2"
          />

          {/* Closed shape fill */}
          {figuraCerrada && puntosSeleccionados.length >= 3 && (
            <path
              d={buildPolygonPath()}
              fill="rgba(255,215,0,0.15)"
              stroke="none"
            />
          )}

          {/* Rubber band lines */}
          {puntosSeleccionados.length >= 2 &&
            puntosSeleccionados.map((pt, i) => {
              if (i === 0) return null
              const [x1, y1] = toSVG(
                puntosSeleccionados[i - 1][0],
                puntosSeleccionados[i - 1][1],
              )
              const [x2, y2] = toSVG(pt[0], pt[1])
              return (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#FFD700"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              )
            })}

          {/* Closing line */}
          {figuraCerrada && puntosSeleccionados.length >= 3 && (() => {
            const first = puntosSeleccionados[0]
            const last = puntosSeleccionados[puntosSeleccionados.length - 1]
            const [x1, y1] = toSVG(last[0], last[1])
            const [x2, y2] = toSVG(first[0], first[1])
            return (
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FFD700"
                strokeWidth={3}
                strokeLinecap="round"
              />
            )
          })()}

          {/* Pegs */}
          {Array.from({ length: spec.filas }, (_, row) =>
            Array.from({ length: spec.columnas }, (_, col) => {
              const [cx, cy] = toSVG(row, col)
              const isSelected = findPointIndex(row, col) !== -1
              const isLast =
                puntosSeleccionados.length > 0 &&
                puntosSeleccionados[puntosSeleccionados.length - 1][0] === row &&
                puntosSeleccionados[puntosSeleccionados.length - 1][1] === col

              return (
                <g
                  key={`peg-${row}-${col}`}
                  onClick={() => handlePegClick(row, col)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  {/* Peg shadow */}
                  <circle
                    cx={cx}
                    cy={cy + 1}
                    r={PEG_R + 1}
                    fill="rgba(0,0,0,0.1)"
                  />
                  {/* Peg */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={PEG_R}
                    fill={isSelected ? '#FFD700' : '#9CA3AF'}
                    stroke={isSelected ? '#F0C800' : '#6B7280'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-all duration-150"
                  />
                  {/* Pulse ring on last selected peg (visual hint to click again to close) */}
                  {isLast && !figuraCerrada && puntosSeleccionados.length >= 3 && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={PEG_R + 4}
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth={1.5}
                      opacity={0.5}
                    />
                  )}
                </g>
              )
            }),
          )}
        </svg>
      </div>

      {/* Point counter */}
      <p className="text-center text-sm text-gray-500">
        {puntosSeleccionados.length} punto
        {puntosSeleccionados.length !== 1 ? 's' : ''} seleccionado
        {puntosSeleccionados.length !== 1 ? 's' : ''}
        {figuraCerrada && (
          <span className="ml-1 text-amber-600 font-medium">
            — figura cerrada
          </span>
        )}
      </p>

      {/* Borrar button */}
      {!validado && puntosSeleccionados.length > 0 && (
        <button
          type="button"
          onClick={borrar}
          className="w-full py-2 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Borrar
        </button>
      )}

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
          disabled={!figuraCerrada}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              !figuraCerrada
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
