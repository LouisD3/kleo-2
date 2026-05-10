'use client'
export default function RenderizadorPregunta({ pregunta, indice, respuesta, onChange }) {
  const { tipo, pregunta: enunciado, opciones } = pregunta

  function renderEspacios() {
    const partes = enunciado.split('___')
    const blanks = partes.length - 1

    // Single blank: respuesta is a string
    // Multiple blanks: respuesta is an array of strings
    function getBlankValue(i) {
      if (blanks <= 1) return respuesta ?? ''
      return (Array.isArray(respuesta) ? respuesta[i] : '') ?? ''
    }

    function handleBlankChange(i, value) {
      if (blanks <= 1) {
        onChange(value)
      } else {
        const arr = Array.isArray(respuesta) ? [...respuesta] : Array(blanks).fill('')
        arr[i] = value
        onChange(arr)
      }
    }

    return (
      <div className="flex flex-wrap items-center gap-1 text-gray-800 text-sm leading-relaxed">
        {partes.map((parte, i) => (
          <span key={i} className="flex items-center gap-1 flex-wrap">
            <span>{parte}</span>
            {i < partes.length - 1 && (
              <input
                type="text"
                value={getBlankValue(i)}
                onChange={(e) => handleBlankChange(i, e.target.value)}
                placeholder="tu respuesta"
                className="border-b-2 border-amarillo bg-transparent focus:outline-none text-center text-gray-900 font-medium w-36 pb-0.5 placeholder:text-gray-300 placeholder:text-sm"
              />
            )}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="card p-5 sm:p-6 animate-slide-up">
      <div className="flex gap-3 mb-4">
        <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold">
          {indice + 1}
        </span>
        {tipo !== 'espacios' && (
          <p className="text-gray-800 text-sm leading-relaxed font-medium">{enunciado}</p>
        )}
      </div>

      {tipo === 'opcion_multiple' && (
        <div className="space-y-2 ml-10">
          {opciones?.map((opcion, i) => (
            <label
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                respuesta === opcion.charAt(0)
                  ? 'border-amarillo bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`pregunta-${indice}`}
                value={opcion.charAt(0)}
                checked={respuesta === opcion.charAt(0)}
                onChange={(e) => onChange(e.target.value)}
                className="accent-yellow-400 w-4 h-4 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{opcion}</span>
            </label>
          ))}
        </div>
      )}

      {tipo === 'verdadero_falso' && (
        <div className="flex gap-3 ml-10">
          {['Verdadero', 'Falso'].map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => onChange(opcion)}
              className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                respuesta === opcion
                  ? 'border-amarillo bg-yellow-50 text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {opcion === 'Verdadero' ? '✓ Verdadero' : '✗ Falso'}
            </button>
          ))}
        </div>
      )}

      {(tipo === 'abierta' || tipo === 'calculo') && (
        <textarea
          value={respuesta ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            tipo === 'calculo'
              ? 'Escribe tu procedimiento y resultado aquí...'
              : 'Escribe tu respuesta aquí...'
          }
          rows={4}
          className="input-base ml-0 mt-1 resize-none"
        />
      )}

      {tipo === 'espacios' && <div className="ml-10">{renderEspacios()}</div>}
    </div>
  )
}
