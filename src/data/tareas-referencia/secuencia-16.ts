import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 16: Rectas
 * Concepto clave: Trazar rectas paralelas y perpendiculares
 *
 * Concreto: Geoplano (trazar una recta horizontal)
 * Pictorico: Modelo en barras comparando rectas paralelas y perpendiculares
 * Abstracto: 3 preguntas con progresión de dificultad sobre rectas
 */
export const tareaSecuencia16: TareaCPA = {
  secuencia_ref: 16,
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 0],
        [0, 4],
      ],
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar una recta horizontal.',
      pista: 'Conecta dos puntos que estén en la misma fila para formar una recta horizontal.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Recta A', valor: 4, color: 'azul' },
        { label: 'Recta B', valor: 4, color: 'verde' },
      ],
      total: { valor: 4, visible: false },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'En el modelo se muestran dos rectas de la misma longitud. Si la Recta A es horizontal y la Recta B también es horizontal pero está más abajo, ¿qué tipo de rectas son?',
        tipo: 'opcion_multiple',
        opciones: ['A) Perpendiculares', 'B) Secantes', 'C) Paralelas', 'D) Coincidentes'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Explica la diferencia entre rectas paralelas y rectas perpendiculares. Menciona un ejemplo de cada una que veas en tu salón de clases.',
        tipo: 'calculo',
        respuesta:
          'Las rectas paralelas son rectas que van en la misma dirección y nunca se cruzan, como los bordes superior e inferior del pizarrón. Las rectas perpendiculares se cruzan formando un ángulo de 90°, como el borde horizontal y el borde vertical de una puerta.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Dos rectas que se cruzan formando un ángulo de 90° se llaman:',
        opciones: ['A) Paralelas', 'B) Oblicuas', 'C) Perpendiculares', 'D) Secantes'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En un plano cartesiano, la recta A pasa por los puntos (0, 2) y (4, 2), y la recta B pasa por los puntos (0, 5) y (4, 5). ¿Son paralelas, perpendiculares o secantes? Justifica tu respuesta.',
        respuesta:
          'Paso 1: La recta A es horizontal con y = 2.\nPaso 2: La recta B es horizontal con y = 5.\nPaso 3: Ambas rectas son horizontales y nunca se cruzan.\nRespuesta: Son rectas paralelas porque tienen la misma dirección y no se intersecan.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Imagina que caminas por tu colonia. Describe una situación donde veas rectas paralelas y otra donde veas rectas perpendiculares. Explica por qué las clasificas así.',
        respuesta:
          'Las vías del tren son un ejemplo de rectas paralelas: los dos rieles van siempre a la misma distancia y nunca se juntan. Un cruce de calles donde una calle va de norte a sur y otra de este a oeste es un ejemplo de rectas perpendiculares: se cruzan formando un ángulo recto de 90°. Se clasifican así porque las paralelas mantienen siempre la misma distancia entre ellas, mientras que las perpendiculares forman ángulos rectos al intersecarse.',
      },
    ],
  },
}
