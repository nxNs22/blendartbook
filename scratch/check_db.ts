import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase config");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  const { data: categories, error: catError } = await supabase
    .from('products')
    .select('category_id')
    .limit(100);

  if (catError) {
    console.error("Error fetching categories:", catError);
    return;
  }

  const counts: Record<number, number> = {};
  categories?.forEach(p => {
    counts[p.category_id] = (counts[p.category_id] || 0) + 1;
  });

  console.log("Product counts per category_id:", counts);
}

checkData();
