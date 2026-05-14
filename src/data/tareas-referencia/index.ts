import type { TareaCPA } from '@/types/tarea-cpa'
import { tareaSecuencia01a } from './secuencia-01a'
import { tareaSecuencia01b } from './secuencia-01b'
import { tareaSecuencia01c } from './secuencia-01c'
import { tareaSecuencia02 } from './secuencia-02'
import { tareaSecuencia03 } from './secuencia-03'
import { tareaSecuencia04 } from './secuencia-04'
import { tareaSecuencia05a } from './secuencia-05a'
import { tareaSecuencia05b } from './secuencia-05b'
import { tareaSecuencia05c } from './secuencia-05c'
import { tareaSecuencia06 } from './secuencia-06'
import { tareaSecuencia07 } from './secuencia-07'
import { tareaSecuencia08 } from './secuencia-08'
import { tareaSecuencia08b } from './secuencia-08b'
import { tareaSecuencia09a } from './secuencia-09a'
import { tareaSecuencia09b } from './secuencia-09b'
import { tareaSecuencia10 } from './secuencia-10'
import { tareaSecuencia11 } from './secuencia-11'
import { tareaSecuencia11b } from './secuencia-11b'
import { tareaSecuencia12a } from './secuencia-12a'
import { tareaSecuencia12b } from './secuencia-12b'
import { tareaSecuencia12c } from './secuencia-12c'
import { tareaSecuencia13a } from './secuencia-13a'
import { tareaSecuencia13b } from './secuencia-13b'
import { tareaSecuencia14a } from './secuencia-14a'
import { tareaSecuencia14b } from './secuencia-14b'
import { tareaSecuencia15a } from './secuencia-15a'
import { tareaSecuencia15b } from './secuencia-15b'
import { tareaSecuencia16 } from './secuencia-16'
import { tareaSecuencia17 } from './secuencia-17'
import { tareaSecuencia17b } from './secuencia-17b'
import { tareaSecuencia18 } from './secuencia-18'
import { tareaSecuencia18b } from './secuencia-18b'
import { tareaSecuencia19 } from './secuencia-19'
import { tareaSecuencia20 } from './secuencia-20'
import { tareaSecuencia20b } from './secuencia-20b'
import { tareaSecuencia20c } from './secuencia-20c'
import { tareaSecuencia21 } from './secuencia-21'
import { tareaSecuencia22 } from './secuencia-22'
import { tareaSecuencia23 } from './secuencia-23'
import { tareaSecuencia24 } from './secuencia-24'
import { tareaSecuencia25 } from './secuencia-25'
import { tareaSecuencia26 } from './secuencia-26'
import { tareaSecuencia27 } from './secuencia-27'
import { tareaSecuencia28 } from './secuencia-28'
import { tareaSecuencia28b } from './secuencia-28b'
import { tareaSecuencia29 } from './secuencia-29'
import { tareaSecuencia30 } from './secuencia-30'
import { tareaSecuencia30b } from './secuencia-30b'
import { tareaSecuencia31 } from './secuencia-31'
import { tareaSecuencia31b } from './secuencia-31b'
import { tareaSecuencia31c } from './secuencia-31c'
import { tareaSecuencia32 } from './secuencia-32'
import { tareaSecuencia32b } from './secuencia-32b'
import { tareaSecuencia33 } from './secuencia-33'
import { tareaSecuencia34 } from './secuencia-34'
import { tareaSecuencia34b } from './secuencia-34b'
import { tareaSecuencia35 } from './secuencia-35'
import { tareaSecuencia35b } from './secuencia-35b'
import { tareaSecuencia36 } from './secuencia-36'

