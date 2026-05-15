'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { VarillasTrianguloSpec } from '@/types/tarea-cpa'

interface Props {
  spec: VarillasTrianguloSpec
  intentos_para_pista: number
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  a: number
  b: number
  c: number
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

function canFormTriangle(a: number, b: number, c: number): boolean {
  return a + b > c && a + c > b && b + c > a && a > 0 && b > 0 && c > 0
}

const SVG_W = 300
const SVG_H = 220

export default function VarillasTriangulo({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const [a, setA] = useState(estadoInicial?.a ?? spec.lado_a)
  const [b, setB] = useState(estadoInicial?.b ?? spec.lado_b)
  const [c, setC] = useState(estadoInicial?.c ?? spec.lado_c)
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ a, b, c, intentos, pistaVisible, validado })
  }, [a, b, c, intentos, pistaVisible, validado])

  const formsTriangle = canFormTriangle(a, b, c)

  // Compute triangle points using law of cosines
  const trianglePoints = (() => {
    if (!formsTriangle) return null
    // Place side a along the bottom
    const scale = 180 / Math.max(a, b, c, 1)
    const ax = a * scale
    // angle at vertex A (between sides b and c)
    const cosA = (b * b + c * c - a * a) / (2 * b * c)
    const clampedCos = Math.max(-1, Math.min(1, cosA))
    const angleA = Math.acos(clampedCos)
    // Point C position
    const cx = b * scale * Math.cos(angleA)
    const cy = b * scale * Math.sin(angleA)

    // Center the triangle
    const minX = Math.min(0, cx)
    const maxX = Math.max(ax, cx)
    const offsetX = (SVG_W - (maxX - minX)) / 2 - minX
    const offsetY = SVG_H - 30

    return {
      A: { x: offsetX, y: offsetY },
      B: { x: offsetX + ax, y: offsetY },
      C: { x: offsetX + cx, y: offsetY - cy },
    }
  })()

  const verificar = useCallback(() => {
    if (validado) return
    const esValido = formsTriangle === spec.forma_triangulo
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
  }, [validado, formsTriangle, spec.forma_triangulo, spec.pista, intentos, intentos_para_pista, pistaVisible, onValidado])

  const sliderClass = 'w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500'

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">{spec.pregunta}</p>

      {/* Triangle visualization */}
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full max-w-sm" role="img" aria-label={`Varillas: a=${a}, b=${b}, c=${c}`}>
          {trianglePoints ? (
            <g>
              <polygon
                points={`${trianglePoints.A.x},${trianglePoints.A.y} ${trianglePoints.B.x},${trianglePoints.B.y} ${trianglePoints.C.x},${trianglePoints.C.y}`}
                fill="#FFD70030"
                stroke="#374151"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              {/* Side labels */}
              <text
                x={(trianglePoints.A.x + trianglePoints.B.x) / 2}
                y={trianglePoints.A.y + 16}
                textAnchor="middle"
                className="text-[11px] font-bold"
                fill="#3B82F6"
              >
                a = {a}
              </text>
              <text
                x={(trianglePoints.B.x + trianglePoints.C.x) / 2 + 12}
                y={(trianglePoints.B.y + trianglePoints.C.y) / 2}
                textAnchor="start"
                className="text-[11px] font-bold"
                fill="#10B981"
              >
                b = {b}
              </text>
              <text
                x={(trianglePoints.A.x + trianglePoints.C.x) / 2 - 12}
                y={(trianglePoints.A.y + trianglePoints.C.y) / 2}
                textAnchor="end"
                className="text-[11px] font-bold"
                fill="#EF4444"
              >
                c = {c}
              </text>
            </g>
          ) : (
            <g>
              {/* Flat / collapsed — draw 3 separate rods */}
              <line x1={30} y1={SVG_H / 2} x2={30 + a * 20} y2={SVG_H / 2} stroke="#3B82F6" strokeWidth={4} strokeLinecap="round" />
              <line x1={30} y1={SVG_H / 2 + 20} x2={30 + b * 20} y2={SVG_H / 2 + 20} stroke="#10B981" strokeWidth={4} strokeLinecap="round" />
              <line x1={30} y1={SVG_H / 2 + 40} x2={30 + c * 20} y2={SVG_H / 2 + 40} stroke="#EF4444" strokeWidth={4} strokeLinecap="round" />
              <text x={SVG_W / 2} y={30} textAnchor="middle" className="text-[13px] font-bold" fill="#EF4444">
                No se puede formar un triangulo
              </text>
              <text x={SVG_W / 2} y={48} textAnchor="middle" style={{ fontSize: 10 }} fill="#6B7280">
                {a}+{b}={a + b} {a + b > c ? '>' : '≤'} {c}  ·  {a}+{c}={a + c} {a + c > b ? '>' : '≤'} {b}
              </text>
              <text x={SVG_W / 2} y={62} textAnchor="middle" style={{ fontSize: 10 }} fill="#6B7280">
                {b}+{c}={b + c} {b + c > a ? '>' : '≤'} {a}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Status badge */}
      <div className={`text-center text-sm font-semibold px-3 py-1.5 rounded-lg ${formsTriangle ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {formsTriangle
          ? `Se forma triangulo (${a}+${b}=${a + b} > ${c}, ${a}+${c}=${a + c} > ${b}, ${b}+${c}=${b + c} > ${a})`
          : `No se forma triangulo`}
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-blue-600">Lado a = {a}</label>
          <input
            type="range"
            min={1}
            max={spec.max_longitud}
            value={a}
            onChange={(e) => !validado && setA(Number(e.target.value))}
            className={sliderClass}
            disabled={validado}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-green-600">Lado b = {b}</label>
          <input
            type="range"
            min={1}
            max={spec.max_longitud}
            value={b}
            onChange={(e) => !validado && setB(Number(e.target.value))}
            className={sliderClass}
            disabled={validado}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-red-600">Lado c = {c}</label>
          <input
            type="range"
            min={1}
            max={spec.max_longitud}
            value={c}
            onChange={(e) => !validado && setC(Number(e.target.value))}
            className={sliderClass}
            disabled={validado}
          />
        </div>
      </div>

      {pistaVisible && spec.pista && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800"
        >
          💡 {spec.pista}
        </motion.div>
      )}

      {!validado && (
        <button
          type="button"
          onClick={verificar}
          className={`w-full rounded-xl py-3 font-bold text-white transition ${
            errorFlash ? 'bg-red-500 animate-[shake_0.3s_ease-in-out]' : 'bg-amarillo hover:bg-amarillo-hover text-gray-900'
          }`}
        >
          {errorFlash ? 'Intenta de nuevo' : 'Verificar'}
        </button>
      )}

      {validado && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center"
        >
          <p className="font-bold text-green-700">Correcto!</p>
          <p className="text-sm text-green-600 mt-1">
            {spec.forma_triangulo
              ? `Los lados ${a}, ${b} y ${c} si forman un triangulo.`
              : `Los lados no forman un triangulo porque la suma de dos lados no es mayor que el tercero.`}
          </p>
        </motion.div>
      )}
    </div>
  )
}
