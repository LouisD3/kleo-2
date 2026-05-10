'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import VisorContenido from '@/components/profesor/VisorContenido.jsx'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useAnthropicAPI } from '@/hooks/useAnthropicAPI.js'
import { getPDAsByMateria } from '@/mock/pdas/index.js'
import useAuthStore from '@/store/useAuthStore.js'

const MATERIAS = [
  'Lenguajes',
  'Matemáticas',
  'Biología',
  'Física',
  'Química',
  'Geografía',
  'Historia de México',
  'Historia Mundial',
  'Formación Cívica y Ética',
  'Inglés',
]
const IDIOMAS = ['Español', 'English']
const GRADOS = ['1° Secundaria', '2° Secundaria', '3° Secundaria']
const DIFICULTADES = ['Fácil', 'Media', 'Difícil']
const DURACIONES_CLASE = ['30 minutos', '45 minutos', '50 minutos', '60 minutos', '90 minutos']

export default function GenerarPlan() {
  const router = useRouter()
  const { generarPlan, cargando, error, setError } = useAnthropicAPI()
  const { clases } = useAuthStore()

  const [form, setForm] = useState({
    materia: 'Matemáticas',
    grado: clases?.[0]?.grado ?? '1° Secundaria',
    dificultad: 'Media',
    duracion_clase: '50 minutos',
    numero_sesiones: 1,
    pdas: [],
    instrucciones: '',
    idioma: 'Español',
  })

  const [resultado, setResultado] = useState(null)
  const [modalPDAabierto, setModalPDAabierto] = useState(false)
  const [busquedaPDA, setBusquedaPDA] = useState('')

  async function handleGenerar() {
    const res = await generarPlan({
      materia: form.materia,
      grado: form.grado,
      dificultad: form.dificultad,
      duracion_clase: form.duracion_clase,
      numero_sesiones: form.numero_sesiones,
      pda: form.pdas.length > 0 ? form.pdas : undefined,
      instrucciones: form.instrucciones.trim() || null,
      idioma: form.idioma !== 'Español' ? form.idioma : undefined,
    })

    if (res?.secciones) {
      setResultado(res)
      window.scrollTo(0, 0)
    }
  }

  function handleCopiarTexto() {
    if (!resultado) return
    const texto = `# ${resultado.titulo}\n\n` +
      resultado.secciones.map((s) => `## ${s.titulo}\n\n${s.contenido}`).join('\n\n')
    navigator.clipboard.writeText(texto)
  }

  const pdasDeMateria = useMemo(
    () => getPDAsByMateria(form.materia, form.grado),
    [form.materia, form.grado],
  )

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
      <NavBar titulo={resultado ? 'Plan generado' : 'Generar plan de clase'} volver="/profesor/generar" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {!resultado ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Nuevo plan de clase</h1>
              <p className="text-sm text-gray-500">
                Genera una secuencia didactica completa con inicio, desarrollo y cierre.
              </p>
            </div>

            <div className="card p-6 space-y-5">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Duración por sesión</label>
                  <select
                    value={form.duracion_clase}
                    onChange={(e) => setForm((p) => ({ ...p, duracion_clase: e.target.value }))}
                    className="input-base"
                  >
                    {DURACIONES_CLASE.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-base">Número de sesiones</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={form.numero_sesiones}
                      onChange={(e) => setForm((p) => ({ ...p, numero_sesiones: Number(e.target.value) }))}
                      className="flex-1 accent-yellow-400 h-2 rounded-full"
                    />
                    <span className="text-lg font-bold text-gray-900 w-8 text-center">{form.numero_sesiones}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="label-base">Idioma</label>
                <div className="flex gap-3">
                  {IDIOMAS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, idioma: id }))}
                      className={`flex-1 py-2 px-4 rounded-xl border text-sm font-medium transition-all ${
                        form.idioma === id
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PDA */}
            <div className="card p-6">
              <label className="label-base">
                PDA <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Alinea el plan al programa NEM — {form.materia} {form.grado}.
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
                        <p className="text-sm text-gray-700 leading-snug">{pda.pda}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, pdas: p.pdas.filter((_, i) => i !== idx) }))}
                        className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {pdasDeMateria.length > 0 && form.pdas.length < 5 && (
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
              )}
            </div>

            {/* Instrucciones */}
            <div className="card p-6">
              <label className="label-base">
                Instrucciones específicas <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={form.instrucciones}
                onChange={(e) => setForm((p) => ({ ...p, instrucciones: e.target.value }))}
                placeholder="Ej. Incluir actividades de trabajo en equipo, usar material reciclado, enfocarse en evaluación formativa..."
                rows={3}
                className="input-base resize-none"
              />
            </div>

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            <Boton onClick={handleGenerar} variante="primario" size="lg" disabled={cargando} className="w-full">
              {cargando ? (
                <>
                  <Spinner size="sm" />
                  Generando plan de clase...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  GENERAR PLAN DE CLASE
                </>
              )}
            </Boton>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            <VisorContenido
              titulo={resultado.titulo}
              secciones={resultado.secciones}
              onSeccionChange={(nuevas) => setResultado({ ...resultado, secciones: nuevas })}
            />

            <div className="card p-6">
              <div className="flex flex-wrap gap-3">
                <Boton variante="secundario" size="md" onClick={() => router.push('/profesor/generar')}>
                  Volver al hub
                </Boton>
                <Boton
                  variante="secundario"
                  size="md"
                  onClick={() => { setResultado(null); window.scrollTo(0, 0) }}
                >
                  Regenerar
                </Boton>
                <Boton variante="secundario" size="md" onClick={handleCopiarTexto}>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                  </svg>
                  Copiar texto
                </Boton>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal PDA */}
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
                          <div className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${seleccionado ? 'bg-yellow-400 border-yellow-400' : 'border-gray-300'}`}>
                            {seleccionado && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 mb-0.5">Secuencia {p.secuencia} · {p.titulo}</p>
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
