import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 13A: Porcentaje de una cantidad
 * Concepto clave: Encontrar el porcentaje de una cantidad usando la cuadricula de 100
 *
 * Concreto: Cuadricula100 (sombrear 35 de 100 casillas = 35%)
 * Pictorico: Modelo en barras (35% coloreado vs 65% sin colorear)
 * Abstracto: 3 preguntas progresivas sobre porcentajes
 */
export const tareaSecuencia13a: TareaCPA = {
  secuencia_ref: 13,
  concreto: {
    manipulable: {
      tipo_concreto: 'cuadricula_100',
      porcentaje_objetivo: 35,
      pregunta:
        'En una encuesta, el 35% de los alumnos prefiere futbol. Sombrea 35 casillas de la cuadricula de 100 para representar ese porcentaje.',
      pista: 'Porcentaje significa "de cada 100". Si el 35% prefiere futbol, debes sombrear exactamente 35 casillas.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Prefieren futbol (35%)', valor: 35, color: 'amarillo', subdivisiones: 7 },
        { label: 'Otros deportes (65%)', valor: 65, color: 'azul', subdivisiones: 13 },
      ],
      total: { valor: 100, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Sombreaste 35 de 100 casillas. Segun el modelo de barras, que porcentaje representan las casillas sin sombrear?',
        tipo: 'opcion_multiple',
        opciones: ['A) 35%', 'B) 55%', 'C) 65%', 'D) 75%'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si la encuesta se hiciera a 200 alumnos en lugar de 100, cuantos preferirian futbol si se mantiene el mismo porcentaje (35%)?',
        tipo: 'calculo',
        respuesta:
          'El 35% de 200 = 0.35 x 200 = 70 alumnos. Si son 200 alumnos, 70 preferirian futbol.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En la cuadricula sombreaste 35 de 100 casillas para el 35%. Si sombraras 50 casillas, que porcentaje seria?',
        opciones: ['A) 25%', 'B) 40%', 'C) 50%', 'D) 75%'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En una clase de 40 alumnos, el 25% usa lentes. Cuantos alumnos usan lentes? Muestra el procedimiento.',
        respuesta:
          'Paso 1: 25% en decimal = 0.25.\nPaso 2: 0.25 x 40 = 10 alumnos.\nRespuesta: 10 alumnos usan lentes.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que significa "porcentaje" y por que la cuadricula de 100 casillas te ayuda a entenderlo.',
        respuesta:
          'Porcentaje significa "de cada cien". La cuadricula tiene exactamente 100 casillas, asi que cada una vale 1%. Si sombreas 35, ves de inmediato que es el 35%.',
        criterios_aceptacion: [
          'de cada cien',
          '100 partes iguales',
          'cada casilla vale 1%',
          'representacion visual del porcentaje',
        ],
      },
    ],
  },
}
