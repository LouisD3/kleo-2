import { type NextRequest, NextResponse } from 'next/server'
import {
  type CorregirPayload,
  corregirResponseSchema,
  type GenerarCPAPayload,
  type GenerarPayload,
  generarCPAResponseSchema,
  generarResponseSchema,
  type ModificarPayload,
  requestBodySchema,
} from '@/lib/schemas'

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

  // 3. Construire le prompt
  let prompt: string
  let maxTokens = 4000
  if (type === 'generar') {
    prompt = promptGenerar(payload as GenerarPayload)
  } else if (type === 'generar_cpa') {
    prompt = promptGenerarCPA(payload as GenerarCPAPayload)
  } else if (type === 'modificar') {
    prompt = promptModificar(payload as ModificarPayload)
  } else {
    prompt = promptCorregir(payload as CorregirPayload)
    maxTokens = 2000
  }

  // 4. Appeler Claude
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
        max_tokens: maxTokens,
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
      {
        error:
          'No se pudo conectar con el servicio de IA. Verifica tu conexión e intenta de nuevo.',
      },
      { status: 500 },
    )
  }

  // 5. Extraire et valider la réponse JSON de Claude
  const content = anthropicResponse?.content as Array<{ text?: string }> | undefined
  const textoRespuesta = content?.[0]?.text ?? ''

  try {
    const match = textoRespuesta.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No se encontró JSON en la respuesta')
    const datos = JSON.parse(match[0])

    // Valider la réponse de Claude avec Zod
    const responseSchema =
      type === 'corregir'
        ? corregirResponseSchema
        : type === 'generar_cpa'
          ? generarCPAResponseSchema
          : generarResponseSchema
    const validado = responseSchema.safeParse(datos)

    if (!validado.success) {
      console.error('Respuesta de IA con formato inválido:', validado.error.issues)
      // Renvoyer quand même les données brutes — Claude ne respecte pas toujours le format exact
      return NextResponse.json(datos)
    }

    return NextResponse.json(validado.data)
  } catch {
    console.error('Error al parsear respuesta de IA:', textoRespuesta)
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
  dificultad,
  tipos,
  numeroPreguntas,
  pda,
  instrucciones,
}: GenerarPayload): string {
  const instruccionMet =
    'Sigue el método Singapur: las preguntas deben partir de situaciones concretas y contextualizadas, usar modelos visuales (barras, diagramas) cuando sea pertinente, y progresar hacia la abstracción. Fomenta la comprensión profunda y el razonamiento, no la memorización.'

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

  return `Eres un experto en el metodo Singapur para matematicas de 1o de secundaria en Mexico. Genera una tarea con exactamente ${numeroPreguntas} preguntas.

Materia: Matematicas 1o Secundaria
Dificultad: ${dificultad}
Metodologia pedagogica: Singapur (CPA)
Instruccion pedagogica especifica: ${instruccionMet}
Tipos de ejercicios a incluir: ${tiposStr}${pdaLinea}${instrucciones ? `\nInstrucciones especificas del profesor: ${instrucciones}` : ''}

Reglas estrictas:
- Distribuye las preguntas equitativamente entre los tipos indicados.
- Para "opcion_multiple": incluye exactamente 4 opciones (A, B, C, D) y un campo "respuesta" con la letra correcta.
- Para "verdadero_falso": incluye un campo "respuesta" con valor booleano true o false.
- Para "espacios": la pregunta debe tener exactamente un ___ donde va la respuesta. Incluye "respuesta" con la palabra o frase correcta.
- Para "abierta": incluye un campo "respuesta" con una respuesta modelo completa y bien redactada que sirva de referencia al profesor para corregir.
- Para "calculo": incluye un campo "respuesta" con la resolucion paso a paso y el resultado final.
- Todo en espanol mexicano, lenguaje claro y apropiado para estudiantes de 1o de secundaria.
- El contenido debe ser coherente con matematicas de 1o de secundaria y la dificultad indicada.

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
  const preguntasStr = tarea.contenido_cpa
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

  return `Eres un maestro mexicano experto en el metodo Singapur. Corrige la siguiente tarea de matematicas de 1o de secundaria.

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

function promptModificar({ pregunta, instruccion, dificultad }: ModificarPayload): string {
  const preguntaJSON = JSON.stringify(pregunta, null, 2)

  return `Eres un experto en el metodo Singapur para matematicas de 1o de secundaria en Mexico. Un profesor quiere modificar la siguiente pregunta (dificultad: ${dificultad}).

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

function promptGenerarCPA({
  dificultad,
  pda,
  instrucciones,
  tipo_concreto,
}: GenerarCPAPayload): string {
  const pdas: PdaItem[] = Array.isArray(pda) ? pda : pda ? [pda] : []
  const pdaLinea =
    pdas.length > 0
      ? pdas
          .map((p) => `PDA: ${p.pda}${p.contenido ? ` | Contenido: ${p.contenido}` : ''}`)
          .join('\n')
      : ''

  return `Eres un experto en el metodo Singapur para matematicas de 1o de secundaria en Mexico. Genera una tarea CPA completa (Concreto → Pictorico → Abstracto) construida alrededor de UN UNICO problema ancla (anchor task).

Materia: Matematicas 1o Secundaria
Dificultad: ${dificultad}
Tipo de manipulable concreto: ${tipo_concreto}
${pdaLinea ? `\n${pdaLinea}` : ''}${instrucciones ? `\nInstrucciones del profesor: ${instrucciones}` : ''}

REGLAS CRITICAS:
1. Inventa UN contexto narrativo con un personaje mexicano, una situacion cotidiana y dos objetos relacionados.
2. Las 3 etapas (concreto, pictorico, abstracto) DEBEN representar EL MISMO PROBLEMA visto desde 3 angulos.
3. El bloque concreto usa el manipulable "${tipo_concreto}" con los campos correspondientes.
4. El bloque pictorico usa un modelo de barras que represente visualmente el mismo problema.
5. El bloque abstracto tiene 3 preguntas que formalizan y extienden el problema a nuevos valores.
6. Las transiciones entre etapas deben mencionar al personaje y resumir lo descubierto.
7. Todo en espanol mexicano, claro para estudiantes de 1o de secundaria.

Para "${tipo_concreto}" (dulces_agrupables), el spec concreto DEBE tener:
- tipo_concreto: "dulces_agrupables"
- cantidad: numero total de objetos
- grupos_objetivo: numero de grupos esperados
- soluciones_validas: array de { grupos, por_grupo }
- pregunta: instruccion contextualizada
- pista: ayuda si falla
- etiqueta: nombre del objeto (ej. "limon")
- emoji: emoji del objeto (ej. "🍋")
- etiqueta_grupo: nombre del grupo (ej. "jarra")
- emoji_grupo: emoji del grupo (ej. "🫙")

Para las preguntas pictorico/abstracto, cada una tiene:
- tipo: "opcion_multiple" | "verdadero_falso" | "calculo" | "abierta" | "espacios"
- pregunta: enunciado
- opciones: (solo opcion_multiple) array de 4 opciones con letras A-D
- respuesta: respuesta correcta

Para el modelo_barras:
- barras: array de { label, valor, color, subdivisiones }
- total: { valor, visible: true }
- orientacion: "horizontal"

Formato JSON de respuesta (UNICAMENTE el JSON, sin texto adicional):
{
  "contexto": {
    "personaje": "...",
    "objetos": {
      "a": { "nombre": "...", "emoji": "..." },
      "b": { "nombre": "...", "emoji": "..." }
    },
    "valores_clave": { "razon": [N, M], "objetivo": X },
    "tipo": "razon|proporcion|reparto|comparacion|fraccion|ecuacion|porcentaje|patron|medicion|probabilidad|estadistica",
    "narrativa": "2-3 frases del problema ancla",
    "pregunta_central": "la pregunta que guia las 3 etapas",
    "transiciones": {
      "concreto": "frase que introduce la etapa concreta mencionando al personaje",
      "bridge_pictorico": "1 frase: resume lo que el alumno descubrio en concreto (retrospectiva)",
      "pictorico": "frase que introduce el modelo de barras",
      "bridge_abstracto": "1 frase: resume lo que el alumno observo en el modelo de barras",
      "abstracto": "frase que introduce la formalizacion matematica"
    }
  },
  "concreto": {
    "manipulable": { ... },
    "intentos_para_pista": 3
  },
  "pictorico": {
    "modelo_barras": { ... },
    "preguntas": [ { "pregunta": "...", "tipo": "...", "respuesta": "..." } ]
  },
  "abstracto": {
    "preguntas": [ ... ]
  }
}`
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
