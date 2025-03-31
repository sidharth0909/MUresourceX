import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL='https://slcpwnhxrvyiqqidayez.supabase.co' 

const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3B3bmh4cnZ5aXFxaWRheWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTY1MTYsImV4cCI6MjA1ODQ5MjUxNn0.yAdUjFH2ABUTj2zmcYGzS77jdC9vAH_wUhFDQGquEp0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const getResourcePath = (branch, semester, subject, fileName) => 
    `${branch}/${semester}/${subject}/${fileName}`;