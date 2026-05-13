import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 14a: Razones
 * Concepto clave: Repartir en partes iguales (razon como reparto)
 *
 * Concreto: DulcesAgrupables (12 dulces, 3 grupos)
 * Pictorico: Modelo en barras (3 barras de 4, total 12)
 * Abstracto: 3 preguntas con progresion de dificultad sobre reparto equitativo
 */
export const tareaSecuencia14a: TareaCPA = {
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
        'Hay 12 dulces para 3 ninos. Agrupa para que cada nino reciba lo mismo.',
      pista: 'Intenta repartir los dulces uno por uno entre los 3 ninos hasta que no quede ninguno.',
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
        pregunta: 'Segun el modelo, cuantos dulces le tocan a cada nino?',
        tipo: 'opcion_multiple',
        opciones: ['A) 3 dulces', 'B) 4 dulces', 'C) 6 dulces', 'D) 12 dulces'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Si cada barra representa los dulces de un nino, cuantos dulces hay en total? Escribe la operacion.',
        tipo: 'calculo',
        respuesta:
          'Cada nino recibe 4 dulces. Total = 4 x 3 = 12 dulces. La operacion es una multiplicacion: dulces por nino por numero de ninos.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: '12 dulces entre 3 ninos por igual, cuantos dulces recibe cada uno?',
        opciones: ['A) 3', 'B) 4', 'C) 6', 'D) 9'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Hay 20 galletas para 4 amigos y se reparten en partes iguales. Cuantas galletas recibe cada amigo? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Se tienen 20 galletas y 4 amigos.\nPaso 2: Se divide: 20 / 4 = 5 galletas por amigo.\nRespuesta: Cada amigo recibe 5 galletas.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que es una razon usando el ejemplo de los dulces.',
        respuesta:
          'Una razon es una comparacion entre dos cantidades. En el ejemplo, la razon de dulces a ninos es 12:3, que significa que por cada 3 ninos hay 12 dulces, o bien, por cada nino hay 4 dulces. La razon nos dice cuanto le corresponde a cada uno cuando repartimos en partes iguales.',
      },
    ],
  },
}
