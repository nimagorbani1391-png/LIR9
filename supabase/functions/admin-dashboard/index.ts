import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://nimagorbani1391-png.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const authorization = req.headers.get("Authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return json({ error: "ابتدا وارد حساب کاربری شو." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const adminUserId = Deno.env.get("ADMIN_USER_ID");

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !adminUserId) {
    console.error("Admin dashboard environment is incomplete.");
    return json({ error: "تنظیمات امن پنل مدیریت کامل نیست." }, 500);
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "نشست معتبر نیست؛ دوباره وارد شو." }, 401);
  if (authData.user.id !== adminUserId) return json({ error: "اجازه دسترسی به پنل مدیریت را نداری." }, 403);

  let body: { page?: unknown; pageSize?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "درخواست نامعتبر است." }, 400);
  }

  const page = Number.isInteger(body.page) && Number(body.page) > 0 ? Number(body.page) : 1;
  const pageSize = Number.isInteger(body.pageSize)
    ? Math.min(50, Math.max(10, Number(body.pageSize)))
    : 50;

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await adminClient.auth.admin.listUsers({
    page,
    perPage: pageSize + 1,
  });

  if (error) {
    console.error("Could not list Auth users:", error.message);
    return json({ error: "خواندن فهرست کاربران انجام نشد." }, 502);
  }

  const hasMore = data.users.length > pageSize;
  const users = data.users.slice(0, pageSize).map((user) => ({
    id: user.id,
    email: user.email ?? null,
    created_at: user.created_at,
    display_name: String(user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? "").slice(0, 80),
  }));

  return json({ users, page, pageSize, hasMore });
});
