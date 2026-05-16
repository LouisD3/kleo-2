'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PatronFigurasSpec } from '@/types/tarea-cpa'

interface Props {
  spec: PatronFigurasSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  piezasColocadas: number
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

// ── Colors per term ────────────────────────────────────────────────
const TERM_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F97316', '#EC4899']
const BUILD_COLOR = '#FFD700'

// ── SVG shape components (24x24 viewBox) ───────────────────────────

function CuadradoSVG({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="3" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <rect x="5" y="4" width="14" height="4" rx="2" fill="white" opacity="0.2" />
    </svg>
  )
}

function TrianguloSVG({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <polygon points="12,2 22,22 2,22" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeLinejoin="round" />
      <polygon points="12,6 17,18 7,18" fill="white" opacity="0.1" />
    </svg>
  )
}

function CirculoSVG({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <ellipse cx="10" cy="8" rx="5" ry="3" fill="white" opacity="0.15" />
    </svg>
  )
}

function PiezaSVG({ tipo, color }: { tipo: PatronFigurasSpec['tipo_pieza']; color: string }) {
  switch (tipo) {
    case 'cuadrado':
      return <CuadradoSVG color={color} />
    case 'triangulo':
      return <TrianguloSVG color={color} />
    case 'circulo':
      return <CirculoSVG color={color} />
  }
}

// ── Grid layout for pieces within a term ───────────────────────────
// Arrange N pieces in a roughly square grid
function PiezasGrid({
  count,
  tipo,
  color,
  animate = false,
}: {
  count: number
  tipo: PatronFigurasSpec['tipo_pieza']
  color: string
  animate?: boolean
}) {
  const cols = Math.ceil(Math.sqrt(count))

  return (
    <div
      className="grid gap-1 justify-items-center"
      style={{ gridTemplateColumns: `repeat(${cols}, 24px)` }}
    >
      {Array.from({ length: count }, (_, i) => {
        const piece = <PiezaSVG key={i} tipo={tipo} color={color} />
        if (animate) {
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 400, damping: 20 }}
            >
              {piece}
            </motion.div>
          )
        }
        return <div key={i}>{piece}</div>
      })}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────

export default function PatronFiguras({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [piezasColocadas, setPiezasColocadas] = useState(estadoInicial?.piezasColocadas ?? 0)
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ piezasColocadas, intentos, pistaVisible, validado })
  }, [piezasColocadas, intentos, pistaVisible, validado])

  const maxPiezas = spec.termino_objetivo + 5 // allow some overshoot

  const verificar = useCallback(() => {
    if (validado) return

    const esValido = piezasColocadas === spec.termino_objetivo
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
  }, [validado, piezasColocadas, spec.termino_objetivo, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  const terminoObjetivoIndex = spec.terminos.length + 1

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Existing terms + build zone */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 overflow-x-auto">
        <div className="flex items-end gap-4 min-w-min">
          {/* Existing terms */}
          {spec.terminos.map((count, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <PiezasGrid
                count={count}
                tipo={spec.tipo_pieza}
                color={TERM_COLORS[i % TERM_COLORS.length]}
              />
              <span className="text-xs font-semibold text-gray-500">
                Termino {i + 1}
              </span>
              <span className="text-xs text-gray-400">{count} pieza{count !== 1 ? 's' : ''}</span>
            </div>
          ))}

          {/* Arrow separator */}
          <div className="flex items-center self-center px-1 text-gray-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          {/* Build zone */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`
                rounded-xl border-2 border-dashed p-3 min-w-[72px] min-h-[72px]
                flex items-center justify-center transition-colors
                ${validado
                  ? 'border-green-400 bg-green-50'
                  : piezasColocadas > 0
                    ? 'border-yellow-400 bg-yellow-50/50'
                    : 'border-gray-300 bg-white'
                }
              `}
            >
              {piezasColocadas > 0 ? (
                <AnimatePresence mode="popLayout">
                  <PiezasGrid
                    count={piezasColocadas}
                    tipo={spec.tipo_pieza}
                    color={validado ? '#10B981' : BUILD_COLOR}
                    animate
                  />
                </AnimatePresence>
              ) : (
                <span className="text-xs text-gray-300 text-center">
                  Agrega<br />piezas
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Termino {terminoObjetivoIndex}
            </span>
            <span className="text-xs text-gray-400">
              {piezasColocadas} pieza{piezasColocadas !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper control */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex-shrink-0">
          <PiezaSVG tipo={spec.tipo_pieza} color={BUILD_COLOR} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Piezas</p>
          <p className="text-xs text-gray-400">Construye el siguiente termino</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPiezasColocadas((v) => Math.max(0, v - 1))}
            disabled={validado || piezasColocadas === 0}
            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-gray-900">{piezasColocadas}</span>
          <button
            type="button"
            onClick={() => setPiezasColocadas((v) => Math.min(maxPiezas, v + 1))}
            disabled={validado || piezasColocadas >= maxPiezas}
            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>
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
          disabled={piezasColocadas === 0}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              piezasColocadas === 0
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
              Lo lograste en {intentos} intento{intentos > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
