'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { DadosRuletaSpec } from '@/types/tarea-cpa'

interface Props {
  spec: DadosRuletaSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  resultados: Array<string | number>
  lanzamientosRealizados: number
  respuestaProbabilidad: string
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

// ── Color name mapping ───────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  amarillo: '#FFD700',
  azul: '#3B82F6',
  rojo: '#EF4444',
  verde: '#10B981',
  morado: '#8B5CF6',
  naranja: '#F97316',
  rosa: '#EC4899',
  gris: '#6B7280',
  blanco: '#FFFFFF',
  negro: '#111827',
}

function resolveColor(c: string): string {
  return COLOR_MAP[c.toLowerCase()] ?? c
}

// ── Dice face dot positions (classic die layout) ─────────────────
const DOT_POSITIONS: Record<number, Array<[number, number]>> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
}

function DadoSVG({ valor }: { valor: number }) {
  const dots = DOT_POSITIONS[Math.min(Math.max(valor, 1), 6)] ?? DOT_POSITIONS[1]
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" role="img" aria-label={`Dado mostrando ${valor}`}>
      <rect x="5" y="5" width="90" height="90" rx="14" fill="white" stroke="#374151" strokeWidth="3" />
      {dots.map(([cx, cy], i) => (
        <circle key={`${cx}-${cy}-${i}`} cx={cx} cy={cy} r="8" fill="#111827" />
      ))}
    </svg>
  )
}

function MonedaSVG({ cara }: { cara: 'aguila' | 'sol' }) {
  const isAguila = cara === 'aguila'
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" role="img" aria-label={`Moneda: ${cara}`}>
      <circle cx="50" cy="50" r="45" fill={isAguila ? '#F59E0B' : '#9CA3AF'} stroke={isAguila ? '#D97706' : '#6B7280'} strokeWidth="3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={isAguila ? '#D97706' : '#6B7280'} strokeWidth="1" opacity="0.4" />
      <text x="50" y="54" textAnchor="middle" fontSize="14" fontWeight="bold" fill={isAguila ? '#78350F' : '#1F2937'}>
        {isAguila ? 'Aguila' : 'Sol'}
      </text>
    </svg>
  )
}

