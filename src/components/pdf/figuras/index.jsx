'use client'

import { Svg, Line, Circle, Rect, Text as SvgText, G, Path, Image } from '@react-pdf/renderer'

const C = {
  axis: '#374151',
  grid: '#E5E7EB',
  point: '#2563EB',
  pointAlt: '#E11D48',
  accent: '#FFD700',
  label: '#374151',
  fill: '#EFF6FF',
  fillAlt: '#FEF2F2',
  green: '#059669',
  teal: '#0D9488',
}

// ============================================
// RECTA NUMERICA (Number Line)
// { tipo: "recta_numerica", min: -5, max: 5, puntos: [{valor: 2, label: "A"}, ...], intervalos: [{desde: -1, hasta: 3}] }
// ============================================
export function RectaNumerica({ min = -5, max = 5, puntos = [], intervalos = [], width = 400, height = 60 }) {
  const pad = 30
  const y = height / 2
  const usable = width - pad * 2
  const toX = (v) => pad + ((v - min) / (max - min)) * usable

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Main line */}
      <Line x1={pad - 5} y1={y} x2={width - pad + 5} y2={y} stroke={C.axis} strokeWidth={1.5} />
      {/* Arrow tips */}
      <Path d={`M${pad - 5},${y} L${pad - 12},${y - 4} M${pad - 5},${y} L${pad - 12},${y + 4}`} stroke={C.axis} strokeWidth={1} />
      <Path d={`M${width - pad + 5},${y} L${width - pad + 12},${y - 4} M${width - pad + 5},${y} L${width - pad + 12},${y + 4}`} stroke={C.axis} strokeWidth={1} />

      {/* Tick marks and labels */}
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((v) => (
        <G key={v}>
          <Line x1={toX(v)} y1={y - 5} x2={toX(v)} y2={y + 5} stroke={C.axis} strokeWidth={v === 0 ? 1.5 : 0.8} />
          <SvgText x={toX(v)} y={y + 16} fontSize={7} fill={C.label} textAnchor="middle">{String(v)}</SvgText>
        </G>
      ))}

      {/* Intervals */}
      {intervalos.map((iv, i) => (
        <Line key={`iv${i}`} x1={toX(iv.desde)} y1={y - 2} x2={toX(iv.hasta)} y2={y - 2} stroke={C.accent} strokeWidth={3} />
      ))}

      {/* Points */}
      {puntos.map((p, i) => (
        <G key={`p${i}`}>
          <Circle cx={toX(p.valor)} cy={y} r={4} fill={i === 0 ? C.point : C.pointAlt} />
          {p.label && (
            <SvgText x={toX(p.valor)} y={y - 10} fontSize={8} fill={i === 0 ? C.point : C.pointAlt} textAnchor="middle" fontWeight={700}>{p.label}</SvgText>
          )}
        </G>
      ))}
    </Svg>
  )
}

