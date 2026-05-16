import type { SupabaseClient } from '@supabase/supabase-js'
import { getAllTareasReferencia } from '@/data/tareas-referencia'
import { supabase as _supabase } from './supabase'

const supabase = _supabase as unknown as SupabaseClient

const DAY_MS = 86400000
const HOUR_MS = 3600000

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

// ── Deterministic PRNG ──────────────────────────────────────────────
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// ── Student archetypes ──────────────────────────────────────────────
type Archetype =
  | 'estrella'
  | 'bueno'
  | 'medio'
  | 'luchador'
  | 'debil'
  | 'ausente'
  | 'nuevo'
  | 'irregular'

function scoreForArchetype(seed: number, arch: Archetype, step: 'C' | 'P' | 'A'): number {
  const r = seededRandom(seed)
  switch (arch) {
    case 'estrella':
      return Math.min(Math.round(9 + r * 1), 10)
    case 'bueno':
      return Math.min(Math.round(7 + r * 3), 10)
    case 'medio':
      return Math.min(Math.round(5 + r * 4), 10)
    case 'luchador': {
      // Struggles more on Abstracto
      if (step === 'A') return Math.min(Math.round(2 + r * 3), 6)
      if (step === 'P') return Math.min(Math.round(3 + r * 4), 7)
      return Math.min(Math.round(4 + r * 4), 8)
    }
    case 'debil':
      return Math.min(Math.round(2 + r * 4), 6)
    case 'irregular': {
      // Bimodal: sometimes great, sometimes bad
      return r > 0.5 ? Math.min(Math.round(7 + r * 3), 10) : Math.min(Math.round(2 + r * 4), 6)
    }
    case 'nuevo':
      return Math.min(Math.round(4 + r * 5), 9) // decent but not top
    case 'ausente':
      return 0 // never used, they don't submit
  }
}

function attemptsForArchetype(seed: number, arch: Archetype): number {
  const r = seededRandom(seed)
  switch (arch) {
    case 'estrella':
      return 1
    case 'bueno':
      return 1 + (r > 0.7 ? 1 : 0)
    case 'medio':
      return 1 + Math.floor(r * 3)
    case 'luchador':
      return 2 + Math.floor(r * 3)
    case 'debil':
      return 2 + Math.floor(r * 4)
    case 'irregular':
      return 1 + Math.floor(r * 3)
    case 'nuevo':
      return 1 + Math.floor(r * 2)
    case 'ausente':
      return 0
  }
}

// ── Class profiles ──────────────────────────────────────────────────
interface ClassProfile {
  nombre: string
  grado: string
  prefix: string
  archetypes: Archetype[] // one per student
  secRefs: number[] // which secuencia_ref to assign
  // How many tareas are completada / en_curso / borrador
  completadas: number
  enCurso: number
}

