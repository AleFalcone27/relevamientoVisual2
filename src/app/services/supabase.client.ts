import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    'https://ovtxbswocmaskhrwayis.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dHhic3dvY21hc2tocndheWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5Njg4MjAsImV4cCI6MjA2MTU0NDgyMH0.9IbDDBRVs2iuoO42fXp1VllOwSAaR1K-NY1lXWmcL4M'
  );