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
        tipo: 'abierta',
        respuesta:
          'El perímetro mide el contorno: P = 2×(4+3) = 14 unidades. El área mide el espacio interior: A = 4×3 = 12 unidades cuadradas.',
        criterios_aceptacion: ['perímetro es el contorno', 'área es el espacio interior', 'fórmula perímetro correcta', 'fórmula área correcta'],
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
          'Un rectángulo de 9×1 tiene perímetro 20 cm y área 9 cm². Un cuadrado de 5×5 tiene el mismo perímetro pero área 25 cm². El área cambia porque depende del producto de las dimensiones, no de su suma.',
        criterios_aceptacion: ['dos ejemplos con perímetro 20', 'áreas diferentes', 'área depende del producto', 'dimensiones más iguales dan mayor área'],
      },
    ],
  },
}
