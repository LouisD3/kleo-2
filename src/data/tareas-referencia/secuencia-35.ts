import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 35: Condicionales
 * Concepto clave: Evaluar proposiciones condicionales (SI...ENTONCES) con tabla de verdad
 *
 * Concreto: TablaVerdad (completar la tabla de SI p ENTONCES q)
 * Pictorico: Tabla de verdad — condicional SI p ENTONCES q
 * Abstracto: 3 preguntas progresivas sobre condicionales
 */
export const tareaSecuencia35: TareaCPA = {
  secuencia_ref: 35,
  concepto_clave: 'Evaluar proposiciones condicionales (SI...ENTONCES) con tabla de verdad',
  contexto: {
    personaje: 'Marco',
    objetos: { a: { nombre: 'promesa', emoji: '🤝' }, b: { nombre: 'condicion', emoji: '❓' } },
    valores_clave: { casos_falsos: 1 },
    tipo: 'logica',
    narrativa: 'Marco piensa en promesas: "Si llueve, llevo paraguas". Solo se rompe la promesa si llueve y NO llevas paraguas.',
    pregunta_central: '¿Cuando es falso el condicional "SI p ENTONCES q"?',
    transiciones: {
      concreto: 'Completa la tabla de verdad del condicional para las 4 combinaciones.',
      bridge_pictorico: 'Solo 1 caso es falso: cuando p=V y q=F (la promesa se rompe).',
      pictorico: 'Observa en la tabla cual es el unico caso falso.',
      bridge_abstracto: 'El condicional solo es falso cuando la condicion se cumple pero la consecuencia no.',
      abstracto: 'Ahora evalua condicionales en diferentes contextos.',
    },
  },
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
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'p', header: 'p' },
        { key: 'q', header: 'q' },
        { key: 'condicional', header: 'SI p ENTONCES q' },
      ],
      filas: [
        { p: 'V', q: 'V', condicional: 'V' },
        { p: 'V', q: 'F', condicional: 'F' },
        { p: 'F', q: 'V', condicional: 'V' },
        { p: 'F', q: 'F', condicional: 'V' },
      ],
      resaltados: [
        { fila: 1, columna: 'condicional', color: '#EF4444' },
      ],
      titulo: 'Tabla de verdad: Condicional (SI...ENTONCES)',
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
        tipo: 'abierta',
        respuesta:
          'El condicional es Falso solo cuando p=Verdadero y q=Falso (segunda fila). La condición se cumple pero la consecuencia no: la promesa se rompió.',
        criterios_aceptacion: ['p=V y q=F', 'segunda fila de la tabla', 'condición cumplida consecuencia no', 'promesa rota'],
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
          'p Y q: V, F, F, F.\nSI p ENTONCES q: V, F, V, V.\nComparando fila por fila: caso VV: V=V iguales, caso VF: F=F iguales, caso FV: F≠V diferentes, caso FF: F≠V diferentes.\nDan el mismo resultado en 2 de 4 casos.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que el condicional "SI llueve ENTONCES llevo paraguas" es verdadero cuando NO llueve, sin importar si llevas paraguas o no.',
        respuesta:
          'Si no llueve, la promesa nunca se puso a prueba. Solo puedes romperla si llueve y no llevas paraguas. Por eso, cuando p=Falso, el condicional siempre es Verdadero.',
        criterios_aceptacion: ['promesa no activada cuando p=Falso', 'solo se rompe con p=V y q=F', 'cuando p=F el resultado es siempre Verdadero', 'ejemplo de lluvia o paraguas'],
      },
    ],
  },
}
