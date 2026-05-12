'use client'

import type { BloqueConcreto } from '@/types/tarea-cpa'
import type { EstadoManipulable } from './DulcesAgrupables'
import DulcesAgrupables from './DulcesAgrupables'

interface Props {
  bloque: BloqueConcreto
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export default function ManipulableDispatcher({
  bloque,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const spec = bloque.manipulable

  switch (spec.tipo_concreto) {
    case 'dulces_agrupables':
      return (
        <DulcesAgrupables
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'chocolate_secable':
    case 'bloques_base10':
    case 'balanza':
      return (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">
            Manipulable <span className="font-mono font-semibold">{spec.tipo_concreto}</span> —
            proximamente
          </p>
        </div>
      )

    default: {
      const _exhaustive: never = spec
      return null
    }
  }
}
