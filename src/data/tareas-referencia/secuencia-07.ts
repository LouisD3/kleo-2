import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 7: Propiedad conmutativa y asociativa
 * Concepto clave: Verificar que el orden de la suma no cambia el resultado
 *
 * Concreto: RectaNumerica (ubicar 5+3=8 en la recta, mismo punto que 3+5)
 * Pictorico: Dos caminos al mismo punto (5+3 vs 3+5)
 * Abstracto: 3 preguntas progresivas sobre conmutativa y asociativa
 */
export const tareaSecuencia07: TareaCPA = {
  secuencia_ref: 7,
  concepto_clave: 'Verificar que el orden de la suma no cambia el resultado',
  contexto: {
    personaje: 'Ana',
    objetos: { a: { nombre: 'salto', emoji: '🦘' }, b: { nombre: 'recta', emoji: '📏' } },
    valores_clave: { objetivo: 8 },
    tipo: 'numero',
    narrativa: 'Ana quiere comprobar que sumar en diferente orden da el mismo resultado. Usa la recta numerica para verificar.',
    pregunta_central: '¿Da lo mismo sumar 3 + 5 que 5 + 3?',
    transiciones: {
      concreto: 'Ubica el resultado de 3 + 5 en la recta numerica.',
      bridge_pictorico: 'Ambas sumas llegan al 8. El orden no cambia el resultado.',
      pictorico: 'Observa las dos sumas en el modelo de barras.',
      bridge_abstracto: 'Esto se llama propiedad conmutativa: a + b = b + a.',
      abstracto: 'Ahora aplica la propiedad conmutativa a otras operaciones.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'recta_numerica',
      min: 0,
      max: 10,
      divisiones: 10,
      objetivo: 8,
      etiquetas: [
        { posicion: 0, texto: '0' },
        { posicion: 5, texto: '5' },
        { posicion: 10, texto: '10' },
      ],
      pregunta:
        'Primero calcula 3 + 5 y ubica el resultado en la recta numerica. Ahora piensa: si sumas al reves, 5 + 3, ¿el resultado es el mismo punto?',
      pista: '3 + 5 = 8 y 5 + 3 = 8. No importa el orden: ambas sumas llegan al 8. Ubica el 8.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Camino A: 5 + 3', valor: 8, color: 'amarillo', subdivisiones: 2 },
        { label: 'Camino B: 3 + 5', valor: 8, color: 'azul', subdivisiones: 2 },
      ],
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Las dos barras tienen la misma longitud: 5+3 = 3+5 = 8. Como se llama esta propiedad de la suma?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Propiedad distributiva',
          'B) Propiedad asociativa',
          'C) Propiedad conmutativa',
          'D) Propiedad de identidad',
        ],
        respuesta: 'C',
      },
      {
        pregunta:
          'Verifica la propiedad conmutativa con 12 + 25 y 25 + 12. Da el mismo resultado? Muestra la operacion.',
        tipo: 'calculo',
        respuesta:
          '12 + 25 = 37 y 25 + 12 = 37. Si, ambas sumas dan 37. La propiedad conmutativa se cumple: el orden de los sumandos no altera la suma.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Viste que 5+3 = 3+5 en la recta. La resta cumple la propiedad conmutativa? Es decir, 8-3 = 3-8?',
        opciones: [
          'A) Si, siempre dan igual',
          'B) No, 8-3=5 pero 3-8=-5',
          'C) Solo con numeros positivos',
          'D) Solo con numeros pares',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Usa la propiedad asociativa para calcular 17 + 45 + 3 de la forma mas facil. Muestra como reagrupas.',
        respuesta:
          'Reagrupo: 17 + 3 + 45 (conmutativa) = (17 + 3) + 45 (asociativa) = 20 + 45 = 65. Es mas facil porque 17 + 3 da un numero redondo.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que la suma es conmutativa pero la resta no. Usa la recta numerica para explicarlo.',
        respuesta:
          'En la suma, el orden no importa: 5+3 y 3+5 llegan al mismo punto en la recta. En la resta si importa: 8-3=5, pero 3-8=-5, que es un punto diferente.',
        criterios_aceptacion: [
          'orden no importa en suma',
          'orden si importa en resta',
          'ejemplo numerico correcto',
          'referencia a la recta numerica',
        ],
      },
    ],
  },
}
