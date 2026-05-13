import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 34: Conjuncion y disyuncion
 * Concepto clave: Evaluar proposiciones con AND y OR usando tablas de verdad
 *
 * Concreto: TablaVerdad (completar la tabla de p AND q)
 * Pictorico: Tabla de verdad completa — conjuncion (Y) y disyuncion (O)
 * Abstracto: 3 preguntas progresivas sobre conjuncion y disyuncion
 */
export const tareaSecuencia34: TareaCPA = {
  secuencia_ref: 34,
  concreto: {
    manipulable: {
      tipo_concreto: 'tabla_verdad',
      variables: ['p', 'q'],
      expresion: 'p Y q',
      valores_objetivo: [true, false, false, false],
      pregunta:
        'Completa la tabla de verdad de "p Y q" (conjuncion). La conjuncion es verdadera solo cuando AMBAS proposiciones son verdaderas.',
      pista: '"p Y q" solo es Verdadero cuando p es Verdadero Y q es Verdadero al mismo tiempo. En todos los demas casos es Falso.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'p', header: 'p' },
        { key: 'q', header: 'q' },
        { key: 'p_y_q', header: 'p Y q' },
        { key: 'p_o_q', header: 'p O q' },
      ],
      filas: [
        { p: 'V', q: 'V', p_y_q: 'V', p_o_q: 'V' },
        { p: 'V', q: 'F', p_y_q: 'F', p_o_q: 'V' },
        { p: 'F', q: 'V', p_y_q: 'F', p_o_q: 'V' },
        { p: 'F', q: 'F', p_y_q: 'F', p_o_q: 'F' },
      ],
      resaltados: [
        { fila: 0, columna: 'p_y_q', color: '#10B981' },
        { fila: 0, columna: 'p_o_q', color: '#10B981' },
        { fila: 1, columna: 'p_o_q', color: '#10B981' },
        { fila: 2, columna: 'p_o_q', color: '#10B981' },
      ],
      titulo: 'Tabla de verdad: Conjuncion (Y) y Disyuncion (O)',
    },
    preguntas: [
      {
        pregunta:
          'De los 4 casos posibles de "p Y q", cuantos dan resultado Verdadero?',
        tipo: 'opcion_multiple',
        opciones: ['A) 0', 'B) 1', 'C) 2', 'D) 4'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Ahora piensa en "p O q" (disyuncion). La disyuncion es verdadera cuando AL MENOS UNA es verdadera. Cuantos de los 4 casos darian Verdadero?',
        tipo: 'calculo',
        respuesta:
          'Los 4 casos son: VV, VF, FV, FF. Para "p O q", es Verdadero si al menos una es V:\nVV → V, VF → V, FV → V, FF → F.\n3 de 4 casos dan Verdadero.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En la tabla de verdad, "p Y q" solo fue verdadero en 1 de 4 casos. Si p = "Llueve" y q = "Hace frio", cuando es verdadera la proposicion "Llueve Y hace frio"?',
        opciones: [
          'A) Cuando llueve pero no hace frio',
          'B) Cuando hace frio pero no llueve',
          'C) Solo cuando llueve y hace frio al mismo tiempo',
          'D) Siempre que al menos una sea verdadera',
        ],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Escribe la tabla de verdad de "p O q" (disyuncion) para las 4 combinaciones: VV, VF, FV, FF.',
        respuesta:
          'p=V, q=V → p O q = V\np=V, q=F → p O q = V\np=F, q=V → p O q = V\np=F, q=F → p O q = F\nLa disyuncion es Verdadera en 3 de 4 casos.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras la diferencia entre "Y" (conjuncion) y "O" (disyuncion). Da un ejemplo de la vida cotidiana para cada una.',
        respuesta:
          '"Y" exige que ambas condiciones se cumplan al mismo tiempo (ejemplo: tienes dinero Y tiempo libre). "O" basta con que se cumpla al menos una (ejemplo: puedes ir al cine O al parque). La Y es mas estricta que la O.',
        criterios_aceptacion: [
          'Y requiere ambas condiciones',
          'O requiere al menos una',
          'ejemplo cotidiano para Y',
          'ejemplo cotidiano para O',
          'Y es mas estricta',
        ],
      },
    ],
  },
}
