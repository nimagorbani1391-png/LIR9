import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return json({ error: "Authentication required" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Account deletion function is missing server configuration.");
    return json({ error: "Deletion service is not configured" }, 500);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // Resolve the identity from the submitted access token; never accept a user id from the client.
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    if (authError || !user) return json({ error: "Invalid or expired session" }, 401);

    // Remove all known user-owned records before deleting the Auth identity.
    // The operation is safe to retry if a prior attempt stopped partway through.
    const ownedTables = [
      "lir9_certificates",
      "lir9_user_plans",
      "lirto_daily_usage",
      "lir9_verified_lesson_progress",
      "lir9_a1_final_assessments",
      "user_learning_state",
    ];

    for (const table of ownedTables) {
      const { error } = await admin.from(table).delete().eq("user_id", user.id);
      if (error) {
        console.error("Could not remove user data from table:", table, error.message);
        return json({ error: "Could not delete all account data. Please retry." }, 500);
      }
    }

    const { error: attemptLimitError } = await admin
      .schema("private")
      .from("lir9_a1_attempt_limits")
      .delete()
      .eq("user_id", user.id);
    if (attemptLimitError) {
      console.error("Could not remove user assessment limits:", attemptLimitError.message);
      return json({ error: "Could not delete all account data. Please retry." }, 500);
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error("Auth user deletion failed:", deleteError.message);
      return json({ error: "Could not delete the account. Please retry." }, 500);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Unexpected account deletion error:", error);
    return json({ error: "Unexpected deletion error" }, 500);
  }
});
