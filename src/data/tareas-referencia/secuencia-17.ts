import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 17: Ángulos
 * Concepto clave: Identificar tipos de ángulos (recto, agudo, obtuso)
 *
 * Concreto: Geoplano (trazar un ángulo recto de 90°)
 * Pictorico: Modelo en barras comparando medidas de ángulos
 * Abstracto: 3 preguntas con progresión de dificultad sobre ángulos
 */
export const tareaSecuencia17: TareaCPA = {
  secuencia_ref: 17,
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [2, 0],
        [2, 2],
        [0, 2],
      ],
      propiedad_a_medir: 'angulo',
      valor_esperado: 90,
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar un ángulo recto. ¿Cuántos grados mide?',
      pista: 'Un ángulo recto se forma cuando dos segmentos se encuentran de forma perpendicular. Mide exactamente 90°.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Agudo', valor: 45, color: 'verde' },
        { label: 'Recto', valor: 90, color: 'azul' },
        { label: 'Obtuso', valor: 135, color: 'rojo' },
      ],
      total: { valor: 180, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo de barras que muestra tres tipos de ángulos. ¿Cuál barra representa un ángulo recto?',
        tipo: 'opcion_multiple',
        opciones: ['A) La verde (45°)', 'B) La azul (90°)', 'C) La roja (135°)', 'D) Ninguna'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando el modelo, explica la relación entre un ángulo agudo y un ángulo obtuso respecto al ángulo recto.',
        tipo: 'calculo',
        respuesta:
          'Un ángulo agudo mide menos de 90° (como el de 45° del modelo). Un ángulo obtuso mide más de 90° pero menos de 180° (como el de 135° del modelo). El ángulo recto de 90° es el punto de referencia: los agudos están por debajo y los obtusos están por arriba.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Un ángulo que mide 120° es un ángulo:',
        opciones: ['A) Agudo', 'B) Recto', 'C) Obtuso', 'D) Llano'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Dos segmentos se intersecan y forman un ángulo de 65°. ¿Cuánto mide el ángulo adyacente? Explica paso a paso.',
        respuesta:
          'Paso 1: Cuando dos segmentos se intersecan, los ángulos adyacentes son suplementarios (suman 180°).\nPaso 2: Ángulo adyacente = 180° - 65°.\nPaso 3: Ángulo adyacente = 115°.\nRespuesta: El ángulo adyacente mide 115°.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Cuando dos rectas se cruzan, se forman cuatro ángulos. Explica qué relación tienen entre sí los ángulos opuestos y los ángulos adyacentes.',
        respuesta:
          'Cuando dos rectas se cruzan, se forman dos pares de ángulos opuestos por el vértice. Los ángulos opuestos siempre son iguales entre sí. Los ángulos adyacentes (que están uno al lado del otro) son suplementarios, es decir, suman 180°. Por ejemplo, si un ángulo mide 70°, el opuesto también mide 70°, y los dos adyacentes miden 110° cada uno. Esto ocurre siempre, sin importar el ángulo con el que se crucen las rectas.',
      },
    ],
  },
}
