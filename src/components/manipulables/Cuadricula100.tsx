'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Cuadricula100Spec } from '@/types/tarea-cpa'

interface Props {
  spec: Cuadricula100Spec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  sombreadas: boolean[]
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

const TOTAL = 100
const COLS = 10
const CELL_SIZE = 32 // px — large enough for mobile touch (>28px)
const GAP = 2
const PAD = 8

export default function Cuadricula100({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [sombreadas, setSombreadas] = useState<boolean[]>(
    estadoInicial?.sombreadas ?? Array(TOTAL).fill(false),
  )
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  // Drag-to-paint state
  const [painting, setPainting] = useState(false)
  const paintModeRef = useRef<boolean>(true) // true = shade, false = unshade

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ sombreadas, intentos, pistaVisible, validado })
  }, [sombreadas, intentos, pistaVisible, validado])

  const numSombreadas = sombreadas.filter(Boolean).length

  // Toggle a single cell (on click without drag)
  function toggleCelda(index: number) {
    if (validado) return
    setSombreadas((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  // Drag-to-paint handlers
  function handlePointerDown(index: number) {
    if (validado) return
    setPainting(true)
    // Determine paint mode: if cell is unshaded, we shade; if shaded, we unshade
    paintModeRef.current = !sombreadas[index]
    setSombreadas((prev) => {
      const next = [...prev]
      next[index] = paintModeRef.current
      return next
    })
  }

  function handlePointerEnter(index: number) {
    if (!painting || validado) return
    setSombreadas((prev) => {
      if (prev[index] === paintModeRef.current) return prev
      const next = [...prev]
      next[index] = paintModeRef.current
      return next
    })
  }

  function handlePointerUp() {
    setPainting(false)
  }

  // Global pointer-up to stop painting if pointer leaves the SVG
  useEffect(() => {
    function onUp() {
      setPainting(false)
    }
    window.addEventListener('pointerup', onUp)
    return () => window.removeEventListener('pointerup', onUp)
  }, [])

  const verificar = useCallback(() => {
    if (validado) return

    const esValido = numSombreadas === spec.porcentaje_objetivo

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
  }, [validado, numSombreadas, spec.porcentaje_objetivo, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  const svgW = COLS * (CELL_SIZE + GAP) - GAP + PAD * 2
  const svgH = svgW // 10x10 so it's square

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* 10x10 Grid */}
      <div className="flex justify-center">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="max-w-full h-auto touch-none select-none"
          onPointerUp={handlePointerUp}
        >
          {/* Background */}
          <rect
            x="2"
            y="2"
            width={svgW - 4}
            height={svgH - 4}
            rx="8"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="1"
          />
          {Array.from({ length: TOTAL }, (_, i) => {
            const fila = Math.floor(i / COLS)
            const col = i % COLS
            const x = PAD + col * (CELL_SIZE + GAP)
            const y = PAD + fila * (CELL_SIZE + GAP)
            const shaded = sombreadas[i]

            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx="4"
                fill={shaded ? '#FFD700' : '#FFFFFF'}
                stroke={shaded ? '#F0C800' : '#D1D5DB'}
                strokeWidth={shaded ? 2 : 1}
                className="cursor-pointer transition-colors duration-100"
                onPointerDown={(e) => {
                  e.preventDefault()
                  handlePointerDown(i)
                }}
                onPointerEnter={() => handlePointerEnter(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleCelda(i)
                  }
                }}
              />
            )
          })}
        </svg>
      </div>

      {/* Counter */}
      <p className="text-center text-sm text-gray-500">
        {numSombreadas} de {TOTAL} sombreadas
        <span className="text-gray-400 ml-1">
          ({numSombreadas}%)
        </span>
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
          disabled={numSombreadas === 0}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              numSombreadas === 0
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
