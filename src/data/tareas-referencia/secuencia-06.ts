import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 6: Suma y resta de enteros
 * Concepto clave: Operar con numeros positivos y negativos usando fichas
 *
 * Concreto: FichasPositivasNegativas (5 positivas + 8 negativas, cancelar pares, resultado -3)
 * Pictorico: Modelo en barras (positivas vs negativas)
 * Abstracto: 3 preguntas progresivas sobre operaciones con signo
 */
export const tareaSecuencia06: TareaCPA = {
  secuencia_ref: 6,
  concepto_clave: 'Operar con numeros positivos y negativos usando fichas',
  contexto: {
    personaje: 'Carlos',
    objetos: { a: { nombre: 'ficha positiva', emoji: '🟢' }, b: { nombre: 'ficha negativa', emoji: '🔴' } },
    valores_clave: { positivas: 5, negativas: 8, resultado: -3 },
    tipo: 'numero',
    narrativa: 'Carlos practica operaciones con enteros. Tiene 5 fichas positivas y 8 negativas y quiere saber el resultado.',
    pregunta_central: '¿Que numero resulta al combinar (+5) y (-8)?',
    transiciones: {
      concreto: 'Cancela pares de fichas positivas y negativas para encontrar el resultado.',
      bridge_pictorico: 'Al cancelar 4 pares, quedan 3 fichas negativas. Resultado: -3.',
      pictorico: 'Observa la operacion en el modelo.',
      bridge_abstracto: 'Cuando hay mas negativas que positivas, el resultado es negativo.',
      abstracto: 'Ahora opera con enteros en diferentes situaciones.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'fichas_positivas_negativas',
      positivas: 5,
      negativas: 8,
      resultado_objetivo: -3,
      pregunta:
        'Tienes 5 fichas positivas (+1) y 8 fichas negativas (-1). Cancela los pares (+1 con -1) para encontrar el resultado de (+5) + (-8).',
      pista: 'Cada ficha positiva cancela una negativa. Tienes 5 positivas para cancelar 5 de las 8 negativas. Quedan 3 negativas: el resultado es -3.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Fichas positivas', valor: 5, color: 'verde', subdivisiones: 5 },
        { label: 'Fichas negativas', valor: 8, color: 'rojo', subdivisiones: 8 },
      ],
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Cancelaste 5 pares de fichas. Cuantas fichas negativas quedaron sin cancelar?',
        tipo: 'opcion_multiple',
        opciones: ['A) 5', 'B) 8', 'C) 3', 'D) 0'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si tuvieras 7 fichas positivas y 4 negativas, cuantos pares cancelarias y cual seria el resultado? Explica.',
        tipo: 'calculo',
        respuesta:
          'Cancelaria 4 pares (una positiva con una negativa cada vez). Quedarian 7 - 4 = 3 fichas positivas sin cancelar. El resultado es +3.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Si tienes 6 fichas positivas y 6 negativas y cancelas todos los pares, cual es el resultado?',
        opciones: ['A) 12', 'B) -12', 'C) 6', 'D) 0'],
        respuesta: 'D',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un termometro marca 3 grados. La temperatura baja 7 grados. Usa la idea de fichas positivas y negativas para encontrar la temperatura final. Muestra el procedimiento.',
        respuesta:
          'Paso 1: Tengo 3 fichas positivas (3 grados).\nPaso 2: Agrego 7 fichas negativas (baja 7 grados).\nPaso 3: Cancelo 3 pares. Quedan 4 fichas negativas.\nResultado: La temperatura final es -4 grados.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que cancelar una ficha positiva con una negativa da cero. Usa un ejemplo de la vida real.',
        respuesta:
          '+1 y -1 son opuestos y juntos suman cero. Es como ganar $5 y gastar $5: el balance queda en $0. Por eso cada par positivo-negativo se cancela.',
        criterios_aceptacion: [
          'opuestos que suman cero',
          'ejemplo de la vida real',
          'balance o resultado final cero',
          '+1 + (-1) = 0',
        ],
      },
    ],
  },
}
