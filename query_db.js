const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('products').select('*');
  console.log("Total products:", data?.length);
  const others = data.filter(p => p.category_id === 4 || p.category_id === 3 || p.category_id === 2);
  console.log("Products with category_id 2, 3, 4:", others.map(p => ({ id: p.id, title: p.title, cat: p.category_id })));
}
main();
