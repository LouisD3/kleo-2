import { type NextRequest, NextResponse } from 'next/server'
import {
  type CorregirPayload,
  corregirResponseSchema,
  type DiagnosticarPayload,
  diagnosticarResponseSchema,
  type GenerarPayload,
  type GenerarPlanPayload,
  type GenerarProyectoPayload,
  generarResponseSchema,
  planResponseSchema,
  proyectoResponseSchema,
  type ModificarPayload,
  requestBodySchema,
} from '@/lib/schemas'

// --- Helper: appeler Claude avec options ---

interface CallClaudeOptions {
  apiKey: string
  model: string
  maxTokens: number
  messages: Array<{
    role: string
    content: string | Array<{ type: string; text: string; cache_control?: { type: string } }>
  }>
  signal?: AbortSignal
}

async function callClaude({
  apiKey,
  model,
  maxTokens,
  messages,
  signal,
}: CallClaudeOptions): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages }),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Anthropic ${response.status}: ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()
  const content = data?.content as Array<{ text?: string }> | undefined
  return content?.[0]?.text ?? ''
}

function extractJSON(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found in response')
  return JSON.parse(match[0])
}

// --- Pipeline multi-passes pour génération ---

interface PipelineScores {
  factual: number
  methodologique: number
  feedback_factual: string
  feedback_methodo: string
}

async function pipelineGenerar(payload: GenerarPayload, apiKey: string): Promise<unknown> {
  const startTime = Date.now()
  const TIMEOUT_MS = 30000

  // Passe 1 — Génération (Sonnet)
  const promptGen = promptGenerar(payload)
  const textoGen = await callClaude({
    apiKey,
    model: 'claude-sonnet-4-20250514',
    maxTokens: 2000,
    messages: [{ role: 'user', content: promptGen }],
  })
  const generado = extractJSON(textoGen)

  // Vérifier timeout — fallback 1 passe si > 30s
  if (Date.now() - startTime > TIMEOUT_MS) {
    console.log('[Pipeline] Timeout after pass 1, returning single-pass result')
    return generado
  }

  // Passes 2 & 3 — Validation factuelle + Critique méthodologique (en parallèle, Haiku)
  const exercicesJSON = JSON.stringify(generado, null, 2)

  const promptFactuel = buildPromptValidationFactuelle(exercicesJSON, payload)
  const promptMethodo = buildPromptCritiqueMethodologique(exercicesJSON, payload)

  const [textoFactuel, textoMethodo] = await Promise.all([
    callClaude({
      apiKey,
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 500,
      messages: [{ role: 'user', content: promptFactuel }],
    }),
    callClaude({
      apiKey,
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 500,
      messages: [{ role: 'user', content: promptMethodo }],
    }),
  ])

  let scores: PipelineScores
  try {
    const factuelData = extractJSON(textoFactuel) as { score: number; feedback: string }
    const methodoData = extractJSON(textoMethodo) as { score: number; feedback: string }
    scores = {
      factual: factuelData.score ?? 10,
      methodologique: methodoData.score ?? 10,
      feedback_factual: factuelData.feedback ?? '',
      feedback_methodo: methodoData.feedback ?? '',
    }
  } catch {
    // Si parsing échoue, on renvoie le résultat de passe 1
    console.log('[Pipeline] Failed to parse validation scores, returning pass 1')
    return generado
  }

  console.log(`[Pipeline] Scores — factual: ${scores.factual}, methodo: ${scores.methodologique}`)

  // Si les deux scores >= 7, on est bon
  if (scores.factual >= 7 && scores.methodologique >= 7) {
    return generado
  }

  // Vérifier timeout avant passe 4
  if (Date.now() - startTime > TIMEOUT_MS) {
    console.log('[Pipeline] Timeout before pass 4, returning pass 1')
    return generado
  }

  // Passe 4 — Refinement (Sonnet, avec feedback)
  const promptRefine = buildPromptRefinement(exercicesJSON, scores, payload)
  const textoRefine = await callClaude({
    apiKey,
    model: 'claude-sonnet-4-20250514',
    maxTokens: 2000,
    messages: [{ role: 'user', content: promptRefine }],
  })

  try {
    return extractJSON(textoRefine)
  } catch {
    // Si le refinement échoue, renvoyer la passe 1
    return generado
  }
}

