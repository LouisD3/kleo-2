import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 21: Tipos de triángulos y cuadriláteros
 * Concepto clave: Clasificar triángulos y cuadriláteros por sus propiedades
 *
 * Concreto: Geoplano (paralelogramo para explorar propiedades)
 * Pictorico: Modelo en barras comparando lados del paralelogramo
 * Abstracto: 3 preguntas con progresión de dificultad sobre clasificación de figuras
 */
export const tareaSecuencia21: TareaCPA = {
  secuencia_ref: 21,
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
    modelo_barras: {
      barras: [
        { label: 'Lado a', valor: 3, color: 'azul' },
        { label: 'Lado b', valor: 2, color: 'verde' },
        { label: 'Lado a', valor: 3, color: 'azul' },
        { label: 'Lado b', valor: 2, color: 'verde' },
      ],
      total: { valor: 10, visible: true },
      incognita: { posicion: 'total', label: 'Perímetro = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo de barras muestra los cuatro lados de un paralelogramo. ¿Qué observas sobre los lados opuestos?',
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
        tipo: 'calculo',
        respuesta:
          'Semejanzas: ambos tienen dos pares de lados paralelos y los lados opuestos son iguales. Diferencias: en el rectángulo todos los ángulos son de 90°, mientras que en el paralelogramo los ángulos no son necesariamente rectos. El rectángulo es un caso particular de paralelogramo donde todos los ángulos son rectos.',
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
          'El paralelogramo es la figura más general: solo requiere dos pares de lados paralelos. El rectángulo es un paralelogramo con todos los ángulos de 90°. El rombo es un paralelogramo con todos los lados iguales. El cuadrado cumple las condiciones del rectángulo y del rombo a la vez: tiene todos los ángulos de 90° y todos los lados iguales. Entonces el paralelogramo incluye a todos los demás. El cuadrado es a la vez un rectángulo y un rombo. Es como una jerarquía: paralelogramo es la familia, rectángulo y rombo son subgrupos, y el cuadrado pertenece a ambos subgrupos.',
      },
    ],
  },
}
