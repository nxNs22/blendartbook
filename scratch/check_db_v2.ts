import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCollections() {
  console.log("Checking collections 4 and 5...");
  const { data, error } = await supabase
    .from('collection_products')
    .select('collection_id, products(*)')
    .in('collection_id', [4, 5]);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data?.length} products in total.`);
  if (data) {
    data.forEach((item: any, i: number) => {
      const p = item.products;
      console.log(`${i+1}. Collection: ${item.collection_id}, ID: ${p.id}, Title: ${p.title}, Image: ${p.image_url}`);
    });
  }
}

checkCollections();
