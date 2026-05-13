import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 5b: Suma y resta
 * Concepto clave: Sumar dos numeros con reagrupacion
 *
 * Concreto: BloquesBase10 (representar 148 + 87 = 235 con bloques)
 * Pictorico: Modelo en barras (148 + 87 = 235)
 * Abstracto: 3 preguntas con progresion de dificultad sobre suma con reagrupacion
 */
export const tareaSecuencia05b: TareaCPA = {
  secuencia_ref: 5,
  contexto: {
    personaje: 'Diego',
    objetos: { a: { nombre: 'bloque', emoji: '🧱' }, b: { nombre: 'suma', emoji: '➕' } },
    valores_clave: { objetivo: 368 },
    tipo: 'numero',
    narrativa: 'Diego quiere sumar 185 + 183 usando bloques de base 10 y aprender cuando hay que reagrupar.',
    pregunta_central: '¿Cuanto es 185 + 183?',
    transiciones: {
      concreto: 'Junta los bloques de ambos numeros y reagrupa cuando tengas 10 o mas.',
      bridge_pictorico: 'Al reagrupar, obtuviste 368.',
      pictorico: 'Observa como se ve la suma en el modelo.',
      bridge_abstracto: 'La reagrupacion es cuando 10 unidades se convierten en 1 decena.',
      abstracto: 'Ahora suma otros numeros con reagrupacion.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'bloques_base10',
      numero_objetivo: 235,
      unidades_disponibles: { unidades: 20, barras: 15, cuadrados: 5 },
      soluciones_validas: [{ unidades: 5, barras: 3, cuadrados: 2 }],
      pregunta:
        'Una tienda tiene 148 articulos en la seccion A y 87 en la seccion B. Representa el total usando bloques de base 10.',
      pista:
        'Primero suma las unidades: 8 + 7 = 15. Como 15 es mayor que 10, reagrupa 10 unidades en 1 barra.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Seccion A', valor: 148, color: 'azul', subdivisiones: 1 },
        { label: 'Seccion B', valor: 87, color: 'verde', subdivisiones: 1 },
      ],
      total: { valor: 235, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun el modelo de barras, cual es el total de articulos entre las dos secciones?',
        tipo: 'opcion_multiple',
        opciones: ['A) 225', 'B) 235', 'C) 245', 'D) 135'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Observa el modelo. Si la seccion A tuviera 10 articulos mas y la seccion B 10 menos, cambiaria el total? Explica con la operacion.',
        tipo: 'calculo',
        respuesta:
          'Si la seccion A tiene 158 y la seccion B tiene 77: 158 + 77 = 235. El total no cambia porque sumamos 10 a un lado y restamos 10 al otro. La operacion es (148 + 10) + (87 - 10) = 158 + 77 = 235.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Cuanto es 148 + 87?',
        opciones: ['A) 225', 'B) 235', 'C) 245', 'D) 215'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un almacen recibe dos pedidos: uno de 156 cajas y otro de 279 cajas. Cuantas cajas recibio en total? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Sumar unidades: 6 + 9 = 15. Escribo 5 y llevo 1.\nPaso 2: Sumar decenas: 5 + 7 + 1 = 13. Escribo 3 y llevo 1.\nPaso 3: Sumar centenas: 1 + 2 + 1 = 4.\nRespuesta: 156 + 279 = 435 cajas en total.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que pasa cuando las unidades de una suma dan mas de 10. Usa un ejemplo.',
        respuesta:
          'Cuando las unidades suman mas de 10 hacemos una reagrupacion o acarreo: convertimos 10 unidades en 1 decena. En 148 + 87, las unidades dan 15: escribimos 5 y llevamos 1 decena.',
        criterios_aceptacion: [
          'reagrupacion o acarreo',
          '10 unidades = 1 decena',
          'escribir el residuo y llevar el acarreo',
          'ejemplo con numeros correctos',
        ],
      },
    ],
  },
}
