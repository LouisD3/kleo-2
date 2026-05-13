import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 13B: Calcular un descuento
 * Concepto clave: Calcular un descuento con porcentajes usando la cuadricula de 100
 *
 * Concreto: Cuadricula100 (sombrear 20 de 100 casillas = 20% de descuento)
 * Pictorico: Modelo en barras (20% descuento vs 80% que pagas)
 * Abstracto: 3 preguntas progresivas sobre descuentos
 */
export const tareaSecuencia13b: TareaCPA = {
  secuencia_ref: 13,
  concreto: {
    manipulable: {
      tipo_concreto: 'cuadricula_100',
      porcentaje_objetivo: 20,
      pregunta:
        'Una tienda ofrece 20% de descuento. Sombrea las casillas que representan el descuento en la cuadricula de 100.',
      pista: 'El 20% de descuento significa que te quitan 20 de cada 100 pesos. Sombrea 20 casillas.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        { label: 'Descuento (20%)', valor: 20, color: 'rojo', subdivisiones: 4 },
        { label: 'Lo que pagas (80%)', valor: 80, color: 'verde', subdivisiones: 16 },
      ],
      total: { valor: 100, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'Sombreaste 20 casillas para el descuento. Segun el modelo, que porcentaje del precio original terminas pagando?',
        tipo: 'opcion_multiple',
        opciones: ['A) 20%', 'B) 60%', 'C) 80%', 'D) 100%'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si un producto cuesta $100 y tiene 20% de descuento, cuanto pagas? Relaciona tu respuesta con las casillas sombreadas.',
        tipo: 'calculo',
        respuesta:
          'De 100 casillas, 20 son el descuento y 80 son lo que pago. Entonces pago el 80% de $100 = $80. El descuento es $20.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta:
          'En la cuadricula, el descuento de 20% eran 20 casillas y pagabas 80 casillas. Si el descuento fuera 30%, cuantas casillas pagarias?',
        opciones: ['A) 30', 'B) 60', 'C) 70', 'D) 80'],
        respuesta: 'C',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Una mochila cuesta $400 y tiene 25% de descuento. Cuanto pagas por la mochila? Muestra el procedimiento.',
        respuesta:
          'Paso 1: Descuento = 25% de $400 = 0.25 x 400 = $100.\nPaso 2: Precio final = $400 - $100 = $300.\nRespuesta: Pagas $300 por la mochila.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Si un producto tiene primero un descuento de 20% y luego otro descuento de 20%, es lo mismo que un descuento de 40%? Explica usando numeros.',
        respuesta:
          'No es lo mismo. Ejemplo: un producto de $100 con 20% de descuento queda en $80. Luego otro 20% de descuento se aplica sobre $80 (no sobre $100): 20% de $80 = $16, entonces queda en $64. Con 40% de descuento directo: 40% de $100 = $40, quedaria en $60. $64 no es igual a $60. El segundo descuento se calcula sobre un precio ya rebajado.',
      },
    ],
  },
}
