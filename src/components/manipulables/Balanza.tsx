'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { BalanzaSpec } from '@/types/tarea-cpa'

interface Props {
  spec: BalanzaSpec
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

function calcularLado(items: Array<{ tipo: 'x' | 'constante'; valor: number }>, x: number): number {
  return items.reduce((sum, item) => sum + (item.tipo === 'x' ? item.valor * x : item.valor), 0)
}

function formatearLado(items: Array<{ tipo: 'x' | 'constante'; valor: number }>): string {
  return items
    .map((item) => {
      if (item.tipo === 'x') return item.valor === 1 ? 'x' : `${item.valor}x`
      return String(item.valor)
    })
    .join(' + ')
}

export default function Balanza({
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
  const ladoIzq = calcularLado(spec.lado_izquierdo, numX)
  const ladoDer = calcularLado(spec.lado_derecho, numX)
  const diferencia = ladoIzq - ladoDer
  // Tilt angle: max +-12deg
  const tilt = Math.max(-12, Math.min(12, diferencia * 2))
  const equilibrada = Math.abs(diferencia) < 0.001

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
  }, [validado, numX, spec.solucion, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  // Render weight blocks for a side
  function renderPesas(items: Array<{ tipo: 'x' | 'constante'; valor: number }>, xVal: number) {
    const blocks: React.ReactNode[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.tipo === 'x') {
        const val = item.valor * xVal
        blocks.push(
          <div
            key={`x${i}`}
            className="flex items-center justify-center rounded-lg bg-purple-500 text-white text-xs font-bold min-w-[32px] h-8 px-2"
          >
            {valorX ? `x=${val}` : 'x=?'}
          </div>,
        )
      } else {
        blocks.push(
          <div
            key={`c${i}`}
            className="flex items-center justify-center rounded-lg bg-blue-500 text-white text-xs font-bold min-w-[32px] h-8 px-2"
          >
            {item.valor}
          </div>,
        )
      }
    }
    return blocks
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Balance SVG */}
      <div className="flex justify-center py-4">
        <div className="relative w-full max-w-sm">
          {/* Base */}
          <div className="flex justify-center">
            <svg width="200" height="140" viewBox="0 0 200 140" className="overflow-visible">
              {/* Fulcrum triangle */}
              <polygon points="100,60 85,90 115,90" fill="#6B7280" />
              {/* Base */}
              <rect x="60" y="90" width="80" height="8" rx="4" fill="#9CA3AF" />
              {/* Beam - rotates based on tilt */}
              <motion.g
                animate={{ rotate: validado ? 0 : tilt }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                style={{ originX: '100px', originY: '60px', transformOrigin: '100px 60px' }}
              >
                <rect x="10" y="56" width="180" height="8" rx="4" fill="#374151" />
                {/* Left pan string */}
                <line x1="30" y1="64" x2="30" y2="90" stroke="#6B7280" strokeWidth="2" />
                {/* Right pan string */}
                <line x1="170" y1="64" x2="170" y2="90" stroke="#6B7280" strokeWidth="2" />
                {/* Left pan */}
                <ellipse cx="30" cy="92" rx="35" ry="6" fill="#D1D5DB" />
                {/* Right pan */}
                <ellipse cx="170" cy="92" rx="35" ry="6" fill="#D1D5DB" />
              </motion.g>
              {/* Center pivot */}
              <circle cx="100" cy="60" r="6" fill="#4B5563" />
            </svg>
          </div>

          {/* Equation display */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
              {renderPesas(spec.lado_izquierdo, numX)}
            </div>
            <span className="text-lg font-bold text-gray-400">=</span>
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
              {renderPesas(spec.lado_derecho, numX)}
            </div>
          </div>

          {/* Equation text */}
          <p className="text-center text-sm text-gray-500 mt-2">
            {formatearLado(spec.lado_izquierdo)} = {formatearLado(spec.lado_derecho)}
          </p>

          {/* Balance status */}
          {valorX && !validado && (
            <p className={`text-center text-xs mt-1 font-medium ${equilibrada ? 'text-green-600' : 'text-orange-500'}`}>
              {equilibrada
                ? 'La balanza esta equilibrada!'
                : diferencia > 0
                  ? 'El lado izquierdo pesa mas'
                  : 'El lado derecho pesa mas'}
            </p>
          )}
        </div>
      </div>

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
