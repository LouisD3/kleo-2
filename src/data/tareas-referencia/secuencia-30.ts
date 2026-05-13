import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 30: Frecuencia absoluta y relativa
 * Concepto clave: Distinguir frecuencia absoluta de frecuencia relativa
 *
 * Concreto: Histograma construible (color favorito de 10 alumnos)
 * Pictorico: Modelo en barras (frecuencias absolutas)
 * Abstracto: 3 preguntas con progresion de dificultad sobre frecuencias
 */
export const tareaSecuencia30: TareaCPA = {
  secuencia_ref: 30,
  concreto: {
    manipulable: {
      tipo_concreto: 'histograma_construible',
      categorias: [
        { label: 'Rojo', color: 'rojo' },
        { label: 'Azul', color: 'azul' },
        { label: 'Verde', color: 'verde' },
      ],
      frecuencias_objetivo: [6, 3, 1],
      datos_brutos: [
        'Rojo', 'Azul', 'Rojo', 'Rojo', 'Verde',
        'Azul', 'Rojo', 'Rojo', 'Azul', 'Rojo',
      ],
      pregunta:
        'Se pregunto a 10 alumnos su color favorito. Cuenta cuantas veces aparece cada color y construye la grafica.',
      pista:
        'Recorre la lista uno por uno y lleva la cuenta de cada color. Rojo aparece varias veces.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Rojo', valor: 6, color: 'rojo' },
        { label: 'Azul', valor: 3, color: 'azul' },
        { label: 'Verde', valor: 1, color: 'verde' },
      ],
      total: { valor: 10, visible: true },
      orientacion: 'vertical',
    },
    preguntas: [
      {
        pregunta:
          'Observa la grafica. La frecuencia absoluta de Rojo es 6. Cual es su frecuencia relativa?',
        tipo: 'opcion_multiple',
        opciones: ['A) 6', 'B) 6/10', 'C) 3/10', 'D) 1/10'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Calcula la frecuencia relativa de cada color y verifica que la suma de todas las frecuencias relativas sea igual a 1.',
        tipo: 'calculo',
        respuesta:
          'Frecuencia relativa de Rojo: 6/10 = 0.6\nFrecuencia relativa de Azul: 3/10 = 0.3\nFrecuencia relativa de Verde: 1/10 = 0.1\nSuma: 0.6 + 0.3 + 0.1 = 1. La suma de todas las frecuencias relativas siempre es 1.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Si en un grupo de 20 alumnos, 8 prefieren pizza, cual es la frecuencia relativa de pizza?',
        opciones: ['A) 8', 'B) 8/20', 'C) 20/8', 'D) 12/20'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En una encuesta de 50 personas, la frecuencia relativa de "Si" es 0.4. Cuantas personas respondieron "Si"? Muestra tu procedimiento.',
        respuesta:
          'Paso 1: Frecuencia relativa = frecuencia absoluta / total.\nPaso 2: 0.4 = frecuencia absoluta / 50.\nPaso 3: frecuencia absoluta = 0.4 x 50 = 20.\nRespuesta: 20 personas respondieron "Si".',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras la diferencia entre frecuencia absoluta y frecuencia relativa, y da un ejemplo de cuando es mas util usar la relativa.',
        respuesta:
          'La frecuencia absoluta es cuantas veces aparece un dato (ejemplo: 6 alumnos). La frecuencia relativa es la proporcion respecto al total (6/10 = 60%). La relativa es mas util para comparar grupos de diferente tamano.',
        criterios_aceptacion: [
          'absoluta: numero de veces',
          'relativa: proporcion o porcentaje',
          'util para comparar grupos distintos',
          'suma de relativas igual a 1',
        ],
      },
    ],
  },
}
