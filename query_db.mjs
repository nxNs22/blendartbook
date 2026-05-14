import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('products').select('id, title, category_id, details');
  console.log("Total products:", data?.length);
  if (data) {
     const sample = data.filter(p => p.title.includes('Memed') || p.title.includes('Nutuk') || p.title.includes('Madonna'));
     console.log("Found:", sample);
  }
}
main();
