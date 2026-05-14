import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 17: Ángulos
 * Concepto clave: Identificar tipos de ángulos (recto, agudo, obtuso)
 *
 * Concreto: Transportador (medir un angulo de 90° arrastrando el brazo)
 * Pictorico: Diagrama geometrico — tres angulos con arcos coloreados
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
      concreto: 'Arrastra el brazo del transportador para medir un angulo recto.',
      bridge_pictorico: 'Un angulo agudo mide menos de 90°, un recto 90° y un obtuso mas de 90°.',
      pictorico: 'Observa los tres tipos de angulo en el modelo.',
      bridge_abstracto: 'La clasificacion depende de comparar con 90°.',
      abstracto: 'Ahora clasifica y calcula angulos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'transportador',
      angulo_objetivo: 90,
      tolerancia: 5,
      angulo_inicial: 0,
      pregunta:
        'Arrastra el brazo del transportador hasta medir un angulo recto. ¿Cuantos grados mide?',
      pista: 'Un angulo recto mide exactamente 90°. Arrastra el punto hasta que el numero muestre 90.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 10,
      alto: 5,
      puntos: [
        { id: 'v1', x: 1, y: 1 },
        { id: 'a1', x: 3, y: 1 },
        { id: 'b1', x: 2.4, y: 2.4 },
        { id: 'v2', x: 4.5, y: 1 },
        { id: 'a2', x: 6.5, y: 1 },
        { id: 'b2', x: 4.5, y: 3 },
        { id: 'v3', x: 7.5, y: 1 },
        { id: 'a3', x: 9.5, y: 1 },
        { id: 'b3', x: 6.7, y: 3.2 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'v1', hasta: 'a1', color: 'verde' },
        { tipo: 'segmento', desde: 'v1', hasta: 'b1', color: 'verde' },
        { tipo: 'segmento', desde: 'v2', hasta: 'a2', color: 'azul' },
        { tipo: 'segmento', desde: 'v2', hasta: 'b2', color: 'azul' },
        { tipo: 'segmento', desde: 'v3', hasta: 'a3', color: 'rojo' },
        { tipo: 'segmento', desde: 'v3', hasta: 'b3', color: 'rojo' },
      ],
      angulos: [
        { vertice: 'v1', lado_a: 'a1', lado_b: 'b1', medida: '45°', color: 'verde' },
        { vertice: 'v2', lado_a: 'a2', lado_b: 'b2', medida: '90°', color: 'azul' },
        { vertice: 'v3', lado_a: 'a3', lado_b: 'b3', medida: '135°', color: 'rojo' },
      ],
      titulo: 'Tres tipos de angulos: agudo (45°), recto (90°), obtuso (135°)',
    },
    preguntas: [
      {
        pregunta:
          'Observa el diagrama que muestra tres tipos de angulos. ¿Cual representa un angulo recto?',
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
