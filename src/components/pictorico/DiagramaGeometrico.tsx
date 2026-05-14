'use client'

import type React from 'react'
import type { DiagramaGeometricoSpec } from '@/types/tarea-cpa'

const UNIT = 40 // pixels per grid unit
const PADDING = 24
const POINT_R = 4
const FONT_SIZE = 11
const ARC_RADIUS = 24

const COLOR_MAP: Record<string, string> = {
  amarillo: '#FFD700',
  azul: '#3B82F6',
  rojo: '#EF4444',
  verde: '#10B981',
  morado: '#8B5CF6',
  naranja: '#F97316',
  gris: '#6B7280',
}

function resolveColor(c?: string): string {
  if (!c) return '#3B82F6'
  return COLOR_MAP[c] ?? c
}

interface Props {
  spec: DiagramaGeometricoSpec
  className?: string
}

export default function DiagramaGeometrico({ spec, className }: Props) {
  const {
    ancho,
    alto,
    puntos,
    segmentos,
    angulos,
    poligonos,
    cuadricula,
    circulos,
    arcos,
    titulo,
  } = spec

  const svgW = ancho * UNIT + PADDING * 2
  const svgH = alto * UNIT + PADDING * 2

  const ptMap = new Map(puntos.map((p) => [p.id, p]))

  function px(x: number) {
    return PADDING + x * UNIT
  }
  function py(y: number) {
    // Flip Y so 0 is bottom
    return PADDING + (alto - y) * UNIT
  }

  function getAngle(cx: number, cy: number, px2: number, py2: number): number {
    return Math.atan2(py2 - cy, px2 - cx)
  }

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={`w-full max-w-md ${className ?? ''}`}
      role="img"
      aria-label={titulo ?? 'Diagrama geometrico'}
    >
      {/* Grid (optional) */}
      {cuadricula && (
        <CuadriculaRender
          cuadricula={cuadricula}
          offsetX={PADDING}
          offsetY={PADDING}
          alto={alto}
          unit={UNIT}
        />
      )}

      {/* Circles (behind everything except grid) */}
      {circulos?.map((circ, i) => {
        const centro = ptMap.get(circ.centro_id)
        if (!centro) return null
        const cx = px(centro.x)
        const cy = py(centro.y)
        const r = circ.radio * UNIT
        const color = resolveColor(circ.color)
        const estilo = circ.estilo ?? 'borde'
        return (
          <g key={`circ-${i}`}>
            {circ.label && <title>{circ.label}</title>}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={estilo === 'lleno' ? color : 'none'}
              fillOpacity={estilo === 'lleno' ? 0.15 : undefined}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={estilo === 'punteado' ? '4 2' : undefined}
              role={circ.label ? 'img' : undefined}
              aria-label={circ.label}
            />
          </g>
        )
      })}

      {/* Arcs / sectors */}
      {arcos?.map((arco, i) => {
        const centro = ptMap.get(arco.centro_id)
        if (!centro) return null
        const cx = px(centro.x)
        const cy = py(centro.y)
        const r = arco.radio * UNIT
        const color = resolveColor(arco.color)

        const startRad = (arco.desde_grados * Math.PI) / 180
        const endRad = (arco.hasta_grados * Math.PI) / 180

        // Compute endpoints in grid coords, then convert to SVG
        const x1 = px(centro.x + arco.radio * Math.cos(startRad))
        const y1 = py(centro.y + arco.radio * Math.sin(startRad))
        const x2 = px(centro.x + arco.radio * Math.cos(endRad))
        const y2 = py(centro.y + arco.radio * Math.sin(endRad))

        let span = arco.hasta_grados - arco.desde_grados
        if (span < 0) span += 360
        const largeArc = span > 180 ? 1 : 0
        // CCW in math + Y-flip = CCW in SVG
        const sweep = 0

        const d = arco.relleno
          ? `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2} Z`
          : `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`

        return (
          <g key={`arco-${i}`}>
            {arco.label && <title>{arco.label}</title>}
            <path
              d={d}
              fill={arco.relleno ? color : 'none'}
              fillOpacity={arco.relleno ? 0.2 : undefined}
              stroke={color}
              strokeWidth={2}
              role={arco.label ? 'img' : undefined}
              aria-label={arco.label}
            />
          </g>
        )
      })}

      {/* Polygons (render first, behind everything) */}
      {poligonos?.map((pol, i) => {
        const pts = pol.puntos
          .map((id) => ptMap.get(id))
          .filter(Boolean)
          .map((p) => `${px(p!.x)},${py(p!.y)}`)
          .join(' ')
        return (
          <polygon
            key={`pol-${i}`}
            points={pts}
            fill={resolveColor(pol.relleno)}
            opacity={pol.opacidad ?? 0.15}
            stroke={resolveColor(pol.relleno)}
            strokeWidth={1.5}
          />
        )
      })}

      {/* Segments */}
      {segmentos?.map((seg, i) => {
        const p1 = ptMap.get(seg.desde)
        const p2 = ptMap.get(seg.hasta)
        if (!p1 || !p2) return null

        const x1 = px(p1.x)
        const y1 = py(p1.y)
        const x2 = px(p2.x)
        const y2 = py(p2.y)
        const color = resolveColor(seg.color)

        const dashArray =
          seg.estilo === 'punteado' ? '6,4' : seg.estilo === 'doble' ? undefined : undefined

        return (
          <g key={`seg-${i}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={seg.estilo === 'doble' ? 3 : 2}
              strokeDasharray={dashArray}
            />
            {seg.estilo === 'doble' && (
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={1} />
            )}
            {seg.medida && (
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 8}
                textAnchor="middle"
                className={`text-[${FONT_SIZE}px] font-medium`}
                fill={color}
              >
                {seg.medida}
              </text>
            )}
            {seg.label && (
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 + 14}
                textAnchor="middle"
                className={`text-[${FONT_SIZE}px] font-medium`}
                fill="#6B7280"
              >
                {seg.label}
              </text>
            )}
          </g>
        )
      })}

      {/* Angles */}
      {angulos?.map((ang, i) => {
        const v = ptMap.get(ang.vertice)
        const a = ptMap.get(ang.lado_a)
        const b = ptMap.get(ang.lado_b)
        if (!v || !a || !b) return null

        const vx = px(v.x)
        const vy = py(v.y)
        const angle1 = getAngle(vx, vy, px(a.x), py(a.y))
        const angle2 = getAngle(vx, vy, px(b.x), py(b.y))

        const r = ARC_RADIUS
        const startX = vx + r * Math.cos(angle1)
        const startY = vy + r * Math.sin(angle1)
        const endX = vx + r * Math.cos(angle2)
        const endY = vy + r * Math.sin(angle2)

        // Determine sweep: use the smaller arc
        let sweep = angle2 - angle1
        if (sweep < 0) sweep += 2 * Math.PI
        const largeArc = sweep > Math.PI ? 1 : 0
        const sweepFlag = 1

        const color = resolveColor(ang.color)
        const midAngle = angle1 + sweep / 2
        const labelR = r + 14

        return (
          <g key={`ang-${i}`}>
            {ang.arco !== false && (
              <path
                d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${endX} ${endY}`}
                fill="none"
                stroke={color}
                strokeWidth={2}
              />
            )}
            {ang.medida && (
              <text
                x={vx + labelR * Math.cos(midAngle)}
                y={vy + labelR * Math.sin(midAngle)}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[${FONT_SIZE}px] font-bold`}
                fill={color}
              >
                {ang.medida}
              </text>
            )}
          </g>
        )
      })}

      {/* Points */}
      {puntos.map((p) => (
        <g key={p.id}>
          <circle cx={px(p.x)} cy={py(p.y)} r={POINT_R} fill="#374151" />
          {p.label && (
            <text
              x={px(p.x)}
              y={py(p.y) - 10}
              textAnchor="middle"
              className={`text-[${FONT_SIZE}px] font-bold`}
              fill="#374151"
            >
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

// ── Grid overlay ────────────────────────────────────────────────

function CuadriculaRender({
  cuadricula,
  offsetX,
  offsetY,
  alto,
  unit,
}: {
  cuadricula: NonNullable<DiagramaGeometricoSpec['cuadricula']>
  offsetX: number
  offsetY: number
  alto: number
  unit: number
}) {
  const { filas, columnas, celdas_resaltadas, color_resaltado } = cuadricula
  const cells: React.JSX.Element[] = []

  // Draw highlighted cells
  if (celdas_resaltadas) {
    for (const [fila, col] of celdas_resaltadas) {
      cells.push(
        <rect
          key={`cell-${fila}-${col}`}
          x={offsetX + col * unit}
          y={offsetY + (alto - filas + fila) * unit}
          width={unit}
          height={unit}
          fill={color_resaltado ?? '#3B82F6'}
          opacity={0.25}
        />,
      )
    }
  }

  // Draw grid lines
  const lines: React.JSX.Element[] = []
  for (let r = 0; r <= filas; r++) {
    const y = offsetY + (alto - filas + r) * unit
    lines.push(
      <line
        key={`h-${r}`}
        x1={offsetX}
        y1={y}
        x2={offsetX + columnas * unit}
        y2={y}
        stroke="#D1D5DB"
        strokeWidth={0.5}
      />,
    )
  }
  for (let c = 0; c <= columnas; c++) {
    const x = offsetX + c * unit
    lines.push(
      <line
        key={`v-${c}`}
        x1={x}
        y1={offsetY + (alto - filas) * unit}
        x2={x}
        y2={offsetY + alto * unit}
        stroke="#D1D5DB"
        strokeWidth={0.5}
      />,
    )
  }

  return (
    <>
      {cells}
      {lines}
    </>
  )
}
