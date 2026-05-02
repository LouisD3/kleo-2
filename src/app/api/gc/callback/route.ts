import { type NextRequest, NextResponse } from 'next/server'
import { exchangeCode, getSupabaseAdmin } from '@/lib/google-classroom'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // profesor ID
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

  if (error) {
    return NextResponse.redirect(`${baseUrl}/profesor/clase?gc_error=${encodeURIComponent(error)}`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/profesor/clase?gc_error=missing_params`)
  }

  try {
    const tokens = await exchangeCode(code)

    if (!tokens.refresh_token) {
      return NextResponse.redirect(`${baseUrl}/profesor/clase?gc_error=no_refresh_token`)
    }

    // Store refresh token using service role (bypasses RLS)
    const supabaseAdmin = getSupabaseAdmin()
    const { error: updateError } = await supabaseAdmin
      .from('profesores')
      .update({
        gc_refresh_token: tokens.refresh_token,
        gc_connected: true,
      })
      .eq('id', state)

    if (updateError) {
      console.error('Error storing GC tokens:', updateError)
      return NextResponse.redirect(`${baseUrl}/profesor/clase?gc_error=save_failed`)
    }

    return NextResponse.redirect(`${baseUrl}/profesor/clase?gc_connected=true`)
  } catch (err) {
    console.error('Error exchanging GC code:', err)
    return NextResponse.redirect(`${baseUrl}/profesor/clase?gc_error=exchange_failed`)
  }
}
