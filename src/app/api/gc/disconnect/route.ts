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

  const supabaseAdmin = getSupabaseAdmin()

  const { error: updateError } = await supabaseAdmin
    .from('profesores')
    .update({
      gc_refresh_token: null,
      gc_connected: false,
    })
    .eq('id', user.id)

  if (updateError) {
    return NextResponse.json({ error: 'Error al desconectar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
