import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 24: Partes del circulo
 * Concepto clave: Identificar sector circular y arco
 *
 * Concreto: CompasCirculo (trazar circulo de radio 4, con sector visible)
 * Pictorico: Modelo en barras (sector como fraccion del circulo)
 * Abstracto: 3 preguntas sobre sectores y arcos
 */
export const tareaSecuencia24: TareaCPA = {
  secuencia_ref: 24,
  concreto: {
    manipulable: {
      tipo_concreto: 'compas_circulo',
      centro: [4, 4],
      radio_objetivo: 4,
      elementos_a_trazar: ['radio', 'sector'],
      pregunta:
        'Traza un circulo de radio 4 unidades. Observa el sector coloreado: es la region entre dos radios.',
      pista: 'Ajusta el compas a 4 cuadros. El sector es como una rebanada de pizza entre dos radios.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Sector (1/4 del circulo)', valor: 1, color: 'azul', subdivisiones: 1 },
        { label: 'Resto del circulo', valor: 3, color: 'amarillo', subdivisiones: 3 },
      ],
      total: { valor: 4, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El sector coloreado es 1/4 del circulo. Que fraccion del circulo NO esta coloreada?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1/4', 'B) 1/2', 'C) 3/4', 'D) 2/4'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si el circulo completo tiene un angulo de 360 grados, cuantos grados tiene el sector de 1/4?',
        tipo: 'calculo',
        respuesta: 'El sector es 1/4 del circulo. 360 / 4 = 90 grados. El sector mide 90 grados.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En tu circulo, el sector de 1/4 mide 90 grados. Un sector de medio circulo mediria...',
        opciones: ['A) 90 grados', 'B) 180 grados', 'C) 270 grados', 'D) 360 grados'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Una pizza se corta en 8 rebanadas iguales. Cuantos grados mide el angulo de cada rebanada? Si te comes 3 rebanadas, cuantos grados de pizza te comiste?',
        respuesta:
          'Paso 1: Cada rebanada = 360 / 8 = 45 grados.\nPaso 2: 3 rebanadas = 3 x 45 = 135 grados.\nRespuesta: Cada rebanada mide 45 grados y 3 rebanadas suman 135 grados.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras la diferencia entre un sector y un arco de un circulo. Usa el ejemplo de la pizza.',
        respuesta:
          'Un sector es la region entera de la rebanada de pizza: incluye las dos orillas rectas (radios) y la parte curva (arco). Un arco es solo la parte curva del borde, como la costra de la pizza. El sector es un area (superficie) mientras que el arco es una longitud (linea curva).',
      },
    ],
  },
}
