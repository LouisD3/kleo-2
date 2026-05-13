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
    modelo_barras: {
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
        tipo: 'calculo',
        respuesta:
          'La probabilidad teorica es 3/6 = 1/2 = 0.5, es decir, esperamos que la mitad de los lanzamientos sean pares. En la practica, los resultados pueden ser diferentes porque cada lanzamiento es aleatorio. Con pocos lanzamientos (10), es normal que la frecuencia relativa no coincida exactamente con la probabilidad teorica. Con mas lanzamientos, los resultados se acercan mas a la probabilidad teorica.',
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
          'La probabilidad teorica se calcula dividiendo los resultados favorables entre los resultados posibles, sin necesidad de hacer el experimento. La frecuencia relativa experimental se obtiene al realizar el experimento y dividir las veces que ocurrio el evento entre el total de intentos. No siempre coinciden porque los resultados reales dependen del azar. Sin embargo, si repetimos el experimento muchas veces, la frecuencia relativa se acerca cada vez mas a la probabilidad teorica. Esto se conoce como la ley de los grandes numeros.',
      },
    ],
  },
}
