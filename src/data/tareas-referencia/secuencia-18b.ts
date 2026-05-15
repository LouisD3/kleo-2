import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 18b: Mediatriz
 * Concepto clave: Trazar la mediatriz y verificar la propiedad de equidistancia
 *
 * Concreto: CompasCirculo (trazar dos arcos desde los extremos del segmento para encontrar la mediatriz)
 * Pictorico: Diagrama geometrico — segmento con mediatriz perpendicular y punto equidistante
 * Abstracto: 3 preguntas progresivas sobre la mediatriz
 */
export const tareaSecuencia18b: TareaCPA = {
  secuencia_ref: 18,
  concepto_clave: 'Trazar la mediatriz y verificar la propiedad de equidistancia',
  contexto: {
    personaje: 'Elena',
    objetos: { a: { nombre: 'segmento', emoji: '📏' }, b: { nombre: 'mediatriz', emoji: '✂️' } },
    valores_clave: { longitud: 6 },
    tipo: 'geometria',
    narrativa: 'Elena quiere trazar la mediatriz de un segmento de 6 unidades. La mediatriz es perpendicular al segmento y pasa por su punto medio. Cualquier punto sobre ella esta a la misma distancia de ambos extremos.',
    pregunta_central: '¿Que propiedad tiene cualquier punto sobre la mediatriz?',
    transiciones: {
      concreto: 'Usa el compas para trazar dos arcos y encontrar donde pasa la mediatriz.',
      bridge_pictorico: 'Los arcos se cruzan arriba y abajo del segmento. Uniendo esos cruces obtienes la mediatriz.',
      pictorico: 'Observa la mediatriz y el punto P en el diagrama. Mide las distancias PA y PB.',
      bridge_abstracto: 'Todo punto sobre la mediatriz cumple PA = PB. Es la propiedad de equidistancia.',
      abstracto: 'Ahora aplica la propiedad de equidistancia.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'compas_circulo',
      centro: [2, 3],
      radio_objetivo: 3,
      elementos_a_trazar: ['radio'],
      pregunta:
        'Un segmento AB mide 6 unidades. Para trazar la mediatriz, abre el compas a mas de la mitad (radio 3 o mas) y traza un arco desde A. Luego repite desde B. La mediatriz pasa por donde se cruzan los arcos.',
      pista: 'Coloca el compas en A con radio 3, traza un arco. Luego coloca el compas en B con el mismo radio y traza otro arco. La mediatriz une los dos puntos de interseccion.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 8,
      alto: 6,
      puntos: [
        { id: 'a', x: 1, y: 3, label: 'A' },
        { id: 'b', x: 7, y: 3, label: 'B' },
        { id: 'm', x: 4, y: 3, label: 'M' },
        { id: 'p', x: 4, y: 1, label: 'P' },
        { id: 'mt', x: 4, y: 0.5 },
        { id: 'mb', x: 4, y: 5.5 },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'a', hasta: 'b', color: 'azul', medida: '6 u' },
        { tipo: 'recta', desde: 'mt', hasta: 'mb', color: 'rojo', estilo: 'punteado', label: 'Mediatriz' },
        { tipo: 'segmento', desde: 'p', hasta: 'a', color: 'verde', estilo: 'punteado', medida: '3.6 u' },
        { tipo: 'segmento', desde: 'p', hasta: 'b', color: 'verde', estilo: 'punteado', medida: '3.6 u' },
      ],
      angulos: [
        { vertice: 'm', lado_a: 'b', lado_b: 'mt', medida: '90°', color: 'rojo' },
      ],
      titulo: 'Segmento AB con mediatriz y punto P equidistante (PA = PB)',
    },
    preguntas: [
      {
        pregunta:
          'Observa el diagrama. Las distancias PA y PB son iguales (3.6 u). Esto se cumple porque P esta sobre:',
        tipo: 'opcion_multiple',
        opciones: ['A) La mediana', 'B) La bisectriz', 'C) La mediatriz', 'D) La altura'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Explica con tus palabras por que cualquier punto sobre la mediatriz esta a la misma distancia de A y de B.',
        tipo: 'abierta',
        respuesta:
          'La mediatriz pasa por el punto medio M y es perpendicular al segmento. Cualquier punto P sobre la mediatriz forma dos triangulos rectangulos iguales (PMA y PMB) con la misma hipotenusa. Por eso PA = PB siempre.',
        criterios_aceptacion: ['pasa por el punto medio', 'perpendicular', 'PA = PB', 'triangulos iguales o simetria'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Un punto P esta sobre la mediatriz de un segmento AB. Si PA = 5 cm, cuanto mide PB?',
        opciones: ['A) 2.5 cm', 'B) 5 cm', 'C) 10 cm', 'D) No se puede saber'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un segmento AB va del punto A(1, 2) al punto B(7, 2). Encuentra las coordenadas del punto medio M y di si la mediatriz es horizontal o vertical.',
        respuesta:
          'Paso 1: M = ((1+7)/2, (2+2)/2) = (4, 2).\nPaso 2: El segmento AB es horizontal (y=2 para ambos puntos).\nPaso 3: La mediatriz es perpendicular al segmento, por lo tanto es vertical.\nRespuesta: M = (4, 2) y la mediatriz es la recta vertical x = 4.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Imagina que dos pueblos A y B estan separados por 10 km en linea recta. Se quiere construir un hospital que este a la misma distancia de ambos pueblos. Donde deberia estar? Usa el concepto de mediatriz.',
        respuesta:
          'El hospital debe estar sobre la mediatriz del segmento AB, es decir, en cualquier punto de la recta perpendicular que pasa por el punto medio (a 5 km de cada pueblo). El punto mas cercano a ambos seria el punto medio mismo.',
        criterios_aceptacion: ['sobre la mediatriz', 'punto medio a 5 km', 'perpendicular al segmento', 'equidistancia'],
      },
    ],
  },
}
