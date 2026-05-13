/**
 * Types for Singapore-method CPA tareas.
 *
 * A tarea is a guided 3-step learning path:
 *   1. Concreto — interactive manipulable (drag & drop, 3D, etc.)
 *   2. Pictorico — bar model (read-only SVG) + 1-2 questions
 *   3. Abstracto — classic math questions
 *
 * Mastery gate: student must validate step N to access N+1.
 */

import type { TipoPregunta } from './biblioteca'

// ── Bloque Concreto ──────────────────────────────────────────────

/** Supported manipulable component types */
export type TipoConcreto =
  | 'dulces_agrupables' // grouping sweets (razones)
  | 'chocolate_secable' // breakable chocolate bar (fractions)
  | 'bloques_base10' // base-10 blocks (decimal system, operations)
  | 'balanza' // two-pan balance (linear equations)
  | 'recta_numerica' // number line with draggable marker
  | 'tiras_fracciones' // fraction strips/wall (equivalences)
  | 'cuadricula_100' // 10x10 grid for percentages
  | 'patron_figuras' // build next term of visual pattern
  | 'fichas_positivas_negativas' // +/- chips for integer operations
  | 'azulejos_algebra' // algebra tiles (x-bars + unit squares)
  | 'geoplano' // geoboard (pegs + rubber bands)
  | 'dados_ruleta' // dice and spinner (probability experiments)
  | 'histograma_construible' // buildable histogram (statistics)
  | 'compas_circulo' // compass/circle drawing tool
  | 'tabla_verdad' // truth table for logic propositions
  | 'interruptores_binarios' // ON/OFF switches for binary numbers
  | 'solidos_3d' // 3D solids (geometry, future)

/** Spec for dulces_agrupables manipulable (generalized grouping) */
export interface DulcesAgrupablesSpec {
  tipo_concreto: 'dulces_agrupables'
  cantidad: number
  grupos_objetivo: number
  soluciones_validas: Array<{ grupos: number; por_grupo: number }>
  pregunta: string
  pista?: string
  /** Label for items being grouped (e.g. "limon"). Falls back to "dulce". */
  etiqueta?: string
  /** Emoji rendered instead of CandySVG (e.g. "🍋"). Falls back to colored circles. */
  emoji?: string
  /** Label for group zones (e.g. "jarra"). Falls back to "Grupo". */
  etiqueta_grupo?: string
  /** Emoji for group headers (e.g. "🫙"). */
  emoji_grupo?: string
}

/** Spec for chocolate_secable manipulable */
export interface ChocolateSecableSpec {
  tipo_concreto: 'chocolate_secable'
  filas: number
  columnas: number
  fraccion_objetivo: string // e.g. "3/8"
  soluciones_validas: Array<{ piezas_seleccionadas: number }>
  pregunta: string
  pista?: string
}

/** Spec for bloques_base10 manipulable */
export interface BloquesBase10Spec {
  tipo_concreto: 'bloques_base10'
  numero_objetivo: number
  unidades_disponibles: { unidades: number; barras: number; cuadrados: number }
  soluciones_validas: Array<{ unidades: number; barras: number; cuadrados: number }>
  pregunta: string
  pista?: string
}

/** Spec for balanza manipulable */
export interface BalanzaSpec {
  tipo_concreto: 'balanza'
  lado_izquierdo: Array<{ tipo: 'x' | 'constante'; valor: number }>
  lado_derecho: Array<{ tipo: 'x' | 'constante'; valor: number }>
  solucion: number
  pregunta: string
  pista?: string
}

/** Spec for recta_numerica — draggable marker on a number line */
export interface RectaNumericaSpec {
  tipo_concreto: 'recta_numerica'
  min: number
  max: number
  divisiones: number // number of visible tick marks
  objetivo: number // correct position
  tolerancia?: number // margin of error (default 0 = exact)
  etiquetas?: Array<{ posicion: number; texto: string }> // labeled ticks
  pregunta: string
  pista?: string
}

