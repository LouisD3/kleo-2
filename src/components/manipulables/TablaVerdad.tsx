'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TablaVerdadSpec } from '@/types/tarea-cpa'

interface Props {
  spec: TablaVerdadSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  respuestas: (boolean | null)[] // one per row, null = unanswered
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

/**
 * Generate all truth-value combinations for `n` variables.
 * Returns 2^n rows, each row is an array of booleans.
 * Order: [TT, TF, FT, FF] for 2 variables.
 */
function generarCombinaciones(n: number): boolean[][] {
  const total = 2 ** n
  const rows: boolean[][] = []
  for (let i = 0; i < total; i++) {
    const row: boolean[] = []
    for (let j = n - 1; j >= 0; j--) {
      row.push(Boolean((i >> j) & 1) === false) // MSB first, true first
    }
    rows.push(row)
  }
  return rows
}

export default function TablaVerdad({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const numFilas = 2 ** spec.variables.length
  const combinaciones = generarCombinaciones(spec.variables.length)

  const [respuestas, setRespuestas] = useState<(boolean | null)[]>(
    estadoInicial?.respuestas ?? Array(numFilas).fill(null),
  )
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ respuestas, intentos, pistaVisible, validado })
  }, [respuestas, intentos, pistaVisible, validado])

  function toggleCelda(index: number) {
    if (validado) return
    setRespuestas((prev) => {
      const next = [...prev]
      if (next[index] === null) {
        next[index] = true
      } else if (next[index] === true) {
        next[index] = false
      } else {
        next[index] = null
      }
      return next
    })
  }

  const todasRespondidas = respuestas.every((r) => r !== null)

  const verificar = useCallback(() => {
    if (validado || !todasRespondidas) return

    const esValido = spec.valores_objetivo.every(
      (val, i) => respuestas[i] === val,
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
  }, [validado, todasRespondidas, spec.valores_objetivo, spec.pista, respuestas, intentos, intentos_para_pista, pistaVisible, onValidado])

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Truth table */}
      <div className="flex justify-center overflow-x-auto">
        <table className="border-collapse rounded-xl overflow-hidden text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-gray-900 text-white">
              {spec.variables.map((v) => (
                <th
                  key={v}
                  className="px-4 py-3 font-semibold text-center min-w-[56px]"
                >
                  {v}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-center min-w-[120px] border-l-2 border-gray-700">
                {spec.expresion}
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {combinaciones.map((fila, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-gray-200 ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                {/* Variable columns (read-only) */}
                {fila.map((val, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-3 text-center font-medium ${
                      val ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {val ? 'V' : 'F'}
                  </td>
                ))}

                {/* Result column (interactive) */}
                <td className="px-2 py-2 text-center border-l-2 border-gray-200">
                  <button
                    type="button"
                    onClick={() => toggleCelda(rowIndex)}
                    disabled={validado}
                    className={`
                      w-full min-w-[56px] min-h-[44px] rounded-lg font-bold text-base
                      transition-all duration-150
                      ${validado ? 'cursor-default' : 'cursor-pointer active:scale-95'}
                      ${
                        respuestas[rowIndex] === null
                          ? 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                          : respuestas[rowIndex] === true
                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                            : 'bg-red-100 text-red-600 border-2 border-red-300'
                      }
                    `}
                  >
                    {respuestas[rowIndex] === null
                      ? '?'
                      : respuestas[rowIndex]
                        ? 'V'
                        : 'F'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Counter */}
      <p className="text-center text-sm text-gray-500">
        {respuestas.filter((r) => r !== null).length} de {numFilas} celdas completadas
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
          disabled={!todasRespondidas}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              !todasRespondidas
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
