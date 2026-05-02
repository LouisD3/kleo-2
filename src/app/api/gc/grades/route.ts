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

  // Get the task with GC coursework ID and class info
  const { data: tarea } = await supabaseAdmin
    .from('tareas')
    .select('*, clases(gc_course_id)')
    .eq('id', tareaId)
    .eq('profesor_id', user.id)
    .single()

  if (!tarea?.gc_coursework_id || !tarea.clases?.gc_course_id) {
    return NextResponse.json({ error: 'Tarea no publicada en Google Classroom' }, { status: 400 })
  }

  // Get results for this task
  const { data: resultados } = await supabaseAdmin
    .from('resultados')
    .select('*, alumnos(gc_user_id)')
    .eq('tarea_id', tareaId)

  if (!resultados || resultados.length === 0) {
    return NextResponse.json({ error: 'No hay resultados para enviar' }, { status: 400 })
  }

  try {
    const classroom = await getClassroomClient(profesor.gc_refresh_token)
    const courseId = tarea.clases.gc_course_id
    const courseworkId = tarea.gc_coursework_id

    let synced = 0
    let skipped = 0

    for (const resultado of resultados) {
      const gcUserId = resultado.alumnos?.gc_user_id
      if (!gcUserId) {
        skipped++
        continue
      }

      const grade = resultado.calificacion_manual ?? resultado.calificacion

      try {
        // Get the student submission
        const submissions = await classroom.courses.courseWork.studentSubmissions.list({
          courseId,
          courseWorkId: courseworkId,
          userId: gcUserId,
        })

        const submission = submissions.data.studentSubmissions?.[0]
        if (!submission?.id) {
          skipped++
          continue
        }

        // Patch the grade
        await classroom.courses.courseWork.studentSubmissions.patch({
          courseId,
          courseWorkId: courseworkId,
          id: submission.id,
          updateMask: 'draftGrade,assignedGrade',
          requestBody: {
            draftGrade: grade,
            assignedGrade: grade,
          },
        })

        synced++
      } catch (err) {
        console.error(`Error syncing grade for student ${gcUserId}:`, err)
        skipped++
      }
    }

    return NextResponse.json({ synced, skipped, total: resultados.length })
  } catch (err) {
    console.error('Error syncing grades:', err)
    return NextResponse.json({ error: 'Error al sincronizar calificaciones' }, { status: 500 })
  }
}
