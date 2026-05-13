import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 14b: Razones
 * Concepto clave: Comparar dos razones diferentes
 *
 * Concreto: DulcesAgrupables (12 dulces, 4 grupos)
 * Pictorico: Modelo en barras comparativo (3 ninos vs 4 ninos)
 * Abstracto: 3 preguntas con progresion de dificultad sobre comparacion de razones
 */
export const tareaSecuencia14b: TareaCPA = {
  secuencia_ref: 14,
  concreto: {
    manipulable: {
      tipo_concreto: 'dulces_agrupables',
      cantidad: 12,
      grupos_objetivo: 4,
      soluciones_validas: [
        { grupos: 4, por_grupo: 3 },
        { grupos: 3, por_grupo: 4 },
      ],
      pregunta:
        'Ahora hay 4 ninos en vez de 3. Agrupa los 12 dulces entre 4.',
      pista: 'Reparte los dulces uno por uno entre los 4 ninos hasta repartir todos.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: '3 ninos: c/u', valor: 4, color: 'amarillo', subdivisiones: 4 },
        { label: '4 ninos: c/u', valor: 3, color: 'azul', subdivisiones: 3 },
      ],
      total: { valor: 12, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun el modelo, con 3 ninos cada uno recibe 4 dulces y con 4 ninos cada uno recibe 3. Quien recibe mas dulces?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Los ninos cuando son 3',
          'B) Los ninos cuando son 4',
          'C) Reciben lo mismo',
          'D) No se puede saber',
        ],
        respuesta: 'A',
      },
      {
        pregunta:
          'Compara las dos barras. Por que la barra de "3 ninos" es mas larga que la de "4 ninos"? Explica.',
        tipo: 'calculo',
        respuesta:
          'La barra de 3 ninos mide 4 porque 12/3 = 4 dulces por nino. La barra de 4 ninos mide 3 porque 12/4 = 3 dulces por nino. Al haber mas ninos, los mismos 12 dulces se reparten en mas partes, entonces cada parte es mas chica.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Con 3 ninos cada uno recibe 4 dulces; con 4 ninos cada uno recibe 3 dulces. Quien recibe mas?',
        opciones: [
          'A) Cada nino cuando son 3',
          'B) Cada nino cuando son 4',
          'C) Reciben igual',
          'D) Depende del tipo de dulce',
        ],
        respuesta: 'A',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Compara: 15 galletas entre 3 amigos vs 15 galletas entre 5 amigos. Cuantas recibe cada uno en cada caso? Muestra el procedimiento.',
        respuesta:
          'Caso 1: 15 galletas / 3 amigos = 5 galletas por amigo.\nCaso 2: 15 galletas / 5 amigos = 3 galletas por amigo.\nCon 3 amigos cada uno recibe mas (5) que con 5 amigos (3).',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica por que al aumentar el numero de personas, cada una recibe menos si el total no cambia.',
        respuesta:
          'Si el total de cosas no cambia pero hay mas personas, cada persona recibe menos porque el mismo total se divide en mas partes. Es como un pastel: si lo partes en 3, los pedazos son grandes; si lo partes en 6, cada pedazo es la mitad de grande. Matematicamente, al dividir el mismo numero entre un divisor mas grande, el resultado es mas chico.',
      },
    ],
  },
}
