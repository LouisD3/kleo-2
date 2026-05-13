import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 1C: Convertir fraccion a decimal
 * Concepto clave: Ubicar una fraccion en la recta numerica como decimal
 *
 * Concreto: RectaNumerica (ubicar 3/10 = 0.3 en la recta de 0 a 1)
 * Pictorico: Modelo en barras (3 de 10 partes)
 * Abstracto: 3 preguntas progresivas sobre conversion fraccion/decimal
 */
export const tareaSecuencia01c: TareaCPA = {
  secuencia_ref: 1,
  concreto: {
    manipulable: {
      tipo_concreto: 'recta_numerica',
      min: 0,
      max: 1,
      divisiones: 10,
      objetivo: 0.3,
      etiquetas: [
        { posicion: 0, texto: '0' },
        { posicion: 0.5, texto: '1/2' },
        { posicion: 1, texto: '1' },
      ],
      pregunta:
        'La fraccion 3/10 se puede escribir como decimal. Coloca el marcador en la posicion correcta de la recta numerica.',
      pista: 'Si la recta va de 0 a 1 y tiene 10 marcas, cada marca vale 0.1. La tercera marca es 0.3.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: '3 partes', valor: 3, color: 'amarillo', subdivisiones: 3 },
        { label: '7 partes', valor: 7, color: 'azul', subdivisiones: 7 },
      ],
      total: { valor: 10, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'La barra tiene 10 partes iguales y 3 estan coloreadas. En la recta numerica, pusiste el marcador en 0.3. Que relacion hay entre la fraccion 3/10 y el decimal 0.3?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Son lo mismo, 3/10 = 0.3',
          'B) 0.3 es mayor que 3/10',
          'C) 3/10 es mayor que 0.3',
          'D) No tienen relacion',
        ],
        respuesta: 'A',
      },
      {
        pregunta:
          'Si coloreas 7 de las 10 partes en lugar de 3, en que posicion de la recta quedaria el marcador? Explica.',
        tipo: 'calculo',
        respuesta:
          '7 de 10 partes = 7/10. Para convertir a decimal, divido 7 entre 10 = 0.7. El marcador quedaria en la posicion 0.7 de la recta.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Colocaste 3/10 en la posicion 0.3 de la recta. Cual de estos decimales corresponde a 1/2?',
        opciones: ['A) 0.12', 'B) 0.2', 'C) 0.5', 'D) 0.15'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Convierte la fraccion 3/4 a decimal. Muestra el procedimiento de la division.',
        respuesta:
          'Paso 1: Divido el numerador entre el denominador: 3 / 4.\nPaso 2: 3.0 / 4 = 0.75\nRespuesta: 3/4 = 0.75.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que dividir el numerador entre el denominador te da el decimal de una fraccion. Usa el ejemplo de la recta numerica y las 10 partes.',
        respuesta:
          '3/10 significa 3 partes de 10 iguales. En la recta, cada parte vale 0.1, entonces 3 partes valen 0.3. Dividir el numerador entre el denominador (3 ÷ 10) siempre da ese mismo decimal.',
        criterios_aceptacion: [
          'fraccion = partes de un total',
          'cada parte vale 1 dividido entre el denominador',
          'numerador ÷ denominador = decimal',
          'ejemplo con numeros correctos',
        ],
      },
    ],
  },
}
