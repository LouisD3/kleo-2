import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 11: Perímetros
 * Concepto clave: Calcular el perímetro de un rectángulo
 *
 * Concreto: Geoplano (rectángulo de 4×3 unidades, perímetro = 14)
 * Pictorico: Modelo en barras representando los lados del rectángulo
 * Abstracto: 3 preguntas con progresión de dificultad sobre perímetros
 */
export const tareaSecuencia11: TareaCPA = {
  secuencia_ref: 11,
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'terreno', emoji: '🏗️' }, b: { nombre: 'cerca', emoji: '🪵' } },
    valores_clave: { largo: 4, ancho: 3, perimetro: 14 },
    tipo: 'medicion',
    narrativa: 'Roberto quiere cercar un terreno rectangular. Necesita saber cuanta cerca comprar, asi que debe calcular el perimetro.',
    pregunta_central: '¿Cuantos metros de cerca necesita Roberto para un terreno de 4×3?',
    transiciones: {
      concreto: 'Traza el rectangulo en el geoplano y cuenta el contorno.',
      bridge_pictorico: 'El perimetro es 4 + 3 + 4 + 3 = 14 unidades.',
      pictorico: 'Observa los lados del rectangulo en el modelo.',
      bridge_abstracto: 'Formula: Perimetro = 2 × (largo + ancho).',
      abstracto: 'Ahora calcula perimetros de otras figuras.',
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
        [3, 4],
        [3, 0],
      ],
      propiedad_a_medir: 'perimetro',
      valor_esperado: 14,
      pregunta:
        'Traza un rectangulo de 4 unidades de largo y 3 de ancho en el geoplano. Luego calcula su perimetro.',
      pista: 'El perimetro es la suma de los 4 lados: 4 + 3 + 4 + 3 = 14 unidades.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Largo', valor: 4, color: 'azul' },
        { label: 'Largo', valor: 4, color: 'azul' },
        { label: 'Ancho', valor: 3, color: 'verde' },
        { label: 'Ancho', valor: 3, color: 'verde' },
      ],
      total: { valor: 14, visible: true },
      incognita: { posicion: 'total', label: 'Perímetro = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo de barras que representa los lados del rectangulo. Si cada lado largo mide 4 unidades y cada lado corto mide 3, ¿cual es el perimetro?',
        tipo: 'opcion_multiple',
        opciones: ['A) 7', 'B) 12', 'C) 14', 'D) 24'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Usando el modelo de barras, escribe la fórmula del perímetro de un rectángulo usando las variables l (largo) y a (ancho).',
        tipo: 'abierta',
        respuesta:
          'El perimetro de un rectangulo se calcula sumando todos sus lados: P = l + l + a + a, que se simplifica como P = 2l + 2a o tambien P = 2(l + a). Con l = 4 y a = 3: P = 2(4 + 3) = 2(7) = 14 unidades.',
        criterios_aceptacion: ['P = 2l + 2a o P = 2(l+a)', 'sumar los 4 lados', 'resultado 14'],
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
