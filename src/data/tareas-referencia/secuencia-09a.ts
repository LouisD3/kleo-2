import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 9A: Identificar el patron
 * Concepto clave: Identificar el patron en una sucesion aritmetica
 *
 * Concreto: PatronFiguras (terminos 1,3,5 con cuadrados, construir termino 4 = 7)
 * Pictorico: Modelo en barras (barras crecientes 1,3,5,7)
 * Abstracto: 3 preguntas progresivas sobre identificar patrones
 */
export const tareaSecuencia09a: TareaCPA = {
  secuencia_ref: 9,
  concreto: {
    manipulable: {
      tipo_concreto: 'patron_figuras',
      tipo_pieza: 'cuadrado',
      terminos: [1, 3, 5],
      termino_objetivo: 7,
      pregunta:
        'Observa el patron: el termino 1 tiene 1 cuadrado, el termino 2 tiene 3, el termino 3 tiene 5. Construye el termino 4 colocando la cantidad correcta de cuadrados.',
      pista: 'Fijate cuanto aumenta de un termino al siguiente: de 1 a 3 son +2, de 3 a 5 son +2. Entonces el termino 4 es 5 + 2.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Termino 1', valor: 1, color: 'amarillo' },
        { label: 'Termino 2', valor: 3, color: 'azul' },
        { label: 'Termino 3', valor: 5, color: 'verde' },
        { label: 'Termino 4', valor: 7, color: 'morado' },
      ],
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa como crecen las barras. Cuanto aumenta la cantidad de cuadrados de un termino al siguiente?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1', 'B) 2', 'C) 3', 'D) Cambia cada vez'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Construiste el termino 4 con 7 cuadrados. Si el patron sigue igual, cuantos cuadrados tendra el termino 5? Explica.',
        tipo: 'calculo',
        respuesta:
          'El patron aumenta de 2 en 2. El termino 4 tiene 7 cuadrados, entonces el termino 5 tendra 7 + 2 = 9 cuadrados.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En el patron de cuadrados 1, 3, 5, 7, ..., cual es la diferencia constante entre cada termino?',
        opciones: ['A) 1', 'B) 2', 'C) 3', 'D) No hay diferencia constante'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Pedro arma figuras con palitos. La figura 1 usa 4 palitos, la figura 2 usa 7, la figura 3 usa 10. Cuantos palitos usara la figura 5? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Diferencia constante = 7 - 4 = 3 palitos.\nPaso 2: Figura 4 = 10 + 3 = 13 palitos.\nPaso 3: Figura 5 = 13 + 3 = 16 palitos.\nRespuesta: La figura 5 usara 16 palitos.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que es la diferencia constante en una sucesion. Por que te ayuda a predecir los siguientes terminos?',
        respuesta:
          'La diferencia constante es el numero que se suma siempre entre un termino y el siguiente. En esta sucesion era 2. Con ese dato puedes calcular cualquier termino siguiente sin construir todos los anteriores.',
        criterios_aceptacion: [
          'numero que se suma igual cada vez',
          'diferencia fija o constante',
          'permite predecir terminos futuros',
          'ejemplo con la sucesion vista',
        ],
      },
    ],
  },
}
