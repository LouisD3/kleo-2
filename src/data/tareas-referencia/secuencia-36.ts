import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 36: Numeros binarios
 * Concepto clave: Representar numeros en binario usando interruptores ON/OFF
 *
 * Concreto: InterruptoresBinarios (4 bits, representar 13 = 1101)
 * Pictorico: Modelo en barras (valor de cada bit encendido)
 * Abstracto: 3 preguntas progresivas sobre sistema binario
 */
export const tareaSecuencia36: TareaCPA = {
  secuencia_ref: 36,
  contexto: {
    personaje: 'Tomas',
    objetos: { a: { nombre: 'interruptor', emoji: '🔘' }, b: { nombre: 'numero binario', emoji: '💻' } },
    valores_clave: { bits: 4, objetivo: 13 },
    tipo: 'numero',
    narrativa: 'Tomas aprende que las computadoras usan solo 0 y 1. Cada interruptor encendido tiene un valor: 8, 4, 2, 1.',
    pregunta_central: '¿Como se representa 13 en binario?',
    transiciones: {
      concreto: 'Enciende los interruptores correctos para sumar 13 (8+4+0+1).',
      bridge_pictorico: '13 = 8+4+1 = 1101 en binario.',
      pictorico: 'Observa el valor de cada bit en el modelo.',
      bridge_abstracto: 'Cada posicion vale 2^n. De derecha a izquierda: 1, 2, 4, 8.',
      abstracto: 'Ahora convierte otros numeros a binario y viceversa.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'interruptores_binarios',
      num_bits: 4,
      valor_objetivo: 13,
      pregunta:
        'Cada interruptor representa una potencia de 2. Enciende los interruptores correctos para representar el numero 13 en binario.',
      pista: '13 = 8 + 4 + 1. Enciende los interruptores de 8, 4 y 1 (el de 2 queda apagado). En binario: 1101.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: '8 (encendido)', valor: 8, color: 'amarillo', subdivisiones: 8 },
        { label: '4 (encendido)', valor: 4, color: 'amarillo', subdivisiones: 4 },
        { label: '2 (apagado)', valor: 0, color: 'azul' },
        { label: '1 (encendido)', valor: 1, color: 'amarillo', subdivisiones: 1 },
      ],
      total: { valor: 13, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Los interruptores encendidos suman 8 + 4 + 1 = 13. Cual interruptor esta apagado?',
        tipo: 'opcion_multiple',
        opciones: ['A) El de 8', 'B) El de 4', 'C) El de 2', 'D) El de 1'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si enciendes TODOS los 4 interruptores (8, 4, 2, 1), cual seria el numero decimal? Muestra la suma.',
        tipo: 'calculo',
        respuesta: '8 + 4 + 2 + 1 = 15. Con todos los interruptores encendidos, el numero es 15. En binario: 1111.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Representaste 13 como 1101 en binario (interruptores: ON, ON, OFF, ON). Cual de estos es el numero 10 en binario?',
        opciones: ['A) 1000', 'B) 1010', 'C) 1100', 'D) 0110'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Convierte el numero binario 1011 a decimal. Muestra que valor tiene cada posicion.',
        respuesta:
          'Posicion 3: 1 x 8 = 8\nPosicion 2: 0 x 4 = 0\nPosicion 1: 1 x 2 = 2\nPosicion 0: 1 x 1 = 1\nTotal: 8 + 0 + 2 + 1 = 11. El numero binario 1011 es 11 en decimal.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que el sistema binario solo usa 0 y 1, mientras que el decimal usa del 0 al 9. Usa la idea de los interruptores.',
        respuesta:
          'El binario usa solo 0 y 1 porque cada posicion es como un interruptor: encendido (1) o apagado (0). El decimal usa 10 simbolos porque tiene base 10. Las computadoras usan binario porque sus circuitos solo tienen dos estados: con corriente o sin corriente.',
        criterios_aceptacion: [
          'interruptor encendido o apagado',
          'base 2 vs base 10',
          'computadoras usan binario',
          'dos estados posibles',
        ],
      },
    ],
  },
}
