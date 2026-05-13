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
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Mitad A', valor: 2, color: 'azul' },
        { label: 'Mitad B', valor: 2, color: 'verde' },
      ],
      total: { valor: 4, visible: true },
      incognita: { posicion: 'total', label: 'Lado = 4 u' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo de barras muestra un lado de un triángulo dividido en dos partes iguales. La recta que va del vértice opuesto a ese punto medio se llama:',
        tipo: 'opcion_multiple',
        opciones: ['A) Altura', 'B) Bisectriz', 'C) Mediana', 'D) Mediatriz'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Describe las cuatro rectas notables de un triángulo y señala la diferencia principal entre cada una.',
        tipo: 'calculo',
        respuesta:
          'La mediana va de un vértice al punto medio del lado opuesto. La altura va de un vértice y es perpendicular al lado opuesto. La mediatriz es perpendicular a un lado y pasa por su punto medio (no necesariamente pasa por un vértice). La bisectriz divide un ángulo interior del triángulo en dos ángulos iguales. La diferencia principal es: la mediana y la bisectriz parten de un vértice, la mediatriz no; la altura y la mediatriz son perpendiculares a un lado, la mediana y la bisectriz no.',
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
          'Las tres medianas de un triángulo se cruzan en un solo punto llamado baricentro. Explica qué representa el baricentro y menciona una propiedad que lo haga especial.',
        respuesta:
          'El baricentro es el centro de gravedad del triángulo: si recortaras un triángulo de cartón, podrías equilibrarlo en ese punto. Una propiedad especial es que divide cada mediana en razón 2:1 (la parte del vértice es el doble que la del lado opuesto).',
        criterios_aceptacion: [
          'centro de gravedad',
          'equilibrio',
          'razón 2:1',
          'tres medianas',
          'se cruzan en un punto',
        ],
      },
    ],
  },
}
