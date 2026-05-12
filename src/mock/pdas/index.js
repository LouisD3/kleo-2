export { PDAS_MATEMATICAS_1 } from './matematicas_1.js'

import { PDAS_MATEMATICAS_1 } from './matematicas_1.js'

export const TODAS_LAS_PDAS = [...PDAS_MATEMATICAS_1]

export function getPDAsByMateria(materia, grado) {
  return TODAS_LAS_PDAS.filter((p) => p.materia === materia && p.grado === grado)
}
