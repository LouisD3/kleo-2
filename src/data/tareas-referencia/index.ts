import type { TareaCPA } from '@/types/tarea-cpa'
import { tareaSecuencia14 } from './secuencia-14'

const TAREAS_REFERENCIA: TareaCPA[] = [tareaSecuencia14]

/** Get all reference tareas */
export function getAllTareasReferencia(): TareaCPA[] {
  return TAREAS_REFERENCIA
}

/** Get a reference tarea by secuencia number */
export function getTareaReferencia(secuencia: number): TareaCPA | undefined {
  return TAREAS_REFERENCIA.find((t) => t.secuencia_ref === secuencia)
}
