import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 33: Eventos aleatorios
 * Concepto clave: Identificar el espacio muestral y calcular probabilidad con una ruleta
 *
 * Concreto: Dados/ruleta (girar ruleta de 4 secciones, 8 veces)
 * Pictorico: Modelo en barras (favorable vs total de secciones)
 * Abstracto: 3 preguntas con progresion de dificultad sobre eventos aleatorios
 */
export const tareaSecuencia33: TareaCPA = {
  secuencia_ref: 33,
  contexto: {
    personaje: 'Pablo',
    objetos: { a: { nombre: 'ruleta', emoji: '🎡' }, b: { nombre: 'seccion', emoji: '🔴' } },
    valores_clave: { secciones: 4, favorables: 1 },
    tipo: 'probabilidad',
    narrativa: 'Pablo gira una ruleta de 4 secciones de colores y quiere saber la probabilidad de caer en rojo.',
    pregunta_central: '¿Cual es la probabilidad de caer en la seccion roja?',
    transiciones: {
      concreto: 'Gira la ruleta varias veces y registra los resultados.',
      bridge_pictorico: '1 seccion roja de 4 totales: P = 1/4.',
      pictorico: 'Observa el espacio muestral en el modelo.',
      bridge_abstracto: 'El espacio muestral tiene 4 resultados equiprobables.',
      abstracto: 'Ahora identifica espacios muestrales y calcula probabilidades.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'dados_ruleta',
      tipo: 'ruleta',
      lanzamientos: 8,
      secciones_ruleta: [
        { label: 'Rojo', color: 'rojo' },
        { label: 'Azul', color: 'azul' },
        { label: 'Verde', color: 'verde' },
        { label: 'Amarillo', color: 'amarillo' },
      ],
      evento_favorable: 'Que caiga en Rojo',
      respuesta_probabilidad: '1/4',
      pregunta:
        'Gira la ruleta 8 veces. Luego responde: cual es la probabilidad teorica de que caiga en Rojo?',
      pista:
        'La ruleta tiene 4 secciones iguales. Solo 1 seccion es Roja. La probabilidad es resultados favorables entre resultados posibles.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Rojo (favorable)', valor: 1, color: 'rojo' },
        { label: 'Otros colores', valor: 3, color: 'gris' },
      ],
      total: { valor: 4, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo. De 4 secciones iguales, 1 es Rojo. Cual es la probabilidad de caer en Rojo?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1/2', 'B) 1/3', 'C) 1/4', 'D) 1/8'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si giras la ruleta 20 veces, cuantas veces esperarias teoricamente que caiga en Rojo? Explica tu razonamiento.',
        tipo: 'calculo',
        respuesta:
          'La probabilidad de Rojo es 1/4. Numero esperado = probabilidad x total de giros = 1/4 x 20 = 5. Esperarias que caiga en Rojo aproximadamente 5 veces de 20 giros.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Una ruleta tiene 5 secciones iguales: Rojo, Azul, Verde, Amarillo y Morado. Cual es la probabilidad de que NO caiga en Azul?',
        opciones: ['A) 1/5', 'B) 2/5', 'C) 3/5', 'D) 4/5'],
        respuesta: 'D',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Una bolsa tiene 3 canicas rojas, 2 azules y 5 verdes. Cual es el espacio muestral? Calcula la probabilidad de sacar una canica que NO sea verde.',
        respuesta:
          'Paso 1: Espacio muestral = total de canicas = 3 + 2 + 5 = 10 resultados posibles.\nPaso 2: Canicas que no son verdes = 3 rojas + 2 azules = 5.\nPaso 3: Probabilidad = 5/10 = 1/2.\nRespuesta: La probabilidad de sacar una canica que no sea verde es 1/2.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que es el espacio muestral de un experimento aleatorio y por que es importante conocerlo antes de calcular probabilidades.',
        respuesta:
          'El espacio muestral es el conjunto de todos los resultados posibles. Por ejemplo, al lanzar un dado es {1, 2, 3, 4, 5, 6}. Es importante conocerlo porque la probabilidad se calcula dividiendo los resultados favorables entre el total posible.',
        criterios_aceptacion: [
          'todos los resultados posibles',
          'ejemplo concreto (dado, ruleta, etc.)',
          'necesario para calcular probabilidad',
          'resultados favorables entre total',
        ],
      },
    ],
  },
}
