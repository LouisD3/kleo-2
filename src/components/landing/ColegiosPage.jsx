'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ArrowRight } from 'lucide-react'

const HITOS = [
  { id: 1, label: 'Hito 1', dates: 'Junio – Agosto 2026', title: 'Postulación y selección', desc: 'Las postulaciones se reciben hasta el 30 de agosto de 2026. Kleo revisa cada una y selecciona a los 20 colegios fundadores con base en el perfil del colegio y el compromiso del equipo docente.' },
  { id: 2, label: 'Hito 2', dates: 'Agosto 2026', title: 'Capacitación del equipo docente', desc: 'Antes de iniciar el ciclo escolar, Kleo capacita al equipo docente del colegio en el uso de la plataforma y en los fundamentos del método singapurense.' },
  { id: 3, label: 'Hito 3', dates: 'Agosto 2026 – Julio 2027', title: 'Implementación durante el ciclo escolar', desc: 'Los alumnos de 1.°, 2.° y 3.° de secundaria usan Kleo durante todo el ciclo escolar 2026-2027. Kleo da soporte pedagógico continuo al equipo docente.' },
  { id: 4, label: 'Hito 4', dates: 'Junio – Julio 2027', title: 'Medición de resultados', desc: 'En alianza con una universidad mexicana de prestigio, Kleo mide el impacto del piloto: comprensión, dominio de aprendizajes y experiencia docente.' },
]

const INCLUYE = [
  'Acceso completo a Kleo Matemáticas para 1.°, 2.° y 3.° de secundaria.',
  'Capacitación inicial al equipo docente (formato a definir con cada colegio).',
  'Acceso gratuito a los recursos para docentes de futuras materias que Kleo vaya lanzando durante el ciclo.',
  'Soporte pedagógico durante todo el ciclo escolar.',
  'Reportes de aprendizaje para docentes y coordinación académica.',
  'Reconocimiento público como Colegio Fundador.',
  'Condiciones preferentes permanentes al término del piloto.',
]

const NO_INCLUYE = [
  'Otras materias distintas a matemáticas durante el ciclo (a menos que Kleo las lance durante el periodo, en cuyo caso se incluyen sin costo).',
  'Dispositivos o hardware (los alumnos usan los equipos del colegio o personales).',
  'Soporte técnico de infraestructura del colegio.',
]

const REQUISITOS = [
  'Colegio privado en México.',
  'Mínimo 100 estudiantes sumando 1.°, 2.° y 3.° de secundaria.',
  'Compromiso del equipo directivo de implementar Kleo durante el ciclo.',
  'Disposición del equipo docente para capacitarse y usar la plataforma.',
  'Autorización para que Kleo y su universidad aliada midan resultados durante el ciclo (con manejo confidencial y anonimizado de datos).',
]

const FAQ = [
  { q: '¿Realmente es gratis o hay letra chiquita?', a: 'Es gratis durante todo el ciclo escolar 2026-2027. Al término del piloto, los colegios fundadores tienen condiciones preferentes permanentes si deciden continuar, pero no hay obligación de continuar.' },
  { q: '¿Qué pasa si nuestros docentes no están familiarizados con el método singapurense?', a: 'La mayoría de los docentes mexicanos no lo está, y eso está perfectamente bien. Kleo incluye capacitación específica antes de iniciar el ciclo y soporte pedagógico durante todo el año.' },
  { q: '¿Cuántos colegios serán seleccionados?', a: 'Un máximo de 20 colegios fundadores. La selección considera el perfil del colegio, su tamaño, su ubicación geográfica (buscamos diversidad nacional) y el compromiso del equipo docente.' },
  { q: '¿Kleo reemplaza al maestro de matemáticas?', a: 'No. Kleo es una herramienta que el maestro usa con sus alumnos. La autoridad pedagógica del aula sigue siendo del docente. Kleo le devuelve tiempo y le da mejor diagnóstico de sus estudiantes.' },
  { q: '¿Quién mide los resultados del piloto?', a: 'Kleo está iniciando conversaciones con universidades mexicanas de prestigio para formalizar esta alianza. La medición se realizará con rigor académico y validez externa una vez establecido el acuerdo.' },
  { q: '¿Qué pasa con los datos de nuestros alumnos?', a: 'Toda la información se maneja de forma confidencial y anonimizada. Kleo cumple con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Hay NDA disponible bajo solicitud.' },
]