// ============================================
// PLANO CARTESIANO (Coordinate Plane)
// { tipo: "plano_cartesiano", xMin: -5, xMax: 5, yMin: -5, yMax: 5, puntos: [{x:2, y:3, label:"A"}], lineas: [{x1,y1,x2,y2}] }
// ============================================
export function PlanoCartesiano({ xMin = -5, xMax = 5, yMin = -5, yMax = 5, puntos = [], lineas = [], width = 200, height = 200 }) {
  const pad = 25
  const toX = (v) => pad + ((v - xMin) / (xMax - xMin)) * (width - pad * 2)
  const toY = (v) => pad + ((yMax - v) / (yMax - yMin)) * (height - pad * 2)

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Grid */}
      {Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i).map((v) => (
        <Line key={`gx${v}`} x1={toX(v)} y1={pad} x2={toX(v)} y2={height - pad} stroke={v === 0 ? C.axis : C.grid} strokeWidth={v === 0 ? 1 : 0.3} />
      ))}
      {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((v) => (
        <Line key={`gy${v}`} x1={pad} y1={toY(v)} x2={width - pad} y2={toY(v)} stroke={v === 0 ? C.axis : C.grid} strokeWidth={v === 0 ? 1 : 0.3} />
      ))}

      {/* Axis labels */}
      {Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i).filter(v => v !== 0).map((v) => (
        <SvgText key={`lx${v}`} x={toX(v)} y={toY(0) + 12} fontSize={6} fill={C.label} textAnchor="middle">{String(v)}</SvgText>
      ))}
      {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).filter(v => v !== 0).map((v) => (
        <SvgText key={`ly${v}`} x={toX(0) - 8} y={toY(v) + 3} fontSize={6} fill={C.label} textAnchor="middle">{String(v)}</SvgText>
      ))}

      {/* Lines */}
      {lineas.map((l, i) => (
        <Line key={`l${i}`} x1={toX(l.x1)} y1={toY(l.y1)} x2={toX(l.x2)} y2={toY(l.y2)} stroke={l.color || C.point} strokeWidth={1.5} />
      ))}

      {/* Points */}
      {puntos.map((p, i) => (
        <G key={`p${i}`}>
          <Circle cx={toX(p.x)} cy={toY(p.y)} r={3} fill={i === 0 ? C.point : C.pointAlt} />
          {p.label && (
            <SvgText x={toX(p.x) + 6} y={toY(p.y) - 5} fontSize={7} fill={i === 0 ? C.point : C.pointAlt} fontWeight={700}>{p.label}</SvgText>
          )}
        </G>
      ))}
    </Svg>
  )
}

// ============================================
// CIRCULO CON RECTAS (Circle with notable lines)
// { tipo: "circulo", radio: 40, elementos: ["radio", "diametro", "cuerda", "tangente", "secante"] }
// ============================================
export function CirculoNotable({ radio = 50, elementos = [], width = 180, height = 180 }) {
  const cx = width / 2
  const cy = height / 2
  const r = radio

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Circle */}
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={C.axis} strokeWidth={1.5} />
      {/* Center */}
      <Circle cx={cx} cy={cy} r={2} fill={C.axis} />
      <SvgText x={cx - 8} y={cy + 12} fontSize={7} fill={C.label}>O</SvgText>

      {/* Radio */}
      {elementos.includes('radio') && (
        <G>
          <Line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={C.point} strokeWidth={1.5} />
          <Circle cx={cx + r} cy={cy} r={2.5} fill={C.point} />
          <SvgText x={cx + r / 2} y={cy - 6} fontSize={7} fill={C.point} fontWeight={700}>r</SvgText>
        </G>
      )}

      {/* Diametro */}
      {elementos.includes('diametro') && (
        <G>
          <Line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={C.green} strokeWidth={1.5} />
          <Circle cx={cx - r} cy={cy} r={2.5} fill={C.green} />
          <Circle cx={cx + r} cy={cy} r={2.5} fill={C.green} />
          <SvgText x={cx} y={cy - 6} fontSize={7} fill={C.green} fontWeight={700} textAnchor="middle">d</SvgText>
        </G>
      )}

      {/* Cuerda */}
      {elementos.includes('cuerda') && (
        <G>
          <Line x1={cx - r * 0.7} y1={cy - r * 0.71} x2={cx + r * 0.87} y2={cy + r * 0.5} stroke={C.pointAlt} strokeWidth={1.5} />
          <Circle cx={cx - r * 0.7} cy={cy - r * 0.71} r={2.5} fill={C.pointAlt} />
          <Circle cx={cx + r * 0.87} cy={cy + r * 0.5} r={2.5} fill={C.pointAlt} />
          <SvgText x={cx + r * 0.3} y={cy - r * 0.3} fontSize={7} fill={C.pointAlt} fontWeight={700}>cuerda</SvgText>
        </G>
      )}

      {/* Tangente */}
      {elementos.includes('tangente') && (
        <G>
          <Line x1={cx + r - 40} y1={cy - r} x2={cx + r + 40} y2={cy - r} stroke={C.teal} strokeWidth={1.5} />
          <Circle cx={cx + r * Math.cos(-Math.PI / 2 + 0.3)} cy={cy + r * Math.sin(-Math.PI / 2 + 0.3)} r={0} fill="none" />
          <Circle cx={cx} cy={cy - r} r={2.5} fill={C.teal} />
          <SvgText x={cx + r * 0.4} y={cy - r - 5} fontSize={7} fill={C.teal} fontWeight={700}>tangente</SvgText>
        </G>
      )}
    </Svg>
  )
}

