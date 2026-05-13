import { z } from 'zod'

// --- Schémas d'entrée (ce que le client envoie) ---

const pdaItemSchema = z.object({
  pda: z.string().min(1),
  contenido: z.string().optional(),
})

const generarPayloadSchema = z.object({
  dificultad: z.enum(['Facil', 'Media', 'Dificil']),
  tipos: z.array(z.string().min(1)).min(1, 'Selecciona al menos un tipo de ejercicio'),
  numeroPreguntas: z.number().int().min(1).max(20),
  pda: z.union([pdaItemSchema, z.array(pdaItemSchema).max(5)]).optional(),
  instrucciones: z.string().nullable().optional(),
})

const preguntaSchema = z.object({
  tipo: z.enum(['opcion_multiple', 'verdadero_falso', 'abierta', 'espacios', 'calculo']),
  pregunta: z.string().min(1),
  opciones: z.array(z.string()).optional(),
  respuesta: z.union([z.string(), z.boolean()]).optional(),
  criterios_aceptacion: z.array(z.string()).optional(),
})

const corregirPayloadSchema = z.object({
  tarea: z.object({
    dificultad: z.string().min(1),
    contenido_cpa: z.array(preguntaSchema).min(1),
  }),
  respuestasAlumno: z.union([
    z.array(z.string().nullable()),
    z.record(z.string(), z.string().nullable().optional()),
  ]),
})

const generarCPAPayloadSchema = z.object({
  dificultad: z.enum(['Facil', 'Media', 'Dificil']),
  pda: z.union([pdaItemSchema, z.array(pdaItemSchema).max(5)]).optional(),
  instrucciones: z.string().nullable().optional(),
  tipo_concreto: z.string().min(1).default('dulces_agrupables'),
})

const modificarPayloadSchema = z.object({
  pregunta: preguntaSchema,
  instruccion: z.string().min(1, 'La instruccion es requerida'),
  dificultad: z.enum(['Facil', 'Media', 'Dificil']),
})

export const requestBodySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('generar'), payload: generarPayloadSchema }),
  z.object({ type: z.literal('generar_cpa'), payload: generarCPAPayloadSchema }),
  z.object({ type: z.literal('corregir'), payload: corregirPayloadSchema }),
  z.object({ type: z.literal('modificar'), payload: modificarPayloadSchema }),
])

// --- Schémas de sortie (ce que Claude renvoie) ---

const preguntaGeneradaSchema = z.object({
  tipo: z.enum(['opcion_multiple', 'verdadero_falso', 'abierta', 'espacios', 'calculo']),
  pregunta: z.string().min(1),
  opciones: z.array(z.string()).optional(),
  respuesta: z.union([z.string(), z.boolean()]).optional(),
  criterios_aceptacion: z.array(z.string()).optional(),
})

export const generarResponseSchema = z.object({
  preguntas: z.array(preguntaGeneradaSchema).min(1),
})

const objetoContextoSchema = z.object({
  nombre: z.string().min(1),
  emoji: z.string().min(1),
})

const contextoAnchorSchema = z.object({
  personaje: z.string().min(1),
  objetos: z.object({
    a: objetoContextoSchema,
    b: objetoContextoSchema,
  }),
  valores_clave: z.object({
    razon: z.tuple([z.number(), z.number()]).optional(),
    objetivo: z.number().optional(),
  }).passthrough(),
  tipo: z.string().min(1),
  narrativa: z.string().min(1),
  pregunta_central: z.string().min(1),
  transiciones: z.object({
    concreto: z.string().min(1),
    bridge_pictorico: z.string().optional(),
    pictorico: z.string().min(1),
    bridge_abstracto: z.string().optional(),
    abstracto: z.string().min(1),
  }),
})

const barraSchema = z.object({
  label: z.string(),
  valor: z.number(),
  color: z.string(),
  subdivisiones: z.number().optional(),
})

const modeloBarrasSpecSchema = z.object({
  tipo_representacion: z.literal('modelo_barras'),
  barras: z.array(barraSchema).min(1),
  total: z.object({ valor: z.number(), visible: z.boolean() }).optional(),
  incognita: z.object({ posicion: z.enum(['barra', 'total']), label: z.string() }).optional(),
  orientacion: z.enum(['horizontal', 'vertical']).optional(),
})

const puntoGeoSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  label: z.string().optional(),
})

const segmentoGeoSchema = z.object({
  tipo: z.enum(['segmento', 'recta']),
  desde: z.string(),
  hasta: z.string(),
  label: z.string().optional(),
  estilo: z.enum(['solido', 'punteado', 'doble']).optional(),
  color: z.string().optional(),
  medida: z.string().optional(),
})

const anguloGeoSchema = z.object({
  vertice: z.string(),
  lado_a: z.string(),
  lado_b: z.string(),
  medida: z.string().optional(),
  color: z.string().optional(),
  arco: z.boolean().optional(),
})

const poligonoGeoSchema = z.object({
  puntos: z.array(z.string()).min(3),
  relleno: z.string().optional(),
  opacidad: z.number().optional(),
})

const cuadriculaGeoSchema = z.object({
  filas: z.number(),
  columnas: z.number(),
  celdas_resaltadas: z.array(z.tuple([z.number(), z.number()])).optional(),
  color_resaltado: z.string().optional(),
})

const diagramaGeometricoSpecSchema = z.object({
  tipo_representacion: z.literal('diagrama_geometrico'),
  ancho: z.number(),
  alto: z.number(),
  puntos: z.array(puntoGeoSchema).min(1),
  segmentos: z.array(segmentoGeoSchema).optional(),
  angulos: z.array(anguloGeoSchema).optional(),
  poligonos: z.array(poligonoGeoSchema).optional(),
  cuadricula: cuadriculaGeoSchema.optional(),
  titulo: z.string().optional(),
})

const tablaPictoricaSpecSchema = z.object({
  tipo_representacion: z.literal('tabla'),
  columnas: z.array(z.object({ key: z.string(), header: z.string() })).min(1),
  filas: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))).min(1),
  resaltados: z.array(z.object({ fila: z.number(), columna: z.string(), color: z.string() })).optional(),
  titulo: z.string().optional(),
})

const representacionPictoricaSchema = z.discriminatedUnion('tipo_representacion', [
  modeloBarrasSpecSchema,
  diagramaGeometricoSpecSchema,
  tablaPictoricaSpecSchema,
])

export const generarCPAResponseSchema = z.object({
  contexto: contextoAnchorSchema,
  concreto: z.object({
    manipulable: z.record(z.string(), z.unknown()),
    intentos_para_pista: z.number().default(3),
  }),
  pictorico: z.object({
    representacion: representacionPictoricaSchema,
    preguntas: z.array(preguntaGeneradaSchema).min(1),
  }),
  abstracto: z.object({
    preguntas: z.array(preguntaGeneradaSchema).min(1),
  }),
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
export type GenerarCPAPayload = z.infer<typeof generarCPAPayloadSchema>
export type CorregirPayload = z.infer<typeof corregirPayloadSchema>
export type ModificarPayload = z.infer<typeof modificarPayloadSchema>
export type Pregunta = z.infer<typeof preguntaSchema>
export type RequestBody = z.infer<typeof requestBodySchema>
export type GenerarResponse = z.infer<typeof generarResponseSchema>
export type GenerarCPAResponse = z.infer<typeof generarCPAResponseSchema>
export type CorregirResponse = z.infer<typeof corregirResponseSchema>
