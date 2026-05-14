import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 31: Medidas de tendencia central y rango
 * Concepto clave: Calcular moda, media y mediana a partir de datos organizados
 *
 * Concreto: Histograma construible (calificaciones de 15 alumnos)
 * Pictorico: Modelo en barras (distribucion de calificaciones)
 * Abstracto: 3 preguntas con progresion de dificultad sobre tendencia central
 */
export const tareaSecuencia31: TareaCPA = {
  secuencia_ref: 31,
  contexto: {
    personaje: 'Profesor Garcia',
    objetos: { a: { nombre: 'calificacion', emoji: '📝' }, b: { nombre: 'promedio', emoji: '📊' } },
    valores_clave: { datos: [5, 6, 7, 8, 9] },
    tipo: 'estadistica',
    narrativa: 'El Profesor Garcia tiene las calificaciones de sus alumnos y quiere calcular la moda, media y mediana para resumir los datos.',
    pregunta_central: '¿Cual es la media, mediana y moda de las calificaciones?',
    transiciones: {
      concreto: 'Construye el histograma con las frecuencias de cada calificacion.',
      bridge_pictorico: 'La barra mas alta indica la moda.',
      pictorico: 'Observa la distribucion en el modelo.',
      bridge_abstracto: 'Media = suma/n, Mediana = valor central, Moda = mas frecuente.',
      abstracto: 'Ahora calcula medidas de tendencia central.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'histograma_construible',
      categorias: [
        { label: '5', color: 'amarillo' },
        { label: '6', color: 'azul' },
        { label: '7', color: 'verde' },
        { label: '8', color: 'morado' },
        { label: '9', color: 'rojo' },
      ],
      frecuencias_objetivo: [2, 3, 5, 4, 1],
      pregunta:
        'Los alumnos sacaron estas calificaciones: 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 9. Construye el histograma.',
      pista:
        'Cuenta cuantas veces aparece cada calificacion. Por ejemplo, el 7 aparece 5 veces.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: '5', valor: 2, color: 'amarillo' },
        { label: '6', valor: 3, color: 'azul' },
        { label: '7', valor: 5, color: 'verde' },
        { label: '8', valor: 4, color: 'morado' },
        { label: '9', valor: 1, color: 'rojo' },
      ],
      total: { valor: 15, visible: true },
      orientacion: 'vertical',
    },
    preguntas: [
      {
        pregunta:
          'Observa el histograma. Cual calificacion tiene la barra mas alta? Esa es la moda.',
        tipo: 'opcion_multiple',
        opciones: ['A) 5', 'B) 6', 'C) 7', 'D) 8'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Usando los datos del histograma, calcula la media (promedio) de las calificaciones.',
        tipo: 'abierta',
        respuesta:
          'Suma = (5x2) + (6x3) + (7x5) + (8x4) + (9x1) = 10 + 18 + 35 + 32 + 9 = 104.\nTotal de alumnos = 15.\nMedia = 104 / 15 = 6.93 (aproximadamente 6.9).',
        criterios_aceptacion: ['suma total 104', 'dividir entre 15 alumnos', 'media aproximadamente 6.9 o 6.93 o 104/15'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Hay 15 calificaciones ordenadas de menor a mayor. Cual posicion ocupa la mediana?',
        opciones: [
          'A) La posicion 7',
          'B) La posicion 8',
          'C) La posicion 15',
          'D) La posicion 5',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Encuentra la mediana y el rango de los datos: 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 9. Muestra tu procedimiento.',
        respuesta:
          'Paso 1: Los datos ya estan ordenados y son 15 valores.\nPaso 2: La mediana es el valor en la posicion (15+1)/2 = 8.\nPaso 3: El octavo valor es 7. La mediana es 7.\nPaso 4: Rango = valor maximo - valor minimo = 9 - 5 = 4.\nRespuesta: Mediana = 7, Rango = 4.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Un alumno dice que la media es la mejor medida para describir las calificaciones del grupo. Otro dice que la moda es mejor. Con cual estas de acuerdo y por que?',
        respuesta:
          'Ambas son utiles. La media da el promedio del grupo pero puede cambiar mucho si hay un valor muy alto o muy bajo. La moda dice cual calificacion fue la mas comun y no se afecta por valores extremos. Depende de la situacion.',
        criterios_aceptacion: [
          'media: promedio general',
          'moda: valor mas frecuente',
          'valores extremos afectan la media',
          'ambas son utiles segun el caso',
        ],
      },
    ],
  },
}