function buildPromptValidationFactuelle(exercicesJSON: string, payload: GenerarPayload): string {
  return `Tu es un vérificateur factuel expert. Évalue les exercices suivants générés pour un cours de ${payload.materia} (niveau ${payload.dificultad}).

Exercices à vérifier :
${exercicesJSON}

Critères d'évaluation :
1. Chaque question est-elle factuellement correcte ?
2. Chaque réponse fournie est-elle la bonne réponse ?
3. Les options de QCM sont-elles plausibles sans être ambiguës ?
4. Les calculs dans les réponses sont-ils exacts ?

Attribue un score global de 0 à 10 et un feedback concis en cas de problème.

Format JSON OBLIGATOIRE :
{
  "score": 8,
  "feedback": "Question 3 : la réponse indiquée (B) est incorrecte, la bonne réponse est C car..."
}

Si tout est correct :
{
  "score": 10,
  "feedback": ""
}

Réponds UNIQUEMENT avec le JSON.`
}

function buildPromptCritiqueMethodologique(exercicesJSON: string, payload: GenerarPayload): string {
  const instruccionMetodologia: Record<string, string> = {
    Feynman:
      "L'élève doit expliquer le concept avec ses propres mots, comme à quelqu'un qui ne connaît rien du sujet.",
    'Memorización activa':
      'Rappel direct : définitions, dates, noms, formules ou faits concrets à restituer de mémoire.',
    'Resolución de problemas':
      'Situations pratiques avec contexte réel, étapes intermédiaires et processus de raisonnement visibles.',
    'Práctica directa':
      'Exercices directs, courts, sans contexte narratif. Pas de scénarios ni personnages.',
  }

  const descMethodo = instruccionMetodologia[payload.metodologia] ?? payload.metodologia

  return `Tu es un expert en méthodologies pédagogiques. Évalue si les exercices suivants respectent la méthodologie "${payload.metodologia}".

Description de la méthodologie : ${descMethodo}

Exercices à évaluer :
${exercicesJSON}

Critères :
1. Chaque question est-elle cohérente avec la méthodologie indiquée ?
2. Le niveau de difficulté correspond-il à "${payload.dificultad}" ?
3. Les types de questions sont-ils appropriés pour cette méthodologie ?

Attribue un score global de 0 à 10 et un feedback concis.

Format JSON OBLIGATOIRE :
{
  "score": 7,
  "feedback": "Les questions 2 et 4 sont trop narratives pour une méthodologie Práctica directa..."
}

Réponds UNIQUEMENT avec le JSON.`
}

function buildPromptRefinement(
  exercicesJSON: string,
  scores: PipelineScores,
  payload: GenerarPayload,
): string {
  let feedbackSection = ''
  if (scores.factual < 7) {
    feedbackSection += `\nProblèmes factuels (score ${scores.factual}/10) :\n${scores.feedback_factual}\n`
  }
  if (scores.methodologique < 7) {
    feedbackSection += `\nProblèmes méthodologiques (score ${scores.methodologique}/10) :\n${scores.feedback_methodo}\n`
  }

  // On reprend le prompt original de génération et on ajoute le contexte de correction
  const promptOriginal = promptGenerar(payload)

  return `${promptOriginal}

--- CONTEXTE DE CORRECTION ---
Les exercices précédemment générés ont reçu des retours négatifs. Voici les exercices rejetés :

${exercicesJSON}

Retours des validateurs :
${feedbackSection}

INSTRUCTION : Régénère les exercices en corrigeant TOUS les problèmes signalés. Le format de sortie reste identique (JSON avec "preguntas"). Ne reproduis PAS les mêmes erreurs.`
}

// --- Route principale ---

