/**
 * seed-library.ts — Pre-generate biblioteca content using the multi-pass pipeline
 *
 * Usage:
 *   npx tsx scripts/seed-library.ts
 *
 * Requires env vars:
 *   ANTHROPIC_API_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (to bypass RLS)
 *
 * Generates resources for specified PDAs × methodologies using the Batch API pattern
 * (sequential with delay to avoid rate limits)
 */

import { createClient } from '@supabase/supabase-js'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// --- Configuration: what to generate ---

interface PDATarget {
  materia: string
  grado: string
  pda: string
  contenido?: string
  tema?: string
}

// Import PDAs from the mock data
// You can customize this list to target specific PDAs
const METODOLOGIAS = ['Feynman', 'Memorización activa', 'Resolución de problemas', 'Práctica directa']
const DIFICULTADES = ['Fácil', 'Media', 'Difícil']
const RECURSOS_POR_PDA = 3 // Generate 3 resources per PDA × methodology combination

// --- API Helper ---

async function callClaude(prompt: string, model: string, maxTokens: number): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic ${response.status}: ${err}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text ?? ''
}

function extractJSON(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found')
  return JSON.parse(match[0])
}

// --- Generation pipeline (simplified for batch) ---

async function generateResource(pda: PDATarget, metodologia: string, dificultad: string) {
  const prompt = `Eres un experto en pedagogía mexicana. Genera un ejercicio escolar con 5 preguntas.

Materia: ${pda.materia}
Grado: ${pda.grado}
Dificultad: ${dificultad}
Metodología pedagógica: ${metodologia}
PDA: ${pda.pda}${pda.contenido ? `\nContenido curricular: ${pda.contenido}` : ''}

Tipos de ejercicios a incluir: opcion_multiple, verdadero_falso, abierta, espacios, calculo
Distribuye equitativamente entre los tipos.

Reglas:
- Para "opcion_multiple": exactamente 4 opciones (A, B, C, D), "respuesta" con la letra correcta.
- Para "verdadero_falso": "respuesta" con true o false.
- Para "espacios": un ___ en la pregunta, "respuesta" con la palabra correcta.
- Para "abierta": "respuesta" con respuesta modelo.
- Para "calculo": "respuesta" con resolución paso a paso.
- Todo en español mexicano.
- Las preguntas deben estar alineadas con el PDA indicado.

JSON requerido:
{
  "preguntas": [
    { "tipo": "...", "pregunta": "...", "opciones": [...], "respuesta": "..." }
  ]
}

Responde ÚNICAMENTE con el JSON.`

  const texto = await callClaude(prompt, 'claude-sonnet-4-20250514', 2000)
  const result = extractJSON(texto) as { preguntas: unknown[] }

  if (!result.preguntas || !Array.isArray(result.preguntas)) {
    throw new Error('Invalid response format')
  }

  return result.preguntas
}

async function validateResource(preguntas: unknown[], pda: PDATarget, metodologia: string): Promise<{ factual: number; methodo: number }> {
  const json = JSON.stringify(preguntas, null, 2)

  const [factualText, methodoText] = await Promise.all([
    callClaude(
      `Évalue factuellement ces exercices de ${pda.materia} (${pda.grado}). Score 0-10. JSON: {"score": N, "feedback": "..."}\n\nExercices:\n${json}\n\nRéponds UNIQUEMENT avec le JSON.`,
      'claude-haiku-4-5-20251001',
      300,
    ),
    callClaude(
      `Évalue si ces exercices respectent la méthodologie "${metodologia}". Score 0-10. JSON: {"score": N, "feedback": "..."}\n\nExercices:\n${json}\n\nRéponds UNIQUEMENT avec le JSON.`,
      'claude-haiku-4-5-20251001',
      300,
    ),
  ])

  try {
    const f = extractJSON(factualText) as { score: number }
    const m = extractJSON(methodoText) as { score: number }
    return { factual: f.score ?? 5, methodo: m.score ?? 5 }
  } catch {
    return { factual: 5, methodo: 5 }
  }
}

// --- Main ---

async function main() {
  // Load PDAs from args or use sample
  const samplePDAs: PDATarget[] = [
    {
      materia: 'Matemáticas',
      grado: '1° Secundaria',
      pda: 'Usa diversas estrategias al convertir números fraccionarios a decimales y viceversa.',
      contenido: 'Expresión de fracciones como decimales y de decimales como fracciones.',
      tema: 'Fracciones y decimales',
    },
    {
      materia: 'Matemáticas',
      grado: '1° Secundaria',
      pda: 'Resuelve problemas de suma y resta con números enteros, fracciones y decimales positivos y negativos.',
      contenido: 'Problemas de suma y resta con números enteros, fracciones y decimales.',
      tema: 'Operaciones con fracciones',
    },
    {
      materia: 'Matemáticas',
      grado: '2° Secundaria',
      pda: 'Resuelve problemas que implican el uso de ecuaciones de primer grado.',
      contenido: 'Ecuaciones de primer grado con una incógnita.',
      tema: 'Ecuaciones lineales',
    },
  ]

  console.log(`🚀 Generating library content for ${samplePDAs.length} PDAs × ${METODOLOGIAS.length} methodologies`)
  console.log(`   = ${samplePDAs.length * METODOLOGIAS.length * RECURSOS_POR_PDA} total resources\n`)

  let generated = 0
  let errors = 0

  for (const pda of samplePDAs) {
    for (const metodologia of METODOLOGIAS) {
      for (let i = 0; i < RECURSOS_POR_PDA; i++) {
        const dificultad = DIFICULTADES[i % DIFICULTADES.length]

        try {
          console.log(`  Generating: ${pda.tema} / ${metodologia} / ${dificultad}...`)

          const preguntas = await generateResource(pda, metodologia, dificultad)
          const scores = await validateResource(preguntas, pda, metodologia)

          const { error } = await supabase.from('biblioteca').insert({
            materia: pda.materia,
            grado: pda.grado,
            pda: pda.pda,
            contenido_pda: pda.contenido ?? null,
            tema: pda.tema ?? null,
            metodologia,
            dificultad,
            tipo_recurso: 'ejercicio',
            preguntas,
            numero_preguntas: preguntas.length,
            validacion_factual: scores.factual,
            validacion_metodologica: scores.methodo,
            aprobado: scores.factual >= 6 && scores.methodo >= 6,
          })

          if (error) {
            console.error(`    ❌ DB error: ${error.message}`)
            errors++
          } else {
            generated++
            console.log(`    ✅ Saved (factual: ${scores.factual}, methodo: ${scores.methodo})`)
          }

          // Rate limiting: 1s between generations
          await new Promise((r) => setTimeout(r, 1000))
        } catch (err) {
          console.error(`    ❌ Error: ${err instanceof Error ? err.message : err}`)
          errors++
        }
      }
    }
  }

  console.log(`\n✅ Done. Generated: ${generated}, Errors: ${errors}`)
}

main()
