import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 8b: Propiedad distributiva (numerica)
 * Concepto clave: Visualizar la distributiva con numeros antes de pasar al algebra
 *
 * Concreto: BloquesBase10 (descomponer 3 × 12 = 3×10 + 3×2 = 36)
 * Pictorico: Modelo en barras (3 barras de 12 subdivididas en 10+2)
 * Abstracto: 3 preguntas progresivas sobre distributiva numerica
 */
export const tareaSecuencia08b: TareaCPA = {
  secuencia_ref: 8,
  concepto_clave: 'Visualizar la distributiva con numeros antes de pasar al algebra',
  contexto: {
    personaje: 'Ana',
    objetos: { a: { nombre: 'bloque', emoji: '🧱' }, b: { nombre: 'multiplicacion', emoji: '✖️' } },
    valores_clave: { objetivo: 36 },
    tipo: 'numero',
    narrativa: 'Ana quiere calcular 3 × 12 sin multiplicar directamente. Descompone el 12 en 10 + 2 y multiplica cada parte por 3.',
    pregunta_central: '¿Como calcular 3 × 12 usando la propiedad distributiva?',
    transiciones: {
      concreto: 'Arma 3 grupos de 12 usando bloques de 10 y unidades.',
      bridge_pictorico: '3 × 12 = 3 × (10 + 2) = 30 + 6 = 36.',
      pictorico: 'Observa como cada barra de 12 se divide en 10 + 2.',
      bridge_abstracto: 'Distribuir la multiplicacion en partes mas faciles es la propiedad distributiva.',
      abstracto: 'Ahora aplica la distributiva a otros calculos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'bloques_base10',
      numero_objetivo: 36,
      unidades_disponibles: { unidades: 20, barras: 5, cuadrados: 0 },
      soluciones_validas: [{ unidades: 6, barras: 3, cuadrados: 0 }],
      pregunta:
        'Representa 3 × 12 con bloques. Usa 3 barras de 10 y 6 unidades para mostrar que 3 × 12 = 3 × 10 + 3 × 2 = 30 + 6 = 36.',
      pista: 'Descompone 12 = 10 + 2. Tres veces 10 son 3 barras (30). Tres veces 2 son 6 unidades. Total: 36.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: '3 × 10 = 30', valor: 30, color: 'azul', subdivisiones: 3 },
        { label: '3 × 2 = 6', valor: 6, color: 'amarillo', subdivisiones: 3 },
      ],
      total: { valor: 36, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo muestra 3 × 12 descompuesto en dos partes: 3 × 10 y 3 × 2. Cual es el total?',
        tipo: 'opcion_multiple',
        opciones: ['A) 30', 'B) 32', 'C) 36', 'D) 42'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Explica como la propiedad distributiva te permite calcular 3 × 12 sin multiplicar directamente.',
        tipo: 'abierta',
        respuesta:
          'La distributiva dice que 3 × 12 = 3 × (10 + 2) = 3×10 + 3×2 = 30 + 6 = 36. Se descompone el numero grande en partes faciles de multiplicar y luego se suman los resultados.',
        criterios_aceptacion: ['descomponer 12 en 10 + 2', '3×10 = 30', '3×2 = 6', 'sumar 30 + 6 = 36'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: '4 × 15 se puede calcular como:',
        opciones: ['A) 4×10 + 4×5 = 60', 'B) 4×10 + 5 = 45', 'C) 4+10 × 4+5 = 54', 'D) 4×15 = 65'],
        respuesta: 'A',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Calcula 7 × 23 usando la propiedad distributiva. Descompone el 23 y muestra todos los pasos.',
        respuesta:
          'Paso 1: 23 = 20 + 3.\nPaso 2: 7 × 23 = 7 × (20 + 3) = 7×20 + 7×3.\nPaso 3: 7×20 = 140, 7×3 = 21.\nPaso 4: 140 + 21 = 161.\nRespuesta: 7 × 23 = 161.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica por que la propiedad distributiva es util para el calculo mental. Usa un ejemplo con un numero de dos cifras.',
        respuesta:
          'Es mas facil multiplicar por numeros redondos. Por ejemplo, 6 × 18 = 6×20 - 6×2 = 120 - 12 = 108. En vez de una multiplicacion dificil, hacemos dos faciles.',
        criterios_aceptacion: ['mas facil con numeros redondos', 'ejemplo con dos cifras', 'descomposicion correcta', 'calculo mental mas rapido'],
      },
    ],
  },
}
