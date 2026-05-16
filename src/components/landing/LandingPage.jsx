'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X } from 'lucide-react'

/* ═══════════════════════════════════════════
   CountUp — animated number on scroll
   ═══════════════════════════════════════════ */
function CountUp({ target, suffix = '' }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          const t0 = performance.now()
          const dur = 1400
          ;(function tick(now) {
            const p = Math.min((now - t0) / dur, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(eased * target))
            if (p < 1) requestAnimationFrame(tick)
          })(t0)
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {value}
      <span>{suffix}</span>
    </span>
  )
}

/* ═══════════════════════════════════════════
   NAV LINKS
   ═══════════════════════════════════════════ */
const NAV_LINKS = [
  { label: 'Método', href: '#metodo' },
  { label: 'Para Colegios', href: '#directores' },
  { label: 'Para Padres', href: '#colegios' },
  { label: 'Investigación', href: '#respaldo' },
]

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [audienceTab, setAudienceTab] = useState('est')
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoForm, setDemoForm] = useState({
    nombre: '',
    cargo: '',
    colegio: '',
    correo: '',
    mensaje: '',
  })
  const [demoStatus, setDemoStatus] = useState('idle')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id)
        }
      },
      { rootMargin: '-40% 0px -60% 0px' },
    )
    for (const s of sections) obs.observe(s)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            obs.unobserve(e.target)
          }
        }
      },
      { threshold: 0.08 },
    )
    for (const el of document.querySelectorAll('.reveal-item')) obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = demoOpen || menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [demoOpen, menuOpen])

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') setDemoOpen(false)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const openDemo = () => {
    setDemoOpen(true)
    setDemoStatus('idle')
    setDemoForm({ nombre: '', cargo: '', colegio: '', correo: '', mensaje: '' })
  }

  const handleDemoSubmit = (e) => {
    e.preventDefault()
    setDemoStatus('submitting')
    setTimeout(() => setDemoStatus('success'), 1200)
  }

  const navLinkCls = (href) =>
    `transition-colors hover:text-tinta ${
      activeSection === href.replace('#', '') ? 'text-tinta font-medium' : ''
    }`

  return (
    <div className="bg-crema-100 text-tinta min-h-screen">
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-tinta">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amarillo" />
            <span className="hidden sm:inline text-white/80">
              Convocatoria 2026 abierta para colegios fundadores
            </span>
            <span className="sm:hidden text-white/80">Convocatoria 2026 abierta</span>
          </div>
          <a
            href="#consejo"
            className="hidden md:inline text-white/60 hover:text-white transition-colors"
          >
            Conoce al consejo asesor pedagógico →
          </a>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${scrolled ? 'nav-scrolled' : 'bg-crema-100'}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold text-tinta">
            Kleo
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-sm text-tinta-400">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={href} href={href} className={navLinkCls(href)}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openDemo}
              className="hidden sm:inline-flex items-center gap-2 bg-tinta text-amarillo text-sm font-medium px-5 py-2.5 rounded-full hover:bg-tinta-600 transition-colors"
            >
              Hablar con el equipo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-crema-300 bg-white">
            <div className="px-6 py-6 flex flex-col gap-5 text-base">
              {NAV_LINKS.map(({ label, href }) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  openDemo()
                }}
                className="mt-2 self-start bg-tinta text-amarillo text-sm font-medium px-5 py-2.5 rounded-full"
              >
                Hablar con el equipo →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════
         HERO
         ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8 text-xs font-medium uppercase tracking-widest text-tinta-400">
              <span className="inline-block w-8 h-px bg-crema-500" />
              <span>Una plataforma de matemáticas para secundaria</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-tinta">
              La diferencia entre{' '}
              <em className="not-italic text-amarillo">aprobar</em> y{' '}
              <em className="not-italic text-amarillo">comprender</em> define el futuro
              intelectual de un adolescente.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-tinta-400">
              Kleo entrega íntegro el currículo de la{' '}
              <span className="text-tinta font-medium">Nueva Escuela Mexicana</span>{' '}
              siguiendo el método singapurense —concreto, pictórico, abstracto— con un tutor
              socrático de IA que nunca da la respuesta, sólo formula la siguiente pregunta.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#metodo"
                className="inline-flex items-center gap-2 bg-tinta text-amarillo font-medium px-6 py-3 rounded-full hover:bg-tinta-600 transition-colors"
              >
                Conocer el método
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={openDemo}
                className="inline-flex items-center gap-2 bg-white hover:bg-crema-50 text-tinta border border-crema-300 font-medium px-6 py-3 rounded-full hover:border-tinta-400 transition-colors"
              >
                Solicitar demo para mi colegio
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-tinta-400">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-tinta rounded-full" />
                NEM · Aprendizajes esperados SEP
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amarillo rounded-full" />
                Singapore Math Curriculum
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-tinta-400 rounded-full" />
                Tutor socrático de IA
              </span>
            </div>
          </div>

          {/* Platform mockup */}
          <div className="lg:col-span-5 reveal-item">
            <div className="relative">
              <div className="absolute -top-3 left-6 z-10">
                <span className="bg-crema-200 border border-crema-300 text-[10px] font-mono px-2 py-1 text-tinta-400 rounded-lg">
                  kleo.mx / tutor
                </span>
              </div>
              <div className="bg-white border border-crema-300 rounded-3xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-crema-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-crema-400" />
                    <span className="w-2 h-2 rounded-full bg-crema-400" />
                    <span className="w-2 h-2 rounded-full bg-crema-400" />
                  </div>
                  <div className="font-mono text-[10px] text-tinta-400">
                    Sec. 1 · Unidad 4 · Proporcionalidad directa
                  </div>
                  <div className="font-mono text-[10px] text-tinta-400">⌁ activo</div>
                </div>

                <div className="px-5 py-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-tinta-400 mb-2">
                    Pregunta 3 de 7 · variación problemática
                  </div>
                  <p className="text-base font-semibold leading-snug text-tinta">
                    Si <em>4</em> obreros construyen un muro en <em>9</em> días, ¿en cuánto
                    tiempo lo construirían <em>6</em> obreros trabajando al mismo ritmo?
                  </p>

                  <div className="mt-4 border border-crema-200 rounded-2xl p-3 bg-crema-50">
                    <div className="flex items-center justify-between mb-2 text-[10px] font-mono text-tinta-400">
                      <span>Modelo pictórico — barra</span>
                      <span>4 obreros · 9 días</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-3.5 flex-1 bg-tinta rounded-sm" />
                        ))}
                        {[5, 6].map((i) => (
                          <div
                            key={i}
                            className="h-3.5 flex-1 bg-crema-200 border border-crema-300 rounded-sm"
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-tinta-400">
                        <span>1 obrero</span>
                        <span>6 obreros</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-l-2 border-amarillo pl-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-tinta-400 mb-1">
                      Tutor · siguiente pregunta
                    </div>
                    <p className="text-sm leading-relaxed text-tinta">
                      Antes de calcular: si añadimos obreros, ¿el tiempo debe aumentar o
                      disminuir? Explica con tus palabras por qué.
                      <span className="caret" />
                    </p>
                  </div>

                  <div className="mt-4 border border-crema-300 rounded-xl px-3 py-2.5 text-sm text-crema-500">
                    Escribe tu razonamiento…
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-mono text-tinta-400 mb-1">
                        <span>Dominio del aprendizaje</span>
                        <span>68%</span>
                      </div>
                      <div className="h-1.5 bg-crema-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amarillo rounded-full"
                          style={{ width: '68%' }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-tinta-400 whitespace-nowrap">
                      bloqueado hasta ≥ 85%
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-3 font-mono text-[11px] text-tinta-400 leading-relaxed">
                Fig. 1 — Tutor socrático explicando proporcionalidad directa. El estudiante
                avanza al alcanzar dominio, no al completar tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §01 · EVIDENCIA
         ══════════════════════════════════════════════════ */}
      <section id="investigacion" className="bg-crema-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">
                § 01 · Evidencia
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-tinta">
                México no tiene un problema de currículo. Tiene un problema de{' '}
                <em className="not-italic">pedagogía</em>.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-base leading-relaxed text-tinta-400">
                La evidencia internacional es consistente: cambiar lo que se enseña importa menos
                que cambiar cómo se enseña. Las brechas que hoy observa PISA en los estudiantes
                mexicanos no se cierran con un nuevo plan de estudios; se cierran con un método
                riguroso, sostenido y centrado en la comprensión profunda.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'Dato 01',
                target: 53,
                suffix: '%',
                text: (
                  <>
                    de los estudiantes mexicanos de 15 años{' '}
                    <strong>no alcanza el nivel mínimo</strong> de competencia matemática.
                  </>
                ),
                source: 'Fuente — OCDE, PISA 2022. Resultados México.',
              },
              {
                label: 'Dato 02',
                target: 20,
                suffix: '+ años',
                text: (
                  <>
                    Singapur en el <strong>#1 mundial</strong> en matemáticas. Su método, no su
                    currículo, explica la diferencia.
                  </>
                ),
                source: 'Fuente — TIMSS & PISA, rondas comparativas 1995–2023.',
              },
              {
                label: 'Dato 03',
                target: 2,
                suffix: 'σ',
                text: (
                  <>
                    de desviación estándar separan al estudiante con{' '}
                    <strong>tutoría individual</strong> del aula tradicional.
                  </>
                ),
                source: (
                  <>
                    Fuente — Bloom, B. (1984). <em>The 2 Sigma Problem.</em>
                  </>
                ),
              },
            ].map((stat) => (
              <article key={stat.label} className="reveal-item bg-white rounded-3xl shadow-sm p-8">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">
                    {stat.label}
                  </span>
                  <span className="h-px flex-1 bg-crema-300" />
                </div>
                <div className="text-6xl lg:text-7xl font-extrabold leading-none text-tinta">
                  <CountUp target={stat.target} suffix={stat.suffix} />
                </div>
                <p className="mt-5 text-base leading-relaxed text-tinta max-w-xs">{stat.text}</p>
                <p className="mt-4 font-mono text-[11px] text-tinta-400">{stat.source}</p>
              </article>
            ))}
          </div>

          {/* Quote */}
          <figure className="mt-20 bg-white rounded-3xl shadow-sm p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-2 text-xs font-medium uppercase tracking-widest text-tinta-400">
              Cita
            </div>
            <blockquote className="lg:col-span-10">
              <p className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-tinta">
                &ldquo;El propósito de la educación no es memorizar respuestas. Es desarrollar la
                capacidad de hacer mejores preguntas.&rdquo;
              </p>
              <figcaption className="mt-6 font-mono text-xs text-tinta-400 uppercase tracking-widest">
                Jerome S. Bruner · Sobre los procesos de la educación, 1960
              </figcaption>
            </blockquote>
          </figure>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §02 · EL MÉTODO
         ══════════════════════════════════════════════════ */}
      <section id="metodo" className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
            <div className="lg:col-span-7">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">
                § 02 · El método
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-tinta">
                Tres principios pedagógicos.{' '}
                <em className="not-italic">Cero atajos.</em>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed text-tinta-400">
                Kleo no inventa una pedagogía nueva. Toma tres tradiciones investigadas durante
                décadas y las opera con consistencia inflexible, lección tras lección.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pilar 1 — Singapore Math */}
            <article className="reveal-item bg-crema-100 p-8 lg:p-10 rounded-3xl">
              <div className="flex items-baseline justify-between mb-8">
                <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">
                  Pilar 01 — Singapore Math
                </span>
                <span className="text-xl font-bold text-tinta-400">i</span>
              </div>

              <div className="flex items-stretch gap-3 mb-8 h-20">
                <div className="flex-1 flex flex-col items-center justify-center text-center px-2 bg-white rounded-2xl">
                  <div className="flex gap-0.5">
                    <span className="w-2 h-2 rounded-full bg-tinta-400" />
                    <span className="w-2 h-2 rounded-full bg-tinta-400" />
                    <span className="w-2 h-2 rounded-full bg-tinta-400" />
                  </div>
                  <div className="font-mono text-[9px] mt-2 uppercase tracking-widest text-tinta-400">
                    Concreto
                  </div>
                </div>
                <div className="self-center font-mono text-tinta-400">→</div>
                <div className="flex-1 flex flex-col items-center justify-center text-center px-2 bg-white rounded-2xl">
                  <div className="flex gap-0.5 items-end">
                    <span className="w-1.5 h-3 bg-tinta inline-block rounded-sm" />
                    <span className="w-1.5 h-4 bg-tinta inline-block rounded-sm" />
                    <span className="w-1.5 h-2.5 bg-tinta inline-block rounded-sm" />
                  </div>
                  <div className="font-mono text-[9px] mt-1.5 uppercase tracking-widest text-tinta-400">
                    Pictórico
                  </div>
                </div>
                <div className="self-center font-mono text-tinta-400">→</div>
                <div className="flex-1 flex flex-col items-center justify-center text-center px-2 bg-white rounded-2xl">
                  <div className="italic text-lg text-tinta font-semibold">y = kx</div>
                  <div className="font-mono text-[9px] mt-1 uppercase tracking-widest text-tinta-400">
                    Abstracto
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold leading-tight text-tinta">
                Concreto, pictórico, abstracto.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-tinta-400">
                Toda idea matemática se introduce primero con objetos, luego se traduce a un
                modelo visual (la &ldquo;barra de Singapur&rdquo;) y sólo después se formaliza en
                símbolos.
              </p>
              <p className="mt-6 font-mono text-[11px] text-tinta-400 uppercase tracking-widest border-t border-crema-300 pt-4">
                Base — Jerome Bruner · teoría de la representación.
              </p>
            </article>

            {/* Pilar 2 — Mastery Learning */}
            <article className="reveal-item bg-crema-100 p-8 lg:p-10 rounded-3xl">
              <div className="flex items-baseline justify-between mb-8">
                <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">
                  Pilar 02 — Mastery Learning
                </span>
                <span className="text-xl font-bold text-tinta-400">ii</span>
              </div>

              <div className="mb-8 h-20 flex items-end gap-2.5">
                <div className="w-7 bg-crema-200 border border-crema-300 rounded-sm" style={{ height: '30%' }} />
                <div className="w-7 bg-crema-200 border border-crema-300 rounded-sm" style={{ height: '50%' }} />
                <div className="w-7 bg-crema-200 border border-crema-300 rounded-sm" style={{ height: '65%' }} />
                <div className="w-7 bg-tinta rounded-sm" style={{ height: '85%' }} />
                <div className="flex-1" />
                <div className="font-mono text-[10px] uppercase tracking-widest text-tinta-400 self-center leading-tight text-right">
                  umbral
                  <br />
                  de avance
                  <br />≥ 85%
                </div>
              </div>

              <h3 className="text-2xl font-bold leading-tight text-tinta">
                Dominio antes del avance.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-tinta-400">
                El estudiante no progresa por calendario. Progresa cuando demuestra dominio
                sostenido del aprendizaje anterior. El currículo se respeta; el ritmo, no.
              </p>
              <p className="mt-6 font-mono text-[11px] text-tinta-400 uppercase tracking-widest border-t border-crema-300 pt-4">
                Base — Benjamin Bloom · mastery learning, 1968.
              </p>
            </article>

            {/* Pilar 3 — Tutor socrático */}
            <article className="reveal-item bg-crema-100 p-8 lg:p-10 rounded-3xl">
              <div className="flex items-baseline justify-between mb-8">
                <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">
                  Pilar 03 — Tutor socrático
                </span>
                <span className="text-xl font-bold text-tinta-400">iii</span>
              </div>

              <div className="mb-8 h-20 relative flex flex-col justify-center gap-2">
                <div className="bg-white border border-crema-300 rounded-2xl px-3 py-1.5 text-sm font-medium text-tinta self-start">
                  ¿Por qué?
                </div>
                <div className="bg-white border border-crema-300 rounded-2xl px-3 py-1.5 text-sm text-tinta-400 self-start ml-4">
                  Explícalo con tus palabras.
                </div>
              </div>

              <h3 className="text-2xl font-bold leading-tight text-tinta">
                Nunca la respuesta.{' '}
                <em className="not-italic">Siempre la siguiente pregunta.</em>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-tinta-400">
                La IA de Kleo formula preguntas, no entrega soluciones. El estudiante demuestra
                comprensión explicando con sus propias palabras (técnica Feynman).
              </p>
              <p className="mt-6 font-mono text-[11px] text-tinta-400 uppercase tracking-widest border-t border-crema-300 pt-4">
                Base — Feynman · Bjork · efecto 2σ, Bloom.
              </p>
            </article>
          </div>

          {/* Bjork quote */}
          <div className="mt-14 border-l-2 border-amarillo pl-6 max-w-3xl">
            <p className="text-xl italic leading-relaxed text-tinta">
              &ldquo;La dificultad deseable —el esfuerzo cognitivo del estudiante por recuperar y
              reconstruir— es el predictor más confiable del aprendizaje duradero.&rdquo;
            </p>
            <p className="mt-3 font-mono text-[11px] text-tinta-400 uppercase tracking-widest">
              Robert A. Bjork · UCLA, Memory Lab
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §03 · MANIFIESTO
         ══════════════════════════════════════════════════ */}
      <section id="manifiesto" className="bg-crema-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
            <div className="lg:col-span-7">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">
                § 03 · Manifiesto
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-tinta">
                Lo que Kleo <em className="not-italic">no es</em>.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed text-tinta-400">
                La claridad sobre lo que Kleo rechaza es la mejor manera de entender lo que Kleo
                entrega. Esta declaración es una sola página, y es vinculante.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Kleo no es un banco de ejercicios.',
                desc: 'Es',
                emphasis: 'producción de comprensión',
                rest: '. El estudiante explica con sus palabras antes de avanzar.',
              },
              {
                title: 'Kleo no es un repositorio de videos.',
                desc: 'El estudiante',
                emphasis: 'explica, no consume',
                rest: '. La pantalla devuelve preguntas, no clases pasivas.',
              },
              {
                title: 'Kleo no es un asistente que responde dudas.',
                desc: 'El tutor',
                emphasis: 'formula la siguiente pregunta',
                rest: '. La respuesta llega del estudiante o no llega.',
              },
              {
                title: 'Kleo no es entretenimiento educativo.',
                desc: 'Optimiza',
                emphasis: 'aprendizaje, no engagement',
                rest: '. Sin avatares, sin rachas, sin estrellas en la home.',
              },
              {
                title: 'Kleo no es un sustituto del docente.',
                desc: 'Es una herramienta que',
                emphasis: 'amplifica al maestro',
                rest: '. La autoridad pedagógica del aula permanece intacta.',
              },
              {
                title: 'Kleo no es un experimento contra la NEM.',
                desc: 'Respeta íntegramente el',
                emphasis: 'currículo nacional',
                rest: '. Cambia el método, no la materia.',
              },
            ].map((item) => (
              <article key={item.title} className="reveal-item bg-white p-7 lg:p-8 rounded-3xl shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="text-2xl text-crema-500 leading-none mt-0.5 font-bold">✕</span>
                  <div>
                    <p className="text-lg font-bold leading-snug text-tinta">{item.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-tinta-400">
                      {item.desc}{' '}
                      <span className="text-tinta font-medium">{item.emphasis}</span>
                      {item.rest}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-8 font-mono text-[11px] text-tinta-400 max-w-2xl">
            Declaración pública — vinculante para el equipo, el producto y los aliados de Kleo.
            Cualquier desviación es motivo de corrección y comunicación abierta.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §04 · COMPARATIVA
         ══════════════════════════════════════════════════ */}
      <section id="comparativa" className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-7">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">
                § 04 · Comparativa
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-tinta">
                La diferencia entre{' '}
                <em className="not-italic">enseñar para aprobar</em> y enseñar
                para comprender.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed text-tinta-400">
                Seis decisiones pedagógicas que distinguen la operación cotidiana de Kleo de la de
                un aula tradicional.
              </p>
            </div>
          </div>

          <div className="bg-crema-100 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-2 px-6 lg:px-8 py-4 border-b border-crema-300">
              <div className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">
                Educación tradicional
              </div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-tinta flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amarillo rounded-full" />
                Kleo
              </div>
            </div>

            <ul className="divide-y divide-crema-300">
              {[
                ['Evalúa reconocimiento', 'Evalúa comprensión'],
                ['Avanza por calendario', 'Avanza por dominio'],
                ['Castiga el error', 'Usa el error como diagnóstico'],
                ['Memorización de procedimientos', 'Construcción de modelos mentales'],
                ['60% aprueba', 'Iteración hasta el dominio real'],
                ['IA que da respuestas', 'IA que formula preguntas'],
              ].map(([old, neo]) => (
                <li key={old} className="grid grid-cols-2 px-6 lg:px-8 py-5 gap-8 items-baseline">
                  <span className="text-sm text-tinta-400 line-through decoration-crema-500">
                    {old}
                  </span>
                  <span className="text-base font-semibold text-tinta">{neo}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 font-mono text-[11px] text-tinta-400">
            Tabla II — Operaciones pedagógicas que Kleo reescribe respecto al aula tradicional.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §05 · COMPATIBILIDAD NEM
         ══════════════════════════════════════════════════ */}
      <section id="nem" className="bg-crema-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">
                § 05 · Compatibilidad
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-tinta">
                Kleo no sustituye el currículo nacional. Sustituye el{' '}
                <em className="not-italic">método de entrega</em>.
              </h2>
              <p className="mt-7 text-base leading-relaxed text-tinta-400">
                Cada lección de Kleo cubre los aprendizajes esperados de la SEP en su{' '}
                <strong className="text-tinta">secuencia oficial</strong>. El plan y programa
                de la Nueva Escuela Mexicana permanece intacto. Lo que cambia es la forma de
                entregarlo: el orden interno de la comprensión (concreto → pictórico → abstracto),
                el umbral de avance (dominio) y el rol de la pregunta (socrático).
              </p>
              <div className="mt-8 grid grid-cols-2 gap-5">
                <div className="border-t-2 border-crema-500 pt-4">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">
                    Conservado
                  </div>
                  <div className="text-xl font-bold mt-1 text-tinta">Currículo NEM</div>
                  <p className="mt-1 text-sm text-tinta-400 leading-snug">
                    Aprendizajes esperados, ejes y secuencia SEP.
                  </p>
                </div>
                <div className="border-t-2 border-amarillo pt-4">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">
                    Reemplazado
                  </div>
                  <div className="text-xl font-bold mt-1 text-tinta">Método de entrega</div>
                  <p className="mt-1 text-sm text-tinta-400 leading-snug">
                    Singapore Math + dominio + IA socrática.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 reveal-item">
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-crema-200 flex items-baseline justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">
                    Tabla I — Mapeo NEM × Singapore Math
                  </span>
                  <span className="font-mono text-[11px] text-tinta-400">1.º Sec.</span>
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[11px] font-mono uppercase tracking-widest text-tinta-400 border-b border-crema-200">
                      <th className="px-6 py-3 font-medium">Aprendizaje SEP</th>
                      <th className="px-6 py-3 font-medium hidden sm:table-cell">Fase Singapur</th>
                      <th className="px-6 py-3 font-medium text-right">Dominio req.</th>
                    </tr>
                  </thead>
                  <tbody className="text-tinta divide-y divide-crema-100">
                    {[
                      ['Números enteros y operaciones', 'C → P → A', '85%'],
                      ['Fracciones y decimales', 'Modelo de barra', '85%'],
                      ['Proporcionalidad directa e inversa', 'Variación problemática', '90%'],
                      ['Ecuaciones lineales de primer grado', 'Abstracción guiada', '85%'],
                      ['Perímetro, área y volumen', 'Concreto manipulable', '80%'],
                      ['Probabilidad y tratamiento de datos', 'Pictórico → abstracto', '80%'],
                    ].map(([aprendizaje, fase, dominio]) => (
                      <tr key={aprendizaje}>
                        <td className="px-6 py-3.5">{aprendizaje}</td>
                        <td className="px-6 py-3.5 text-tinta-400 hidden sm:table-cell">{fase}</td>
                        <td className="px-6 py-3.5 text-right font-mono text-sm">{dominio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-3 border-t border-crema-200 flex items-baseline justify-between text-[11px] font-mono text-tinta-400">
                  <span>Extracto. Secuencia completa: 1.º–3.º Sec.</span>
                  <span className="text-tinta-400 hover:underline cursor-pointer">
                    Descargar mapeo PDF ↓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §06 · COBERTURA CURRICULAR
         ══════════════════════════════════════════════════ */}
      <section id="cobertura" className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-7">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">
                § 06 · Cobertura curricular
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-tinta">
                Empezamos donde la evidencia es más sólida y donde México{' '}
                <em className="not-italic">más lo necesita</em>.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed text-tinta-400">
                Kleo inicia con matemáticas de secundaria: el momento donde la brecha PISA es más
                alarmante y donde el método singapurense cuenta con cuatro décadas de evidencia
                internacional.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
            {[
              { label: 'Asignatura actual', title: 'Matemáticas', sub: 'Secundaria · 1.º · 2.º · 3.º' },
              { label: 'Alineación', title: '100% NEM', sub: 'Aprendizajes esperados SEP, secuencia oficial.' },
              { label: 'Hoja de ruta', title: 'K-12 progresivo', sub: 'Expansión gradual, mismo estándar de rigor.' },
            ].map((c) => (
              <div key={c.label} className="bg-crema-100 p-7 rounded-3xl">
                <div className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">{c.label}</div>
                <div className="text-2xl font-bold mt-2 text-tinta">{c.title}</div>
                <div className="text-sm mt-1 text-tinta-400">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-crema-500 pt-10">
            <div className="flex items-baseline justify-between mb-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Lám. III — Mapa de cobertura K-12</div>
              <div className="font-mono text-[11px] text-tinta-400">2026 → 2030</div>
            </div>
            <div className="relative">
              <div className="absolute left-0 right-0 top-[18px] h-px bg-crema-500 hidden md:block" />
              <ol className="relative grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { year: '2026 · Hoy', title: 'Matemáticas', sub: 'Secundaria · 1.º–3.º', status: 'En operación', active: true },
                  { year: '2027', title: 'Matemáticas', sub: 'Primaria alta · 4.º–6.º', status: 'Planeación' },
                  { year: '2028', title: 'Comprensión lectora', sub: 'Secundaria', status: 'Investigación' },
                  { year: '2029', title: 'Ciencias naturales', sub: 'Secundaria', status: 'Investigación' },
                  { year: '2030+', title: 'K-12 progresivo', sub: 'Currículo completo', status: 'Visión' },
                ].map((item) => (
                  <li key={item.year}>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${item.active ? 'bg-tinta' : 'border border-crema-500 bg-white'}`} />
                      <span className={`font-mono text-[11px] uppercase tracking-widest ${item.active ? 'text-tinta font-medium' : 'text-tinta-400'}`}>{item.year}</span>
                    </div>
                    <div className={`mt-5 text-lg font-bold leading-tight ${item.active ? 'text-tinta' : 'text-tinta-400'}`}>{item.title}</div>
                    <div className="text-sm text-tinta-400">{item.sub}</div>
                    <div className={`mt-2 font-mono text-[10px] uppercase tracking-widest ${item.active ? 'text-tinta' : 'text-tinta-400'}`}>{item.status}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §07 · AUDIENCIAS (dark)
         ══════════════════════════════════════════════════ */}
      <section id="colegios" className="bg-tinta text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-7">
              <div className="text-xs font-medium uppercase tracking-widest text-amarillo mb-5">§ 07 · Audiencias</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                Una plataforma. Tres compromisos distintos.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed text-crema-500">
                La promesa pedagógica es la misma para todos. Lo que cambia es lo que Kleo entrega
                a quien acompaña al estudiante.
              </p>
            </div>
          </div>

          <div role="tablist" className="flex flex-wrap gap-x-8 gap-y-3 border-b border-white/20 mb-10 text-sm">
            {[
              { id: 'est', label: 'Estudiantes' },
              { id: 'pad', label: 'Padres y madres' },
              { id: 'col', label: 'Colegios' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={audienceTab === tab.id}
                onClick={() => setAudienceTab(tab.id)}
                className={`py-3 border-b-2 transition-colors ${
                  audienceTab === tab.id
                    ? 'border-amarillo text-white'
                    : 'border-transparent text-crema-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {[
            {
              id: 'est',
              title: 'Comprender, no memorizar.',
              desc: 'Kleo acompaña al estudiante con un tutor que adapta la dificultad, formula preguntas a su nivel y exige que explique cada paso antes de avanzar. La meta no es terminar la lección. Es comprenderla.',
              points: [
                'Ruta personalizada según dominio, no según calendario.',
                'Cada respuesta requiere una explicación en sus propias palabras.',
                'Repaso espaciado automático sobre temas vulnerables.',
              ],
            },
            {
              id: 'pad',
              title: 'Visibilidad sin ansiedad.',
              desc: 'Kleo entrega a cada familia un reporte semanal que prioriza el tipo de comprensión sobre la calificación. No publica rankings, no envía notificaciones invasivas, no convierte el aprendizaje en juego competitivo.',
              points: [
                'Reportes pedagógicos, no calificaciones aisladas.',
                'Diagnóstico mensual de aprendizajes vulnerables.',
                'Recomendaciones específicas, no genéricas.',
              ],
            },
            {
              id: 'col',
              title: 'Integración con la NEM, no contra ella.',
              desc: 'Kleo se integra al plan vigente del colegio. Cada grupo cuenta con tableros docentes en tiempo real, mapeo curricular descargable, e instrumentos de evaluación formativa alineados a los aprendizajes esperados de la SEP.',
              points: [
                'Tableros docentes con foco en aprendizajes vulnerables.',
                'Acompañamiento de formación docente en método singapurense.',
                'Modelo de implementación gradual por ciclo escolar.',
              ],
            },
          ]
            .filter((panel) => panel.id === audienceTab)
            .map((panel) => (
              <div key={panel.id} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7">
                  <h3 className="text-3xl font-bold leading-tight">{panel.title}</h3>
                  <p className="mt-5 text-base leading-relaxed text-crema-500 max-w-2xl">{panel.desc}</p>
                </div>
                <ul className="lg:col-span-5 space-y-5 text-sm text-crema-500">
                  {panel.points.map((text, i) => (
                    <li key={i} className="flex gap-4 border-t border-white/20 pt-5">
                      <span className="font-mono text-[11px] text-amarillo uppercase tracking-widest mt-0.5">0{i + 1}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §08 · RESULTADOS
         ══════════════════════════════════════════════════ */}
      <section id="resultados" className="bg-crema-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
            <div className="lg:col-span-7">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">§ 08 · Resultados</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-tinta">
                Resultados que importan a <em className="not-italic">tu colegio</em>.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base leading-relaxed text-tinta-400">
                Kleo no promete porcentajes inventados. Promete tres compromisos verificables que
                cualquier coordinación académica puede observar dentro del primer ciclo escolar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: '01', roman: 'i', title: 'Diferenciación de marca en un mercado saturado.', desc: 'Kleo dota al colegio de una propuesta pedagógica defendible —con investigadores citables y currículo auditable— frente a competidores que ofrecen ejercicios o videos.', target: 'Para dirección general y mercadotecnia educativa.' },
              { num: '02', roman: 'ii', title: 'Tu maestro recupera tiempo para enseñar.', desc: 'El docente deja de preparar material, examen y reporte semanal: lo recibe alineado a la NEM, listo para conducir el aula. El tiempo se devuelve a la pedagogía viva.', target: 'Para coordinación académica y cuerpo docente.' },
              { num: '03', roman: 'iii', title: 'Padres que ven a su hijo entender, no sólo aprobar.', desc: 'El reporte semanal de Kleo prioriza el tipo de comprensión sobre la calificación. La familia identifica con precisión dónde su hijo razona y dónde memoriza.', target: 'Para comunicación con familias.' },
            ].map((c) => (
              <article key={c.num} className="reveal-item bg-white p-8 lg:p-10 rounded-3xl shadow-sm">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Compromiso {c.num}</span>
                  <span className="text-xl font-bold text-tinta-400">{c.roman}</span>
                </div>
                <h3 className="mt-8 text-xl font-bold leading-snug text-tinta">{c.title}</h3>
                <p className="mt-5 text-sm leading-relaxed text-tinta-400">{c.desc}</p>
                <p className="mt-6 font-mono text-[11px] text-tinta-400 uppercase tracking-widest border-t border-crema-300 pt-4">{c.target}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs font-mono text-tinta-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amarillo" />
            <span>Piloto con colegios fundadores en curso. Testimonios y métricas —próximamente, con fuente verificable.</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §09 · PARA COLEGIOS
         ══════════════════════════════════════════════════ */}
      <section id="directores" className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">§ 09 · Para colegios</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight text-tinta">
                Para directores y coordinadores <em className="not-italic">académicos</em>.
              </h2>
              <p className="mt-7 text-base leading-relaxed text-tinta-400 max-w-2xl">
                Kleo se implementa por convocatoria, con colegios fundadores. El proceso está
                diseñado para integrarse al plan vigente, no para reemplazar al equipo docente.
              </p>

              <ol className="mt-10 border-t border-crema-500">
                {[
                  { title: 'Diferenciador real frente a la competencia local.', desc: 'Una propuesta pedagógica con base teórica citable —Singapur, Bloom, Bruner— frente a apps de ejercicios o videos.' },
                  { title: 'Evidencia pedagógica que respalda tu propuesta educativa.', desc: 'Mapeo curricular descargable, instrumentos de evaluación formativa y reportes mensuales para padres alineados a la NEM.' },
                  { title: 'Implementación gradual sin sustituir al docente.', desc: 'Piloto controlado por grado, acompañamiento de formación docente en método singapurense y soporte pedagógico continuo.' },
                ].map((item, i) => (
                  <li key={i} className="grid grid-cols-12 gap-6 py-6 border-b border-crema-300">
                    <span className="col-span-2 font-mono text-[11px] text-tinta-400 uppercase tracking-widest pt-1">0{i + 1}</span>
                    <div className="col-span-10">
                      <h3 className="text-lg font-bold leading-tight text-tinta">{item.title}</h3>
                      <p className="mt-2 text-sm text-tinta-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-crema-100 border border-crema-300 p-7 lg:p-8 rounded-3xl">
                <div className="font-mono text-[11px] uppercase tracking-widest text-tinta-400 mb-3">Convocatoria 2026 · cupos limitados</div>
                <h3 className="text-2xl font-bold leading-tight text-tinta">Agenda una demo para tu colegio.</h3>
                <p className="mt-3 text-sm leading-relaxed text-tinta-400">
                  Sesión privada de 45 min con el equipo pedagógico. NDA disponible. Respuesta en menos de 48 h hábiles.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-tinta-400">
                  {['Recorrido del producto en datos reales.', 'Mapeo NEM × Singapur para tu calendario.', 'Plan de implementación por ciclo escolar.'].map((text) => (
                    <li key={text} className="flex gap-3">
                      <span className="font-mono text-tinta-400">—</span>{text}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={openDemo}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-tinta text-amarillo font-medium py-3 rounded-full hover:bg-tinta-600 transition-colors"
                >
                  Agendar demo para mi colegio
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a href="mailto:colegios@kleo.mx" className="mt-3 block text-center text-xs font-mono text-tinta-400 hover:text-tinta transition-colors">
                  o escribe a colegios@kleo.mx
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §10 · CONSEJO ASESOR
         ══════════════════════════════════════════════════ */}
      <section id="consejo" className="bg-crema-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-5">§ 10 · Consejo asesor pedagógico</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-tinta">
                Quienes garantizarán el <em className="not-italic">rigor</em> detrás del producto.
              </h2>
            </div>
            <div className="border-l-2 border-amarillo pl-4 self-end">
              <div className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">En formación</div>
              <div className="font-mono text-[11px] text-tinta-400">Anuncio · 2.º trim. 2026</div>
            </div>
          </div>

          <div className="reveal-item bg-white p-8 lg:p-12 max-w-5xl rounded-3xl shadow-sm">
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Declaración pública</span>
              <span className="h-px flex-1 bg-crema-500" />
              <span className="font-mono text-[11px] text-tinta-400">Mayo 2026</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-tinta">
              Consejo Asesor en formación. Kleo está convocando a investigadores en didáctica de
              las matemáticas —<span className="font-semibold">CINVESTAV</span>,{' '}
              <span className="font-semibold">UPN</span>, Escuelas Normales— y a coordinadores
              académicos de colegios líderes en México para conformar el Consejo Asesor Pedagógico fundador.
            </p>
            <p className="mt-6 text-base leading-relaxed text-tinta-400 max-w-3xl">
              Cada decisión pedagógica de Kleo pasará por este consejo. La composición se hará
              pública al concluir el proceso de convocatoria, con biografías, líneas de investigación y declaración de intereses.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
              <a href="mailto:consejo@kleo.mx" className="inline-flex items-center gap-2 bg-white hover:bg-crema-50 text-tinta border border-crema-300 font-medium px-5 py-2.5 rounded-full hover:border-tinta-400 transition-colors">
                Postular a investigador o docente
              </a>
              <span className="font-mono text-[11px] text-tinta-400">consejo@kleo.mx</span>
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-baseline justify-between mb-5">
              <div className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Instituciones a las que Kleo convoca</div>
              <div className="font-mono text-[11px] text-tinta-400">Líneas formales abiertas</div>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {['CINVESTAV', 'UPN', 'UNAM', 'Escuelas Normales', 'Mejoredu', 'Tec de Monterrey'].map((inst) => (
                <li key={inst} className="bg-white px-5 py-7 flex items-center justify-center rounded-3xl shadow-sm">
                  <span className="italic text-lg text-tinta-400 text-center leading-tight font-medium">{inst}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[11px] text-tinta-400">
              Lám. II — Instituciones a las que se ha extendido la convocatoria formal. La incorporación no implica respaldo institucional previo.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §11 · RESPALDO Y TRANSPARENCIA (dark)
         ══════════════════════════════════════════════════ */}
      <section id="respaldo" className="bg-tinta text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-widest text-amarillo mb-5">§ 11 · Respaldo y transparencia</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                La evidencia no se afirma. <em className="text-amarillo not-italic">Se publica.</em>
              </h2>
              <p className="mt-7 text-base leading-relaxed text-crema-500 max-w-md">
                Kleo opera bajo dos compromisos públicos que cualquier colegio, familia o investigador puede invocar.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <article className="border border-white/20 p-7 lg:p-9 rounded-3xl">
                <div className="flex items-baseline gap-4 mb-5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-amarillo">Compromiso I</span>
                  <span className="h-px flex-1 bg-white/20" />
                  <span className="font-mono text-[11px] text-crema-500">Publicación abierta</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold leading-snug tracking-tight">
                  Kleo se compromete a publicar la evidencia de eficacia de su método una vez completado el piloto con colegios fundadores.
                </p>
                <p className="mt-5 text-sm leading-relaxed text-crema-500">
                  Reporte técnico, metodología, datos anonimizados y limitaciones. Sin selección favorable, sin omisión de resultados negativos.
                </p>
              </article>

              <article className="border border-white/20 p-7 lg:p-9 rounded-3xl">
                <div className="flex items-baseline gap-4 mb-5">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-amarillo">Compromiso II</span>
                  <span className="h-px flex-1 bg-white/20" />
                  <span className="font-mono text-[11px] text-crema-500">Auditoría externa</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold leading-snug tracking-tight">
                  Kleo invita a investigadores externos a auditar su pedagogía y resultados.
                </p>
                <p className="mt-5 text-sm leading-relaxed text-crema-500">
                  Acceso a currículo, diseño de tareas, prompts del tutor y muestras de interacción. Las observaciones críticas se publican junto al reporte.
                </p>
              </article>

              <p className="font-mono text-[11px] text-crema-500 leading-relaxed max-w-2xl">
                — La transparencia no es una política de comunicación. Es una política de producto.
                Quien afirme rigor sin permitir auditoría no está ofreciendo educación; está ofreciendo marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         §12 · CTA FINAL
         ══════════════════════════════════════════════════ */}
      <section id="cta" className="bg-crema-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="text-xs font-medium uppercase tracking-widest text-tinta-400 mb-6">§ 12 · Construir</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-tinta">
              Construyamos juntos la educación{' '}
              <span className="block"><em className="not-italic">que México merece.</em></span>
            </h2>
            <p className="mt-8 max-w-2xl mx-auto text-base leading-relaxed text-tinta-400">
              Kleo busca aliados: colegios dispuestos a elevar el estándar, familias que exigen comprensión, investigadores que defienden el rigor.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={openDemo}
              className="text-left bg-tinta text-white p-8 lg:p-10 rounded-3xl flex flex-col justify-between hover:bg-tinta-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-amarillo">Vía 01 · Recomendada</span>
                  <span className="font-mono text-[11px] text-crema-500">B2B</span>
                </div>
                <h3 className="mt-8 text-3xl font-extrabold leading-tight">Soy colegio.</h3>
                <p className="mt-3 text-sm text-crema-500 max-w-sm leading-snug">
                  Agenda una demo privada de 45 min con el equipo pedagógico.
                </p>
              </div>
              <div className="mt-10 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-crema-500">Cupo limitado · 2026</span>
                <span className="inline-flex items-center gap-2 text-sm text-amarillo border-b border-amarillo pb-0.5">
                  Agendar demo <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>

            <div className="text-left bg-white p-8 lg:p-10 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Vía 02</span>
                  <span className="font-mono text-[11px] text-tinta-400">B2C</span>
                </div>
                <h3 className="mt-8 text-2xl font-bold leading-tight text-tinta">Soy padre o madre.</h3>
                <p className="mt-3 text-sm text-tinta-400 leading-snug">Conocer Kleo para mi hijo.</p>
              </div>
              <div className="mt-8 flex items-center justify-between text-tinta">
                <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Inscripción personal</span>
                <button type="button" onClick={openDemo} className="inline-flex items-center gap-1 text-sm border-b border-tinta pb-0.5">Conocer Kleo →</button>
              </div>
            </div>

            <a href="mailto:investigacion@kleo.mx" className="text-left bg-white p-8 lg:p-10 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Vía 03</span>
                  <span className="font-mono text-[11px] text-tinta-400">Acad.</span>
                </div>
                <h3 className="mt-8 text-2xl font-bold leading-tight text-tinta">Soy investigador o docente.</h3>
                <p className="mt-3 text-sm text-tinta-400 leading-snug">Contactar al equipo pedagógico.</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Auditoría · consejo</span>
                <span className="inline-flex items-center gap-1 text-sm text-tinta border-b border-tinta pb-0.5">Escribir →</span>
              </div>
            </a>
          </div>

          <p className="mt-10 text-center font-mono text-[11px] text-tinta-400 max-w-2xl mx-auto">
            Respuesta del equipo en menos de 48 h hábiles. Todas las conversaciones están cubiertas por NDA bajo solicitud.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
         FOOTER
         ══════════════════════════════════════════════════ */}
      <footer className="bg-tinta text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="text-3xl font-bold">Kleo</div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-crema-500">
              Plataforma mexicana de aprendizaje. Currículo de la Nueva Escuela Mexicana entregado
              con el método singapurense y un tutor socrático de IA.
            </p>
            <p className="mt-8 font-mono text-[11px] text-crema-500 leading-relaxed">
              Ciudad de México, México<br />hola@kleo.mx
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[11px] uppercase tracking-widest text-crema-500 mb-4">Producto</div>
            <ul className="space-y-2.5 text-sm text-crema-500">
              <li><a href="#metodo" className="hover:text-white transition-colors">Método</a></li>
              <li><a href="#manifiesto" className="hover:text-white transition-colors">Manifiesto</a></li>
              <li><a href="#comparativa" className="hover:text-white transition-colors">Comparativa</a></li>
              <li><a href="#nem" className="hover:text-white transition-colors">NEM × Singapur</a></li>
              <li><a href="#cobertura" className="hover:text-white transition-colors">Cobertura curricular</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[11px] uppercase tracking-widest text-crema-500 mb-4">Audiencias</div>
            <ul className="space-y-2.5 text-sm text-crema-500">
              <li><a href="#directores" className="hover:text-white transition-colors">Para colegios</a></li>
              <li><a href="#colegios" className="hover:text-white transition-colors">Para padres</a></li>
              <li><a href="#consejo" className="hover:text-white transition-colors">Consejo asesor</a></li>
              <li><a href="#respaldo" className="hover:text-white transition-colors">Respaldo</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-widest text-crema-500 mb-4">Legal</div>
            <ul className="space-y-2.5 text-sm text-crema-500">
              <li><Link href="/legal/privacidad" className="hover:text-white transition-colors">Aviso de privacidad</Link></li>
              <li><Link href="/legal/terminos" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-crema-500">
            <span>© 2026 Kleo Educación</span>
            <span>Hecho con rigor en Ciudad de México</span>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════
         DEMO MODAL
         ══════════════════════════════════════════════════ */}
      {demoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center modal-mask p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDemoOpen(false) }}
          role="presentation"
        >
          <div role="dialog" aria-modal="true" aria-labelledby="demoTitle" className="bg-white max-w-xl w-full rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-crema-300">
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-bold text-tinta">Kleo</span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Solicitar demo</span>
              </div>
              <button type="button" onClick={() => setDemoOpen(false)} aria-label="Cerrar" className="text-tinta-400 hover:text-tinta transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {demoStatus !== 'success' ? (
              <form onSubmit={handleDemoSubmit} className="px-6 py-6 space-y-5">
                <div>
                  <h3 id="demoTitle" className="text-2xl font-bold leading-tight text-tinta">Conversemos sobre tu colegio.</h3>
                  <p className="mt-2 text-sm text-tinta-400 leading-relaxed">El equipo pedagógico responde en menos de 48 h hábiles.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Nombre</span>
                    <input required value={demoForm.nombre} onChange={(e) => setDemoForm({ ...demoForm, nombre: e.target.value })} className="mt-1 w-full border border-crema-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Cargo</span>
                    <input value={demoForm.cargo} onChange={(e) => setDemoForm({ ...demoForm, cargo: e.target.value })} className="mt-1 w-full border border-crema-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta" />
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Colegio o institución</span>
                  <input required value={demoForm.colegio} onChange={(e) => setDemoForm({ ...demoForm, colegio: e.target.value })} className="mt-1 w-full border border-crema-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta" />
                </label>

                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">Correo institucional</span>
                  <input required type="email" value={demoForm.correo} onChange={(e) => setDemoForm({ ...demoForm, correo: e.target.value })} className="mt-1 w-full border border-crema-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta" />
                </label>

                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-tinta-400">¿Qué te gustaría explorar?</span>
                  <textarea rows={3} value={demoForm.mensaje} onChange={(e) => setDemoForm({ ...demoForm, mensaje: e.target.value })} className="mt-1 w-full border border-crema-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tinta focus:border-tinta resize-none" />
                </label>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-mono text-[11px] text-tinta-400">Confidencial · NDA disponible.</span>
                  <button type="submit" disabled={demoStatus === 'submitting'} className="bg-tinta text-amarillo font-medium px-5 py-2.5 rounded-full hover:bg-tinta-600 transition-colors disabled:opacity-50">
                    {demoStatus === 'submitting' ? 'Enviando…' : 'Enviar solicitud →'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="px-6 py-10 text-center">
                <div className="text-2xl font-bold text-tinta">Gracias.</div>
                <p className="mt-2 text-sm text-tinta-400">Hemos recibido tu solicitud. El equipo te contactará pronto.</p>
                <button type="button" onClick={() => setDemoOpen(false)} className="mt-6 bg-white hover:bg-crema-50 text-tinta border border-crema-300 font-medium px-5 py-2.5 rounded-full hover:border-tinta-400 transition-colors">
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
