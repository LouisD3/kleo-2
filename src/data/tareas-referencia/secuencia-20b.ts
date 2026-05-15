import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 20b: Altura de un triangulo
 * Concepto clave: Trazar la altura de un triangulo (perpendicular al lado opuesto)
 *
 * Concreto: Geoplano (triangulo rectangulo para visualizar la altura)
 * Pictorico: Diagrama geometrico — triangulo con altura trazada y angulo recto marcado
 * Abstracto: 3 preguntas progresivas sobre altura
 */
export const tareaSecuencia20b: TareaCPA = {
  secuencia_ref: 20,
  concepto_clave: 'Trazar la altura de un triangulo (perpendicular al lado opuesto)',
  contexto: {
    personaje: 'Elena',
    objetos: { a: { nombre: 'triangulo', emoji: '🔺' }, b: { nombre: 'altura', emoji: '📐' } },
    valores_clave: { base: 6, altura: 4 },
    tipo: 'geometria',
    narrativa: 'Elena traza la altura de un triangulo: la recta perpendicular que baja desde un vertice hasta el lado opuesto, formando un angulo de 90°.',
    pregunta_central: '¿Que es la altura de un triangulo y como se traza?',
    transiciones: {
      concreto: 'Traza el triangulo en el geoplano e identifica la altura desde el vertice superior.',
      bridge_pictorico: 'La altura va del vertice C perpendicular al lado AB. Forma un angulo de 90°.',
      pictorico: 'Observa la altura y el angulo recto en el diagrama.',
      bridge_abstracto: 'La altura siempre es perpendicular al lado opuesto. Se usa para calcular el area.',
      abstracto: 'Ahora identifica y calcula alturas.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 7,
      figura_objetivo: [
        [4, 0],
        [4, 6],
        [0, 3],
      ],
      pregunta:
        'Traza un triangulo en el geoplano. Luego identifica la altura: la linea perpendicular que baja desde el vertice superior hasta la base.',
      pista: 'La altura forma un angulo de 90° con la base. Desde el vertice superior, baja en linea recta hasta tocar la base.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 8,
      alto: 6,
      puntos: [
        { id: 'a', x: 1, y: 5, label: 'A' },
        { id: 'b', x: 7, y: 5, label: 'B' },
        { id: 'c', x: 4, y: 1, label: 'C' },
        { id: 'h', x: 4, y: 5, label: 'H' },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'a', hasta: 'b', color: 'azul', medida: '6 u' },
        { tipo: 'segmento', desde: 'b', hasta: 'c', color: 'gris' },
        { tipo: 'segmento', desde: 'c', hasta: 'a', color: 'gris' },
        { tipo: 'segmento', desde: 'c', hasta: 'h', color: 'rojo', estilo: 'punteado', label: 'Altura', medida: '4 u' },
      ],
      angulos: [
        { vertice: 'h', lado_a: 'b', lado_b: 'c', medida: '90°', color: 'rojo' },
      ],
      poligonos: [
        { puntos: ['a', 'b', 'c'], relleno: 'azul', opacidad: 0.08 },
      ],
      titulo: 'Triangulo con altura desde C perpendicular a AB',
    },
    preguntas: [
      {
        pregunta:
          'El diagrama muestra una linea punteada desde C hasta H en la base AB, con un angulo de 90°. Esa linea se llama:',
        tipo: 'opcion_multiple',
        opciones: ['A) Mediana', 'B) Bisectriz', 'C) Mediatriz', 'D) Altura'],
        respuesta: 'D',
      },
      {
        pregunta:
          'La altura mide 4 u y la base mide 6 u. Usando la formula A = base x altura / 2, calcula el area del triangulo.',
        tipo: 'abierta',
        respuesta:
          'Area = base x altura / 2 = 6 x 4 / 2 = 24 / 2 = 12 unidades cuadradas. La altura es esencial para calcular el area de un triangulo.',
        criterios_aceptacion: ['6 x 4 / 2', 'area = 12', 'unidades cuadradas', 'altura perpendicular a la base'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'La altura de un triangulo siempre:',
        opciones: [
          'A) Pasa por el punto medio del lado opuesto',
          'B) Divide el angulo en dos partes iguales',
          'C) Es perpendicular al lado opuesto',
          'D) Mide lo mismo que la base',
        ],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un triangulo tiene base de 10 cm y area de 30 cm2. Cual es su altura? Muestra el procedimiento.',
        respuesta:
          'Paso 1: A = base x altura / 2.\nPaso 2: 30 = 10 x altura / 2.\nPaso 3: 30 x 2 = 10 x altura.\nPaso 4: 60 = 10 x altura.\nPaso 5: altura = 60 / 10 = 6 cm.\nRespuesta: La altura es 6 cm.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'En un triangulo obtusangulo, la altura desde el vertice del angulo obtuso puede caer FUERA del triangulo. Explica por que y dibuja mentalmente un ejemplo.',
        respuesta:
          'Si el angulo es obtuso (mayor de 90°), al trazar la perpendicular desde ese vertice hasta la extension del lado opuesto, el pie de la altura cae fuera del triangulo. Es como si la base no fuera suficientemente larga para "recibir" la perpendicular.',
        criterios_aceptacion: ['angulo obtuso mayor de 90°', 'altura cae fuera del triangulo', 'perpendicular a la extension del lado', 'ejemplo o dibujo mental'],
      },
    ],
  },
}
