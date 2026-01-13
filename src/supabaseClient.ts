import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://saxbxsbbalsujidlckci.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheGJ4c2JiYWxzdWppZGxja2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTk2MTYsImV4cCI6MjA4MzgzNTYxNn0.cA1FnMYUdQbX_Cl3AC5-zM5ii_19bqta6ETMyIeEmwA'

export const supabase = createClient(supabaseUrl, supabaseKey)