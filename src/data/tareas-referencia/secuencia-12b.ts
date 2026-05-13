import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 12b: Ecuaciones lineales
 * Concepto clave: Resolver ecuaciones de la forma ax = b
 *
 * Concreto: Balanza (2x = 8, solucion x = 4)
 * Pictorico: Modelo en barras (2 barras iguales = 8 total)
 * Abstracto: 3 preguntas con progresion de dificultad sobre ecuaciones ax = b
 */
export const tareaSecuencia12b: TareaCPA = {
  secuencia_ref: 12,
  concreto: {
    manipulable: {
      tipo_concreto: 'balanza',
      lado_izquierdo: [{ tipo: 'x', valor: 2 }],
      lado_derecho: [{ tipo: 'constante', valor: 8 }],
      solucion: 4,
      pregunta:
        'En la balanza hay 2 cajas iguales de un lado y 8 pesas del otro. Cuanto pesa cada caja?',
      pista: 'Si hay 2 cajas iguales que juntas pesan 8, intenta dividir 8 entre 2.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Caja 1', valor: 4, color: 'amarillo', subdivisiones: 4 },
        { label: 'Caja 2', valor: 4, color: 'amarillo', subdivisiones: 4 },
      ],
      total: { valor: 8, visible: true },
      incognita: { posicion: 'barra', label: 'x = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo muestra 2 barras iguales que juntas valen 8. Cuanto vale cada barra?',
        tipo: 'opcion_multiple',
        opciones: ['A) 2', 'B) 4', 'C) 6', 'D) 8'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Si 2 barras iguales suman 8, que operacion usaste para encontrar el valor de cada una? Escribe la operacion.',
        tipo: 'calculo',
        respuesta:
          'Se divide el total entre el numero de barras: 8 / 2 = 4. Cada barra vale 4. La operacion es una division.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Si 3x = 15, cual es el valor de x?',
        opciones: ['A) 3', 'B) 5', 'C) 12', 'D) 15'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          '4 bolsas iguales pesan 36 kg en total. Plantea la ecuacion y calcula cuanto pesa cada bolsa. Muestra el procedimiento.',
        respuesta:
          'Paso 1: Planteamos la ecuacion: 4x = 36.\nPaso 2: Dividimos ambos lados entre 4: x = 36 / 4.\nPaso 3: x = 9.\nRespuesta: Cada bolsa pesa 9 kg.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras la diferencia entre resolver x + 4 = 8 y resolver 4x = 8.',
        respuesta:
          'En x + 4 = 8 se suma 4 a la incognita, asi que para despejar x restamos 4 de ambos lados: x = 8 - 4 = 4. En 4x = 8 se multiplica la incognita por 4, asi que para despejar x dividimos ambos lados entre 4: x = 8 / 4 = 2. La diferencia es la operacion inversa que se usa: resta para la suma, division para la multiplicacion.',
      },
    ],
  },
}
