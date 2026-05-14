import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 5c: Suma y resta
 * Concepto clave: Restar como operacion inversa de la suma
 *
 * Concreto: BloquesBase10 (representar 235 - 148 = 87 con bloques)
 * Pictorico: Modelo en barras (235 total, 148 vendidos, 87 restantes)
 * Abstracto: 3 preguntas con progresion de dificultad sobre resta como inversa
 */
export const tareaSecuencia05c: TareaCPA = {
  secuencia_ref: 5,
  contexto: {
    personaje: 'Diego',
    objetos: { a: { nombre: 'bloque', emoji: '🧱' }, b: { nombre: 'resta', emoji: '➖' } },
    valores_clave: { objetivo: 87 },
    tipo: 'numero',
    narrativa: 'Diego quiere restar 235 - 148 usando bloques de base 10. A veces necesita desagrupar.',
    pregunta_central: '¿Cuanto es 235 - 148?',
    transiciones: {
      concreto: 'Quita bloques para restar. Desagrupa si necesitas mas unidades.',
      bridge_pictorico: '235 - 148 = 87. Tuviste que desagrupar una decena.',
      pictorico: 'Observa la resta en el modelo de barras.',
      bridge_abstracto: 'Restar es la operacion inversa de sumar.',
      abstracto: 'Ahora resta otros numeros.',
    },
  },
  concreto: {
    manipulable: {
      tipo_concreto: 'bloques_base10',
      numero_objetivo: 87,
      unidades_disponibles: { unidades: 15, barras: 10, cuadrados: 3 },
      soluciones_validas: [{ unidades: 7, barras: 8, cuadrados: 0 }],
      pregunta:
        'Una tienda tenia 235 articulos y vendio 148. Representa cuantos quedan usando bloques de base 10.',
      pista:
        'Empieza restando las unidades: 5 - 8 no se puede directamente, asi que desagrupa 1 barra en 10 cubitos.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    representacion: {
      tipo_representacion: 'modelo_barras',
      barras: [
        { label: 'Vendidos', valor: 148, color: 'rojo', subdivisiones: 1 },
        { label: 'Quedan', valor: 87, color: 'verde', subdivisiones: 1 },
      ],
      total: { valor: 235, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Segun el modelo de barras, cuantos articulos quedan en la tienda despues de la venta?',
        tipo: 'opcion_multiple',
        opciones: ['A) 77', 'B) 87', 'C) 97', 'D) 148'],
        respuesta: 'B',
      },
      {
        pregunta:
          'Observa el modelo. Si sumamos los articulos vendidos y los que quedan, que obtenemos? Escribe la operacion y explica que relacion tiene con la resta.',
        tipo: 'calculo',
        respuesta:
          'Si sumamos los vendidos y los que quedan: 148 + 87 = 235, que es el total original. Esto demuestra que la resta es la operacion inversa de la suma: si 235 - 148 = 87, entonces 148 + 87 = 235.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Cuanto es 235 - 148?',
        opciones: ['A) 77', 'B) 87', 'C) 93', 'D) 97'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Pedro tenia $500 y gasto $237 en utiles escolares. Cuanto dinero le queda? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Restar unidades: 0 - 7 no se puede, desagrupo 1 decena: 10 - 7 = 3.\nPaso 2: Restar decenas: 9 - 3 = 6 (porque preste 1 decena).\nPaso 3: Restar centenas: 4 - 2 = 2 (porque preste 1 centena al paso anterior).\nRespuesta: 500 - 237 = 263. A Pedro le quedan $263.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras por que la resta es la operacion inversa de la suma. Usa un ejemplo con numeros para demostrarlo.',
        respuesta:
          'La resta deshace lo que la suma hace. Si 148 + 87 = 235, entonces 235 - 148 = 87. Si a + b = c, siempre podemos recuperar un sumando restando el otro al resultado.',
        criterios_aceptacion: [
          'operacion inversa',
          'deshace la suma',
          'ejemplo numerico correcto',
          'relacion a + b = c implica c - a = b',
        ],
      },
    ],
  },
}