/** Spec for tiras_fracciones — fraction wall, select equivalent strips */
export interface TirasFraccionesSpec {
  tipo_concreto: 'tiras_fracciones'
  fraccion_objetivo: string // e.g. "1/2"
  filas: Array<{ divisiones: number; color: string }> // each row: strip divided into N parts
  soluciones_validas: Array<{ fila: number; piezas: number }> // valid selections
  pregunta: string
  pista?: string
}

/** Spec for cuadricula_100 — 10x10 grid to shade for percentages */
export interface Cuadricula100Spec {
  tipo_concreto: 'cuadricula_100'
  porcentaje_objetivo: number // e.g. 35 means shade 35 squares
  pregunta: string
  pista?: string
}

/** Spec for patron_figuras — build next term of a visual pattern */
export interface PatronFigurasSpec {
  tipo_concreto: 'patron_figuras'
  tipo_pieza: 'cuadrado' | 'triangulo' | 'circulo' // piece shape
  terminos: number[] // pieces per visible term, e.g. [1, 3, 5]
  termino_objetivo: number // pieces the student must place for next term
  pregunta: string
  pista?: string
}

/** Spec for fichas_positivas_negativas — +/- chips for integer operations */
export interface FichasPositivasNegativasSpec {
  tipo_concreto: 'fichas_positivas_negativas'
  positivas: number // initial positive chips
  negativas: number // initial negative chips
  resultado_objetivo: number // expected result after cancellation
  pregunta: string
  pista?: string
}

/** Spec for azulejos_algebra — algebra tiles for equations */
export interface AzulejosAlgebraSpec {
  tipo_concreto: 'azulejos_algebra'
  ecuacion: string // display equation, e.g. "2x + 3 = 7"
  lado_izquierdo: { x_barras: number; unidades: number }
  lado_derecho: { x_barras: number; unidades: number }
  solucion: number
  pregunta: string
  pista?: string
}

/** Spec for geoplano — geoboard with pegs and rubber bands */
export interface GeoplanoSpec {
  tipo_concreto: 'geoplano'
  filas: number // grid rows (e.g. 5)
  columnas: number // grid columns (e.g. 5)
  figura_objetivo: Array<[number, number]> // ordered points [[row,col],...] forming the shape
  propiedad_a_medir?: 'perimetro' | 'area' | 'angulo'
  valor_esperado?: number // expected measurement
  pregunta: string
  pista?: string
}

/** Spec for dados_ruleta — dice rolls and spinner for probability */
export interface DadosRuletaSpec {
  tipo_concreto: 'dados_ruleta'
  tipo: 'dado' | 'ruleta' | 'moneda'
  caras?: number // dice faces (default 6)
  secciones_ruleta?: Array<{ label: string; color: string }> // spinner sections
  lanzamientos: number // number of trials to run
  evento_favorable: string // description of favorable event
  respuesta_probabilidad: string // expected probability as fraction, e.g. "1/6"
  pregunta: string
  pista?: string
}

/** Spec for histograma_construible — build a histogram by setting bar heights */
export interface HistogramaConstruibleSpec {
  tipo_concreto: 'histograma_construible'
  categorias: Array<{ label: string; color: string }>
  frecuencias_objetivo: number[] // correct frequency for each category
  datos_brutos?: string[] // raw data items to count (optional context)
  pregunta: string
  pista?: string
}

/** Spec for compas_circulo — SVG compass/circle drawing tool */
export interface CompasCirculoSpec {
  tipo_concreto: 'compas_circulo'
  centro: [number, number] // center point [x, y] on grid
  radio_objetivo: number // correct radius in grid units
  elementos_a_trazar?: Array<'radio' | 'diametro' | 'cuerda' | 'sector'>
  pregunta: string
  pista?: string
}

/** Spec for tabla_verdad — interactive truth table for logic */
export interface TablaVerdadSpec {
  tipo_concreto: 'tabla_verdad'
  variables: string[] // e.g. ["p", "q"]
  expresion: string // e.g. "p AND q", "p OR q", "IF p THEN q"
  valores_objetivo: boolean[] // correct column values for each row (2^n rows)
  pregunta: string
  pista?: string
}

/** Spec for interruptores_binarios — ON/OFF toggles for binary */
export interface InterruptoresBinariosSpec {
  tipo_concreto: 'interruptores_binarios'
  num_bits: number // e.g. 4 for 4-bit numbers
  valor_objetivo: number // decimal value to represent, e.g. 13 = 1101
  pregunta: string
  pista?: string
}