export async function POST(request: NextRequest) {
  // 1. Valider le body avec Zod
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'El cuerpo de la solicitud no es JSON válido.' },
      { status: 400 },
    )
  }

  const parsed = requestBodySchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return NextResponse.json(
      { error: `Datos inválidos: ${firstError?.path.join('.')} — ${firstError?.message}` },
      { status: 400 },
    )
  }

  const { type, payload } = parsed.data

  // 2. Vérifier la clé API
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'La clave de API no está configurada en el servidor.' },
      { status: 500 },
    )
  }

  // 3. Dispatch par type
  try {
    if (type === 'generar') {
      // Pipeline multi-passes
      const datos = await pipelineGenerar(payload as GenerarPayload, ANTHROPIC_API_KEY)
      const validado = generarResponseSchema.safeParse(datos)
      if (!validado.success) {
        console.error('Respuesta de IA con formato inválido:', validado.error.issues)
        return NextResponse.json(datos)
      }
      return NextResponse.json(validado.data)
    }

    // Proyecto / Plan — appel simple avec schéma dédié
    if (type === 'generar_proyecto' || type === 'generar_plan') {
      const prompt =
        type === 'generar_proyecto'
          ? promptProyecto(payload as GenerarProyectoPayload)
          : promptPlan(payload as GenerarPlanPayload)
      const schema = type === 'generar_proyecto' ? proyectoResponseSchema : planResponseSchema

      const textoRespuesta = await callClaude({
        apiKey: ANTHROPIC_API_KEY,
        model: 'claude-sonnet-4-20250514',
        maxTokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      })

      const datos = extractJSON(textoRespuesta)
      const validado = schema.safeParse(datos)
      if (!validado.success) {
        console.error('Respuesta de IA con formato inválido:', validado.error.issues)
        return NextResponse.json(datos)
      }
      return NextResponse.json(validado.data)
    }

    // Autres types — appel simple
    let prompt: string
    let model = 'claude-sonnet-4-20250514'
    let maxTokens = 2000

    if (type === 'modificar') {
      prompt = promptModificar(payload as ModificarPayload)
    } else if (type === 'diagnosticar_y_remediar') {
      prompt = promptDiagnosticar(payload as DiagnosticarPayload)
      model = 'claude-haiku-4-5-20251001'
      maxTokens = 1000
    } else {
      prompt = promptCorregir(payload as CorregirPayload)
    }

    const textoRespuesta = await callClaude({
      apiKey: ANTHROPIC_API_KEY,
      model,
      maxTokens,
      messages: [{ role: 'user', content: prompt }],
    })

    const datos = extractJSON(textoRespuesta)
    const responseSchema =
      type === 'corregir'
        ? corregirResponseSchema
        : type === 'diagnosticar_y_remediar'
          ? diagnosticarResponseSchema
          : generarResponseSchema
    const validado = responseSchema.safeParse(datos)

    if (!validado.success) {
      console.error('Respuesta de IA con formato inválido:', validado.error.issues)
      return NextResponse.json(datos)
    }

    return NextResponse.json(validado.data)
  } catch (err) {
    console.error('Error en llamada IA:', err)
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('Anthropic')) {
      return NextResponse.json(
        { error: 'El servicio de IA no está disponible en este momento. Intenta de nuevo.' },
        { status: 502 },
      )
    }
    return NextResponse.json(
      { error: 'Hubo un error al procesar la respuesta de la IA. Intenta de nuevo.' },
      { status: 500 },
    )
  }
}

// --- Prompt builders ---

interface PdaItem {
  pda: string
  contenido?: string
}

