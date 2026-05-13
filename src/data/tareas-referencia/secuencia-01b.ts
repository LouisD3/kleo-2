import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 1B: Fracciones equivalentes
 * Concepto clave: Encontrar fracciones equivalentes usando tiras de fracciones
 *
 * Concreto: TirasFracciones (muro de fracciones, seleccionar equivalentes a 1/2)
 * Pictorico: Modelo en barras (comparar 1/2, 2/4, 3/6)
 * Abstracto: 3 preguntas progresivas sobre equivalencia de fracciones
 */
export const tareaSecuencia01b: TareaCPA = {
  secuencia_ref: 1,
  concreto: {
    manipulable: {
      tipo_concreto: 'tiras_fracciones',
      fraccion_objetivo: '1/2',
      filas: [
        { divisiones: 2, color: 'amarillo' },
        { divisiones: 3, color: 'azul' },
        { divisiones: 4, color: 'verde' },
        { divisiones: 6, color: 'rojo' },
        { divisiones: 8, color: 'morado' },
      ],
      soluciones_validas: [
        { fila: 0, piezas: 1 },
        { fila: 2, piezas: 2 },
        { fila: 3, piezas: 3 },
        { fila: 4, piezas: 4 },
      ],
      pregunta:
        'La primera tira muestra 1/2. Selecciona en las otras tiras las piezas que representan la misma cantidad que 1/2.',
      pista: 'Fijate en las tiras de 1/4, 1/6 y 1/8. Cuantas piezas de cada una necesitas para llegar a la mitad?',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: '1/2', valor: 1, color: 'amarillo', subdivisiones: 2 },
        { label: '2/4', valor: 1, color: 'verde', subdivisiones: 4 },
        { label: '3/6', valor: 1, color: 'rojo', subdivisiones: 6 },
      ],
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa las tres barras. Todas tienen la misma longitud total. Que significa eso sobre las fracciones 1/2, 2/4 y 3/6?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Son fracciones diferentes',
          'B) Son fracciones equivalentes',
          'C) 2/4 es mayor que 1/2',
          'D) 3/6 es menor que 1/2',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'En las tiras, viste que 1/2 = 2/4 = 3/6. Siguiendo ese patron, cuantos octavos (1/8) equivalen a 1/2?',
        tipo: 'calculo',
        respuesta:
          'El patron es: el numerador siempre es la mitad del denominador. Para 1/8: la mitad de 8 es 4, entonces 4/8 = 1/2.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En las tiras de fracciones, viste que 1/2 = 2/4 = 3/6. Cual de estas fracciones tambien es equivalente a 1/2?',
        opciones: ['A) 3/8', 'B) 5/10', 'C) 4/6', 'D) 2/3'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Encuentra 3 fracciones equivalentes a 2/5. Muestra como las obtuviste.',
        respuesta:
          'Multiplico numerador y denominador por el mismo numero:\n2/5 x 2/2 = 4/10\n2/5 x 3/3 = 6/15\n2/5 x 4/4 = 8/20\nLas 3 fracciones equivalentes son: 4/10, 6/15 y 8/20.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras como puedes saber si dos fracciones son equivalentes. Usa lo que aprendiste con las tiras de fracciones.',
        respuesta:
          'Dos fracciones son equivalentes cuando representan la misma cantidad. En las tiras, 1/2, 2/4 y 3/6 tenian la misma longitud. Para verificarlo, multiplico o divido el numerador y el denominador por el mismo numero.',
        criterios_aceptacion: [
          'misma cantidad',
          'multiplicar o dividir numerador y denominador por el mismo numero',
          'ejemplo correcto de fracciones equivalentes',
          'referencia a las tiras o al modelo visual',
        ],
      },
    ],
  },
}
