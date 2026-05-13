import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 7: Propiedad conmutativa y asociativa
 * Concepto clave: Verificar que el orden de la suma no cambia el resultado
 *
 * Concreto: RectaNumerica (ubicar 5+3=8 en la recta, mismo punto que 3+5)
 * Pictorico: Dos caminos al mismo punto (5+3 vs 3+5)
 * Abstracto: 3 preguntas progresivas sobre conmutativa y asociativa
 */
export const tareaSecuencia07: TareaCPA = {
  secuencia_ref: 7,
  concreto: {
    manipulable: {
      tipo_concreto: 'recta_numerica',
      min: 0,
      max: 10,
      divisiones: 10,
      objetivo: 8,
      etiquetas: [
        { posicion: 0, texto: '0' },
        { posicion: 5, texto: '5' },
        { posicion: 10, texto: '10' },
      ],
      pregunta:
        'Calcula 5 + 3 y ubica el resultado en la recta numerica. Luego piensa: si calculas 3 + 5, llegaras al mismo punto?',
      pista: '5 + 3 = 8 y 3 + 5 = 8. Ambos dan el mismo resultado. Ubica el 8 en la recta.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Camino A: 5 + 3', valor: 8, color: 'amarillo', subdivisiones: 2 },
        { label: 'Camino B: 3 + 5', valor: 8, color: 'azul', subdivisiones: 2 },
      ],
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Las dos barras tienen la misma longitud: 5+3 = 3+5 = 8. Como se llama esta propiedad de la suma?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Propiedad distributiva',
          'B) Propiedad asociativa',
          'C) Propiedad conmutativa',
          'D) Propiedad de identidad',
        ],
        respuesta: 'C',
      },
      {
        pregunta:
          'Verifica la propiedad conmutativa con 12 + 25 y 25 + 12. Da el mismo resultado? Muestra la operacion.',
        tipo: 'calculo',
        respuesta:
          '12 + 25 = 37 y 25 + 12 = 37. Si, ambas sumas dan 37. La propiedad conmutativa se cumple: el orden de los sumandos no altera la suma.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Viste que 5+3 = 3+5 en la recta. La resta cumple la propiedad conmutativa? Es decir, 8-3 = 3-8?',
        opciones: [
          'A) Si, siempre dan igual',
          'B) No, 8-3=5 pero 3-8=-5',
          'C) Solo con numeros positivos',
          'D) Solo con numeros pares',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Usa la propiedad asociativa para calcular 17 + 45 + 3 de la forma mas facil. Muestra como reagrupas.',
        respuesta:
          'Reagrupo: 17 + 3 + 45 (conmutativa) = (17 + 3) + 45 (asociativa) = 20 + 45 = 65. Es mas facil porque 17 + 3 da un numero redondo.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que la suma es conmutativa pero la resta no. Usa la recta numerica para explicarlo.',
        respuesta:
          'En la recta numerica, sumar es avanzar. Si avanzo 5 y luego 3, llego al 8. Si avanzo 3 y luego 5, tambien llego al 8. El orden no importa porque los saltos se acumulan igual. Pero restar es retroceder: si empiezo en 8 y retrocedo 3, llego a 5. Si empiezo en 3 y retrocedo 8, llego a -5. El punto de partida SI importa en la resta, por eso no es conmutativa.',
      },
    ],
  },
}
