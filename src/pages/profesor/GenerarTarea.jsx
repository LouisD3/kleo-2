import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar.jsx'
import Boton from '../../components/ui/Boton.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import MensajeError from '../../components/ui/MensajeError.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { useAnthropicAPI } from '../../hooks/useAnthropicAPI.js'
import useTareaStore from '../../store/useTareaStore.js'
import useAuthStore from '../../store/useAuthStore.js'
import { getPDAsByMateria } from '../../mock/pdas/index.js'

const MATERIAS = ['Lenguajes', 'Matemáticas', 'Biología', 'Física', 'Química', 'Geografía', 'Historia de México', 'Historia Mundial', 'Formación Cívica y Ética']
const GRADOS = ['1° Secundaria', '2° Secundaria', '3° Secundaria']
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
  const { profesor, clases } = useAuthStore()

  const [form, setForm] = useState({
    nombre: '',
    materia: 'Matemáticas',
    grado: clases?.[0]?.grado ?? '1° Secundaria',
    dificultad: 'Media',
    metodologia: 'Feynman',
    tipos: ['Opción múltiple'],
    numeroPreguntas: 5,
    pdas: [],
    fecha_limite: '',
  })

  const [tareaGenerada, setTareaGenerada] = useState(null)
  const [tareaGuardada, setTareaGuardada] = useState(null)
  const [editando, setEditando] = useState(false)
  const [textoEdicion, setTextoEdicion] = useState('')
  const [modalPDAabierto, setModalPDAabierto] = useState(false)
  const [busquedaPDA, setBusquedaPDA] = useState('')
  const [clasesPublicar, setClasesPublicar] = useState(clases?.length ? [clases[0].id] : [])
  const [publicando, setPublicando] = useState(false)

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
      pda: form.pdas.length > 0 ? form.pdas : null,
    })

    if (resultado?.preguntas) {
      const nueva = await agregarTarea({
        profesor_id: profesor.id,
        clase_id: clases[0]?.id,
        nombre: form.nombre,
        materia: form.materia,
        dificultad: form.dificultad,
        metodologia: form.metodologia,
        tipos: form.tipos,
        preguntas: resultado.preguntas,
        fecha_limite: form.fecha_limite || null,
        pda: form.pdas.length > 0 ? form.pdas : null,
      })
      setTareaGenerada(resultado.preguntas)
      setTareaGuardada(nueva)
    }
  }

  function toggleClasePublicar(claseId) {
    setClasesPublicar(prev =>
      prev.includes(claseId)
        ? prev.filter(id => id !== claseId)
        : [...prev, claseId]
    )
  }

  async function handlePublicar() {
    if (!tareaGuardada || clasesPublicar.length === 0) return
    setPublicando(true)

    const [primera, ...resto] = clasesPublicar

    // Update existing task to first selected class and publish
    if (tareaGuardada.clase_id !== primera) {
      await actualizarTarea(tareaGuardada.id, { clase_id: primera })
    }
    await publicarTarea(tareaGuardada.id)

    // Create copies for additional classes
    for (const claseId of resto) {
      const copia = await agregarTarea({
        profesor_id: profesor.id,
        clase_id: claseId,
        nombre: tareaGuardada.nombre,
        materia: tareaGuardada.materia,
        dificultad: tareaGuardada.dificultad,
        metodologia: tareaGuardada.metodologia,
        tipos: tareaGuardada.tipos,
        preguntas: tareaGuardada.preguntas,
        fecha_limite: tareaGuardada.fecha_limite || null,
        pda: tareaGuardada.pda || null,
      })
      if (copia) await publicarTarea(copia.id)
    }

    setPublicando(false)
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

  async function handleGuardarEdicion() {
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
      await actualizarTarea(tareaGuardada.id, { preguntas: preguntasEditadas })
    }
    setEditando(false)
  }

  const METODO_DESC = {
    Feynman: 'Las preguntas pedirán explicar el concepto con palabras propias.',
    'Memorización activa': 'Preguntas de rappel directo: definiciones, fechas y hechos.',
    'Resolución de problemas': 'Situaciones prácticas con contexto real y pasos intermedios.',
  }

  const pdasDeMateria = useMemo(
    () => getPDAsByMateria(form.materia, form.grado),
    [form.materia, form.grado]
  )

  const pdasFiltrados = useMemo(() => {
    const q = busquedaPDA.toLowerCase()
    if (!q) return pdasDeMateria
    return pdasDeMateria.filter(
      (p) => p.titulo.toLowerCase().includes(q) || p.pda.toLowerCase().includes(q)
    )
  }, [busquedaPDA, pdasDeMateria])

  const pdasPorTema = useMemo(() => {
    const grupos = {}
    for (const p of pdasFiltrados) {
      if (!grupos[p.tema]) grupos[p.tema] = []
      grupos[p.tema].push(p)
    }
    return grupos
  }, [pdasFiltrados])

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
              {/* Materia + Grado */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Materia</label>
                  <select
                    value={form.materia}
                    onChange={(e) => setForm((p) => ({ ...p, materia: e.target.value, pdas: [] }))}
                    className="input-base"
                  >
                    {MATERIAS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-base">Grado</label>
                  <select
                    value={form.grado}
                    onChange={(e) => setForm((p) => ({ ...p, grado: e.target.value, pdas: [] }))}
                    className="input-base"
                  >
                    {GRADOS.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
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

            {/* Fecha límite */}
            <div className="card p-6">
              <label className="label-base">Fecha límite <span className="text-gray-400 font-normal">(opcional)</span></label>
              <input
                type="datetime-local"
                value={form.fecha_limite}
                onChange={(e) => setForm((p) => ({ ...p, fecha_limite: e.target.value }))}
                className="input-base"
              />
            </div>

            {/* PDA */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-1">
                <label className="label-base mb-0">PDA <span className="text-gray-400 font-normal">(opcional)</span></label>
              </div>
              <p className="text-xs text-gray-400 mb-3">Alinea las preguntas al programa NEM — {form.materia} {form.grado}.</p>
              {form.pdas.length > 0 && (
                <div className="space-y-2 mb-3">
                  {form.pdas.map((pda, idx) => (
                    <div key={pda.secuencia} className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-yellow-700 mb-0.5">Secuencia {pda.secuencia} · {pda.titulo}</p>
                        {pda.contenido && <p className="text-xs text-gray-500 mb-0.5">{pda.contenido}</p>}
                        <p className="text-sm text-gray-700 leading-snug">{pda.pda}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, pdas: p.pdas.filter((_, i) => i !== idx) }))}
                        className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Quitar PDA"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {pdasDeMateria.length > 0 ? (
                form.pdas.length >= 5 ? (
                  <p className="text-xs text-gray-400 italic text-center py-2">
                    Máximo de 5 PDAs alcanzado.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setBusquedaPDA(''); setModalPDAabierto(true) }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    {form.pdas.length > 0 ? `Agregar PDA (${form.pdas.length}/5)` : 'Seleccionar de la biblioteca'}
                  </button>
                )
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  No hay PDAs disponibles para {form.materia} {form.grado} aún.
                </p>
              )}
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
                max={20}
                value={form.numeroPreguntas}
                onChange={(e) => setForm((p) => ({ ...p, numeroPreguntas: Number(e.target.value) }))}
                className="w-full accent-yellow-400 h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3</span>
                <span>20</span>
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
          /* Vista previa */
          <div className="animate-fade-in space-y-6">
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{form.nombre}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {form.materia} · {form.dificultad} · {tareaGenerada.length} preguntas
                    {form.fecha_limite && ` · Fecha límite: ${new Date(form.fecha_limite).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
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
                        {(p.tipo === 'abierta' || p.tipo === 'calculo') && p.respuesta && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs font-semibold text-green-700 mb-1">Respuesta modelo</p>
                            <p className="text-xs text-green-900 whitespace-pre-line">{p.respuesta}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selector de clases para publicar */}
            {clases.length > 0 && (
              <div className="card p-6">
                <label className="label-base">
                  Enviar a {clasesPublicar.length > 1 ? `${clasesPublicar.length} clases` : 'la clase'}
                </label>
                {clases.length > 1 && (
                  <p className="text-xs text-gray-400 mb-3">Puedes seleccionar varias clases a la vez.</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {clases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setClasesPublicar(
                        clasesPublicar.length === clases.length ? [] : clases.map(c => c.id)
                      )}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        clasesPublicar.length === clases.length
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Todas
                    </button>
                  )}
                  {clases.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => clases.length === 1 ? null : toggleClasePublicar(c.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        clasesPublicar.includes(c.id)
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {c.nombre}
                      <span className="text-xs opacity-60 ml-1">· {c.grado}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            <div className="flex flex-col sm:flex-row gap-3">
              <Boton variante="primario" size="lg" onClick={handlePublicar} disabled={clasesPublicar.length === 0 || publicando} className="flex-1">
                {publicando ? (
                  <>
                    <Spinner size="sm" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    {clasesPublicar.length > 1
                      ? `Publicar en ${clasesPublicar.length} clases`
                      : 'Publicar tarea'}
                  </>
                )}
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

      <Modal
        abierto={modalPDAabierto}
        onCerrar={() => setModalPDAabierto(false)}
        titulo={`Biblioteca de PDAs — ${form.materia} ${form.grado}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={busquedaPDA}
              onChange={(e) => setBusquedaPDA(e.target.value)}
              placeholder="Buscar por título o descripción..."
              className="input-base flex-1"
              autoFocus
            />
            {form.pdas.length > 0 && (
              <button
                type="button"
                onClick={() => setModalPDAabierto(false)}
                className="flex-shrink-0 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Listo ({form.pdas.length}/5)
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto space-y-5 pr-1">
            {Object.keys(pdasPorTema).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Sin resultados.</p>
            )}
            {Object.entries(pdasPorTema).map(([tema, lista]) => (
              <div key={tema}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{tema}</p>
                <div className="space-y-2">
                  {lista.map((p) => {
                    const seleccionado = form.pdas.some((s) => s.secuencia === p.secuencia)
                    const limiteAlcanzado = form.pdas.length >= 5 && !seleccionado
                    return (
                      <button
                        key={p.secuencia}
                        type="button"
                        disabled={limiteAlcanzado}
                        onClick={() => {
                          setForm((prev) => {
                            if (seleccionado) {
                              return { ...prev, pdas: prev.pdas.filter((s) => s.secuencia !== p.secuencia) }
                            }
                            return { ...prev, pdas: [...prev.pdas, p] }
                          })
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          seleccionado
                            ? 'border-yellow-400 bg-yellow-50'
                            : limiteAlcanzado
                              ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-yellow-400 hover:bg-yellow-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${
                            seleccionado ? 'bg-yellow-400 border-yellow-400' : 'border-gray-300'
                          }`}>
                            {seleccionado && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 mb-0.5">Secuencia {p.secuencia} · {p.titulo}</p>
                            {p.contenido && <p className="text-xs text-gray-400 mb-0.5">{p.contenido}</p>}
                            <p className="text-sm text-gray-700 leading-snug">{p.pda}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
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
