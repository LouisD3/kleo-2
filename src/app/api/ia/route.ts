import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, payload } = body

  if (!type || !payload) {
    return NextResponse.json(
      { error: 'Faltan parámetros requeridos: type y payload.' },
      { status: 400 },
    )
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'La clave de API no está configurada en el servidor.' },
      { status: 500 },
    )
  }

  let prompt: string
  try {
    prompt = construirPrompt(type, payload)
  } catch {
    return NextResponse.json(
      { error: `Tipo de solicitud inválido: ${type}` },
      { status: 400 },
    )
  }

  let anthropicResponse: Record<string, unknown>
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error de Anthropic:', response.status, errorData)
      return NextResponse.json(
        { error: 'El servicio de IA no está disponible en este momento. Intenta de nuevo.' },
        { status: 502 },
      )
    }

    anthropicResponse = await response.json()
  } catch (err) {
    console.error('Error al conectar con Anthropic:', err)
    return NextResponse.json(
      { error: 'No se pudo conectar con el servicio de IA. Verifica tu conexión e intenta de nuevo.' },
      { status: 500 },
    )
  }

  const content = anthropicResponse?.content as Array<{ text?: string }> | undefined
  const textoRespuesta = content?.[0]?.text ?? ''

  try {
    const match = textoRespuesta.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No se encontró JSON en la respuesta')
    const datos = JSON.parse(match[0])
    return NextResponse.json(datos)
  } catch {
    console.error('Error al parsear respuesta de IA:', textoRespuesta)
    return NextResponse.json(
      { error: 'Hubo un error al procesar la respuesta de la IA. Intenta de nuevo.' },
      { status: 500 },
    )
  }
}

// --- Prompt builders (preserved from original) ---

interface PdaItem {
  pda: string
  contenido?: string
}

interface GenerarPayload {
  materia: string
  dificultad: string
  metodologia: string
  tipos: string[]
  numeroPreguntas: number
  pda?: PdaItem | PdaItem[]
  instrucciones?: string
}

interface Pregunta {
  tipo: string
  pregunta: string
  opciones?: string[]
  respuesta?: string | boolean
}

interface CorregirPayload {
  tarea: {
    materia: string
    dificultad: string
    preguntas: Pregunta[]
  }
  respuestasAlumno: (string | null)[]
}

function construirPrompt(type: string, payload: GenerarPayload | CorregirPayload): string {
  if (type === 'generar') return promptGenerar(payload as GenerarPayload)
  if (type === 'corregir') return promptCorregir(payload as CorregirPayload)
  throw new Error(`Tipo desconocido: ${type}`)
}

function promptGenerar({ materia, dificultad, metodologia, tipos, numeroPreguntas, pda, instrucciones }: GenerarPayload): string {
  const instruccionMetodologia: Record<string, string> = {
    Feynman:
      'Las preguntas deben pedirle al alumno que explique el concepto con sus propias palabras, como si se lo explicara a alguien que no sabe nada del tema. Fomenta la comprensión profunda, no la memorización.',
    'Memorización activa':
      'Las preguntas deben ser de rappel directo: definiciones exactas, fechas, nombres, fórmulas o hechos concretos que el alumno debe restituir de memoria.',
    'Resolución de problemas':
      'Las preguntas deben plantear situaciones prácticas con contexto real. El alumno debe mostrar sus pasos intermedios y el proceso de razonamiento, no solo el resultado final.',
  }

  const instruccionMet = instruccionMetodologia[metodologia] ?? 'Genera preguntas claras y apropiadas para el nivel indicado.'

  const tiposEfectivos =
    tipos.includes('Ejercicio mixto')
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
- Todo en español mexicano, lenguaje claro y apropiado para estudiantes de secundaria o preparatoria.
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
      const respAlumno = respuestasAlumno[i] ?? '(sin respuesta)'
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
- La calificación es sobre 10, basada en el porcentaje de respuestas correctas.
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