const NOMBRES_POOL = [
  // 160 unique Mexican names — enough for all classes
  'Ana Garcia',
  'Carlos Lopez',
  'Diana Martinez',
  'Eduardo Hernandez',
  'Fernanda Ramirez',
  'Gabriel Torres',
  'Isabella Flores',
  'Jorge Morales',
  'Karen Sanchez',
  'Luis Rivera',
  'Maria Cruz',
  'Nicolas Reyes',
  'Paola Gutierrez',
  'Roberto Aguilar',
  'Sofia Diaz',
  'Tomas Romero',
  'Valeria Castro',
  'Ximena Herrera',
  'Alejandro Fuentes',
  'Beatriz Salazar',
  'Cristian Paredes',
  'Daniela Rios',
  'Emilio Cervantes',
  'Fatima Espinoza',
  'Gustavo Lara',
  'Helena Medina',
  'Ivan Contreras',
  'Jimena Acosta',
  'Andrea Vega',
  'Bruno Castillo',
  'Camila Ortiz',
  'David Mendoza',
  'Elena Jimenez',
  'Felipe Ruiz',
  'Gabriela Pena',
  'Hugo Vargas',
  'Irene Navarro',
  'Juan Dominguez',
  'Laura Guerrero',
  'Manuel Soto',
  'Natalia Rojas',
  'Oscar Delgado',
  'Patricia Ibarra',
  'Kevin Montoya',
  'Lucia Campos',
  'Miguel Sandoval',
  'Nayeli Orozco',
  'Pablo Estrada',
  'Renata Valencia',
  'Santiago Mora',
  'Teresa Pacheco',
  'Ulises Cabrera',
  'Victoria Duran',
  'Arturo Bautista',
  'Carmen Nunez',
  'Diego Figueroa',
  'Erika Serrano',
  'Francisco Zamora',
  'Gloria Maldonado',
  'Hector Velazquez',
  'Itzel Cisneros',
  'Jaime Olvera',
  'Karla Espinosa',
  'Leonardo Trujillo',
  'Monica Villegas',
  'Nestor Cardenas',
  'Olga Bermudez',
  'Pedro Arellano',
  'Raquel Miranda',
  'Samuel Ochoa',
  'Ursula Tapia',
  'Victor Camacho',
  'Wendy Rosales',
  'Yahir Mejia',
  'Zoe Aguirre',
  'Adrian Cortes',
  'Bianca Luna',
  'Cesar Ramos',
  'Dulce Rangel',
  'Enrique Ponce',
  'Frida Galindo',
  'Gerardo Huerta',
  'Hilda Montes',
  'Ignacio Valdez',
  'Josefina Alvarado',
  'Karina Bravo',
  'Lorenzo Davila',
  'Marisol Solis',
  'Omar Barrera',
  'Perla Ayala',
  'Rodrigo Nava',
  'Susana Mercado',
  'Abel Pineda',
  'Claudia Becerra',
  'Dante Quiroz',
  'Elisa Arce',
  'Fernando Leal',
  'Gisela Cornejo',
  'Horacio Suarez',
  'Ingrid Meza',
  'Joaquin Plata',
  'Lidia Cervera',
  'Marcos Gallegos',
  'Norma Zepeda',
  'Octavio Bustos',
  'Pilar Ordonez',
  'Ricardo Tovar',
  'Silvia Gaitan',
  'Tania Lugo',
  'Ubaldo Palacios',
  'Veronica Corona',
  'Waldo Prieto',
  'Yadira Segura',
  'Zaira Molina',
  'Alfredo Salgado',
  'Brenda Cordoba',
  'Conrado Estevez',
  'Delia Villarreal',
  'Ernesto Balderas',
  'Flor Chacon',
  'Gonzalo Salinas',
  'Imelda Parra',
  'Joel Montiel',
  'Katia Rincon',
  'Lazaro Quintero',
  'Miriam Arriaga',
  'Norberto Solano',
  'Ofelia Cantu',
  'Pascual Godinez',
  'Regina Barron',
  'Saul Fierro',
  'Tamara Carrillo',
  'Uri Montalvo',
  'Viviana Escalante',
  'Xavier Robles',
  'Yolanda Tejeda',
  'Alonso Aranda',
  'Berenice Cuevas',
  'Celestino Gil',
  'Dafne Lujan',
  'Efrain Mendieta',
  'Griselda Rubio',
  'Heriberto Paz',
  'Isis Franco',
]

function buildAlumno(nombre: string, claseId: string, codigoAcceso: string, index: number) {
  const iniciales = nombre
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return {
    clase_id: claseId,
    nombre,
    codigo_acceso: codigoAcceso,
    avatar_iniciales: iniciales,
    avatar_color: COLORES[index % COLORES.length],
  }
}

