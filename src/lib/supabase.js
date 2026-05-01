import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let _supabase = null

export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      if (!_supabase) {
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error(
            'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment',
          )
        }
        _supabase = createClient(supabaseUrl, supabaseAnonKey)
      }
      return _supabase[prop]
    },
  },
)
