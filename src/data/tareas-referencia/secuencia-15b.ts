import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 15b: Proporcionalidad
 * Concepto clave: Usar la constante para predecir
 *
 * Concreto: DulcesAgrupables (15 galletas, 5 grupos)
 * Pictorico: Modelo en barras con k=3, pregunta predictiva para 8 amigos
 * Abstracto: 3 preguntas con progresion de dificultad sobre prediccion con constante
 */
export const tareaSecuencia15b: TareaCPA = {
  secuencia_ref: 15,
  concreto: {
    manipulable: {
      tipo_concreto: 'dulces_agrupables',
      cantidad: 15,
      grupos_objetivo: 5,
      soluciones_validas: [{ grupos: 5, por_grupo: 3 }],
      pregunta:
        '15 galletas entre 5 amigos. Agrupa para encontrar cuantas recibe cada uno.',
      pista: 'Distribuye las galletas una por una entre los 5 amigos.',
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
      incognita: { posicion: 'total', label: '8 amigos = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Cada amigo recibe 3 galletas (k = 3). Si ahora fueran 8 amigos, cuantas galletas se necesitarian?',
        tipo: 'opcion_multiple',
        opciones: ['A) 11 galletas', 'B) 16 galletas', 'C) 24 galletas', 'D) 40 galletas'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Usaste la constante k = 3 para predecir. Escribe la operacion que hiciste para 8 amigos.',
        tipo: 'calculo',
        respuesta:
          'La constante es k = 3 galletas por amigo. Para 8 amigos: galletas = k x amigos = 3 x 8 = 24 galletas. Se necesitan 24 galletas.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Si k = 3 galletas por amigo, cuantas galletas se necesitan para 7 amigos?',
        opciones: ['A) 10', 'B) 14', 'C) 21', 'D) 28'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un coche recorre 60 km en 1 hora. Cuantos kilometros recorre en 4 horas? Muestra el procedimiento.',
        respuesta:
          'Paso 1: La constante es k = 60 km por hora.\nPaso 2: Distancia = k x tiempo = 60 x 4 = 240 km.\nRespuesta: En 4 horas recorre 240 km.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica como la constante de proporcionalidad te permite predecir sin contar uno por uno.',
        respuesta:
          'Con k = 3, solo multiplico: amigos x 3 = galletas totales. No necesito repartir una por una porque la relacion siempre es la misma. Por ejemplo, 8 amigos x 3 = 24 galletas.',
        criterios_aceptacion: ['multiplicacion con k', 'relacion siempre igual', 'prediccion sin contar', 'ejemplo con numeros'],
      },
    ],
  },
}
