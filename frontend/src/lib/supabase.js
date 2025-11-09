// Mock Supabase client for development
// Replace this with real Supabase when you set up your database

export const supabase = {
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        order: (column, options) => ({
          limit: (count) => Promise.resolve({ 
            data: [], 
            error: null 
          })
        })
      })
    }),
    insert: (data) => ({
      select: (columns) => Promise.resolve({ 
        data: [{ id: Date.now(), ...data }], 
        error: null 
      })
    })
  })
};

// For real Supabase setup later, use:
/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
*/