// ── 6 class profiles ────────────────────────────────────────────────
function buildClassProfiles(): ClassProfile[] {
  // Archetype distribution helpers
  const arch = (pattern: Archetype[], count: number): Archetype[] => {
    const out: Archetype[] = []
    for (let i = 0; i < count; i++) out.push(pattern[i % pattern.length])
    return out
  }

  return [
    {
      // Class A: Advanced group, 28 students, far along in curriculum
      nombre: '1A Matematicas',
      grado: '1 Secundaria',
      prefix: 'DMA',
      archetypes: arch(
        [
          'estrella',
          'estrella',
          'bueno',
          'bueno',
          'bueno',
          'medio',
          'medio',
          'medio',
          'irregular',
          'luchador',
        ],
        28,
      ),
      secRefs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      completadas: 10,
      enCurso: 3,
    },
    {
      // Class B: Average group, 26 students, mid-semester
      nombre: '1B Matematicas',
      grado: '1 Secundaria',
      prefix: 'DMB',
      archetypes: arch(
        [
          'bueno',
          'medio',
          'medio',
          'medio',
          'luchador',
          'luchador',
          'debil',
          'irregular',
          'bueno',
          'medio',
        ],
        26,
      ),
      secRefs: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11],
      completadas: 6,
      enCurso: 3,
    },
    {
      // Class C: Struggling group, 24 students, behind schedule
      nombre: '1C Matematicas',
      grado: '1 Secundaria',
      prefix: 'DMC',
      archetypes: arch(
        [
          'medio',
          'luchador',
          'luchador',
          'debil',
          'debil',
          'ausente',
          'medio',
          'irregular',
          'bueno',
          'luchador',
        ],
        24,
      ),
      secRefs: [1, 2, 3, 4, 5, 6, 7, 8],
      completadas: 4,
      enCurso: 3,
    },
    {
      // Class D: New class, 22 students, just started
      nombre: '1D Matematicas',
      grado: '1 Secundaria',
      prefix: 'DMD',
      archetypes: arch(
        [
          'nuevo',
          'nuevo',
          'medio',
          'bueno',
          'luchador',
          'medio',
          'nuevo',
          'estrella',
          'debil',
          'medio',
        ],
        22,
      ),
      secRefs: [1, 2, 3, 4, 5],
      completadas: 2,
      enCurso: 2,
    },
    {
      // Class E: Small honors group, 16 students, excellent
      nombre: '1E Avanzado',
      grado: '1 Secundaria',
      prefix: 'DME',
      archetypes: arch(
        ['estrella', 'estrella', 'bueno', 'bueno', 'estrella', 'medio', 'bueno', 'estrella'],
        16,
      ),
      secRefs: [1, 3, 5, 7, 9, 11, 13, 14, 16, 17, 18, 19, 20],
      completadas: 10,
      enCurso: 2,
    },
    {
      // Class F: Refuerzo / remedial, 18 students, lots of struggles
      nombre: '1F Refuerzo',
      grado: '1 Secundaria',
      prefix: 'DMF',
      archetypes: arch(
        [
          'luchador',
          'debil',
          'debil',
          'ausente',
          'luchador',
          'medio',
          'debil',
          'ausente',
          'luchador',
          'nuevo',
        ],
        18,
      ),
      secRefs: [1, 1, 2, 3, 5, 6],
      completadas: 3,
      enCurso: 2,
    },
  ]
}

// ── PDA label for a secuencia ref ───────────────────────────────────
const PDA_LABELS: Record<number, string> = {
  1: 'Fracciones y decimales',
  2: 'Enteros negativos',
  3: 'Comparacion con signo',
  4: 'Densidad del orden',
  5: 'Suma y resta',
  6: 'Multiplicacion y division',
  7: 'Propiedad conmutativa y asociativa',
  8: 'Propiedad distributiva',
  9: 'Sucesiones aritmeticas',
  10: 'Introduccion al algebra',
  11: 'Perimetros',
  12: 'Ecuaciones lineales',
  13: 'Porcentajes',
  14: 'Razones',
  15: 'Proporcionalidad',
  16: 'Rectas',
  17: 'Angulos',
  18: 'Punto medio y mediatriz',
  19: 'Bisectriz',
  20: 'Rectas notables',
}

