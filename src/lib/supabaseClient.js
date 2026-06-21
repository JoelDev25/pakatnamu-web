import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Mientras no se configuren las variables de entorno (.env), la app sigue
// funcionando con los datos de muestra en src/data/, pero el login,
// el registro y el formulario de contacto no podrán escribir en la base
// de datos real. Ver README.md -> "Conectar Supabase".
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
