import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 29: Analisis estadistico
 * Concepto clave: Organizar datos en una grafica de barras
 *
 * Concreto: Histograma construible (deporte favorito de 20 alumnos)
 * Pictorico: Modelo en barras (distribucion de frecuencias)
 * Abstracto: 3 preguntas con progresion de dificultad sobre lectura de graficas
 */
export const tareaSecuencia29: TareaCPA = {
  secuencia_ref: 29,
  concepto_clave: 'Organizar datos en una grafica de barras',
  contexto: {
    personaje: 'Profesor Garcia',
    objetos: { a: { nombre: 'deporte', emoji: '⚽' }, b: { nombre: 'grafica', emoji: '📊' } },
    valores_clave: { total_alumnos: 20 },
    tipo: 'estadistica',
    narrativa: 'El Profesor Garcia hizo una encuesta sobre deportes favoritos en su clase de 20 alumnos. Quiere organizar los resultados en una grafica.',
    pregunta_central: '¿Como se organizan los datos en una grafica de barras?',
    transiciones: {
      concreto: 'Construye el histograma ajustando la altura de cada barra segun los datos.',
      bridge_pictorico: 'Futbol es el mas popular con 8 alumnos.',
      pictorico: 'Observa la distribucion en el modelo de barras.',
      bridge_abstracto: 'La grafica de barras muestra frecuencias de cada categoria.',
      abstracto: 'Ahora interpreta y construye graficas.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'histograma_construible',
      categorias: [
        { label: 'Futbol', color: 'azul' },
        { label: 'Basquet', color: 'rojo' },
        { label: 'Natacion', color: 'verde' },
        { label: 'Otro', color: 'amarillo' },
      ],
      frecuencias_objetivo: [8, 5, 4, 3],
      datos_brutos: [
        'Futbol', 'Futbol', 'Basquet', 'Natacion', 'Futbol',
        'Otro', 'Basquet', 'Futbol', 'Natacion', 'Futbol',
        'Basquet', 'Otro', 'Futbol', 'Natacion', 'Futbol',
        'Basquet', 'Otro', 'Futbol', 'Basquet', 'Natacion',
      ],
      pregunta:
        'Una encuesta pregunto a 20 alumnos su deporte favorito. Cuenta los datos y construye la grafica.',
      pista:
        'Cuenta cuantas veces aparece cada deporte en la lista. Por ejemplo, cuenta cuantas veces dice "Futbol".',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Futbol', valor: 8, color: 'azul' },
        { label: 'Basquet', valor: 5, color: 'rojo' },
        { label: 'Natacion', valor: 4, color: 'verde' },
        { label: 'Otro', valor: 3, color: 'amarillo' },
      ],
      total: { valor: 20, visible: true },
      orientacion: 'vertical',
    },
    preguntas: [
      {
        pregunta:
          'Observa la grafica de barras. Cual deporte fue el mas popular entre los alumnos?',
        tipo: 'opcion_multiple',
        opciones: ['A) Basquet', 'B) Futbol', 'C) Natacion', 'D) Otro'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando la grafica, cuantos alumnos mas prefieren Futbol que Natacion? Explica como lo calculaste.',
        tipo: 'calculo',
        respuesta:
          'Futbol tiene 8 alumnos y Natacion tiene 4 alumnos. La diferencia es 8 - 4 = 4. Hay 4 alumnos mas que prefieren Futbol que Natacion.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En la encuesta de deportes, cuantos alumnos eligieron Basquet o Natacion en total?',
        opciones: ['A) 7', 'B) 8', 'C) 9', 'D) 12'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Si llegan 5 alumnos nuevos y 3 eligen Futbol y 2 eligen Otro, cuantos alumnos hay ahora en total y cual es la nueva frecuencia de cada deporte?',
        respuesta:
          'Total original: 20 alumnos. Se agregan 5, nuevo total: 25 alumnos.\nFutbol: 8 + 3 = 11\nBasquet: 5 (sin cambio)\nNatacion: 4 (sin cambio)\nOtro: 3 + 2 = 5',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que una grafica de barras es util para representar los resultados de una encuesta.',
        respuesta:
          'Una grafica de barras permite comparar categorias de forma visual y rapida. Es mas facil ver cual categoria es la mayor o menor mirando la altura de las barras que leyendo una lista de numeros.',
        criterios_aceptacion: [
          'visual o rapida comparacion',
          'altura de las barras',
          'identificar la mas popular o menos popular',
          'mas facil que una lista de numeros',
        ],
      },
    ],
  },
}
