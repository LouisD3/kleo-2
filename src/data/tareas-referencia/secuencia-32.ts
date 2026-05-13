import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 32: Probabilidades
 * Concepto clave: Calcular la probabilidad teorica de un evento con un dado
 *
 * Concreto: Dados/ruleta (lanzar un dado 10 veces, probabilidad de numero par)
 * Pictorico: Modelo en barras (resultados favorables vs total)
 * Abstracto: 3 preguntas con progresion de dificultad sobre probabilidad
 */
export const tareaSecuencia32: TareaCPA = {
  secuencia_ref: 32,
  concreto: {
    manipulable: {
      tipo_concreto: 'dados_ruleta',
      tipo: 'dado',
      caras: 6,
      lanzamientos: 10,
      evento_favorable: 'Sacar un numero par (2, 4 o 6)',
      respuesta_probabilidad: '3/6',
      pregunta:
        'Lanza el dado 10 veces. Luego responde: cual es la probabilidad teorica de sacar un numero par?',
      pista:
        'Los numeros pares en un dado de 6 caras son 2, 4 y 6. Esos son 3 resultados favorables de 6 posibles.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Favorables (par)', valor: 3, color: 'verde' },
        { label: 'No favorables (impar)', valor: 3, color: 'rojo' },
      ],
      total: { valor: 6, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo. De 6 resultados posibles, 3 son favorables (pares). Cual es la probabilidad como fraccion?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1/6', 'B) 2/6', 'C) 3/6', 'D) 4/6'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Compara la probabilidad teorica (3/6) con los resultados de tus lanzamientos. Fueron iguales? Explica por que pueden ser diferentes.',
        tipo: 'abierta',
        respuesta:
          'La probabilidad teórica es 3/6 = 1/2, así que esperamos pares la mitad del tiempo. Con solo 10 lanzamientos, el resultado real puede ser diferente porque cada tiro es aleatorio.',
        criterios_aceptacion: ['probabilidad teórica 3/6 o 1/2', 'resultados reales pueden variar', 'causa: azar o aleatoriedad', 'más lanzamientos acercan al teórico'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Al lanzar un dado de 6 caras, cual es la probabilidad de sacar un numero mayor que 4?',
        opciones: ['A) 1/6', 'B) 2/6', 'C) 3/6', 'D) 4/6'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Se lanza un dado de 6 caras 30 veces. Cuantas veces esperarias teoricamente obtener un numero par? Muestra tu procedimiento.',
        respuesta:
          'Paso 1: La probabilidad teorica de obtener un numero par es 3/6 = 1/2.\nPaso 2: Numero esperado = probabilidad x total de lanzamientos.\nPaso 3: Numero esperado = 1/2 x 30 = 15.\nRespuesta: Esperarias obtener un numero par aproximadamente 15 veces.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras la diferencia entre probabilidad teorica y frecuencia relativa experimental. Por que no siempre coinciden?',
        respuesta:
          'La probabilidad teórica se calcula sin experimentar (favorables ÷ posibles). La frecuencia experimental se mide haciendo el experimento. No coinciden siempre porque el azar es impredecible, pero con muchos intentos se acercan.',
        criterios_aceptacion: ['probabilidad teórica sin experimento', 'frecuencia experimental con experimento', 'diferencia por azar', 'ley de grandes números o más intentos'],
      },
    ],
  },
}
