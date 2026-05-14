import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 12c: Ecuaciones lineales
 * Concepto clave: Resolver ecuaciones de la forma ax + b = c
 *
 * Concreto: Balanza (2x + 1 = 7, solucion x = 3)
 * Pictorico: Modelo en barras (2x + 1 = 7)
 * Abstracto: 3 preguntas con progresion de dificultad sobre ecuaciones de dos operaciones
 */
export const tareaSecuencia12c: TareaCPA = {
  secuencia_ref: 12,
  contexto: {
    personaje: 'Valentina',
    objetos: { a: { nombre: 'pesa', emoji: '⚖️' }, b: { nombre: 'incognita', emoji: '❓' } },
    valores_clave: { ecuacion: '2x + 1 = 7', solucion: 3 },
    tipo: 'ecuacion',
    narrativa: 'Valentina enfrenta una ecuacion mas compleja: 2 bolsas iguales mas 1 pesa suelta equilibran 7 pesas.',
    pregunta_central: '¿Cuanto pesa cada bolsa si 2x + 1 = 7?',
    transiciones: {
      concreto: 'Primero quita 1 pesa de cada lado, luego divide entre 2.',
      bridge_pictorico: '2x + 1 = 7 → 2x = 6 → x = 3.',
      pictorico: 'Observa los dos pasos en el modelo.',
      bridge_abstracto: 'Resolver en dos pasos: restar constante, luego dividir.',
      abstracto: 'Ahora resuelve ecuaciones de dos pasos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'balanza',
      lado_izquierdo: [
        { tipo: 'x', valor: 2 },
        { tipo: 'constante', valor: 1 },
      ],
      lado_derecho: [{ tipo: 'constante', valor: 7 }],
      solucion: 3,
      pregunta:
        'En la balanza hay 2 cajas iguales y 1 pesa de un lado, y 7 pesas del otro. Cuanto pesa cada caja para que la balanza quede equilibrada?',
      pista: 'Primero quita 1 pesa de cada lado. Luego divide lo que queda entre 2.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Caja 1', valor: 3, color: 'amarillo', subdivisiones: 3 },
        { label: 'Caja 2', valor: 3, color: 'amarillo', subdivisiones: 3 },
        { label: 'Pesa', valor: 1, color: 'azul', subdivisiones: 1 },
      ],
      total: { valor: 7, visible: true },
      incognita: { posicion: 'barra', label: 'x = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo muestra 2 barras iguales y 1 barra de valor 1 que juntas suman 7. Cuanto vale cada barra grande?',
        tipo: 'opcion_multiple',
        opciones: ['A) 2', 'B) 3', 'C) 4', 'D) 6'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Explica paso a paso como encontraste el valor de cada caja usando el modelo de barras.',
        tipo: 'calculo',
        respuesta:
          'Paso 1: El total es 7 y la pesa vale 1, entonces las 2 cajas juntas valen 7 - 1 = 6.\nPaso 2: Como hay 2 cajas iguales, cada una vale 6 / 2 = 3.\nRespuesta: Cada caja vale 3.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Si 2x + 3 = 11, cual es el valor de x?',
        opciones: ['A) 3', 'B) 4', 'C) 5', 'D) 7'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Pedro compra 3 cuadernos iguales y una pluma de $5. En total paga $20. Plantea la ecuacion y calcula cuanto cuesta cada cuaderno. Muestra el procedimiento.',
        respuesta:
          'Paso 1: Planteamos la ecuacion: 3x + 5 = 20.\nPaso 2: Restamos 5 de ambos lados: 3x = 20 - 5 = 15.\nPaso 3: Dividimos ambos lados entre 3: x = 15 / 3 = 5.\nRespuesta: Cada cuaderno cuesta $5.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras los pasos para resolver una ecuacion que tiene dos operaciones, como 2x + 3 = 11.',
        respuesta:
          'Primero se quita lo que esta sumado: 2x + 3 - 3 = 11 - 3, queda 2x = 8. Luego se divide para quitar la multiplicacion: x = 8 / 2 = 4. Siempre se opera igual en ambos lados.',
        criterios_aceptacion: [
          'dos pasos en orden correcto',
          'restar primero',
          'dividir despues',
          'operar en ambos lados',
          'resultado x=4',
        ],
      },
    ],
  },
}
