import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const questions = JSON.parse(fs.readFileSync('./quiz/questions.json'));

for (const q of questions) {
  const { error } = await supabase.from('questions').insert(q);
  if (error) console.error(q.id, error);
}