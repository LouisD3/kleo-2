import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 35: Condicionales y bicondicionales
 * Concepto clave: Evaluar proposiciones condicionales (SI...ENTONCES) con tabla de verdad
 *
 * Concreto: TablaVerdad (completar la tabla de SI p ENTONCES q)
 * Pictorico: Modelo en barras (casos verdaderos vs falsos del condicional)
 * Abstracto: 3 preguntas progresivas sobre condicionales
 */
export const tareaSecuencia35: TareaCPA = {
  secuencia_ref: 35,
  concreto: {
    manipulable: {
      tipo_concreto: 'tabla_verdad',
      variables: ['p', 'q'],
      expresion: 'SI p ENTONCES q',
      valores_objetivo: [true, false, true, true],
      pregunta:
        'Completa la tabla de verdad de "SI p ENTONCES q". El condicional solo es falso cuando p es Verdadero y q es Falso (la promesa se rompe).',
      pista: 'Piensa en una promesa: "Si llueve, llevo paraguas". Solo es falsa si llueve (p=V) y NO llevas paraguas (q=F). En todos los demas casos, la promesa se cumple.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Casos verdaderos', valor: 3, color: 'verde' },
        { label: 'Casos falsos', valor: 1, color: 'rojo' },
      ],
      total: { valor: 4, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'De los 4 casos del condicional, cuantos son Falsos?',
        tipo: 'opcion_multiple',
        opciones: ['A) 0', 'B) 1', 'C) 2', 'D) 3'],
        respuesta: 'B',
      },
      {
        pregunta:
          'En que caso exacto es Falso el condicional "SI p ENTONCES q"? Explica con la tabla que completaste.',
        tipo: 'calculo',
        respuesta:
          'El condicional es Falso solo cuando p=Verdadero y q=Falso. En la tabla, esa es la segunda fila (VF). Significa que la condicion se cumple (p es verdadera) pero la consecuencia no (q es falsa). La promesa se rompio.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'La proposicion "Si estudias, entonces apruebas". En que caso esta proposicion es FALSA?',
        opciones: [
          'A) No estudias y no apruebas',
          'B) Estudias y apruebas',
          'C) Estudias y no apruebas',
          'D) No estudias y apruebas',
        ],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Compara los resultados de "p Y q" (de la secuencia anterior) con "SI p ENTONCES q". En cuantos de los 4 casos dan el mismo resultado?',
        respuesta:
          'p Y q: V, F, F, F.\nSI p ENTONCES q: V, F, V, V.\nComparando fila por fila: VV=iguales, FF=iguales, FV=diferentes, FV=diferentes.\nDan el mismo resultado en 2 de 4 casos.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que el condicional "SI llueve ENTONCES llevo paraguas" es verdadero cuando NO llueve, sin importar si llevas paraguas o no.',
        respuesta:
          'El condicional es como una promesa que solo se activa cuando la condicion se cumple. Si no llueve (p=Falso), la promesa no fue puesta a prueba: no importa si llevas paraguas o no, porque nunca dijiste que harias algo cuando no llueve. Solo puedes romper la promesa si llueve y no llevas paraguas. Por eso, cuando p=Falso, el condicional siempre es Verdadero.',
      },
    ],
  },
}
