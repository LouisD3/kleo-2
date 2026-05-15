'use client'

import type { ModeloBarrasSpec } from '@/types/tarea-cpa'

// ── Color map ────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  amarillo: '#FFD700',
  azul: '#3B82F6',
  rojo: '#EF4444',
  verde: '#10B981',
  morado: '#8B5CF6',
}

function resolveColor(c: string): string {
  return COLOR_MAP[c] ?? c
}

// ── Layout constants ─────────────────────────────────────────────

const LABEL_W = 80
const BAR_H = 40
const BAR_GAP = 8
const PADDING = 12
const TOTAL_ROW_H = 28
const BRACE_W = 20

// ── Component ────────────────────────────────────────────────────

interface Props {
  spec: ModeloBarrasSpec
  className?: string
}

export default function ModeloBarras({ spec, className }: Props) {
  const { barras, total, incognita, orientacion = 'horizontal' } = spec

  if (orientacion === 'vertical') {
    return <ModeloBarrasVertical spec={spec} className={className} />
  }

  // Compute max value for proportional widths
  const maxVal = Math.max(...barras.map((b) => b.valor), total?.valor ?? 0)
  if (maxVal === 0) return null

  // SVG dimensions
  const barAreaW = 280
  const contentW = LABEL_W + barAreaW + (total?.visible ? BRACE_W + 40 : 0)
  const svgW = contentW + PADDING * 2
  const barsH = barras.length * BAR_H + (barras.length - 1) * BAR_GAP
  const svgH = PADDING * 2 + barsH + (total?.visible ? TOTAL_ROW_H : 0)

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={`w-full max-w-md ${className ?? ''}`}
      role="img"
      aria-label="Modelo de barras"
    >
      {barras.map((barra, i) => {
        const y = PADDING + i * (BAR_H + BAR_GAP)
        const barW = (barra.valor / maxVal) * barAreaW
        const color = resolveColor(barra.color)

        return (
          <g key={barra.label}>
            {/* Label */}
            <text
              x={PADDING + LABEL_W - 8}
              y={y + BAR_H / 2}
              textAnchor="end"
              dominantBaseline="central"
              className="text-[11px] font-medium"
              fill="#6B7280"
            >
              {barra.label}
            </text>

            {/* Bar rect */}
            <rect
              x={PADDING + LABEL_W}
              y={y}
              width={barW}
              height={BAR_H}
              rx={6}
              fill={color}
              opacity={0.85}
            />

            {/* Subdivisions */}
            {barra.subdivisiones && barra.subdivisiones > 1 && (
              <SubdivisionLines
                x={PADDING + LABEL_W}
                y={y}
                width={barW}
                height={BAR_H}
                count={barra.subdivisiones}
              />
            )}

            {/* Value inside bar */}
            <text
              x={PADDING + LABEL_W + barW / 2}
              y={y + BAR_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[12px] font-bold"
              fill="white"
            >
              {incognita?.posicion === 'barra' ? incognita.label : barra.valor}
            </text>
          </g>
        )
      })}

      {/* Total brace + label */}
      {total?.visible && (
        <TotalBrace
          x={PADDING + LABEL_W}
          y={PADDING + barsH + 4}
          width={(total.valor / maxVal) * barAreaW}
          valor={total.valor}
          incognita={incognita?.posicion === 'total' ? incognita.label : null}
        />
      )}
    </svg>
  )
}

// ── Subdivision lines ────────────────────────────────────────────

function SubdivisionLines({
  x,
  y,
  width,
  height,
  count,
}: {
  x: number
  y: number
  width: number
  height: number
  count: number
}) {
  const lines = []
  for (let i = 1; i < count; i++) {
    const lx = x + (width / count) * i
    lines.push(
      <line
        key={i}
        x1={lx}
        y1={y + 2}
        x2={lx}
        y2={y + height - 2}
        stroke="white"
        strokeWidth={1.5}
        opacity={0.4}
      />,
    )
  }
  return <>{lines}</>
}

// ── Total brace ──────────────────────────────────────────────────

function TotalBrace({
  x,
  y,
  width,
  valor,
  incognita,
}: {
  x: number
  y: number
  width: number
  valor: number
  incognita: string | null
}) {
  const midX = x + width / 2
  const braceY = y + 2

  return (
    <g>
      {/* Horizontal line spanning the bars */}
      <line x1={x} y1={braceY} x2={x + width} y2={braceY} stroke="#9CA3AF" strokeWidth={1.5} />
      {/* Left tick */}
      <line x1={x} y1={braceY - 4} x2={x} y2={braceY + 4} stroke="#9CA3AF" strokeWidth={1.5} />
      {/* Right tick */}
      <line
        x1={x + width}
        y1={braceY - 4}
        x2={x + width}
        y2={braceY + 4}
        stroke="#9CA3AF"
        strokeWidth={1.5}
      />
      {/* Center tick down */}
      <line x1={midX} y1={braceY} x2={midX} y2={braceY + 8} stroke="#9CA3AF" strokeWidth={1.5} />
      {/* Total label */}
      <text
        x={midX}
        y={braceY + 20}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[12px] font-bold"
        fill="#374151"
      >
        {incognita ?? valor}
      </text>
    </g>
  )
}

// ── Vertical orientation ─────────────────────────────────────────

function ModeloBarrasVertical({ spec, className }: Props) {
  const { barras, total, incognita } = spec
  const maxVal = Math.max(...barras.map((b) => b.valor), total?.valor ?? 0)
  if (maxVal === 0) return null

  const BAR_W = 44
  const barAreaH = 200
  const barsW = barras.length * BAR_W + (barras.length - 1) * BAR_GAP
  const svgW = PADDING * 2 + barsW
  const svgH = PADDING * 2 + barAreaH + 28 + (total?.visible ? TOTAL_ROW_H : 0)

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={`w-full max-w-xs ${className ?? ''}`}
      role="img"
      aria-label="Modelo de barras vertical"
    >
      {barras.map((barra, i) => {
        const x = PADDING + i * (BAR_W + BAR_GAP)
        const barH = (barra.valor / maxVal) * barAreaH
        const barY = PADDING + (barAreaH - barH)
        const color = resolveColor(barra.color)

        return (
          <g key={barra.label}>
            <rect x={x} y={barY} width={BAR_W} height={barH} rx={6} fill={color} opacity={0.85} />

            {/* Value */}
            <text
              x={x + BAR_W / 2}
              y={barY + barH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[12px] font-bold"
              fill="white"
            >
              {incognita?.posicion === 'barra' ? incognita.label : barra.valor}
            </text>

            {/* Label below */}
            <text
              x={x + BAR_W / 2}
              y={PADDING + barAreaH + 16}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[10px] font-medium"
              fill="#6B7280"
            >
              {barra.label}
            </text>
          </g>
        )
      })}

      {/* Total line below labels */}
      {total?.visible && (
        <text
          x={svgW / 2}
          y={PADDING + barAreaH + 28 + 14}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-[12px] font-bold"
          fill="#374151"
        >
          Total: {incognita?.posicion === 'total' ? incognita.label : total.valor}
        </text>
      )}
    </svg>
  )
}
