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

  let body: Record<string, unknown> = {};
  try {
    const parsed = await req.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) body = parsed;
  } catch {
    return json({ error: "درخواست نامعتبر است." }, 400);
  }

  try {
    const action = body.action;
    if (action === "grant_vip" || action === "revoke_vip") {
      const targetUserId = typeof body.user_id === "string" ? body.user_id : "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(targetUserId)) {
        return json({ error: "شناسه کاربر معتبر نیست." }, 400);
      }
      const { data: target, error: targetError } = await adminClient.auth.admin.getUserById(targetUserId);
      if (targetError || !target.user) return json({ error: "کاربر موردنظر پیدا نشد." }, 404);

      if (action === "revoke_vip") {
        const { error } = await adminClient.from("lir9_user_plans").upsert({
          user_id: targetUserId, plan: "free", expires_at: null, updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
        if (error) throw error;
        return json({ success: true, message: "اشتراک VIP کاربر لغو شد." });
      }

      const rawDays = body.duration_days;
      const durationDays = rawDays === null ? null : Number(rawDays);
      if (durationDays !== null && (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 3650)) {
        return json({ error: "مدت اشتراک باید بین ۱ تا ۳۶۵۰ روز یا دائمی باشد." }, 400);
      }

      let expiresAt: string | null = null;
      if (durationDays !== null) {
        const { data: currentPlan, error: currentPlanError } = await adminClient
          .from("lir9_user_plans").select("plan, expires_at").eq("user_id", targetUserId).maybeSingle();
        if (currentPlanError) throw currentPlanError;
        const now = Date.now();
        const currentExpiry = currentPlan?.plan === "vip" && currentPlan.expires_at
          ? new Date(currentPlan.expires_at).getTime() : now;
        const start = Number.isFinite(currentExpiry) ? Math.max(now, currentExpiry) : now;
        expiresAt = new Date(start + durationDays * 86400000).toISOString();
      }

      const { error } = await adminClient.from("lir9_user_plans").upsert({
        user_id: targetUserId, plan: "vip", expires_at: expiresAt, updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      if (error) throw error;
      return json({ success: true, message: expiresAt
        ? `اشتراک VIP برای ${durationDays} روز فعال شد.`
        : "اشتراک VIP به‌صورت دائمی فعال شد." });
    }

    let page = 1;
    const perPage = 500;
    let totalUsers = 0;
    const users: Array<{ id: string; email: string | null; created_at: string; last_sign_in_at: string | null }> = [];
    while (page <= 20) {
      const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      if (page === 1) totalUsers = data.total ?? data.users.length;
      users.push(...data.users.map((user) => ({
        id: user.id, email: user.email ?? null, created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
      })));
      if (data.users.length < perPage) break;
      page += 1;
    }

    const { data: plans, error: plansError } = await adminClient
      .from("lir9_user_plans").select("user_id, plan, expires_at");
    if (plansError) throw plansError;
    const now = Date.now();
    const planByUser = new Map((plans ?? []).map((plan) => [plan.user_id, plan]));
    const enrichedUsers = users.map((user) => {
      const plan = planByUser.get(user.id);
      const isVip = plan?.plan === "vip" && (!plan.expires_at || new Date(plan.expires_at).getTime() > now);
      return { ...user, is_vip: Boolean(isVip), expires_at: isVip ? plan?.expires_at ?? null : null };
    });

    return json({
      totalUsers, users: enrichedUsers.sort((a, b) => b.created_at.localeCompare(a.created_at)),
      hasMore: users.length < totalUsers, paidSubscribers: null, subscriptionTrackingAvailable: false,
    });
  } catch (error) {
    console.error("Admin dashboard operation failed:", error);
    return json({ error: "انجام عملیات مدیریت ناموفق بود. دوباره تلاش کن." }, 500);
  }
});
