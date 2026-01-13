import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas chaves do Supabase
const supabaseUrl = 'https://ktaruqvypfoakvevlucd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0YXJ1cXZ5cGZvYWt2ZXZsdWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNDEwOTcsImV4cCI6MjA4MzkxNzA5N30._-0N_B6Xgv2vrU3Iw18HRc-kw1L3Ak6iDt0rUCkEPok';

export const supabase = createClient(supabaseUrl, supabaseKey);