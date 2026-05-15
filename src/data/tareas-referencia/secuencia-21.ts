import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 21: Tipos de triángulos y cuadriláteros
 * Concepto clave: Clasificar triángulos y cuadriláteros por sus propiedades
 *
 * Concreto: Geoplano (paralelogramo para explorar propiedades)
 * Pictorico: Tabla comparativa de propiedades de cuadrilateros
 * Abstracto: 3 preguntas con progresión de dificultad sobre clasificación de figuras
 */
export const tareaSecuencia21: TareaCPA = {
  secuencia_ref: 21,
  concepto_clave: 'Clasificar triángulos y cuadriláteros por sus propiedades',
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'figura', emoji: '🔷' }, b: { nombre: 'propiedad', emoji: '📋' } },
    valores_clave: { lados: 4 },
    tipo: 'geometria',
    narrativa: 'Roberto clasifica figuras geometricas segun sus propiedades: lados paralelos, lados iguales y angulos rectos.',
    pregunta_central: '¿Que propiedades tiene un paralelogramo?',
    transiciones: {
      concreto: 'Traza un paralelogramo en el geoplano y observa sus lados.',
      bridge_pictorico: 'Los lados opuestos son paralelos e iguales entre si.',
      pictorico: 'Compara las propiedades de diferentes cuadrilateros en la tabla.',
      bridge_abstracto: 'El paralelogramo incluye al rectangulo, rombo y cuadrado.',
      abstracto: 'Ahora clasifica figuras por sus propiedades.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 0],
        [0, 3],
        [2, 4],
        [2, 1],
      ],
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar un paralelogramo. Observa sus lados: ¿cuáles son paralelos entre sí?',
      pista: 'Un paralelogramo tiene dos pares de lados paralelos. Los lados opuestos tienen la misma longitud y la misma dirección.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'figura', header: 'Figura' },
        { key: 'lados_paralelos', header: 'Pares de lados paralelos' },
        { key: 'lados_iguales', header: 'Lados iguales' },
        { key: 'angulos_rectos', header: 'Angulos rectos' },
      ],
      filas: [
        { figura: 'Paralelogramo', lados_paralelos: 2, lados_iguales: 'Opuestos iguales', angulos_rectos: 'No necesariamente' },
        { figura: 'Rectangulo', lados_paralelos: 2, lados_iguales: 'Opuestos iguales', angulos_rectos: 'Si (4 de 90°)' },
        { figura: 'Rombo', lados_paralelos: 2, lados_iguales: 'Todos iguales', angulos_rectos: 'No necesariamente' },
        { figura: 'Trapecio', lados_paralelos: 1, lados_iguales: 'No necesariamente', angulos_rectos: 'No necesariamente' },
      ],
      resaltados: [
        { fila: 0, columna: 'lados_paralelos', color: '#3B82F6' },
        { fila: 1, columna: 'angulos_rectos', color: '#10B981' },
        { fila: 2, columna: 'lados_iguales', color: '#8B5CF6' },
      ],
      titulo: 'Propiedades de cuadrilateros',
    },
    preguntas: [
      {
        pregunta:
          'La tabla muestra las propiedades de varios cuadrilateros. ¿Que observas sobre los lados opuestos del paralelogramo?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Todos miden igual',
          'B) Los lados opuestos son iguales',
          'C) Solo dos lados son iguales',
          'D) Ninguno mide igual',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Compara el paralelogramo con un rectángulo. ¿En qué se parecen y en qué se diferencian?',
        tipo: 'abierta',
        respuesta:
          'Semejanzas: ambos tienen dos pares de lados paralelos y los lados opuestos son iguales. Diferencias: en el rectángulo todos los ángulos son de 90°, mientras que en el paralelogramo los ángulos no son necesariamente rectos. El rectángulo es un caso particular de paralelogramo donde todos los ángulos son rectos.',
        criterios_aceptacion: ['2 pares de lados paralelos en comun', 'rectangulo tiene angulos de 90°', 'paralelogramo no necesariamente 90°', 'rectangulo es caso particular'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          '¿Cuál de las siguientes figuras tiene exactamente un par de lados paralelos?',
        opciones: ['A) Paralelogramo', 'B) Trapecio', 'C) Rombo', 'D) Rectángulo'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un triángulo tiene ángulos que miden 60°, 60° y 60°. Clasifícalo según sus lados y según sus ángulos. Justifica tu respuesta.',
        respuesta:
          'Paso 1: Según sus ángulos, es un triángulo acutángulo porque todos sus ángulos son menores de 90°. Además, como los tres ángulos son iguales, es equiángulo.\nPaso 2: Según sus lados, es un triángulo equilátero porque si los tres ángulos son iguales, entonces los tres lados también miden lo mismo.\nRespuesta: Es un triángulo equilátero y acutángulo (equiángulo).',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica la relación entre un cuadrado, un rectángulo, un rombo y un paralelogramo. ¿Cuál incluye a los demás y por qué?',
        respuesta:
          'El paralelogramo es la figura más general (dos pares de lados paralelos) e incluye a las demás. El rectángulo es un paralelogramo con ángulos de 90°, el rombo tiene todos los lados iguales, y el cuadrado cumple ambas condiciones a la vez.',
        criterios_aceptacion: [
          'paralelogramo incluye a los demás',
          'ángulos de 90° en el rectángulo',
          'lados iguales en el rombo',
          'cuadrado es rectángulo y rombo',
          'jerarquía de figuras',
        ],
      },
    ],
  },
}
