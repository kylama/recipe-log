import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Recipe = {
  id: string
  title: string
  ingredients: string[]
  directions: string
  image_url?: string
  cook_time?: number
  servings?: number
  created_at: string
}
