import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'

const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.profile.emails',
  'https://www.googleapis.com/auth/drive.file',
]

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
}

export function getAuthUrl(state: string): string {
  const oauth2Client = getOAuth2Client()
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
  })
}

export async function exchangeCode(code: string) {
  const oauth2Client = getOAuth2Client()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export async function getClassroomClient(refreshToken: string) {
  const oauth2Client = getOAuth2Client()
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  return google.classroom({ version: 'v1', auth: oauth2Client })
}

export function getSupabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export { SCOPES }