function promptGenerar({
  materia,
  dificultad,
  metodologia,
  tipos,
  numeroPreguntas,
  pda,
  instrucciones,
  idioma,
}: GenerarPayload): string {
  const instruccionMetodologia: Record<string, string> = {
    Feynman:
      'Las preguntas deben pedirle al alumno que explique el concepto con sus propias palabras, como si se lo explicara a alguien que no sabe nada del tema. Fomenta la comprensión profunda, no la memorización.',
    'Memorización activa':
      'Las preguntas deben ser de rappel directo: definiciones exactas, fechas, nombres, fórmulas o hechos concretos que el alumno debe restituir de memoria.',
    'Resolución de problemas':
      'Las preguntas deben plantear situaciones prácticas con contexto real. El alumno debe mostrar sus pasos intermedios y el proceso de razonamiento, no solo el resultado final.',
    'Práctica directa':
      'Genera ejercicios directos, cortos y sin contexto narrativo. Sin escenarios, sin historias, sin personajes. Solo la operación, el ejercicio o la pregunta puntual que el alumno debe resolver. Ejemplo para matemáticas: "3/4 + 1/2 = ___" en vez de "Don Pepe tiene una panadería y necesita calcular…".',
  }

  const instruccionMet =
    instruccionMetodologia[metodologia] ??
    'Genera preguntas claras y apropiadas para el nivel indicado.'

  const tiposEfectivos = tipos.includes('Ejercicio mixto')
    ? ['opcion_multiple', 'verdadero_falso', 'abierta', 'espacios', 'calculo']
    : tipos.map((t) => mapTipo(t)).filter(Boolean)

  const tiposStr = tiposEfectivos.join(', ')

  const pdas: PdaItem[] = Array.isArray(pda) ? pda : pda ? [pda] : []
  const pdaLinea =
    pdas.length > 0
      ? '\n' +
        pdas
          .map(
            (p, i) =>
              `PDA ${pdas.length > 1 ? `${i + 1}` : ''}: ${p.pda}${p.contenido ? ` | Contenido curricular: ${p.contenido}` : ''}`,
          )
          .join('\n') +
        `\nLas preguntas deben estar directamente alineadas con ${pdas.length > 1 ? 'estos PDAs' : 'este PDA'} del programa NEM.${pdas.length > 1 ? ' Distribuye las preguntas equitativamente entre los PDAs indicados.' : ''}`
      : ''

  return `Eres un experto en pedagogía mexicana. Genera una tarea escolar con exactamente ${numeroPreguntas} preguntas.

Materia: ${materia}
Dificultad: ${dificultad}
Metodología pedagógica: ${metodologia}
Instrucción pedagógica específica: ${instruccionMet}
Tipos de ejercicios a incluir: ${tiposStr}${pdaLinea}${instrucciones ? `\nInstrucciones específicas del profesor: ${instrucciones}` : ''}

Reglas estrictas:
- Distribuye las preguntas equitativamente entre los tipos indicados.
- Para "opcion_multiple": incluye exactamente 4 opciones (A, B, C, D) y un campo "respuesta" con la letra correcta.
- Para "verdadero_falso": incluye un campo "respuesta" con valor booleano true o false.
- Para "espacios": la pregunta debe tener exactamente un ___ donde va la respuesta. Incluye "respuesta" con la palabra o frase correcta.
- Para "abierta": incluye un campo "respuesta" con una respuesta modelo completa y bien redactada que sirva de referencia al profesor para corregir.
- Para "calculo": incluye un campo "respuesta" con la resolución paso a paso y el resultado final.
- ${idioma === 'English' ? 'All questions, options, and answers MUST be written entirely in English. Use clear, age-appropriate language for secondary/high school students.' : 'Todo en español mexicano, lenguaje claro y apropiado para estudiantes de secundaria o preparatoria.'}
- El contenido debe ser coherente con la materia y la dificultad indicadas.

Formato de respuesta JSON requerido:
{
  "preguntas": [
    { "tipo": "opcion_multiple", "pregunta": "...", "opciones": ["A. ...", "B. ...", "C. ...", "D. ..."], "respuesta": "A" },
    { "tipo": "verdadero_falso", "pregunta": "...", "respuesta": true },
    { "tipo": "abierta", "pregunta": "...", "respuesta": "Respuesta modelo completa..." },
    { "tipo": "espacios", "pregunta": "La capital de México es ___.", "respuesta": "Ciudad de México" },
    { "tipo": "calculo", "pregunta": "...", "respuesta": "Paso 1: ... Paso 2: ... Resultado: ..." }
  ]
}

Responde ÚNICAMENTE con el JSON. Sin texto adicional, sin explicaciones, sin comillas de bloque de código.`
}

