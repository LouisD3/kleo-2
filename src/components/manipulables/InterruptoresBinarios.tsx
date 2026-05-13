'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { InterruptoresBinariosSpec } from '@/types/tarea-cpa'

interface Props {
  spec: InterruptoresBinariosSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  bits: boolean[]
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

/** Superscript digits for power labels */
const SUPERSCRIPTS: Record<string, string> = {
  '0': '\u2070',
  '1': '\u00B9',
  '2': '\u00B2',
  '3': '\u00B3',
  '4': '\u2074',
  '5': '\u2075',
  '6': '\u2076',
  '7': '\u2077',
  '8': '\u2078',
  '9': '\u2079',
}

function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((d) => SUPERSCRIPTS[d] ?? d)
    .join('')
}

export default function InterruptoresBinarios({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [bits, setBits] = useState<boolean[]>(
    estadoInicial?.bits ?? Array.from({ length: spec.num_bits }, () => false),
  )
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ bits, intentos, pistaVisible, validado })
  }, [bits, intentos, pistaVisible, validado])

  /** Decimal value from current bit state (MSB first) */
  const valorDecimal = bits.reduce((acc, bit, i) => acc + (bit ? 2 ** (spec.num_bits - 1 - i) : 0), 0)

  const toggleBit = useCallback(
    (index: number) => {
      if (validado) return
      setBits((prev) => {
        const next = [...prev]
        next[index] = !next[index]
        return next
      })
    },
    [validado],
  )

  const verificar = useCallback(() => {
    if (validado) return

    const nuevoIntentos = intentos + 1
    setIntentos(nuevoIntentos)

    if (valorDecimal === spec.valor_objetivo) {
      setValidado(true)
      onValidado(nuevoIntentos, pistaVisible)
    } else {
      setErrorFlash(true)
      setTimeout(() => setErrorFlash(false), 600)
      if (nuevoIntentos >= intentos_para_pista && spec.pista) {
        setPistaVisible(true)
      }
    }
  }, [validado, valorDecimal, spec.valor_objetivo, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Target display */}
      <div className="text-center">
        <span className="text-sm text-gray-500">Objetivo: </span>
        <span className="text-lg font-bold text-gray-900">{spec.valor_objetivo}</span>
      </div>

      {/* Switches row */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
        <div className="flex items-center justify-center gap-4">
          {bits.map((on, i) => {
            const power = spec.num_bits - 1 - i
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                {/* Power label */}
                <span className="text-xs font-semibold text-gray-500">
                  2{toSuperscript(power)}
                </span>
                <span className="text-[10px] text-gray-400">= {2 ** power}</span>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => toggleBit(i)}
                  disabled={validado}
                  className="relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-60"
                  style={{ backgroundColor: on ? '#FFD700' : '#D1D5DB' }}
                  aria-label={`Bit ${power}: ${on ? 'encendido' : 'apagado'}`}
                >
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                    animate={{ left: on ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>

                {/* Bit label */}
                <span className={`text-sm font-bold ${on ? 'text-gray-900' : 'text-gray-400'}`}>
                  {on ? '1' : '0'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Live decimal counter */}
      <div className="text-center">
        <span className="text-sm text-gray-500">Valor decimal: </span>
        <span className="text-2xl font-black text-gray-900">{valorDecimal}</span>
        <span className="text-sm text-gray-400 ml-2">/ {spec.valor_objetivo}</span>
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
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              errorFlash
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
