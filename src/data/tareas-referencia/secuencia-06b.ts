import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 6b: Multiplicacion de enteros
 * Concepto clave: Regla de signos (+)(+)=+, (+)(-)=-, (-)(+)=-, (-)(-)=+
 *
 * Concreto: FichasPositivasNegativas (6 positivas = (+2)(+3), 3 grupos de 2)
 * Pictorico: Tabla de reglas de signos para la multiplicacion
 * Abstracto: 3 preguntas progresivas sobre multiplicacion de enteros
 */
export const tareaSecuencia06b: TareaCPA = {
  secuencia_ref: 6,
  concepto_clave: 'Regla de signos (+)(+)=+, (+)(-)=-, (-)(+)=-, (-)(-)=+',
  contexto: {
    personaje: 'Carlos',
    objetos: { a: { nombre: 'ficha', emoji: '🟢' }, b: { nombre: 'producto', emoji: '✖️' } },
    valores_clave: { resultado: 6 },
    tipo: 'numero',
    narrativa:
      'Carlos descubre como multiplicar numeros con signo. Primero prueba (+2) x (+3) con fichas y obtiene 6 fichas positivas.',
    pregunta_central: '¿Que pasa con el signo al multiplicar dos numeros negativos?',
    transiciones: {
      concreto: 'Usa las fichas para representar el resultado de (+2) x (+3).',
      bridge_pictorico: '(+2) x (+3) = +6. Tres grupos de dos fichas positivas.',
      pictorico: 'Observa la regla de signos en la tabla.',
      bridge_abstracto: 'Positivo por positivo = positivo. Negativo por negativo = positivo.',
      abstracto: 'Ahora aplica la regla de signos a diferentes multiplicaciones.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'fichas_positivas_negativas',
      positivas: 6,
      negativas: 0,
      resultado_objetivo: 6,
      pregunta:
        'Carlos calcula (+2) x (+3). Eso significa 3 grupos de 2 fichas positivas. Verifica que el resultado es +6 usando las fichas.',
      pista:
        'Multiplicar (+2) x (+3) es hacer 3 grupos de 2 fichas positivas: 2 + 2 + 2 = 6 fichas positivas.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'operacion', header: 'Operacion' },
        { key: 'signo_a', header: 'Signo A' },
        { key: 'signo_b', header: 'Signo B' },
        { key: 'signo_resultado', header: 'Signo del resultado' },
        { key: 'ejemplo', header: 'Ejemplo' },
      ],
      filas: [
        {
          operacion: '(+) x (+)',
          signo_a: '+',
          signo_b: '+',
          signo_resultado: '+',
          ejemplo: '(+2)(+3) = +6',
        },
        {
          operacion: '(+) x (-)',
          signo_a: '+',
          signo_b: '-',
          signo_resultado: '-',
          ejemplo: '(+2)(-3) = -6',
        },
        {
          operacion: '(-) x (+)',
          signo_a: '-',
          signo_b: '+',
          signo_resultado: '-',
          ejemplo: '(-2)(+3) = -6',
        },
        {
          operacion: '(-) x (-)',
          signo_a: '-',
          signo_b: '-',
          signo_resultado: '+',
          ejemplo: '(-2)(-3) = +6',
        },
      ],
      resaltados: [
        { fila: 0, columna: 'signo_resultado', color: '#10B981' },
        { fila: 1, columna: 'signo_resultado', color: '#EF4444' },
        { fila: 2, columna: 'signo_resultado', color: '#EF4444' },
        { fila: 3, columna: 'signo_resultado', color: '#10B981' },
      ],
      titulo: 'Regla de signos para la multiplicacion',
    },
    preguntas: [
      {
        pregunta:
          'Observa la tabla. Cuando los dos signos son IGUALES (ambos + o ambos -), ¿el resultado es positivo o negativo?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Siempre positivo',
          'B) Siempre negativo',
          'C) Depende de los numeros',
          'D) Siempre cero',
        ],
        respuesta: 'A',
      },
      {
        pregunta:
          'Calcula (-4) x (-5) usando la regla de signos de la tabla. Muestra el procedimiento.',
        tipo: 'calculo',
        respuesta:
          'Paso 1: Signos iguales (ambos negativos), el resultado es positivo.\nPaso 2: 4 x 5 = 20.\nRespuesta: (-4) x (-5) = +20.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Cual es el resultado de (-7) x (+3)?',
        opciones: ['A) +21', 'B) -21', 'C) +10', 'D) -10'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un submarino baja 8 metros por minuto. Usa la multiplicacion de enteros para calcular su posicion despues de 5 minutos. Muestra el procedimiento.',
        respuesta:
          'Paso 1: Bajar = negativo, asi que la velocidad es -8 metros por minuto.\nPaso 2: Posicion = (-8) x (+5) = -40 metros.\nPaso 3: Signos diferentes (- y +), resultado negativo.\nRespuesta: El submarino esta a -40 metros (40 metros bajo la superficie).',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que negativo por negativo da positivo. Usa un ejemplo de la vida cotidiana.',
        respuesta:
          'Si deber dinero es negativo y quitar una deuda es negativo, entonces quitar una deuda (-) es como ganar (+). Por ejemplo, si te quitan (-) 3 deudas de $5 (-): (-3)(-5) = +15.',
        criterios_aceptacion: [
          'negativo por negativo = positivo',
          'ejemplo cotidiano',
          'quitar algo negativo = positivo',
          'regla de signos iguales',
        ],
      },
    ],
  },
}
