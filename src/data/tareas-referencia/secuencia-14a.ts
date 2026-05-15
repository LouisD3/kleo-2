import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 14a: Razones
 * Concepto clave: Razon como reparto equitativo
 * Anchor task: Maria prepara aguas frescas con limones y jarras
 *
 * Concreto: Agrupar 12 limones en grupos de 3 (= 4 jarras)
 * Pictorico: Modelo de barras — 4 jarras de 3 limones, total 12
 * Abstracto: Formalizar la razon, extender a otros valores
 */
export const tareaSecuencia14a: TareaCPA = {
  secuencia_ref: 14,
  concepto_clave: 'Razon como reparto equitativo',
  contexto: {
    personaje: 'Maria',
    objetos: {
      a: { nombre: 'limon', emoji: '🍋' },
      b: { nombre: 'jarra', emoji: '🫙' },
    },
    valores_clave: {
      razon: [3, 1],
      objetivo: 12,
    },
    tipo: 'razon',
    narrativa:
      'Maria prepara aguas frescas para una fiesta. Su receta dice que necesita 3 limones por cada jarra. Tiene 12 limones.',
    pregunta_central: '¿Cuantas jarras de agua fresca puede preparar Maria?',
    transiciones: {
      concreto:
        'Ayuda a Maria a organizar sus limones. Agrupa los limones de 3 en 3 para ver cuantas jarras puede llenar.',
      bridge_pictorico:
        'Descubriste que con 12 limones y 3 por jarra, Maria puede preparar 4 jarras.',
      pictorico: 'Ahora observa como se ve este reparto en un modelo de barras.',
      bridge_abstracto:
        'El modelo de barras confirma que cada jarra usa 3 limones y hay 4 jarras iguales.',
      abstracto: 'Ahora formaliza esta razon y aplica a nuevas situaciones.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'dulces_agrupables',
      cantidad: 12,
      grupos_objetivo: 4,
      soluciones_validas: [{ grupos: 4, por_grupo: 3 }],
      pregunta:
        'Maria tiene 12 limones y necesita 3 por cada jarra. Agrupa los limones para ver cuantas jarras puede preparar.',
      pista:
        'Cada jarra necesita exactamente 3 limones. Arrastra los limones de 3 en 3 a cada grupo.',
      etiqueta: 'limon',
      emoji: '🍋',
      etiqueta_grupo: 'Jarra',
      emoji_grupo: '🫙',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: '🫙 Jarra 1', valor: 3, color: 'amarillo', subdivisiones: 3 },
        { label: '🫙 Jarra 2', valor: 3, color: 'verde', subdivisiones: 3 },
        { label: '🫙 Jarra 3', valor: 3, color: 'azul', subdivisiones: 3 },
        { label: '🫙 Jarra 4', valor: 3, color: 'morado', subdivisiones: 3 },
      ],
      total: { valor: 12, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta: 'Segun el modelo, cuantos limones usa Maria en cada jarra?',
        tipo: 'opcion_multiple',
        opciones: ['A) 2 limones', 'B) 3 limones', 'C) 4 limones', 'D) 12 limones'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Si cada barra representa una jarra con 3 limones, cuantas jarras prepara Maria? Escribe la operacion.',
        tipo: 'calculo',
        respuesta: '12 / 3 = 4 jarras. Se divide el total de limones entre los limones por jarra.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Maria usa 3 limones por jarra y tiene 12 limones. ¿Cual es la razon de limones a jarras?',
        opciones: ['A) 3:1', 'B) 4:1', 'C) 12:3', 'D) A y C son correctas'],
        respuesta: 'D',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Si Maria consigue 21 limones mas (33 en total), ¿cuantas jarras puede preparar con la misma receta de 3 limones por jarra? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Maria tiene 33 limones en total.\nPaso 2: La razon es 3 limones por jarra.\nPaso 3: 33 / 3 = 11 jarras.\nRespuesta: Maria puede preparar 11 jarras.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que es una razon usando el ejemplo de Maria y sus aguas frescas.',
        respuesta:
          'Una razon compara dos cantidades relacionadas. La razon 3:1 significa 3 limones por jarra. Dividiendo el total de limones entre 3 sabemos cuantas jarras se pueden llenar.',
        criterios_aceptacion: ['comparacion de cantidades', 'razon 3:1', 'division', 'limones por jarra'],
      },
    ],
  },
}
