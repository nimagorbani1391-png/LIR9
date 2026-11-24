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

    // Delete all user-owned records atomically, including the private assessment
    // attempt-limit table, through a service-role-only SECURITY DEFINER RPC.
    const { error: dataError } = await admin.rpc("delete_lir9_user_data", {
      p_user_id: user.id,
    });
    if (dataError) {
      console.error("Could not remove user-owned data:", dataError.message);
      return json({ error: "Could not delete all account data. Please retry." }, 500);
    }

    // Remove every private receipt owned by this account before deleting its Auth identity.
    // Receipts are stored directly under the user's UUID folder.
    const receiptBucket = admin.storage.from("vip-payment-receipts");
    const receiptPaths: string[] = [];
    const pageSize = 1000;
    for (let offset = 0; ; offset += pageSize) {
      const { data: files, error: listError } = await receiptBucket.list(user.id, {
        limit: pageSize,
        offset,
        sortBy: { column: "name", order: "asc" },
      });
      if (listError) {
        console.error("Could not list account receipt files:", listError.message);
        return json({ error: "Could not securely remove account receipts. Please retry." }, 500);
      }
      const pageFiles = (files ?? []).filter(file => file.id && file.name);
      receiptPaths.push(...pageFiles.map(file => `${user.id}/${file.name}`));
      if (!files || files.length < pageSize) break;
    }

    for (let index = 0; index < receiptPaths.length; index += 100) {
      const { error: removeError } = await receiptBucket.remove(receiptPaths.slice(index, index + 100));
      if (removeError) {
        console.error("Could not remove account receipt files:", removeError.message);
        return json({ error: "Could not securely remove account receipts. Please retry." }, 500);
      }
    }

    // Only remove the Auth identity after database and private-file deletion succeed.
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
