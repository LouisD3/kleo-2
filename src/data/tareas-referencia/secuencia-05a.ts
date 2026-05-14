import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 5a: Suma y resta
 * Concepto clave: Descomponer un numero en centenas, decenas y unidades
 *
 * Concreto: BloquesBase10 (representar 235 con cubitos, barras y cuadrados)
 * Pictorico: Modelo en barras (200 + 30 + 5 = 235)
 * Abstracto: 3 preguntas con progresion de dificultad sobre descomposicion
 */
export const tareaSecuencia05a: TareaCPA = {
  secuencia_ref: 5,
  contexto: {
    personaje: 'Diego',
    objetos: { a: { nombre: 'bloque', emoji: '🧱' }, b: { nombre: 'numero', emoji: '🔢' } },
    valores_clave: { objetivo: 235 },
    tipo: 'numero',
    narrativa: 'Diego usa bloques de base 10 para entender como se descompone un numero en centenas, decenas y unidades.',
    pregunta_central: '¿Como se descompone 235 en bloques de base 10?',
    transiciones: {
      concreto: 'Usa los bloques para representar 235: cuadrados de 100, barras de 10 y unidades.',
      bridge_pictorico: '235 = 2 centenas + 3 decenas + 5 unidades.',
      pictorico: 'Observa la descomposicion en el modelo de barras.',
      bridge_abstracto: 'Cada posicion tiene un valor: centenas, decenas, unidades.',
      abstracto: 'Ahora descompone otros numeros.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'bloques_base10',
      numero_objetivo: 235,
      unidades_disponibles: { unidades: 15, barras: 10, cuadrados: 5 },
      soluciones_validas: [{ unidades: 5, barras: 3, cuadrados: 2 }],
      pregunta:
        'Representa el numero 235 usando bloques de base 10. Recuerda: cada cuadrado vale 100, cada barra vale 10 y cada cubito vale 1.',
      pista:
        'Piensa cuantos grupos de 100 caben en 235. Despues, cuantos grupos de 10 caben en lo que sobra.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Centenas', valor: 200, color: 'azul', subdivisiones: 2 },
        { label: 'Decenas', valor: 30, color: 'verde', subdivisiones: 3 },
        { label: 'Unidades', valor: 5, color: 'amarillo', subdivisiones: 5 },
      ],
      total: { valor: 235, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun el modelo de barras, cuantas centenas, decenas y unidades forman el numero 235?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) 2 centenas, 3 decenas, 5 unidades',
          'B) 2 centenas, 5 decenas, 3 unidades',
          'C) 5 centenas, 3 decenas, 2 unidades',
          'D) 23 decenas, 5 unidades',
        ],
        respuesta: 'A',
      },
      {
        pregunta:
          'Observa el modelo. Si quitamos la barra de las centenas, que numero nos queda? Escribe la operacion.',
        tipo: 'calculo',
        respuesta:
          'Si quitamos las 2 centenas (200), nos quedan las decenas y unidades: 30 + 5 = 35. La operacion es 235 - 200 = 35.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Cuantas decenas tiene el numero 235?',
        opciones: ['A) 2', 'B) 3', 'C) 5', 'D) 23'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Descompon el numero 478 en centenas, decenas y unidades. Escribe la suma que lo demuestra.',
        respuesta:
          'Paso 1: 478 tiene 4 centenas, 7 decenas y 8 unidades.\nPaso 2: 400 + 70 + 8 = 478.\nRespuesta: 478 = 400 + 70 + 8.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que nuestro sistema numerico se llama "base 10". Usa un ejemplo con un numero de tres cifras.',
        respuesta:
          'Se llama base 10 porque cada posicion vale 10 veces mas que la anterior: unidades (1), decenas (10), centenas (100). En 235, el 2 vale 200, el 3 vale 30 y el 5 vale 5.',
        criterios_aceptacion: [
          'cada posicion vale 10 veces mas',
          'unidades, decenas, centenas',
          'ejemplo con numero de tres cifras',
          'descomposicion correcta',
        ],
      },
    ],
  },
}