function promptCorregir({ tarea, respuestasAlumno }: CorregirPayload): string {
  const preguntasStr = tarea.preguntas
    .map((p, i) => {
      const respAlumno =
        (Array.isArray(respuestasAlumno) ? respuestasAlumno[i] : respuestasAlumno[String(i)]) ??
        '(sin respuesta)'
      let base = `Pregunta ${i + 1} (${p.tipo}): ${p.pregunta}\nRespuesta del alumno: ${respAlumno}`
      if (p.tipo === 'opcion_multiple') {
        base += `\nOpciones: ${p.opciones?.join(' | ')}\nRespuesta correcta: ${p.respuesta}`
      } else if (p.tipo === 'verdadero_falso') {
        base += `\nRespuesta correcta: ${p.respuesta ? 'Verdadero' : 'Falso'}`
      } else if (p.tipo === 'espacios') {
        base += `\nRespuesta correcta: ${p.respuesta}`
      } else if ((p.tipo === 'abierta' || p.tipo === 'calculo') && p.respuesta) {
        base += `\nRespuesta modelo: ${p.respuesta}`
      }
      return base
    })
    .join('\n\n')

  return `Eres un maestro mexicano experto. Corrige la siguiente tarea de un alumno.

Materia: ${tarea.materia}
Dificultad: ${tarea.dificultad}

${preguntasStr}

Instrucciones de corrección:
- Para "opcion_multiple", "verdadero_falso" y "espacios": compara directamente la respuesta del alumno con la correcta. Sé flexible con mayúsculas/minúsculas y acentos en "espacios".
- Para "abierta" y "calculo": evalúa semánticamente si el alumno demostró comprensión del concepto o aplicó el procedimiento correcto.
- La calificación DEBE ser estrictamente proporcional al porcentaje de respuestas correctas. Ejemplo: 1 de 3 correctas = 3.3, 2 de 5 correctas = 4, 0 correctas = 0. No seas generoso con la nota.
- Los comentarios deben ser constructivos, breves y en español mexicano.
- Las áreas de mejora deben ser conceptos o habilidades específicas (máximo 3).

Formato de respuesta JSON requerido:
{
  "calificacion": 7,
  "retroalimentacion": [
    { "indice_pregunta": 0, "correcta": true, "comentario": "Muy bien, identificaste correctamente..." },
    { "indice_pregunta": 1, "correcta": false, "comentario": "La respuesta correcta era... porque..." }
  ],
  "areas_de_mejora": ["Comprensión de ...", "Aplicación de ..."]
}

Responde ÚNICAMENTE con el JSON. Sin texto adicional, sin explicaciones, sin comillas de bloque de código.`
}

function promptModificar({ pregunta, instruccion, materia, dificultad }: ModificarPayload): string {
  const preguntaJSON = JSON.stringify(pregunta, null, 2)

  return `Eres un experto en pedagogía mexicana. Un profesor quiere modificar la siguiente pregunta de una tarea de ${materia} (dificultad: ${dificultad}).

Pregunta actual:
${preguntaJSON}

Instrucción del profesor: "${instruccion}"

Reglas:
- Modifica la pregunta según la instrucción del profesor.
- Conserva el mismo tipo de pregunta ("${pregunta.tipo}").
- Si es "opcion_multiple", mantén exactamente 4 opciones (A, B, C, D) y actualiza la respuesta correcta si necesario.
- Si es "verdadero_falso", mantén la respuesta como booleano (true/false).
- Si es "espacios", mantén el formato con ___ en la pregunta.
- Si es "abierta" o "calculo", actualiza la respuesta modelo si el contenido cambió.
- Conserva el idioma original de la pregunta (español o inglés).

Formato de respuesta JSON requerido:
{
  "preguntas": [
    { "tipo": "${pregunta.tipo}", "pregunta": "...", ... }
  ]
}

Responde ÚNICAMENTE con el JSON. Sin texto adicional, sin explicaciones, sin comillas de bloque de código.`
}

