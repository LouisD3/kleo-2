import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar.jsx'
import Boton from '../../components/ui/Boton.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import MensajeError from '../../components/ui/MensajeError.jsx'
import { useAnthropicAPI } from '../../hooks/useAnthropicAPI.js'
import useTareaStore from '../../store/useTareaStore.js'

const MATERIAS = ['Matemáticas', 'Historia', 'Español', 'Ciencias', 'Geografía', 'Inglés', 'Biología', 'Física', 'Química', 'Formación Cívica']
const DIFICULTADES = ['Fácil', 'Media', 'Difícil']
const METODOLOGIAS = ['Feynman', 'Memorización activa', 'Resolución de problemas']
const TIPOS_EJERCICIO = [
  'Preguntas abiertas',
  'Opción múltiple',
  'Verdadero/Falso',
  'Completar espacios en blanco',
  'Cálculo/Resolución de problemas',
  'Ejercicio mixto',
]

export default function GenerarTarea() {
  const navigate = useNavigate()
  const { generarTarea, cargando, error, setError } = useAnthropicAPI()
  const { agregarTarea, actualizarTarea, publicarTarea } = useTareaStore()

  const [form, setForm] = useState({
    nombre: '',
    materia: 'Matemáticas',
    dificultad: 'Media',
    metodologia: 'Feynman',
    tipos: ['Opción múltiple'],
    numeroPreguntas: 5,
  })

  const [tareaGenerada, setTareaGenerada] = useState(null)
  const [tareaGuardada, setTareaGuardada] = useState(null)
  const [editando, setEditando] = useState(false)
  const [textoEdicion, setTextoEdicion] = useState('')

  function toggleTipo(tipo) {
    setForm((prev) => {
      const esEjercicioMixto = tipo === 'Ejercicio mixto'
      if (esEjercicioMixto) {
        return { ...prev, tipos: ['Ejercicio mixto'] }
      }
      const tiposSinMixto = prev.tipos.filter((t) => t !== 'Ejercicio mixto')
      if (tiposSinMixto.includes(tipo)) {
        const nuevos = tiposSinMixto.filter((t) => t !== tipo)
        return { ...prev, tipos: nuevos.length === 0 ? [tipo] : nuevos }
      }
      return { ...prev, tipos: [...tiposSinMixto, tipo] }
    })
  }

  async function handleGenerar() {
    if (!form.nombre.trim()) {
      setError('Por favor escribe un nombre para la tarea.')
      return
    }
    if (form.tipos.length === 0) {
      setError('Selecciona al menos un tipo de ejercicio.')
      return
    }

    const resultado = await generarTarea({
      materia: form.materia,
      dificultad: form.dificultad,
      metodologia: form.metodologia,
      tipos: form.tipos,
      numeroPreguntas: form.numeroPreguntas,
    })

    if (resultado?.preguntas) {
      const nueva = agregarTarea({ ...form, preguntas: resultado.preguntas })
      setTareaGenerada(resultado.preguntas)
      setTareaGuardada(nueva)
    }
  }

  function handlePublicar() {
    if (!tareaGuardada) return
    publicarTarea(tareaGuardada.id)
    navigate('/profesor')
  }

  function handleIniciarEdicion() {
    setTextoEdicion(
      tareaGenerada
        .map((p, i) => `${i + 1}. ${p.pregunta}`)
        .join('\n\n')
    )
    setEditando(true)
  }

  function handleGuardarEdicion() {
    const lineas = textoEdicion.split('\n').filter((l) => l.trim())
    const preguntasEditadas = tareaGenerada.map((p, i) => {
      const lineaEncontrada = lineas.find((l) => l.startsWith(`${i + 1}.`))
      const nuevaPregunta = lineaEncontrada
        ? lineaEncontrada.replace(/^\d+\.\s*/, '').trim()
        : p.pregunta
      return { ...p, pregunta: nuevaPregunta }
    })
    setTareaGenerada(preguntasEditadas)
    if (tareaGuardada) {
      actualizarTarea(tareaGuardada.id, { preguntas: preguntasEditadas })
    }
    setEditando(false)
  }

  const METODO_DESC = {
    Feynman: 'Las preguntas pedirán explicar el concepto con palabras propias.',
    'Memorización activa': 'Preguntas de rappel directo: definiciones, fechas y hechos.',
    'Resolución de problemas': 'Situaciones prácticas con contexto real y pasos intermedios.',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Generar tarea" volver="/profesor" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Nueva tarea con IA</h1>
        <p className="text-sm text-gray-500 mb-8">Configura los parámetros y la IA generará las preguntas automáticamente.</p>

        {!tareaGenerada ? (
          <div className="space-y-6">
            {/* Nombre */}
            <div className="card p-6">
              <label className="label-base">Nombre de la tarea</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej. Operaciones con fracciones — Unidad 3"
                className="input-base"
              />
            </div>

            <div className="card p-6 space-y-5">
              {/* Materia */}
              <div>
                <label className="label-base">Materia</label>
                <select
                  value={form.materia}
                  onChange={(e) => setForm((p) => ({ ...p, materia: e.target.value }))}
                  className="input-base"
                >
                  {MATERIAS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Dificultad */}
              <div>
                <label className="label-base">Dificultad</label>
                <div className="flex gap-3">
                  {DIFICULTADES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, dificultad: d }))}
                      className={`flex-1 py-2 px-4 rounded-xl border text-sm font-medium transition-all ${
                        form.dificultad === d
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Metodología */}
            <div className="card p-6">
              <label className="label-base">Metodología de aprendizaje</label>
              <div className="space-y-2">
                {METODOLOGIAS.map((met) => (
                  <label
                    key={met}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      form.metodologia === met
                        ? 'border-amarillo bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodologia"
                      value={met}
                      checked={form.metodologia === met}
                      onChange={() => setForm((p) => ({ ...p, metodologia: met }))}
                      className="accent-yellow-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{met}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{METODO_DESC[met]}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipos de ejercicio */}
            <div className="card p-6">
              <label className="label-base">Tipo(s) de ejercicio</label>
              <p className="text-xs text-gray-400 mb-3">Selecciona uno o más. "Ejercicio mixto" combina todos los tipos.</p>
              <div className="flex flex-wrap gap-2">
                {TIPOS_EJERCICIO.map((tipo) => {
                  const seleccionado = form.tipos.includes(tipo)
                  return (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => toggleTipo(tipo)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        seleccionado
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {tipo}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Número de preguntas */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="label-base mb-0">Número de preguntas</label>
                <span className="text-2xl font-bold text-gray-900">{form.numeroPreguntas}</span>
              </div>
              <input
                type="range"
                min={3}
                max={10}
                value={form.numeroPreguntas}
                onChange={(e) => setForm((p) => ({ ...p, numeroPreguntas: Number(e.target.value) }))}
                className="w-full accent-yellow-400 h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3</span>
                <span>10</span>
              </div>
            </div>

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            <Boton
              onClick={handleGenerar}
              variante="primario"
              size="lg"
              disabled={cargando}
              className="w-full"
            >
              {cargando ? (
                <>
                  <Spinner size="sm" />
                  Generando tarea con IA...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  GENERAR TAREA
                </>
              )}
            </Boton>
          </div>
        ) : (
          /* Vista previa del devoir généré */
          <div className="animate-fade-in space-y-6">
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{form.nombre}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {form.materia} · {form.dificultad} · {tareaGenerada.length} preguntas
                  </p>
                </div>
                <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Generada por IA
                </span>
              </div>
            </div>

            {editando ? (
              <div className="card p-6">
                <label className="label-base">Editar preguntas</label>
                <p className="text-xs text-gray-400 mb-3">Modifica el texto de las preguntas. Los tipos y respuestas se conservan.</p>
                <textarea
                  value={textoEdicion}
                  onChange={(e) => setTextoEdicion(e.target.value)}
                  rows={tareaGenerada.length * 3}
                  className="input-base font-mono text-xs resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <Boton variante="primario" onClick={handleGuardarEdicion} size="sm">
                    Guardar cambios
                  </Boton>
                  <Boton variante="secundario" onClick={() => setEditando(false)} size="sm">
                    Cancelar
                  </Boton>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {tareaGenerada.map((p, i) => (
                  <div key={i} className="card p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1">
                          {etiquetaTipo(p.tipo)}
                        </span>
                        <p className="text-sm text-gray-800">{p.pregunta}</p>
                        {p.opciones && (
                          <ul className="mt-2 space-y-1">
                            {p.opciones.map((op, j) => (
                              <li key={j} className={`text-xs px-2 py-1 rounded ${op.startsWith(p.respuesta) ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-500'}`}>
                                {op}
                              </li>
                            ))}
                          </ul>
                        )}
                        {p.tipo === 'verdadero_falso' && (
                          <span className="mt-2 inline-block text-xs font-medium text-gray-500">
                            Respuesta: <strong>{p.respuesta ? 'Verdadero' : 'Falso'}</strong>
                          </span>
                        )}
                        {p.tipo === 'espacios' && p.respuesta && (
                          <span className="mt-2 inline-block text-xs font-medium text-gray-500">
                            Respuesta: <strong>{p.respuesta}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            <div className="flex flex-col sm:flex-row gap-3">
              <Boton variante="primario" size="lg" onClick={handlePublicar} className="flex-1">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                Publicar tarea
              </Boton>
              {!editando && (
                <Boton variante="secundario" size="lg" onClick={handleIniciarEdicion}>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Modificar
                </Boton>
              )}
              <Boton variante="fantasma" size="lg" onClick={() => { setTareaGenerada(null); setTareaGuardada(null) }}>
                Regenerar
              </Boton>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function etiquetaTipo(tipo) {
  const mapa = {
    opcion_multiple: 'Opción múltiple',
    verdadero_falso: 'Verdadero / Falso',
    abierta: 'Pregunta abierta',
    espacios: 'Completar espacios',
    calculo: 'Cálculo',
  }
  return mapa[tipo] ?? tipo
}
