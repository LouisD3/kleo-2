import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase as _supabase } from './supabase'
import { getAllTareasReferencia } from '@/data/tareas-referencia'

const supabase = _supabase as unknown as SupabaseClient

const DAY_MS = 86400000

const COLORES = [
  'bg-pink-100 text-pink-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700',
]

function buildAlumno(nombre: string, claseId: string, codigoAcceso: string, index: number) {
  const iniciales = nombre.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2)
  return {
    clase_id: claseId,
    nombre,
    codigo_acceso: codigoAcceso,
    avatar_iniciales: iniciales,
    avatar_color: COLORES[index % COLORES.length],
  }
}

// Deterministic pseudo-random from seed (0–1 range)
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// Score with more natural variance (2–10 range)
function randomScore(seed: number, profile: 'fuerte' | 'medio' | 'debil'): number {
  const r = seededRandom(seed)
  if (profile === 'fuerte') return Math.min(Math.round(7 + r * 3), 10)
  if (profile === 'medio') return Math.min(Math.round(4 + r * 5), 10)
  return Math.min(Math.round(2 + r * 5), 8)
}

export async function seedDemoData(profesorId: string) {
  const allRef = getAllTareasReferencia()

  // ── 1. Classes ───────────────────────────────────────────────────
  const { data: clases, error: clasesErr } = await supabase
    .from('clases')
    .insert([
      { profesor_id: profesorId, nombre: '1°A Matematicas', grado: '1° Secundaria' },
      { profesor_id: profesorId, nombre: '1°B Matematicas', grado: '1° Secundaria' },
      { profesor_id: profesorId, nombre: '1°C Matematicas', grado: '1° Secundaria' },
    ])
    .select()

  if (clasesErr || !clases?.length) throw new Error(clasesErr?.message ?? 'Error creando clases')

  const [claseA, claseB, claseC] = clases

  // ── 2. Students ──────────────────────────────────────────────────
  const nombresA = [
    'Ana Garcia', 'Carlos Lopez', 'Diana Martinez', 'Eduardo Hernandez',
    'Fernanda Ramirez', 'Gabriel Torres', 'Isabella Flores', 'Jorge Morales',
    'Karen Sanchez', 'Luis Rivera', 'Maria Cruz', 'Nicolas Reyes',
    'Paola Gutierrez', 'Roberto Aguilar', 'Sofia Diaz', 'Tomas Romero',
    'Valeria Castro', 'Ximena Herrera',
  ]
  const nombresB = [
    'Andrea Vega', 'Bruno Castillo', 'Camila Ortiz', 'David Mendoza',
    'Elena Jimenez', 'Felipe Ruiz', 'Gabriela Pena', 'Hugo Vargas',
    'Irene Navarro', 'Juan Dominguez', 'Laura Guerrero', 'Manuel Soto',
    'Natalia Rojas', 'Oscar Delgado', 'Patricia Ibarra',
  ]
  const nombresC = [
    'Alejandro Fuentes', 'Beatriz Salazar', 'Cristian Paredes', 'Daniela Rios',
    'Emilio Cervantes', 'Fatima Espinoza', 'Gustavo Lara', 'Helena Medina',
    'Ivan Contreras', 'Jimena Acosta', 'Kevin Montoya', 'Lucia Campos',
    'Miguel Sandoval', 'Nayeli Orozco', 'Pablo Estrada', 'Renata Valencia',
  ]

  const code = (i: number, prefix: string) => `${prefix}${String(i + 1).padStart(3, '0')}`

  const insertAlumnos = async (nombres: string[], claseId: string, prefix: string) => {
    const { data, error } = await supabase
      .from('alumnos')
      .insert(nombres.map((nombre, i) => buildAlumno(nombre, claseId, code(i, prefix), i)))
      .select()
    if (error) throw new Error(`Error alumnos ${prefix}: ${error.message}`)
    return data ?? []
  }

  const [alumnosA, alumnosB, alumnosC] = await Promise.all([
    insertAlumnos(nombresA, claseA.id, 'DMA'),
    insertAlumnos(nombresB, claseB.id, 'DMB'),
    insertAlumnos(nombresC, claseC.id, 'DMC'),
  ])

  // ── 3. Tareas ────────────────────────────────────────────────────
  const now = Date.now()
  const pick = (secRef: number) => allRef.find((t) => t.secuencia_ref === secRef)

  // Class A: 8 tareas — good progression through the year
  const secRefsA = [1, 3, 5, 7, 9, 13, 14, 16]
  // Class B: 7 tareas — slightly behind
  const secRefsB = [1, 2, 4, 6, 8, 10, 12]
  // Class C: 6 tareas — newer class, just started
  const secRefsC = [1, 2, 3, 5, 6, 9]

  const dificultades = ['Facil', 'Facil', 'Media', 'Media', 'Media', 'Dificil', 'Dificil', 'Dificil'] as const

  function buildTarea(secRef: number, i: number, claseId: string, total: number, group: string) {
    const ref = pick(secRef)!
    const daysAgo = (total - i) * 4
    let estado: string
    if (group === 'A') {
      estado = i < 5 ? 'completada' : i < 7 ? 'en_curso' : 'borrador'
    } else if (group === 'B') {
      estado = i < 4 ? 'completada' : i < 6 ? 'en_curso' : 'borrador'
    } else {
      estado = i < 2 ? 'completada' : i < 5 ? 'en_curso' : 'borrador'
    }
    return {
      profesor_id: profesorId,
      clase_id: claseId,
      nombre: `Tarea ${i + 1} — Sec. ${secRef}`,
      dificultad: dificultades[i] ?? 'Media',
      contenido_cpa: { concreto: ref.concreto, pictorico: ref.pictorico, abstracto: ref.abstracto, contexto: ref.contexto },
      estado,
      secuencia_ref: secRef,
      fecha_limite: estado !== 'borrador' ? new Date(now + (10 - daysAgo) * DAY_MS).toISOString() : null,
      pda: `Secuencia ${secRef}`,
    }
  }

  const tareasInsert = [
    ...secRefsA.map((s, i) => buildTarea(s, i, claseA.id, secRefsA.length, 'A')),
    ...secRefsB.map((s, i) => buildTarea(s, i, claseB.id, secRefsB.length, 'B')),
    ...secRefsC.map((s, i) => buildTarea(s, i, claseC.id, secRefsC.length, 'C')),
  ]

  console.log('Seed: inserting', tareasInsert.length, 'tareas')
  const { data: tareas, error: tareasErr, status, statusText } = await supabase.from('tareas').insert(tareasInsert).select()
  if (tareasErr) { console.error('Seed tareas error:', JSON.stringify(tareasErr, null, 2), 'status:', status, statusText); throw new Error(`Error tareas (${status}): ${tareasErr.message || tareasErr.code || tareasErr.details || JSON.stringify(tareasErr)}`) }
  if (!tareas?.length) throw new Error('Error creando tareas: no data returned')

  // ── 4. Resultados + Intentos ─────────────────────────────────────
  // Assign student profiles for score variance
  const profileForIndex = (ai: number): 'fuerte' | 'medio' | 'debil' => {
    if (ai % 5 === 0 || ai % 5 === 1) return 'fuerte'
    if (ai % 5 === 4) return 'debil'
    return 'medio'
  }

  const allAlumnosByClase = new Map<string, typeof alumnosA>()
  allAlumnosByClase.set(claseA.id, alumnosA)
  allAlumnosByClase.set(claseB.id, alumnosB)
  allAlumnosByClase.set(claseC.id, alumnosC)

  const resultados: Record<string, unknown>[] = []
  const intentos: Record<string, unknown>[] = []

  for (const tarea of tareas) {
    if (tarea.estado === 'borrador') continue

    const claseAlumnos = allAlumnosByClase.get(tarea.clase_id) ?? []
    const tareaIndex = tareas.indexOf(tarea)

    // Participation rate: completada=85-95%, en_curso=50-80%
    const basePct = tarea.estado === 'completada' ? 0.85 : 0.55
    const pctVariance = seededRandom(tareaIndex * 99) * 0.15
    const pct = basePct + pctVariance

    for (let ai = 0; ai < claseAlumnos.length; ai++) {
      // Skip some students (absents)
      if (ai / claseAlumnos.length >= pct) continue
      // Additional random absences (1 in 8 chance)
      if (seededRandom(ai * 71 + tareaIndex * 37) < 0.12) continue

      const alumno = claseAlumnos[ai]
      const profile = profileForIndex(ai)
      const seed = ai * 31 + tareaIndex * 13

      // For en_curso tareas, some students may have partial progress
      const isEnCurso = tarea.estado === 'en_curso'
      const progressRoll = seededRandom(seed + 500)
      let stepsCompleted: 1 | 2 | 3
      if (isEnCurso && progressRoll < 0.15) {
        stepsCompleted = 1 // only concreto
      } else if (isEnCurso && progressRoll < 0.35) {
        stepsCompleted = 2 // concreto + pictorico
      } else {
        stepsCompleted = 3 // all steps
      }

      const scoreC = randomScore(seed, profile)
      const scoreP = stepsCompleted >= 2 ? randomScore(seed + 1, profile) : 0
      const scoreA = stepsCompleted >= 3 ? randomScore(seed + 2, profile) : 0

      const global = stepsCompleted === 3
        ? Math.round((scoreC * 0.2 + scoreP * 0.3 + scoreA * 0.5) * 10) / 10
        : stepsCompleted === 2
          ? Math.round((scoreC * 0.2 + scoreP * 0.3) * 10) / 10
          : Math.round(scoreC * 0.2 * 10) / 10

      const numIntentos = Math.max(1, (seed % 4) + (profile === 'debil' ? 1 : 0))
      const baseTime = new Date(tarea.created_at).getTime() + DAY_MS

      resultados.push({
        tarea_id: tarea.id,
        alumno_id: alumno.id,
        calificacion: global,
        scores_cpa: {
          concreto: { nota: scoreC, completada: true },
          pictorico: { nota: scoreP, completada: stepsCompleted >= 2 },
          abstracto: { nota: scoreA, completada: stepsCompleted >= 3 },
          global,
        },
        numero_intentos: numIntentos,
        ultima_tentativa_at: new Date(baseTime + numIntentos * 3600000).toISOString(),
      })

      for (let intento = 1; intento <= numIntentos; intento++) {
        const isBest = intento === numIntentos
        const factor = isBest ? 1 : 0.6 + seededRandom(seed + intento * 17) * 0.3
        const inicioAt = new Date(baseTime + (intento - 1) * 3600000)

        intentos.push({
          tarea_id: tarea.id,
          alumno_id: alumno.id,
          numero: intento,
          inicio_at: inicioAt.toISOString(),
          fin_at: new Date(inicioAt.getTime() + 600000 + Math.floor(seededRandom(seed + intento) * 900000)).toISOString(),
          tiempo_concreto_ms: 30000 + Math.floor(seededRandom(seed + intento + 1) * 150000),
          tiempo_pictorico_ms: stepsCompleted >= 2 ? 60000 + Math.floor(seededRandom(seed + intento + 2) * 200000) : 0,
          tiempo_abstracto_ms: stepsCompleted >= 3 ? 90000 + Math.floor(seededRandom(seed + intento + 3) * 300000) : 0,
          scores_cpa: {
            concreto: { nota: Math.round(scoreC * factor * 10) / 10, completada: true },
            pictorico: { nota: stepsCompleted >= 2 ? Math.round(scoreP * factor * 10) / 10 : 0, completada: stepsCompleted >= 2 },
            abstracto: { nota: stepsCompleted >= 3 ? Math.round(scoreA * factor * 10) / 10 : 0, completada: stepsCompleted >= 3 },
            global: Math.round(
              (scoreC * factor * 0.2
                + (stepsCompleted >= 2 ? scoreP * factor * 0.3 : 0)
                + (stepsCompleted >= 3 ? scoreA * factor * 0.5 : 0)
              ) * 10) / 10,
          },
        })
      }
    }
  }

  // Insert resultados in batches and collect their IDs
  const BATCH = 50
  const insertedResultados: { id: string; tarea_id: string; alumno_id: string }[] = []
  for (let i = 0; i < resultados.length; i += BATCH) {
    const { data, error } = await supabase.from('resultados').insert(resultados.slice(i, i + BATCH)).select('id, tarea_id, alumno_id')
    if (error) throw new Error(`Error resultados: ${error.message}`)
    if (data) insertedResultados.push(...data)
  }

  // Build a lookup map tarea_id+alumno_id -> resultado_id
  const resultadoMap = new Map<string, string>()
  for (const r of insertedResultados) {
    resultadoMap.set(`${r.tarea_id}|${r.alumno_id}`, r.id)
  }

  // Add resultado_id to each intento
  for (const intento of intentos) {
    const key = `${intento.tarea_id}|${intento.alumno_id}`
    intento.resultado_id = resultadoMap.get(key)
  }

  for (let i = 0; i < intentos.length; i += BATCH) {
    const { error } = await supabase.from('intentos').insert(intentos.slice(i, i + BATCH))
    if (error) throw new Error(`Error intentos: ${error.message}`)
  }

  return {
    clases: clases.length,
    alumnos: alumnosA.length + alumnosB.length + alumnosC.length,
    tareas: tareas.length,
    resultados: resultados.length,
    intentos: intentos.length,
  }
}
