import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 20: Rectas notables
 * Concepto clave: Identificar y trazar las rectas notables de un triángulo
 *
 * Concreto: Geoplano (triángulo para explorar medianas, alturas, mediatrices y bisectrices)
 * Pictorico: Modelo en barras representando la mediana que divide al triángulo
 * Abstracto: 3 preguntas con progresión de dificultad sobre rectas notables
 */
export const tareaSecuencia20: TareaCPA = {
  secuencia_ref: 20,
  contexto: {
    personaje: 'Elena',
    objetos: { a: { nombre: 'triangulo', emoji: '🔺' }, b: { nombre: 'recta notable', emoji: '📏' } },
    valores_clave: { longitud: 4 },
    tipo: 'geometria',
    narrativa: 'Elena explora las rectas notables de un triangulo: mediana, altura, mediatriz y bisectriz. Cada una tiene una funcion diferente.',
    pregunta_central: '¿Que hace la mediana de un triangulo?',
    transiciones: {
      concreto: 'Traza el triangulo en el geoplano y observa como se divide.',
      bridge_pictorico: 'La mediana va de un vertice al punto medio del lado opuesto.',
      pictorico: 'Observa como la mediana divide el lado en el modelo.',
      bridge_abstracto: 'Mediana, altura, mediatriz y bisectriz son las 4 rectas notables.',
      abstracto: 'Ahora identifica y traza rectas notables.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 0],
        [4, 2],
        [0, 4],
      ],
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar un triángulo. Luego identifica dónde trazarías una mediana desde el vértice superior hasta el punto medio del lado opuesto.',
      pista: 'La mediana va desde un vértice hasta el punto medio del lado opuesto. Encuentra el punto medio del lado inferior contando las unidades.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 6,
      alto: 5,
      puntos: [
        { id: 'a', x: 0, y: 0, label: 'A' },
        { id: 'b', x: 5, y: 1, label: 'B' },
        { id: 'c', x: 1, y: 4, label: 'C' },
        { id: 'm', x: 2.5, y: 0.5, label: 'M' },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'a', hasta: 'b', color: 'gris' },
        { tipo: 'segmento', desde: 'b', hasta: 'c', color: 'gris' },
        { tipo: 'segmento', desde: 'c', hasta: 'a', color: 'gris' },
        { tipo: 'segmento', desde: 'c', hasta: 'm', color: 'rojo', estilo: 'punteado', label: 'Mediana' },
      ],
      poligonos: [
        { puntos: ['a', 'b', 'c'], relleno: 'azul', opacidad: 0.08 },
      ],
      titulo: 'Triangulo con mediana desde C al punto medio M de AB',
    },
    preguntas: [
      {
        pregunta:
          'El diagrama muestra un triangulo con una linea punteada desde el vertice C hasta el punto medio M del lado AB. Esa recta se llama:',
        tipo: 'opcion_multiple',
        opciones: ['A) Altura', 'B) Bisectriz', 'C) Mediana', 'D) Mediatriz'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Describe las cuatro rectas notables de un triangulo y senala la diferencia principal entre cada una.',
        tipo: 'abierta',
        respuesta:
          'La mediana va de un vertice al punto medio del lado opuesto. La altura es perpendicular al lado opuesto. La mediatriz es perpendicular a un lado y pasa por su punto medio. La bisectriz divide un angulo en dos iguales.',
        criterios_aceptacion: ['mediana: punto medio', 'altura: perpendicular', 'mediatriz: perpendicular al lado', 'bisectriz: divide el angulo'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'La recta que va de un vértice del triángulo de forma perpendicular al lado opuesto se llama:',
        opciones: ['A) Mediana', 'B) Mediatriz', 'C) Bisectriz', 'D) Altura'],
        respuesta: 'D',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En un triángulo con vértices en A(0, 0), B(6, 0) y C(2, 4), calcula el punto medio del lado AB y escribe las coordenadas por donde pasa la mediana desde C.',
        respuesta:
          'Paso 1: El punto medio de AB = ((0+6)/2, (0+0)/2) = (3, 0).\nPaso 2: La mediana desde C va del punto C(2, 4) al punto medio M(3, 0).\nRespuesta: La mediana desde C pasa por los puntos (2, 4) y (3, 0).',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras cual es la diferencia entre la mediana y la altura de un triangulo. Usa un ejemplo para que quede claro.',
        respuesta:
          'La mediana va de un vertice al punto medio del lado opuesto y lo divide en dos partes iguales. La altura va de un vertice y baja perpendicular al lado opuesto, formando un angulo de 90°. La mediana no siempre es perpendicular.',
        criterios_aceptacion: [
          'mediana: punto medio del lado opuesto',
          'altura: perpendicular al lado opuesto',
          'mediana no siempre es perpendicular',
          'ejemplo o dibujo mental',
        ],
      },
    ],
  },
}
