import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { getClassroomClient, getSupabaseAdmin } from '@/lib/google-classroom'

export async function GET(request: NextRequest) {
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

  // Get refresh token from profesores table (use service role to bypass RLS for gc_refresh_token)
  const supabaseAdmin = getSupabaseAdmin()

  const { data: profesor } = await supabaseAdmin
    .from('profesores')
    .select('gc_refresh_token')
    .eq('id', user.id)
    .single()

  if (!profesor?.gc_refresh_token) {
    return NextResponse.json({ error: 'Google Classroom no conectado' }, { status: 400 })
  }

  try {
    const classroom = await getClassroomClient(profesor.gc_refresh_token)
    const response = await classroom.courses.list({
      teacherId: 'me',
      courseStates: ['ACTIVE'],
      pageSize: 50,
    })

    const courses =
      response.data.courses?.map((c) => ({
        id: c.id,
        name: c.name,
        section: c.section,
        room: c.room,
        descriptionHeading: c.descriptionHeading,
        courseState: c.courseState,
      })) ?? []

    return NextResponse.json({ courses })
  } catch (err) {
    console.error('Error fetching GC courses:', err)
    return NextResponse.json(
      { error: 'Error al obtener cursos de Google Classroom' },
      { status: 500 },
    )
  }
}
