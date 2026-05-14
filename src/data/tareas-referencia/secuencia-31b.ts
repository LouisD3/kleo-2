import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 31b: Mediana
 * Concepto clave: Encontrar la mediana ordenando los datos y ubicando el valor central
 *
 * Concreto: DulcesAgrupables (ordenar 7 calificaciones agrupando de 1 en 1 para formar la fila ordenada)
 * Pictorico: Modelo en barras (7 barras ordenadas, la central resaltada)
 * Abstracto: 3 preguntas progresivas sobre mediana
 *
 * Nota: El manipulable ideal seria tarjetas_ordenables (backlog).
 * Workaround: dulces_agrupables con 7 items en 7 grupos (1 por grupo = ordenar).
 */
export const tareaSecuencia31b: TareaCPA = {
  secuencia_ref: 31,
  contexto: {
    personaje: 'Profesor Garcia',
    objetos: { a: { nombre: 'calificacion', emoji: '📝' }, b: { nombre: 'mediana', emoji: '🎯' } },
    valores_clave: { datos: [4, 5, 6, 7, 7, 8, 9], mediana: 7 },
    tipo: 'estadistica',
    narrativa: 'El Profesor Garcia tiene 7 calificaciones desordenadas y quiere encontrar la mediana: el valor que queda exactamente en el centro al ordenar.',
    pregunta_central: '¿Cual es la mediana de las calificaciones 7, 4, 8, 6, 9, 5, 7?',
    transiciones: {
      concreto: 'Ordena las 7 calificaciones de menor a mayor agrupandolas.',
      bridge_pictorico: 'Ordenadas: 4, 5, 6, 7, 7, 8, 9. El valor del medio (posicion 4) es 7.',
      pictorico: 'Observa en el modelo cual barra queda en el centro.',
      bridge_abstracto: 'La mediana es el valor central. Con n datos, esta en la posicion (n+1)/2.',
      abstracto: 'Ahora encuentra medianas en otros conjuntos.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'dulces_agrupables',
      cantidad: 7,
      grupos_objetivo: 7,
      soluciones_validas: [{ grupos: 7, por_grupo: 1 }],
      pregunta:
        'Las calificaciones son: 7, 4, 8, 6, 9, 5, 7. Coloca cada calificacion en su posicion para ordenarlas de menor a mayor.',
      pista: 'Busca la menor (4), luego la siguiente (5), y asi hasta la mayor (9). La del medio es la mediana.',
      etiqueta: 'calificacion',
      emoji: '📝',
      etiqueta_grupo: 'Posicion',
      emoji_grupo: '📍',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: '4', valor: 4, color: 'azul' },
        { label: '5', valor: 5, color: 'azul' },
        { label: '6', valor: 6, color: 'azul' },
        { label: '7', valor: 7, color: 'amarillo' },
        { label: '7', valor: 7, color: 'azul' },
        { label: '8', valor: 8, color: 'azul' },
        { label: '9', valor: 9, color: 'azul' },
      ],
      orientacion: 'vertical',
    },
    preguntas: [
      {
        pregunta:
          'Las barras estan ordenadas de menor a mayor. Son 7 valores. Cual posicion ocupa la mediana?',
        tipo: 'opcion_multiple',
        opciones: ['A) La 3a', 'B) La 4a', 'C) La 5a', 'D) La 7a'],
        respuesta: 'B',
      },
      {
        pregunta:
          'La barra amarilla (posicion 4) tiene valor 7. Explica por que ese es la mediana y no el promedio.',
        tipo: 'abierta',
        respuesta:
          'La mediana es el valor que queda en el centro al ordenar los datos, no el resultado de sumar y dividir. Con 7 datos, el centro es la posicion 4. El promedio (media) seria (4+5+6+7+7+8+9)/7 = 46/7 = 6.57, que es diferente de la mediana (7).',
        criterios_aceptacion: ['valor central al ordenar', 'posicion 4 de 7', 'diferente del promedio', 'media seria 6.57'],
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'Los datos son: 3, 5, 7, 9, 11. La mediana es:',
        opciones: ['A) 5', 'B) 7', 'C) 9', 'D) 35/5 = 7'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Encuentra la mediana de: 12, 8, 15, 6, 10, 3. Ojo: hay un numero par de datos. Muestra el procedimiento.',
        respuesta:
          'Paso 1: Ordenar: 3, 6, 8, 10, 12, 15.\nPaso 2: Son 6 datos (par). La mediana es el promedio de los dos centrales (posiciones 3 y 4).\nPaso 3: Mediana = (8 + 10) / 2 = 18 / 2 = 9.\nRespuesta: La mediana es 9.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Un grupo tiene calificaciones: 5, 6, 7, 7, 100. La media es 25 pero la mediana es 7. Cual describe mejor al grupo? Explica por que.',
        respuesta:
          'La mediana (7) describe mejor al grupo porque la mayoria saco entre 5 y 7. La media (25) esta inflada por el valor extremo 100. La mediana no se afecta por valores atipicos, por eso es mas representativa aqui.',
        criterios_aceptacion: ['mediana mas representativa', 'media inflada por valor extremo', '100 es atipico', 'mediana no se afecta por extremos'],
      },
    ],
  },
}
