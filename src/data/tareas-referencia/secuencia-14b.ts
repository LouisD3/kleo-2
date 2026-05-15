import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 14b: Razones
 * Concepto clave: Comparar dos razones diferentes
 * Anchor task: Don Pedro vende tacos — comparar receta de salsa roja vs verde
 *
 * Concreto: Agrupar 12 chiles en grupos de 4 (= 3 tandas) vs grupos de 3 (= 4 tandas)
 * Pictorico: Modelo comparativo — 3 chiles/tanda vs 4 chiles/tanda
 * Abstracto: Formalizar la comparacion de razones, generalizar
 */
export const tareaSecuencia14b: TareaCPA = {
  secuencia_ref: 14,
  concepto_clave: 'Comparar dos razones diferentes',
  contexto: {
    personaje: 'Don Pedro',
    objetos: {
      a: { nombre: 'chile', emoji: '🌶️' },
      b: { nombre: 'tanda de salsa', emoji: '🫕' },
    },
    valores_clave: {
      razon: [4, 1],
      objetivo: 12,
    },
    tipo: 'comparacion',
    narrativa:
      'Don Pedro tiene un puesto de tacos y prepara dos tipos de salsa. Para la salsa roja usa 4 chiles por tanda, y para la verde usa 3 chiles por tanda. Hoy tiene 12 chiles.',
    pregunta_central: '¿De cual salsa puede hacer mas tandas con los mismos 12 chiles?',
    transiciones: {
      concreto:
        'Ayuda a Don Pedro a organizar sus chiles. Agrupa de 4 en 4 para ver cuantas tandas de salsa roja salen.',
      bridge_pictorico:
        'Con 12 chiles y 4 por tanda, salen 3 tandas de salsa roja. Pero la verde usa solo 3 chiles por tanda.',
      pictorico: 'Ahora compara las dos recetas en un modelo de barras: ¿cual rinde mas?',
      bridge_abstracto:
        'Las barras muestran que con menos chiles por tanda, se hacen mas tandas: 4 verdes vs 3 rojas.',
      abstracto:
        'Formaliza esta comparacion: ¿por que al usar menos ingredientes por tanda se obtienen mas tandas?',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'dulces_agrupables',
      cantidad: 12,
      grupos_objetivo: 3,
      soluciones_validas: [{ grupos: 3, por_grupo: 4 }],
      pregunta:
        'Don Pedro tiene 12 chiles para la salsa roja (4 por tanda). Agrupa los chiles para ver cuantas tandas salen.',
      pista: 'Cada tanda de salsa roja necesita 4 chiles. Intenta hacer grupos de 4.',
      etiqueta: 'chile',
      emoji: '🌶️',
      etiqueta_grupo: 'Tanda',
      emoji_grupo: '🫕',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: '🌶️ Roja (4 c/tanda)', valor: 4, color: 'rojo', subdivisiones: 4 },
        { label: '🌶️ Verde (3 c/tanda)', valor: 3, color: 'verde', subdivisiones: 3 },
      ],
      total: { valor: 12, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Con 12 chiles, Don Pedro hace 3 tandas de roja (4 chiles c/u) y 4 tandas de verde (3 chiles c/u). ¿De cual salsa hace mas tandas?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) De la salsa roja',
          'B) De la salsa verde',
          'C) Hace la misma cantidad',
          'D) No se puede saber',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Observa las barras. ¿Por que la barra de la salsa verde es mas corta que la de la roja, pero Don Pedro hace mas tandas de verde? Explica.',
        tipo: 'abierta',
        respuesta:
          'Cada tanda verde usa 3 chiles (menos que la roja con 4). Con menos chiles por tanda, los 12 chiles alcanzan para mas tandas: 12/3 = 4 verdes vs 12/4 = 3 rojas.',
        criterios_aceptacion: ['menos chiles por tanda', 'division 12/3 o 12/4', 'mas tandas de verde', 'comparacion de resultados'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Don Pedro usa 4 chiles por tanda de roja y 3 por tanda de verde. Con 12 chiles, ¿cuantas tandas de cada salsa puede hacer?',
        opciones: [
          'A) 3 rojas y 4 verdes',
          'B) 4 rojas y 3 verdes',
          'C) 6 de cada una',
          'D) Depende del tamano del chile',
        ],
        respuesta: 'A',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Si Don Pedro consigue 24 chiles, ¿cuantas tandas de cada salsa puede hacer? Compara los resultados y muestra el procedimiento.',
        respuesta:
          'Salsa roja: 24 / 4 = 6 tandas.\nSalsa verde: 24 / 3 = 8 tandas.\nCon 24 chiles, Don Pedro hace 2 tandas mas de verde que de roja (8 vs 6), porque la razon de chiles por tanda es menor en la verde.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica por que al usar menos ingredientes por tanda, se pueden hacer mas tandas con la misma cantidad total. Usa el ejemplo de Don Pedro.',
        respuesta:
          'Si cada tanda gasta menos chiles, el total alcanza para mas tandas. Con 12 chiles: 12/3 = 4 tandas verdes, pero 12/4 = 3 tandas rojas. Dividir entre un numero menor siempre da un resultado mayor.',
        criterios_aceptacion: ['menos por tanda mas tandas', 'division', 'comparacion 12/3 vs 12/4', 'divisor menor resultado mayor'],
      },
    ],
  },
}
