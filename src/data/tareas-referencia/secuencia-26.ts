import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 26: Distancia de un punto a una recta
 * Concepto clave: La distancia de un punto a una recta es la perpendicular mas corta
 *
 * Concreto: Geoplano 5x5 — recta horizontal + punto arriba, distancia perpendicular = 2
 * Pictorico: Modelo en barras — distancia perpendicular vs distancia oblicua
 * Abstracto: 3 preguntas con progresion de dificultad sobre distancia punto-recta
 */
export const tareaSecuencia26: TareaCPA = {
  secuencia_ref: 26,
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [0, 1],
        [4, 1],
        [2, 3],
      ],
      propiedad_a_medir: 'perimetro',
      valor_esperado: 2,
      pregunta:
        'Traza la recta horizontal que pasa por (0,1) y (4,1). Luego marca el punto (2,3). La distancia del punto a la recta es la perpendicular mas corta.',
      pista:
        'La distancia de un punto a una recta se mide con un segmento perpendicular. Desde (2,3) baja en linea recta hasta la recta: llegas a (2,1). Cuantas unidades hay de diferencia?',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Perpendicular', valor: 2, color: 'verde' },
        { label: 'Oblicua', valor: 3, color: 'rojo' },
      ],
      total: { valor: 3, visible: false },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Observa el modelo. Cual segmento representa la distancia del punto a la recta: el perpendicular (2 unidades) o el oblicuo (3 unidades)?',
        tipo: 'opcion_multiple',
        opciones: [
          'A) El oblicuo, porque es mas largo',
          'B) El perpendicular, porque es el mas corto',
          'C) Los dos, porque ambos tocan la recta',
          'D) Ninguno',
        ],
        respuesta: 'B',
      },
      {
        pregunta:
          'Usando el modelo, explica por que la distancia de un punto a una recta siempre se mide con la perpendicular.',
        tipo: 'calculo',
        respuesta:
          'La distancia se define como la longitud mas corta entre el punto y la recta. El segmento perpendicular es siempre el mas corto porque forma un angulo de 90 grados con la recta. Cualquier otro segmento oblicuo es mas largo, ya que la hipotenusa de un triangulo rectangulo siempre es mayor que sus catetos.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'La recta L es horizontal y pasa por y = 2. El punto P esta en (5, 7). Cual es la distancia de P a L?',
        opciones: ['A) 2', 'B) 5', 'C) 7', 'D) 9'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Dos rectas paralelas horizontales pasan por y = 1 y y = 6. Calcula la distancia entre ellas.',
        respuesta:
          'Paso 1: La distancia entre dos rectas paralelas es la distancia perpendicular entre ellas.\nPaso 2: Distancia = 6 - 1 = 5 unidades.\nRespuesta: La distancia entre las dos rectas paralelas es 5 unidades.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Un punto esta a la misma distancia de dos rectas paralelas. Donde se encuentra ese punto? Explica tu razonamiento.',
        respuesta:
          'El punto se encuentra exactamente en la recta que esta a la mitad entre las dos rectas paralelas. Si las rectas paralelas estan en y = 1 y y = 6, el punto equidistante esta en y = 3.5 porque 3.5 - 1 = 2.5 y 6 - 3.5 = 2.5. Este lugar geometrico es otra recta paralela a las dos originales, ubicada justo a la mitad.',
      },
    ],
  },
}
