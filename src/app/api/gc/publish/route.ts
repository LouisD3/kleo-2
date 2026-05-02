import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { getClassroomClient, getSupabaseAdmin } from '@/lib/google-classroom'

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
  const { tareaId } = body

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

  // Get the task and its class
  const { data: tarea } = await supabaseAdmin
    .from('tareas')
    .select('*, clases(gc_course_id)')
    .eq('id', tareaId)
    .eq('profesor_id', user.id)
    .single()

  if (!tarea) {
    return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
  }

  const courseId = tarea.clases?.gc_course_id
  if (!courseId) {
    return NextResponse.json(
      { error: 'La clase no está vinculada a Google Classroom' },
      { status: 400 },
    )
  }

  try {
    const classroom = await getClassroomClient(profesor.gc_refresh_token)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kleo.education'

    // Build due date from fecha_limite
    let dueDate: { year: number; month: number; day: number } | undefined
    let dueTime: { hours: number; minutes: number; seconds: number; nanos: number } | undefined

    if (tarea.fecha_limite) {
      const d = new Date(tarea.fecha_limite)
      dueDate = {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
      }
      dueTime = {
        hours: d.getHours(),
        minutes: d.getMinutes(),
        seconds: 0,
        nanos: 0,
      }
    }

    const courseWork = await classroom.courses.courseWork.create({
      courseId,
      requestBody: {
        title: tarea.nombre,
        description: `Materia: ${tarea.materia}\nDificultad: ${tarea.dificultad}\nMetodología: ${tarea.metodologia}\n\nRealiza esta tarea en Kleo: ${appUrl}/acceso-alumno`,
        materials: [
          {
            link: {
              url: `${appUrl}/acceso-alumno`,
              title: 'Abrir tarea en Kleo',
            },
          },
        ],
        workType: 'ASSIGNMENT',
        state: 'PUBLISHED',
        maxPoints: 10,
        ...(dueDate && { dueDate }),
        ...(dueTime && { dueTime }),
      },
    })

    // Store the coursework ID
    await supabaseAdmin
      .from('tareas')
      .update({ gc_coursework_id: courseWork.data.id })
      .eq('id', tareaId)

    return NextResponse.json({
      courseworkId: courseWork.data.id,
      alternateLink: courseWork.data.alternateLink,
    })
  } catch (err) {
    console.error('Error publishing to GC:', err)
    return NextResponse.json({ error: 'Error al publicar en Google Classroom' }, { status: 500 })
  }
}
