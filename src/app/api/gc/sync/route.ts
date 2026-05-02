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
  const { courseId, claseId } = body

  if (!courseId || !claseId) {
    return NextResponse.json({ error: 'courseId y claseId son requeridos' }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Get refresh token
  const { data: profesor } = await supabaseAdmin
    .from('profesores')
    .select('gc_refresh_token')
    .eq('id', user.id)
    .single()

  if (!profesor?.gc_refresh_token) {
    return NextResponse.json({ error: 'Google Classroom no conectado' }, { status: 400 })
  }

  // Verify the clase belongs to this teacher
  const { data: clase } = await supabaseAdmin
    .from('clases')
    .select('id, profesor_id')
    .eq('id', claseId)
    .eq('profesor_id', user.id)
    .single()

  if (!clase) {
    return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 })
  }

  try {
    const classroom = await getClassroomClient(profesor.gc_refresh_token)

    // Fetch all students from the GC course
    const students: Array<{
      userId: string
      name: string
      email: string
    }> = []
    let pageToken: string | undefined

    do {
      const response = await classroom.courses.students.list({
        courseId,
        pageSize: 100,
        pageToken,
      })

      for (const s of response.data.students ?? []) {
        if (s.userId && s.profile?.name?.fullName) {
          students.push({
            userId: s.userId,
            name: s.profile.name.fullName,
            email: s.profile?.emailAddress ?? '',
          })
        }
      }

      pageToken = response.data.nextPageToken ?? undefined
    } while (pageToken)

    // Get existing students in this class
    const { data: existingAlumnos } = await supabaseAdmin
      .from('alumnos')
      .select('id, gc_user_id, nombre')
      .eq('clase_id', claseId)

    const existingGcIds = new Set(
      (existingAlumnos ?? []).filter((a) => a.gc_user_id).map((a) => a.gc_user_id),
    )

    // Generate access codes for new students
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    function generateCode(): string {
      let code = ''
      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
      }
      return code
    }

    const colores = [
      'bg-pink-100 text-pink-700',
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-green-100 text-green-700',
      'bg-orange-100 text-orange-700',
      'bg-teal-100 text-teal-700',
      'bg-red-100 text-red-700',
      'bg-indigo-100 text-indigo-700',
    ]

    const newStudents = students.filter((s) => !existingGcIds.has(s.userId))

    if (newStudents.length > 0) {
      const inserts = newStudents.map((s) => {
        const iniciales = s.name
          .split(' ')
          .map((p) => p[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return {
          clase_id: claseId,
          nombre: s.name,
          codigo_acceso: generateCode(),
          avatar_iniciales: iniciales,
          avatar_color: colores[Math.floor(Math.random() * colores.length)],
          gc_user_id: s.userId,
        }
      })

      const { error: insertError } = await supabaseAdmin.from('alumnos').insert(inserts)

      if (insertError) {
        console.error('Error inserting students:', insertError)
        return NextResponse.json({ error: 'Error al importar alumnos' }, { status: 500 })
      }
    }

    // Link the clase to the GC course
    await supabaseAdmin.from('clases').update({ gc_course_id: courseId }).eq('id', claseId)

    return NextResponse.json({
      imported: newStudents.length,
      total: students.length,
      alreadyExisted: students.length - newStudents.length,
    })
  } catch (err) {
    console.error('Error syncing GC students:', err)
    return NextResponse.json(
      { error: 'Error al sincronizar con Google Classroom' },
      { status: 500 },
    )
  }
}
