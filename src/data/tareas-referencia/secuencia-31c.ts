import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 31c: Moda
 * Concepto clave: Identificar la moda como el dato que mas se repite
 *
 * Concreto: HistogramaConstruible (sabor favorito de helado, 12 alumnos)
 * Pictorico: Modelo en barras vertical (la barra mas alta = moda)
 * Abstracto: 3 preguntas progresivas sobre moda
 */
export const tareaSecuencia31c: TareaCPA = {
  secuencia_ref: 31,
  contexto: {
    personaje: 'Profesor Garcia',
    objetos: { a: { nombre: 'sabor', emoji: '🍦' }, b: { nombre: 'moda', emoji: '📊' } },
    valores_clave: { moda: 'Chocolate', frecuencia_moda: 5 },
    tipo: 'estadistica',
    narrativa: 'El Profesor Garcia encuesto a 12 alumnos sobre su sabor de helado favorito. Quiere saber cual es el mas popular: eso es la moda.',
    pregunta_central: '¿Cual sabor es la moda?',
    transiciones: {
      concreto: 'Construye el histograma contando cuantos alumnos prefieren cada sabor.',
      bridge_pictorico: 'Chocolate: 5, Vainilla: 3, Fresa: 4. La barra mas alta es Chocolate.',
      pictorico: 'Observa cual barra es la mas alta en el modelo. Esa es la moda.',
      bridge_abstracto: 'La moda es el dato que mas se repite. No se calcula, se observa.',
      abstracto: 'Ahora identifica la moda en otros conjuntos de datos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'histograma_construible',
      categorias: [
        { label: 'Chocolate', color: 'amarillo' },
        { label: 'Vainilla', color: 'azul' },
        { label: 'Fresa', color: 'rojo' },
      ],
      frecuencias_objetivo: [5, 3, 4],
      datos_brutos: [
        'Chocolate', 'Fresa', 'Vainilla', 'Chocolate', 'Fresa',
        'Chocolate', 'Vainilla', 'Fresa', 'Chocolate', 'Vainilla',
        'Fresa', 'Chocolate',
      ],
      pregunta:
        'Se encuesto a 12 alumnos sobre su sabor de helado favorito. Cuenta las respuestas y construye la grafica.',
      pista:
        'Recorre la lista y cuenta: Chocolate aparece varias veces. La barra mas alta sera la moda.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Chocolate', valor: 5, color: 'amarillo' },
        { label: 'Vainilla', valor: 3, color: 'azul' },
        { label: 'Fresa', valor: 4, color: 'rojo' },
      ],
      total: { valor: 12, visible: true },
      orientacion: 'vertical',
    },
    preguntas: [
      {
        pregunta:
          'Observa la grafica. Cual sabor tiene la barra mas alta? Ese es la moda.',
        tipo: 'opcion_multiple',
        opciones: ['A) Vainilla (3)', 'B) Fresa (4)', 'C) Chocolate (5)', 'D) Todos iguales'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Explica la diferencia entre la moda y la media usando los datos de los helados.',
        tipo: 'abierta',
        respuesta:
          'La moda es el sabor que mas se repite: Chocolate (5 veces). No se puede calcular una "media" de sabores porque son categorias, no numeros. La moda es la unica medida de tendencia central que funciona con datos no numericos.',
        criterios_aceptacion: ['moda es el mas frecuente', 'chocolate 5 veces', 'no se puede promediar categorias', 'moda funciona con datos no numericos'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Los datos son: 3, 5, 7, 5, 8, 5, 9. La moda es:',
        opciones: ['A) 3', 'B) 5', 'C) 7', 'D) 9'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Las edades de 10 personas son: 12, 14, 14, 15, 15, 15, 16, 16, 18, 20. Encuentra la moda y explica si puede haber mas de una moda.',
        respuesta:
          'La moda es 15 porque aparece 3 veces (mas que cualquier otra). Si dos valores empataran en frecuencia maxima, habria dos modas (bimodal). Aqui solo hay una moda: 15.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Una tienda de zapatos quiere saber que talla pedir mas al proveedor. Le conviene mas usar la media o la moda de las tallas vendidas? Explica por que.',
        respuesta:
          'La moda es mas util porque indica la talla que mas se vende. La media podria dar una talla que no existe (como 38.7). La tienda necesita pedir tallas enteras y muchas de la mas popular.',
        criterios_aceptacion: ['moda mas util para la tienda', 'media puede dar talla inexistente', 'talla mas vendida', 'decision practica basada en frecuencia'],
      },
    ],
  },
}
