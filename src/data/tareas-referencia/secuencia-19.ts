import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 19: Bisectriz y ángulos congruentes
 * Concepto clave: Trazar la bisectriz de un ángulo y reconocer ángulos congruentes
 *
 * Concreto: Geoplano (triángulo isósceles para explorar ángulos congruentes)
 * Pictorico: Modelo en barras dividiendo un ángulo en dos partes iguales
 * Abstracto: 3 preguntas con progresión de dificultad sobre bisectriz y ángulos congruentes
 */
export const tareaSecuencia19: TareaCPA = {
  secuencia_ref: 19,
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [4, 0],
        [0, 2],
        [4, 4],
      ],
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar un triángulo isósceles. Observa los ángulos de la base: ¿son iguales?',
      pista: 'Un triángulo isósceles tiene dos lados iguales y dos ángulos de la base iguales. Compara los ángulos en los vértices inferiores.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Mitad 1', valor: 40, color: 'azul' },
        { label: 'Mitad 2', valor: 40, color: 'verde' },
      ],
      total: { valor: 80, visible: true },
      incognita: { posicion: 'total', label: 'Ángulo = 80°' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo de barras muestra un ángulo de 80° dividido en dos partes iguales por su bisectriz. ¿Cuánto mide cada parte?',
        tipo: 'opcion_multiple',
        opciones: ['A) 20°', 'B) 30°', 'C) 40°', 'D) 80°'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Explica qué es una bisectriz y cómo se relaciona con los ángulos congruentes.',
        tipo: 'abierta',
        respuesta:
          'La bisectriz es un rayo que divide un ángulo en dos partes iguales. Dos ángulos congruentes tienen la misma medida.',
        criterios_aceptacion: ['bisectriz divide en dos partes iguales', 'congruente significa igual medida', 'resultado 40° mencionado'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'La bisectriz de un ángulo de 120° divide al ángulo en dos ángulos de:',
        opciones: ['A) 30° cada uno', 'B) 45° cada uno', 'C) 60° cada uno', 'D) 90° cada uno'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En un triángulo isósceles, los dos ángulos de la base son congruentes y miden 70° cada uno. ¿Cuánto mide el tercer ángulo? Muestra el procedimiento.',
        respuesta:
          'Paso 1: La suma de los ángulos interiores de un triángulo es 180°.\nPaso 2: Los ángulos de la base suman 70° + 70° = 140°.\nPaso 3: El tercer ángulo = 180° - 140° = 40°.\nRespuesta: El tercer ángulo mide 40°.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Si trazas la bisectriz de cada ángulo de un triángulo, las tres bisectrices se encuentran en un solo punto. ¿Cómo se llama ese punto y qué propiedad especial tiene?',
        respuesta:
          'Ese punto se llama incentro. Está a la misma distancia de los tres lados del triángulo y es el centro del círculo que cabe dentro del triángulo.',
        criterios_aceptacion: ['incentro', 'equidistante a los tres lados', 'tres bisectrices se cruzan', 'círculo inscrito'],
      },
    ],
  },
}
