'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TransportadorSpec } from '@/types/tarea-cpa'

interface Props {
  spec: TransportadorSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  angulo: number
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

const SVG_SIZE = 300
const CENTER_X = SVG_SIZE / 2
const CENTER_Y = SVG_SIZE - 30
const RADIUS = 120
const TICK_INNER = RADIUS - 10
const TICK_OUTER = RADIUS + 5
const LABEL_R = RADIUS + 20

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

export default function Transportador({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [angulo, setAngulo] = useState(estadoInicial?.angulo ?? (spec.angulo_inicial ?? 0))
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)
  const [dragging, setDragging] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ angulo, intentos, pistaVisible, validado })
  }, [angulo, intentos, pistaVisible, validado])

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging || validado || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - CENTER_X * (rect.width / SVG_SIZE)
      const y = e.clientY - rect.top - CENTER_Y * (rect.height / SVG_SIZE)
      // Angle from center, 0° = right, going counter-clockwise for protractor
      let deg = -Math.atan2(y, x) * (180 / Math.PI)
      if (deg < 0) deg += 360
      // Clamp to 0-180 (protractor range)
      deg = Math.min(180, Math.max(0, deg))
      setAngulo(Math.round(deg))
    },
    [dragging, validado],
  )

  const handlePointerUp = useCallback(() => setDragging(false), [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, [dragging, handlePointerMove, handlePointerUp])

  const tolerancia = spec.tolerancia ?? 5

  const verificar = useCallback(() => {
    if (validado) return
    const diff = Math.abs(angulo - spec.angulo_objetivo)
    const esValido = diff <= tolerancia
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
  }, [validado, angulo, spec.angulo_objetivo, tolerancia, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  // Arm endpoint
  const armX = CENTER_X + RADIUS * Math.cos(degToRad(-angulo))
  const armY = CENTER_Y + RADIUS * Math.sin(degToRad(-angulo))

  // Generate tick marks
  const ticks = []
  for (let d = 0; d <= 180; d += 10) {
    const rad = degToRad(-d)
    const x1 = CENTER_X + TICK_INNER * Math.cos(rad)
    const y1 = CENTER_Y + TICK_INNER * Math.sin(rad)
    const x2 = CENTER_X + TICK_OUTER * Math.cos(rad)
    const y2 = CENTER_Y + TICK_OUTER * Math.sin(rad)
    const isMajor = d % 30 === 0
    ticks.push(
      <line
        key={d}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isMajor ? '#374151' : '#9CA3AF'}
        strokeWidth={isMajor ? 1.5 : 0.8}
      />,
    )
    if (isMajor) {
      const lx = CENTER_X + LABEL_R * Math.cos(rad)
      const ly = CENTER_Y + LABEL_R * Math.sin(rad)
      ticks.push(
        <text
          key={`l-${d}`}
          x={lx}
          y={ly}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-[9px] font-medium"
          fill="#6B7280"
        >
          {d}°
        </text>,
      )
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">{spec.pregunta}</p>

      <div className="flex flex-col items-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE * 0.65}`}
          className="w-full max-w-sm touch-none select-none"
          role="img"
          aria-label={`Transportador mostrando ${angulo}°`}
        >
          {/* Protractor arc */}
          <path
            d={`M ${CENTER_X - RADIUS} ${CENTER_Y} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS} ${CENTER_Y}`}
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth={1.5}
          />

          {/* Angle fill arc */}
          {angulo > 0 && (
            <path
              d={`M ${CENTER_X + RADIUS * 0.4} ${CENTER_Y} A ${RADIUS * 0.4} ${RADIUS * 0.4} 0 ${angulo > 180 ? 1 : 0} 1 ${CENTER_X + RADIUS * 0.4 * Math.cos(degToRad(-angulo))} ${CENTER_Y + RADIUS * 0.4 * Math.sin(degToRad(-angulo))}`}
              fill="#FFD700"
              opacity={0.3}
              stroke="none"
            />
          )}

          {/* Ticks */}
          {ticks}

          {/* Base line */}
          <line
            x1={CENTER_X - RADIUS}
            y1={CENTER_Y}
            x2={CENTER_X + RADIUS}
            y2={CENTER_Y}
            stroke="#374151"
            strokeWidth={2}
          />

          {/* Arm */}
          <line
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={armX}
            y2={armY}
            stroke={validado ? '#10B981' : '#EF4444'}
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Draggable handle */}
          <circle
            cx={armX}
            cy={armY}
            r={12}
            fill={validado ? '#10B981' : '#FFD700'}
            stroke="white"
            strokeWidth={2}
            className={`${validado ? '' : 'cursor-grab'}`}
            onPointerDown={(e) => {
              if (!validado) {
                setDragging(true)
                e.preventDefault()
              }
            }}
          />

          {/* Center dot */}
          <circle cx={CENTER_X} cy={CENTER_Y} r={4} fill="#374151" />

          {/* Angle label */}
          <text
            x={CENTER_X}
            y={CENTER_Y - RADIUS * 0.6}
            textAnchor="middle"
            className="text-[16px] font-bold"
            fill="#374151"
          >
            {angulo}°
          </text>
        </svg>

        <p className="text-xs text-gray-500 mt-1">Arrastra el punto amarillo para medir el angulo</p>
      </div>

      {pistaVisible && spec.pista && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800"
        >
          💡 {spec.pista}
        </motion.div>
      )}

      {!validado && (
        <button
          type="button"
          onClick={verificar}
          className={`w-full rounded-xl py-3 font-bold text-white transition ${
            errorFlash ? 'bg-red-500 animate-[shake_0.3s_ease-in-out]' : 'bg-amarillo hover:bg-amarillo-hover text-gray-900'
          }`}
        >
          {errorFlash ? 'Intenta de nuevo' : 'Verificar'}
        </button>
      )}

      {validado && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center"
        >
          <p className="font-bold text-green-700">Correcto!</p>
          <p className="text-sm text-green-600 mt-1">
            El angulo mide {spec.angulo_objetivo}°
          </p>
        </motion.div>
      )}
    </div>
  )
}
