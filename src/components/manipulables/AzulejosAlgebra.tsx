'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { AzulejosAlgebraSpec } from '@/types/tarea-cpa'

interface Props {
  spec: AzulejosAlgebraSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  valorX: string
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

const XBAR_W = 60
const XBAR_H = 24
const UNIT_SIZE = 24
const GAP = 6

/** Render x-bar tiles (purple rectangles with "x" label) */
function renderXBarras(count: number, offsetX: number, offsetY: number) {
  const tiles: React.ReactNode[] = []
  for (let i = 0; i < count; i++) {
    const x = offsetX + i * (XBAR_W + GAP)
    tiles.push(
      <g key={`xbar-${i}`}>
        <rect x={x} y={offsetY} width={XBAR_W} height={XBAR_H} rx={4} fill="#8B5CF6" />
        <text
          x={x + XBAR_W / 2}
          y={offsetY + XBAR_H / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={12}
          fontWeight="bold"
        >
          x
        </text>
      </g>,
    )
  }
  return tiles
}

/** Render unit square tiles (green squares with "1" label) */
function renderUnidades(count: number, offsetX: number, offsetY: number) {
  const tiles: React.ReactNode[] = []
  for (let i = 0; i < count; i++) {
    const x = offsetX + i * (UNIT_SIZE + GAP)
    tiles.push(
      <g key={`unit-${i}`}>
        <rect x={x} y={offsetY} width={UNIT_SIZE} height={UNIT_SIZE} rx={3} fill="#10B981" />
        <text
          x={x + UNIT_SIZE / 2}
          y={offsetY + UNIT_SIZE / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={11}
          fontWeight="bold"
        >
          1
        </text>
      </g>,
    )
  }
  return tiles
}

/** Calculate width needed for a side's tiles */
function calcSideWidth(xBarras: number, unidades: number): number {
  let w = 0
  if (xBarras > 0) w += xBarras * (XBAR_W + GAP) - GAP
  if (xBarras > 0 && unidades > 0) w += GAP * 2 // extra gap between x-bars and units
  if (unidades > 0) w += unidades * (UNIT_SIZE + GAP) - GAP
  return Math.max(w, 40)
}

export default function AzulejosAlgebra({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [valorX, setValorX] = useState(estadoInicial?.valorX ?? '')
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ valorX, intentos, pistaVisible, validado })
  }, [valorX, intentos, pistaVisible, validado])

  const numX = Number(valorX) || 0

  const verificar = useCallback(() => {
    if (validado) return

    const esValido = numX === spec.solucion

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
  }, [
    validado,
    numX,
    spec.solucion,
    spec.pista,
    intentos,
    intentos_para_pista,
    pistaVisible,
    onValidado,
  ])

  // Calculate SVG dimensions
  const { lado_izquierdo: izq, lado_derecho: der } = spec
  const leftWidth = calcSideWidth(izq.x_barras, izq.unidades)
  const rightWidth = calcSideWidth(der.x_barras, der.unidades)
  const padding = 16
  const equalSignWidth = 32
  const svgWidth = padding + leftWidth + padding + equalSignWidth + padding + rightWidth + padding
  const svgHeight = 64

  // Y positions: center tiles vertically
  const tileY = (svgHeight - XBAR_H) / 2
  const unitY = (svgHeight - UNIT_SIZE) / 2

  // Compute what each side totals with current x value
  const totalIzq = izq.x_barras * numX + izq.unidades
  const totalDer = der.x_barras * numX + der.unidades
  const equilibrado = valorX !== '' && totalIzq === totalDer

  // Left side tile positions
  const leftStartX = padding
  let leftCursor = leftStartX

  // Right side starts after left + equals sign
  const eqX = padding + leftWidth + padding
  const rightStartX = eqX + equalSignWidth + padding
  let rightCursor = rightStartX

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Equation text */}
      <p className="text-center text-lg font-bold text-gray-700">{spec.ecuacion}</p>

      {/* Algebra tiles SVG */}
      <div className="flex justify-center py-2 overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="max-w-full"
          role="img"
          aria-label="Azulejos de algebra"
        >
          {/* Left side background */}
          <rect
            x={0}
            y={0}
            width={padding + leftWidth + padding}
            height={svgHeight}
            rx={8}
            fill="#F3F4F6"
          />

          {/* Right side background */}
          <rect
            x={eqX + equalSignWidth}
            y={0}
            width={padding + rightWidth + padding}
            height={svgHeight}
            rx={8}
            fill="#F3F4F6"
          />

          {/* Equals sign */}
          <text
            x={eqX + equalSignWidth / 2}
            y={svgHeight / 2 + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={20}
            fontWeight="bold"
            fill="#9CA3AF"
          >
            =
          </text>

          {/* Left side: x-bars then units */}
          {renderXBarras(izq.x_barras, leftStartX, tileY)}
          {(() => {
            leftCursor = leftStartX
            if (izq.x_barras > 0) leftCursor += izq.x_barras * (XBAR_W + GAP) + GAP
            return renderUnidades(izq.unidades, leftCursor, unitY)
          })()}

          {/* Right side: x-bars then units */}
          {renderXBarras(der.x_barras, rightStartX, tileY)}
          {(() => {
            rightCursor = rightStartX
            if (der.x_barras > 0) rightCursor += der.x_barras * (XBAR_W + GAP) + GAP
            return renderUnidades(der.unidades, rightCursor, unitY)
          })()}
        </svg>
      </div>

      {/* Evaluation feedback when student enters a value */}
      {valorX !== '' && !validado && (
        <div className="flex items-center justify-center gap-6 text-sm">
          <span className="text-gray-500">
            Lado izquierdo = <span className="font-bold text-gray-800">{totalIzq}</span>
          </span>
          <span className={`font-bold ${equilibrado ? 'text-green-600' : 'text-orange-500'}`}>
            {equilibrado ? '=' : '\u2260'}
          </span>
          <span className="text-gray-500">
            Lado derecho = <span className="font-bold text-gray-800">{totalDer}</span>
          </span>
        </div>
      )}

      {/* X input */}
      <div className="flex items-center gap-3 justify-center">
        <label className="text-sm font-semibold text-gray-700">x =</label>
        <input
          type="number"
          value={valorX}
          onChange={(e) => !validado && setValorX(e.target.value)}
          disabled={validado}
          className="w-24 text-center text-lg font-bold border-2 border-gray-300 rounded-xl px-3 py-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all disabled:bg-gray-50"
          placeholder="?"
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
          disabled={!valorX}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              !valorX
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
              x = {spec.solucion} — Lo lograste en {intentos} intento{intentos > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
