export const TAREAS_MOCK = [
  {
    id: 'tarea-1',
    nombre: 'Operaciones con fracciones',
    materia: 'Matemáticas',
    dificultad: 'Media',
    metodologia: 'Resolución de problemas',
    tipos: ['Cálculo/Resolución de problemas', 'Opción múltiple'],
    estado: 'completada',
    fechaCreacion: '2026-04-10',
    preguntas: [
      {
        tipo: 'calculo',
        pregunta:
          'Una receta requiere 3/4 de taza de azúcar. Si quieres hacer el doble de la receta, ¿cuántas tazas de azúcar necesitas? Muestra tu procedimiento.',
      },
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Cuál es el resultado de 2/3 + 1/4?',
        opciones: ['A. 3/7', 'B. 11/12', 'C. 3/12', 'D. 8/12'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Un pastel se divide en 8 partes iguales. Si Juan come 3 partes y María come 2 partes, ¿qué fracción del pastel queda? Explica tu razonamiento.',
      },
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Qué fracción es equivalente a 6/8?',
        opciones: ['A. 2/3', 'B. 3/4', 'C. 4/6', 'D. 5/7'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Ana tiene 5/6 de metro de listón. Usa 1/3 de metro para un regalo. ¿Cuánto listón le sobra? Muestra el procedimiento completo.',
      },
    ],
    resultadosPorAlumno: {
      'alumno-1': {
        alumnoId: 'alumno-1',
        respuestas: {
          0: 'Necesito 3/4 × 2 = 6/4 = 1 y 1/2 tazas de azúcar.',
          1: 'B',
          2: 'Quedan 8 - 3 - 2 = 3 partes, entonces 3/8 del pastel.',
          3: 'B',
          4: '5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2 metro.',
        },
        calificacion: 9,
        retroalimentacion: [
          { indice_pregunta: 0, correcta: true, comentario: 'Excelente procedimiento y resultado correcto.' },
          { indice_pregunta: 1, correcta: true, comentario: 'Correcto, 11/12 es la respuesta exacta.' },
          { indice_pregunta: 2, correcta: true, comentario: 'Muy bien planteado.' },
          { indice_pregunta: 3, correcta: true, comentario: 'Correcto.' },
          { indice_pregunta: 4, correcta: false, comentario: 'El resultado es correcto pero faltó mostrar el paso de convertir 1/3 a 2/6.' },
        ],
        areas_de_mejora: ['Mostrar todos los pasos intermedios en operaciones con fracciones'],
        fechaEntrega: '2026-04-12',
      },
      'alumno-2': {
        alumnoId: 'alumno-2',
        respuestas: {
          0: '3/4 + 3/4 = 6/4 = 1.5 tazas',
          1: 'D',
          2: '3 partes quedan, o sea 3/8',
          3: 'B',
          4: '5/6 - 2/6 = 3/6',
        },
        calificacion: 7,
        retroalimentacion: [
          { indice_pregunta: 0, correcta: true, comentario: 'Correcto, aunque podrías simplificar a 1 y 1/2.' },
          { indice_pregunta: 1, correcta: false, comentario: 'La respuesta es B (11/12). Para sumar fracciones con distinto denominador debes encontrar el mínimo común múltiplo.' },
          { indice_pregunta: 2, correcta: true, comentario: 'Correcto.' },
          { indice_pregunta: 3, correcta: true, comentario: 'Bien hecho.' },
          { indice_pregunta: 4, correcta: true, comentario: 'Resultado correcto.' },
        ],
        areas_de_mejora: ['Suma de fracciones con denominadores distintos', 'Uso del mínimo común múltiplo'],
        fechaEntrega: '2026-04-12',
      },
      'alumno-3': {
        alumnoId: 'alumno-3',
        respuestas: {
          0: 'Se necesita 1 taza y media',
          1: 'B',
          2: 'Sobran 3 pedazos = 3/8',
          3: 'A',
          4: 'Le sobra 1/2 metro',
        },
        calificacion: 8,
        retroalimentacion: [
          { indice_pregunta: 0, correcta: true, comentario: 'Correcto, pero recuerda mostrar el procedimiento con fracciones.' },
          { indice_pregunta: 1, correcta: true, comentario: '¡Muy bien!' },
          { indice_pregunta: 2, correcta: true, comentario: 'Correcto.' },
          { indice_pregunta: 3, correcta: false, comentario: 'La fracción equivalente a 6/8 es 3/4 (opción B), al simplificar dividiendo ambos entre 2.' },
          { indice_pregunta: 4, correcta: true, comentario: 'Correcto.' },
        ],
        areas_de_mejora: ['Simplificación de fracciones', 'Presentar procedimientos algebraicos completos'],
        fechaEntrega: '2026-04-13',
      },
    },
  },
  {
    id: 'tarea-2',
    nombre: 'La Revolución Mexicana',
    materia: 'Historia',
    dificultad: 'Fácil',
    metodologia: 'Memorización activa',
    tipos: ['Verdadero/Falso', 'Opción múltiple', 'Completar espacios en blanco'],
    estado: 'en_curso',
    fechaCreacion: '2026-04-18',
    preguntas: [
      {
        tipo: 'verdadero_falso',
        pregunta: 'La Revolución Mexicana inició en el año 1910.',
        respuesta: true,
      },
      {
        tipo: 'opcion_multiple',
        pregunta: '¿Quién fue el presidente que derrocó Madero mediante un golpe de estado?',
        opciones: ['A. Venustiano Carranza', 'B. Victoriano Huerta', 'C. Porfirio Díaz', 'D. Álvaro Obregón'],
        respuesta: 'B',
      },
      {
        tipo: 'espacios',
        pregunta: 'El Plan de ___ fue el documento que convocó al pueblo mexicano a levantarse en armas contra Porfirio Díaz.',
        respuesta: 'San Luis',
      },
      {
        tipo: 'verdadero_falso',
        pregunta: 'Emiliano Zapata luchó principalmente por los derechos de los campesinos y la reforma agraria.',
        respuesta: true,
      },
      {
        tipo: 'opcion_multiple',
        pregunta: '¿En qué año se promulgó la Constitución Política de los Estados Unidos Mexicanos que surgió de la Revolución?',
        opciones: ['A. 1910', 'B. 1913', 'C. 1917', 'D. 1920'],
        respuesta: 'C',
      },
    ],
    resultadosPorAlumno: {
      'alumno-2': {
        alumnoId: 'alumno-2',
        respuestas: {
          0: 'Verdadero',
          1: 'B',
          2: 'San Luis',
          3: 'Verdadero',
          4: 'C',
        },
        calificacion: 10,
        retroalimentacion: [
          { indice_pregunta: 0, correcta: true, comentario: '¡Correcto! 1910 es el año de inicio.' },
          { indice_pregunta: 1, correcta: true, comentario: 'Exacto, fue Victoriano Huerta.' },
          { indice_pregunta: 2, correcta: true, comentario: '¡Muy bien! El Plan de San Luis Potosí.' },
          { indice_pregunta: 3, correcta: true, comentario: 'Correcto, Zapata fue el líder agrario.' },
          { indice_pregunta: 4, correcta: true, comentario: '¡Perfecto! La Constitución de 1917.' },
        ],
        areas_de_mejora: [],
        fechaEntrega: '2026-04-19',
      },
    },
  },
]