// ============================================
// FRACCION VISUAL (Fraction as shaded rectangle)
// { tipo: "fraccion", numerador: 3, denominador: 4 }
// ============================================
export function FraccionVisual({ numerador = 3, denominador = 4, width = 120, height = 50 }) {
  const barH = 24
  const cellW = (width - 4) / denominador

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: denominador }, (_, i) => (
        <Rect
          key={i}
          x={2 + i * cellW}
          y={2}
          width={cellW - 1}
          height={barH}
          fill={i < numerador ? C.fill : 'white'}
          stroke={i < numerador ? C.point : C.grid}
          strokeWidth={1}
          rx={2}
        />
      ))}
      <SvgText x={width / 2} y={barH + 16} fontSize={10} fill={C.axis} textAnchor="middle" fontWeight={700}>
        {numerador}/{denominador}
      </SvgText>
    </Svg>
  )
}

// ============================================
// GRAFICA DE BARRAS (Bar chart)
// { tipo: "grafica_barras", datos: [{label: "A", valor: 5}, ...], titulo: "..." }
// ============================================
export function GraficaBarras({ datos = [], width = 250, height = 150 }) {
  if (datos.length === 0) return null
  const pad = { top: 10, bottom: 25, left: 30, right: 10 }
  const maxVal = Math.max(...datos.map(d => d.valor))
  const barW = (width - pad.left - pad.right) / datos.length * 0.7
  const gap = (width - pad.left - pad.right) / datos.length * 0.3
  const chartH = height - pad.top - pad.bottom

  const colors = [C.point, C.pointAlt, C.green, C.teal, C.accent, '#8B5CF6']

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Y axis */}
      <Line x1={pad.left} y1={pad.top} x2={pad.left} y2={height - pad.bottom} stroke={C.axis} strokeWidth={0.8} />
      {/* X axis */}
      <Line x1={pad.left} y1={height - pad.bottom} x2={width - pad.right} y2={height - pad.bottom} stroke={C.axis} strokeWidth={0.8} />

      {/* Bars */}
      {datos.map((d, i) => {
        const barH = (d.valor / maxVal) * chartH
        const x = pad.left + i * (barW + gap) + gap / 2
        const y = height - pad.bottom - barH
        return (
          <G key={i}>
            <Rect x={x} y={y} width={barW} height={barH} fill={colors[i % colors.length]} rx={2} />
            <SvgText x={x + barW / 2} y={y - 4} fontSize={7} fill={C.axis} textAnchor="middle" fontWeight={700}>{String(d.valor)}</SvgText>
            <SvgText x={x + barW / 2} y={height - pad.bottom + 12} fontSize={6} fill={C.label} textAnchor="middle">{d.label}</SvgText>
          </G>
        )
      })}
    </Svg>
  )
}

// ============================================
// IMAGEN EXTERNA
// { tipo: "imagen", src: "/content/images/ejemplo.png", alt: "..." }
// ============================================
export function ImagenExterna({ src, width = 200, height = 150 }) {
  return <Image src={src} style={{ width, height, objectFit: 'contain' }} />
}

// ============================================
// DISPATCHER — render figure from JSON descriptor
// ============================================
const FIGURAS = {
  recta_numerica: RectaNumerica,
  plano_cartesiano: PlanoCartesiano,
  circulo: CirculoNotable,
  fraccion: FraccionVisual,
  grafica_barras: GraficaBarras,
  imagen: ImagenExterna,
}

export function Figura({ descriptor }) {
  if (!descriptor || !descriptor.tipo) return null
  const Component = FIGURAS[descriptor.tipo]
  if (!Component) return null
  const { tipo, ...props } = descriptor
  return <Component {...props} />
}
