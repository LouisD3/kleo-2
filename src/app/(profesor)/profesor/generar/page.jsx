'use client'

import { pdf } from '@react-pdf/renderer'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import TareaPDF from '@/components/profesor/TareaPDF.jsx'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import Toast from '@/components/ui/Toast.jsx'
import { useAnthropicAPI } from '@/hooks/useAnthropicAPI.js'
import {
  useActualizarTarea,
  useAgregarTarea,
  usePublicarTarea,
  useTareasProfesor,
} from '@/hooks/useTareas.js'
import { getPDAsByMateria } from '@/mock/pdas/index.js'
import useAuthStore from '@/store/useAuthStore.js'

const DIFICULTADES = ['Facil', 'Media', 'Dificil']
const TIPOS_EJERCICIO = [
  'Preguntas abiertas',
  'Opcion multiple',
  'Verdadero/Falso',
  'Completar espacios en blanco',
  'Calculo/Resolucion de problemas',
  'Ejercicio mixto',
]

export default function GenerarTarea() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tareaIdParam = searchParams.get('tarea')
  const { generarTarea, cargando, error, setError } = useAnthropicAPI()
  const agregarTarea = useAgregarTarea()
  const actualizarTarea = useActualizarTarea()
  const publicarTarea = usePublicarTarea()
  const { profesor, clases } = useAuthStore()
  const { data: tareasData } = useTareasProfesor(profesor?.id)

  const [form, setForm] = useState({
    nombre: '',
    dificultad: 'Media',
    tipos: [],
    numeroPreguntas: 5,
    pdas: [],
    fecha_limite: '',
    instrucciones: '',
  })

  const [tareaGenerada, setTareaGenerada] = useState(null)
  const [tareaGuardada, setTareaGuardada] = useState(null)
  const [clasesPublicar, setClasesPublicar] = useState(clases?.length ? [clases[0].id] : [])
  const [publicando, setPublicando] = useState(false)
  const [descargandoPDF, setDescargandoPDF] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [modalPDAabierto, setModalPDAabierto] = useState(false)
  const [busquedaPDA, setBusquedaPDA] = useState('')
  const inicializado = useRef(false)

  // Load existing draft when ?tarea=<id> is present
  useEffect(() => {
    if (!tareaIdParam || inicializado.current || !tareasData?.tareas) return
    const tarea = tareasData.tareas.find((t) => t.id === tareaIdParam)
    if (!tarea || tarea.estado !== 'borrador') return
    inicializado.current = true
    setTareaGenerada(tarea.contenido_cpa)
    setTareaGuardada(tarea)
    setForm((prev) => ({
      ...prev,
      nombre: tarea.nombre,
      dificultad: tarea.dificultad,
      tipos: prev.tipos,
      numeroPreguntas: tarea.contenido_cpa?.length ?? prev.numeroPreguntas,
      fecha_limite: tarea.fecha_limite ?? '',
      pdas: tarea.pda ?? [],
    }))
    setClasesPublicar([tarea.clase_id])
  }, [tareaIdParam, tareasData])

  function toggleTipo(tipo) {
    setForm((prev) => {
      const esEjercicioMixto = tipo === 'Ejercicio mixto'
      if (esEjercicioMixto) {
        return { ...prev, tipos: ['Ejercicio mixto'] }
      }
      const tiposSinMixto = prev.tipos.filter((t) => t !== 'Ejercicio mixto')
      if (tiposSinMixto.includes(tipo)) {
        return { ...prev, tipos: tiposSinMixto.filter((t) => t !== tipo) }
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
    if (!clases.length) {
      setError('Primero debes crear una clase. Ve a "Mis clases" para configurarla.')
      return
    }

    const resultado = await generarTarea({
      dificultad: form.dificultad,
      tipos: form.tipos,
      numeroPreguntas: form.numeroPreguntas,
      pda: form.pdas.length > 0 ? form.pdas : null,
      instrucciones: form.instrucciones.trim() || null,
    })

    if (resultado?.preguntas) {
      const nueva = await agregarTarea.mutateAsync({
        profesor_id: profesor.id,
        clase_id: clases[0]?.id,
        nombre: form.nombre,
        dificultad: form.dificultad,
        contenido_cpa: resultado.preguntas,
        fecha_limite: form.fecha_limite || null,
        pda: form.pdas.length > 0 ? form.pdas : null,
        secuencia_ref: null,
      })
      setTareaGenerada(resultado.preguntas)
      setTareaGuardada(nueva)
      setToastVisible(true)
      window.scrollTo(0, 0)
    }
  }

  function toggleClasePublicar(claseId) {
    setClasesPublicar((prev) =>
      prev.includes(claseId) ? prev.filter((id) => id !== claseId) : [...prev, claseId],
    )
  }

  async function handlePublicar() {
    if (!tareaGuardada || clasesPublicar.length === 0) return
    setPublicando(true)

    const [primera, ...resto] = clasesPublicar

    if (tareaGuardada.clase_id !== primera) {
      await actualizarTarea.mutateAsync({ id: tareaGuardada.id, cambios: { clase_id: primera } })
    }
    await publicarTarea.mutateAsync(tareaGuardada.id)

    for (const claseId of resto) {
      const copia = await agregarTarea.mutateAsync({
        profesor_id: profesor.id,
        clase_id: claseId,
        nombre: tareaGuardada.nombre,
        dificultad: tareaGuardada.dificultad,
        contenido_cpa: tareaGuardada.contenido_cpa,
        fecha_limite: tareaGuardada.fecha_limite || null,
        pda: tareaGuardada.pda || null,
        secuencia_ref: tareaGuardada.secuencia_ref ?? null,
      })
      if (copia) {
        await publicarTarea.mutateAsync(copia.id)
      }
    }

    setPublicando(false)
    router.push('/profesor')
  }

  // Auto-save preguntas when they change
  const prevPreguntasRef = useRef(null)
  useEffect(() => {
    if (!tareaGuardada || !tareaGenerada) return
    if (prevPreguntasRef.current === null) {
      prevPreguntasRef.current = tareaGenerada
      return
    }
    if (prevPreguntasRef.current === tareaGenerada) return
    prevPreguntasRef.current = tareaGenerada

    const timer = setTimeout(async () => {
      await actualizarTarea.mutateAsync({
        id: tareaGuardada.id,
        cambios: { contenido_cpa: tareaGenerada },
      })
      setToastVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [tareaGenerada, tareaGuardada, actualizarTarea])

  async function handleDescargarPDF(conRespuestas) {
    if (!tareaGenerada) return
    const key = conRespuestas ? 'corrige' : 'examen'
    setDescargandoPDF(key)
    try {
      const tareaPDF = {
        nombre: form.nombre || 'Tarea',
        materia: 'Matematicas',
        dificultad: form.dificultad,
        contenido_cpa: tareaGenerada,
        created_at: tareaGuardada?.created_at ?? new Date().toISOString(),
      }
      const claseNombre = clases?.length > 0 ? `${clases[0].nombre} · ${clases[0].grado}` : ''
      const blob = await pdf(
        <TareaPDF tarea={tareaPDF} claseNombre={claseNombre} showAnswers={conRespuestas} />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const suffix = conRespuestas ? 'respuestas' : 'examen'
      a.download = `${(form.nombre || 'Tarea').replace(/[^a-zA-Z0-9\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00c1\u00c9\u00cd\u00d3\u00da\u00d1 ]/g, '')}_${suffix}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDescargandoPDF(null)
    }
  }

  const pdasDeMateria = useMemo(() => getPDAsByMateria('Matematicas', '1° Secundaria'), [])

  const pdasFiltrados = useMemo(() => {
    const q = busquedaPDA.toLowerCase()
    if (!q) return pdasDeMateria
    return pdasDeMateria.filter(
      (p) => p.titulo.toLowerCase().includes(q) || p.pda.toLowerCase().includes(q),
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
      <NavBar titulo={tareaGenerada ? 'Revisar borrador' : 'Generar tarea'} volver="/profesor" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {!tareaGenerada ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Nueva tarea personalizada</h1>
              <p className="text-sm text-gray-500">
                Genera una tarea de Matematicas con IA. Para tareas Singapur de referencia, usa la
                Biblioteca.
              </p>
            </div>

            {/* Nombre */}
            <div className="card p-6">
              <label className="label-base">Nombre de la tarea</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej. Repaso fracciones — Unidad 3"
                className="input-base"
              />
            </div>

            {/* Dificultad */}
            <div className="card p-6">
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

            {/* Fecha limite */}
            <div className="card p-6">
              <label className="label-base">
                Fecha limite <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
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
                <label className="label-base mb-0">
                  PDA <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Alinea las preguntas al programa NEM — Matematicas 1° Secundaria.
              </p>
              {form.pdas.length > 0 && (
                <div className="space-y-2 mb-3">
                  {form.pdas.map((pda, idx) => (
                    <div
                      key={pda.secuencia}
                      className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 flex items-start gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-yellow-700 mb-0.5">
                          Secuencia {pda.secuencia} · {pda.titulo}
                        </p>
                        {pda.contenido && (
                          <p className="text-xs text-gray-500 mb-0.5">{pda.contenido}</p>
                        )}
                        <p className="text-sm text-gray-700 leading-snug">{pda.pda}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({ ...p, pdas: p.pdas.filter((_, i) => i !== idx) }))
                        }
                        className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Quitar PDA"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {form.pdas.length >= 5 ? (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  Maximo de 5 PDAs alcanzado.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setBusquedaPDA('')
                    setModalPDAabierto(true)
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  {form.pdas.length > 0
                    ? `Agregar PDA (${form.pdas.length}/5)`
                    : 'Seleccionar de la biblioteca'}
                </button>
              )}
            </div>

            {/* Instrucciones */}
            <div className="card p-6">
              <label className="label-base">
                Instrucciones especificas{' '}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Indica el tema, concepto o punto especifico que quieres trabajar.
              </p>
              <textarea
                value={form.instrucciones}
                onChange={(e) => setForm((p) => ({ ...p, instrucciones: e.target.value }))}
                placeholder="Ej. Enfocarse en fracciones equivalentes, solo usar ejemplos con numeros positivos"
                rows={2}
                className="input-base resize-none"
              />
            </div>

            {/* Tipos de ejercicio */}
            <div className="card p-6">
              <label className="label-base">Tipo(s) de ejercicio</label>
              <p className="text-xs text-gray-400 mb-3">
                Selecciona uno o mas. "Ejercicio mixto" combina todos los tipos.
              </p>
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

            {/* Numero de preguntas */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="label-base mb-0">Numero de preguntas</label>
                <span className="text-2xl font-bold text-gray-900">{form.numeroPreguntas}</span>
              </div>
              <input
                type="range"
                min={3}
                max={20}
                value={form.numeroPreguntas}
                onChange={(e) =>
                  setForm((p) => ({ ...p, numeroPreguntas: Number(e.target.value) }))
                }
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
                'GENERAR TAREA'
              )}
            </Boton>
          </div>
        ) : (
          /* Vista previa — Revisar borrador */
          <div className="animate-fade-in space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">Revisar borrador</h1>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-full">
                  Borrador
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {form.nombre} · Matematicas 1° Sec · {form.dificultad} · {tareaGenerada.length} preguntas
                {form.fecha_limite &&
                  ` · Limite: ${new Date(form.fecha_limite).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
              </p>
            </div>

            {/* Questions preview */}
            <div className="card p-0 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {tareaGenerada.map((p, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                          {p.tipo}
                        </span>
                        <p className="text-sm text-gray-800 mt-1">{p.pregunta}</p>
                        {p.opciones && (
                          <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {p.opciones.map((op, j) => (
                              <li
                                key={j}
                                className="text-xs px-2.5 py-1.5 rounded-lg text-gray-500 bg-gray-50"
                              >
                                {op}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            {/* Actions */}
            <div className="card p-6 space-y-4">
              {clases.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Publicar tarea</h3>
                    <p className="text-xs text-gray-400 mb-4">
                      Una vez publicada, la tarea sera visible para los alumnos de las clases
                      seleccionadas.
                    </p>
                    {clases.length > 1 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() =>
                            setClasesPublicar(
                              clasesPublicar.length === clases.length
                                ? []
                                : clases.map((c) => c.id),
                            )
                          }
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                            clasesPublicar.length === clases.length
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          Todas
                        </button>
                        {clases.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => toggleClasePublicar(c.id)}
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
                    )}
                    <Boton
                      variante="primario"
                      size="lg"
                      onClick={handlePublicar}
                      disabled={clasesPublicar.length === 0 || publicando}
                      className="w-full"
                    >
                      {publicando ? (
                        <>
                          <Spinner size="sm" />
                          Publicando...
                        </>
                      ) : clasesPublicar.length > 1 ? (
                        `Publicar en ${clasesPublicar.length} clases`
                      ) : (
                        'Publicar tarea'
                      )}
                    </Boton>
                  </div>
                  <div className="border-t border-gray-100" />
                </>
              )}
              <div className="flex flex-wrap gap-3">
                <Boton variante="secundario" size="md" onClick={() => router.push('/profesor')}>
                  Guardar y volver
                </Boton>
                <Boton
                  variante="secundario"
                  size="md"
                  onClick={() => {
                    setTareaGenerada(null)
                    setTareaGuardada(null)
                    window.scrollTo(0, 0)
                  }}
                >
                  Regenerar todo
                </Boton>
                <Boton
                  variante="secundario"
                  size="md"
                  disabled={descargandoPDF === 'examen'}
                  onClick={() => handleDescargarPDF(false)}
                >
                  {descargandoPDF === 'examen' ? 'Generando...' : 'Examen PDF'}
                </Boton>
                <Boton
                  variante="secundario"
                  size="md"
                  disabled={descargandoPDF === 'corrige'}
                  onClick={() => handleDescargarPDF(true)}
                >
                  {descargandoPDF === 'corrige' ? 'Generando...' : 'Respuestas PDF'}
                </Boton>
              </div>
            </div>
          </div>
        )}
      </main>

      <Toast
        mensaje="Borrador guardado automaticamente"
        visible={toastVisible}
        onCerrar={() => setToastVisible(false)}
      />

      <Modal
        abierto={modalPDAabierto}
        onCerrar={() => setModalPDAabierto(false)}
        titulo="Biblioteca de PDAs — Matematicas 1° Secundaria"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={busquedaPDA}
              onChange={(e) => setBusquedaPDA(e.target.value)}
              placeholder="Buscar por titulo o descripcion..."
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
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {tema}
                </p>
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
                              return {
                                ...prev,
                                pdas: prev.pdas.filter((s) => s.secuencia !== p.secuencia),
                              }
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
                          <div
                            className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${
                              seleccionado ? 'bg-yellow-400 border-yellow-400' : 'border-gray-300'
                            }`}
                          >
                            {seleccionado && (
                              <svg
                                className="w-3 h-3 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 mb-0.5">
                              Secuencia {p.secuencia} · {p.titulo}
                            </p>
                            {p.contenido && (
                              <p className="text-xs text-gray-400 mb-0.5">{p.contenido}</p>
                            )}
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
