import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase as _supabase } from './supabase'
import { getAllTareasReferencia } from '@/data/tareas-referencia'

const supabase = _supabase as unknown as SupabaseClient

const DAY_MS = 86400000

function pseudoScore(seed: number): number {
  return Math.min(((seed * 7 + 13) % 10) + 1, 10)
}

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

export async function seedDemoData(profesorId: string) {
  const allRef = getAllTareasReferencia()

  // ── 1. Classes ───────────────────────────────────────────────────
  const { data: clases, error: clasesErr } = await supabase
    .from('clases')
    .insert([
      { profesor_id: profesorId, nombre: '1°A Matematicas', grado: '1° Secundaria' },
      { profesor_id: profesorId, nombre: '1°B Matematicas', grado: '1° Secundaria' },
    ])
    .select()

  if (clasesErr || !clases?.length) throw new Error(clasesErr?.message ?? 'Error creando clases')

  const [claseA, claseB] = clases

  // ── 2. Students ──────────────────────────────────────────────────
  const nombresA = [
    'Ana Garcia', 'Carlos Lopez', 'Diana Martinez', 'Eduardo Hernandez',
    'Fernanda Ramirez', 'Gabriel Torres', 'Isabella Flores', 'Jorge Morales',
    'Karen Sanchez', 'Luis Rivera', 'Maria Cruz', 'Nicolas Reyes',
  ]
  const nombresB = [
    'Andrea Vega', 'Bruno Castillo', 'Camila Ortiz', 'David Mendoza',
    'Elena Jimenez', 'Felipe Ruiz', 'Gabriela Pena', 'Hugo Vargas',
    'Irene Navarro', 'Juan Dominguez', 'Laura Guerrero', 'Manuel Soto',
  ]

  const code = (i: number, prefix: string) => `${prefix}${String(i + 1).padStart(3, '0')}`

  const { data: alumnosA, error: errA } = await supabase
    .from('alumnos')
    .insert(nombresA.map((nombre, i) => buildAlumno(nombre, claseA.id, code(i, 'DMA'), i)))
    .select()
  if (errA) { console.error('Seed alumnos A error:', errA); throw new Error(`Error alumnos A: ${errA.message}`) }

  const { data: alumnosB, error: errB } = await supabase
    .from('alumnos')
    .insert(nombresB.map((nombre, i) => buildAlumno(nombre, claseB.id, code(i, 'DMB'), i)))
    .select()
  if (errB) { console.error('Seed alumnos B error:', errB); throw new Error(`Error alumnos B: ${errB.message}`) }

  // ── 3. Tareas ────────────────────────────────────────────────────
  const now = Date.now()
  const pick = (secRef: number) => allRef.find((t) => t.secuencia_ref === secRef)

  const secRefsA = [1, 5, 9, 13, 14, 16]
  const secRefsB = [2, 3, 6, 10]

  function buildTarea(secRef: number, i: number, claseId: string, total: number, group: 'A' | 'B') {
    const ref = pick(secRef)!
    const daysAgo = (total - i) * 5
    const estados = group === 'A'
      ? (i < 4 ? 'en_curso' : i === 4 ? 'completada' : 'borrador')
      : (i < 2 ? 'en_curso' : 'completada')
    return {
      profesor_id: profesorId,
      clase_id: claseId,
      nombre: `Tarea ${i + 1} — Sec. ${secRef}`,
      dificultad: i < 2 ? 'Fácil' : i < 4 ? 'Media' : 'Difícil',
      contenido_cpa: { concreto: ref.concreto, pictorico: ref.pictorico, abstracto: ref.abstracto, contexto: ref.contexto },
      estado: estados,
      secuencia_ref: secRef,
      fecha_limite: estados !== 'borrador' ? new Date(now + (10 - daysAgo) * DAY_MS).toISOString() : null,
      pda: `Secuencia ${secRef}`,
    }
  }

  const tareasInsert = [
    ...secRefsA.map((s, i) => buildTarea(s, i, claseA.id, secRefsA.length, 'A')),
    ...secRefsB.map((s, i) => buildTarea(s, i, claseB.id, secRefsB.length, 'B')),
  ]

  console.log('Seed: inserting', tareasInsert.length, 'tareas. First:', JSON.stringify(tareasInsert[0], null, 2).slice(0, 500))
  const { data: tareas, error: tareasErr, status, statusText } = await supabase.from('tareas').insert(tareasInsert).select()
  if (tareasErr) { console.error('Seed tareas error:', JSON.stringify(tareasErr, null, 2), 'status:', status, statusText); throw new Error(`Error tareas (${status}): ${tareasErr.message || tareasErr.code || tareasErr.details || JSON.stringify(tareasErr)}`) }
  if (!tareas?.length) throw new Error('Error creando tareas: no data returned')

  // ── 4. Resultados + Intentos ─────────────────────────────────────
  const allAlumnos = [...(alumnosA ?? []), ...(alumnosB ?? [])]
  const resultados: Record<string, unknown>[] = []
  const intentos: Record<string, unknown>[] = []

  for (const tarea of tareas) {
    if (tarea.estado === 'borrador') continue

    const claseAlumnos = allAlumnos.filter((a) => a.clase_id === tarea.clase_id)
    const pct = tarea.estado === 'completada' ? 0.9 : 0.7

    for (let ai = 0; ai < claseAlumnos.length; ai++) {
      if (ai / claseAlumnos.length >= pct) break

      const alumno = claseAlumnos[ai]
      const seed = ai * 31 + tareas.indexOf(tarea) * 7

      const scoreC = pseudoScore(seed)
      const scoreP = pseudoScore(seed + 1)
      const scoreA = pseudoScore(seed + 2)
      const global = Math.round((scoreC * 0.2 + scoreP * 0.3 + scoreA * 0.5) * 10) / 10
      const numIntentos = (seed % 3) + 1
      const baseTime = new Date(tarea.created_at).getTime() + DAY_MS

      resultados.push({
        tarea_id: tarea.id,
        alumno_id: alumno.id,
        calificacion: global,
        scores_cpa: { concreto: scoreC, pictorico: scoreP, abstracto: scoreA },
        numero_intentos: numIntentos,
        ultima_tentativa_at: new Date(baseTime + numIntentos * 3600000).toISOString(),
      })

      for (let intento = 1; intento <= numIntentos; intento++) {
        const isBest = intento === numIntentos
        const factor = isBest ? 1 : 0.7
        const inicioAt = new Date(baseTime + (intento - 1) * 3600000)

        intentos.push({
          tarea_id: tarea.id,
          alumno_id: alumno.id,
          numero: intento,
          inicio_at: inicioAt.toISOString(),
          fin_at: new Date(inicioAt.getTime() + 900000 + (seed % 600000)).toISOString(),
          tiempo_concreto_ms: 60000 + (seed % 120000),
          tiempo_pictorico_ms: 90000 + (seed % 180000),
          tiempo_abstracto_ms: 120000 + (seed % 240000),
          scores_cpa: {
            concreto: Math.round(scoreC * factor * 10) / 10,
            pictorico: Math.round(scoreP * factor * 10) / 10,
            abstracto: Math.round(scoreA * factor * 10) / 10,
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
    alumnos: (alumnosA?.length ?? 0) + (alumnosB?.length ?? 0),
    tareas: tareas.length,
    resultados: resultados.length,
    intentos: intentos.length,
  }
}