function promptDiagnosticar({
  aprendizaje,
  pregunta_original,
  respuesta_alumno,
  contexto_devoir,
  intento_remediation_n,
}: DiagnosticarPayload): string {
  const preguntaJSON = JSON.stringify(pregunta_original, null, 2)

  return `Eres un tutor IA experto en pedagogía. Un alumno mexicano (nivel secundaria) acaba de responder una pregunta. Debes:
1. Determinar si la respuesta es correcta.
2. Si es incorrecta, diagnosticar con precisión la laguna (en 1 frase).
3. Si es incorrecta Y intento_remediation_n < 2, generar UNA pregunta de remediación enfocada en la laguna detectada.

Contexto:
- Materia: ${contexto_devoir.materia}
- Dificultad: ${contexto_devoir.dificultad}
- Aprendizaje esperado: ${aprendizaje}
- Intento de remediación n°: ${intento_remediation_n}

Pregunta original:
${preguntaJSON}

Respuesta del alumno: "${respuesta_alumno}"

Reglas para la pregunta de remediación:
- Debe enfocarse EXACTAMENTE en la laguna detectada, no en el concepto general.
- Debe ser más sencilla que la pregunta original (scaffolding).
- Mismo formato de salida que las preguntas normales (tipo, pregunta, opciones si aplica, respuesta).
- El texto de la pregunta debe estar en español mexicano.
- Si intento_remediation_n >= 2, NO generar pregunta de remediación (el alumno pasará a la siguiente).

Para determinar si la respuesta es correcta:
- opcion_multiple: comparar la letra (A/B/C/D) con la respuesta.
- verdadero_falso: comparar "Verdadero"→true, "Falso"→false con la respuesta.
- espacios: comparación flexible (ignorar mayúsculas, acentos).
- abierta/calculo: evaluar semánticamente si el alumno demuestra comprensión.

Formato JSON de salida OBLIGATORIO:
{
  "es_correcta": false,
  "diagnostico": "El alumno confunde numerador y denominador al sumar fracciones.",
  "lacune_detectee": "Suma de fracciones con denominadores diferentes",
  "pregunta_remediation": { "tipo": "...", "pregunta": "...", "opciones": [...], "respuesta": "..." }
}

Si la respuesta es correcta:
{
  "es_correcta": true,
  "diagnostico": "Respuesta correcta."
}

Responde ÚNICAMENTE con el JSON. Sin texto adicional.`
}

function promptProyecto({
  materia,
  grado,
  dificultad,
  duracion,
  pda,
  instrucciones,
  idioma,
}: GenerarProyectoPayload): string {
  const pdas: PdaItem[] = Array.isArray(pda) ? pda : pda ? [pda] : []
  const pdaLinea =
    pdas.length > 0
      ? '\nPDAs del programa NEM:\n' +
        pdas.map((p, i) => `- PDA ${i + 1}: ${p.pda}${p.contenido ? ` | Contenido: ${p.contenido}` : ''}`).join('\n') +
        '\nEl proyecto debe estar directamente alineado con estos PDAs.'
      : ''

  return `Eres un experto en pedagogía mexicana y en la Nueva Escuela Mexicana (NEM). Genera un proyecto interdisciplinario para estudiantes.

Materia principal: ${materia}
Grado: ${grado}
Dificultad: ${dificultad}
Duración del proyecto: ${duracion}${pdaLinea}${instrucciones ? `\nInstrucciones del profesor: ${instrucciones}` : ''}

El proyecto debe seguir el enfoque de la NEM: aprendizaje situado, trabajo colaborativo y vinculación con la comunidad.

${idioma === 'English' ? 'Write everything in English.' : 'Todo en español mexicano.'}

Genera el proyecto con las siguientes secciones. Cada sección debe tener contenido rico y detallado en formato Markdown (usa listas, negritas, subtítulos donde sea apropiado).

Formato JSON OBLIGATORIO:
{
  "titulo": "Nombre del proyecto",
  "secciones": [
    { "titulo": "Objetivo general", "contenido": "..." },
    { "titulo": "Aprendizajes esperados", "contenido": "- Aprendizaje 1\\n- Aprendizaje 2\\n..." },
    { "titulo": "Descripción del proyecto", "contenido": "..." },
    { "titulo": "Etapas del proyecto", "contenido": "### Etapa 1: ...\\n...\\n### Etapa 2: ...\\n..." },
    { "titulo": "Materiales y recursos", "contenido": "- Material 1\\n- Material 2\\n..." },
    { "titulo": "Producto final", "contenido": "..." },
    { "titulo": "Rúbrica de evaluación", "contenido": "| Criterio | Excelente | Bueno | Suficiente |\\n|---|---|---|---|\\n..." },
    { "titulo": "Adecuaciones curriculares", "contenido": "..." }
  ]
}

Responde ÚNICAMENTE con el JSON. Sin texto adicional.`
}

