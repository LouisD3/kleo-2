import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 11b: Perimetro de figuras irregulares
 * Concepto clave: Calcular el perimetro de una figura compuesta (en L)
 *
 * Concreto: Geoplano (figura en L, contar el contorno)
 * Pictorico: Diagrama geometrico — figura en L con medidas anotadas
 * Abstracto: 3 preguntas progresivas sobre perimetros de figuras no rectangulares
 */
export const tareaSecuencia11b: TareaCPA = {
  secuencia_ref: 11,
  concepto_clave: 'Calcular el perimetro de una figura compuesta (en L)',
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'patio', emoji: '🏗️' }, b: { nombre: 'cerca', emoji: '🪵' } },
    valores_clave: { perimetro: 16 },
    tipo: 'medicion',
    narrativa: 'Roberto quiere cercar un patio en forma de L. El perimetro no es tan simple como en un rectangulo: debe contar todos los lados.',
    pregunta_central: '¿Cual es el perimetro de una figura en forma de L?',
    transiciones: {
      concreto: 'Traza la figura en L en el geoplano y cuenta todos los lados del contorno.',
      bridge_pictorico: 'La figura en L tiene 6 lados. Sumando todos: el perimetro es 16 unidades.',
      pictorico: 'Observa la figura en L con todas sus medidas en el diagrama.',
      bridge_abstracto: 'Para figuras irregulares, se suman todos los lados uno por uno.',
      abstracto: 'Ahora calcula perimetros de otras figuras irregulares.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 0],
        [0, 4],
        [2, 4],
        [2, 2],
        [4, 2],
        [4, 0],
      ],
      propiedad_a_medir: 'perimetro',
      valor_esperado: 16,
      pregunta:
        'Traza una figura en forma de L en el geoplano conectando los puntos. Luego calcula su perimetro sumando todos los lados.',
      pista: 'La figura en L tiene 6 lados. Cuenta las unidades de cada lado y suma todo.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 6,
      alto: 6,
      puntos: [
        { id: 'p1', x: 1, y: 1 },
        { id: 'p2', x: 5, y: 1 },
        { id: 'p3', x: 5, y: 3 },
        { id: 'p4', x: 3, y: 3 },
        { id: 'p5', x: 3, y: 5 },
        { id: 'p6', x: 1, y: 5 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'p1', hasta: 'p2', color: 'azul', medida: '4 u' },
        { tipo: 'segmento', desde: 'p2', hasta: 'p3', color: 'azul', medida: '2 u' },
        { tipo: 'segmento', desde: 'p3', hasta: 'p4', color: 'azul', medida: '2 u' },
        { tipo: 'segmento', desde: 'p4', hasta: 'p5', color: 'azul', medida: '2 u' },
        { tipo: 'segmento', desde: 'p5', hasta: 'p6', color: 'azul', medida: '2 u' },
        { tipo: 'segmento', desde: 'p6', hasta: 'p1', color: 'azul', medida: '4 u' },
      ],
      poligonos: [
        { puntos: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'], relleno: 'azul', opacidad: 0.1 },
      ],
      titulo: 'Figura en L — Perimetro = 4+2+2+2+2+4 = 16 u',
    },
    preguntas: [
      {
        pregunta:
          'La figura en L tiene 6 lados. Sumando las medidas del diagrama, cual es el perimetro?',
        tipo: 'opcion_multiple',
        opciones: ['A) 12 u', 'B) 14 u', 'C) 16 u', 'D) 20 u'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Explica por que no se puede usar la formula P = 2(l+a) para esta figura. Que metodo usas en su lugar?',
        tipo: 'abierta',
        respuesta:
          'P = 2(l+a) solo funciona para rectangulos. La figura en L no es un rectangulo, tiene 6 lados. Hay que sumar cada lado: 4+2+2+2+2+4 = 16. Para figuras irregulares, se miden y suman todos los lados.',
        criterios_aceptacion: ['P = 2(l+a) solo para rectangulos', 'la L tiene 6 lados', 'sumar cada lado', 'resultado 16'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Una figura en forma de T tiene 8 lados. Para calcular su perimetro:',
        opciones: [
          'A) Uso P = 2(l+a)',
          'B) Sumo los 8 lados',
          'C) Multiplico el lado mas largo por 8',
          'D) Calculo el area y saco la raiz',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Una piscina en forma de L tiene lados de: 10m, 4m, 6m, 3m, 4m, 7m. Calcula el perimetro.',
        respuesta:
          'Perimetro = 10 + 4 + 6 + 3 + 4 + 7 = 34 metros.\nPara figuras irregulares, se suman todos los lados uno por uno.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Un patio cuadrado de 4×4 tiene perimetro 16 y area 16. Una figura en L tambien puede tener perimetro 16 pero area diferente. Explica por que el perimetro no determina el area.',
        respuesta:
          'El perimetro mide el contorno y el area mide el espacio interior. Una figura puede tener la misma longitud de borde pero diferente forma, lo que cambia el espacio interior. El cuadrado 4×4 tiene area 16, pero la L de perimetro 16 tiene area menor (12).',
        criterios_aceptacion: ['perimetro es contorno', 'area es espacio interior', 'misma longitud diferente forma', 'ejemplo numerico'],
      },
    ],
  },
}
