import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 14: Relaciones proporcionales
 *
 * Concreto: DulcesAgrupables (12 dulces, 3 ninos)
 * Pictorico: Modelo en barras (3 barras iguales, total 12)
 * Abstracto: 3 preguntas cherry-picked de la biblioteca (opcion_multiple + calculo + abierta)
 */
export const tareaSecuencia14: TareaCPA = {
  secuencia_ref: 14,
  concreto: {
    manipulable: {
      tipo_concreto: 'dulces_agrupables',
      cantidad: 12,
      grupos_objetivo: 3,
      soluciones_validas: [
        { grupos: 3, por_grupo: 4 },
        { grupos: 4, por_grupo: 3 },
      ],
      pregunta:
        'En una fiesta hay 12 dulces y 3 ninos. Agrupa los dulces para que cada nino reciba la misma cantidad.',
      pista: 'Intenta repartir los dulces uno por uno entre los 3 ninos.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Nino 1', valor: 4, color: 'amarillo', subdivisiones: 4 },
        { label: 'Nino 2', valor: 4, color: 'azul', subdivisiones: 4 },
        { label: 'Nino 3', valor: 4, color: 'verde', subdivisiones: 4 },
      ],
      total: { valor: 12, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta: 'Segun el modelo, cual es la razon de dulces por nino?',
        tipo: 'opcion_multiple',
        opciones: ['A) 3:12', 'B) 12:3', 'C) 4:1', 'D) 1:4'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si hubiera 5 ninos en vez de 3, cuantos dulces necesitarias en total para mantener la misma razon?',
        tipo: 'calculo',
        respuesta: '20, porque la razon es 4 dulces por nino, entonces 4 x 5 = 20.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Cual de las siguientes tablas representa una relacion proporcional?',
        opciones: [
          'A) x: 1,2,3 -> y: 3,6,9',
          'B) x: 1,2,3 -> y: 2,5,8',
          'C) x: 1,2,3 -> y: 1,4,9',
          'D) x: 1,2,3 -> y: 5,7,11',
        ],
        respuesta: 'A',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Si 3 kg de manzanas cuestan $45, cuanto cuestan 7 kg? Demuestra que es una relacion proporcional.',
        respuesta:
          'Paso 1: Encontrar la constante de proporcionalidad: k = 45/3 = 15 pesos por kg.\nPaso 2: Verificar proporcionalidad: 45/3 = 15, y cada kg cuesta lo mismo.\nPaso 3: Calcular para 7 kg: 7 x 15 = $105.\nRespuesta: 7 kg cuestan $105.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con un ejemplo de la vida real la diferencia entre una relacion proporcional y una no proporcional.',
        respuesta:
          'Una relacion proporcional es cuando al dividir una cantidad entre la otra siempre se obtiene el mismo valor (constante). Ejemplo proporcional: precio y cantidad de manzanas a $5 cada una (5, 10, 15...). Ejemplo no proporcional: edad y estatura de una persona.',
      },
    ],
  },
}
