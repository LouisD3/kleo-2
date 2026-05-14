import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 35b: Bicondicional
 * Concepto clave: Evaluar proposiciones bicondicionales (SI Y SOLO SI) con tabla de verdad
 *
 * Concreto: TablaVerdad (completar la tabla de p SI Y SOLO SI q)
 * Pictorico: Tabla comparativa — condicional vs bicondicional
 * Abstracto: 3 preguntas progresivas sobre bicondicional
 */
export const tareaSecuencia35b: TareaCPA = {
  secuencia_ref: 35,
  contexto: {
    personaje: 'Marco',
    objetos: { a: { nombre: 'equivalencia', emoji: '⚖️' }, b: { nombre: 'condicion', emoji: '❓' } },
    valores_clave: { casos_verdaderos: 2 },
    tipo: 'logica',
    narrativa: 'Marco descubre el bicondicional: "p SI Y SOLO SI q" es verdadero cuando ambas tienen el mismo valor (ambas V o ambas F).',
    pregunta_central: '¿Cuando es verdadero el bicondicional "p SI Y SOLO SI q"?',
    transiciones: {
      concreto: 'Completa la tabla de verdad del bicondicional para las 4 combinaciones.',
      bridge_pictorico: '2 de 4 casos son verdaderos: cuando p y q tienen el mismo valor.',
      pictorico: 'Compara el condicional con el bicondicional en la tabla.',
      bridge_abstracto: 'El bicondicional es verdadero cuando ambas coinciden: ambas V o ambas F.',
      abstracto: 'Ahora evalua bicondicionales en contextos reales.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'tabla_verdad',
      variables: ['p', 'q'],
      expresion: 'p SI Y SOLO SI q',
      valores_objetivo: [true, false, false, true],
      pregunta:
        'Completa la tabla de verdad de "p SI Y SOLO SI q" (bicondicional). Es verdadero cuando p y q tienen el MISMO valor de verdad.',
      pista: 'Piensa en una equivalencia: el bicondicional es Verdadero cuando ambas son Verdaderas (V,V) o ambas son Falsas (F,F). Es Falso cuando son diferentes.',
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
        { key: 'bicondicional', header: 'p SI Y SOLO SI q' },
      ],
      filas: [
        { p: 'V', q: 'V', condicional: 'V', bicondicional: 'V' },
        { p: 'V', q: 'F', condicional: 'F', bicondicional: 'F' },
        { p: 'F', q: 'V', condicional: 'V', bicondicional: 'F' },
        { p: 'F', q: 'F', condicional: 'V', bicondicional: 'V' },
      ],
      resaltados: [
        { fila: 0, columna: 'bicondicional', color: '#10B981' },
        { fila: 1, columna: 'bicondicional', color: '#EF4444' },
        { fila: 2, columna: 'bicondicional', color: '#EF4444' },
        { fila: 3, columna: 'bicondicional', color: '#10B981' },
      ],
      titulo: 'Comparacion: Condicional vs Bicondicional',
    },
    preguntas: [
      {
        pregunta:
          'Observa la tabla. En cuantos de los 4 casos el bicondicional da Verdadero?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1', 'B) 2', 'C) 3', 'D) 4'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Compara las columnas "SI p ENTONCES q" y "p SI Y SOLO SI q". En que filas dan resultado diferente? Explica por que.',
        tipo: 'abierta',
        respuesta:
          'Dan resultado diferente en la fila 3 (p=F, q=V): el condicional da V pero el bicondicional da F. El condicional solo exige que si p es V entonces q sea V. El bicondicional exige que ambas tengan el mismo valor.',
        criterios_aceptacion: ['fila p=F q=V es diferente', 'condicional V vs bicondicional F', 'bicondicional exige mismo valor', 'condicional es menos estricto en un sentido'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          '"Un triangulo es equilatero SI Y SOLO SI sus tres lados son iguales." Si un triangulo tiene 3 lados de 5 cm, el bicondicional es:',
        opciones: ['A) Verdadero', 'B) Falso', 'C) No se puede saber', 'D) Depende de los angulos'],
        respuesta: 'A',
      },
      {
        tipo: 'calculo',
        pregunta:
          'El condicional "SI p ENTONCES q" es verdadero en 3 de 4 casos. El bicondicional es verdadero en 2 de 4. En cuantos de los 4 casos dan el MISMO resultado? Muestra la comparacion fila por fila.',
        respuesta:
          'Fila VV: condicional=V, bicondicional=V (iguales)\nFila VF: condicional=F, bicondicional=F (iguales)\nFila FV: condicional=V, bicondicional=F (diferentes)\nFila FF: condicional=V, bicondicional=V (iguales)\nDan el mismo resultado en 3 de 4 casos.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras la diferencia entre el condicional "SI...ENTONCES" y el bicondicional "SI Y SOLO SI". Da un ejemplo de cada uno.',
        respuesta:
          'El condicional va en una direccion: si llueve entonces el piso se moja. Pero el piso puede estar mojado sin lluvia (por riego). El bicondicional va en ambas direcciones: un numero es par SI Y SOLO SI es divisible entre 2. Si es par, es divisible entre 2, y si es divisible entre 2, es par.',
        criterios_aceptacion: ['condicional en una direccion', 'bicondicional en ambas direcciones', 'ejemplo de condicional', 'ejemplo de bicondicional', 'equivalencia o doble implicacion'],
      },
    ],
  },
}
