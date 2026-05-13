import type { TareaCPA } from '@/types/tarea-cpa'

/**
 * Tarea de referencia — Secuencia 8: Propiedad distributiva
 * Concepto clave: Aplicar la propiedad distributiva
 *
 * Concreto: Azulejos de algebra mostrando 2(x + 3) = 14 → 2x + 6 = 14 → x = 4
 * Pictorico: Modelo en barras (2x + 6 en un lado, 14 en el otro)
 * Abstracto: 3 preguntas con progresion de dificultad sobre propiedad distributiva
 */
export const tareaSecuencia08: TareaCPA = {
  secuencia_ref: 8,
  concreto: {
    manipulable: {
      tipo_concreto: 'azulejos_algebra',
      ecuacion: '2(x + 3) = 14',
      lado_izquierdo: { x_barras: 2, unidades: 6 },
      lado_derecho: { x_barras: 0, unidades: 14 },
      solucion: 4,
      pregunta:
        'Usa los azulejos de algebra para resolver 2(x + 3) = 14. Primero distribuye el 2 y luego encuentra el valor de x.',
      pista:
        'Distribuye el 2: 2 x x = 2x y 2 x 3 = 6, entonces 2x + 6 = 14. Ahora quita 6 unidades de cada lado: 2x = 8. Divide entre 2: x = 4.',
    },
    intentos_para_pista: 3,
  },
  pictorico: {
    modelo_barras: {
      barras: [
        {
          label: '2x',
          valor: 8,
          color: 'azul',
          subdivisiones: 2,
        },
        {
          label: '6',
          valor: 6,
          color: 'amarillo',
          subdivisiones: 6,
        },
      ],
      total: { valor: 14, visible: true },
      orientacion: 'horizontal',
    },
    preguntas: [
      {
        pregunta:
          'El modelo muestra que 2x + 6 = 14. Si la parte amarilla vale 6, cuanto vale la parte azul (2x)?',
        tipo: 'opcion_multiple',
        opciones: ['A) 14', 'B) 6', 'C) 8', 'D) 4'],
        respuesta: 'C',
      },
      {
        pregunta:
          'Si 2x = 8, cual es el valor de x? Explica como lo obtuviste usando el modelo de barras.',
        tipo: 'calculo',
        respuesta:
          'En el modelo, la barra azul (2x) tiene 2 subdivisiones iguales y vale 8 en total. Cada subdivision representa una x: 8 / 2 = 4. Entonces x = 4. Podemos verificar: 2(4) + 6 = 8 + 6 = 14.',
      },
    ],
  },
  abstracto: {
    preguntas: [
      {
        tipo: 'opcion_multiple',
        pregunta: 'Cual es la expresion equivalente a 3(x + 5) usando la propiedad distributiva?',
        opciones: ['A) 3x + 5', 'B) 3x + 15', 'C) x + 15', 'D) 3x + 8'],
        respuesta: 'B',
      },
      {
        tipo: 'calculo',
        pregunta:
          'Resuelve la ecuacion 4(x + 2) = 24 usando la propiedad distributiva. Muestra todos los pasos.',
        respuesta:
          'Paso 1: Distribuir el 4: 4 x x + 4 x 2 = 4x + 8. Paso 2: La ecuacion queda 4x + 8 = 24. Paso 3: Restar 8 de ambos lados: 4x = 24 - 8 = 16. Paso 4: Dividir entre 4: x = 16 / 4 = 4. Verificacion: 4(4 + 2) = 4(6) = 24.',
      },
      {
        tipo: 'abierta',
        pregunta:
          'Explica con tus palabras que es la propiedad distributiva y por que es util. Usa el ejemplo de los azulejos de algebra con 2(x + 3) = 14 para apoyar tu explicacion.',
        respuesta:
          'La propiedad distributiva nos permite multiplicar un numero por una suma al multiplicarlo por cada sumando y luego sumar los resultados: a(b + c) = ab + ac. Es util porque nos ayuda a simplificar expresiones y resolver ecuaciones. Por ejemplo, con los azulejos, 2(x + 3) se convierte en 2x + 6 al distribuir el 2. Esto nos permite ver claramente cuantas barras de x y cuantas unidades tenemos, y asi resolver paso a paso: 2x + 6 = 14, luego 2x = 8, y finalmente x = 4.',
      },
    ],
  },
}
