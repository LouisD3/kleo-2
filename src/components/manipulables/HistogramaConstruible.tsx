'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { HistogramaConstruibleSpec } from '@/types/tarea-cpa'

interface Props {
  spec: HistogramaConstruibleSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  frecuencias: number[]
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

/** Map Spanish color names to hex values */
const COLOR_MAP: Record<string, string> = {
  amarillo: '#FFD700',
  azul: '#3B82F6',
  rojo: '#EF4444',
  verde: '#10B981',
  morado: '#8B5CF6',
  naranja: '#F97316',
  rosa: '#EC4899',
  gris: '#6B7280',
  celeste: '#06B6D4',
  cafe: '#92400E',
}

function resolveColor(color: string): string {
  return COLOR_MAP[color.toLowerCase()] ?? color
}

export default function HistogramaConstruible({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [frecuencias, setFrecuencias] = useState<number[]>(
    estadoInicial?.frecuencias ?? spec.categorias.map(() => 0),
  )
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ frecuencias, intentos, pistaVisible, validado })
  }, [frecuencias, intentos, pistaVisible, validado])

  const maxFrecuencia = Math.max(...spec.frecuencias_objetivo, 1)
  // Y-axis goes a bit above max to give room
  const yMax = maxFrecuencia + Math.max(1, Math.ceil(maxFrecuencia * 0.2))

  const setFrecuencia = useCallback(
    (index: number, value: number) => {
      if (validado) return
      setFrecuencias((prev) => {
        const next = [...prev]
        next[index] = Math.max(0, Math.min(yMax, value))
        return next
      })
    },
    [validado, yMax],
  )

  const verificar = useCallback(() => {
    if (validado) return

    const esValido = spec.frecuencias_objetivo.every((obj, i) => frecuencias[i] === obj)

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
  }, [validado, frecuencias, spec.frecuencias_objetivo, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  const hayAlgo = frecuencias.some((f) => f > 0)

  // Bar chart dimensions
  const BAR_WIDTH = 48
  const BAR_GAP = 16
  const CHART_HEIGHT = 180
  const Y_LABEL_WIDTH = 28
  const chartWidth = Y_LABEL_WIDTH + spec.categorias.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP

  // Y-axis ticks
  const yTicks: number[] = []
  const step = yMax <= 6 ? 1 : yMax <= 15 ? 2 : 5
  for (let t = 0; t <= yMax; t += step) {
    yTicks.push(t)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Raw data chips */}
      {spec.datos_brutos && spec.datos_brutos.length > 0 && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Datos
          </p>
          <div className="flex flex-wrap gap-1.5">
            {spec.datos_brutos.map((dato, i) => {
              // Find matching category to color the chip
              const cat = spec.categorias.find(
                (c) => c.label.toLowerCase() === dato.toLowerCase(),
              )
              const bg = cat ? resolveColor(cat.color) : '#E5E7EB'
              const textColor = cat ? '#fff' : '#374151'
              return (
                <span
                  key={`${dato}-${i}`}
                  className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: bg, color: textColor }}
                >
                  {dato}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Bar chart */}
      <div className="rounded-xl bg-white border border-gray-200 p-4 overflow-x-auto">
        <svg
          width={chartWidth}
          height={CHART_HEIGHT + 40}
          viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT + 40}`}
          className="mx-auto block"
          role="img"
          aria-label="Histograma"
        >
          {/* Y-axis line */}
          <line
            x1={Y_LABEL_WIDTH}
            y1={4}
            x2={Y_LABEL_WIDTH}
            y2={CHART_HEIGHT + 4}
            stroke="#D1D5DB"
            strokeWidth="1"
          />
          {/* X-axis line */}
          <line
            x1={Y_LABEL_WIDTH}
            y1={CHART_HEIGHT + 4}
            x2={chartWidth}
            y2={CHART_HEIGHT + 4}
            stroke="#D1D5DB"
            strokeWidth="1"
          />

          {/* Y-axis ticks & grid lines */}
          {yTicks.map((tick) => {
            const y = CHART_HEIGHT + 4 - (tick / yMax) * CHART_HEIGHT
            return (
              <g key={tick}>
                <line
                  x1={Y_LABEL_WIDTH - 4}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
                <text
                  x={Y_LABEL_WIDTH - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px]"
                  fill="#9CA3AF"
                >
                  {tick}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {spec.categorias.map((cat, i) => {
            const barHeight = (frecuencias[i] / yMax) * CHART_HEIGHT
            const x = Y_LABEL_WIDTH + BAR_GAP + i * (BAR_WIDTH + BAR_GAP)
            const y = CHART_HEIGHT + 4 - barHeight
            const color = resolveColor(cat.color)

            return (
              <g key={cat.label}>
                {/* Bar */}
                <motion.rect
                  x={x}
                  width={BAR_WIDTH}
                  rx={4}
                  fill={color}
                  initial={{ y: CHART_HEIGHT + 4, height: 0 }}
                  animate={{ y, height: Math.max(barHeight, 0) }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
                {/* Frequency label on top of bar */}
                {frecuencias[i] > 0 && (
                  <motion.text
                    x={x + BAR_WIDTH / 2}
                    textAnchor="middle"
                    className="text-[11px] font-bold"
                    fill="#374151"
                    initial={{ y: CHART_HEIGHT }}
                    animate={{ y: y - 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {frecuencias[i]}
                  </motion.text>
                )}
                {/* Category label */}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={CHART_HEIGHT + 20}
                  textAnchor="middle"
                  className="text-[10px] font-medium"
                  fill="#6B7280"
                >
                  {cat.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Steppers */}
      <div className="space-y-2">
        {spec.categorias.map((cat, i) => {
          const color = resolveColor(cat.color)
          return (
            <div
              key={cat.label}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3"
            >
              {/* Color dot */}
              <div
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700">{cat.label}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFrecuencia(i, frecuencias[i] - 1)}
                  disabled={validado || frecuencias[i] === 0}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-gray-900">{frecuencias[i]}</span>
                <button
                  type="button"
                  onClick={() => setFrecuencia(i, frecuencias[i] + 1)}
                  disabled={validado || frecuencias[i] >= yMax}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
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
          disabled={!hayAlgo}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              !hayAlgo
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