// ── Main seed function ──────────────────────────────────────────────
export async function seedDemoData(profesorId: string) {
  const allRef = getAllTareasReferencia()
  const pick = (secRef: number) => allRef.find((t) => t.secuencia_ref === secRef)
  const profiles = buildClassProfiles()
  const now = Date.now()

  // ── 1. Classes ──────────────────────────────────────────────────
  const { data: clases, error: clasesErr } = await supabase
    .from('clases')
    .insert(profiles.map((p) => ({ profesor_id: profesorId, nombre: p.nombre, grado: p.grado })))
    .select()

  if (clasesErr || !clases?.length) throw new Error(clasesErr?.message ?? 'Error creando clases')

  // ── 2. Students ─────────────────────────────────────────────────
  let nameIndex = 0
  const allAlumnosByClase = new Map<string, { id: string; nombre: string }[]>()
  const archetypesByClase = new Map<string, Archetype[]>()

  for (let ci = 0; ci < clases.length; ci++) {
    const clase = clases[ci]
    const profile = profiles[ci]
    const nombres = NOMBRES_POOL.slice(nameIndex, nameIndex + profile.archetypes.length)
    nameIndex += profile.archetypes.length

    const code = (i: number) => `${profile.prefix}${String(i + 1).padStart(3, '0')}`
    const { data, error } = await supabase
      .from('alumnos')
      .insert(nombres.map((nombre, i) => buildAlumno(nombre, clase.id, code(i), i)))
      .select()
    if (error) throw new Error(`Error alumnos ${profile.prefix}: ${error.message}`)
    allAlumnosByClase.set(clase.id, data ?? [])
    archetypesByClase.set(clase.id, profile.archetypes)
  }

  // ── 3. Tareas ───────────────────────────────────────────────────
  const dificultades = [
    'Fácil',
    'Fácil',
    'Media',
    'Media',
    'Media',
    'Difícil',
    'Difícil',
    'Media',
    'Difícil',
    'Media',
    'Media',
    'Difícil',
    'Difícil',
    'Difícil',
  ] as const

  const tareasInsert: Record<string, unknown>[] = []

  for (let ci = 0; ci < clases.length; ci++) {
    const clase = clases[ci]
    const profile = profiles[ci]
    const total = profile.secRefs.length

    for (let ti = 0; ti < total; ti++) {
      const secRef = profile.secRefs[ti]
      const ref = pick(secRef)
      if (!ref) continue

      let estado: string
      if (ti < profile.completadas) estado = 'completada'
      else if (ti < profile.completadas + profile.enCurso) estado = 'en_curso'
      else estado = 'borrador'

      // Irregular spacing: 2-6 days between tareas
      const daysAgo = (total - ti) * 3 + Math.floor(seededRandom(ci * 100 + ti * 7) * 4)
      const createdAt = new Date(now - daysAgo * DAY_MS)
      const fechaLimite =
        estado !== 'borrador'
          ? new Date(
              createdAt.getTime() + (5 + Math.floor(seededRandom(ti * 11 + ci) * 5)) * DAY_MS,
            )
          : null

      tareasInsert.push({
        profesor_id: profesorId,
        clase_id: clase.id,
        nombre: `Sec. ${secRef} — ${PDA_LABELS[secRef] ?? `Secuencia ${secRef}`}`,
        dificultad: dificultades[ti % dificultades.length] ?? 'Media',
        contenido_cpa: {
          concreto: ref.concreto,
          pictorico: ref.pictorico,
          abstracto: ref.abstracto,
          contexto: ref.contexto,
        },
        estado,
        secuencia_ref: secRef,
        created_at: createdAt.toISOString(),
        fecha_limite: fechaLimite?.toISOString() ?? null,
        pda: `Secuencia ${secRef}`,
      })
    }
  }

  console.log('Seed: inserting', tareasInsert.length, 'tareas')
  const {
    data: tareas,
    error: tareasErr,
    status,
    statusText,
  } = await supabase.from('tareas').insert(tareasInsert).select()
  if (tareasErr) {
    console.error(
      'Seed tareas error:',
      JSON.stringify(tareasErr, null, 2),
      'status:',
      status,
      statusText,
    )
    throw new Error(
      `Error tareas (${status}): ${tareasErr.message || tareasErr.code || tareasErr.details || JSON.stringify(tareasErr)}`,
    )
  }
  if (!tareas?.length) throw new Error('Error creando tareas: no data returned')

  // ── 4. Resultados + Intentos ────────────────────────────────────
  const resultados: Record<string, unknown>[] = []
  const intentos: Record<string, unknown>[] = []
  const manualOverrides: { tareaId: string; alumnoId: string; nota: number }[] = []

  for (const tarea of tareas) {
    if (tarea.estado === 'borrador') continue

    const claseAlumnos = allAlumnosByClase.get(tarea.clase_id) ?? []
    const archetypes = archetypesByClase.get(tarea.clase_id) ?? []
    const tareaIdx = tareas.indexOf(tarea)

    // Participation: completada 80-95%, en_curso 40-75%
    const basePct = tarea.estado === 'completada' ? 0.8 : 0.4
    const pctVar =
      seededRandom(tareaIdx * 99) * 0.15 + (tarea.estado === 'completada' ? 0.05 : 0.15)
    const pct = basePct + pctVar

    for (let ai = 0; ai < claseAlumnos.length; ai++) {
      const arch = archetypes[ai] ?? 'medio'
      const alumno = claseAlumnos[ai]

      // Ausente archetype: never participates
      if (arch === 'ausente') continue

      // Nuevo archetype: only participates in later tareas
      if (arch === 'nuevo' && tareaIdx < tareas.length * 0.6) continue

      // Random absences
      if (ai / claseAlumnos.length >= pct) continue
      if (seededRandom(ai * 71 + tareaIdx * 37) < 0.1) continue

      const seed = ai * 31 + tareaIdx * 13

      // Steps completed: depends on estado + archetype
      const isEnCurso = tarea.estado === 'en_curso'
      const progressRoll = seededRandom(seed + 500)
      let stepsCompleted: 1 | 2 | 3
      if (arch === 'debil' && isEnCurso) {
        // Weak students often stuck early
        stepsCompleted = progressRoll < 0.4 ? 1 : progressRoll < 0.7 ? 2 : 3
      } else if (arch === 'luchador' && isEnCurso) {
        stepsCompleted = progressRoll < 0.2 ? 1 : progressRoll < 0.5 ? 2 : 3
      } else if (isEnCurso) {
        stepsCompleted = progressRoll < 0.1 ? 1 : progressRoll < 0.25 ? 2 : 3
      } else {
        stepsCompleted = 3 // completada tareas: all steps done
      }

      const scoreC = scoreForArchetype(seed, arch, 'C')
      const scoreP = stepsCompleted >= 2 ? scoreForArchetype(seed + 1, arch, 'P') : 0
      const scoreA = stepsCompleted >= 3 ? scoreForArchetype(seed + 2, arch, 'A') : 0

      const global =
        stepsCompleted === 3
          ? Math.round((scoreC * 0.2 + scoreP * 0.3 + scoreA * 0.5) * 10) / 10
          : stepsCompleted === 2
            ? Math.round((scoreC * 0.2 + scoreP * 0.3) * 10) / 10
            : Math.round(scoreC * 0.2 * 10) / 10

      const numIntentos = attemptsForArchetype(seed + 3, arch)
      if (numIntentos === 0) continue

      // Time base: completada tareas spread from creation, en_curso tareas are recent (0-2 days ago)
      const baseTime = isEnCurso
        ? now - Math.floor(seededRandom(seed + 10) * 2 * DAY_MS)
        : new Date(tarea.created_at).getTime() +
          DAY_MS +
          Math.floor(seededRandom(seed + 10) * 2 * DAY_MS)

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
        ultima_tentativa_at: new Date(baseTime + numIntentos * HOUR_MS * 3).toISOString(),
      })

      // Maybe add a manual override (teacher adjusted grade)
      // ~5% of completada results from luchador/debil students
      if (
        tarea.estado === 'completada' &&
        (arch === 'luchador' || arch === 'debil') &&
        seededRandom(seed + 999) < 0.2
      ) {
        manualOverrides.push({
          tareaId: tarea.id,
          alumnoId: alumno.id,
          nota: Math.min(global + 1.5, 10),
        })
      }

      for (let intento = 1; intento <= numIntentos; intento++) {
        const isBest = intento === numIntentos
        const factor = isBest ? 1 : 0.5 + seededRandom(seed + intento * 17) * 0.4
        const inicioAt = new Date(baseTime + (intento - 1) * HOUR_MS * 3)
        const duracionMs = 600000 + Math.floor(seededRandom(seed + intento) * 1200000)

        intentos.push({
          tarea_id: tarea.id,
          alumno_id: alumno.id,
          numero: intento,
          inicio_at: inicioAt.toISOString(),
          fin_at: new Date(inicioAt.getTime() + duracionMs).toISOString(),
          tiempo_concreto_ms: 20000 + Math.floor(seededRandom(seed + intento + 1) * 180000),
          tiempo_pictorico_ms:
            stepsCompleted >= 2 ? 40000 + Math.floor(seededRandom(seed + intento + 2) * 250000) : 0,
          tiempo_abstracto_ms:
            stepsCompleted >= 3 ? 60000 + Math.floor(seededRandom(seed + intento + 3) * 350000) : 0,
          scores_cpa: {
            concreto: { nota: Math.round(scoreC * factor * 10) / 10, completada: true },
            pictorico: {
              nota: stepsCompleted >= 2 ? Math.round(scoreP * factor * 10) / 10 : 0,
              completada: stepsCompleted >= 2,
            },
            abstracto: {
              nota: stepsCompleted >= 3 ? Math.round(scoreA * factor * 10) / 10 : 0,
              completada: stepsCompleted >= 3,
            },
            global:
              Math.round(
                (scoreC * factor * 0.2 +
                  (stepsCompleted >= 2 ? scoreP * factor * 0.3 : 0) +
                  (stepsCompleted >= 3 ? scoreA * factor * 0.5 : 0)) *
                  10,
              ) / 10,
          },
        })
      }
    }
  }

  // ── Insert resultados in batches ────────────────────────────────
  const BATCH = 50
  const insertedResultados: { id: string; tarea_id: string; alumno_id: string }[] = []
  for (let i = 0; i < resultados.length; i += BATCH) {
    const { data, error } = await supabase
      .from('resultados')
      .insert(resultados.slice(i, i + BATCH))
      .select('id, tarea_id, alumno_id')
    if (error) throw new Error(`Error resultados: ${error.message}`)
    if (data) insertedResultados.push(...data)
  }

  // Lookup map tarea_id+alumno_id -> resultado_id
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

  // ── Apply manual overrides ──────────────────────────────────────
  for (const ov of manualOverrides) {
    const rid = resultadoMap.get(`${ov.tareaId}|${ov.alumnoId}`)
    if (rid) {
      await supabase
        .from('resultados')
        .update({
          calificacion_manual: Math.round(ov.nota * 10) / 10,
        })
        .eq('id', rid)
    }
  }

  // ── Summary ─────────────────────────────────────────────────────
  const totalAlumnos = Array.from(allAlumnosByClase.values()).reduce((s, a) => s + a.length, 0)
  return {
    clases: clases.length,
    alumnos: totalAlumnos,
    tareas: tareas.length,
    resultados: resultados.length,
    intentos: intentos.length,
  }
}

