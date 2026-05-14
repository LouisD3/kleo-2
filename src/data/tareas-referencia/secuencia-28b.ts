import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 28b: Area
 * Concepto clave: Calcular el area de triangulos y figuras compuestas
 *
 * Concreto: Geoplano 5x5 — trazar un triangulo rectangulo, contar unidades cuadradas
 * Pictorico: Diagrama geometrico — triangulo rectangulo con cuadricula y formula
 * Abstracto: 3 preguntas progresivas sobre area de triangulos y figuras compuestas
 */
export const tareaSecuencia28b: TareaCPA = {
  secuencia_ref: 28,
  contexto: {
    personaje: 'Roberto',
    objetos: { a: { nombre: 'triangulo', emoji: '🔺' }, b: { nombre: 'area', emoji: '📐' } },
    valores_clave: { base: 4, altura: 3, area: 6 },
    tipo: 'medicion',
    narrativa: 'Roberto necesita calcular el area de un terreno triangular. Descubre que el area de un triangulo es la mitad del rectangulo que lo contiene.',
    pregunta_central: '¿Cual es el area de un triangulo de base 4 y altura 3?',
    transiciones: {
      concreto: 'Traza el triangulo en el geoplano y cuenta las unidades cuadradas que cubre.',
      bridge_pictorico: 'El triangulo cubre la mitad de un rectangulo de 4x3. Area = 4x3/2 = 6.',
      pictorico: 'Observa el triangulo dentro del rectangulo en el diagrama.',
      bridge_abstracto: 'A = base x altura / 2. Para figuras compuestas, se divide en triangulos y rectangulos.',
      abstracto: 'Ahora calcula areas de triangulos y figuras compuestas.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'geoplano',
      filas: 5,
      columnas: 5,
      figura_objetivo: [
        [4, 0],
        [4, 4],
        [1, 0],
      ],
      propiedad_a_medir: 'area',
      valor_esperado: 6,
      pregunta:
        'Traza un triangulo rectangulo de base 4 y altura 3 en el geoplano. Cuenta las unidades cuadradas que cubre (pista: es la mitad de un rectangulo).',
      pista: 'El triangulo ocupa la mitad del rectangulo de 4x3 = 12. La mitad de 12 es 6 unidades cuadradas.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 6,
      alto: 5,
      puntos: [
        { id: 'a', x: 1, y: 4, label: 'A' },
        { id: 'b', x: 5, y: 4, label: 'B' },
        { id: 'c', x: 1, y: 1, label: 'C' },
        { id: 'd', x: 5, y: 1, label: '' },
      ],
      segmentos: [
        { tipo: 'segmento', desde: 'a', hasta: 'b', color: 'azul', medida: '4 u' },
        { tipo: 'segmento', desde: 'a', hasta: 'c', color: 'azul', medida: '3 u' },
        { tipo: 'segmento', desde: 'b', hasta: 'c', color: 'rojo' },
        { tipo: 'segmento', desde: 'b', hasta: 'd', color: 'gris', estilo: 'punteado' },
        { tipo: 'segmento', desde: 'c', hasta: 'd', color: 'gris', estilo: 'punteado' },
      ],
      angulos: [
        { vertice: 'a', lado_a: 'b', lado_b: 'c', medida: '90°', color: 'azul' },
      ],
      poligonos: [
        { puntos: ['a', 'b', 'c'], relleno: 'azul', opacidad: 0.15 },
        { puntos: ['b', 'c', 'd'], relleno: 'gris', opacidad: 0.05 },
      ],
      cuadricula: { filas: 3, columnas: 4, celdas_resaltadas: [], color_resaltado: '#3B82F6' },
      titulo: 'Triangulo rectangulo = mitad del rectangulo 4x3',
    },
    preguntas: [
      {
        pregunta:
          'El diagrama muestra un triangulo (azul) y su "rectangulo fantasma" (gris punteado). Si el rectangulo completo mide 4x3 = 12, cual es el area del triangulo?',
        tipo: 'opcion_multiple',
        opciones: ['A) 12', 'B) 7', 'C) 6', 'D) 14'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Explica por que el area de cualquier triangulo es siempre la mitad del area de un rectangulo con la misma base y altura.',
        tipo: 'abierta',
        respuesta:
          'Un triangulo se puede encerrar en un rectangulo de misma base y altura. La diagonal del rectangulo divide el rectangulo en dos triangulos iguales. Cada triangulo ocupa exactamente la mitad: A = base x altura / 2.',
        criterios_aceptacion: ['triangulo dentro de rectangulo', 'diagonal divide en dos', 'mitad del area', 'formula base x altura / 2'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Un triangulo tiene base 8 cm y altura 5 cm. Su area es:',
        opciones: ['A) 13 cm2', 'B) 20 cm2', 'C) 40 cm2', 'D) 26 cm2'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Una figura en forma de L se compone de un rectangulo de 6x4 y un rectangulo de 3x2 pegado a un lado. Calcula el area total.',
        respuesta:
          'Paso 1: Area del rectangulo grande = 6 x 4 = 24.\nPaso 2: Area del rectangulo pequeno = 3 x 2 = 6.\nPaso 3: Area total = 24 + 6 = 30 unidades cuadradas.\nRespuesta: El area de la figura en L es 30 unidades cuadradas.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Dos triangulos tienen la misma base de 10 cm pero alturas diferentes: uno de 4 cm y otro de 8 cm. Sin calcular, explica cual tiene mayor area y por que.',
        respuesta:
          'El de altura 8 cm tiene mayor area porque con la misma base, el area depende directamente de la altura: a mayor altura, mayor area. Concretamente: A1 = 10x4/2 = 20 y A2 = 10x8/2 = 40, el doble.',
        criterios_aceptacion: ['misma base diferente altura', 'mayor altura mayor area', 'relacion directa', 'ejemplo numerico o proporcion'],
      },
    ],
  },
}
