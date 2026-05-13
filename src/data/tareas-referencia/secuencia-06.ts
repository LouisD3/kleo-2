import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 6: Multiplicacion y division
 * Concepto clave: Operar con numeros positivos y negativos usando fichas
 *
 * Concreto: FichasPositivasNegativas (5 positivas + 8 negativas, cancelar pares, resultado -3)
 * Pictorico: Modelo en barras (positivas vs negativas)
 * Abstracto: 3 preguntas progresivas sobre operaciones con signo
 */
export const tareaSecuencia06: TareaCPA = {
  secuencia_ref: 6,
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
    modelo_barras: {
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
          'Una ficha positiva y una negativa se cancelan porque representan cantidades opuestas: +1 y -1 suman 0. Es como si debes $1 a un amigo y el te debe $1 a ti: las deudas se cancelan y nadie debe nada. En la vida real, si ganas $5 y gastas $5, tu balance es $0. Cada gasto cancela una ganancia.',
      },
    ],
  },
}
