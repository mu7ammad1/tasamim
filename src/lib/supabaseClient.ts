import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://slcxhoelsccxiuwegpom.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3hob2Vsc2NjeGl1d2VncG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1ODUzNTMsImV4cCI6MjA0MDE2MTM1M30.t6Qh5oOf4TU6K5nfDFNpT_afrkS15stLLoJ9Y7_VXrI"
);


export default supabase;
