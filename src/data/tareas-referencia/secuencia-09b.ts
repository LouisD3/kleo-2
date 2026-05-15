import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 9B: Predecir terminos
 * Concepto clave: Predecir terminos de una sucesion aritmetica
 *
 * Concreto: PatronFiguras (terminos 2,5,8 con circulos, construir termino 4 = 11)
 * Pictorico: Modelo en barras (barras crecientes 2,5,8,11)
 * Abstracto: 3 preguntas progresivas sobre prediccion de terminos
 */
export const tareaSecuencia09b: TareaCPA = {
  secuencia_ref: 9,
  concepto_clave: 'Predecir terminos de una sucesion aritmetica',
  contexto: {
    personaje: 'Miguel',
    objetos: { a: { nombre: 'figura', emoji: '🔷' }, b: { nombre: 'sucesion', emoji: '📈' } },
    valores_clave: { patron: [2, 5, 8], siguiente: 11 },
    tipo: 'patron',
    narrativa: 'Miguel encontro otra sucesion y quiere predecir terminos futuros sin construirlos todos.',
    pregunta_central: '¿Cual es el termino 10 de la sucesion 2, 5, 8, 11...?',
    transiciones: {
      concreto: 'Construye el siguiente termino del patron para verificar la regla.',
      bridge_pictorico: 'La sucesion aumenta de 3 en 3. El siguiente termino es 11.',
      pictorico: 'Observa el crecimiento constante en el modelo.',
      bridge_abstracto: 'Con la regla general puedes predecir cualquier termino.',
      abstracto: 'Ahora calcula terminos lejanos usando la formula.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'patron_figuras',
      tipo_pieza: 'circulo',
      terminos: [2, 5, 8],
      termino_objetivo: 11,
      pregunta:
        'El patron usa circulos: termino 1 tiene 2, termino 2 tiene 5, termino 3 tiene 8. Construye el termino 4.',
      pista: 'La diferencia entre cada termino es 3 (de 2 a 5 son +3, de 5 a 8 son +3). El termino 4 es 8 + 3.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Termino 1', valor: 2, color: 'amarillo' },
        { label: 'Termino 2', valor: 5, color: 'azul' },
        { label: 'Termino 3', valor: 8, color: 'verde' },
        { label: 'Termino 4', valor: 11, color: 'morado' },
      ],
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun las barras, cuantos circulos mas tiene cada termino respecto al anterior?',
        tipo: 'opcion_multiple',
        opciones: ['A) 2', 'B) 3', 'C) 4', 'D) 5'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Construiste el termino 4 con 11 circulos. Cuantos circulos tendra el termino 6? Muestra los pasos.',
        tipo: 'calculo',
        respuesta:
          'La diferencia constante es 3.\nTermino 4 = 11.\nTermino 5 = 11 + 3 = 14.\nTermino 6 = 14 + 3 = 17.\nEl termino 6 tendra 17 circulos.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En la sucesion 2, 5, 8, 11, ..., cuantos circulos tendra el termino 5?',
        opciones: ['A) 13', 'B) 14', 'C) 15', 'D) 16'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Ana ahorra dinero cada semana. La semana 1 ahorra $20, la semana 2 ahorra $35, la semana 3 ahorra $50. Cuanto ahorrara la semana 5? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Diferencia constante = $35 - $20 = $15 por semana.\nPaso 2: Semana 4 = $50 + $15 = $65.\nPaso 3: Semana 5 = $65 + $15 = $80.\nRespuesta: Ana ahorrara $80 en la semana 5.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'La sucesion de circulos es 2, 5, 8, 11... Si quieres saber el termino 10, puedes sumar la diferencia 9 veces desde el inicio: 2 + 3 + 3 + 3... Calcula el termino 10 y explica tu metodo.',
        respuesta:
          'La diferencia constante es 3. Desde el termino 1 (que es 2), sumo 3 nueve veces: 2 + 9×3 = 2 + 27 = 29. El termino 10 es 29.',
        criterios_aceptacion: [
          'diferencia = 3',
          'sumar 3 nueve veces',
          'resultado 29',
          'partir del primer termino',
        ],
      },
    ],
  },
}
