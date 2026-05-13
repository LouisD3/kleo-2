'use client'

import type { BloqueConcreto } from '@/types/tarea-cpa'
import AzulejosAlgebra from './AzulejosAlgebra'
import Balanza from './Balanza'
import BloquesBase10 from './BloquesBase10'
import ChocolateSecable from './ChocolateSecable'
import CompasCirculo from './CompasCirculo'
import Cuadricula100 from './Cuadricula100'
import DadosRuleta from './DadosRuleta'
import FichasPositivasNegativas from './FichasPositivasNegativas'
import Geoplano from './Geoplano'
import HistogramaConstruible from './HistogramaConstruible'
import InterruptoresBinarios from './InterruptoresBinarios'
import ManipulableAgrupable from './ManipulableAgrupable'
import PatronFiguras from './PatronFiguras'
import RectaNumerica from './RectaNumerica'
import TablaVerdad from './TablaVerdad'
import TirasFracciones from './TirasFracciones'

interface Props {
  bloque: BloqueConcreto
  // biome-ignore lint/suspicious/noExplicitAny: each manipulable has its own state shape
  estadoInicial?: any
  onValidado: (intentos: number, pistaUsada: boolean) => void
  // biome-ignore lint/suspicious/noExplicitAny: each manipulable has its own state shape
  onChange?: (estado: any) => void
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
        <ManipulableAgrupable
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'chocolate_secable':
      return (
        <ChocolateSecable
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'bloques_base10':
      return (
        <BloquesBase10
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'balanza':
      return (
        <Balanza
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'recta_numerica':
      return (
        <RectaNumerica
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'tiras_fracciones':
      return (
        <TirasFracciones
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'cuadricula_100':
      return (
        <Cuadricula100
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'patron_figuras':
      return (
        <PatronFiguras
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'fichas_positivas_negativas':
      return (
        <FichasPositivasNegativas
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'azulejos_algebra':
      return (
        <AzulejosAlgebra
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'geoplano':
      return (
        <Geoplano
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'dados_ruleta':
      return (
        <DadosRuleta
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'histograma_construible':
      return (
        <HistogramaConstruible
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'compas_circulo':
      return (
        <CompasCirculo
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'tabla_verdad':
      return (
        <TablaVerdad
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    case 'interruptores_binarios':
      return (
        <InterruptoresBinarios
          spec={spec}
          intentos_para_pista={bloque.intentos_para_pista}
          estadoInicial={estadoInicial}
          onValidado={onValidado}
          onChange={onChange}
        />
      )

    default: {
      const _exhaustive: never = spec
      return null
    }
  }
}