// Union of all concrete specs (extend as new manipulables are built)
export type ManipulableSpec =
  | DulcesAgrupablesSpec
  | ChocolateSecableSpec
  | BloquesBase10Spec
  | BalanzaSpec
  | RectaNumericaSpec
  | TirasFraccionesSpec
  | Cuadricula100Spec
  | PatronFigurasSpec
  | FichasPositivasNegativasSpec
  | AzulejosAlgebraSpec
  | GeoplanoSpec
  | DadosRuletaSpec
  | HistogramaConstruibleSpec
  | CompasCirculoSpec
  | TablaVerdadSpec
  | InterruptoresBinariosSpec
// Future: SolidoSpec

export interface BloqueConcreto {
  manipulable: ManipulableSpec
  intentos_para_pista: number // default 3, show hint after N failed attempts
}

// ── Bloque Pictorico ─────────────────────────────────────────────

export interface Barra {
  label: string
  valor: number
  color: string
  subdivisiones?: number
}

export interface ModeloBarrasSpec {
  tipo_representacion: 'modelo_barras'
  barras: Barra[]
  total?: { valor: number; visible: boolean }
  incognita?: { posicion: 'barra' | 'total'; label: string }
  orientacion?: 'horizontal' | 'vertical'
}

// ── Diagrama Geométrico (angles, segments, distances, etc.) ─────

export type TipoElementoGeo =
  | 'punto'
  | 'segmento'
  | 'angulo'
  | 'recta'
  | 'arco'
  | 'poligono'
  | 'cuadricula'

export interface PuntoGeo {
  id: string
  x: number
  y: number
  label?: string
}

export interface SegmentoGeo {
  tipo: 'segmento' | 'recta'
  desde: string // punto id
  hasta: string // punto id
  label?: string
  estilo?: 'solido' | 'punteado' | 'doble'
  color?: string
  medida?: string // e.g. "4 u" or "3 cm"
}

export interface AnguloGeo {
  vertice: string // punto id
  lado_a: string // punto id
  lado_b: string // punto id
  medida?: string // e.g. "45°"
  color?: string
  arco?: boolean // draw arc (default true)
}

export interface PoligonoGeo {
  puntos: string[] // punto ids in order
  relleno?: string // fill color
  opacidad?: number
}

export interface CuadriculaGeo {
  filas: number
  columnas: number
  celdas_resaltadas?: Array<[number, number]> // [fila, col] pairs to highlight
  color_resaltado?: string
}

export interface DiagramaGeometricoSpec {
  tipo_representacion: 'diagrama_geometrico'
  ancho: number // viewBox width in grid units
  alto: number // viewBox height in grid units
  puntos: PuntoGeo[]
  segmentos?: SegmentoGeo[]
  angulos?: AnguloGeo[]
  poligonos?: PoligonoGeo[]
  cuadricula?: CuadriculaGeo
  titulo?: string
}

// ── Tabla pictórica (logic, stats, comparisons) ─────────────────

export interface TablaPictoricaSpec {
  tipo_representacion: 'tabla'
  columnas: Array<{ key: string; header: string }>
  filas: Array<Record<string, string | number | boolean>>
  resaltados?: Array<{ fila: number; columna: string; color: string }>
  titulo?: string
}

export type RepresentacionPictorica = ModeloBarrasSpec | DiagramaGeometricoSpec | TablaPictoricaSpec

export interface PreguntaPictorico {
  pregunta: string
  tipo: TipoPregunta
  opciones?: string[]
  respuesta: string | boolean
  /** Keywords/criteria the AI grader should look for in open answers (3-5 items) */
  criterios_aceptacion?: string[]
}

export interface BloquePictorico {
  representacion: RepresentacionPictorica
  /** @deprecated Use representacion instead. Kept for backward compat with existing tareas. */
  modelo_barras?: ModeloBarrasSpec
  preguntas: PreguntaPictorico[] // 1-2 questions about the visual
}

// ── Bloque Abstracto ─────────────────────────────────────────────

