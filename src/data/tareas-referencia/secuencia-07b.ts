import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 7b: Propiedad asociativa
 * Concepto clave: (a+b)+c = a+(b+c), agrupar diferente da el mismo resultado
 *
 * Concreto: BloquesBase10 (representar 18 de varias formas)
 * Pictorico: Modelo de barras — 3 cantidades (6, 5, 7) que suman 18
 * Abstracto: 3 preguntas progresivas sobre propiedad asociativa
 */
export const tareaSecuencia07b: TareaCPA = {
  secuencia_ref: 7,
  concepto_clave: '(a+b)+c = a+(b+c), agrupar diferente da el mismo resultado',
  contexto: {
    personaje: 'Ana',
    objetos: { a: { nombre: 'cubo', emoji: '🧊' }, b: { nombre: 'grupo', emoji: '📦' } },
    valores_clave: { objetivo: 18 },
    tipo: 'numero',
    narrativa:
      'Ana tiene 18 cubos y quiere sumar 6 + 5 + 7. Descubre que no importa como agrupe los numeros: el resultado siempre es 18.',
    pregunta_central: '¿Da lo mismo sumar (6+5)+7 que 6+(5+7)?',
    transiciones: {
      concreto: 'Representa el numero 18 con bloques de diferentes maneras.',
      bridge_pictorico: 'No importa como agrupes 6, 5 y 7: siempre suman 18.',
      pictorico: 'Observa las tres cantidades en el modelo de barras.',
      bridge_abstracto: 'Esto es la propiedad asociativa: (a+b)+c = a+(b+c).',
      abstracto: 'Ahora aplica la propiedad asociativa a otros ejercicios.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'bloques_base10',
      numero_objetivo: 18,
      unidades_disponibles: { unidades: 20, barras: 2, cuadrados: 0 },
      soluciones_validas: [
        { unidades: 18, barras: 0, cuadrados: 0 },
        { unidades: 8, barras: 1, cuadrados: 0 },
      ],
      pregunta:
        'Ana tiene 18 cubos. Representa el numero 18 usando los bloques disponibles. ¿Hay mas de una forma de hacerlo?',
      pista:
        'Puedes usar 18 unidades sueltas, o agrupar 10 unidades en 1 barra y dejar 8 sueltas. Ambas formas dan 18.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Primer grupo: 6', valor: 6, color: 'amarillo' },
        { label: 'Segundo grupo: 5', valor: 5, color: 'azul' },
        { label: 'Tercer grupo: 7', valor: 7, color: 'verde' },
      ],
      total: { valor: 18, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo muestra 3 cantidades: 6, 5 y 7. Si primero sumas 6+5=11 y luego sumas 11+7, ¿cuanto da?',
        tipo: 'opcion_multiple',
        opciones: ['A) 17', 'B) 18', 'C) 19', 'D) 20'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Ahora agrupa diferente: primero suma 5+7=12, luego suma 6+12. ¿Da el mismo resultado que (6+5)+7? Muestra las operaciones.',
        tipo: 'calculo',
        respuesta:
          'Agrupacion 1: (6+5)+7 = 11+7 = 18.\nAgrupacion 2: 6+(5+7) = 6+12 = 18.\nSi, ambas dan 18. No importa como agrupes los sumandos.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'La propiedad que dice que (a+b)+c = a+(b+c) se llama:',
        opciones: [
          'A) Propiedad conmutativa',
          'B) Propiedad asociativa',
          'C) Propiedad distributiva',
          'D) Propiedad de identidad',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Calcula (19 + 36) + 4 de dos formas usando la propiedad asociativa y compara los resultados.',
        respuesta:
          'Forma 1: (19+36)+4 = 55+4 = 59.\nForma 2: 19+(36+4) = 19+40 = 59.\nAmbas agrupaciones dan 59. La forma 2 es mas facil porque 36+4=40 es un numero redondo.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras la diferencia entre la propiedad conmutativa y la propiedad asociativa. Da un ejemplo de cada una.',
        respuesta:
          'La conmutativa cambia el orden: 3+5 = 5+3. La asociativa cambia la agrupacion: (2+3)+4 = 2+(3+4). En ambos casos el resultado no cambia.',
        criterios_aceptacion: [
          'conmutativa cambia el orden',
          'asociativa cambia la agrupacion',
          'ejemplo numerico de cada una',
          'resultado no cambia',
        ],
      },
    ],
  },
}