export default function ColegiosPage() {
  const [formData, setFormData] = useState({
    nombre: '', cargo: '', colegio: '', ciudad: '', estudiantes: '', correo: '', telefono: '', motivo: '', referencia: '',
  })
  const [formStatus, setFormStatus] = useState('idle')
  const [openFaq, setOpenFaq] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormStatus('submitting')
    setTimeout(() => setFormStatus('success'), 1200)
  }

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="bg-crema-100 text-tinta min-h-screen">
      {/* Nav */}
      <header className="border-b border-crema-300 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-tinta-400 hover:text-tinta transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver a Kleo
          </Link>
          <Link href="/" className="text-xl font-bold text-tinta tracking-tight">Kleo</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 sm:pt-20 pb-14">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full bg-amarillo/15 text-tinta border border-amarillo/30">
            Programa Fundador 2026
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-tinta mt-6 tracking-tight">
            Postula tu colegio al programa fundador de Kleo.
          </h1>
          <p className="text-lg sm:text-xl text-tinta-400 mt-6 leading-relaxed">
            20 colegios privados de México. Un ciclo escolar completo. Matemáticas de secundaria sin costo.
          </p>
          <div className="mt-10">
            <a href="#postular" className="inline-flex items-center justify-center gap-2 bg-tinta text-amarillo font-semibold px-6 py-4 rounded-full hover:bg-tinta-600 transition-colors">
              Ir al formulario de postulación
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-tinta mb-14 tracking-tight">
            Así funciona el programa fundador.
          </h2>
          <div className="space-y-0">
            {HITOS.map((hito, i) => (
              <div key={hito.id} className={`grid sm:grid-cols-[180px_1fr] gap-4 sm:gap-10 pb-10 ${i < HITOS.length - 1 ? 'border-b border-crema-300 mb-10' : ''}`}>
                <div>
                  <div className="text-xs font-semibold text-amarillo-hover tracking-wider uppercase">{hito.label}</div>
                  <div className="text-sm text-tinta-400 mt-1">{hito.dates}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-tinta mb-3">{hito.title}</h3>
                  <p className="text-base text-tinta-400 leading-relaxed">{hito.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué incluye / qué no */}
      <section className="px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-tinta mb-12 tracking-tight">
            Qué incluye y qué no.
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm">
              <h3 className="text-xl font-bold text-tinta mb-5 pb-3 border-b-2 border-amarillo/40">
                Qué incluye
              </h3>
              <ul className="space-y-3.5 text-base text-tinta-400">
                {INCLUYE.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-amarillo font-semibold flex-shrink-0">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm">
              <h3 className="text-xl font-bold text-tinta mb-5 pb-3 border-b border-crema-300">
                Qué no incluye
              </h3>
              <ul className="space-y-3.5 text-base text-tinta-400">
                {NO_INCLUYE.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-crema-500 font-semibold flex-shrink-0">&minus;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="px-6 py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-tinta mb-10 tracking-tight">
            Lo que necesitamos de tu colegio para postular.
          </h2>
          <ul className="space-y-0">
            {REQUISITOS.map((req, i) => (
              <li key={i} className={`flex gap-4 py-5 ${i < REQUISITOS.length - 1 ? 'border-b border-crema-300' : ''}`}>
                <span className="text-amarillo text-lg font-semibold flex-shrink-0 mt-0.5">&#10003;</span>
                <span className="text-base text-tinta-400">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Formulario */}
      <section id="postular" className="px-6 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-tinta tracking-tight">
            Postula tu colegio.
          </h2>
          <p className="text-sm text-tinta-400 mt-3">Respuesta del equipo en 48 horas hábiles.</p>

          {formStatus === 'success' ? (
            <div className="mt-10 bg-white rounded-3xl shadow-sm p-10 text-center">
              <div className="text-2xl font-bold text-tinta">Gracias por postular.</div>
              <p className="mt-3 text-tinta-400">Hemos recibido la postulación. El equipo de Kleo te contactará en menos de 48 horas hábiles.</p>
              <button
                type="button"
                onClick={() => { setFormStatus('idle'); setFormData({ nombre: '', cargo: '', colegio: '', ciudad: '', estudiantes: '', correo: '', telefono: '', motivo: '', referencia: '' }) }}
                className="mt-6 inline-flex items-center gap-2 bg-white hover:bg-crema-50 text-tinta border border-crema-300 font-medium px-5 py-2.5 rounded-full hover:border-tinta-400 transition-colors"
              >
                Enviar otra postulación
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">Nombre completo</span>
                <input required value={formData.nombre} onChange={(e) => update('nombre', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all" placeholder="Tu nombre" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">Cargo</span>
                <select required value={formData.cargo} onChange={(e) => update('cargo', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all">
                  <option value="">Selecciona...</option>
                  <option>Director</option>
                  <option>Coordinador académico</option>
                  <option>Dueño</option>
                  <option>Otro</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">Nombre del colegio</span>
                <input required value={formData.colegio} onChange={(e) => update('colegio', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all" placeholder="Ej. Colegio Cervantes" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">Ciudad y estado</span>
                <input required value={formData.ciudad} onChange={(e) => update('ciudad', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all" placeholder="Ej. Mérida, Yucatán" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">Número de estudiantes en secundaria (1.° + 2.° + 3.°)</span>
                <input required type="number" min="0" value={formData.estudiantes} onChange={(e) => update('estudiantes', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all" placeholder="Ej. 240" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">Correo institucional</span>
                <input required type="email" value={formData.correo} onChange={(e) => update('correo', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all" placeholder="director@tucolegio.mx" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">Teléfono <span className="text-tinta-400 font-normal">(opcional)</span></span>
                <input type="tel" value={formData.telefono} onChange={(e) => update('telefono', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all" placeholder="+52 ..." />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">¿Por qué quieres que tu colegio sea fundador de Kleo?</span>
                <textarea required rows={4} value={formData.motivo} onChange={(e) => update('motivo', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all resize-none" placeholder="Cuéntanos brevemente..." />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-tinta mb-1.5 block">¿Cómo nos conociste? <span className="text-tinta-400 font-normal">(opcional)</span></span>
                <input value={formData.referencia} onChange={(e) => update('referencia', e.target.value)} className="w-full rounded-xl border border-crema-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta transition-all" placeholder="LinkedIn, un colega, prensa..." />
              </label>

              <div className="pt-2">
                <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-tinta text-amarillo font-semibold py-4 rounded-full hover:bg-tinta-600 transition-colors disabled:opacity-50">
                  {formStatus === 'submitting' ? 'Enviando...' : 'Postular mi colegio ahora'}
                </button>
              </div>

              <p className="text-xs text-tinta-400 text-center pt-2">
                Toda la información es confidencial. NDA disponible bajo solicitud.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-tinta mb-10 tracking-tight">
            Preguntas frecuentes.
          </h2>
          <div className="space-y-0">
            {FAQ.map((item, i) => (
              <div key={i} className="border-t border-crema-300 last:border-b">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-5 text-left focus:outline-none"
                >
                  <span className="text-lg font-semibold text-tinta leading-snug">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-tinta-400 flex-shrink-0 mt-1 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="text-base text-tinta-400 leading-relaxed pb-6 pr-12">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tinta text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">Kleo</Link>
            <a href="mailto:hola@kleo.mx" className="text-sm text-crema-500 hover:text-white transition-colors">hola@kleo.mx</a>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-crema-500">
            <Link href="/investigacion" className="hover:text-white transition-colors">Soy investigador o académico &rarr;</Link>
            <Link href="/legal/privacidad" className="hover:text-white transition-colors">Aviso de privacidad</Link>
            <span className="text-crema-500/60">&copy; 2026 Kleo Educación</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