export interface PreguntaAbstracto {
  tipo: TipoPregunta
  pregunta: string
  opciones?: string[]
  respuesta: string | boolean
  /** Keywords/criteria the AI grader should look for in open answers (3-5 items) */
  criterios_aceptacion?: string[]
}

export interface BloqueAbstracto {
  preguntas: PreguntaAbstracto[]
}

// ── Anchor Task context ──────────────────────────────────────────

export interface ObjetoContexto {
  nombre: string
  emoji: string
}

export type TipoContexto =
  | 'razon'
  | 'proporcion'
  | 'reparto'
  | 'comparacion'
  | 'fraccion'
  | 'ecuacion'
  | 'porcentaje'
  | 'patron'
  | 'medicion'
  | 'probabilidad'
  | 'estadistica'
  | 'geometria'
  | 'logica'
  | 'numero'

export interface ContextoAnchor {
  /** Personaje protagonista del problema */
  personaje: string
  /** Objetos del problema (a y b forman la relacion) */
  objetos: {
    a: ObjetoContexto
    b: ObjetoContexto
  }
  /** Valores numericos clave del anchor (flexible per topic) */
  valores_clave: {
    razon?: [number, number]
    objetivo?: number
    [key: string]: unknown
  }
  /** Tipo de problema pedagogico */
  tipo: TipoContexto
  /** Narrativa corta del problema ancla (2-3 frases) */
  narrativa: string
  /** Pregunta central que guia las 3 etapas */
  pregunta_central: string
  /** Frases de transicion narrativa entre etapas */
  transiciones: {
    concreto: string
    pictorico: string
    abstracto: string
    /** Resumen retroactivo tras concreto (mostrado al entrar a pictorico) */
    bridge_pictorico?: string
    /** Resumen retroactivo tras pictorico (mostrado al entrar a abstracto) */
    bridge_abstracto?: string
  }
}

// ── Tarea CPA (complete structure) ───────────────────────────────

export interface TareaCPA {
  /** Reference secuencia number (1-36), null for custom AI-generated tareas */
  secuencia_ref: number | null
  /** Contexto narrativo que atraviesa las 3 etapas (anchor task).
   *  Opcional para backward compat con tareas existentes. */
  contexto?: ContextoAnchor
  concreto: BloqueConcreto
  pictorico: BloquePictorico
  abstracto: BloqueAbstracto
}

// ── Scoring ──────────────────────────────────────────────────────

export interface ScoreEtapa {
  nota: number // 0-10
  completada: boolean
}

export interface ScoresCPA {
  concreto: ScoreEtapa
  pictorico: ScoreEtapa
  abstracto: ScoreEtapa
  global: number // 0-10 weighted average
}

// ── Intento (attempt tracking) ───────────────────────────────────

export interface IntentoConcreto {
  intentos_antes_validacion: number
  pista_utilizada: boolean
  completada: boolean
}

export interface IntentoPictorico {
  respuestas: Record<string, string | boolean>
  completada: boolean
}

export interface IntentoAbstracto {
  respuestas: Record<string, string | boolean>
  completada: boolean
}

export interface Intento {
  numero: number
  inicio_at: string // ISO timestamp
  fin_at: string | null
  tiempo_concreto_ms: number
  tiempo_pictorico_ms: number
  tiempo_abstracto_ms: number
  concreto: IntentoConcreto
  pictorico: IntentoPictorico
  abstracto: IntentoAbstracto
  scores_cpa: ScoresCPA
}

// ── Student progress (localStorage persistence) ─────────────────

export type EtapaCPA = 'concreto' | 'pictorico' | 'abstracto' | 'completada'

export interface ProgresoCPA {
  tarea_id: string
  alumno_id: string
  etapa_actual: EtapaCPA
  intento_actual: number
  concreto_estado: {
    intentos: number
    pista_mostrada: boolean
    validado: boolean
    // Component-specific state (e.g., current group positions)
    estado_manipulable?: Record<string, unknown>
  }
  pictorico_estado: {
    respuestas: Record<string, string | boolean>
    validado: boolean
  }
  abstracto_estado: {
    respuestas: Record<string, string | boolean>
  }
  updated_at: string // ISO timestamp
}
