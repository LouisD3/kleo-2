import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 32b: Probabilidad con moneda
 * Concepto clave: Calcular probabilidad teorica y comparar con frecuencia experimental (moneda)
 *
 * Concreto: DadosRuleta tipo moneda (lanzar 10 veces, probabilidad de aguila)
 * Pictorico: Modelo en barras (1 favorable de 2 posibles)
 * Abstracto: 3 preguntas progresivas sobre probabilidad con moneda
 */
export const tareaSecuencia32b: TareaCPA = {
  secuencia_ref: 32,
  concepto_clave: 'Calcular probabilidad teorica y comparar con frecuencia experimental (moneda)',
  contexto: {
    personaje: 'Pablo',
    objetos: { a: { nombre: 'moneda', emoji: '🪙' }, b: { nombre: 'probabilidad', emoji: '🔢' } },
    valores_clave: { caras: 2, favorables: 1 },
    tipo: 'probabilidad',
    narrativa: 'Pablo lanza una moneda y quiere calcular la probabilidad de que caiga aguila. Solo hay dos resultados posibles.',
    pregunta_central: '¿Cual es la probabilidad de que caiga aguila?',
    transiciones: {
      concreto: 'Lanza la moneda varias veces y observa los resultados.',
      bridge_pictorico: 'De 2 caras, 1 es aguila: la probabilidad es 1/2 = 50%.',
      pictorico: 'Observa los resultados favorables vs totales en el modelo.',
      bridge_abstracto: 'P(aguila) = 1/2. Es el experimento mas simple de probabilidad.',
      abstracto: 'Ahora aplica probabilidad a otros eventos con moneda.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'dados_ruleta',
      tipo: 'moneda',
      lanzamientos: 10,
      evento_favorable: 'Que caiga aguila',
      respuesta_probabilidad: '1/2',
      pregunta:
        'Lanza la moneda 10 veces. Cuenta cuantas veces cae aguila. Luego responde: cual es la probabilidad teorica de aguila?',
      pista: 'Una moneda tiene 2 caras: aguila y sol. La probabilidad de aguila es 1 favorable de 2 posibles = 1/2.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Aguila (favorable)', valor: 1, color: 'verde' },
        { label: 'Sol (no favorable)', valor: 1, color: 'rojo' },
      ],
      total: { valor: 2, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo muestra 1 resultado favorable (aguila) de 2 posibles. Cual es la probabilidad como fraccion y como porcentaje?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1/2 = 50%', 'B) 1/1 = 100%', 'C) 2/2 = 100%', 'D) 1/4 = 25%'],
        respuesta: 'A',
      },
      {
        pregunta:
          'Lanzaste la moneda 10 veces. Si la probabilidad teorica es 50%, esperarias 5 aguilas. Obtuviste exactamente 5? Explica por que puede ser diferente.',
        tipo: 'abierta',
        respuesta:
          'Es normal obtener un resultado diferente de 5. La probabilidad dice lo que esperamos a largo plazo, pero cada lanzamiento es aleatorio. Con pocos lanzamientos hay mas variacion. Con 1000 lanzamientos, el resultado se acercaria mas al 50%.',
        criterios_aceptacion: ['esperado 5 de 10', 'resultado puede variar', 'azar o aleatoriedad', 'mas lanzamientos mas cercano al teorico'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Se lanzan 2 monedas. Cual es la probabilidad de que AMBAS caigan aguila?',
        opciones: ['A) 1/2', 'B) 1/3', 'C) 1/4', 'D) 2/4'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Se lanza una moneda 50 veces. Cuantas veces esperarias obtener aguila? Muestra el procedimiento.',
        respuesta:
          'Paso 1: P(aguila) = 1/2.\nPaso 2: Numero esperado = probabilidad x total.\nPaso 3: 1/2 x 50 = 25.\nRespuesta: Esperarias obtener aguila aproximadamente 25 veces.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Una moneda ha caido aguila 8 veces seguidas. Cual es la probabilidad de que el siguiente lanzamiento sea aguila? Explica por que.',
        respuesta:
          'La probabilidad sigue siendo 1/2. Cada lanzamiento es independiente: la moneda no tiene memoria de los resultados anteriores. Esto se llama independencia de eventos.',
        criterios_aceptacion: ['probabilidad sigue siendo 1/2', 'cada lanzamiento es independiente', 'la moneda no tiene memoria', 'resultados anteriores no afectan'],
      },
    ],
  },
}
