import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 24: Partes del circulo
 * Concepto clave: Identificar sector circular y arco
 *
 * Concreto: CompasCirculo (trazar circulo de radio 4, con sector visible)
 * Pictorico: Modelo en barras (sector como fraccion del circulo)
 * Abstracto: 3 preguntas sobre sectores y arcos
 */
export const tareaSecuencia24: TareaCPA = {
  secuencia_ref: 24,
  concepto_clave: 'Identificar sector circular y arco',
  contexto: {
    personaje: 'Camila',
    objetos: { a: { nombre: 'sector', emoji: '🍕' }, b: { nombre: 'arco', emoji: '🌙' } },
    valores_clave: { radio: 4 },
    tipo: 'geometria',
    narrativa: 'Camila corta una pizza circular y observa que cada rebanada forma un sector circular con un arco en el borde.',
    pregunta_central: '¿Que son un sector circular y un arco?',
    transiciones: {
      concreto: 'Traza el circulo y marca un sector con el compas.',
      bridge_pictorico: 'El sector es la rebanada, el arco es el borde curvo.',
      pictorico: 'Observa sector y arco en el modelo.',
      bridge_abstracto: 'El sector depende del angulo central y el radio.',
      abstracto: 'Ahora identifica y calcula sectores y arcos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'compas_circulo',
      centro: [4, 4],
      radio_objetivo: 4,
      elementos_a_trazar: ['radio', 'sector'],
      pregunta:
        'Traza un circulo de radio 4 unidades. Observa el sector coloreado: es la region entre dos radios.',
      pista: 'Ajusta el compas a 4 cuadros. El sector es como una rebanada de pizza entre dos radios.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 8,
      alto: 8,
      puntos: [
        { id: 'o', x: 4, y: 4, label: 'O' },
        { id: 'r1', x: 8, y: 4 },
        { id: 'r2', x: 4, y: 8 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'o', hasta: 'r1', color: 'azul', medida: 'r = 4' },
        { tipo: 'segmento', desde: 'o', hasta: 'r2', color: 'azul', medida: 'r = 4' },
      ],
      angulos: [
        { vertice: 'o', lado_a: 'r1', lado_b: 'r2', medida: '90°', color: 'azul' },
      ],
      titulo: 'Sector circular de 90° (1/4 del circulo)',
    },
    preguntas: [
      {
        pregunta:
          'El sector coloreado es 1/4 del circulo. Que fraccion del circulo NO esta coloreada?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1/4', 'B) 1/2', 'C) 3/4', 'D) 2/4'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si el circulo completo tiene un angulo de 360 grados, cuantos grados tiene el sector de 1/4?',
        tipo: 'calculo',
        respuesta: 'El sector es 1/4 del circulo. 360 / 4 = 90 grados. El sector mide 90 grados.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En tu circulo, el sector de 1/4 mide 90 grados. Un sector de medio circulo mediria...',
        opciones: ['A) 90 grados', 'B) 180 grados', 'C) 270 grados', 'D) 360 grados'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Una pizza se corta en 8 rebanadas iguales. Cuantos grados mide el angulo de cada rebanada? Si te comes 3 rebanadas, cuantos grados de pizza te comiste?',
        respuesta:
          'Paso 1: Cada rebanada = 360 / 8 = 45 grados.\nPaso 2: 3 rebanadas = 3 x 45 = 135 grados.\nRespuesta: Cada rebanada mide 45 grados y 3 rebanadas suman 135 grados.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras la diferencia entre un sector y un arco de un circulo. Usa el ejemplo de la pizza.',
        respuesta:
          'El sector es toda la rebanada de pizza: las dos orillas rectas y la parte curva. El arco es solo la costra (la parte curva del borde). El sector es una superficie y el arco es una linea curva.',
        criterios_aceptacion: [
          'sector: superficie o region',
          'arco: solo la parte curva',
          'radios forman el sector',
          'arco es el borde curvo',
        ],
      },
    ],
  },
}
