import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 2: Los enteros negativos
 * Concepto clave: Representar numeros positivos y negativos
 *
 * Concreto: Fichas positivas/negativas (5 positivas, 3 negativas → resultado 2)
 * Pictorico: Modelo en barras (positivas vs negativas, cancelacion)
 * Abstracto: 3 preguntas con progresion de dificultad sobre representacion de enteros
 */
export const tareaSecuencia02: TareaCPA = {
  secuencia_ref: 2,
  concreto: {
    manipulable: {
      tipo_concreto: 'fichas_positivas_negativas',
      positivas: 5,
      negativas: 3,
      resultado_objetivo: 2,
      pregunta:
        'Tienes 5 fichas positivas y 3 negativas. Cancela los pares para encontrar el resultado.',
      pista:
        'Cada ficha positiva cancela una ficha negativa. Forma pares de una positiva con una negativa y cuenta las fichas que sobran.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        {
          label: 'Positivas',
          valor: 5,
          color: 'verde',
          subdivisiones: 5,
        },
        {
          label: 'Negativas',
          valor: 3,
          color: 'rojo',
          subdivisiones: 3,
        },
      ],
      total: { valor: 2, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun el modelo, cuantas fichas positivas quedan sin cancelar?',
        tipo: 'opcion_multiple',
        opciones: ['A) 3', 'B) 5', 'C) 2', 'D) 8'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si agregas 2 fichas negativas mas (5 negativas en total), cual seria el nuevo resultado? Explica tu procedimiento.',
        tipo: 'calculo',
        respuesta:
          'Ahora hay 5 positivas y 5 negativas. Cada positiva cancela una negativa: 5 - 5 = 0. El resultado es 0.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Si tienes 7 fichas positivas y 4 negativas, cual es el resultado despues de cancelar?',
        opciones: ['A) 11', 'B) -3', 'C) 3', 'D) -11'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un termometro marca 6 °C por la manana. Durante la noche la temperatura baja 9 grados. Que temperatura marca ahora? Muestra tu procedimiento.',
        respuesta:
          'La temperatura inicial es +6 °C. Baja 9 grados: 6 - 9 = -3. La temperatura marca -3 °C.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que al cancelar fichas positivas con negativas obtenemos el resultado de una suma de numeros con signo. Usa el ejemplo de las 5 fichas positivas y 3 negativas.',
        respuesta:
          'Cada par de una ficha positiva y una negativa se cancela porque +1 y -1 suman 0. Con 5 positivas y 3 negativas, se cancelan 3 pares y quedan 2 positivas: (+5) + (-3) = +2.',
        criterios_aceptacion: [
          '+1 y -1 suman cero',
          'cancelar pares',
          'fichas sobrantes = resultado',
          'ejemplo con numeros correctos',
        ],
      },
    ],
  },
}
