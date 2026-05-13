import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 1A: Fracciones y decimales
 * Concepto clave: Representar una fraccion como parte de un todo
 *
 * Concreto: ChocolateSecable (2x4 = 8 piezas), seleccionar 3/8
 * Pictorico: Modelo en barras (3 seleccionadas vs 5 restantes de 8)
 * Abstracto: 3 preguntas con progresion de dificultad sobre fraccion como parte de un todo
 */
export const tareaSecuencia01a: TareaCPA = {
  secuencia_ref: 1,
  concreto: {
    manipulable: {
      tipo_concreto: 'chocolate_secable',
      filas: 2,
      columnas: 4,
      fraccion_objetivo: '3/8',
      soluciones_validas: [{ piezas_seleccionadas: 3 }],
      pregunta:
        'Tienes una tableta de chocolate con 8 piezas. Selecciona 3/8 de la tableta.',
      pista:
        'La tableta tiene 8 piezas en total. El denominador te dice en cuantas partes se divide y el numerador cuantas seleccionar.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        {
          label: 'Seleccionadas',
          valor: 3,
          color: 'amarillo',
          subdivisiones: 3,
        },
        {
          label: 'Restantes',
          valor: 5,
          color: 'azul',
          subdivisiones: 5,
        },
      ],
      total: { valor: 8, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun el modelo, que fraccion representan las piezas amarillas (seleccionadas) del total?',
        tipo: 'opcion_multiple',
        opciones: ['A) 5/8', 'B) 3/8', 'C) 3/5', 'D) 8/3'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Si la tableta tuviera 4 piezas mas (12 en total) y seleccionas la misma proporcion, cuantas piezas seleccionarias? Muestra tu procedimiento.',
        tipo: 'calculo',
        respuesta:
          'La fraccion es 3/8, que significa 3 de cada 8. Si ahora hay 12 piezas: 12 x (3/8) = 36/8 = 4.5. Como no se puede partir una pieza exactamente, se necesitarian aproximadamente 4 o 5 piezas. Pero si mantenemos la proporcion exacta: 3/8 de 12 = 4.5 piezas.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En la tableta de 8 piezas, seleccionaste 3. Que fraccion del chocolate NO seleccionaste?',
        opciones: ['A) 3/8', 'B) 5/8', 'C) 8/3', 'D) 3/5'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En una caja hay 12 colores. 4 son rojos. Escribe la fraccion de colores rojos y la fraccion de colores que NO son rojos.',
        respuesta:
          'Fraccion de rojos: 4/12 (4 de 12 son rojos).\nFraccion de NO rojos: 8/12 (los restantes 12 - 4 = 8).\nEntre ambas fracciones suman el total: 4/12 + 8/12 = 12/12 = 1 entero.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que significa una fraccion. Usa el ejemplo del chocolate para que tu explicacion sea clara.',
        respuesta:
          'Una fraccion representa una parte de un todo. El denominador (numero de abajo) nos dice en cuantas partes iguales se divide el entero, y el numerador (numero de arriba) nos dice cuantas de esas partes tomamos. Por ejemplo, en la tableta de chocolate con 8 piezas, la fraccion 3/8 significa que dividimos la tableta en 8 partes iguales y tomamos 3 de ellas.',
      },
    ],
  },
}
