import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 20c: Mediatriz de un triangulo
 * Concepto clave: Trazar la mediatriz de un lado del triangulo (perpendicular por el punto medio)
 *
 * Concreto: Geoplano (triangulo isosceles para ver la mediatriz de la base)
 * Pictorico: Diagrama geometrico — triangulo con mediatriz de la base y circuncentro
 * Abstracto: 3 preguntas progresivas sobre mediatriz en triangulos
 */
export const tareaSecuencia20c: TareaCPA = {
  secuencia_ref: 20,
  contexto: {
    personaje: 'Elena',
    objetos: { a: { nombre: 'triangulo', emoji: '🔺' }, b: { nombre: 'mediatriz', emoji: '📐' } },
    valores_clave: { lado_base: 6 },
    tipo: 'geometria',
    narrativa: 'Elena traza la mediatriz de un lado del triangulo: una recta perpendicular que pasa por el punto medio de ese lado. Las 3 mediatrices se cruzan en un punto especial.',
    pregunta_central: '¿Que pasa cuando se trazan las 3 mediatrices de un triangulo?',
    transiciones: {
      concreto: 'Traza un triangulo isosceles en el geoplano y encuentra el punto medio de la base.',
      bridge_pictorico: 'La mediatriz de la base pasa perpendicular por su punto medio.',
      pictorico: 'Observa la mediatriz y donde se cruzan las tres en el diagrama.',
      bridge_abstracto: 'Las 3 mediatrices se cruzan en un punto (circuncentro) equidistante de los 3 vertices.',
      abstracto: 'Ahora aplica el concepto de mediatriz en triangulos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 7,
      figura_objetivo: [
        [4, 0],
        [4, 6],
        [0, 3],
      ],
      pregunta:
        'Traza un triangulo isosceles en el geoplano. Encuentra el punto medio de la base (lado inferior) y marca donde pasaria la mediatriz (perpendicular por ese punto).',
      pista: 'La base va de (4,0) a (4,6), su punto medio esta en (4,3). La mediatriz es perpendicular a la base en ese punto.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 8,
      alto: 6,
      puntos: [
        { id: 'a', x: 1, y: 5, label: 'A' },
        { id: 'b', x: 7, y: 5, label: 'B' },
        { id: 'c', x: 4, y: 1, label: 'C' },
        { id: 'm', x: 4, y: 5, label: 'M' },
        { id: 'mt', x: 4, y: 0.5 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'a', hasta: 'b', color: 'azul', medida: '6 u' },
        { tipo: 'segmento', desde: 'b', hasta: 'c', color: 'gris' },
        { tipo: 'segmento', desde: 'c', hasta: 'a', color: 'gris' },
        { tipo: 'recta', desde: 'm', hasta: 'mt', color: 'verde', estilo: 'punteado', label: 'Mediatriz de AB' },
      ],
      angulos: [
        { vertice: 'm', lado_a: 'b', lado_b: 'mt', medida: '90°', color: 'verde' },
      ],
      poligonos: [
        { puntos: ['a', 'b', 'c'], relleno: 'azul', opacidad: 0.08 },
      ],
      titulo: 'Triangulo con mediatriz de la base AB (perpendicular por M)',
    },
    preguntas: [
      {
        pregunta:
          'La linea verde punteada pasa por el punto medio M de AB y es perpendicular a AB. Esa linea se llama:',
        tipo: 'opcion_multiple',
        opciones: ['A) Altura', 'B) Mediana', 'C) Mediatriz', 'D) Bisectriz'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Explica la diferencia entre la mediatriz y la mediana de un triangulo. Ambas pasan por el punto medio de un lado, pero son diferentes.',
        tipo: 'abierta',
        respuesta:
          'La mediana va del vertice opuesto al punto medio del lado. La mediatriz es perpendicular al lado y pasa por su punto medio, pero NO necesariamente pasa por el vertice opuesto (excepto en triangulos isosceles). La mediana conecta un vertice con un lado; la mediatriz es perpendicular al lado.',
        criterios_aceptacion: ['mediana: del vertice al punto medio', 'mediatriz: perpendicular al lado', 'mediatriz no siempre pasa por vertice', 'ambas usan punto medio'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Las 3 mediatrices de un triangulo siempre se cruzan en un punto llamado:',
        opciones: ['A) Baricentro', 'B) Ortocentro', 'C) Circuncentro', 'D) Incentro'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un triangulo tiene vertices en A(0, 0), B(6, 0) y C(3, 4). Encuentra el punto medio de AB y la direccion de la mediatriz de AB.',
        respuesta:
          'Paso 1: Punto medio de AB = ((0+6)/2, (0+0)/2) = (3, 0).\nPaso 2: AB es horizontal (y = 0).\nPaso 3: La mediatriz es perpendicular a AB, por lo tanto es vertical: la recta x = 3.\nRespuesta: La mediatriz de AB pasa por (3, 0) y es la recta vertical x = 3.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'El circuncentro de un triangulo esta a la misma distancia de los 3 vertices. Explica por que eso permite trazar un circulo que pase por los 3 vertices.',
        respuesta:
          'Si un punto esta a la misma distancia r de los 3 vertices, esa distancia es el radio de un circulo centrado en ese punto. Todos los vertices estan a distancia r del centro, asi que los 3 caen sobre la circunferencia. Ese circulo se llama circunscrito.',
        criterios_aceptacion: ['misma distancia de los 3 vertices', 'esa distancia es el radio', 'circulo circunscrito', 'los 3 vertices sobre la circunferencia'],
      },
    ],
  },
}
