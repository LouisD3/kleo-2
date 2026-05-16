'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CompasCirculoSpec } from '@/types/tarea-cpa'

interface Props {
  spec: CompasCirculoSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  radio: number
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

const GRID_SPACING = 40
const PADDING = 40 // padding around the grid

export default function CompasCirculo({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [radio, setRadio] = useState(estadoInicial?.radio ?? 1)
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ radio, intentos, pistaVisible, validado })
  }, [radio, intentos, pistaVisible, validado])

  // Grid dimensions: enough to show center + max radius comfortably
  const maxRadiusUnits = Math.max(spec.radio_objetivo * 2, 6)
  const gridCols = Math.max(spec.centro[0] + maxRadiusUnits, maxRadiusUnits + 2)
  const gridRows = Math.max(spec.centro[1] + maxRadiusUnits, maxRadiusUnits + 2)

  // SVG dimensions
  const svgWidth = gridCols * GRID_SPACING + PADDING * 2
  const svgHeight = gridRows * GRID_SPACING + PADDING * 2

  // Center point in SVG coordinates
  const cx = spec.centro[0] * GRID_SPACING + PADDING
  const cy = spec.centro[1] * GRID_SPACING + PADDING

  // Circle radius in SVG units
  const radiusPx = radio * GRID_SPACING

  // Max slider value
  const maxSlider = Math.floor(Math.min(gridCols, gridRows) / 2)

  const elementos = spec.elementos_a_trazar ?? []

  const verificar = useCallback(() => {
    if (validado) return

    const esValido = Math.abs(radio - spec.radio_objetivo) < 0.1

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
  }, [validado, radio, spec.radio_objetivo, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  // Generate grid dots
  const dots: React.ReactNode[] = []
  for (let row = 0; row <= gridRows; row++) {
    for (let col = 0; col <= gridCols; col++) {
      dots.push(
        <circle
          key={`dot-${row}-${col}`}
          cx={col * GRID_SPACING + PADDING}
          cy={row * GRID_SPACING + PADDING}
          r={1.5}
          fill="#D1D5DB"
        />,
      )
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* SVG Canvas */}
      <div className="flex justify-center overflow-x-auto py-2">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="border border-gray-200 rounded-xl bg-white"
          style={{ maxWidth: '100%', height: 'auto' }}
          role="application"
          aria-label="Compas para trazar circulos"
        >
          {/* Grid dots */}
          {dots}

          {/* Circle */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={radiusPx}
            fill="rgba(255,215,0,0.1)"
            stroke="#FFD700"
            strokeWidth={3}
            initial={false}
            animate={{ r: radiusPx }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />

          {/* Diameter line (if requested) */}
          {elementos.includes('diametro') && (
            <motion.line
              x1={cx - radiusPx}
              y1={cy}
              x2={cx + radiusPx}
              y2={cy}
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="6 4"
              initial={false}
              animate={{
                x1: cx - radiusPx,
                x2: cx + radiusPx,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          )}

          {/* Radius line (if requested or always show for clarity) */}
          {elementos.includes('radio') && (
            <>
              <motion.line
                x1={cx}
                y1={cy}
                x2={cx + radiusPx}
                y2={cy}
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="6 4"
                initial={false}
                animate={{ x2: cx + radiusPx }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
              {/* Radius label */}
              <motion.text
                x={cx + radiusPx / 2}
                y={cy - 10}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="#EF4444"
                initial={false}
                animate={{ x: cx + radiusPx / 2 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                r = {radio}
              </motion.text>
            </>
          )}

          {/* Sector arc (if requested) — draw a filled quarter sector */}
          {elementos.includes('sector') && (
            <motion.path
              d={`M ${cx} ${cy} L ${cx + radiusPx} ${cy} A ${radiusPx} ${radiusPx} 0 0 1 ${cx} ${cy - radiusPx} Z`}
              fill="rgba(59,130,246,0.15)"
              stroke="#3B82F6"
              strokeWidth={1.5}
              initial={false}
              animate={{
                d: `M ${cx} ${cy} L ${cx + radiusPx} ${cy} A ${radiusPx} ${radiusPx} 0 0 1 ${cx} ${cy - radiusPx} Z`,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          )}

          {/* Chord (if requested) — horizontal chord offset above center */}
          {elementos.includes('cuerda') && radiusPx > 0 && (
            (() => {
              const chordY = cy - radiusPx * 0.5
              const halfChord = Math.sqrt(radiusPx * radiusPx - (radiusPx * 0.5) * (radiusPx * 0.5))
              return (
                <motion.line
                  x1={cx - halfChord}
                  y1={chordY}
                  x2={cx + halfChord}
                  y2={chordY}
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  initial={false}
                  animate={{
                    x1: cx - halfChord,
                    x2: cx + halfChord,
                    y1: chordY,
                    y2: chordY,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
              )
            })()
          )}

          {/* Center point — red dot with crosshair */}
          <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="#EF4444" strokeWidth={1.5} />
          <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="#EF4444" strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={4} fill="#EF4444" />
        </svg>
      </div>

      {/* Radius display */}
      <div className="text-center">
        <span className="text-sm font-semibold text-gray-700">
          Radio: <span className="text-lg text-yellow-600">{radio}</span> unidad{radio !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Slider */}
      <div className="flex items-center gap-3 px-2">
        <span className="text-xs text-gray-400 w-4 text-right">0</span>
        <input
          type="range"
          min={0}
          max={maxSlider}
          step={0.5}
          value={radio}
          onChange={(e) => !validado && setRadio(Number(e.target.value))}
          disabled={validado}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="text-xs text-gray-400 w-4">{maxSlider}</span>
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
          disabled={radio === 0}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              radio === 0
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
              Radio = {spec.radio_objetivo} unidades — Lo lograste en {intentos} intento{intentos > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
