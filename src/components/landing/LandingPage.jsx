'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/* ═══════════════════════════════════════
   CountUp — animated number on scroll
   ═══════════════════════════════════════ */
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

/* ═══════════════════════════════════════
   Reveal — scroll-triggered entrance
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN
   ═══════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="bg-crema-100 text-tinta min-h-screen relative">
      {/* Subtle grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── NAV ── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-tinta tracking-tight">
            Kleo
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/investigacion"
              className="hidden md:inline-block text-sm text-tinta-400 hover:text-tinta transition-colors"
            >
              Investigación
            </Link>
            <Link
              href="/colegios#postular"
              className="inline-flex items-center gap-2 text-sm font-semibold bg-tinta text-amarillo px-5 py-2.5 rounded-full hover:bg-tinta-600 transition-colors"
            >
              <span className="hidden sm:inline">Programa fundador</span>
              <span className="sm:hidden">Postular</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="px-6 pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full bg-amarillo/15 text-tinta border border-amarillo/25">
                <span className="w-1.5 h-1.5 rounded-full bg-amarillo animate-pulse-soft" />
                Convocatoria 2026 &middot; 20 colegios fundadores
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] text-tinta mt-8 tracking-tight">
                Matemáticas que tus alumnos{' '}
                <span className="relative inline-block">
                  por fin
                  <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-amarillo/30 rounded-full" />
                </span>{' '}
                van a entender.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-lg text-tinta-400 mt-7 leading-relaxed max-w-lg">
                Kleo es una plataforma mexicana que enseña matemáticas de secundaria con el método
                que usa Singapur, el país #1 del mundo en esta materia.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  href="/colegios#postular"
                  className="group inline-flex items-center justify-center gap-2.5 bg-tinta text-amarillo font-semibold px-7 py-4 rounded-full hover:bg-tinta-600 transition-all hover:shadow-lg hover:shadow-tinta/10"
                >
                  Postular mi colegio
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#como-funciona"
                  className="text-sm font-medium text-tinta-400 hover:text-tinta transition-colors flex items-center gap-1.5"
                >
                  <span className="w-6 h-6 rounded-full border border-tinta-400/30 flex items-center justify-center">
                    <span className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-tinta-400 ml-0.5" />
                  </span>
                  Cómo funciona
                </a>
              </div>
            </Reveal>
          </div>

          {/* TOCAR → VER → ENTENDER — elevated card */}
          <Reveal delay={0.15} className="lg:pl-4">
            <div className="relative">
              {/* Glow behind the card */}
              <div className="absolute -inset-6 bg-gradient-to-br from-amarillo/8 via-transparent to-tinta/3 rounded-[2.5rem] blur-2xl" />
              <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] border border-crema-300/50">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  {[
                    {
                      label: 'Tocar',
                      icon: (
                        <svg viewBox="0 0 64 64" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="14" y="28" width="12" height="12" rx="2" />
                          <rect x="30" y="28" width="12" height="12" rx="2" />
                          <rect x="22" y="16" width="12" height="12" rx="2" />
                        </svg>
                      ),
                    },
                    {
                      label: 'Ver',
                      icon: (
                        <svg viewBox="0 0 64 64" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="10" y="21" width="44" height="9" rx="1.5" />
                          <rect x="10" y="34" width="28" height="9" rx="1.5" />
                        </svg>
                      ),
                    },
                    {
                      label: 'Entender',
                      icon: <span className="italic text-lg font-semibold text-tinta">y = kx</span>,
                    },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-center gap-2 sm:gap-4 flex-1">
                      {i > 0 && (
                        <div className="flex items-center flex-shrink-0">
                          <div className="w-6 sm:w-8 h-px bg-amarillo" />
                          <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-amarillo" />
                        </div>
                      )}
                      <div className="flex flex-col items-center text-center flex-1 min-w-0">
                        <div className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full bg-crema-100 flex items-center justify-center text-tinta transition-all hover:bg-amarillo/10 hover:scale-105">
                          {step.icon}
                        </div>
                        <p className="text-[11px] sm:text-xs font-bold text-tinta mt-2.5 tracking-[0.15em] uppercase">
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-crema-300/60">
                  <p className="text-[13px] text-tinta-400 text-center leading-relaxed">
                    Tres pasos. Sin atajos. El mismo método que usa Singapur desde hace 40 años.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── EL PROBLEMA ── */}
      <section className="relative px-6 py-24 sm:py-32 bg-tinta text-white overflow-hidden">
        {/* Diagonal accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amarillo via-amarillo/40 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amarillo mb-8">
              El problema
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug tracking-tight text-white/90">
              El problema no es que los estudiantes mexicanos sean malos en matemáticas.
              <span className="block mt-2 text-white">
                Es cómo se las están enseñando.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-16 sm:mt-20 flex flex-col items-center">
              <div className="relative">
                <p className="text-[7rem] sm:text-[9rem] lg:text-[11rem] font-extrabold text-white leading-none tabular-nums">
                  <CountUp target={53} suffix="" />
                  <span className="text-amarillo">%</span>
                </p>
                {/* Subtle radial glow behind number */}
                <div className="absolute inset-0 bg-amarillo/5 rounded-full blur-3xl -z-10 scale-150" />
              </div>
              <p className="text-lg sm:text-xl text-crema-500 mt-6 max-w-md mx-auto leading-relaxed">
                de los jóvenes mexicanos no entiende matemáticas básicas a los 15 años.
              </p>
              <p className="text-xs text-crema-500/60 mt-6 font-mono">
                Fuente: PISA 2022 &middot; OCDE
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── LA SOLUCIÓN ── */}
      <section id="como-funciona" className="px-6 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="max-w-2xl mb-16 sm:mb-20">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-tinta-400 mb-4">
                El método
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-tight text-tinta tracking-tight">
                Así es como Kleo cambia la manera de enseñar.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Primero tocan. Después dibujan. Al final, la fórmula.',
                desc: 'Antes de memorizar fórmulas, el estudiante construye la idea con ejemplos visuales. Como lo hace Singapur desde hace 40 años.',
                visual: (
                  <div className="flex items-center gap-4 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex gap-1">
                        <span className="w-3 h-3 rounded-full bg-tinta/20" />
                        <span className="w-3 h-3 rounded-full bg-tinta/20" />
                        <span className="w-3 h-3 rounded-full bg-tinta/40" />
                      </div>
                      <span className="text-[8px] font-mono text-tinta-400 uppercase tracking-widest">Concreto</span>
                    </div>
                    <span className="text-tinta-400/40 text-lg">&rarr;</span>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex gap-[3px] items-end">
                        <span className="w-2 h-4 bg-tinta/30 rounded-[2px]" />
                        <span className="w-2 h-6 bg-tinta/50 rounded-[2px]" />
                        <span className="w-2 h-3.5 bg-tinta/20 rounded-[2px]" />
                      </div>
                      <span className="text-[8px] font-mono text-tinta-400 uppercase tracking-widest">Pictórico</span>
                    </div>
                    <span className="text-tinta-400/40 text-lg">&rarr;</span>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="italic text-base font-semibold text-tinta/70">y=kx</span>
                      <span className="text-[8px] font-mono text-tinta-400 uppercase tracking-widest">Abstracto</span>
                    </div>
                  </div>
                ),
              },
              {
                num: '02',
                title: 'Un tutor que nunca da la respuesta.',
                desc: 'La inteligencia artificial de Kleo hace preguntas. El alumno explica lo que entendió con sus propias palabras.',
                visual: (
                  <div className="flex flex-col gap-2.5 items-start max-w-[200px] mx-auto">
                    <div className="bg-white rounded-xl px-3.5 py-2 border border-crema-300 text-xs font-medium text-tinta shadow-sm">
                      ¿Por qué crees eso?
                    </div>
                    <div className="bg-white rounded-xl px-3.5 py-2 border border-crema-300 text-xs text-tinta-400 ml-6 shadow-sm">
                      Explícalo con tus palabras.
                    </div>
                    <div className="bg-amarillo/15 rounded-xl px-3.5 py-2 border border-amarillo/30 text-xs text-tinta ml-3 shadow-sm">
                      ¿Y si fueran 6 obreros?
                    </div>
                  </div>
                ),
              },
              {
                num: '03',
                title: 'No avanza hasta dominar el tema.',
                desc: 'En vez de pasar al siguiente tema porque toca, el estudiante avanza cuando realmente entiende.',
                visual: (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-end gap-2">
                      {[24, 38, 52, 68].map((h, i) => (
                        <div
                          key={i}
                          className={`w-5 rounded-[3px] transition-all ${i === 3 ? 'bg-tinta' : 'bg-tinta/15'}`}
                          style={{ height: h }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-crema-300 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-amarillo rounded-full" />
                      </div>
                      <span className="text-[10px] font-mono text-tinta-400">&ge;85%</span>
                    </div>
                  </div>
                ),
              },
            ].map((card, i) => (
              <Reveal key={card.num} delay={i * 0.1}>
                <div className="group bg-white rounded-[1.75rem] p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-transparent hover:border-crema-300/80">
                  <div className="font-mono text-[10px] font-semibold text-tinta-400/60 tracking-[0.2em] uppercase mb-6">
                    {card.num}
                  </div>

                  <div className="h-36 bg-crema-100/80 rounded-2xl mb-7 flex items-center justify-center px-4 group-hover:bg-crema-100 transition-colors">
                    {card.visual}
                  </div>

                  <h3 className="text-lg font-bold text-tinta leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[15px] text-tinta-400 mt-3 leading-relaxed flex-1">
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMA FUNDADOR ── */}
      <section id="programa-fundador" className="px-6 py-24 sm:py-32 bg-white">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-tinta-400 mb-4">
                Programa fundador
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-tight text-tinta tracking-tight">
                Convocatoria 2026: 20 colegios fundadores.
              </h2>
              <p className="text-lg text-tinta-400 mt-6 leading-relaxed max-w-xl mx-auto">
                Buscamos 20 colegios privados de México que quieran probar Kleo durante el ciclo
                escolar 2026-2027, sin costo.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-crema-100 rounded-[2rem] p-8 sm:p-12 border border-crema-300/50">
              <div className="grid md:grid-cols-2 gap-10 md:gap-16">
                <div>
                  <h3 className="text-lg font-bold text-tinta mb-6 pb-3 border-b-2 border-amarillo/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amarillo" />
                    Qué recibe tu colegio
                  </h3>
                  <ul className="space-y-4 text-[15px] text-tinta-400">
                    {[
                      'Acceso gratuito a Kleo Matemáticas (1.°, 2.° y 3.° de secundaria) durante todo el ciclo escolar 2026-2027.',
                      'Capacitación al equipo docente en el uso de Kleo y en el método singapurense.',
                      'Acceso gratuito a los recursos para docentes de las materias que Kleo vaya desarrollando durante el ciclo.',
                      'Reconocimiento público como Colegio Fundador de Kleo en México.',
                      'Condiciones preferentes permanentes cuando Kleo se vuelva de paga.',
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-amarillo font-bold mt-0.5 flex-shrink-0">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-tinta mb-6 pb-3 border-b border-crema-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-crema-500" />
                    Qué esperamos de tu colegio
                  </h3>
                  <ul className="space-y-4 text-[15px] text-tinta-400">
                    {[
                      'Que sea un colegio privado con al menos 100 estudiantes en secundaria (sumando los tres grados).',
                      'Que el equipo docente se comprometa a usar Kleo y participar en la capacitación.',
                      'Que nos permita medir resultados de aprendizaje durante el ciclo (en alianza con una universidad).',
                      'Que nos dé retroalimentación honesta y constante.',
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-tinta-400/40 font-medium mt-0.5 flex-shrink-0">
                          &#9675;
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 text-center">
              <Link
                href="/colegios#postular"
                className="group inline-flex items-center justify-center gap-2.5 bg-tinta text-amarillo font-semibold px-8 py-4 rounded-full hover:bg-tinta-600 transition-all hover:shadow-lg hover:shadow-tinta/10"
              >
                Postular mi colegio al programa fundador 2026
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── RESPALDO ── */}
      <section className="px-6 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-tinta-400 mb-4">
                Respaldo
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-tight text-tinta tracking-tight">
                Quiénes están detrás de Kleo.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'Construido sobre evidencia internacional.',
                content: (
                  <ul className="space-y-3 text-sm text-tinta-400">
                    {[
                      'Método singapurense (Singapore Math).',
                      'Investigación de Jerome Bruner sobre cómo aprenden los niños.',
                      'Investigación de Benjamin Bloom sobre tutoría personalizada.',
                    ].map((t) => (
                      <li key={t} className="flex gap-3">
                        <span className="w-1 h-1 rounded-full bg-amarillo mt-2 flex-shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: 'Medición con respaldo universitario.',
                content: (
                  <p className="text-sm text-tinta-400 leading-relaxed">
                    Kleo está iniciando conversaciones con universidades mexicanas de prestigio para
                    medir los resultados del piloto con rigor académico y validez externa.
                  </p>
                ),
              },
              {
                title: 'Hecho en México, para México.',
                content: (
                  <p className="text-sm text-tinta-400 leading-relaxed">
                    Alineado al plan de estudios de la SEP y a la Nueva Escuela Mexicana. Kleo no
                    reemplaza lo que la escuela debe enseñar; mejora la forma de enseñarlo.
                  </p>
                ),
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <div className="bg-white rounded-[1.75rem] p-7 sm:p-8 shadow-sm h-full border border-crema-300/50">
                  <h3 className="text-base font-bold text-tinta mb-5 leading-snug">
                    {card.title}
                  </h3>
                  {card.content}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-10 text-center">
              <Link
                href="/investigacion"
                className="inline-flex items-center gap-2 text-sm font-medium text-tinta-400 hover:text-tinta transition-colors group"
              >
                Ver la investigación completa
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative px-6 py-20 sm:py-28 bg-tinta text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amarillo/50 to-transparent" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amarillo/5 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              ¿Tu colegio podría ser uno de los{' '}
              <span className="text-amarillo">20</span> fundadores?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <Link
                href="/colegios#postular"
                className="group inline-flex items-center justify-center gap-2.5 bg-amarillo text-tinta font-bold px-8 py-4 rounded-full hover:bg-amarillo-hover transition-all hover:shadow-lg hover:shadow-amarillo/20"
              >
                Postular ahora
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="text-sm text-crema-500 mt-8">
              Cierre de convocatoria: 30 de agosto de 2026.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> &middot; </span>
              Respuesta del equipo en 48 horas hábiles.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-tinta text-white border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="text-lg font-extrabold tracking-tight">Kleo</span>
            <a
              href="mailto:hola@kleo.mx"
              className="text-sm text-crema-500 hover:text-white transition-colors"
            >
              hola@kleo.mx
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-crema-500">
            <Link href="/investigacion" className="hover:text-white transition-colors">
              Investigación
            </Link>
            <Link href="/colegios" className="hover:text-white transition-colors">
              Programa fundador
            </Link>
            <Link href="/legal/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <span className="text-crema-500/40">&copy; 2026 Kleo</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
