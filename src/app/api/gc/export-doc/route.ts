import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/google-classroom'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { tareaId, conRespuestas } = body

  if (!tareaId) {
    return NextResponse.json({ error: 'tareaId es requerido' }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Get teacher's refresh token
  const { data: profesor } = await supabaseAdmin
    .from('profesores')
    .select('gc_refresh_token')
    .eq('id', user.id)
    .single()

  if (!profesor?.gc_refresh_token) {
    return NextResponse.json({ error: 'Google Classroom no conectado' }, { status: 400 })
  }

  // Get the task
  const { data: tarea } = await supabaseAdmin
    .from('tareas')
    .select('*')
    .eq('id', tareaId)
    .eq('profesor_id', user.id)
    .single()

  if (!tarea) {
    return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
  }

  // Build Google Doc content as HTML
  const preguntas = tarea.preguntas ?? []
  const tipoLabel: Record<string, string> = {
    opcion_multiple: 'Opción múltiple',
    verdadero_falso: 'Verdadero / Falso',
    abierta: 'Pregunta abierta',
    espacios: 'Completar espacios',
    calculo: 'Cálculo',
  }

  let html = `<h1>${tarea.nombre}</h1>`
  html += `<p><b>Materia:</b> ${tarea.materia} · <b>Dificultad:</b> ${tarea.dificultad} · <b>Metodología:</b> ${tarea.metodologia}</p>`
  html += `<p><b>Fecha:</b> ${new Date(tarea.created_at).toLocaleDateString('es-MX')}</p>`
  html += '<p>Nombre del alumno: _______________________________</p><hr>'

  for (let i = 0; i < preguntas.length; i++) {
    const p = preguntas[i]
    html += `<h3>${i + 1}. [${tipoLabel[p.tipo] ?? p.tipo}]</h3>`
    html += `<p>${p.pregunta}</p>`

    if (p.tipo === 'opcion_multiple' && p.opciones) {
      html += '<ul>'
      for (const op of p.opciones) {
        if (conRespuestas && op.startsWith(p.respuesta)) {
          html += `<li><b>✓ ${op}</b></li>`
        } else {
          html += `<li>${op}</li>`
        }
      }
      html += '</ul>'
    }

    if (p.tipo === 'verdadero_falso') {
      if (conRespuestas) {
        html += `<p><b>Respuesta: ${p.respuesta ? 'Verdadero' : 'Falso'}</b></p>`
      } else {
        html += '<p>☐ Verdadero &nbsp;&nbsp; ☐ Falso</p>'
      }
    }

    if (p.tipo === 'espacios' && !conRespuestas) {
      html += '<p><i>(Completa el espacio en blanco)</i></p>'
    }

    if (p.tipo === 'espacios' && conRespuestas && p.respuesta) {
      html += `<p><b>Respuesta: ${p.respuesta}</b></p>`
    }

    if ((p.tipo === 'abierta' || p.tipo === 'calculo') && !conRespuestas) {
      html += '<p>_______________________________________________</p>'
      html += '<p>_______________________________________________</p>'
    }

    if ((p.tipo === 'abierta' || p.tipo === 'calculo') && conRespuestas && p.respuesta) {
      html += `<p><b>Respuesta modelo:</b> ${p.respuesta}</p>`
    }

    html += '<br>'
  }

  try {
    // Use Google Drive API to create doc
    const { google } = await import('googleapis')
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    )
    oauth2Client.setCredentials({ refresh_token: profesor.gc_refresh_token })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    const suffix = conRespuestas ? ' (Respuestas)' : ' (Examen)'
    const res = await drive.files.create({
      requestBody: {
        name: `${tarea.nombre}${suffix}`,
        mimeType: 'application/vnd.google-apps.document',
      },
      media: {
        mimeType: 'text/html',
        body: html,
      },
      fields: 'id,webViewLink',
    })

    return NextResponse.json({
      docId: res.data.id,
      url: res.data.webViewLink,
    })
  } catch (err) {
    console.error('Error creating Google Doc:', err)
    return NextResponse.json({ error: 'Error al crear el documento' }, { status: 500 })
  }
}
