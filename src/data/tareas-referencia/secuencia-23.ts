import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 23: Figuras relacionadas con el circulo
 * Concepto clave: Explorar la relacion entre radio y circunferencia
 *
 * Concreto: CompasCirculo (trazar circulo de radio 2, observar la circunferencia)
 * Pictorico: Modelo en barras (comparar radio y circunferencia)
 * Abstracto: 3 preguntas sobre circunferencia y pi
 */
export const tareaSecuencia23: TareaCPA = {
  secuencia_ref: 23,
  concepto_clave: 'Explorar la relacion entre radio y circunferencia',
  contexto: {
    personaje: 'Camila',
    objetos: { a: { nombre: 'circulo', emoji: '⭕' }, b: { nombre: 'cuerda', emoji: '🧵' } },
    valores_clave: { radio: 2 },
    tipo: 'geometria',
    narrativa: 'Camila envuelve una cuerda alrededor de un circulo de radio 2 para descubrir la relacion entre radio y circunferencia.',
    pregunta_central: '¿Cuanto mide la circunferencia de un circulo de radio 2?',
    transiciones: {
      concreto: 'Traza el circulo con el compas de radio 2 y mide su contorno.',
      bridge_pictorico: 'El diametro es 4. La circunferencia mide aproximadamente 12.56 (pi × 4).',
      pictorico: 'Observa la relacion entre diametro y circunferencia en el modelo.',
      bridge_abstracto: 'C = 2πr. Para r = 2, C ≈ 12.56.',
      abstracto: 'Ahora calcula circunferencias con otros radios.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'compas_circulo',
      centro: [4, 4],
      radio_objetivo: 2,
      elementos_a_trazar: ['radio'],
      pregunta:
        'Traza un circulo de radio 2 unidades. Observa la relacion entre el radio y el tamano del circulo.',
      pista: 'Ajusta el compas hasta que el radio mida exactamente 2 cuadros de la cuadricula.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Diametro (2r)', valor: 4, color: 'azul', subdivisiones: 4 },
        { label: 'Circunferencia (≈12.56)', valor: 12.56, color: 'verde' },
      ],
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El diametro de tu circulo es 4. La circunferencia mide aproximadamente 12.56. Cuantas veces cabe el diametro en la circunferencia?',
        tipo: 'opcion_multiple',
        opciones: ['A) Aproximadamente 2 veces', 'B) Aproximadamente 3 veces', 'C) Exactamente 4 veces', 'D) Aproximadamente 6 veces'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Si divides la circunferencia entre el diametro, siempre obtienes el mismo numero (aproximadamente 3.14). Como se llama ese numero?',
        tipo: 'abierta',
        respuesta: 'Ese numero se llama pi (π). Circunferencia / diametro = 12.56 / 4 = 3.14. Pi es siempre igual, sin importar el tamano del circulo.',
        criterios_aceptacion: ['pi o π', 'circunferencia / diametro', 'aproximadamente 3.14', 'constante'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Tu circulo tenia radio 2 y circunferencia de aproximadamente 12.56. Si el radio fuera 3, la circunferencia seria...',
        opciones: ['A) Mayor', 'B) Menor', 'C) Igual', 'D) No se puede saber'],
        respuesta: 'A',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Calcula la circunferencia de un circulo con radio 5. Usa la formula C = 2 x pi x radio (pi = 3.14).',
        respuesta: 'C = 2 x 3.14 x 5 = 31.4 unidades.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que el numero pi aparece siempre que se trabaja con circulos, sin importar su tamano.',
        respuesta:
          'Pi es la relacion entre la circunferencia y el diametro de cualquier circulo. No importa el tamano: si divides el borde entre el diametro, siempre obtienes aproximadamente 3.14. Es una constante de la forma circular.',
        criterios_aceptacion: [
          'relacion constante',
          'circunferencia entre diametro',
          'aproximadamente 3.14',
          'cualquier circulo',
        ],
      },
    ],
  },
}
