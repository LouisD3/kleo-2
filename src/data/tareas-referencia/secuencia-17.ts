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
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'angulo', emoji: '📐' }, b: { nombre: 'grado', emoji: '°' } },
    valores_clave: { angulos: [45, 90, 135] },
    tipo: 'geometria',
    narrativa: 'Roberto mide los angulos de diferentes objetos. Algunos son menores de 90° (agudos), otros son exactos (rectos) y otros son mayores (obtusos).',
    pregunta_central: '¿Como se clasifican los angulos segun su medida?',
    transiciones: {
      concreto: 'Traza un angulo en el geoplano y observa su abertura.',
      bridge_pictorico: 'Un angulo agudo mide menos de 90°, un recto 90° y un obtuso mas de 90°.',
      pictorico: 'Observa los tres tipos de angulo en el modelo.',
      bridge_abstracto: 'La clasificacion depende de comparar con 90°.',
      abstracto: 'Ahora clasifica y calcula angulos.',
    },
  },
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
    representacion: {
      tipo_representacion: 'modelo_barras',
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
        tipo: 'abierta',
        respuesta:
          'El ángulo agudo mide menos de 90° y el obtuso mide más de 90°. El ángulo recto de 90° es el punto de referencia entre ambos.',
        criterios_aceptacion: ['agudo menor que 90°', 'obtuso mayor que 90°', 'recto como referencia', 'valores del modelo mencionados'],
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
          'Los ángulos opuestos por el vértice son iguales. Los ángulos adyacentes (uno al lado del otro) suman 180°.',
        criterios_aceptacion: ['opuestos iguales', 'adyacentes suman 180°', 'suplementarios o ángulo recto mencionado', 'ejemplo numérico'],
      },
    ],
  },
}
