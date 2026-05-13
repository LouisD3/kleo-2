import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 11: Perímetros
 * Concepto clave: Calcular el perímetro de un rectángulo
 *
 * Concreto: Geoplano (rectángulo de 2×2 unidades, perímetro = 8)
 * Pictorico: Modelo en barras representando los lados del rectángulo
 * Abstracto: 3 preguntas con progresión de dificultad sobre perímetros
 */
export const tareaSecuencia11: TareaCPA = {
  secuencia_ref: 11,
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [1, 1],
        [1, 3],
        [3, 3],
        [3, 1],
      ],
      propiedad_a_medir: 'perimetro',
      valor_esperado: 8,
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar un rectángulo. Luego calcula su perímetro.',
      pista: 'Cuenta cuántas unidades mide cada lado del rectángulo y suma los cuatro lados.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Largo', valor: 2, color: 'azul' },
        { label: 'Largo', valor: 2, color: 'azul' },
        { label: 'Ancho', valor: 2, color: 'verde' },
        { label: 'Ancho', valor: 2, color: 'verde' },
      ],
      total: { valor: 8, visible: true },
      incognita: { posicion: 'total', label: 'Perímetro = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo de barras que representa los lados de un rectángulo. Si cada lado largo mide 2 unidades y cada lado corto mide 2 unidades, ¿cuál es el perímetro?',
        tipo: 'opcion_multiple',
        opciones: ['A) 4', 'B) 6', 'C) 8', 'D) 10'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Usando el modelo de barras, escribe la fórmula del perímetro de un rectángulo usando las variables l (largo) y a (ancho).',
        tipo: 'calculo',
        respuesta:
          'El perímetro de un rectángulo se calcula sumando todos sus lados: P = l + l + a + a, que se simplifica como P = 2l + 2a o también P = 2(l + a). Con l = 2 y a = 2: P = 2(2 + 2) = 2(4) = 8 unidades.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Un rectángulo tiene largo de 5 cm y ancho de 3 cm. ¿Cuál es su perímetro?',
        opciones: ['A) 8 cm', 'B) 15 cm', 'C) 16 cm', 'D) 30 cm'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un terreno rectangular tiene un perímetro de 24 metros. Si el largo mide 8 metros, ¿cuánto mide el ancho? Plantea la ecuación y resuélvela.',
        respuesta:
          'Paso 1: Usamos la fórmula del perímetro: P = 2l + 2a.\nPaso 2: Sustituimos: 24 = 2(8) + 2a.\nPaso 3: 24 = 16 + 2a.\nPaso 4: 2a = 24 - 16 = 8.\nPaso 5: a = 4.\nRespuesta: El ancho mide 4 metros.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Si un cuadrado y un rectángulo tienen el mismo perímetro, ¿siempre tienen la misma área? Explica tu razonamiento con un ejemplo.',
        respuesta:
          'No, no siempre. Un cuadrado de perímetro 16 cm tiene lados de 4 cm y área 16 cm². Un rectángulo de 6×2 cm tiene el mismo perímetro pero área 12 cm². El perímetro igual no garantiza áreas iguales.',
        criterios_aceptacion: [
          'respuesta negativa justificada',
          'ejemplo numérico concreto',
          'cálculo correcto de área',
          'distinción entre perímetro y área',
        ],
      },
    ],
  },
}
