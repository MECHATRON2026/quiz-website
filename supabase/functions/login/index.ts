import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import bcrypt from "npm:bcryptjs@2.4.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, reg_no } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables on Edge Function");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: team, error: fetchError } = await supabaseAdmin
      .from("teams")
      .select("id, team_leader_reg_no_hash, status")
      .eq("team_leader_email", email)
      .single();

    if (fetchError || !team) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials or team not found" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Synchronous comparison using pure JS bcrypt (no Web Workers required)
    const valid = bcrypt.compareSync(reg_no, team.team_leader_reg_no_hash);

    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ token: team.id, status: team.status }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Function error:", err?.message || err);
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});