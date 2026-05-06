'use client'

import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import RenderizadorPregunta from './RenderizadorPregunta.jsx'

export default function PreguntaConRemediacion({
  pregunta,
  indice,
  onResponder,
  diagnosticando,
  remediacion,
  onResponderRemediacion,
  diagnosticandoRemediacion,
}) {
  const [respuestaLocal, setRespuestaLocal] = useState(null)
  const [respuestaRemediacion, setRespuestaRemediacion] = useState(null)

  function handleValidar() {
    if (respuestaLocal === null || String(respuestaLocal).trim() === '') return
    onResponder(respuestaLocal)
  }

  function handleValidarRemediacion() {
    if (respuestaRemediacion === null || String(respuestaRemediacion).trim() === '') return
    onResponderRemediacion(respuestaRemediacion)
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <RenderizadorPregunta
        pregunta={pregunta}
        indice={indice}
        respuesta={respuestaLocal}
        onChange={setRespuestaLocal}
      />

      {!diagnosticando && !remediacion && (
        <Boton
          variante="primario"
          size="md"
          onClick={handleValidar}
          disabled={respuestaLocal === null || String(respuestaLocal).trim() === ''}
          className="w-full"
        >
          Validar respuesta
        </Boton>
      )}

      {diagnosticando && (
        <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
          <Spinner size="sm" />
          <span className="text-sm">Revisando tu respuesta...</span>
        </div>
      )}

      {remediacion && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-medium text-blue-800 mb-1">Aclaremos esto rápido</p>
            <p className="text-sm text-blue-700">{remediacion.diagnostico}</p>
          </div>

          {remediacion.pregunta_remediation && (
            <>
              <RenderizadorPregunta
                pregunta={remediacion.pregunta_remediation}
                indice={`R${indice + 1}`}
                respuesta={respuestaRemediacion}
                onChange={setRespuestaRemediacion}
              />

              {!diagnosticandoRemediacion && (
                <Boton
                  variante="primario"
                  size="md"
                  onClick={handleValidarRemediacion}
                  disabled={
                    respuestaRemediacion === null || String(respuestaRemediacion).trim() === ''
                  }
                  className="w-full"
                >
                  Validar respuesta
                </Boton>
              )}

              {diagnosticandoRemediacion && (
                <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
                  <Spinner size="sm" />
                  <span className="text-sm">Revisando...</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
