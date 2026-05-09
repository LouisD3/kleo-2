/**
 * seed-biblioteca.ts — Generate full content library for Matematicas 1° Secundaria
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/seed-biblioteca.ts
 *
 * Generates 5 content types per week (36 weeks):
 *   - evaluacion (exercise questions)
 *   - orientacion (teacher guide)
 *   - libro (student content)
 *   - diapositiva (slides)
 *   - video_script (video lesson script)
 *
 * Output: src/content/biblioteca/matematicas-1.json
 */

import fs from 'node:fs'
import path from 'node:path'

const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY env var')
  process.exit(1)
}

const OUTPUT_PATH = path.join(import.meta.dirname, '../src/content/biblioteca/matematicas-1.json')
const MODEL_SONNET = 'claude-sonnet-4-20250514'
const MODEL_HAIKU = 'claude-haiku-4-5-20251001'

// --- PDAs: 36 weeks of Matematicas 1° Secundaria ---

const PDAS = [
  { secuencia: 1, contenido: 'Expresion de fracciones como decimales y de decimales como fracciones.', titulo: 'Fracciones y decimales', pda: 'Usa diversas estrategias al convertir numeros fraccionarios a decimales y viceversa.' },
  { secuencia: 2, contenido: 'Extension de los numeros a positivos y negativos y su orden.', titulo: 'Los enteros negativos', pda: 'Reconoce la necesidad de los numeros negativos a partir de usar cantidades que tienen al cero como referencia.' },
  { secuencia: 3, contenido: 'Extension de los numeros a positivos y negativos y su orden.', titulo: 'Comparacion de numeros negativos y positivos', pda: 'Compara y ordena numeros con signo (enteros, fracciones y decimales) en la recta numerica y analiza en que casos se cumple la propiedad de densidad.' },
  { secuencia: 4, contenido: 'Extension de los numeros a positivos y negativos y su orden.', titulo: 'Densidad del orden: racionales vs. enteros', pda: 'Compara y ordena numeros con signo (enteros, fracciones y decimales) en la recta numerica y analiza en que casos se cumple la propiedad de densidad.' },
  { secuencia: 5, contenido: 'Extension del significado de las operaciones y sus relaciones inversas.', titulo: 'Suma y resta', pda: 'Reconoce el significado de las cuatro operaciones basicas y sus relaciones inversas al resolver problemas que impliquen el uso de numeros con signo.' },
  { secuencia: 6, contenido: 'Extension del significado de las operaciones y sus relaciones inversas.', titulo: 'Multiplicacion y division', pda: 'Reconoce el significado de las cuatro operaciones basicas y sus relaciones inversas al resolver problemas que impliquen el uso de numeros con signo.' },
  { secuencia: 7, contenido: 'Extension del significado de las operaciones y sus relaciones inversas.', titulo: 'Propiedad conmutativa y asociativa', pda: 'Comprueba y argumenta cual de las cuatro operaciones basicas cumple las propiedades: conmutativa, asociativa y distributiva.' },
  { secuencia: 8, contenido: 'Extension del significado de las operaciones y sus relaciones inversas.', titulo: 'Propiedad distributiva', pda: 'Identifica y aplica la jerarquia de operaciones y simbolos de agrupacion al realizar calculos.' },
  { secuencia: 9, contenido: 'Regularidades y Patrones.', titulo: 'Sucesiones con progresion aritmetica', pda: 'Representa algebraicamente una sucesion con progresion aritmetica de figuras y numeros.' },
  { secuencia: 10, contenido: 'Introduccion al algebra.', titulo: 'Introduccion al algebra', pda: 'Interpreta y plantea diversas situaciones del lenguaje comun al lenguaje algebraico y viceversa.' },
  { secuencia: 11, contenido: 'Introduccion al algebra.', titulo: 'Perimetros', pda: 'Representa algebraicamente perimetros de figuras.' },
  { secuencia: 12, contenido: 'Ecuaciones lineales y cuadraticas.', titulo: 'Ecuaciones lineales', pda: 'Resuelve ecuaciones de la forma Ax+B=Cx+D con el uso de las propiedades de la igualdad. Modela y resuelve problemas cuyo planteamiento es una ecuacion lineal.' },
  { secuencia: 13, contenido: 'Ecuaciones lineales y cuadraticas.', titulo: 'Porcentajes', pda: 'Resuelve problemas de porcentajes en diversas situaciones.' },
  { secuencia: 14, contenido: 'Funciones.', titulo: 'Relaciones proporcionales', pda: 'Relaciona e interpreta relaciones proporcional y no proporcional a partir de su representacion tabular, grafica y con diagramas.' },
  { secuencia: 15, contenido: 'Funciones.', titulo: 'Formula de proporcionalidad', pda: 'Modela y resuelve diversas situaciones a traves de ecuaciones proporcionales con constante positiva y negativa.' },
  { secuencia: 16, contenido: 'Rectas y angulos.', titulo: 'Rectas', pda: 'Explora las figuras basicas como rectas y angulos y su notacion.' },
  { secuencia: 17, contenido: 'Rectas y angulos.', titulo: 'Angulos', pda: 'Encuentra y calcula los angulos que se forman al intersecar dos segmentos.' },
  { secuencia: 18, contenido: 'Construccion y propiedades de las figuras planas y cuerpos.', titulo: 'Punto medio y mediatriz', pda: 'Utiliza la regla y el compas para trazar: punto medio, mediatriz de un segmento, segmentos y angulos congruentes, bisectriz de un angulo, rectas perpendiculares y rectas paralelas.' },
  { secuencia: 19, contenido: 'Construccion y propiedades de las figuras planas y cuerpos.', titulo: 'Bisectriz y angulos congruentes', pda: 'Utiliza la regla y el compas para trazar: punto medio, mediatriz de un segmento, segmentos y angulos congruentes, bisectriz de un angulo, rectas perpendiculares y rectas paralelas.' },
  { secuencia: 20, contenido: 'Construccion y propiedades de las figuras planas y cuerpos.', titulo: 'Rectas notables', pda: 'Identifica y traza las rectas notables en triangulos y cuadrilateros a partir del analisis de distinta informacion.' },
  { secuencia: 21, contenido: 'Construccion y propiedades de las figuras planas y cuerpos.', titulo: 'Tipos de triangulos y cuadrilateros', pda: 'Identifica y traza las rectas notables en triangulos y cuadrilateros a partir del analisis de distinta informacion.' },
  { secuencia: 22, contenido: 'Circunferencia, circulo y esfera.', titulo: 'Las rectas notables en el circulo', pda: 'Identifica y traza las rectas notables en la circunferencia y las relaciones entre ellas.' },
  { secuencia: 23, contenido: 'Circunferencia, circulo y esfera.', titulo: 'Figuras relacionadas con el circulo', pda: 'Investiga figuras relacionadas con circulos y propiedades de los circulos.' },
  { secuencia: 24, contenido: 'Circunferencia, circulo y esfera.', titulo: 'Partes del circulo', pda: 'Construye circunferencias a partir de distinta informacion. Verifica los criterios de existencia y unicidad de estas figuras.' },
  { secuencia: 25, contenido: 'Medicion y calculo en diferentes contextos.', titulo: 'Distancia entre dos puntos', pda: 'Introduce la idea de distancia entre dos puntos como la longitud del segmento que los une.' },
  { secuencia: 26, contenido: 'Medicion y calculo en diferentes contextos.', titulo: 'Distancia de un punto a una recta', pda: 'Encuentra la distancia de un punto a una recta y la distancia entre dos rectas paralelas.' },
  { secuencia: 27, contenido: 'Medicion y calculo en diferentes contextos.', titulo: 'Desigualdad triangular', pda: 'Explora la desigualdad del triangulo.' },
  { secuencia: 28, contenido: 'Medicion y calculo en diferentes contextos.', titulo: 'Perimetro y area', pda: 'Obtiene y aplica formulas o usa otras estrategias para calcular el perimetro y el area de poligonos regulares e irregulares y del circulo.' },
  { secuencia: 29, contenido: 'Obtencion y representacion de informacion.', titulo: 'Analisis estadistico', pda: 'Usa tablas, graficas de barras y circulares para el analisis de informacion.' },
  { secuencia: 30, contenido: 'Interpretacion de la informacion a traves de medidas de tendencia central y de dispersion.', titulo: 'Frecuencia absoluta y relativa', pda: 'Determina e interpreta la frecuencia absoluta, la frecuencia relativa, la media, la mediana y la moda en un conjunto de datos.' },
  { secuencia: 31, contenido: 'Interpretacion de la informacion a traves de medidas de tendencia central y de dispersion.', titulo: 'Medidas de tendencia central y rango', pda: 'Usa e interpreta las medidas de tendencia central (moda, media aritmetica y mediana) y el rango de un conjunto de datos, y justifica con base en ellas sus decisiones.' },
  { secuencia: 32, contenido: 'Azar y probabilidad.', titulo: 'Probabilidades', pda: 'Compara cualitativamente dos o mas eventos a partir de sus resultados posibles, usa relaciones como: "es mas probable que...", "es menos probable que...".' },
  { secuencia: 33, contenido: 'Azar y probabilidad.', titulo: 'Eventos aleatorios', pda: 'Identifica eventos en los que interviene el azar, determina el espacio muestral y experimenta. Identifica diversos procedimientos de conteo y resuelve problemas.' },
  { secuencia: 34, contenido: 'Razonamiento logico.', titulo: 'Conjuncion y disyuncion', pda: 'Utiliza la logica simbolica para formalizar razonamientos que involucren conjunciones, disyunciones y negaciones.' },
  { secuencia: 35, contenido: 'Razonamiento logico.', titulo: 'Condicionales y bicondicionales', pda: 'Utiliza la logica simbolica para formalizar razonamientos con condicionales y bicondicionales.' },
  { secuencia: 36, contenido: 'Numeros binarios.', titulo: 'Numeros binarios', pda: 'Conoce los numeros binarios, aprende a convertir numeros decimales a binarios y viceversa. Identifica las diferencias entre el sistema de numeracion decimal y el sistema de numeracion binario.' },
]

