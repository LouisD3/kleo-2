/**
 * Biblioteca de contenido pedagogico — Matematicas 1o Secundaria
 *
 * 36 secuencias alineadas al programa NEM.
 * Cada secuencia contiene:
 *   - evaluacion: 5 preguntas (base para el Bloque Abstracto CPA)
 *   - orientacion: guia didactica para el profesor
 *   - libro: contenido de la leccion para consulta del alumno
 *   - diapositiva: 8 slides por secuencia
 *   - video_script: guion de video-leccion (5-7 min)
 */

import type { Secuencia } from '@/types/biblioteca'

import sec01 from './secuencia-01.json'
import sec02 from './secuencia-02.json'
import sec03 from './secuencia-03.json'
import sec04 from './secuencia-04.json'
import sec05 from './secuencia-05.json'
import sec06 from './secuencia-06.json'
import sec07 from './secuencia-07.json'
import sec08 from './secuencia-08.json'
import sec09 from './secuencia-09.json'
import sec10 from './secuencia-10.json'
import sec11 from './secuencia-11.json'
import sec12 from './secuencia-12.json'
import sec13 from './secuencia-13.json'
import sec14 from './secuencia-14.json'
import sec15 from './secuencia-15.json'
import sec16 from './secuencia-16.json'
import sec17 from './secuencia-17.json'
import sec18 from './secuencia-18.json'
import sec19 from './secuencia-19.json'
import sec20 from './secuencia-20.json'
import sec21 from './secuencia-21.json'
import sec22 from './secuencia-22.json'
import sec23 from './secuencia-23.json'
import sec24 from './secuencia-24.json'
import sec25 from './secuencia-25.json'
import sec26 from './secuencia-26.json'
import sec27 from './secuencia-27.json'
import sec28 from './secuencia-28.json'
import sec29 from './secuencia-29.json'
import sec30 from './secuencia-30.json'
import sec31 from './secuencia-31.json'
import sec32 from './secuencia-32.json'
import sec33 from './secuencia-33.json'
import sec34 from './secuencia-34.json'
import sec35 from './secuencia-35.json'
import sec36 from './secuencia-36.json'

const ALL_SECUENCIAS: Secuencia[] = [
  sec01,
  sec02,
  sec03,
  sec04,
  sec05,
  sec06,
  sec07,
  sec08,
  sec09,
  sec10,
  sec11,
  sec12,
  sec13,
  sec14,
  sec15,
  sec16,
  sec17,
  sec18,
  sec19,
  sec20,
  sec21,
  sec22,
  sec23,
  sec24,
  sec25,
  sec26,
  sec27,
  sec28,
  sec29,
  sec30,
  sec31,
  sec32,
  sec33,
  sec34,
  sec35,
  sec36,
] as Secuencia[]

/** All 36 secuencias */
export function getAllSecuencias(): Secuencia[] {
  return ALL_SECUENCIAS
}

/** Get a single secuencia by number (1-36) */
export function getSecuenciaById(id: number): Secuencia | undefined {
  return ALL_SECUENCIAS.find((s) => s.secuencia === id)
}

/** Lightweight index: just secuencia number, title, contenido, and PDA */
export function getSecuenciaIndex(): Array<{
  secuencia: number
  titulo: string
  contenido: string
  pda: string
}> {
  return ALL_SECUENCIAS.map(({ secuencia, titulo, contenido, pda }) => ({
    secuencia,
    titulo,
    contenido,
    pda,
  }))
}
