import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 17b: Angulo obtuso
 * Concepto clave: Medir y reconocer angulos obtusos (entre 90° y 180°)
 *
 * Concreto: Transportador (medir un angulo de 135°)
 * Pictorico: Diagrama geometrico — comparar un angulo obtuso con uno recto
 * Abstracto: 3 preguntas progresivas sobre angulos obtusos
 */
export const tareaSecuencia17b: TareaCPA = {
  secuencia_ref: 17,
  concepto_clave: 'Medir y reconocer angulos obtusos (entre 90° y 180°)',
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'angulo', emoji: '📐' }, b: { nombre: 'grado', emoji: '°' } },
    valores_clave: { angulo: 135 },
    tipo: 'geometria',
    narrativa: 'Roberto mide un angulo que "se abre" mas que un angulo recto. Se llama angulo obtuso y mide entre 90° y 180°.',
    pregunta_central: '¿Cuanto mide un angulo obtuso y como se reconoce?',
    transiciones: {
      concreto: 'Arrastra el brazo del transportador hasta medir un angulo de 135°.',
      bridge_pictorico: '135° es un angulo obtuso porque esta entre 90° y 180°.',
      pictorico: 'Compara el angulo obtuso con el angulo recto en el diagrama.',
      bridge_abstracto: 'Agudo < 90° < Recto < Obtuso < 180° = Llano.',
      abstracto: 'Ahora clasifica y calcula con angulos obtusos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'transportador',
      angulo_objetivo: 135,
      tolerancia: 5,
      angulo_inicial: 0,
      pregunta:
        'Arrastra el brazo del transportador hasta medir un angulo de 135°. Es un angulo obtuso.',
      pista: 'Un angulo obtuso esta entre 90° y 180°. 135° esta justo a la mitad entre 90° y 180°.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 8,
      alto: 5,
      puntos: [
        { id: 'v1', x: 2, y: 4 },
        { id: 'a1', x: 4, y: 4 },
        { id: 'b1', x: 2, y: 2 },
        { id: 'v2', x: 6, y: 4 },
        { id: 'a2', x: 8, y: 4 },
        { id: 'b2', x: 4.6, y: 2.6 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'v1', hasta: 'a1', color: 'azul' },
        { tipo: 'segmento', desde: 'v1', hasta: 'b1', color: 'azul' },
        { tipo: 'segmento', desde: 'v2', hasta: 'a2', color: 'rojo' },
        { tipo: 'segmento', desde: 'v2', hasta: 'b2', color: 'rojo' },
      ],
      angulos: [
        { vertice: 'v1', lado_a: 'a1', lado_b: 'b1', medida: '90°', color: 'azul' },
        { vertice: 'v2', lado_a: 'a2', lado_b: 'b2', medida: '135°', color: 'rojo' },
      ],
      titulo: 'Comparacion: angulo recto (90°) vs angulo obtuso (135°)',
    },
    preguntas: [
      {
        pregunta:
          'El diagrama muestra dos angulos. Cual es el angulo obtuso?',
        tipo: 'opcion_multiple',
        opciones: ['A) El azul (90°)', 'B) El rojo (135°)', 'C) Ambos', 'D) Ninguno'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Un angulo obtuso mide entre 90° y 180°. Si un angulo obtuso mide 135°, cuantos grados le faltan para ser un angulo llano (180°)?',
        tipo: 'abierta',
        respuesta:
          'Le faltan 180° - 135° = 45° para ser un angulo llano. Un angulo llano mide exactamente 180° y forma una linea recta.',
        criterios_aceptacion: ['180 - 135 = 45', 'angulo llano = 180°', 'linea recta', 'obtuso entre 90 y 180'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Un angulo de 170° es:',
        opciones: ['A) Agudo', 'B) Recto', 'C) Obtuso', 'D) Llano'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En un triangulo, dos angulos miden 30° y 40°. Calcula el tercer angulo y clasificalo (agudo, recto u obtuso).',
        respuesta:
          'Paso 1: La suma de angulos de un triangulo es 180°.\nPaso 2: Tercer angulo = 180° - 30° - 40° = 110°.\nPaso 3: 110° esta entre 90° y 180°, asi que es obtuso.\nRespuesta: El tercer angulo mide 110° y es obtuso.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Un triangulo puede tener maximo un angulo obtuso. Explica por que no puede tener dos angulos obtusos.',
        respuesta:
          'Si un angulo obtuso mide mas de 90°, dos obtusos sumarian mas de 180°. Pero la suma total de los tres angulos de un triangulo es exactamente 180°. Con dos obtusos ya se pasaria de 180° sin contar el tercero.',
        criterios_aceptacion: ['suma de angulos = 180°', 'dos obtusos suman mas de 180°', 'no queda espacio para el tercero', 'maximo un obtuso'],
      },
    ],
  },
}
