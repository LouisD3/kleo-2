import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 22b: Cuerdas y secantes
 * Concepto clave: Cuerda (segmento entre 2 puntos del circulo) vs
 *   secante (recta que corta el circulo en 2 puntos)
 *
 * Concreto: CompasCirculo (trazar circulo de radio 4, marcar una cuerda)
 * Pictorico: Diagrama geometrico — circulo + cuerda + secante con labels
 * Abstracto: 3 preguntas progresivas sobre cuerdas y secantes
 */
export const tareaSecuencia22b: TareaCPA = {
  secuencia_ref: 22,
  contexto: {
    personaje: 'Camila',
    objetos: { a: { nombre: 'cuerda', emoji: '🪢' }, b: { nombre: 'secante', emoji: '📏' } },
    valores_clave: { radio: 4 },
    tipo: 'geometria',
    narrativa:
      'Camila traza un circulo y dibuja lineas que lo cruzan. Descubre que un segmento dentro del circulo es una cuerda, y una recta que lo atraviesa es una secante.',
    pregunta_central: '¿Cual es la diferencia entre una cuerda y una secante?',
    transiciones: {
      concreto: 'Traza un circulo de radio 4 y marca una cuerda.',
      bridge_pictorico:
        'La cuerda es un segmento dentro del circulo. La secante es una recta que lo atraviesa.',
      pictorico: 'Observa la cuerda y la secante en el diagrama.',
      bridge_abstracto:
        'La cuerda mas larga posible es el diametro. La secante siempre se extiende fuera del circulo.',
      abstracto: 'Ahora identifica cuerdas y secantes en diferentes situaciones.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'compas_circulo',
      centro: [5, 5],
      radio_objetivo: 4,
      elementos_a_trazar: ['cuerda'],
      pregunta:
        'Traza un circulo de radio 4 y dibuja una cuerda: un segmento que una dos puntos del circulo sin pasar por el centro.',
      pista:
        'La cuerda es un segmento recto que conecta dos puntos sobre el circulo. Si pasa por el centro, es un diametro (una cuerda especial).',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 10,
      alto: 10,
      puntos: [
        { id: 'o', x: 5, y: 5, label: 'O' },
        // Cuerda: P at 200°, Q at 340° on circle r=4
        // P: (5+4cos200°, 5+4sin200°) = (1.24, 3.63)
        // Q: (5+4cos340°, 5+4sin340°) = (8.76, 3.63)
        { id: 'p', x: 1.24, y: 3.63, label: 'P' },
        { id: 'q', x: 8.76, y: 3.63, label: 'Q' },
        // Secante horizontal y=3: intersections at x=5±2sqrt(3)
        { id: 'r', x: 1.54, y: 3, label: 'R' },
        { id: 's', x: 8.46, y: 3, label: 'S' },
        { id: 'ext1', x: 0, y: 3 },
        { id: 'ext2', x: 10, y: 3 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'p', hasta: 'q', color: 'azul', label: 'Cuerda PQ' },
        {
          tipo: 'recta',
          desde: 'ext1',
          hasta: 'ext2',
          color: 'rojo',
          label: 'Secante',
          estilo: 'punteado',
        },
        {
          tipo: 'segmento',
          desde: 'o',
          hasta: 'p',
          color: 'gris',
          estilo: 'punteado',
          medida: 'r = 4',
        },
      ],
      circulos: [
        { centro_id: 'o', radio: 4, color: 'gris', estilo: 'borde', label: 'Circulo de radio 4' },
      ],
      titulo: 'Circulo con cuerda (azul) y secante (roja)',
    },
    preguntas: [
      {
        pregunta:
          'El diagrama muestra una cuerda PQ (azul) y una secante (roja). ¿Cual es la diferencia entre las dos?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) La cuerda pasa por el centro y la secante no',
          'B) La cuerda es un segmento dentro del circulo, la secante es una recta que se extiende fuera',
          'C) La secante solo toca el circulo en un punto',
          'D) No hay diferencia',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Explica con tus palabras que es una cuerda, que es una secante y que es una tangente. ¿En que se diferencian?',
        tipo: 'abierta',
        respuesta:
          'La cuerda es un segmento que une dos puntos del circulo. La secante es una recta que cruza el circulo en dos puntos y se extiende fuera. La tangente solo toca el circulo en un punto.',
        criterios_aceptacion: [
          'cuerda: segmento entre 2 puntos del circulo',
          'secante: recta que cruza en 2 puntos',
          'tangente: toca en 1 punto',
          'diferencia segmento vs recta',
        ],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Cual es la cuerda mas larga que se puede trazar en un circulo?',
        opciones: ['A) El radio', 'B) La tangente', 'C) El diametro', 'D) La secante'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un circulo tiene radio de 5 cm. Se traza una cuerda a 3 cm del centro. Usando el teorema de Pitagoras, ¿cuanto mide la mitad de la cuerda? ¿Y la cuerda completa?',
        respuesta:
          'Paso 1: La distancia del centro a la cuerda (3 cm), la mitad de la cuerda y el radio (5 cm) forman un triangulo rectangulo.\nPaso 2: mitad² + 3² = 5² => mitad² = 25 - 9 = 16 => mitad = 4 cm.\nPaso 3: La cuerda completa = 2 x 4 = 8 cm.\nRespuesta: La cuerda mide 8 cm.',
      },
      {
        tipo: 'abierta',
        pregunta:
          '¿Por que el diametro es la cuerda mas larga de un circulo? Explica usando la distancia del centro a la cuerda.',
        respuesta:
          'Mientras mas cerca del centro pasa la cuerda, mas larga es. El diametro pasa por el centro (distancia = 0), por eso es la cuerda mas larga posible y mide 2 veces el radio.',
        criterios_aceptacion: [
          'pasa por el centro',
          'distancia al centro es 0',
          'cuerda mas larga',
          'mide 2 veces el radio',
        ],
      },
    ],
  },
}
