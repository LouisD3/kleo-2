import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 34b: Disyunción (O)
 * Concepto clave: Evaluar proposiciones con OR usando tabla de verdad
 *
 * Concreto: TablaVerdad (completar la tabla de p O q)
 * Pictorico: Tabla comparativa — conjunción vs disyunción
 * Abstracto: 3 preguntas progresivas sobre disyunción
 */
export const tareaSecuencia34b: TareaCPA = {
  secuencia_ref: 34,
  contexto: {
    personaje: 'Marco',
    objetos: { a: { nombre: 'proposicion', emoji: '💬' }, b: { nombre: 'tabla', emoji: '📋' } },
    valores_clave: { casos_verdaderos_O: 3 },
    tipo: 'logica',
    narrativa: 'Marco ahora evalua la disyuncion "O": basta que UNA sea verdadera para que el resultado sea verdadero.',
    pregunta_central: '¿En cuantos casos es verdadera "p O q"?',
    transiciones: {
      concreto: 'Completa la tabla de verdad de "p O q" evaluando las 4 combinaciones.',
      bridge_pictorico: '3 de 4 casos son verdaderos para "O". Solo es falsa cuando ambas son falsas.',
      pictorico: 'Compara la disyuncion con la conjuncion en la tabla.',
      bridge_abstracto: '"O" = al menos una verdadera. Es menos estricta que "Y".',
      abstracto: 'Ahora aplica la disyuncion a situaciones reales.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'tabla_verdad',
      variables: ['p', 'q'],
      expresion: 'p O q',
      valores_objetivo: [true, true, true, false],
      pregunta:
        'Completa la tabla de verdad de "p O q" (disyuncion). La disyuncion es verdadera cuando AL MENOS UNA de las proposiciones es verdadera.',
      pista: '"p O q" solo es Falso cuando AMBAS son Falsas (p=F y q=F). En todos los demas casos, al menos una es verdadera, asi que el resultado es Verdadero.',
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
        { fila: 0, columna: 'p_o_q', color: '#10B981' },
        { fila: 1, columna: 'p_o_q', color: '#10B981' },
        { fila: 2, columna: 'p_o_q', color: '#10B981' },
        { fila: 3, columna: 'p_o_q', color: '#EF4444' },
      ],
      titulo: 'Comparacion: Conjuncion (Y) vs Disyuncion (O)',
    },
    preguntas: [
      {
        pregunta:
          'Observa la tabla. En cuantos de los 4 casos la disyuncion "p O q" da Verdadero?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1', 'B) 2', 'C) 3', 'D) 4'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Compara las columnas "p Y q" y "p O q". En que se diferencian? Explica cual es mas estricta y por que.',
        tipo: 'abierta',
        respuesta:
          '"p Y q" solo es Verdadero en 1 de 4 casos (ambas deben ser V). "p O q" es Verdadero en 3 de 4 casos (basta con una V). La conjuncion "Y" es mas estricta porque exige que ambas se cumplan.',
        criterios_aceptacion: ['Y verdadero en 1 caso', 'O verdadero en 3 casos', 'Y es mas estricta', 'Y exige ambas'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'p = "Es lunes" (Falso) y q = "Hace sol" (Verdadero). Cual es el valor de "p O q"?',
        opciones: ['A) Verdadero', 'B) Falso', 'C) No se puede saber', 'D) Depende del dia'],
        respuesta: 'A',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En la tabla de verdad, "p Y q" tiene 1 caso Verdadero y "p O q" tiene 3. Cuantos casos dan resultado DIFERENTE entre "Y" y "O"? Muestra cuales son.',
        respuesta:
          'Comparando fila por fila:\nVV: Y=V, O=V (iguales)\nVF: Y=F, O=V (diferentes)\nFV: Y=F, O=V (diferentes)\nFF: Y=F, O=F (iguales)\nHay 2 casos con resultado diferente: VF y FV.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Un restaurante ofrece un descuento si "eres estudiante O vienes antes de las 3 pm". Explica en que situaciones recibes el descuento y en cual NO.',
        respuesta:
          'Recibes descuento si eres estudiante (sin importar la hora), si vienes antes de las 3 (sin importar si eres estudiante), o si cumples ambas. Solo NO recibes descuento si no eres estudiante Y vienes despues de las 3.',
        criterios_aceptacion: ['descuento con al menos una condicion', 'sin descuento solo si ninguna se cumple', 'ejemplo con estudiante', 'ejemplo con hora'],
      },
    ],
  },
}