// --- API helpers ---

async function callClaude(prompt: string, model: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

function extractJSON(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) {
    const arrMatch = text.match(/\[[\s\S]*\]/)
    if (!arrMatch) throw new Error('No JSON found in response')
    return JSON.parse(arrMatch[0])
  }
  return JSON.parse(match[0])
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// --- Content generators ---

interface PDA {
  secuencia: number
  contenido: string
  titulo: string
  pda: string
}

async function generateEvaluacion(pda: PDA): Promise<unknown> {
  const prompt = `Tu es un expert en pedagogie mexicaine. Genere un exercice scolaire de 5 questions pour des eleves de 1° Secundaria au Mexique.

Matiere: Matematicas
Niveau: 1° Secundaria
Theme: ${pda.titulo}
Contenu curriculaire: ${pda.contenido}
PDA (objectif d'apprentissage): ${pda.pda}

Types de questions a inclure (repartis equitablement): opcion_multiple, verdadero_falso, abierta, espacios, calculo

Regles:
- "opcion_multiple": exactement 4 options (A, B, C, D), "respuesta" = la lettre correcte
- "verdadero_falso": "respuesta" = true ou false
- "espacios": un ___ dans la question, "respuesta" = le mot/nombre correct
- "abierta": "respuesta" = reponse modele
- "calculo": "respuesta" = resolution pas a pas
- Tout en espagnol mexicain
- Questions alignees avec le PDA

JSON requis:
{
  "preguntas": [
    { "tipo": "...", "pregunta": "...", "opciones": [...], "respuesta": "..." }
  ]
}

Reponds UNIQUEMENT avec le JSON.`

  const text = await callClaude(prompt, MODEL_SONNET, 2000)
  const result = extractJSON(text) as { preguntas: unknown[] }
  if (!result.preguntas || !Array.isArray(result.preguntas)) throw new Error('Invalid evaluacion format')
  return result
}

async function generateOrientacion(pda: PDA): Promise<string> {
  const prompt = `Tu es un expert en pedagogie mexicaine. Genere un guide didactique pour un enseignant de Matematicas en 1° Secundaria au Mexique.

Theme: ${pda.titulo}
Contenu curriculaire: ${pda.contenido}
PDA: ${pda.pda}

Le guide doit inclure (en espagnol mexicain):
1. Objetivos de aprendizaje (2-3 objectifs clairs)
2. Materiales necesarios
3. Desarrollo de la sesion (45 min, etape par etape)
4. Errores frecuentes de los alumnos y como remediarlos
5. Estrategias de diferenciacion (eleves en difficulte / avances)
6. Evaluacion formativa (comment verifier la comprehension)

Format: texte structure avec des titres markdown (## et ###). Environ 400-500 mots.
Ecris DIRECTEMENT le contenu en espagnol mexicain, pas de bloc de code.`

  return await callClaude(prompt, MODEL_SONNET, 1500)
}

async function generateLibro(pda: PDA): Promise<string> {
  const prompt = `Tu es un expert en pedagogie mexicaine. Genere du contenu pedagogique pour des eleves de 1° Secundaria au Mexique.

Theme: ${pda.titulo}
Contenu curriculaire: ${pda.contenido}
PDA: ${pda.pda}

Le contenu doit inclure (en espagnol mexicain):
1. Introduccion motivante (pourquoi ce theme est utile/interessant)
2. Explicacion claire des concepts (adapte au niveau)
3. 2-3 exemples resolus pas a pas
4. Datos curiosos ou applications au quotidien
5. Puntos clave para recordar (resume)

Format: texte structure avec des titres markdown (## et ###). Environ 500-600 mots.
Ton: accessible, motivant, comme si tu parlais directement a l'eleve (tutoiement mexicain "tu").
Ecris DIRECTEMENT le contenu en espagnol mexicain, pas de bloc de code.`

  return await callClaude(prompt, MODEL_SONNET, 2000)
}

async function generateDiapositiva(pda: PDA): Promise<unknown> {
  const prompt = `Tu es un expert en pedagogie mexicaine. Genere un jeu de 8 diapositives pour un cours de Matematicas en 1° Secundaria au Mexique.

Theme: ${pda.titulo}
Contenu curriculaire: ${pda.contenido}
PDA: ${pda.pda}

Chaque diapositive doit avoir:
- titulo: titre court et clair
- puntos: 3-4 points cles (phrases courtes)
- ejemplo: un exemple concret ou une illustration decrite (optionnel, mais recommande)

Structure suggeree:
1. Titre + objectif du cours
2-3. Concepts principaux
4-5. Exemples resolus
6. Erreurs courantes
7. Exercice guide
8. Resume et points cles

JSON requis (en espagnol mexicain):
[
  { "titulo": "...", "puntos": ["...", "..."], "ejemplo": "..." }
]

Reponds UNIQUEMENT avec le JSON (un array).`

  const text = await callClaude(prompt, MODEL_SONNET, 2500)
  const result = extractJSON(text)
  if (!Array.isArray(result)) throw new Error('Invalid diapositiva format')
  return result
}

async function generateVideoScript(pda: PDA): Promise<string> {
  const prompt = `Tu es un expert en pedagogie mexicaine. Genere un script de video-lecon de 5-7 minutes pour des eleves de 1° Secundaria au Mexique.

Theme: ${pda.titulo}
Contenu curriculaire: ${pda.contenido}
PDA: ${pda.pda}

Structure du script:
1. Accroche (30s) - question ou situation intrigante
2. Explication des concepts (2-3 min) - progression claire
3. Exemples resolus (2 min) - 2 exemples concrets
4. Recapitulatif (30s) - points cles a retenir

Format:
- Ecris le texte que le presentateur doit dire
- Ajoute des indications visuelles entre crochets: [VISUAL: description]
- Ton: dynamique, proche, tutoiement mexicain
- Environ 600-800 mots

Ecris DIRECTEMENT le script en espagnol mexicain, pas de bloc de code.`

  return await callClaude(prompt, MODEL_SONNET, 2500)
}

// --- Main ---

async function main() {
  // Load existing content to resume if interrupted
  let existing: Array<Record<string, unknown>> = []
  try {
    const raw = fs.readFileSync(OUTPUT_PATH, 'utf-8')
    existing = JSON.parse(raw)
    if (!Array.isArray(existing)) existing = []
  } catch {
    existing = []
  }

  const existingSet = new Set(existing.map((e) => e.secuencia))
  const toGenerate = PDAS.filter((p) => !existingSet.has(p.secuencia))

  if (toGenerate.length === 0) {
    console.log('All 36 weeks already generated. Nothing to do.')
    return
  }

  console.log(`Generating content for ${toGenerate.length} weeks (${existing.length} already done)...\n`)

  const results = [...existing]

  for (const pda of toGenerate) {
    console.log(`  Semana ${pda.secuencia}/${PDAS.length}: ${pda.titulo}`)

    try {
      // Generate all 5 content types sequentially to avoid rate limits
      console.log('    -> Evaluacion...')
      const evaluacion = await generateEvaluacion(pda)
      await delay(500)

      console.log('    -> Orientacion didactica...')
      const orientacion = await generateOrientacion(pda)
      await delay(500)

      console.log('    -> Libro del alumno...')
      const libro = await generateLibro(pda)
      await delay(500)

      console.log('    -> Diapositivas...')
      const diapositiva = await generateDiapositiva(pda)
      await delay(500)

      console.log('    -> Video script...')
      const video_script = await generateVideoScript(pda)

      results.push({
        secuencia: pda.secuencia,
        titulo: pda.titulo,
        contenido: pda.contenido,
        pda: pda.pda,
        evaluacion,
        orientacion,
        libro,
        diapositiva,
        video_script,
      })

      // Save after each week (resume-safe)
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))
      console.log(`    OK (saved)\n`)

      // Rate limit between weeks
      await delay(1000)
    } catch (err) {
      console.error(`    ERROR: ${err instanceof Error ? err.message : err}\n`)
      // Save progress and continue
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))
    }
  }

  // Sort by secuencia
  results.sort((a, b) => (a.secuencia as number) - (b.secuencia as number))
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))

  console.log(`\nDone! ${results.length}/36 weeks generated.`)
  console.log(`Output: ${OUTPUT_PATH}`)
}

main()
