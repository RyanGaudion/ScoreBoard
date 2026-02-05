import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uyrcxilvmjrkvcttvswm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cmN4aWx2bWpya3ZjdHR2c3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTQ1OTEsImV4cCI6MjA4NTg5MDU5MX0.JW75BfgJxPO2Fh18-r2CDHZBXfNsUovF9JfQgvIwWQc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)