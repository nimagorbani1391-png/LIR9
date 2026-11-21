import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://nimagorbani1391-png.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json({ error: "ابتدا وارد حساب مدیر شو." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const adminUserId = Deno.env.get("ADMIN_USER_ID");

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !adminUserId) {
    console.error("Admin dashboard environment is incomplete.");
    return json({ error: "تنظیمات امن پنل مدیریت کامل نیست." }, 500);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userResult, error: userError } = await userClient.auth.getUser();
  if (userError || !userResult.user) return json({ error: "نشست معتبر نیست؛ دوباره وارد شو." }, 401);
  if (userResult.user.id !== adminUserId) return json({ error: "این حساب اجازه دسترسی به پنل مدیریت را ندارد." }, 403);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    let page = 1;
    const perPage = 500;
    let totalUsers = 0;
    const users: Array<{ id: string; email: string | null; created_at: string; last_sign_in_at: string | null }> = [];
    let hasMore = false;

    while (page <= 20) {
      const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      if (page === 1) totalUsers = data.total ?? data.users.length;
      users.push(...data.users.map((user) => ({
        id: user.id,
        email: user.email ?? null,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
      })));
      if (data.users.length < perPage) break;
      page += 1;
    }
    hasMore = users.length < totalUsers;

    return json({
      totalUsers,
      users: users.sort((a, b) => b.created_at.localeCompare(a.created_at)),
      hasMore,
      paidSubscribers: null,
      subscriptionTrackingAvailable: false,
    });
  } catch (error) {
    console.error("Admin dashboard query failed:", error);
    return json({ error: "خواندن اطلاعات کاربران از سرور ناموفق بود." }, 500);
  }
});