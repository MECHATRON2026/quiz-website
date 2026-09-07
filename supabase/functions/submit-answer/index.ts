import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { team_id, question_id, submitted_answer } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables on Edge Function");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the ground truth answer directly from questions table
    const { data: question, error: qError } = await supabaseAdmin
      .from("questions")
      .select("correct_answer, marks")
      .eq("id", question_id)
      .single();

    if (qError || !question) {
      return new Response(
        JSON.stringify({ error: "Question not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Evaluate correctness server-side
    const isCorrect = String(question.correct_answer).trim().toLowerCase() === String(submitted_answer).trim().toLowerCase();
    const marksAwarded = isCorrect ? question.marks : 0;

    // Record submission row
    const { error: subError } = await supabaseAdmin.from("submissions").insert({
      team_id,
      question_id,
      submitted_answer,
      is_correct: isCorrect,
      marks_awarded: marksAwarded,
    });

    if (subError) throw subError;

    // Return generic success to avoid leaking correctness during live round
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});