function RuletaSVG({
  secciones,
  angulo,
}: {
  secciones: Array<{ label: string; color: string }>
  angulo: number
}) {
  const n = secciones.length
  const anglePerSection = 360 / n
  const r = 45
  const cx = 50
  const cy = 50

  function polarToCart(deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  return (
    <svg width="200" height="200" viewBox="0 0 100 100" role="img" aria-label="Ruleta de probabilidad">
      {/* Sections */}
      {secciones.map((sec, i) => {
        const startAngle = i * anglePerSection
        const endAngle = (i + 1) * anglePerSection
        const start = polarToCart(startAngle)
        const end = polarToCart(endAngle)
        const largeArc = anglePerSection > 180 ? 1 : 0
        const d = `M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${largeArc} 1 ${end.x},${end.y} Z`
        const midAngle = startAngle + anglePerSection / 2
        const labelPos = polarToCart(midAngle)
        const labelR = r * 0.6
        const labelRad = ((midAngle - 90) * Math.PI) / 180
        const lx = cx + labelR * Math.cos(labelRad)
        const ly = cy + labelR * Math.sin(labelRad)
        return (
          <g key={`${sec.label}-${i}`}>
            <path d={d} fill={resolveColor(sec.color)} stroke="white" strokeWidth="1" />
            {anglePerSection >= 30 && (
              <text x={lx} y={ly + 1} textAnchor="middle" fontSize={anglePerSection < 45 ? 4 : 5} fontWeight="bold" fill="white" style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}>
                {sec.label}
              </text>
            )}
          </g>
        )
      })}
      {/* Arrow / pointer */}
      <g transform={`rotate(${angulo}, ${cx}, ${cy})`}>
        <polygon points={`${cx},${cy - r + 5} ${cx - 4},${cy} ${cx + 4},${cy}`} fill="#111827" />
        <circle cx={cx} cy={cy} r="4" fill="#111827" stroke="white" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

// ── Normalize fraction for comparison ────────────────────────────
function normalizeFraction(s: string): string {
  const trimmed = s.replace(/\s+/g, '')
  const match = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/)
  if (!match) return trimmed.toLowerCase()
  const num = Number.parseInt(match[1], 10)
  const den = Number.parseInt(match[2], 10)
  if (den === 0) return trimmed
  const g = gcd(Math.abs(num), Math.abs(den))
  return `${num / g}/${den / g}`
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

// ── Main component ──────────────────────────────────────────────
export default function DadosRuleta({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [resultados, setResultados] = useState<Array<string | number>>(estadoInicial?.resultados ?? [])
  const [lanzamientosRealizados, setLanzamientosRealizados] = useState(estadoInicial?.lanzamientosRealizados ?? 0)
  const [respuestaProbabilidad, setRespuestaProbabilidad] = useState(estadoInicial?.respuestaProbabilidad ?? '')
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)

  const [animando, setAnimando] = useState(false)
  const [valorActual, setValorActual] = useState<string | number | null>(null)
  const [errorFlash, setErrorFlash] = useState(false)
  // Spinner angle state
  const [anguloRuleta, setAnguloRuleta] = useState(0)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ resultados, lanzamientosRealizados, respuestaProbabilidad, intentos, pistaVisible, validado })
  }, [resultados, lanzamientosRealizados, respuestaProbabilidad, intentos, pistaVisible, validado])

  const experimentoCompleto = lanzamientosRealizados >= spec.lanzamientos

  // Count occurrences of each result
  const conteo = resultados.reduce<Record<string, number>>((acc, r) => {
    const key = String(r)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  // Determine how many results match the favorable event
  const eventoFavorableCount = (() => {
    // Try to match the evento_favorable description to results
    // Common patterns: "Sacar un 6" -> count 6s, "Aguila" -> count "Aguila", section label
    const ev = spec.evento_favorable.toLowerCase()
    let count = 0
    for (const r of resultados) {
      const rStr = String(r).toLowerCase()
      if (ev.includes(rStr) || rStr.includes(ev)) {
        count++
      }
    }
    // Fallback: if no matches found with loose matching, try extracting the number/word
    if (count === 0 && resultados.length > 0) {
      const numMatch = ev.match(/\d+/)
      if (numMatch) {
        const target = numMatch[0]
        count = resultados.filter((r) => String(r) === target).length
      }
    }
    return count
  })()

  // Generate random result based on type
  const generarResultado = useCallback((): string | number => {
    if (spec.tipo === 'dado') {
      const caras = spec.caras ?? 6
      return Math.floor(Math.random() * caras) + 1
    }
    if (spec.tipo === 'moneda') {
      return Math.random() < 0.5 ? 'Aguila' : 'Sol'
    }
    // ruleta
    if (spec.secciones_ruleta && spec.secciones_ruleta.length > 0) {
      const idx = Math.floor(Math.random() * spec.secciones_ruleta.length)
      return spec.secciones_ruleta[idx].label
    }
    return '?'
  }, [spec.tipo, spec.caras, spec.secciones_ruleta])

  const lanzar = useCallback(() => {
    if (animando || experimentoCompleto) return

    setAnimando(true)
    const resultado = generarResultado()

    // For spinner, calculate the landing angle
    if (spec.tipo === 'ruleta' && spec.secciones_ruleta) {
      const idx = spec.secciones_ruleta.findIndex((s) => s.label === resultado)
      const anglePerSection = 360 / spec.secciones_ruleta.length
      const targetAngle = idx * anglePerSection + anglePerSection / 2
      // Multiple full rotations + landing
      setAnguloRuleta((prev) => prev + 720 + (360 - (prev % 360)) + targetAngle)
    }

    // Delay to let animation play
    const delay = spec.tipo === 'ruleta' ? 1500 : 800
    setTimeout(() => {
      setValorActual(resultado)
      setResultados((prev) => [...prev, resultado])
      setLanzamientosRealizados((prev) => prev + 1)
      setAnimando(false)
    }, delay)
  }, [animando, experimentoCompleto, generarResultado, spec.tipo, spec.secciones_ruleta])

  const verificar = useCallback(() => {
    if (validado) return

    const correcto = normalizeFraction(respuestaProbabilidad) === normalizeFraction(spec.respuesta_probabilidad)
    const nuevoIntentos = intentos + 1
    setIntentos(nuevoIntentos)

    if (correcto) {
      setValidado(true)
      onValidado(nuevoIntentos, pistaVisible)
    } else {
      setErrorFlash(true)
      setTimeout(() => setErrorFlash(false), 600)
      if (nuevoIntentos >= intentos_para_pista && spec.pista) {
        setPistaVisible(true)
      }
    }
  }, [validado, respuestaProbabilidad, spec.respuesta_probabilidad, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  // All possible outcomes for tally display
  const posiblesResultados = (() => {
    if (spec.tipo === 'dado') {
      const caras = spec.caras ?? 6
      return Array.from({ length: caras }, (_, i) => String(i + 1))
    }
    if (spec.tipo === 'moneda') return ['Aguila', 'Sol']
    if (spec.secciones_ruleta) return spec.secciones_ruleta.map((s) => s.label)
    return []
  })()

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      {/* Object display */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex flex-col items-center gap-3">
        {/* Dice */}
        {spec.tipo === 'dado' && (
          <motion.div
            animate={animando ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.1, 0.95, 1.05, 1] } : {}}
            transition={{ duration: 0.6 }}
          >
            <DadoSVG valor={typeof valorActual === 'number' ? valorActual : 1} />
          </motion.div>
        )}

        {/* Coin */}
        {spec.tipo === 'moneda' && (
          <motion.div
            animate={animando ? { rotateY: [0, 360, 720] } : {}}
            transition={{ duration: 0.7 }}
            style={{ perspective: 400 }}
          >
            <MonedaSVG cara={valorActual === 'Sol' ? 'sol' : 'aguila'} />
          </motion.div>
        )}

        {/* Spinner */}
        {spec.tipo === 'ruleta' && spec.secciones_ruleta && (
          <motion.div
            animate={{ rotate: anguloRuleta }}
            transition={{ duration: 1.4, ease: [0.2, 0.8, 0.3, 1] }}
          >
            <RuletaSVG secciones={spec.secciones_ruleta} angulo={0} />
          </motion.div>
        )}

        {/* Current result */}
        <AnimatePresence mode="wait">
          {valorActual !== null && !animando && (
            <motion.p
              key={String(valorActual) + lanzamientosRealizados}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold text-gray-900"
            >
              Resultado: {valorActual}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Evento favorable label */}
        <p className="text-xs text-gray-500">
          Evento favorable: <span className="font-semibold text-gray-700">{spec.evento_favorable}</span>
        </p>
      </div>

      {/* Lanzar button */}
      {!experimentoCompleto && !validado && (
        <button
          type="button"
          onClick={lanzar}
          disabled={animando}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${animando
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
            }
          `}
        >
          {animando
            ? 'Lanzando...'
            : `Lanzar (${lanzamientosRealizados}/${spec.lanzamientos})`
          }
        </button>
      )}

      {/* Results log */}
      {resultados.length > 0 && (
        <div className="rounded-xl bg-white border border-gray-200 p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resultados</p>

          {/* Individual results list */}
          <div className="max-h-40 overflow-y-auto space-y-1">
            {resultados.map((r, i) => (
              <div key={`r-${i}`} className="flex justify-between text-xs text-gray-600 px-1">
                <span>Lanzamiento {i + 1}</span>
                <span className="font-semibold text-gray-800">{r}</span>
              </div>
            ))}
          </div>

          {/* Tally / counter */}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Conteo</p>
            <div className="grid grid-cols-3 gap-1">
              {posiblesResultados.map((label) => (
                <div key={label} className="text-center bg-gray-50 rounded-lg py-1 px-2">
                  <span className="text-xs font-semibold text-gray-800">{label}</span>
                  <span className="block text-sm font-bold text-gray-900">{conteo[label] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary after all trials */}
          {experimentoCompleto && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="text-sm text-gray-700">
                Eventos favorables: <span className="font-bold">{eventoFavorableCount}</span> de{' '}
                <span className="font-bold">{spec.lanzamientos}</span> lanzamientos
              </p>
            </div>
          )}
        </div>
      )}

      {/* Probability input — shown after experiments complete */}
      {experimentoCompleto && !validado && (
        <div className="space-y-3">
          <label htmlFor="probabilidad-input" className="block text-sm font-medium text-gray-700">
            Escribe la probabilidad teorica como fraccion (ej: 1/6)
          </label>
          <input
            id="probabilidad-input"
            type="text"
            value={respuestaProbabilidad}
            onChange={(e) => setRespuestaProbabilidad(e.target.value)}
            placeholder="ej: 1/6"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <button
            type="button"
            onClick={verificar}
            disabled={!respuestaProbabilidad.trim()}
            className={`
              w-full py-3 rounded-xl text-sm font-semibold transition-all
              ${
                !respuestaProbabilidad.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : errorFlash
                    ? 'bg-amber-500 text-white animate-[shake_0.3s_ease-in-out]'
                    : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
              }
            `}
          >
            Verificar
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
              La probabilidad teorica es {spec.respuesta_probabilidad}
            </p>
            <p className="text-xs text-green-500 mt-1">
              Lo lograste en {intentos} intento{intentos > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
