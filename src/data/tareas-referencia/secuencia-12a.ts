import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 12a: Ecuaciones lineales
 * Concepto clave: Resolver ecuaciones de la forma x + a = b
 *
 * Concreto: Balanza (x + 3 = 7, solucion x = 4)
 * Pictorico: Modelo en barras (x + 3 = 7, incognita en primera barra)
 * Abstracto: 3 preguntas con progresion de dificultad sobre ecuaciones x + a = b
 */
export const tareaSecuencia12a: TareaCPA = {
  secuencia_ref: 12,
  concepto_clave: 'Resolver ecuaciones de la forma x + a = b',
  contexto: {
    personaje: 'Valentina',
    objetos: { a: { nombre: 'pesa', emoji: '⚖️' }, b: { nombre: 'incognita', emoji: '❓' } },
    valores_clave: { ecuacion: 'x + 3 = 7', solucion: 4 },
    tipo: 'ecuacion',
    narrativa: 'Valentina usa una balanza para resolver ecuaciones. Si ambos lados pesan igual, la balanza esta equilibrada.',
    pregunta_central: '¿Que valor de x equilibra x + 3 = 7?',
    transiciones: {
      concreto: 'Equilibra la balanza quitando pesas de ambos lados hasta aislar x.',
      bridge_pictorico: 'Al quitar 3 de cada lado: x = 4.',
      pictorico: 'Observa la ecuacion en el modelo de barras.',
      bridge_abstracto: 'Resolver es despejar la incognita haciendo lo mismo en ambos lados.',
      abstracto: 'Ahora resuelve otras ecuaciones.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'balanza',
      lado_izquierdo: [
        { tipo: 'x', valor: 1 },
        { tipo: 'constante', valor: 3 },
      ],
      lado_derecho: [{ tipo: 'constante', valor: 7 }],
      solucion: 4,
      pregunta:
        'En la balanza hay una caja desconocida y 3 pesas de un lado, y 7 pesas del otro. Cuanto pesa la caja para que la balanza quede equilibrada?',
      pista: 'Intenta quitar 3 pesas de cada lado. Cuantas quedan del lado derecho?',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'x', valor: 4, color: 'amarillo' },
        { label: '3', valor: 3, color: 'azul' },
      ],
      total: { valor: 7, visible: true },
      incognita: { posicion: 'barra', label: 'x = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo de barras. Si el total es 7 y una parte vale 3, cuanto vale la parte marcada con x?',
        tipo: 'opcion_multiple',
        opciones: ['A) 3', 'B) 4', 'C) 5', 'D) 7'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando el modelo, explica que operacion hiciste para encontrar el valor de x en x + 3 = 7.',
        tipo: 'abierta',
        respuesta:
          'Se resta 3 de ambos lados: x + 3 - 3 = 7 - 3, entonces x = 4. La operacion es una resta: al total se le quita la parte conocida.',
        criterios_aceptacion: ['restar 3 de ambos lados', 'x = 4', 'operacion inversa o resta'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Si x + 5 = 12, cual es el valor de x?',
        opciones: ['A) 5', 'B) 7', 'C) 12', 'D) 17'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Ana tiene x estampas. Recibe 8 estampas mas y ahora tiene 23. Plantea la ecuacion y resuelve para encontrar cuantas estampas tenia Ana.',
        respuesta:
          'Paso 1: Planteamos la ecuacion: x + 8 = 23.\nPaso 2: Restamos 8 de ambos lados: x = 23 - 8.\nPaso 3: x = 15.\nRespuesta: Ana tenia 15 estampas.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que, al resolver una ecuacion, debes hacer la misma operacion en ambos lados.',
        respuesta:
          'Una ecuacion es como una balanza: ambos lados son iguales. Si operas solo un lado, se rompe la igualdad. Por eso debes hacer lo mismo en los dos lados para mantener el equilibrio.',
        criterios_aceptacion: [
          'analogia con balanza',
          'igualdad en ambos lados',
          'operacion igual en los dos lados',
          'mantener equilibrio',
        ],
      },
    ],
  },
}
