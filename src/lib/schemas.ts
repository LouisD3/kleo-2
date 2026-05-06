import { z } from 'zod'

// --- Schémas d'entrée (ce que le client envoie) ---

const pdaItemSchema = z.object({
  pda: z.string().min(1),
  contenido: z.string().optional(),
})

const generarPayloadSchema = z.object({
  materia: z.string().min(1, 'La materia es requerida'),
  dificultad: z.enum(['Fácil', 'Media', 'Difícil']),
  metodologia: z.enum([
    'Feynman',
    'Memorización activa',
    'Resolución de problemas',
    'Práctica directa',
  ]),
  tipos: z.array(z.string().min(1)).min(1, 'Selecciona al menos un tipo de ejercicio'),
  numeroPreguntas: z.number().int().min(1).max(20),
  pda: z.union([pdaItemSchema, z.array(pdaItemSchema).max(5)]).optional(),
  instrucciones: z.string().nullable().optional(),
  idioma: z.enum(['English']).optional(),
})

const preguntaSchema = z.object({
  tipo: z.enum(['opcion_multiple', 'verdadero_falso', 'abierta', 'espacios', 'calculo']),
  pregunta: z.string().min(1),
  opciones: z.array(z.string()).optional(),
  respuesta: z.union([z.string(), z.boolean()]).optional(),
})

const corregirPayloadSchema = z.object({
  tarea: z.object({
    materia: z.string().min(1),
    dificultad: z.string().min(1),
    preguntas: z.array(preguntaSchema).min(1),
  }),
  respuestasAlumno: z.union([
    z.array(z.string().nullable()),
    z.record(z.string(), z.string().nullable().optional()),
  ]),
})

const modificarPayloadSchema = z.object({
  pregunta: preguntaSchema,
  instruccion: z.string().min(1, 'La instrucción es requerida'),
  materia: z.string().min(1),
  dificultad: z.enum(['Fácil', 'Media', 'Difícil']),
})

const diagnosticarPayloadSchema = z.object({
  aprendizaje: z.string().min(1),
  pregunta_original: preguntaSchema,
  respuesta_alumno: z.string().min(1),
  contexto_devoir: z.object({
    materia: z.string().min(1),
    dificultad: z.string().min(1),
    metodologia: z.string().optional(),
  }),
  intento_remediation_n: z.number().int().min(0).max(2),
})

export const requestBodySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('generar'), payload: generarPayloadSchema }),
  z.object({ type: z.literal('corregir'), payload: corregirPayloadSchema }),
  z.object({ type: z.literal('modificar'), payload: modificarPayloadSchema }),
  z.object({ type: z.literal('diagnosticar_y_remediar'), payload: diagnosticarPayloadSchema }),
])

// --- Schémas de sortie (ce que Claude renvoie) ---

const preguntaGeneradaSchema = z.object({
  tipo: z.enum(['opcion_multiple', 'verdadero_falso', 'abierta', 'espacios', 'calculo']),
  pregunta: z.string().min(1),
  opciones: z.array(z.string()).optional(),
  respuesta: z.union([z.string(), z.boolean()]).optional(),
})

export const generarResponseSchema = z.object({
  preguntas: z.array(preguntaGeneradaSchema).min(1),
})

const retroalimentacionItemSchema = z.object({
  indice_pregunta: z.number().int().min(0),
  correcta: z.boolean(),
  comentario: z.string(),
})

export const corregirResponseSchema = z.object({
  calificacion: z.number().min(0).max(10),
  retroalimentacion: z.array(retroalimentacionItemSchema).min(1),
  areas_de_mejora: z.array(z.string()).max(3),
})

export const diagnosticarResponseSchema = z.object({
  es_correcta: z.boolean(),
  diagnostico: z.string(),
  lacune_detectee: z.string().optional(),
  pregunta_remediation: preguntaGeneradaSchema.optional(),
})

// --- Types inférés ---

export type GenerarPayload = z.infer<typeof generarPayloadSchema>
export type CorregirPayload = z.infer<typeof corregirPayloadSchema>
export type ModificarPayload = z.infer<typeof modificarPayloadSchema>
export type DiagnosticarPayload = z.infer<typeof diagnosticarPayloadSchema>
export type Pregunta = z.infer<typeof preguntaSchema>
export type RequestBody = z.infer<typeof requestBodySchema>
export type GenerarResponse = z.infer<typeof generarResponseSchema>
export type CorregirResponse = z.infer<typeof corregirResponseSchema>
export type DiagnosticarResponse = z.infer<typeof diagnosticarResponseSchema>
