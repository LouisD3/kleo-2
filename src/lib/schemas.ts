import { z } from 'zod'

// --- Schémas d'entrée (ce que le client envoie) ---

const pdaItemSchema = z.object({
  pda: z.string().min(1),
  contenido: z.string().optional(),
})

const generarPayloadSchema = z.object({
  materia: z.string().min(1, 'La materia es requerida'),
  dificultad: z.enum(['Fácil', 'Media', 'Difícil']),
  metodologia: z.enum(['Feynman', 'Memorización activa', 'Resolución de problemas']),
  tipos: z.array(z.string().min(1)).min(1, 'Selecciona al menos un tipo de ejercicio'),
  numeroPreguntas: z.number().int().min(3).max(20),
  pda: z.union([pdaItemSchema, z.array(pdaItemSchema).max(5)]).optional(),
  instrucciones: z.string().optional(),
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
  respuestasAlumno: z.array(z.string().nullable()),
})

export const requestBodySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('generar'), payload: generarPayloadSchema }),
  z.object({ type: z.literal('corregir'), payload: corregirPayloadSchema }),
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

// --- Types inférés ---

export type GenerarPayload = z.infer<typeof generarPayloadSchema>
export type CorregirPayload = z.infer<typeof corregirPayloadSchema>
export type Pregunta = z.infer<typeof preguntaSchema>
export type RequestBody = z.infer<typeof requestBodySchema>
export type GenerarResponse = z.infer<typeof generarResponseSchema>
export type CorregirResponse = z.infer<typeof corregirResponseSchema>