// ── Clear all data for a teacher ────────────────────────────────────
// Deletes intentos -> resultados -> tareas -> alumnos -> clases (cascade order)
export async function clearDemoData(profesorId: string) {
  // Get all classes for this teacher
  const { data: clases } = await supabase
    .from('clases')
    .select('id')
    .eq('profesor_id', profesorId)

  if (!clases?.length) return { deleted: 0 }

  const claseIds = clases.map((c) => c.id)

  // Get all tareas for these classes
  const { data: tareas } = await supabase
    .from('tareas')
    .select('id')
    .in('clase_id', claseIds)

  const tareaIds = tareas?.map((t) => t.id) ?? []

  // Get all alumnos for these classes
  const { data: alumnos } = await supabase
    .from('alumnos')
    .select('id')
    .in('clase_id', claseIds)

  const alumnoIds = alumnos?.map((a) => a.id) ?? []

  // Delete in dependency order
  if (tareaIds.length) {
    await supabase.from('intentos').delete().in('tarea_id', tareaIds)
    await supabase.from('resultados').delete().in('tarea_id', tareaIds)
    await supabase.from('tareas').delete().in('id', tareaIds)
  }
  if (alumnoIds.length) {
    await supabase.from('alumnos').delete().in('id', alumnoIds)
  }
  await supabase.from('clases').delete().in('id', claseIds)

  return {
    clases: claseIds.length,
    alumnos: alumnoIds.length,
    tareas: tareaIds.length,
  }
}
