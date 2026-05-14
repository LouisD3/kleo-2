import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 10: Introducción al álgebra
 * Concepto clave: Traducir del lenguaje común al lenguaje algebraico (x + a = b)
 *
 * Concreto: Azulejos de álgebra (x + 5 = 9, solución x = 4)
 * Pictorico: Modelo en barras (x + 5 = 9, incógnita en primera barra)
 * Abstracto: 3 preguntas con progresión de dificultad sobre expresiones algebraicas
 */
export const tareaSecuencia10: TareaCPA = {
  secuencia_ref: 10,
  contexto: {
    personaje: 'Valentina',
    objetos: { a: { nombre: 'azulejo', emoji: '🟦' }, b: { nombre: 'expresion', emoji: '🔤' } },
    valores_clave: { objetivo: 4 },
    tipo: 'ecuacion',
    narrativa: 'Valentina traduce frases cotidianas a expresiones algebraicas. "Un numero mas 5" se escribe x + 5.',
    pregunta_central: '¿Que valor tiene x en la ecuacion x + 5 = 9?',
    transiciones: {
      concreto: 'Arma la ecuacion x + 5 = 9 con azulejos de algebra.',
      bridge_pictorico: 'La ecuacion tiene 1 barra de x y 5 unidades en un lado, 9 en el otro.',
      pictorico: 'Observa la ecuacion representada en el modelo.',
      bridge_abstracto: 'Traducir a algebra permite resolver problemas sistematicamente.',
      abstracto: 'Ahora traduce y resuelve otras expresiones.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'azulejos_algebra',
      ecuacion: 'x + 5 = 9',
      lado_izquierdo: { x_barras: 1, unidades: 5 },
      lado_derecho: { x_barras: 0, unidades: 9 },
      solucion: 4,
      pregunta:
        'Usa los azulejos de álgebra para resolver la ecuación x + 5 = 9. Coloca las barras y los cuadrados unitarios en cada lado hasta encontrar el valor de x.',
      pista: 'Quita 5 cuadrados unitarios de cada lado. ¿Cuántos quedan del lado derecho?',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'x', valor: 4, color: 'amarillo' },
        { label: '5', valor: 5, color: 'azul' },
      ],
      total: { valor: 9, visible: true },
      incognita: { posicion: 'barra', label: 'x = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo de barras. Si el total es 9 y una parte vale 5, ¿cuánto vale la parte marcada con x?',
        tipo: 'opcion_multiple',
        opciones: ['A) 3', 'B) 4', 'C) 5', 'D) 9'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando el modelo, explica que operacion hiciste para encontrar el valor de x en x + 5 = 9.',
        tipo: 'abierta',
        respuesta:
          'Se resta 5 de ambos lados: x + 5 - 5 = 9 - 5, entonces x = 4. La operacion es una resta: al total se le quita la parte conocida.',
        criterios_aceptacion: ['restar 5 de ambos lados', 'x = 4', 'operacion inversa o resta'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Cuál expresión algebraica representa "el doble de un número más tres"?',
        opciones: ['A) x + 3', 'B) 2x + 3', 'C) 2 + 3x', 'D) 2(x + 3)'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Si "un número aumentado en 7 es igual a 15", plantea la ecuación y resuélvela.',
        respuesta:
          'Paso 1: Planteamos la ecuación: x + 7 = 15.\nPaso 2: Restamos 7 de ambos lados: x = 15 - 7.\nPaso 3: x = 8.\nRespuesta: El número es 8.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras cuál es la diferencia entre una expresión algebraica y una ecuación. Da un ejemplo de cada una.',
        respuesta:
          'Una expresión algebraica tiene números y letras pero sin signo igual, por ejemplo 3x + 2. Una ecuación tiene signo igual, por ejemplo 3x + 2 = 11, y se puede resolver para encontrar el valor de x.',
        criterios_aceptacion: [
          'expresión sin signo igual',
          'ecuación con signo igual',
          'ejemplo de expresión',
          'ejemplo de ecuación',
          'incógnita o resolver',
        ],
      },
    ],
  },
}
