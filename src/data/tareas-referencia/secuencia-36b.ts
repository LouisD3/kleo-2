import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 36b: Binario a decimal
 * Concepto clave: Convertir un numero binario a decimal sumando las potencias de 2 activas
 *
 * Concreto: InterruptoresBinarios (5 bits, representar 22 = 10110)
 * Pictorico: Tabla de posiciones con potencias de 2
 * Abstracto: 3 preguntas progresivas sobre conversion binario a decimal
 *
 * NOTA MATH: 22 = 16+4+2 = 10110 en binario (5 bits). Verificado:
 *   bit4=1(16) + bit3=0(0) + bit2=1(4) + bit1=1(2) + bit0=0(0) = 22 ✓
 */
export const tareaSecuencia36b: TareaCPA = {
  secuencia_ref: 36,
  contexto: {
    personaje: 'Tomas',
    objetos: {
      a: { nombre: 'numero binario', emoji: '💻' },
      b: { nombre: 'decimal', emoji: '🔢' },
    },
    valores_clave: { bits: 5, objetivo: 22 },
    tipo: 'numero',
    narrativa:
      'Tomas ya sabe convertir de decimal a binario. Ahora quiere hacer lo contrario: partiendo del binario 10110, descubrir que numero decimal es.',
    pregunta_central: '¿Cuanto vale el numero binario 10110 en decimal?',
    transiciones: {
      concreto: 'Enciende los interruptores para representar el numero 22.',
      bridge_pictorico: '22 = 16+4+2. En binario: 10110 (bits 4, 2 y 1 encendidos).',
      pictorico: 'Observa la tabla de posiciones y suma los valores activos.',
      bridge_abstracto: 'Para convertir binario a decimal, suma las potencias de 2 donde hay un 1.',
      abstracto: 'Ahora convierte numeros binarios a decimal.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'interruptores_binarios',
      num_bits: 5,
      valor_objetivo: 22,
      pregunta:
        'El numero binario 10110 tiene 5 bits. Enciende los interruptores correctos para que la suma de las posiciones de 22.',
      pista:
        '10110 significa: posicion 16 encendida, 8 apagada, 4 encendida, 2 encendida, 1 apagada. Suma: 16+4+2 = 22.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'posicion', header: 'Posicion' },
        { key: 'potencia', header: 'Potencia de 2' },
        { key: 'valor', header: 'Valor' },
        { key: 'bit', header: 'Bit' },
        { key: 'aporte', header: 'Aporte al total' },
      ],
      filas: [
        { posicion: '4 (izquierda)', potencia: '2⁴', valor: 16, bit: '1', aporte: 16 },
        { posicion: '3', potencia: '2³', valor: 8, bit: '0', aporte: 0 },
        { posicion: '2', potencia: '2²', valor: 4, bit: '1', aporte: 4 },
        { posicion: '1', potencia: '2¹', valor: 2, bit: '1', aporte: 2 },
        { posicion: '0 (derecha)', potencia: '2⁰', valor: 1, bit: '0', aporte: 0 },
      ],
      resaltados: [
        { fila: 0, columna: 'aporte', color: '#10B981' },
        { fila: 2, columna: 'aporte', color: '#10B981' },
        { fila: 3, columna: 'aporte', color: '#10B981' },
      ],
      titulo: '10110 en binario = 16 + 4 + 2 = 22 en decimal',
    },
    preguntas: [
      {
        pregunta:
          'La tabla muestra que solo los bits con valor 1 aportan al total. ¿Cuales posiciones estan encendidas en 10110?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Posiciones 4, 3 y 2',
          'B) Posiciones 4, 2 y 1',
          'C) Posiciones 3, 2 y 1',
          'D) Posiciones 4, 2 y 0',
        ],
        respuesta: 'B',
      },
      {
        pregunta: 'Usando la tabla, verifica que 10110 = 22. Muestra la suma de los aportes.',
        tipo: 'calculo',
        respuesta:
          'Bit 4: 1 x 16 = 16\nBit 3: 0 x 8 = 0\nBit 2: 1 x 4 = 4\nBit 1: 1 x 2 = 2\nBit 0: 0 x 1 = 0\nTotal: 16 + 0 + 4 + 2 + 0 = 22.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Cual es el valor decimal del numero binario 1011?',
        opciones: ['A) 9', 'B) 10', 'C) 11', 'D) 13'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Convierte el numero binario 110100 a decimal. Muestra el valor de cada posicion.',
        respuesta:
          'Posicion 5: 1 x 32 = 32\nPosicion 4: 1 x 16 = 16\nPosicion 3: 0 x 8 = 0\nPosicion 2: 1 x 4 = 4\nPosicion 1: 0 x 2 = 0\nPosicion 0: 0 x 1 = 0\nTotal: 32 + 16 + 0 + 4 + 0 + 0 = 52.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras como convertir cualquier numero binario a decimal. Usa el ejemplo de 10110 para explicar el metodo.',
        respuesta:
          'Se escribe cada bit debajo de su potencia de 2, empezando por la derecha con 1, 2, 4, 8, 16... Donde hay un 1 se suma ese valor, donde hay un 0 no. Para 10110: 16+4+2 = 22.',
        criterios_aceptacion: [
          'potencias de 2 de derecha a izquierda',
          'sumar donde hay 1',
          'no sumar donde hay 0',
          'ejemplo correcto 10110 = 22',
        ],
      },
    ],
  },
}
