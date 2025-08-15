import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Client {
  id: string
  full_name: string
  email?: string
  phone?: string
  company?: string
  status: 'lead' | 'active' | 'inactive' | 'lost'
  tags: string[]
  notes: Note[]
  custom: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  body: string
  type: 'manual' | 'activity'
  author: string
  created_at: string
  changes?: {
    field: string
    old_value: any
    new_value: any
  }[]
}

export interface CreateClientData {
  full_name: string
  email?: string
  phone?: string
  company?: string
  status?: 'lead' | 'active' | 'inactive' | 'lost'
  tags?: string[]
  custom?: Record<string, any>
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string
}