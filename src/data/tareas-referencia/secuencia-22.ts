import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 22: Rectas notables en el circulo
 * Concepto clave: Identificar radio y diametro usando un compas
 *
 * Concreto: CompasCirculo (ajustar el radio a 3 unidades)
 * Pictorico: Modelo en barras (radio vs diametro)
 * Abstracto: 3 preguntas progresivas sobre radio y diametro
 */
export const tareaSecuencia22: TareaCPA = {
  secuencia_ref: 22,
  contexto: {
    personaje: 'Camila',
    objetos: { a: { nombre: 'circulo', emoji: '⭕' }, b: { nombre: 'compas', emoji: '📐' } },
    valores_clave: { radio: 3 },
    tipo: 'geometria',
    narrativa: 'Camila usa un compas para trazar circulos y descubrir la relacion entre radio y diametro.',
    pregunta_central: '¿Cual es la relacion entre radio y diametro?',
    transiciones: {
      concreto: 'Ajusta el compas para trazar un circulo de radio 3.',
      bridge_pictorico: 'El diametro siempre es el doble del radio: d = 2r.',
      pictorico: 'Observa radio y diametro en el modelo.',
      bridge_abstracto: 'Radio = 3, Diametro = 6. Siempre d = 2r.',
      abstracto: 'Ahora calcula radios y diametros.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'compas_circulo',
      centro: [4, 4],
      radio_objetivo: 3,
      elementos_a_trazar: ['radio', 'diametro'],
      pregunta:
        'Usa el compas para trazar un circulo con radio de 3 unidades. Ajusta el radio hasta que mida exactamente 3.',
      pista: 'Cuenta los cuadros de la cuadricula desde el centro hasta el borde. Deben ser exactamente 3.',
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
        { id: 'r', x: 7, y: 4, label: 'R' },
        { id: 'd1', x: 1, y: 4 },
        { id: 'd2', x: 7, y: 4 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'o', hasta: 'r', color: 'rojo', medida: 'r = 3', label: 'Radio' },
        { tipo: 'segmento', desde: 'd1', hasta: 'd2', color: 'azul', medida: 'd = 6', label: 'Diametro', estilo: 'punteado' },
      ],
      titulo: 'Circulo: radio = 3, diametro = 6',
    },
    preguntas: [
      {
        pregunta:
          'Trazaste un circulo con radio 3. Segun el modelo, cuanto mide el diametro?',
        tipo: 'opcion_multiple',
        opciones: ['A) 3', 'B) 6', 'C) 9', 'D) 12'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Si el diametro siempre es el doble del radio, cuanto mediria el radio de un circulo con diametro de 10 unidades?',
        tipo: 'calculo',
        respuesta: 'El radio es la mitad del diametro. Radio = 10 / 2 = 5 unidades.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En el circulo que trazaste, el radio mide 3 y el diametro mide 6. Cual es la relacion entre radio y diametro?',
        opciones: [
          'A) Diametro = radio + 3',
          'B) Diametro = 2 x radio',
          'C) Radio = 2 x diametro',
          'D) Son iguales',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Una rueda de bicicleta tiene un radio de 35 cm. Cuanto mide su diametro? Si la rueda da una vuelta completa, cuanta distancia recorre? (Usa pi = 3.14)',
        respuesta:
          'Paso 1: Diametro = 2 x 35 = 70 cm.\nPaso 2: Circunferencia = pi x diametro = 3.14 x 70 = 219.8 cm.\nRespuesta: El diametro mide 70 cm y en una vuelta recorre aproximadamente 219.8 cm.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que es el radio y que es el diametro de un circulo. Por que el diametro siempre es el doble del radio?',
        respuesta:
          'El radio va del centro al borde del circulo. El diametro cruza el circulo de lado a lado pasando por el centro. El diametro siempre es el doble del radio porque esta formado por dos radios juntos.',
        criterios_aceptacion: [
          'radio: del centro al borde',
          'diametro: cruza el centro',
          'diametro = 2 x radio',
          'dos radios',
        ],
      },
    ],
  },
}
