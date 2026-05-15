import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 21b: Cuadrilateros
 * Concepto clave: Diferenciar trapecio, rombo, paralelogramo, cuadrado, rectangulo
 *
 * Concreto: Geoplano 5x5 (trazar un trapecio isosceles)
 * Pictorico: Tabla comparativa de 4 cuadrilateros y sus propiedades
 * Abstracto: 3 preguntas progresivas sobre clasificacion de cuadrilateros
 */
export const tareaSecuencia21b: TareaCPA = {
  secuencia_ref: 21,
  concepto_clave: 'Diferenciar trapecio, rombo, paralelogramo, cuadrado, rectangulo',
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'trapecio', emoji: '🔷' }, b: { nombre: 'propiedad', emoji: '📋' } },
    valores_clave: { lados: 4 },
    tipo: 'geometria',
    narrativa:
      'Roberto observa diferentes figuras de 4 lados en su escuela: mesas, ventanas, senales de transito. Quiere aprender a clasificarlas.',
    pregunta_central: '¿Que diferencia a un trapecio de un paralelogramo?',
    transiciones: {
      concreto: 'Traza un trapecio en el geoplano y observa sus lados.',
      bridge_pictorico:
        'El trapecio tiene solo un par de lados paralelos, a diferencia del paralelogramo.',
      pictorico: 'Compara las propiedades de 4 cuadrilateros en la tabla.',
      bridge_abstracto:
        'Cada cuadrilatero se define por sus lados paralelos, lados iguales y angulos.',
      abstracto: 'Ahora clasifica cuadrilateros por sus propiedades.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [4, 0],
        [4, 4],
        [2, 3],
        [2, 1],
      ],
      pregunta:
        'Traza la figura en el geoplano conectando los puntos para formar un trapecio. Observa: ¿cuantos pares de lados paralelos tiene?',
      pista:
        'Un trapecio tiene exactamente un par de lados paralelos. La base inferior es mas larga que la superior.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'figura', header: 'Cuadrilatero' },
        { key: 'pares_paralelos', header: 'Pares paralelos' },
        { key: 'lados_iguales', header: 'Lados iguales' },
        { key: 'angulos_rectos', header: 'Angulos de 90°' },
      ],
      filas: [
        {
          figura: 'Trapecio',
          pares_paralelos: 1,
          lados_iguales: 'No necesariamente',
          angulos_rectos: 'No necesariamente',
        },
        {
          figura: 'Paralelogramo',
          pares_paralelos: 2,
          lados_iguales: 'Opuestos iguales',
          angulos_rectos: 'No necesariamente',
        },
        {
          figura: 'Rectangulo',
          pares_paralelos: 2,
          lados_iguales: 'Opuestos iguales',
          angulos_rectos: 'Si (4 de 90°)',
        },
        {
          figura: 'Rombo',
          pares_paralelos: 2,
          lados_iguales: 'Todos iguales',
          angulos_rectos: 'No necesariamente',
        },
        {
          figura: 'Cuadrado',
          pares_paralelos: 2,
          lados_iguales: 'Todos iguales',
          angulos_rectos: 'Si (4 de 90°)',
        },
      ],
      resaltados: [
        { fila: 0, columna: 'pares_paralelos', color: '#F59E0B' },
        { fila: 1, columna: 'pares_paralelos', color: '#3B82F6' },
        { fila: 2, columna: 'angulos_rectos', color: '#10B981' },
        { fila: 3, columna: 'lados_iguales', color: '#8B5CF6' },
        { fila: 4, columna: 'lados_iguales', color: '#EC4899' },
      ],
      titulo: 'Comparacion de cuadrilateros por propiedades',
    },
    preguntas: [
      {
        pregunta:
          'Segun la tabla, ¿cual es la diferencia principal entre un trapecio y un paralelogramo?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) El trapecio tiene 4 angulos rectos',
          'B) El trapecio tiene 1 par de lados paralelos, el paralelogramo tiene 2',
          'C) El paralelogramo tiene todos los lados iguales',
          'D) No hay diferencia',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Observa la tabla. ¿Que tiene de especial el cuadrado comparado con los demas cuadrilateros?',
        tipo: 'abierta',
        respuesta:
          'El cuadrado es el unico que cumple todas las propiedades: tiene 2 pares de lados paralelos, todos sus lados son iguales y tiene 4 angulos de 90°. Es a la vez rectangulo y rombo.',
        criterios_aceptacion: [
          'todos los lados iguales',
          '4 angulos de 90°',
          '2 pares de lados paralelos',
          'es rectangulo y rombo',
        ],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Cual de estos cuadrilateros tiene exactamente un par de lados paralelos?',
        opciones: ['A) Cuadrado', 'B) Rombo', 'C) Trapecio', 'D) Rectangulo'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un trapecio tiene bases de 10 cm y 6 cm, y su altura es 4 cm. Calcula su area usando la formula: A = (base mayor + base menor) x altura / 2.',
        respuesta:
          'Paso 1: Base mayor = 10 cm, base menor = 6 cm, altura = 4 cm.\nPaso 2: A = (10 + 6) x 4 / 2 = 16 x 4 / 2 = 64 / 2 = 32 cm².\nRespuesta: El area del trapecio es 32 cm².',
      },
      {
        tipo: 'abierta',
        pregunta:
          '¿Todo rectangulo es un paralelogramo? ¿Todo paralelogramo es un rectangulo? Explica por que.',
        respuesta:
          'Todo rectangulo es un paralelogramo porque tiene 2 pares de lados paralelos. Pero no todo paralelogramo es rectangulo, porque un paralelogramo puede tener angulos que no son de 90°.',
        criterios_aceptacion: [
          'todo rectangulo es paralelogramo',
          'no todo paralelogramo es rectangulo',
          'angulos de 90° necesarios para rectangulo',
          '2 pares de lados paralelos en comun',
        ],
      },
    ],
  },
}