const TAREAS_REFERENCIA: TareaCPA[] = [
  // Secuencia 1 — Fracciones y decimales
  tareaSecuencia01a,
  tareaSecuencia01b,
  tareaSecuencia01c,
  // Secuencia 2 — Enteros negativos
  tareaSecuencia02,
  // Secuencia 3 — Comparacion de numeros con signo
  tareaSecuencia03,
  // Secuencia 4 — Densidad del orden
  tareaSecuencia04,
  // Secuencia 5 — Suma y resta
  tareaSecuencia05a,
  tareaSecuencia05b,
  tareaSecuencia05c,
  // Secuencia 6 — Multiplicacion y division
  tareaSecuencia06,
  // Secuencia 7 — Propiedad conmutativa y asociativa
  tareaSecuencia07,
  // Secuencia 8 — Propiedad distributiva
  tareaSecuencia08,
  tareaSecuencia08b,
  // Secuencia 9 — Sucesiones aritmeticas
  tareaSecuencia09a,
  tareaSecuencia09b,
  // Secuencia 10 — Introduccion al algebra
  tareaSecuencia10,
  // Secuencia 11 — Perimetros
  tareaSecuencia11,
  tareaSecuencia11b,
  // Secuencia 12 — Ecuaciones lineales
  tareaSecuencia12a,
  tareaSecuencia12b,
  tareaSecuencia12c,
  // Secuencia 13 — Porcentajes
  tareaSecuencia13a,
  tareaSecuencia13b,
  // Secuencia 14 — Razones
  tareaSecuencia14a,
  tareaSecuencia14b,
  // Secuencia 15 — Proporcionalidad
  tareaSecuencia15a,
  tareaSecuencia15b,
  // Secuencia 16 — Rectas
  tareaSecuencia16,
  // Secuencia 17 — Angulos
  tareaSecuencia17,
  tareaSecuencia17b,
  // Secuencia 18 — Punto medio y mediatriz
  tareaSecuencia18,
  tareaSecuencia18b,
  // Secuencia 19 — Bisectriz y angulos congruentes
  tareaSecuencia19,
  // Secuencia 20 — Rectas notables
  tareaSecuencia20,
  tareaSecuencia20b,
  tareaSecuencia20c,
  // Secuencia 21 — Tipos de triangulos y cuadrilateros
  tareaSecuencia21,
  // Secuencia 22 — Rectas notables en el circulo
  tareaSecuencia22,
  // Secuencia 23 — Figuras relacionadas con el circulo
  tareaSecuencia23,
  // Secuencia 24 — Partes del circulo
  tareaSecuencia24,
  // Secuencia 25 — Distancia entre dos puntos
  tareaSecuencia25,
  // Secuencia 26 — Distancia punto a recta
  tareaSecuencia26,
  // Secuencia 27 — Desigualdad triangular
  tareaSecuencia27,
  // Secuencia 28 — Perimetro y area
  tareaSecuencia28,
  tareaSecuencia28b,
  // Secuencia 29 — Analisis estadistico
  tareaSecuencia29,
  // Secuencia 30 — Frecuencia absoluta y relativa
  tareaSecuencia30,
  tareaSecuencia30b,
  // Secuencia 31 — Medidas de tendencia central
  tareaSecuencia31,
  tareaSecuencia31b,
  tareaSecuencia31c,
  // Secuencia 32 — Probabilidades
  tareaSecuencia32,
  tareaSecuencia32b,
  // Secuencia 33 — Eventos aleatorios
  tareaSecuencia33,
  // Secuencia 34 — Conjuncion y disyuncion
  tareaSecuencia34,
  tareaSecuencia34b,
  // Secuencia 35 — Condicionales y bicondicionales
  tareaSecuencia35,
  tareaSecuencia35b,
  // Secuencia 36 — Numeros binarios
  tareaSecuencia36,
]

/** Get all reference tareas */
export function getAllTareasReferencia(): TareaCPA[] {
  return TAREAS_REFERENCIA
}

/** Get all reference tareas for a given secuencia number */
export function getTareasReferencia(secuencia: number): TareaCPA[] {
  return TAREAS_REFERENCIA.filter((t) => t.secuencia_ref === secuencia)
}

/** Get a reference tarea by secuencia number (returns first match — for backward compat) */
export function getTareaReferencia(secuencia: number): TareaCPA | undefined {
  return TAREAS_REFERENCIA.find((t) => t.secuencia_ref === secuencia)
}
