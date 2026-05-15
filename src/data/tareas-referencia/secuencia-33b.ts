import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 33b: Eventos independientes
 * Concepto clave: P(A y B) = P(A) x P(B) cuando los eventos son independientes
 *
 * Concreto: DadosRuleta tipo moneda (lanzar moneda 8 veces para explorar)
 * Pictorico: Tabla 2x2 con los 4 resultados de lanzar 2 monedas
 * Abstracto: 3 preguntas progresivas sobre eventos independientes
 */
export const tareaSecuencia33b: TareaCPA = {
  secuencia_ref: 33,
  concepto_clave: 'P(A y B) = P(A) x P(B) cuando los eventos son independientes',
  contexto: {
    personaje: 'Pablo',
    objetos: { a: { nombre: 'moneda', emoji: '🪙' }, b: { nombre: 'resultado', emoji: '📊' } },
    valores_clave: { probabilidad_cara_cara: 0.25 },
    tipo: 'probabilidad',
    narrativa:
      'Pablo lanza 2 monedas al mismo tiempo y quiere saber la probabilidad de que ambas caigan en cara. Descubre que los resultados de cada moneda no se afectan entre si.',
    pregunta_central: '¿Cual es la probabilidad de obtener cara en ambas monedas?',
    transiciones: {
      concreto: 'Lanza la moneda varias veces y observa los resultados.',
      bridge_pictorico:
        'Cada moneda tiene 2 resultados. Con 2 monedas hay 4 combinaciones posibles.',
      pictorico: 'Observa las 4 combinaciones en la tabla.',
      bridge_abstracto: 'P(cara y cara) = P(cara) x P(cara) = 1/2 x 1/2 = 1/4.',
      abstracto: 'Ahora calcula probabilidades de eventos independientes.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'dados_ruleta',
      tipo: 'moneda',
      lanzamientos: 8,
      evento_favorable: 'Que caiga cara',
      respuesta_probabilidad: '1/2',
      pregunta:
        'Lanza la moneda 8 veces y registra cuantas veces cae cara. Si lanzaras 2 monedas a la vez, ¿cual seria la probabilidad de que ambas caigan en cara?',
      pista:
        'Cada moneda tiene 2 resultados: cara o cruz. La probabilidad de cara en una moneda es 1/2. Para 2 monedas, multiplica: 1/2 x 1/2 = 1/4.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'moneda1', header: 'Moneda 1' },
        { key: 'moneda2', header: 'Moneda 2' },
        { key: 'resultado', header: 'Resultado' },
      ],
      filas: [
        { moneda1: 'Cara', moneda2: 'Cara', resultado: 'Cara-Cara' },
        { moneda1: 'Cara', moneda2: 'Cruz', resultado: 'Cara-Cruz' },
        { moneda1: 'Cruz', moneda2: 'Cara', resultado: 'Cruz-Cara' },
        { moneda1: 'Cruz', moneda2: 'Cruz', resultado: 'Cruz-Cruz' },
      ],
      resaltados: [{ fila: 0, columna: 'resultado', color: '#10B981' }],
      titulo: 'Espacio muestral: 2 monedas lanzadas al mismo tiempo',
    },
    preguntas: [
      {
        pregunta:
          'La tabla muestra los 4 resultados posibles al lanzar 2 monedas. ¿Cuantos resultados dan cara en ambas monedas?',
        tipo: 'opcion_multiple',
        opciones: ['A) 1 de 4', 'B) 2 de 4', 'C) 3 de 4', 'D) 4 de 4'],
        respuesta: 'A',
      },
      {
        pregunta:
          'La probabilidad de cara en una moneda es 1/2. Para saber la probabilidad de cara en ambas monedas, ¿que operacion haces? Calcula el resultado.',
        tipo: 'calculo',
        respuesta:
          'Como los eventos son independientes, se multiplican las probabilidades.\nP(cara y cara) = P(cara) x P(cara) = 1/2 x 1/2 = 1/4.\nLa probabilidad de obtener cara en ambas monedas es 1/4.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Dos eventos son independientes cuando el resultado de uno NO afecta al otro. ¿Cual de estos pares son eventos independientes?',
        opciones: [
          'A) Sacar una carta roja y luego otra carta roja sin devolver la primera',
          'B) Lanzar un dado y luego lanzar una moneda',
          'C) Elegir un alumno y luego elegir otro del mismo grupo (sin reemplazo)',
          'D) Sacar una canica y luego otra sin devolver la primera',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Se lanza un dado y una moneda al mismo tiempo. ¿Cual es la probabilidad de obtener un 6 en el dado Y cara en la moneda? Muestra el procedimiento.',
        respuesta:
          'Paso 1: P(6 en el dado) = 1/6.\nPaso 2: P(cara en la moneda) = 1/2.\nPaso 3: Son eventos independientes, asi que P(6 y cara) = 1/6 x 1/2 = 1/12.\nRespuesta: La probabilidad es 1/12.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que significa que dos eventos sean independientes y da un ejemplo de eventos que NO sean independientes.',
        respuesta:
          'Dos eventos son independientes cuando el resultado de uno no cambia la probabilidad del otro. Por ejemplo, lanzar dos dados es independiente. Sacar canicas de una bolsa sin devolverlas NO es independiente, porque cada vez que sacas una, cambian las probabilidades.',
        criterios_aceptacion: [
          'resultado de uno no afecta al otro',
          'ejemplo de eventos independientes',
          'ejemplo de eventos no independientes',
          'cambio de probabilidades sin reemplazo',
        ],
      },
    ],
  },
}
