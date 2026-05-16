'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RectaNumericaSpec } from '@/types/tarea-cpa'

interface Props {
  spec: RectaNumericaSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  posicion: number | null
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

// SVG layout constants
const PADDING_X = 40
const SVG_WIDTH = 360
const SVG_HEIGHT = 120
const LINE_Y = 60
const TICK_HEIGHT = 12
const LINE_X_START = PADDING_X
const LINE_X_END = SVG_WIDTH - PADDING_X
const LINE_LENGTH = LINE_X_END - LINE_X_START

export default function RectaNumerica({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [posicion, setPosicion] = useState<number | null>(estadoInicial?.posicion ?? null)
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)
  const [dragging, setDragging] = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ posicion, intentos, pistaVisible, validado })
  }, [posicion, intentos, pistaVisible, validado])

  // Convert a value in [min, max] to an SVG x coordinate
  const valorAX = useCallback(
    (valor: number): number => {
      const ratio = (valor - spec.min) / (spec.max - spec.min)
      return LINE_X_START + ratio * LINE_LENGTH
    },
    [spec.min, spec.max],
  )

  // Convert an SVG x coordinate to the nearest tick value
  const xAValorSnap = useCallback(
    (x: number): number => {
      const ratio = Math.max(0, Math.min(1, (x - LINE_X_START) / LINE_LENGTH))
      const valorContinuo = spec.min + ratio * (spec.max - spec.min)
      // Snap to nearest tick
      const paso = (spec.max - spec.min) / spec.divisiones
      const tickIndex = Math.round((valorContinuo - spec.min) / paso)
      const snapped = spec.min + tickIndex * paso
      // Round to avoid floating-point noise
      return Math.round(snapped * 1e10) / 1e10
    },
    [spec.min, spec.max, spec.divisiones],
  )

  // Get pointer x relative to SVG
  const getPointerX = useCallback(
    (e: React.PointerEvent<SVGSVGElement> | PointerEvent): number | null => {
      const svg = svgRef.current
      if (!svg) return null
      const rect = svg.getBoundingClientRect()
      // Map client x to SVG coordinate system
      const clientX = e.clientX
      const svgX = ((clientX - rect.left) / rect.width) * SVG_WIDTH
      return svgX
    },
    [],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (validado) return
      e.preventDefault()
      ;(e.target as Element).hasPointerCapture?.(e.pointerId) ||
        (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId)
      setDragging(true)
      const x = getPointerX(e)
      if (x !== null) {
        setPosicion(xAValorSnap(x))
      }
    },
    [validado, getPointerX, xAValorSnap],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging || validado) return
      e.preventDefault()
      const x = getPointerX(e)
      if (x !== null) {
        setPosicion(xAValorSnap(x))
      }
    },
    [dragging, validado, getPointerX, xAValorSnap],
  )

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  // Build tick marks
  const ticks: Array<{ valor: number; x: number }> = []
  const paso = (spec.max - spec.min) / spec.divisiones
  for (let i = 0; i <= spec.divisiones; i++) {
    const valor = Math.round((spec.min + i * paso) * 1e10) / 1e10
    ticks.push({ valor, x: valorAX(valor) })
  }

  // Build label map: posicion -> texto
  const labelMap = new Map<number, string>()
  // Always label min and max
  labelMap.set(spec.min, formatearNumero(spec.min))
  labelMap.set(spec.max, formatearNumero(spec.max))
  // Custom labels
  if (spec.etiquetas) {
    for (const et of spec.etiquetas) {
      labelMap.set(et.posicion, et.texto)
    }
  }

  const verificar = useCallback(() => {
    if (validado || posicion === null) return

    const tolerancia = spec.tolerancia ?? 0
    const esValido = Math.abs(posicion - spec.objetivo) <= tolerancia

    const nuevoIntentos = intentos + 1
    setIntentos(nuevoIntentos)

    if (esValido) {
      setValidado(true)
      onValidado(nuevoIntentos, pistaVisible)
    } else {
      setErrorFlash(true)
      setTimeout(() => setErrorFlash(false), 600)
      if (nuevoIntentos >= intentos_para_pista && spec.pista) {
        setPistaVisible(true)
      }
    }
  }, [validado, posicion, spec.objetivo, spec.tolerancia, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  const markerX = posicion !== null ? valorAX(posicion) : null

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Number line SVG */}
      <div className="flex justify-center py-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full max-w-md touch-none select-none"
          role="application"
          aria-label="Recta numerica interactiva"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Main line */}
          <line
            x1={LINE_X_START}
            y1={LINE_Y}
            x2={LINE_X_END}
            y2={LINE_Y}
            stroke="#374151"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Arrowheads */}
          <polygon
            points={`${LINE_X_START - 6},${LINE_Y} ${LINE_X_START + 2},${LINE_Y - 5} ${LINE_X_START + 2},${LINE_Y + 5}`}
            fill="#374151"
          />
          <polygon
            points={`${LINE_X_END + 6},${LINE_Y} ${LINE_X_END - 2},${LINE_Y - 5} ${LINE_X_END - 2},${LINE_Y + 5}`}
            fill="#374151"
          />

          {/* Tick marks */}
          {ticks.map((tick) => {
            const isEndpoint = tick.valor === spec.min || tick.valor === spec.max
            const hasLabel = labelMap.has(tick.valor)
            return (
              <g key={tick.valor}>
                <line
                  x1={tick.x}
                  y1={LINE_Y - (isEndpoint ? TICK_HEIGHT : TICK_HEIGHT * 0.7)}
                  x2={tick.x}
                  y2={LINE_Y + (isEndpoint ? TICK_HEIGHT : TICK_HEIGHT * 0.7)}
                  stroke="#6B7280"
                  strokeWidth={isEndpoint ? 2 : 1.5}
                />
                {hasLabel && (
                  <text
                    x={tick.x}
                    y={LINE_Y + TICK_HEIGHT + 14}
                    textAnchor="middle"
                    className="text-[11px] fill-gray-600 font-medium select-none"
                  >
                    {labelMap.get(tick.valor)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Draggable marker */}
          {markerX !== null && (
            <g>
              {/* Value label above marker */}
              <text
                x={markerX}
                y={LINE_Y - TICK_HEIGHT - 10}
                textAnchor="middle"
                className="text-[12px] fill-gray-800 font-bold select-none"
              >
                {formatearNumero(posicion!)}
              </text>

              {/* Marker circle */}
              <motion.circle
                cx={markerX}
                cy={LINE_Y}
                r={validado ? 10 : dragging ? 12 : 10}
                fill={validado ? '#22C55E' : '#FFD700'}
                stroke={validado ? '#16A34A' : '#F0C800'}
                strokeWidth={2.5}
                style={{ cursor: validado ? 'default' : 'grab' }}
                animate={{
                  cx: markerX,
                  r: validado ? 10 : dragging ? 12 : 10,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />

              {/* Down-pointing triangle below the circle */}
              <polygon
                points={`${markerX - 5},${LINE_Y + 14} ${markerX + 5},${LINE_Y + 14} ${markerX},${LINE_Y + 20}`}
                fill={validado ? '#22C55E' : '#FFD700'}
              />
            </g>
          )}

          {/* Tap prompt if no position set */}
          {posicion === null && !validado && (
            <text
              x={SVG_WIDTH / 2}
              y={LINE_Y - 24}
              textAnchor="middle"
              className="text-[11px] fill-gray-400 select-none"
            >
              Toca la recta para colocar el marcador
            </text>
          )}
        </svg>
      </div>

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
          disabled={posicion === null}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              posicion === null
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : errorFlash
                  ? 'bg-amber-500 text-white animate-[shake_0.3s_ease-in-out]'
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
              {formatearNumero(spec.objetivo)} — Lo lograste en {intentos} intento{intentos > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Format a number for display: remove trailing zeros, handle decimals */
function formatearNumero(n: number): string {
  // Use toPrecision to avoid floating point display issues, then strip trailing zeros
  const s = Number(n.toPrecision(10)).toString()
  return s
}
