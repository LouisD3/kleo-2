'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChocolateSecableSpec } from '@/types/tarea-cpa'

interface Props {
  spec: ChocolateSecableSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onDiagnostico?: (diagnostico: string) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  seleccionadas: boolean[]
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

const COLORS = [
  '#92400E', // chocolate dark
  '#78350F', // chocolate darker
  '#A16207', // caramel
  '#854D0E', // brown
]

export default function ChocolateSecable({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onDiagnostico,
  onChange,
}: Props) {
  const totalPiezas = spec.filas * spec.columnas
  const [seleccionadas, setSeleccionadas] = useState<boolean[]>(
    estadoInicial?.seleccionadas ?? Array(totalPiezas).fill(false),
  )
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ seleccionadas, intentos, pistaVisible, validado })
  }, [seleccionadas, intentos, pistaVisible, validado])

  function togglePieza(index: number) {
    if (validado) return
    setSeleccionadas((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  const numSeleccionadas = seleccionadas.filter(Boolean).length

  const verificar = useCallback(() => {
    if (validado) return

    const esValido = spec.soluciones_validas.some(
      (sol) => numSeleccionadas === sol.piezas_seleccionadas,
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
      if (onDiagnostico) {
        const esperado = spec.soluciones_validas[0].piezas_seleccionadas
        if (numSeleccionadas > esperado) {
          onDiagnostico(`Seleccionaste ${numSeleccionadas} piezas, pero la fraccion ${spec.fraccion_objetivo} necesita solo ${esperado}.`)
        } else {
          onDiagnostico(`Seleccionaste ${numSeleccionadas} piezas, pero necesitas ${esperado} para representar ${spec.fraccion_objetivo}.`)
        }
      }
    }
  }, [validado, numSeleccionadas, spec.soluciones_validas, spec.fraccion_objetivo, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado, onDiagnostico])

  // Piece dimensions
  const pieceW = 64
  const pieceH = 48
  const gap = 3
  const svgW = spec.columnas * (pieceW + gap) - gap + 16
  const svgH = spec.filas * (pieceH + gap) - gap + 16

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Chocolate grid */}
      <div className="flex justify-center">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="max-w-full h-auto"
          role="application"
          aria-label="Barra de chocolate partida"
        >
          {/* Background wrapper */}
          <rect
            x="2"
            y="2"
            width={svgW - 4}
            height={svgH - 4}
            rx="8"
            fill="#5C3317"
            opacity="0.3"
          />
          {Array.from({ length: totalPiezas }, (_, i) => {
            const fila = Math.floor(i / spec.columnas)
            const col = i % spec.columnas
            const x = 8 + col * (pieceW + gap)
            const y = 8 + fila * (pieceH + gap)
            const selected = seleccionadas[i]
            const colorBase = COLORS[i % COLORS.length]

            return (
              <g
                key={i}
                onClick={() => togglePieza(i)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
              >
                {/* Shadow */}
                <rect
                  x={x + 1}
                  y={y + 2}
                  width={pieceW}
                  height={pieceH}
                  rx="6"
                  fill="rgba(0,0,0,0.15)"
                />
                {/* Piece */}
                <rect
                  x={x}
                  y={y}
                  width={pieceW}
                  height={pieceH}
                  rx="6"
                  fill={selected ? '#FFD700' : colorBase}
                  stroke={selected ? '#F0C800' : 'rgba(0,0,0,0.2)'}
                  strokeWidth={selected ? 3 : 1}
                  className="transition-all duration-150"
                />
                {/* Shine */}
                <rect
                  x={x + 4}
                  y={y + 3}
                  width={pieceW - 8}
                  height={8}
                  rx="4"
                  fill="white"
                  opacity={selected ? 0.3 : 0.15}
                />
                {/* Groove lines */}
                <line
                  x1={x + pieceW / 2}
                  y1={y + 10}
                  x2={x + pieceW / 2}
                  y2={y + pieceH - 10}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="1"
                />
                <line
                  x1={x + 12}
                  y1={y + pieceH / 2}
                  x2={x + pieceW - 12}
                  y2={y + pieceH / 2}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="1"
                />
                {/* Check mark on selected */}
                {selected && (
                  <text
                    x={x + pieceW / 2}
                    y={y + pieceH / 2 + 5}
                    textAnchor="middle"
                    fontSize="18"
                    fill="#92400E"
                    fontWeight="bold"
                  >
                    ✓
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Counter */}
      <p className="text-center text-sm text-gray-500">
        {numSeleccionadas} de {totalPiezas} piezas seleccionadas
        <span className="text-gray-400 ml-1">
          ({spec.fraccion_objetivo} del total)
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
          disabled={numSeleccionadas === 0}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              numSeleccionadas === 0
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
