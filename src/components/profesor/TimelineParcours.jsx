'use client'

export default function TimelineParcours({ parcours, preguntas }) {
  if (!parcours || parcours.length === 0) return null

  // Group by pregunta_index
  const grouped = {}
  for (const step of parcours) {
    const idx = step.pregunta_index
    if (!grouped[idx]) grouped[idx] = []
    grouped[idx].push(step)
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Recorrido del alumno
      </h4>
      <div className="relative pl-4 border-l-2 border-gray-200 space-y-4">
        {Object.entries(grouped).map(([idx, steps]) => {
          const preguntaOriginal = preguntas?.[Number(idx)]
          const originalStep = steps.find((s) => s.tipo === 'original')
          const remediaciones = steps.filter((s) => s.tipo === 'remediacion')

          return (
            <div key={idx} className="relative">
              {/* Dot */}
              <div
                className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white ${
                  originalStep?.es_correcta ? 'bg-green-500' : 'bg-red-400'
                }`}
              />

              <div className="space-y-2">
                {/* Original question */}
                <div className="text-sm">
                  <span className="font-medium text-gray-700">P{Number(idx) + 1}</span>
                  {preguntaOriginal && (
                    <span className="text-gray-400 ml-2 text-xs truncate inline-block max-w-[200px] align-middle">
                      {preguntaOriginal.pregunta?.slice(0, 50)}...
                    </span>
                  )}
                  <span
                    className={`ml-2 text-xs font-medium ${
                      originalStep?.es_correcta ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {originalStep?.es_correcta ? 'Correcta' : 'Incorrecta'}
                  </span>
                </div>

                {/* Remediations */}
                {remediaciones.map((rem, i) => (
                  <div key={i} className="ml-4 pl-3 border-l border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600">
                        Remediación {rem.intento}
                      </span>
                      <span
                        className={`text-xs ${rem.es_correcta ? 'text-green-600' : 'text-red-500'}`}
                      >
                        {rem.es_correcta ? 'Resuelta' : 'Fallida'}
                      </span>
                    </div>
                    {rem.diagnostico && (
                      <p className="text-xs text-gray-500 mt-0.5">{rem.diagnostico}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
