import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 16b: Perpendicularidad
 * Concepto clave: Dos rectas son perpendiculares si forman un angulo de 90°
 *
 * Concreto: Geoplano (trazar 2 segmentos perpendiculares)
 * Pictorico: Diagrama geometrico con rectas perpendiculares (90° verificado)
 * Abstracto: 3 preguntas progresivas sobre perpendicularidad
 *
 * NOTA GEOMETRIA: Angulo 90° verificado con producto escalar:
 *   vec O->B = (2,0), vec O->C = (0,-2), dot = 0 => 90° exacto.
 */
export const tareaSecuencia16b: TareaCPA = {
  secuencia_ref: 16,
  concepto_clave: 'Dos rectas son perpendiculares si forman un angulo de 90°',
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'recta', emoji: '📐' }, b: { nombre: 'angulo recto', emoji: '📏' } },
    valores_clave: { angulo: 90 },
    tipo: 'geometria',
    narrativa:
      'Roberto observa las esquinas de su escritorio y nota que las orillas forman angulos de exactamente 90°. Esas rectas son perpendiculares.',
    pregunta_central: '¿Como saber si dos rectas son perpendiculares?',
    transiciones: {
      concreto: 'Traza dos segmentos que se crucen a 90° en el geoplano.',
      bridge_pictorico: 'Las rectas perpendiculares forman un angulo recto de 90°.',
      pictorico: 'Observa las rectas perpendiculares en el diagrama.',
      bridge_abstracto:
        'Dos rectas son perpendiculares cuando el angulo entre ellas es exactamente 90°.',
      abstracto: 'Ahora identifica rectas perpendiculares en diferentes situaciones.',
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
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar dos segmentos perpendiculares (que se crucen a 90°).',
      pista:
        'Conecta un segmento horizontal y uno vertical que se encuentren en un mismo punto. Las esquinas de un cuadrado son angulos de 90°.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 6,
      alto: 6,
      puntos: [
        { id: 'a', x: 1, y: 3, label: 'A' },
        { id: 'b', x: 5, y: 3, label: 'B' },
        { id: 'c', x: 3, y: 1, label: 'C' },
        { id: 'd', x: 3, y: 5, label: 'D' },
        { id: 'o', x: 3, y: 3, label: 'O' },
      ],
      segmentos: [
        { tipo: 'recta', desde: 'a', hasta: 'b', color: 'azul', label: 'Recta AB (horizontal)' },
        { tipo: 'recta', desde: 'c', hasta: 'd', color: 'rojo', label: 'Recta CD (vertical)' },
      ],
      angulos: [{ vertice: 'o', lado_a: 'b', lado_b: 'c', medida: '90°', color: 'rojo' }],
      titulo: 'Rectas perpendiculares AB y CD (angulo de 90°)',
    },
    preguntas: [
      {
        pregunta:
          'El diagrama muestra dos rectas que se cruzan en el punto O. El angulo entre ellas es de 90°. ¿Como se llaman estas rectas?',
        tipo: 'opcion_multiple',
        opciones: ['A) Paralelas', 'B) Oblicuas', 'C) Perpendiculares', 'D) Coincidentes'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Describe como puedes verificar que dos rectas son perpendiculares usando un instrumento de medicion.',
        tipo: 'abierta',
        respuesta:
          'Se mide el angulo que forman con un transportador. Si el angulo es exactamente 90°, las rectas son perpendiculares. Tambien se puede usar una escuadra.',
        criterios_aceptacion: [
          'medir el angulo',
          '90 grados',
          'transportador o escuadra',
          'angulo recto',
        ],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Cuando dos rectas se cruzan formando un angulo de 90°, ¿cuantos angulos rectos se forman en total?',
        opciones: ['A) 1', 'B) 2', 'C) 3', 'D) 4'],
        respuesta: 'D',
      },
      {
        tipo: 'calculo',
        pregunta:
          'La recta A pasa por (0, 3) y (4, 3) (horizontal). La recta B pasa por (2, 0) y (2, 6) (vertical). ¿Son perpendiculares? Justifica.',
        respuesta:
          'Paso 1: La recta A es horizontal (y siempre vale 3).\nPaso 2: La recta B es vertical (x siempre vale 2).\nPaso 3: Una recta horizontal y una vertical siempre forman un angulo de 90°.\nRespuesta: Si, son perpendiculares.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Menciona 3 ejemplos de rectas perpendiculares que puedas ver en tu entorno cotidiano. Explica por que son perpendiculares.',
        respuesta:
          'Las esquinas de una hoja de papel, el cruce de calles en angulo recto y el marco de una puerta. Todos forman angulos de 90° donde se encuentran.',
        criterios_aceptacion: [
          'al menos 3 ejemplos',
          'angulo de 90° mencionado',
          'ejemplos del entorno cotidiano',
        ],
      },
    ],
  },
}
