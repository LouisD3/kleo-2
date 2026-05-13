import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 28: Perimetro y area
 * Concepto clave: Calcular perimetro y area de poligonos
 *
 * Concreto: Geoplano 5x5 — trazar un rectangulo 4x3, area = 12
 * Pictorico: Modelo en barras — largo y ancho del rectangulo
 * Abstracto: 3 preguntas con progresion de dificultad sobre perimetro y area
 */
export const tareaSecuencia28: TareaCPA = {
  secuencia_ref: 28,
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 0],
        [0, 3],
        [4, 3],
        [4, 0],
      ],
      propiedad_a_medir: 'area',
      valor_esperado: 12,
      pregunta:
        'Traza un rectangulo de 4x3 en el geoplano y calcula su area.',
      pista:
        'El area de un rectangulo es largo por ancho. Cuenta las unidades: 4 de largo y 3 de ancho. Area = 4 x 3.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Largo', valor: 4, color: 'azul' },
        { label: 'Ancho', valor: 3, color: 'verde' },
      ],
      total: { valor: 12, visible: true },
      incognita: { posicion: 'total', label: 'Area = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo de barras. Si el largo es 4 y el ancho es 3, cual es el area del rectangulo?',
        tipo: 'opcion_multiple',
        opciones: ['A) 7', 'B) 12', 'C) 14', 'D) 16'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando el modelo, explica la diferencia entre perimetro y area del rectangulo de 4x3.',
        tipo: 'calculo',
        respuesta:
          'El perimetro es la suma de todos los lados: P = 2 x (largo + ancho) = 2 x (4 + 3) = 2 x 7 = 14 unidades. El area es el espacio interior: A = largo x ancho = 4 x 3 = 12 unidades cuadradas. El perimetro mide el contorno y el area mide la superficie.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Un cuadrado tiene un lado de 6 cm. Cual es su area?',
        opciones: ['A) 12 cm2', 'B) 24 cm2', 'C) 36 cm2', 'D) 48 cm2'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un terreno rectangular mide 15 m de largo y 8 m de ancho. Calcula su perimetro y su area.',
        respuesta:
          'Paso 1: Perimetro = 2 x (largo + ancho) = 2 x (15 + 8) = 2 x 23 = 46 m.\nPaso 2: Area = largo x ancho = 15 x 8 = 120 m2.\nRespuesta: El perimetro es 46 m y el area es 120 m2.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Dos rectangulos tienen el mismo perimetro de 20 cm pero diferente area. Da un ejemplo de cada uno y explica por que el area cambia aunque el perimetro sea igual.',
        respuesta:
          'Ejemplo 1: Rectangulo de 9 x 1 cm. Perimetro = 2(9+1) = 20 cm, area = 9 cm2.\nEjemplo 2: Rectangulo de 5 x 5 cm (cuadrado). Perimetro = 2(5+5) = 20 cm, area = 25 cm2.\nEl area cambia porque depende del producto de las dimensiones, no de su suma. Cuando las dimensiones son mas parecidas (como en el cuadrado), el area es mayor. Cuando una dimension es mucho mayor que la otra, la figura se alarga y el area disminuye.',
      },
    ],
  },
}
