import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 27: Desigualdad triangular
 * Concepto clave: La suma de dos lados de un triangulo siempre es mayor que el tercero
 *
 * Concreto: Geoplano 5x5 — trazar un triangulo valido
 * Pictorico: Tabla — verificacion de las 3 condiciones de desigualdad triangular
 * Abstracto: 3 preguntas con progresion de dificultad sobre desigualdad triangular
 */
export const tareaSecuencia27: TareaCPA = {
  secuencia_ref: 27,
  contexto: {
    personaje: 'Elena',
    objetos: { a: { nombre: 'varilla', emoji: '🪵' }, b: { nombre: 'triangulo', emoji: '🔺' } },
    valores_clave: { lados: [4, 3, 3] },
    tipo: 'geometria',
    narrativa: 'Elena tiene 3 varillas y quiere saber si puede formar un triangulo. Descubre que la suma de dos lados siempre debe ser mayor que el tercero.',
    pregunta_central: '¿Se puede formar un triangulo con lados de 4, 3 y 3?',
    transiciones: {
      concreto: 'Traza el triangulo en el geoplano conectando los puntos dados.',
      bridge_pictorico: 'El triangulo se forma porque 3+3=6 > 4, 4+3=7 > 3.',
      pictorico: 'Verifica las 3 condiciones de desigualdad en la tabla.',
      bridge_abstracto: 'Para formar triangulo: a+b > c, a+c > b, b+c > a.',
      abstracto: 'Ahora verifica si otras medidas forman triangulos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 0],
        [4, 0],
        [2, 3],
      ],
      pregunta:
        'Traza un triangulo en el geoplano conectando los puntos (0,0), (4,0) y (2,3).',
      pista:
        'Conecta los tres puntos para formar un triangulo. Asegurate de que los tres lados esten bien trazados y que los puntos no esten alineados.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'tabla',
      columnas: [
        { key: 'condicion', header: 'Condicion' },
        { key: 'suma', header: 'Suma de dos lados' },
        { key: 'tercer_lado', header: 'Tercer lado' },
        { key: 'cumple', header: 'Suma > tercer lado?' },
      ],
      filas: [
        { condicion: 'a + b > c', suma: '4 + 3 = 7', tercer_lado: '3', cumple: 'Si (7 > 3)' },
        { condicion: 'a + c > b', suma: '4 + 3 = 7', tercer_lado: '3', cumple: 'Si (7 > 3)' },
        { condicion: 'b + c > a', suma: '3 + 3 = 6', tercer_lado: '4', cumple: 'Si (6 > 4)' },
      ],
      resaltados: [
        { fila: 0, columna: 'cumple', color: '#10B981' },
        { fila: 1, columna: 'cumple', color: '#10B981' },
        { fila: 2, columna: 'cumple', color: '#10B981' },
      ],
      titulo: 'Verificacion de la desigualdad triangular (lados: 4, 3, 3)',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo. Los lados b y c miden 3 cada uno. Su suma (6) es mayor que el lado a (4). Se cumple la desigualdad triangular?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) No, porque 6 es diferente de 4',
          'B) Si, porque 3 + 3 = 6 > 4',
          'C) No, porque faltan datos',
          'D) Si, porque 3 = 3',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando el modelo, explica que debe cumplirse con las longitudes de los tres lados para que se pueda formar un triangulo.',
        tipo: 'calculo',
        respuesta:
          'Para formar un triangulo, la suma de cualesquiera dos lados debe ser mayor que el tercer lado. En el modelo: a + b = 4 + 3 = 7 > 3 (lado c), a + c = 4 + 3 = 7 > 3 (lado b), y b + c = 3 + 3 = 6 > 4 (lado a). Las tres condiciones se cumplen, entonces si se puede formar el triangulo.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Con las medidas 3 cm, 4 cm y 8 cm, se puede formar un triangulo?',
        opciones: [
          'A) Si, siempre se puede',
          'B) No, porque 3 + 4 = 7 < 8',
          'C) Si, porque son tres medidas',
          'D) No, porque 8 es par',
        ],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Dos lados de un triangulo miden 5 cm y 9 cm. Encuentra el rango de valores posibles para el tercer lado.',
        respuesta:
          'Paso 1: Sea c el tercer lado. Debe cumplirse: 5 + 9 > c, entonces c < 14.\nPaso 2: Tambien: 5 + c > 9, entonces c > 4.\nPaso 3: Y: 9 + c > 5, que se cumple para cualquier c > 0.\nPaso 4: Combinando: 4 < c < 14.\nRespuesta: El tercer lado debe medir mas de 4 cm y menos de 14 cm.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Imagina que tienes tres varillas de 5, 5 y 10 cm. Puedes formar un triangulo? Explica que pasa en el caso limite cuando la suma de dos lados es igual al tercero.',
        respuesta:
          'No se puede formar un triangulo porque 5 + 5 = 10, que es igual al tercer lado, no mayor. En el caso limite las varillas quedan alineadas formando una linea recta, no un triangulo. La suma debe ser estrictamente mayor.',
        criterios_aceptacion: [
          '5 + 5 = 10 no es mayor',
          'quedan alineadas o en linea recta',
          'no hay triangulo',
          'la suma debe ser estrictamente mayor',
        ],
      },
    ],
  },
}
