import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 18: Punto medio y mediatriz
 * Concepto clave: Encontrar el punto medio de un segmento y trazar la mediatriz
 *
 * Concreto: Geoplano (rectángulo para identificar puntos medios de sus lados)
 * Pictorico: Modelo en barras dividiendo un segmento en dos partes iguales
 * Abstracto: 3 preguntas con progresión de dificultad sobre punto medio y mediatriz
 */
export const tareaSecuencia18: TareaCPA = {
  secuencia_ref: 18,
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [1, 0],
        [1, 4],
        [3, 4],
        [3, 0],
      ],
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar un rectángulo. Luego identifica el punto medio de cada lado.',
      pista: 'El punto medio de un segmento está exactamente a la mitad. Cuenta las unidades de cada lado y divide entre 2.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Mitad izquierda', valor: 2, color: 'azul' },
        { label: 'Mitad derecha', valor: 2, color: 'verde' },
      ],
      total: { valor: 4, visible: true },
      incognita: { posicion: 'total', label: 'Punto medio en 2' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo de barras muestra un segmento de 4 unidades dividido en dos partes iguales. ¿En qué posición se encuentra el punto medio?',
        tipo: 'opcion_multiple',
        opciones: ['A) En la unidad 1', 'B) En la unidad 2', 'C) En la unidad 3', 'D) En la unidad 4'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando el modelo, explica cómo encontrar el punto medio de un segmento y qué es la mediatriz.',
        tipo: 'calculo',
        respuesta:
          'El punto medio de un segmento se encuentra dividiendo su longitud entre 2. En este caso, 4 ÷ 2 = 2, así que el punto medio está en la posición 2. La mediatriz es una recta perpendicular al segmento que pasa por su punto medio. Divide al segmento en dos partes iguales y todo punto sobre la mediatriz está a la misma distancia de ambos extremos del segmento.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Un segmento va del punto A(1, 3) al punto B(5, 3). ¿Cuáles son las coordenadas de su punto medio?',
        opciones: ['A) (2, 3)', 'B) (3, 3)', 'C) (4, 3)', 'D) (3, 6)'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un segmento tiene un extremo en el punto (2, 1) y su punto medio está en (5, 4). ¿Cuáles son las coordenadas del otro extremo? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Si M es el punto medio, entonces M = ((x₁ + x₂)/2, (y₁ + y₂)/2).\nPaso 2: Para x: 5 = (2 + x₂)/2, entonces 10 = 2 + x₂, así x₂ = 8.\nPaso 3: Para y: 4 = (1 + y₂)/2, entonces 8 = 1 + y₂, así y₂ = 7.\nRespuesta: El otro extremo está en (8, 7).',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por qué cualquier punto que está sobre la mediatriz de un segmento se encuentra a la misma distancia de ambos extremos.',
        respuesta:
          'La mediatriz pasa por el punto medio del segmento y es perpendicular a él. Cualquier punto sobre la mediatriz forma dos triángulos iguales con los extremos del segmento, por lo que está a la misma distancia de ambos extremos.',
        criterios_aceptacion: [
          'punto medio',
          'perpendicular',
          'misma distancia',
          'triángulos iguales o congruentes',
        ],
      },
    ],
  },
}
