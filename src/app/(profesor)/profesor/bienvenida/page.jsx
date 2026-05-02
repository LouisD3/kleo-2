'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import GoogleClassroomIcon from '@/components/ui/GoogleClassroomIcon.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import {
  useGCConnect,
  useGCCourses,
  useGCImportClass,
  useGCStatus,
} from '@/hooks/useGoogleClassroom.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

const GRADOS = ['1° Secundaria', '2° Secundaria', '3° Secundaria']

export default function Bienvenida() {
  const router = useRouter()
  const { profesor, usuario, clase, setClase, agregarClaseLocal } = useAuthStore()
  const [paso, setPaso] = useState(1)
  const [formClase, setFormClase] = useState({ nombre: '', grado: '1° Secundaria' })
  const [claseCreada, setClaseCreada] = useState(null)
  const [nombresAlumnos, setNombresAlumnos] = useState('')
  const [agregando, setAgregando] = useState(false)
  const [alumnosAgregados, setAlumnosAgregados] = useState(0)
  const [error, setError] = useState(null)
  const [setupTab, setSetupTab] = useState('manual')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [gradoImport, setGradoImport] = useState('1° Secundaria')

  // Google Classroom hooks
  const isGoogleUser = usuario?.app_metadata?.provider === 'google'
  const { data: gcStatus } = useGCStatus(profesor?.id)
  const connectMut = useGCConnect()
  const importClassMut = useGCImportClass()
  const gcConnected = gcStatus?.connected ?? false
  const { data: gcCourses = [], isLoading: coursesLoading } = useGCCourses(
    setupTab === 'classroom' && gcConnected,
  )

  async function handleCrearClase(e) {
    e.preventDefault()
    if (!formClase.nombre.trim()) {
      setError('Escribe un nombre para tu clase.')
      return
    }
    setError(null)

    // If a default class "Mi clase" exists, update it instead of creating a new one
    if (clase && clase.nombre === 'Mi clase') {
      const { data, error: err } = await supabase
        .from('clases')
        .update({ nombre: formClase.nombre, grado: formClase.grado })
        .eq('id', clase.id)
        .select()
        .single()

      if (err) {
        setError(err.message)
        return
      }
      setClase(data)
      setClaseCreada(data)
    } else {
      const { data, error: err } = await supabase
        .from('clases')
        .insert({
          profesor_id: profesor.id,
          nombre: formClase.nombre,
          grado: formClase.grado,
        })
        .select()
        .single()

      if (err) {
        setError(err.message)
        return
      }
      setClase(data)
      agregarClaseLocal(data)
      setClaseCreada(data)
    }

    setPaso(2)
  }

  async function handleAgregarAlumnos() {
    const nombres = nombresAlumnos
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    if (nombres.length === 0) {
      router.push('/profesor')
      return
    }

    setAgregando(true)
    setError(null)
    const targetClase = claseCreada || clase

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const colores = [
      'bg-pink-100 text-pink-700',
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-green-100 text-green-700',
      'bg-orange-100 text-orange-700',
      'bg-teal-100 text-teal-700',
      'bg-red-100 text-red-700',
      'bg-indigo-100 text-indigo-700',
    ]

    const alumnos = nombres.map((nombre) => {
      const iniciales = nombre
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
      const color = colores[Math.floor(Math.random() * colores.length)]
      let codigo = ''
      for (let i = 0; i < 6; i++) {
        codigo += chars[Math.floor(Math.random() * chars.length)]
      }
      return {
        clase_id: targetClase.id,
        nombre,
        codigo_acceso: codigo,
        avatar_iniciales: iniciales,
        avatar_color: color,
      }
    })

    const { error: err } = await supabase.from('alumnos').insert(alumnos)

    if (err) {
      setError('Hubo un error al agregar los alumnos. Intenta de nuevo.')
      setAgregando(false)
      return
    }

    setAlumnosAgregados(alumnos.length)
    setAgregando(false)
    setPaso(3)
  }

  function irAlDashboard() {
    router.push('/profesor')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-5 flex items-center">
        <span className="text-2xl font-bold text-gray-900">Kleo</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md animate-fade-in">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1.5 rounded-full transition-all ${
                  n === paso ? 'w-8 bg-amarillo' : n < paso ? 'w-8 bg-gray-900' : 'w-8 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Class setup */}
          {paso === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Configura tu primera clase
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                Tus alumnos se conectarán a esta clase para hacer sus tareas.
              </p>

              {/* Tabs for Google users */}
              {isGoogleUser && (
                <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSetupTab('manual')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      setupTab === 'manual'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Crear manualmente
                  </button>
                  <button
                    type="button"
                    onClick={() => setSetupTab('classroom')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      setupTab === 'classroom'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Importar de Classroom
                    <GoogleClassroomIcon size={16} />
                  </button>
                </div>
              )}

              {setupTab === 'manual' ? (
                <form onSubmit={handleCrearClase} className="space-y-4">
                  <div>
                    <label className="label-base">Nombre de la clase</label>
                    <input
                      type="text"
                      value={formClase.nombre}
                      onChange={(e) => setFormClase((p) => ({ ...p, nombre: e.target.value }))}
                      placeholder="Ej. 3°A Vespertino"
                      className="input-base"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="label-base">Grado</label>
                    <select
                      value={formClase.grado}
                      onChange={(e) => setFormClase((p) => ({ ...p, grado: e.target.value }))}
                      className="input-base"
                    >
                      {GRADOS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <MensajeError mensaje={error} onCerrar={() => setError(null)} />

                  <Boton
                    type="submit"
                    variante="primario"
                    size="lg"
                    disabled={!formClase.nombre.trim()}
                    className="w-full"
                  >
                    Siguiente
                  </Boton>
                </form>
              ) : !gcConnected ? (
                <div className="space-y-4 text-center py-4">
                  <GoogleClassroomIcon size={48} />
                  <p className="text-sm text-gray-600">
                    Conecta Google Classroom para importar tu clase y tus alumnos en un clic.
                  </p>
                  <Boton
                    variante="primario"
                    size="lg"
                    className="w-full"
                    onClick={() => connectMut.mutate()}
                    disabled={connectMut.isPending}
                  >
                    {connectMut.isPending ? 'Conectando...' : 'Conectar Google Classroom'}
                  </Boton>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Selecciona un curso. Tu clase y tus alumnos se importarán automáticamente.
                  </p>

                  {coursesLoading ? (
                    <div className="py-8 text-center text-sm text-gray-400">Cargando cursos...</div>
                  ) : gcCourses.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-400">
                      No se encontraron cursos activos.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {gcCourses.map((course) => (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => setSelectedCourse(course.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                            selectedCourse === course.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900 text-sm">{course.name}</p>
                          {course.section && (
                            <p className="text-xs text-gray-500 mt-0.5">{course.section}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="label-base">Grado</label>
                    <select
                      value={gradoImport}
                      onChange={(e) => setGradoImport(e.target.value)}
                      className="input-base"
                    >
                      {GRADOS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <MensajeError mensaje={error} onCerrar={() => setError(null)} />

                  <Boton
                    variante="primario"
                    size="lg"
                    className="w-full"
                    disabled={!selectedCourse || importClassMut.isPending}
                    onClick={async () => {
                      setError(null)
                      try {
                        const result = await importClassMut.mutateAsync({
                          courseId: selectedCourse,
                          grado: gradoImport,
                        })
                        setClase(result.clase)
                        agregarClaseLocal(result.clase)
                        setClaseCreada(result.clase)
                        setAlumnosAgregados(result.studentsImported)
                        setPaso(3)
                      } catch (err) {
                        setError(err.message || 'Error al importar')
                      }
                    }}
                  >
                    {importClassMut.isPending ? 'Importando...' : 'Importar clase'}
                  </Boton>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Add students */}
          {paso === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Agrega a tus alumnos
              </h1>
              <p className="text-sm text-gray-500 text-center mb-8">
                Escribe un nombre por línea. Cada alumno recibirá un código único para acceder a
                Kleo.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="label-base">Nombres de alumnos</label>
                  <textarea
                    value={nombresAlumnos}
                    onChange={(e) => setNombresAlumnos(e.target.value)}
                    placeholder={'María García López\nCarlos Hernández Ruiz\nAna Martínez Flores'}
                    className="input-base min-h-[200px] resize-y"
                    autoFocus
                  />
                  {nombresAlumnos.trim() && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      {nombresAlumnos.split('\n').filter((n) => n.trim()).length} alumno
                      {nombresAlumnos.split('\n').filter((n) => n.trim()).length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <MensajeError mensaje={error} onCerrar={() => setError(null)} />

                <Boton
                  variante="primario"
                  size="lg"
                  onClick={handleAgregarAlumnos}
                  disabled={agregando}
                  className="w-full"
                >
                  {agregando ? 'Agregando...' : 'Agregar alumnos'}
                </Boton>

                <button
                  onClick={irAlDashboard}
                  className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
                >
                  Omitir por ahora
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Done */}
          {paso === 3 && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Todo listo!</h1>
              <p className="text-sm text-gray-500 mb-2">
                Clase <strong>{claseCreada?.nombre}</strong> creada con {alumnosAgregados} alumno
                {alumnosAgregados !== 1 ? 's' : ''}.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Puedes ver los códigos de acceso de tus alumnos en la sección de clase.
              </p>

              <Boton variante="primario" size="lg" onClick={irAlDashboard} className="w-full">
                Ir al panel
              </Boton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
