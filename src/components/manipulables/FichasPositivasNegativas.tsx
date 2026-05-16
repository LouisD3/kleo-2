'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { FichasPositivasNegativasSpec } from '@/types/tarea-cpa'

interface Props {
  spec: FichasPositivasNegativasSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  positivasRestantes: number
  negativasRestantes: number
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

// SVG chip components
function FichaPositiva() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" role="img" aria-label="Ficha positiva">
      <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="16" fill="url(#redShine)" opacity="0.3" />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="20"
        fontWeight="bold"
      >
        +
      </text>
      <defs>
        <radialGradient id="redShine" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function FichaNegativa() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" role="img" aria-label="Ficha negativa">
      <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="16" fill="url(#blueShine)" opacity="0.3" />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="22"
        fontWeight="bold"
      >
        &minus;
      </text>
      <defs>
        <radialGradient id="blueShine" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function FichasPositivasNegativas({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [positivasRestantes, setPositivasRestantes] = useState(
    estadoInicial?.positivasRestantes ?? spec.positivas,
  )
  const [negativasRestantes, setNegativasRestantes] = useState(
    estadoInicial?.negativasRestantes ?? spec.negativas,
  )
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)
  const [cancelando, setCancelando] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({
      positivasRestantes,
      negativasRestantes,
      intentos,
      pistaVisible,
      validado,
    })
  }, [positivasRestantes, negativasRestantes, intentos, pistaVisible, validado])

  const resultado = positivasRestantes - negativasRestantes
  const puedeCancelar = positivasRestantes > 0 && negativasRestantes > 0

  const cancelarPar = useCallback(() => {
    if (!puedeCancelar || validado || cancelando) return
    setCancelando(true)
    // Small delay for animation feel
    setTimeout(() => {
      setPositivasRestantes((p: number) => p - 1)
      setNegativasRestantes((n: number) => n - 1)
      setCancelando(false)
    }, 300)
  }, [puedeCancelar, validado, cancelando])

  const restaurar = useCallback(() => {
    if (validado) return
    setPositivasRestantes(spec.positivas)
    setNegativasRestantes(spec.negativas)
  }, [validado, spec.positivas, spec.negativas])

  const verificar = useCallback(() => {
    if (validado) return

    const nuevoIntentos = intentos + 1
    setIntentos(nuevoIntentos)

    const esValido = resultado === spec.resultado_objetivo

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
    resultado,
    spec.resultado_objetivo,
    spec.pista,
    intentos,
    intentos_para_pista,
    pistaVisible,
    onValidado,
  ])

  // Format result with sign
  const resultadoTexto = resultado > 0 ? `+${resultado}` : `${resultado}`

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Chips display area */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 min-h-[80px]">
        {/* Positive chips */}
        <div className="flex flex-wrap gap-1 justify-center mb-2">
          <AnimatePresence mode="popLayout">
            {Array.from({ length: positivasRestantes }, (_, i) => (
              <motion.div
                key={`pos-${i}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
                className="flex-shrink-0"
              >
                <FichaPositiva />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Divider */}
        {(positivasRestantes > 0 || negativasRestantes > 0) && (
          <div className="border-t border-dashed border-gray-300 my-2" />
        )}

        {/* Negative chips */}
        <div className="flex flex-wrap gap-1 justify-center mt-2">
          <AnimatePresence mode="popLayout">
            {Array.from({ length: negativasRestantes }, (_, i) => (
              <motion.div
                key={`neg-${i}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
                className="flex-shrink-0"
              >
                <FichaNegativa />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {positivasRestantes === 0 && negativasRestantes === 0 && (
          <p className="text-xs text-gray-300 text-center py-2">
            Todas las fichas se cancelaron
          </p>
        )}
      </div>

      {/* Live counter */}
      <div className="flex items-center justify-center gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="font-semibold text-gray-700">Positivas: {positivasRestantes}</span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          <span className="font-semibold text-gray-700">Negativas: {negativasRestantes}</span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="font-bold text-gray-900">Resultado: {resultadoTexto}</span>
      </div>

      {/* Action buttons */}
      {!validado && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={cancelarPar}
            disabled={!puedeCancelar || cancelando}
            className={`
              flex-1 py-3 rounded-xl text-sm font-semibold transition-all
              ${
                !puedeCancelar || cancelando
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]'
              }
            `}
          >
            Cancelar un par (+1 y -1)
          </button>
          <button
            type="button"
            onClick={restaurar}
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            Restaurar
          </button>
        </div>
      )}

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

      {/* Verify button */}
      {!validado && (
        <button
          type="button"
          onClick={verificar}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              errorFlash
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
              Lo lograste en {intentos} intento{intentos > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
