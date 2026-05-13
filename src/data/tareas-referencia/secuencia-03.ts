import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 3: Comparacion de negativos y positivos
 * Concepto clave: Comparar y ordenar numeros con signo en la recta numerica
 *
 * Concreto: Recta numerica de -5 a 5, ubicar -3
 * Pictorico: Modelo en barras (distancia al cero desde lado negativo)
 * Abstracto: 3 preguntas con progresion de dificultad sobre comparacion y orden
 */
export const tareaSecuencia03: TareaCPA = {
  secuencia_ref: 3,
  concreto: {
    manipulable: {
      tipo_concreto: 'recta_numerica',
      min: -5,
      max: 5,
      divisiones: 10,
      objetivo: -3,
      tolerancia: 0,
      etiquetas: [
        { posicion: -5, texto: '-5' },
        { posicion: 0, texto: '0' },
        { posicion: 5, texto: '5' },
      ],
      pregunta: 'Ubica el numero -3 en la recta numerica.',
      pista:
        'Los numeros negativos estan a la izquierda del cero. Cuenta 3 marcas hacia la izquierda desde el 0.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        {
          label: 'Distancia de -3 al 0',
          valor: 3,
          color: 'rojo',
          subdivisiones: 3,
        },
        {
          label: 'Distancia del 0 al 4',
          valor: 4,
          color: 'verde',
          subdivisiones: 4,
        },
      ],
      total: { valor: 7, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun el modelo, cual numero esta mas lejos del cero: -3 o 4?',
        tipo: 'opcion_multiple',
        opciones: ['A) -3', 'B) 4', 'C) Estan a la misma distancia', 'D) No se puede saber'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Si comparas -3 y 4 en la recta numerica, cual es mayor y por que? Explica usando la posicion en la recta.',
        tipo: 'calculo',
        respuesta:
          '4 es mayor que -3 porque en la recta numerica, 4 esta a la derecha de -3. Los numeros que estan mas a la derecha en la recta siempre son mayores. Ademas, 4 es positivo y -3 es negativo, y todo numero positivo es mayor que cualquier negativo.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Cual de los siguientes enunciados es verdadero?',
        opciones: [
          'A) -2 > 1',
          'B) -5 > -3',
          'C) 0 > -4',
          'D) -1 > 0',
        ],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Ordena los siguientes numeros de menor a mayor: 3, -1, 0, -4, 2. Muestra tu procedimiento.',
        respuesta:
          'En la recta numerica, los numeros mas a la izquierda son menores. Ordenando: -4 esta mas a la izquierda, luego -1, luego 0, luego 2, luego 3. El orden de menor a mayor es: -4, -1, 0, 2, 3.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras como decides cual de dos numeros con signo es mayor usando la recta numerica. Da un ejemplo con un numero positivo y uno negativo.',
        respuesta:
          'En la recta numerica, el numero que esta mas a la derecha es el mayor. Por ejemplo, 3 esta a la derecha de -2, entonces 3 > -2. Todo positivo es mayor que cualquier negativo.',
        criterios_aceptacion: [
          'mas a la derecha = mayor',
          'negativos a la izquierda del cero',
          'positivos a la derecha del cero',
          'ejemplo correcto con un positivo y un negativo',
        ],
      },
    ],
  },
}
