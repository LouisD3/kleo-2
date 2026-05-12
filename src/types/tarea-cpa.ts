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
  | 'solidos_3d' // 3D solids (geometry)
  | 'dados_monedas' // dice/coins/urns (probability)
  | 'histograma_construible' // buildable histogram (statistics)

/** Spec for dulces_agrupables manipulable */
export interface DulcesAgrupablesSpec {
  tipo_concreto: 'dulces_agrupables'
  cantidad: number
  grupos_objetivo: number
  soluciones_validas: Array<{ grupos: number; por_grupo: number }>
  pregunta: string
  pista?: string
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

// Union of all concrete specs (extend as new manipulables are built)
export type ManipulableSpec =
  | DulcesAgrupablesSpec
  | ChocolateSecableSpec
  | BloquesBase10Spec
  | BalanzaSpec
// Future: SolidoSpec, DadosSpec, HistogramaSpec

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
  barras: Barra[]
  total?: { valor: number; visible: boolean }
  incognita?: { posicion: 'barra' | 'total'; label: string }
  orientacion?: 'horizontal' | 'vertical'
}

export interface PreguntaPictorico {
  pregunta: string
  tipo: TipoPregunta
  opciones?: string[]
  respuesta: string | boolean
}

export interface BloquePictorico {
  modelo_barras: ModeloBarrasSpec
  preguntas: PreguntaPictorico[] // 1-2 questions about the bar model
}

// ── Bloque Abstracto ─────────────────────────────────────────────

export interface PreguntaAbstracto {
  tipo: TipoPregunta
  pregunta: string
  opciones?: string[]
  respuesta: string | boolean
}

export interface BloqueAbstracto {
  preguntas: PreguntaAbstracto[]
}

// ── Tarea CPA (complete structure) ───────────────────────────────

export interface TareaCPA {
  /** Reference secuencia number (1-36), null for custom AI-generated tareas */
  secuencia_ref: number | null
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
