import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 4: Densidad del orden
 * Concepto clave: Ubicar fracciones y decimales entre enteros en la recta
 *
 * Concreto: Recta numerica de 0 a 3, divisiones cada 0.25, ubicar 1.5
 * Pictorico: Modelo en barras (segmento 0-1.5 vs 1.5-3)
 * Abstracto: 3 preguntas con progresion de dificultad sobre densidad de racionales
 */
export const tareaSecuencia04: TareaCPA = {
  secuencia_ref: 4,
  concreto: {
    manipulable: {
      tipo_concreto: 'recta_numerica',
      min: 0,
      max: 3,
      divisiones: 12,
      objetivo: 1.5,
      tolerancia: 0,
      etiquetas: [
        { posicion: 0, texto: '0' },
        { posicion: 1, texto: '1' },
        { posicion: 2, texto: '2' },
        { posicion: 3, texto: '3' },
      ],
      pregunta: 'Ubica el numero 1.5 en la recta numerica.',
      pista:
        'El numero 1.5 esta exactamente a la mitad entre 1 y 2. Busca la marca que divide ese segmento en dos partes iguales.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        {
          label: 'De 0 a 1.5',
          valor: 1.5,
          color: 'amarillo',
          subdivisiones: 6,
        },
        {
          label: 'De 1.5 a 3',
          valor: 1.5,
          color: 'azul',
          subdivisiones: 6,
        },
      ],
      total: { valor: 3, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun el modelo, que fraccion del segmento total (0 a 3) representa la parte amarilla (0 a 1.5)?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1/4', 'B) 1/2', 'C) 1/3', 'D) 2/3'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Nombra un numero decimal que este entre 1 y 1.5 en la recta numerica. Explica como sabes que esta entre esos dos valores.',
        tipo: 'calculo',
        respuesta:
          'Un numero entre 1 y 1.5 puede ser 1.25. Se que esta entre ambos porque 1 < 1.25 < 1.5. En la recta, 1.25 se ubica a la mitad entre 1 y 1.5, es decir, en la tercera marca despues del 1 si cada division mide 0.25.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Cual de los siguientes numeros esta entre 0.5 y 1 en la recta numerica?',
        opciones: ['A) 0.3', 'B) 1.2', 'C) 0.75', 'D) 0.5'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Encuentra dos numeros decimales que esten entre 2 y 2.5. Muestra como verificas que estan en ese intervalo.',
        respuesta:
          'Dos numeros entre 2 y 2.5 pueden ser 2.1 y 2.3. Verificacion: 2 < 2.1 < 2.5 (verdadero) y 2 < 2.3 < 2.5 (verdadero). Siempre podemos encontrar mas numeros, como 2.25, 2.15, etc. Esto demuestra la propiedad de densidad.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que significa la propiedad de densidad de los numeros racionales. Usa la recta numerica y el ejemplo de ubicar 1.5 entre enteros para apoyar tu explicacion.',
        respuesta:
          'La propiedad de densidad significa que entre cualesquiera dos numeros racionales siempre podemos encontrar otro numero. Por ejemplo, entre 1 y 2 encontramos 1.5, pero entre 1 y 1.5 tambien hay numeros como 1.25, y entre 1 y 1.25 hay 1.125, y asi sucesivamente. En la recta numerica, no importa que tan cerca esten dos puntos, siempre hay mas numeros entre ellos. Por eso los racionales son densos: no hay huecos entre ellos.',
      },
    ],
  },
}
