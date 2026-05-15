import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 19b: Angulos congruentes
 * Concepto clave: Dos angulos son congruentes si tienen la misma medida
 *
 * Concreto: Transportador (medir un angulo de 60°)
 * Pictorico: Diagrama geometrico — 2 angulos de 60° en posiciones diferentes
 * Abstracto: 3 preguntas progresivas sobre angulos congruentes
 *
 * NOTA GEOMETRIA: Ambos angulos verificados con producto escalar:
 *   Angulo 1: v1(1,5), a1(4,5), b1(2.5,2.4)
 *     vec_a=(3,0), vec_b=(1.5,-2.6), dot=4.5, |a|=3, |b|=sqrt(2.25+6.76)=3.001
 *     cos=4.5/9.003=0.4999 => 60°
 *   Angulo 2: v2(7,3), a2(4,3), b2(5.5,5.6)
 *     vec_a=(-3,0), vec_b=(-1.5,2.6), dot=4.5, |a|=3, |b|=3.001
 *     cos=4.5/9.003=0.4999 => 60°
 */
export const tareaSecuencia19b: TareaCPA = {
  secuencia_ref: 19,
  concepto_clave: 'Dos angulos son congruentes si tienen la misma medida',
  contexto: {
    personaje: 'Elena',
    objetos: { a: { nombre: 'angulo', emoji: '📐' }, b: { nombre: 'medida', emoji: '📏' } },
    valores_clave: { angulo: 60 },
    tipo: 'geometria',
    narrativa:
      'Elena mide dos angulos en posiciones diferentes y descubre que ambos miden 60°. Aunque se ven distintos, son congruentes.',
    pregunta_central: '¿Dos angulos en posiciones diferentes pueden ser congruentes?',
    transiciones: {
      concreto: 'Usa el transportador para medir un angulo de 60°.',
      bridge_pictorico: 'El angulo mide 60° sin importar donde este colocado.',
      pictorico: 'Observa dos angulos de 60° en posiciones diferentes.',
      bridge_abstracto:
        'Dos angulos son congruentes si tienen la misma medida, sin importar su posicion.',
      abstracto: 'Ahora identifica y calcula angulos congruentes.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'transportador',
      angulo_objetivo: 60,
      tolerancia: 5,
      pregunta:
        'Elena ve un angulo y quiere medirlo. Ajusta el transportador hasta que marque 60°.',
      pista:
        'Gira el transportador poco a poco. 60° esta entre 0° y 90°, mas cerca de los dos tercios.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 10,
      alto: 7,
      puntos: [
        { id: 'v1', x: 1, y: 5, label: 'A' },
        { id: 'a1', x: 4, y: 5 },
        { id: 'b1', x: 2.5, y: 2.4 },
        { id: 'v2', x: 7, y: 3, label: 'B' },
        { id: 'a2', x: 4, y: 3 },
        { id: 'b2', x: 5.5, y: 5.6 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'v1', hasta: 'a1', color: 'azul' },
        { tipo: 'segmento', desde: 'v1', hasta: 'b1', color: 'azul' },
        { tipo: 'segmento', desde: 'v2', hasta: 'a2', color: 'verde' },
        { tipo: 'segmento', desde: 'v2', hasta: 'b2', color: 'verde' },
      ],
      angulos: [
        { vertice: 'v1', lado_a: 'a1', lado_b: 'b1', medida: '60°', color: 'azul' },
        { vertice: 'v2', lado_a: 'a2', lado_b: 'b2', medida: '60°', color: 'verde' },
      ],
      titulo: 'Dos angulos de 60° en posiciones diferentes (congruentes)',
    },
    preguntas: [
      {
        pregunta:
          'El diagrama muestra dos angulos en posiciones diferentes. Ambos miden 60°. ¿Son congruentes?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) No, porque estan en posiciones diferentes',
          'B) Si, porque tienen la misma medida',
          'C) No, porque uno apunta a la derecha y otro a la izquierda',
          'D) Solo si estan en la misma posicion',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Explica que significa que dos angulos sean congruentes. ¿Importa la posicion o el tamano de los lados?',
        tipo: 'abierta',
        respuesta:
          'Dos angulos son congruentes cuando tienen la misma medida. No importa donde esten ubicados ni que tan largos sean sus lados. Solo importa la abertura del angulo.',
        criterios_aceptacion: [
          'misma medida',
          'posicion no importa',
          'largo de los lados no importa',
          'abertura del angulo',
        ],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Un angulo mide 45° y otro angulo en otra posicion tambien mide 45°. ¿Que podemos afirmar?',
        opciones: [
          'A) Son complementarios',
          'B) Son suplementarios',
          'C) Son congruentes',
          'D) Son opuestos por el vertice',
        ],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En un triangulo isosceles, los dos angulos de la base son congruentes y el angulo del vertice mide 50°. ¿Cuanto mide cada angulo de la base? Muestra el procedimiento.',
        respuesta:
          'Paso 1: La suma de angulos de un triangulo es 180°.\nPaso 2: Los dos angulos de la base suman 180° - 50° = 130°.\nPaso 3: Como son congruentes, cada uno mide 130° / 2 = 65°.\nRespuesta: Cada angulo de la base mide 65°.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Cuando dos rectas se cruzan, se forman 4 angulos. ¿Los angulos opuestos por el vertice son siempre congruentes? Explica por que.',
        respuesta:
          'Si, los angulos opuestos por el vertice siempre son congruentes. Al cruzarse dos rectas, cada par de angulos opuestos tiene la misma medida porque ambos son suplementarios del mismo angulo adyacente.',
        criterios_aceptacion: [
          'siempre congruentes',
          'misma medida',
          'dos pares de angulos',
          'suplementarios del mismo angulo',
        ],
      },
    ],
  },
}
