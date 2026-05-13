import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 25: Distancia entre dos puntos
 * Concepto clave: La distancia entre dos puntos es la longitud del segmento que los une
 *
 * Concreto: Geoplano 5x5 — marcar (0,0) y (3,4), distancia = 5
 * Pictorico: Modelo en barras — triangulo rectangulo con catetos y la hipotenusa
 * Abstracto: 3 preguntas con progresion de dificultad sobre distancia entre puntos
 */
export const tareaSecuencia25: TareaCPA = {
  secuencia_ref: 25,
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'punto', emoji: '📍' }, b: { nombre: 'distancia', emoji: '📏' } },
    valores_clave: { horizontal: 4, vertical: 3, distancia: 5 },
    tipo: 'geometria',
    narrativa: 'Roberto quiere calcular la distancia entre dos puntos en un plano. Usa un triangulo rectangulo imaginario para encontrarla.',
    pregunta_central: '¿Cual es la distancia entre (0,0) y (4,3)?',
    transiciones: {
      concreto: 'Traza los dos puntos en el geoplano y observa el triangulo rectangulo.',
      bridge_pictorico: 'El cateto horizontal mide 4 y el vertical 3.',
      pictorico: 'Observa los componentes horizontal y vertical en el modelo.',
      bridge_abstracto: 'd = √(4² + 3²) = √25 = 5.',
      abstracto: 'Ahora calcula distancias entre puntos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 0],
        [3, 4],
      ],
      propiedad_a_medir: 'perimetro',
      valor_esperado: 5,
      pregunta:
        'Marca los puntos (0,0) y (3,4) en el geoplano. La distancia entre ellos es la longitud del segmento.',
      pista:
        'Cuenta cuantas unidades hay en horizontal (4) y en vertical (3). Forma un triangulo rectangulo: la distancia es la hipotenusa.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Horizontal', valor: 4, color: 'azul' },
        { label: 'Vertical', valor: 3, color: 'verde' },
      ],
      total: { valor: 5, visible: true },
      incognita: { posicion: 'total', label: 'Distancia = ?' },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo. Los catetos del triangulo rectangulo miden 3 y 4. Cual es la distancia (hipotenusa)?',
        tipo: 'opcion_multiple',
        opciones: ['A) 3', 'B) 4', 'C) 5', 'D) 7'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Usando el modelo, explica como se calcula la distancia entre dos puntos cuando conoces el desplazamiento horizontal y vertical.',
        tipo: 'calculo',
        respuesta:
          'Se forma un triangulo rectangulo donde los catetos son las distancias horizontal y vertical. Se aplica el teorema de Pitagoras: distancia = raiz cuadrada de (horizontal al cuadrado + vertical al cuadrado). Con catetos 4 y 3: distancia = raiz de (16 + 9) = raiz de 25 = 5.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Cual es la distancia entre los puntos (0,0) y (0,6)?',
        opciones: ['A) 0', 'B) 3', 'C) 6', 'D) 12'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Calcula la distancia entre los puntos A(1,2) y B(4,6).',
        respuesta:
          'Paso 1: Distancia horizontal = 4 - 1 = 3.\nPaso 2: Distancia vertical = 6 - 2 = 4.\nPaso 3: Distancia = raiz cuadrada de (3 al cuadrado + 4 al cuadrado) = raiz de (9 + 16) = raiz de 25 = 5.\nRespuesta: La distancia entre A y B es 5 unidades.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Por que no podemos simplemente sumar las distancias horizontal y vertical para obtener la distancia real entre dos puntos? Explica con un ejemplo.',
        respuesta:
          'Sumar horizontal y vertical da la distancia caminando por las calles, no en linea recta. Por ejemplo, de (0,0) a (3,4) la suma da 7, pero la distancia real es 5. La linea recta siempre es mas corta, por eso usamos el teorema de Pitagoras.',
        criterios_aceptacion: [
          'linea recta mas corta',
          'teorema de Pitagoras',
          'no es sumar los catetos',
          'ejemplo concreto con numeros',
        ],
      },
    ],
  },
}
