import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://nimagorbani1391-png.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

function constantTimeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) {
    difference |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return difference === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  // Supabase's gateway verifies the public JWT because Verify JWT is enabled.
  if (!req.headers.get("Authorization")?.startsWith("Bearer ")) {
    return json({ error: "درخواست معتبر نیست." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const expectedPassword = Deno.env.get("ADMIN_PANEL_PASSWORD");

  if (!supabaseUrl || !serviceRoleKey || !expectedPassword) {
    console.error("Admin dashboard environment is incomplete.");
    return json({ error: "تنظیمات امن پنل مدیریت کامل نیست." }, 500);
  }

  let submittedPassword = "";
  try {
    const body = await req.json();
    if (typeof body?.password === "string") submittedPassword = body.password;
  } catch {
    return json({ error: "درخواست نامعتبر است." }, 400);
  }

  if (!constantTimeEqual(submittedPassword, expectedPassword)) {
    return json({ error: "رمز ورود صحیح نیست." }, 401);
  }

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
