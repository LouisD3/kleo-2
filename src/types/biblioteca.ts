/**
 * Types for the pedagogical content library (biblioteca).
 * Matches the JSON structure in src/content/biblioteca/matematicas-1/
 */

// --- Evaluacion (base for Bloque Abstracto) ---

export type TipoPregunta =
  | 'opcion_multiple'
  | 'verdadero_falso'
  | 'abierta'
  | 'espacios'
  | 'calculo'

export interface PreguntaEvaluacion {
  tipo: TipoPregunta
  pregunta: string
  opciones?: string[]
  respuesta: string | boolean
}

export interface Evaluacion {
  preguntas: PreguntaEvaluacion[]
}

// --- Orientacion (teacher guide) ---

export interface BloqueDesarrollo {
  titulo: string
  diapositiva: string | null
  libro: string | null
  video: string | null
  descripcion: string
  tip: string | null
}

export interface PreguntaProfundiza {
  pregunta: string
  respuesta_modelo: string
}

export interface CierreIndividual {
  reflexiona: string
  profundiza: PreguntaProfundiza[]
}

export interface Orientacion {
  contenidos_especificos: string[]
  actividad_inicio: string[]
  desarrollo: BloqueDesarrollo[]
  cierre_individual: CierreIndividual
  cierre_grupal: string[]
  preguntas_comprension: string[]
}

// --- Libro (student reading material) ---

export interface Concepto {
  titulo: string
  contenido: string
  definicion?: string
  figura?: string | null
}

export interface Ejemplo {
  titulo: string
  enunciado: string
  pasos: string[]
  resultado: string
}

export interface Ejercicio {
  numero: number
  enunciado: string
  espacio: boolean
  lineas?: number
}

export interface Libro {
  introduccion: string
  conceptos: Concepto[]
  ejemplos: Ejemplo[]
  datos_curiosos: string
  ejercicios: Ejercicio[]
  puntos_clave: string[]
}

// --- Diapositiva ---

export interface Diapositiva {
  titulo: string
  puntos: string[]
  ejemplo: string
}

// --- Secuencia (top-level entry) ---

export interface Secuencia {
  secuencia: number
  titulo: string
  contenido: string
  pda: string
  evaluacion: Evaluacion
  orientacion: Orientacion
  libro: Libro
  diapositiva: Diapositiva[]
  video_script: string
}