function promptPlan({
  materia,
  grado,
  dificultad,
  duracion_clase,
  numero_sesiones,
  pda,
  instrucciones,
  idioma,
}: GenerarPlanPayload): string {
  const pdas: PdaItem[] = Array.isArray(pda) ? pda : pda ? [pda] : []
  const pdaLinea =
    pdas.length > 0
      ? '\nPDAs del programa NEM:\n' +
        pdas.map((p, i) => `- PDA ${i + 1}: ${p.pda}${p.contenido ? ` | Contenido: ${p.contenido}` : ''}`).join('\n') +
        '\nEl plan debe estar directamente alineado con estos PDAs.'
      : ''

  const sesionesStr = numero_sesiones > 1
    ? `Genera un plan para ${numero_sesiones} sesiones de ${duracion_clase} cada una.`
    : `Genera un plan para 1 sesión de ${duracion_clase}.`

  return `Eres un experto en pedagogía mexicana. Genera un plan de clase (secuencia didáctica) detallado.

Materia: ${materia}
Grado: ${grado}
Dificultad: ${dificultad}
${sesionesStr}${pdaLinea}${instrucciones ? `\nInstrucciones del profesor: ${instrucciones}` : ''}

${idioma === 'English' ? 'Write everything in English.' : 'Todo en español mexicano.'}

El plan debe seguir la estructura de secuencia didáctica (inicio, desarrollo, cierre) con tiempos estimados. Usa formato Markdown rico con listas, negritas y subtítulos.

Formato JSON OBLIGATORIO:
{
  "titulo": "Nombre del plan de clase",
  "secciones": [
    { "titulo": "Datos generales", "contenido": "**Materia:** ...\\n**Grado:** ...\\n**Duración:** ...\\n**Número de sesiones:** ..." },
    { "titulo": "Propósito de la sesión", "contenido": "..." },
    { "titulo": "Aprendizajes esperados", "contenido": "- Aprendizaje 1\\n- Aprendizaje 2\\n..." },
    { "titulo": "Inicio (${numero_sesiones > 1 ? 'por sesión' : 'tiempo estimado'})", "contenido": "### Activación de conocimientos previos\\n...\\n### Presentación del tema\\n..." },
    { "titulo": "Desarrollo", "contenido": "### Actividad 1\\n...\\n### Actividad 2\\n..." },
    { "titulo": "Cierre", "contenido": "### Síntesis\\n...\\n### Evaluación formativa\\n..." },
    { "titulo": "Materiales y recursos", "contenido": "- Material 1\\n- Material 2\\n..." },
    { "titulo": "Evaluación", "contenido": "..." },
    { "titulo": "Adecuaciones curriculares", "contenido": "..." }
  ]
}

Responde ÚNICAMENTE con el JSON. Sin texto adicional.`
}

function mapTipo(tipo: string): string | null {
  const mapa: Record<string, string> = {
    'Preguntas abiertas': 'abierta',
    'Opción múltiple': 'opcion_multiple',
    'Verdadero/Falso': 'verdadero_falso',
    'Completar espacios en blanco': 'espacios',
    'Cálculo/Resolución de problemas': 'calculo',
  }
  return mapa[tipo] ?? null
}
