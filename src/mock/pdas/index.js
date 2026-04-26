export { PDAS_BIOLOGIA_1 } from './biologia_1.js'
export { PDAS_FISICA_2 } from './fisica_2.js'
export { PDAS_QUIMICA_3 } from './quimica_3.js'
export { PDAS_FCyE_1 } from './fcye_1.js'
export { PDAS_FCyE_2 } from './fcye_2.js'
export { PDAS_FCyE_3 } from './fcye_3.js'
export { PDAS_GEOGRAFIA_1 } from './geografia_1.js'
export { PDAS_HISTORIA_MEXICO_1 } from './historia_mexico_1.js'
export { PDAS_HISTORIA_MEXICO_2 } from './historia_mexico_2.js'
export { PDAS_HISTORIA_MUNDIAL_3 } from './historia_mundial_3.js'
export { PDAS_LENGUAJES_1 } from './lenguajes_1.js'
export { PDAS_LENGUAJES_2 } from './lenguajes_2.js'
export { PDAS_LENGUAJES_3 } from './lenguajes_3.js'
export { PDAS_MATEMATICAS_1 } from './matematicas_1.js'
export { PDAS_MATEMATICAS_2 } from './matematicas_2.js'
export { PDAS_MATEMATICAS_3 } from './matematicas_3.js'

import { PDAS_BIOLOGIA_1 } from './biologia_1.js'
import { PDAS_FISICA_2 } from './fisica_2.js'
import { PDAS_QUIMICA_3 } from './quimica_3.js'
import { PDAS_FCyE_1 } from './fcye_1.js'
import { PDAS_FCyE_2 } from './fcye_2.js'
import { PDAS_FCyE_3 } from './fcye_3.js'
import { PDAS_GEOGRAFIA_1 } from './geografia_1.js'
import { PDAS_HISTORIA_MEXICO_1 } from './historia_mexico_1.js'
import { PDAS_HISTORIA_MEXICO_2 } from './historia_mexico_2.js'
import { PDAS_HISTORIA_MUNDIAL_3 } from './historia_mundial_3.js'
import { PDAS_LENGUAJES_1 } from './lenguajes_1.js'
import { PDAS_LENGUAJES_2 } from './lenguajes_2.js'
import { PDAS_LENGUAJES_3 } from './lenguajes_3.js'
import { PDAS_MATEMATICAS_1 } from './matematicas_1.js'
import { PDAS_MATEMATICAS_2 } from './matematicas_2.js'
import { PDAS_MATEMATICAS_3 } from './matematicas_3.js'

export const TODAS_LAS_PDAS = [
  ...PDAS_BIOLOGIA_1,
  ...PDAS_FISICA_2,
  ...PDAS_QUIMICA_3,
  ...PDAS_FCyE_1,
  ...PDAS_FCyE_2,
  ...PDAS_FCyE_3,
  ...PDAS_GEOGRAFIA_1,
  ...PDAS_HISTORIA_MEXICO_1,
  ...PDAS_HISTORIA_MEXICO_2,
  ...PDAS_HISTORIA_MUNDIAL_3,
  ...PDAS_LENGUAJES_1,
  ...PDAS_LENGUAJES_2,
  ...PDAS_LENGUAJES_3,
  ...PDAS_MATEMATICAS_1,
  ...PDAS_MATEMATICAS_2,
  ...PDAS_MATEMATICAS_3,
]

export function getPDAsByMateria(materia, grado) {
  return TODAS_LAS_PDAS.filter((p) => p.materia === materia && p.grado === grado)
}
