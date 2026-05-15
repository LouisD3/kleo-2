import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 24b: Sector vs segmento circular
 * Concepto clave: Sector = porcion entre 2 radios + arco.
 *   Segmento circular = porcion entre cuerda + arco.
 *
 * Concreto: CompasCirculo (trazar circulo de radio 4, marcar un sector)
 * Pictorico: Diagrama geometrico — sector (90°) y segmento circular comparados
 * Abstracto: 3 preguntas progresivas sobre sector y segmento circular
 *
 * NOTA GEOMETRIA: Sector 0°→120° verified. Segmento chord from 220°→320°.
 *   A at 0°: (9,5). B at 120°: (3, 8.46).
 *   C at 220°: (1.94, 2.43). D at 320°: (8.06, 2.43).
 */
export const tareaSecuencia24b: TareaCPA = {
  secuencia_ref: 24,
  concepto_clave: 'Diferenciar sector circular y segmento circular',
  contexto: {
    personaje: 'Camila',
    objetos: {
      a: { nombre: 'sector', emoji: '🍕' },
      b: { nombre: 'segmento circular', emoji: '🌙' },
    },
    valores_clave: { radio: 4 },
    tipo: 'geometria',
    narrativa:
      'Camila corta una pizza y observa que cada rebanada es un sector. Luego nota que si corta con una linea recta, la parte curva que queda es un segmento circular.',
    pregunta_central: '¿Cual es la diferencia entre un sector y un segmento circular?',
    transiciones: {
      concreto: 'Traza un circulo de radio 4 y marca un sector con el compas.',
      bridge_pictorico:
        'El sector es como una rebanada de pizza (radios + arco). El segmento es la parte entre la cuerda y el arco.',
      pictorico: 'Observa sector y segmento circular en el diagrama.',
      bridge_abstracto:
        'El sector se define por un angulo central. El segmento circular se define por una cuerda.',
      abstracto: 'Ahora compara sectores y segmentos circulares.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'compas_circulo',
      centro: [5, 5],
      radio_objetivo: 4,
      elementos_a_trazar: ['sector'],
      pregunta:
        'Traza un circulo de radio 4 y observa el sector coloreado. El sector es la region entre dos radios y el arco.',
      pista:
        'El sector parece una rebanada de pizza: dos lineas rectas (radios) y una curva (arco). Ajusta el compas a 4 cuadros.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 10,
      alto: 10,
      puntos: [
        { id: 'o', x: 5, y: 5, label: 'O' },
        // Sector: A at 0°, B at 120°
        { id: 'a', x: 9, y: 5, label: 'A' },
        { id: 'b', x: 3, y: 8.46, label: 'B' },
        // Segmento circular: C at 220°, D at 320°
        // C: (5+4cos220°, 5+4sin220°) = (1.94, 2.43)
        // D: (5+4cos320°, 5+4sin320°) = (8.06, 2.43)
        { id: 'c', x: 1.94, y: 2.43, label: 'C' },
        { id: 'd', x: 8.06, y: 2.43, label: 'D' },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'o', hasta: 'a', color: 'azul', medida: 'r = 4' },
        { tipo: 'segmento', desde: 'o', hasta: 'b', color: 'azul', medida: 'r = 4' },
        {
          tipo: 'segmento',
          desde: 'c',
          hasta: 'd',
          color: 'verde',
          label: 'Cuerda CD',
          estilo: 'punteado',
        },
      ],
      circulos: [
        { centro_id: 'o', radio: 4, color: 'gris', estilo: 'borde', label: 'Circulo de radio 4' },
      ],
      arcos: [
        {
          centro_id: 'o',
          radio: 4,
          desde_grados: 0,
          hasta_grados: 120,
          color: 'azul',
          relleno: true,
          label: 'Sector (120°)',
        },
        {
          centro_id: 'o',
          radio: 4,
          desde_grados: 220,
          hasta_grados: 320,
          color: 'verde',
          relleno: false,
          label: 'Arco del segmento circular',
        },
      ],
      titulo: 'Sector (azul, entre radios) vs Segmento circular (verde, entre cuerda y arco)',
    },
    preguntas: [
      {
        pregunta:
          'El area azul entre los dos radios y el arco es el sector. ¿Que seria el segmento circular en este diagrama?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) Todo el circulo',
          'B) La region entre la cuerda AB y el arco',
          'C) La region entre los dos radios',
          'D) La cuerda AB',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Compara el sector y el segmento circular. ¿Que elementos los limitan a cada uno?',
        tipo: 'abierta',
        respuesta:
          'El sector esta limitado por dos radios y un arco: es como una rebanada de pizza completa. El segmento circular esta limitado por una cuerda y un arco: es la parte entre la cuerda y el borde curvo.',
        criterios_aceptacion: [
          'sector: dos radios y un arco',
          'segmento circular: cuerda y arco',
          'diferencia entre los limites',
          'sector incluye el centro',
        ],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Cual de estas afirmaciones es correcta?',
        opciones: [
          'A) El segmento circular siempre incluye el centro',
          'B) El sector siempre incluye el centro del circulo',
          'C) La cuerda y el radio son lo mismo',
          'D) El sector y el segmento son lo mismo',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un sector tiene un angulo central de 120° en un circulo de radio 6 cm. ¿Que fraccion del circulo completo ocupa el sector? Si el area del circulo es 113.04 cm² (pi = 3.14), ¿cual es el area del sector?',
        respuesta:
          'Paso 1: Fraccion = 120° / 360° = 1/3 del circulo.\nPaso 2: Area del sector = 1/3 x 113.04 = 37.68 cm².\nRespuesta: El sector ocupa 1/3 del circulo y su area es 37.68 cm².',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Piensa en una pizza cortada en 6 rebanadas iguales. Cada rebanada es un sector. Si cortas una rebanada con un corte recto (cuerda), ¿que figuras se forman? Explica.',
        respuesta:
          'Se forman dos partes: un triangulo (cerca de la punta, entre los dos radios y la cuerda) y un segmento circular (la parte curva entre la cuerda y la costra). El corte recto es la cuerda.',
        criterios_aceptacion: [
          'triangulo cerca de la punta',
          'segmento circular en la parte curva',
          'cuerda es el corte recto',
          'dos partes',
        ],
      },
    ],
  },
}
