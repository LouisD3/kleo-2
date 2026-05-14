import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 15a: Proporcionalidad
 * Concepto clave: Encontrar la constante de proporcionalidad
 *
 * Concreto: DulcesAgrupables (15 galletas, 5 grupos)
 * Pictorico: Modelo en barras (5 barras de 3, total 15)
 * Abstracto: 3 preguntas con progresion de dificultad sobre constante de proporcionalidad
 */
export const tareaSecuencia15a: TareaCPA = {
  secuencia_ref: 15,
  contexto: {
    personaje: 'Daniela',
    objetos: { a: { nombre: 'galleta', emoji: '🍪' }, b: { nombre: 'amigo', emoji: '🧑' } },
    valores_clave: { razon: [3, 1], objetivo: 15 },
    tipo: 'proporcion',
    narrativa: 'Daniela reparte 15 galletas entre 5 amigos. Siempre da la misma cantidad a cada uno. Quiere encontrar la constante de proporcionalidad.',
    pregunta_central: '¿Cuantas galletas recibe cada amigo?',
    transiciones: {
      concreto: 'Agrupa las 15 galletas en 5 grupos iguales.',
      bridge_pictorico: '15 galletas ÷ 5 amigos = 3 galletas cada uno. La constante es 3.',
      pictorico: 'Observa la relacion proporcional en el modelo.',
      bridge_abstracto: 'La constante de proporcionalidad k = 3 galletas/amigo.',
      abstracto: 'Ahora encuentra constantes en otras relaciones.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'dulces_agrupables',
      cantidad: 15,
      grupos_objetivo: 5,
      soluciones_validas: [{ grupos: 5, por_grupo: 3 }],
      pregunta:
        'Hay 15 galletas para 5 amigos. Agrupalas para que cada uno reciba igual.',
      pista: 'Reparte las galletas una por una entre los 5 amigos hasta que se acaben.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Amigo 1', valor: 3, color: 'amarillo', subdivisiones: 3 },
        { label: 'Amigo 2', valor: 3, color: 'azul', subdivisiones: 3 },
        { label: 'Amigo 3', valor: 3, color: 'verde', subdivisiones: 3 },
        { label: 'Amigo 4', valor: 3, color: 'morado', subdivisiones: 3 },
        { label: 'Amigo 5', valor: 3, color: 'naranja', subdivisiones: 3 },
      ],
      total: { valor: 15, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta: 'Segun el modelo, cuantas galletas recibe cada amigo?',
        tipo: 'opcion_multiple',
        opciones: ['A) 2 galletas', 'B) 3 galletas', 'C) 5 galletas', 'D) 15 galletas'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Todas las barras miden lo mismo. Que numero se repite siempre al dividir las galletas entre los amigos? Escribe la operacion.',
        tipo: 'calculo',
        respuesta:
          'Se divide: 15 galletas / 5 amigos = 3 galletas por amigo. El numero que se repite siempre es 3. Esta es la constante de proporcionalidad: k = 3.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'La constante k = galletas / amigos = 15 / 5 es igual a:',
        opciones: ['A) 2', 'B) 3', 'C) 5', 'D) 10'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un grifo llena 12 litros en 4 minutos. Cual es la constante de proporcionalidad k? Muestra el procedimiento.',
        respuesta:
          'Paso 1: k = litros / minutos.\nPaso 2: k = 12 / 4 = 3 litros por minuto.\nRespuesta: La constante de proporcionalidad es k = 3 litros por minuto.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que es la constante de proporcionalidad usando el ejemplo de las galletas.',
        respuesta:
          'La constante k es el numero que siempre sale al dividir galletas entre amigos: 15/5 = 3. Significa que cada amigo recibe 3 galletas sin importar cuantos sean. Con k = 3 puedes calcular el total multiplicando: amigos x 3.',
        criterios_aceptacion: ['division galletas entre amigos', 'k = 3', 'relacion constante', 'multiplicacion para predecir'],
      },
    ],
  },
}
