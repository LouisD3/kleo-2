import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 30b: Frecuencia relativa
 * Concepto clave: Calcular e interpretar la frecuencia relativa como proporcion del total
 *
 * Concreto: HistogramaConstruible (deporte favorito de 20 alumnos)
 * Pictorico: Tabla de frecuencias absolutas y relativas
 * Abstracto: 3 preguntas progresivas sobre frecuencia relativa
 */
export const tareaSecuencia30b: TareaCPA = {
  secuencia_ref: 30,
  concepto_clave: 'Calcular e interpretar la frecuencia relativa como proporcion del total',
  contexto: {
    personaje: 'Profesor Garcia',
    objetos: { a: { nombre: 'deporte', emoji: '⚽' }, b: { nombre: 'frecuencia', emoji: '📊' } },
    valores_clave: { total: 20 },
    tipo: 'estadistica',
    narrativa: 'El Profesor Garcia encuesto a 20 alumnos sobre su deporte favorito. Ahora quiere saber que proporcion del grupo prefiere cada deporte.',
    pregunta_central: '¿Que fraccion del grupo prefiere cada deporte?',
    transiciones: {
      concreto: 'Construye el histograma contando cuantos alumnos prefieren cada deporte.',
      bridge_pictorico: 'Futbol: 8, Basquet: 5, Natacion: 4, Otro: 3. Total = 20.',
      pictorico: 'Observa la tabla con frecuencias absolutas y relativas.',
      bridge_abstracto: 'Frecuencia relativa = absoluta / total. La suma siempre es 1.',
      abstracto: 'Ahora calcula frecuencias relativas y compara grupos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'histograma_construible',
      categorias: [
        { label: 'Futbol', color: 'verde' },
        { label: 'Basquet', color: 'azul' },
        { label: 'Natacion', color: 'amarillo' },
        { label: 'Otro', color: 'morado' },
      ],
      frecuencias_objetivo: [8, 5, 4, 3],
      datos_brutos: [
        'Futbol', 'Basquet', 'Futbol', 'Natacion', 'Futbol',
        'Otro', 'Basquet', 'Futbol', 'Natacion', 'Futbol',
        'Basquet', 'Otro', 'Futbol', 'Natacion', 'Basquet',
        'Futbol', 'Otro', 'Natacion', 'Futbol', 'Basquet',
      ],
      pregunta:
        'Se encuesto a 20 alumnos sobre su deporte favorito. Cuenta las respuestas y construye la grafica de frecuencias.',
      pista:
        'Recorre la lista uno por uno. Futbol aparece muchas veces. Lleva la cuenta con marcas.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'deporte', header: 'Deporte' },
        { key: 'absoluta', header: 'Frec. absoluta' },
        { key: 'relativa', header: 'Frec. relativa' },
        { key: 'porcentaje', header: 'Porcentaje' },
      ],
      filas: [
        { deporte: 'Futbol', absoluta: 8, relativa: '8/20 = 0.4', porcentaje: '40%' },
        { deporte: 'Basquet', absoluta: 5, relativa: '5/20 = 0.25', porcentaje: '25%' },
        { deporte: 'Natacion', absoluta: 4, relativa: '4/20 = 0.2', porcentaje: '20%' },
        { deporte: 'Otro', absoluta: 3, relativa: '3/20 = 0.15', porcentaje: '15%' },
      ],
      resaltados: [
        { fila: 0, columna: 'relativa', color: '#10B981' },
      ],
      titulo: 'Tabla de frecuencias: Deporte favorito (20 alumnos)',
    },
    preguntas: [
      {
        pregunta:
          'La frecuencia absoluta de Futbol es 8 y el total es 20. Cual es la frecuencia relativa de Futbol?',
        tipo: 'opcion_multiple',
        opciones: ['A) 8', 'B) 0.4', 'C) 0.8', 'D) 20'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Suma todas las frecuencias relativas de la tabla. Que resultado obtienes? Explica por que siempre da ese valor.',
        tipo: 'abierta',
        respuesta:
          '0.4 + 0.25 + 0.2 + 0.15 = 1.0. La suma siempre es 1 porque las frecuencias relativas representan la proporcion de cada categoria respecto al total. Todas las partes juntas forman el 100%.',
        criterios_aceptacion: ['suma igual a 1', 'proporcion respecto al total', 'todas las partes juntas', '100%'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En el grupo A (20 alumnos), 8 prefieren futbol. En el grupo B (50 alumnos), 15 prefieren futbol. En cual grupo el futbol es proporcionalmente mas popular?',
        opciones: [
          'A) Grupo A (8/20 = 0.4 = 40%)',
          'B) Grupo B (15/50 = 0.3 = 30%)',
          'C) Son iguales',
          'D) No se puede comparar',
        ],
        respuesta: 'A',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En una escuela de 200 alumnos, la frecuencia relativa de los que usan lentes es 0.35. Cuantos alumnos usan lentes? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Frecuencia relativa = frecuencia absoluta / total.\nPaso 2: 0.35 = frecuencia absoluta / 200.\nPaso 3: frecuencia absoluta = 0.35 x 200 = 70.\nRespuesta: 70 alumnos usan lentes.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica por que la frecuencia relativa es mas util que la absoluta cuando quieres comparar dos grupos de diferente tamano. Usa el ejemplo de los deportes.',
        respuesta:
          'Si en un grupo de 20, 8 prefieren futbol (absoluta=8), y en un grupo de 100, 30 prefieren futbol (absoluta=30), la absoluta diria que el segundo grupo tiene mas aficionados. Pero la relativa muestra que el primero tiene 40% vs 30%. La relativa permite una comparacion justa.',
        criterios_aceptacion: ['grupos de diferente tamano', 'absoluta puede engañar', 'relativa como proporcion', 'comparacion justa o porcentaje'],
      },
    ],
  },
}
