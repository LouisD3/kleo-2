import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 26: Distancia de un punto a una recta
 * Concepto clave: La distancia de un punto a una recta es la perpendicular mas corta
 *
 * Concreto: Geoplano 5x5 — recta horizontal + punto arriba, distancia perpendicular = 2
 * Pictorico: Modelo en barras — distancia perpendicular vs distancia oblicua
 * Abstracto: 3 preguntas con progresion de dificultad sobre distancia punto-recta
 */
export const tareaSecuencia26: TareaCPA = {
  secuencia_ref: 26,
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'punto', emoji: '📍' }, b: { nombre: 'recta', emoji: '📏' } },
    valores_clave: { distancia_perpendicular: 2, distancia_oblicua: 3 },
    tipo: 'geometria',
    narrativa: 'Roberto busca el camino mas corto desde un punto hasta una recta. Descubre que siempre es la perpendicular.',
    pregunta_central: '¿Cual es la distancia mas corta de un punto a una recta?',
    transiciones: {
      concreto: 'Traza el punto y la recta en el geoplano. Observa las distancias.',
      bridge_pictorico: 'La perpendicular (2 u) es mas corta que cualquier oblicua (3 u).',
      pictorico: 'Compara las distancias en el modelo.',
      bridge_abstracto: 'La distancia punto-recta es siempre la perpendicular.',
      abstracto: 'Ahora calcula distancias punto-recta.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 1],
        [4, 1],
        [2, 3],
      ],
      propiedad_a_medir: 'perimetro',
      valor_esperado: 2,
      pregunta:
        'Traza la recta horizontal que pasa por (0,1) y (4,1). Luego marca el punto (2,3). La distancia del punto a la recta es la perpendicular mas corta.',
      pista:
        'La distancia de un punto a una recta se mide con un segmento perpendicular. Desde (2,3) baja en linea recta hasta la recta: llegas a (2,1). Cuantas unidades hay de diferencia?',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 6,
      alto: 5,
      puntos: [
        { id: 'l1', x: 0, y: 1 },
        { id: 'l2', x: 6, y: 1 },
        { id: 'p', x: 2, y: 3, label: 'P' },
        { id: 'h', x: 2, y: 1, label: 'H' },
        { id: 'q', x: 4, y: 1, label: 'Q' },
      ],
      segmentos: [
        { tipo: 'recta', desde: 'l1', hasta: 'l2', color: 'gris', label: 'Recta L' },
        { tipo: 'segmento', desde: 'p', hasta: 'h', color: 'verde', medida: '2 u', label: 'Perpendicular' },
        { tipo: 'segmento', desde: 'p', hasta: 'q', color: 'rojo', medida: '≈3 u', label: 'Oblicua', estilo: 'punteado' },
      ],
      angulos: [
        { vertice: 'h', lado_a: 'l2', lado_b: 'p', medida: '90°', color: 'verde' },
      ],
      titulo: 'Distancia punto-recta: perpendicular (2 u) vs oblicua (≈3 u)',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo. Cual segmento representa la distancia del punto a la recta: el perpendicular (2 unidades) o el oblicuo (3 unidades)?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) El oblicuo, porque es mas largo',
          'B) El perpendicular, porque es el mas corto',
          'C) Los dos, porque ambos tocan la recta',
          'D) Ninguno',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando el modelo, explica por que la distancia de un punto a una recta siempre se mide con la perpendicular.',
        tipo: 'abierta',
        respuesta:
          'La perpendicular es el segmento mas corto porque forma 90° con la recta. Cualquier oblicua es mas larga (es la hipotenusa de un triangulo rectangulo).',
        criterios_aceptacion: ['perpendicular es la mas corta', 'angulo de 90 grados', 'oblicua mas larga', 'triangulo rectangulo o hipotenusa'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'La recta L es horizontal y pasa por y = 2. El punto P esta en (5, 7). Cual es la distancia de P a L?',
        opciones: ['A) 2', 'B) 5', 'C) 7', 'D) 9'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Dos rectas paralelas horizontales pasan por y = 1 y y = 6. Calcula la distancia entre ellas.',
        respuesta:
          'Paso 1: La distancia entre dos rectas paralelas es la distancia perpendicular entre ellas.\nPaso 2: Distancia = 6 - 1 = 5 unidades.\nRespuesta: La distancia entre las dos rectas paralelas es 5 unidades.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Un punto esta a la misma distancia de dos rectas paralelas. Donde se encuentra ese punto? Explica tu razonamiento.',
        respuesta:
          'Ese punto esta exactamente a la mitad entre las dos rectas paralelas, sobre una tercera recta paralela a ellas. Por ejemplo, si las rectas estan en y = 1 y y = 6, el punto equidistante esta en y = 3.5.',
        criterios_aceptacion: [
          'a la mitad entre las dos rectas',
          'tercera recta paralela',
          'misma distancia a ambas',
          'lugar geometrico',
        ],
      },
    ],
  },
}
