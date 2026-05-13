'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { BloquesBase10Spec } from '@/types/tarea-cpa'

interface Props {
  spec: BloquesBase10Spec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  unidades: number
  barras: number
  cuadrados: number
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

// SVG pieces for base-10 blocks
function UnidadSVG() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#3B82F6" stroke="#2563EB" strokeWidth="1" />
      <rect x="5" y="4" width="14" height="4" rx="2" fill="white" opacity="0.2" />
    </svg>
  )
}

function BarraSVG() {
  return (
    <svg width="24" height="80" viewBox="0 0 24 80">
      <rect x="2" y="2" width="20" height="76" rx="3" fill="#10B981" stroke="#059669" strokeWidth="1" />
      {Array.from({ length: 10 }, (_, i) => (
        <line key={i} x1="4" y1={9.6 + i * 7.6} x2="20" y2={9.6 + i * 7.6} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      ))}
      <rect x="5" y="4" width="14" height="4" rx="2" fill="white" opacity="0.2" />
    </svg>
  )
}

function CuadradoSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <rect x="2" y="2" width="76" height="76" rx="4" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <line x1="2" y1={9.6 + i * 7.6} x2="78" y2={9.6 + i * 7.6} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          <line x1={9.6 + i * 7.6} y1="2" x2={9.6 + i * 7.6} y2="78" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        </g>
      ))}
      <rect x="5" y="4" width="70" height="6" rx="3" fill="white" opacity="0.15" />
    </svg>
  )
}

export default function BloquesBase10({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [unidades, setUnidades] = useState(estadoInicial?.unidades ?? 0)
  const [barras, setBarras] = useState(estadoInicial?.barras ?? 0)
  const [cuadrados, setCuadrados] = useState(estadoInicial?.cuadrados ?? 0)
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ unidades, barras, cuadrados, intentos, pistaVisible, validado })
  }, [unidades, barras, cuadrados, intentos, pistaVisible, validado])

  const valorActual = cuadrados * 100 + barras * 10 + unidades

  const verificar = useCallback(() => {
    if (validado) return

    const esValido = spec.soluciones_validas.some(
      (sol) => sol.unidades === unidades && sol.barras === barras && sol.cuadrados === cuadrados,
    )

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
  }, [validado, unidades, barras, cuadrados, spec.soluciones_validas, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  function Stepper({
    label,
    value,
    max,
    onChangeValue,
    icon,
    valueLabel,
  }: {
    label: string
    value: number
    max: number
    onChangeValue: (v: number) => void
    icon: React.ReactNode
    valueLabel: string
  }) {
    return (
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-xs text-gray-400">{valueLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeValue(Math.max(0, value - 1))}
            disabled={validado || value === 0}
            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-gray-900">{value}</span>
          <button
            type="button"
            onClick={() => onChangeValue(Math.min(max, value + 1))}
            disabled={validado || value >= max}
            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Visual preview */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex flex-wrap items-end gap-2 justify-center min-h-[100px]">
        {Array.from({ length: cuadrados }, (_, i) => (
          <motion.div key={`c${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
            <CuadradoSVG />
          </motion.div>
        ))}
        {Array.from({ length: barras }, (_, i) => (
          <motion.div key={`b${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
            <BarraSVG />
          </motion.div>
        ))}
        {Array.from({ length: unidades }, (_, i) => (
          <motion.div key={`u${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
            <UnidadSVG />
          </motion.div>
        ))}
        {valorActual === 0 && (
          <span className="text-xs text-gray-300">Agrega bloques con los controles</span>
        )}
      </div>

      {/* Current value display */}
      <div className="text-center">
        <span className="text-2xl font-black text-gray-900">{valorActual}</span>
        <span className="text-sm text-gray-400 ml-2">/ {spec.numero_objetivo}</span>
      </div>

      {/* Steppers */}
      <div className="space-y-2">
        <Stepper
          label="Cuadrados"
          valueLabel="= 100 cada uno"
          value={cuadrados}
          max={spec.unidades_disponibles.cuadrados}
          onChangeValue={setCuadrados}
          icon={<CuadradoSVG />}
        />
        <Stepper
          label="Barras"
          valueLabel="= 10 cada una"
          value={barras}
          max={spec.unidades_disponibles.barras}
          onChangeValue={setBarras}
          icon={<BarraSVG />}
        />
        <Stepper
          label="Unidades"
          valueLabel="= 1 cada una"
          value={unidades}
          max={spec.unidades_disponibles.unidades}
          onChangeValue={setUnidades}
          icon={<UnidadSVG />}
        />
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
          disabled={valorActual === 0}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              valorActual === 0
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
