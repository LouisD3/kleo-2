import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 29b: Grafica circular (pastel)
 * Concepto clave: Representar frecuencias relativas como sectores de un circulo
 *
 * Concreto: HistogramaConstruible (mismos datos que sec 29: Futbol 8, Basquet 5, Natacion 4, Otro 3)
 * Pictorico: DiagramaGeometrico con grafica circular (arcos + circulos)
 * Abstracto: 3 preguntas progresivas sobre graficas circulares
 *
 * NOTA MATH: Angulos verificados:
 *   Total = 20. Futbol=8/20=144°, Basquet=5/20=90°, Natacion=4/20=72°, Otro=3/20=54°.
 *   Suma: 144+90+72+54 = 360° ✓
 */
export const tareaSecuencia29b: TareaCPA = {
  secuencia_ref: 29,
  concepto_clave: 'Representar frecuencias relativas como sectores de un circulo',
  contexto: {
    personaje: 'Profesor Garcia',
    objetos: {
      a: { nombre: 'sector', emoji: '🍕' },
      b: { nombre: 'grafica circular', emoji: '📊' },
    },
    valores_clave: { total_alumnos: 20 },
    tipo: 'estadistica',
    narrativa:
      'El Profesor Garcia ya tiene los datos de deportes favoritos en una grafica de barras. Ahora quiere mostrarlos en una grafica circular para ver las proporciones.',
    pregunta_central: '¿Como se representan las frecuencias en una grafica circular?',
    transiciones: {
      concreto: 'Construye el histograma con los datos de la encuesta.',
      bridge_pictorico: 'Futbol 8, Basquet 5, Natacion 4, Otro 3. Total: 20 alumnos.',
      pictorico: 'Observa como se ven las proporciones en la grafica circular.',
      bridge_abstracto: 'Cada sector mide (frecuencia / total) x 360°.',
      abstracto: 'Ahora convierte frecuencias a grados y lee graficas circulares.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'histograma_construible',
      categorias: [
        { label: 'Futbol', color: 'azul' },
        { label: 'Basquet', color: 'rojo' },
        { label: 'Natacion', color: 'verde' },
        { label: 'Otro', color: 'amarillo' },
      ],
      frecuencias_objetivo: [8, 5, 4, 3],
      datos_brutos: [
        'Futbol',
        'Futbol',
        'Basquet',
        'Natacion',
        'Futbol',
        'Otro',
        'Basquet',
        'Futbol',
        'Natacion',
        'Futbol',
        'Basquet',
        'Otro',
        'Futbol',
        'Natacion',
        'Futbol',
        'Basquet',
        'Otro',
        'Futbol',
        'Basquet',
        'Natacion',
      ],
      pregunta:
        'Cuenta los datos de la encuesta y construye la grafica de barras. Luego piensa: ¿que fraccion del total representa cada deporte?',
      pista: 'Futbol aparece 8 veces, Basquet 5, Natacion 4, Otro 3. El total es 20.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'diagrama_geometrico',
      ancho: 10,
      alto: 10,
      puntos: [{ id: 'o', x: 5, y: 5 }],
      circulos: [{ centro_id: 'o', radio: 4, color: 'gris', estilo: 'borde' }],
      arcos: [
        // Futbol: 0° → 144° (8/20 x 360°)
        {
          centro_id: 'o',
          radio: 4,
          desde_grados: 0,
          hasta_grados: 144,
          color: 'azul',
          relleno: true,
          label: 'Futbol (144°)',
        },
        // Basquet: 144° → 234° (5/20 x 360° = 90°)
        {
          centro_id: 'o',
          radio: 4,
          desde_grados: 144,
          hasta_grados: 234,
          color: 'rojo',
          relleno: true,
          label: 'Basquet (90°)',
        },
        // Natacion: 234° → 306° (4/20 x 360° = 72°)
        {
          centro_id: 'o',
          radio: 4,
          desde_grados: 234,
          hasta_grados: 306,
          color: 'verde',
          relleno: true,
          label: 'Natacion (72°)',
        },
        // Otro: 306° → 360° (3/20 x 360° = 54°)
        {
          centro_id: 'o',
          radio: 4,
          desde_grados: 306,
          hasta_grados: 360,
          color: 'amarillo',
          relleno: true,
          label: 'Otro (54°)',
        },
      ],
      titulo: 'Grafica circular: deportes favoritos (20 alumnos)',
    },
    preguntas: [
      {
        pregunta:
          'La grafica circular muestra 4 sectores. ¿Cual deporte ocupa el sector mas grande?',
        tipo: 'opcion_multiple',
        opciones: ['A) Basquet', 'B) Futbol', 'C) Natacion', 'D) Otro'],
        respuesta: 'B',
      },
      {
        pregunta:
          'El sector de Futbol mide 144° de los 360° del circulo. ¿Que fraccion del total representa? Simplifica la fraccion.',
        tipo: 'calculo',
        respuesta:
          'Fraccion = 144/360 = 144÷72 / 360÷72 = 2/5.\nTambien: 8 alumnos de 20 = 8/20 = 2/5.\nRespuesta: Futbol representa 2/5 del total.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En una encuesta, 12 de 30 alumnos prefieren pizza. ¿Cuantos grados mediria el sector de pizza en una grafica circular?',
        opciones: ['A) 120°', 'B) 144°', 'C) 108°', 'D) 90°'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'En una clase de 25 alumnos, 10 prefieren matematicas, 8 ciencias y 7 historia. Calcula los grados de cada sector para hacer una grafica circular.',
        respuesta:
          'Matematicas: (10/25) x 360° = 144°.\nCiencias: (8/25) x 360° = 115.2°.\nHistoria: (7/25) x 360° = 100.8°.\nVerificacion: 144 + 115.2 + 100.8 = 360°.',
      },
      {
        tipo: 'abierta',
        pregunta:
          '¿Cuando conviene usar una grafica circular en vez de una grafica de barras? Da un ejemplo.',
        respuesta:
          'La grafica circular conviene cuando quieres mostrar que proporcion del total representa cada categoria. Por ejemplo, para ver que porcentaje del presupuesto se gasta en cada cosa. La de barras es mejor para comparar cantidades exactas.',
        criterios_aceptacion: [
          'proporciones o porcentajes del total',
          'ejemplo concreto',
          'diferencia con grafica de barras',
          'partes de un todo',
        ],
      },
    ],
  },
}
