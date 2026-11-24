import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://lir9-platform.pages.dev",
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
    if (action === "list_vip_users") {
      const page = Number(body.page ?? 1);
      const perPage = Number(body.per_page ?? 50);
      if (!Number.isInteger(page) || page < 1 || page > 10000 ||
          !Number.isInteger(perPage) || perPage < 1 || perPage > 50) {
        return json({ error: "شماره صفحه یا تعداد کاربران VIP معتبر نیست." }, 400);
      }
      const nowIso = new Date().toISOString();
      const from = (page - 1) * perPage;
      const { data: plans, error: plansError, count } = await adminClient
        .from("lir9_user_plans")
        .select("user_id, expires_at, updated_at", { count: "exact" })
        .eq("plan", "vip")
        .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
        .order("updated_at", { ascending: false })
        .range(from, from + perPage - 1);
      if (plansError) throw plansError;
      const vipUsers = await Promise.all((plans ?? []).map(async (plan) => {
        const { data: result, error: userError } = await adminClient.auth.admin.getUserById(plan.user_id);
        if (userError) throw userError;
        return {
          id: plan.user_id,
          email: result.user?.email ?? null,
          expires_at: plan.expires_at,
          updated_at: plan.updated_at,
        };
      }));
      return json({
        users: vipUsers,
        total: count ?? 0,
        page,
        hasMore: (count ?? 0) > from + vipUsers.length,
      });
    }

    if (action === "list_payment_requests") {
      const page = Number(body.page ?? 1);
      const perPage = Number(body.per_page ?? 20);
      if (!Number.isInteger(page) || page < 1 || page > 10000 ||
          !Number.isInteger(perPage) || perPage < 1 || perPage > 50) {
        return json({ error: "شماره صفحه یا تعداد درخواست‌ها معتبر نیست." }, 400);
      }
      const from = (page - 1) * perPage;
      const { data: requests, error: requestsError, count } = await adminClient
        .from("lir9_vip_payment_requests")
        .select("id, user_id, email, receipt_path, status, created_at, reviewed_at, admin_note", { count: "exact" })
        .is("archived_at", null)
        .order("created_at", { ascending: false })
        .range(from, from + perPage - 1);
      if (requestsError) throw requestsError;
      return json({ requests: requests ?? [], page, hasMore: (count ?? 0) > from + (requests?.length ?? 0), total: count ?? 0 });
    }

    if (action === "get_payment_receipt") {
      const requestId = typeof body.request_id === "string" ? body.request_id : "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
        return json({ error: "شناسه درخواست معتبر نیست." }, 400);
      }
      const { data: request, error: requestError } = await adminClient
        .from("lir9_vip_payment_requests").select("receipt_path").eq("id", requestId).maybeSingle();
      if (requestError) throw requestError;
      if (!request) return json({ error: "درخواست پرداخت پیدا نشد." }, 404);
      const { data: signed, error: signedError } = await adminClient.storage
        .from("vip-payment-receipts").createSignedUrl(request.receipt_path, 120);
      if (signedError || !signed?.signedUrl) throw signedError ?? new Error("Receipt URL unavailable");
      return json({ url: signed.signedUrl, expires_in: 120 });
    }

    if (action === "archive_payment_request") {
      const requestId = typeof body.request_id === "string" ? body.request_id : "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
        return json({ error: "شناسه درخواست معتبر نیست." }, 400);
      }
      const { data: archived, error: archiveError } = await adminClient
        .from("lir9_vip_payment_requests")
        .update({ archived_at: new Date().toISOString(), archived_by: userResult.user.id })
        .eq("id", requestId)
        .in("status", ["approved", "rejected"])
        .is("archived_at", null)
        .select("id")
        .maybeSingle();
      if (archiveError) throw archiveError;
      if (!archived) return json({ error: "فقط درخواست‌های بررسی‌شده قابل حذف از فهرست هستند یا درخواست قبلاً بایگانی شده است." }, 409);
      return json({ success: true, message: "درخواست از فهرست اصلی پنهان شد؛ سوابق پرداخت حفظ شده است." });
    }

    if (action === "review_payment") {
      const requestId = typeof body.request_id === "string" ? body.request_id : "";
      const status = body.status === "approved" || body.status === "rejected" ? body.status : "";
      const rawDays = body.duration_days;
      const durationDays = rawDays === null ? null : Number(rawDays);
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId) ||
          !status || (status === "approved" && durationDays !== null &&
          (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 3650))) {
        return json({ error: "اطلاعات بررسی درخواست معتبر نیست." }, 400);
      }
      const { data: reviewed, error: reviewError } = await adminClient.rpc("admin_review_lir9_vip_payment", {
        p_request_id: requestId,
        p_new_status: status,
        p_duration_days: status === "approved" ? durationDays : null,
        p_reviewed_by: userResult.user.id,
      });
      if (reviewError) {
        if (/already been reviewed/i.test(reviewError.message)) return json({ error: "این درخواست قبلاً بررسی شده است." }, 409);
        if (/not found/i.test(reviewError.message)) return json({ error: "درخواست پرداخت پیدا نشد." }, 404);
        throw reviewError;
      }
      return json({ success: true, result: reviewed, message: status === "approved" ? "پرداخت تأیید و اشتراک VIP فعال شد." : "درخواست پرداخت رد شد." });
    }

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

    const requestedPage = Number(body.page ?? 1);
    const requestedPerPage = Number(body.per_page ?? 50);
    if (!Number.isInteger(requestedPage) || requestedPage < 1 || requestedPage > 10000 ||
        !Number.isInteger(requestedPerPage) || requestedPerPage < 1 || requestedPerPage > 100) {
      return json({ error: "شماره صفحه یا تعداد کاربران معتبر نیست." }, 400);
    }
    const { data: userPage, error: usersError } = await adminClient.auth.admin.listUsers({
      page: requestedPage,
      perPage: requestedPerPage,
    });
    if (usersError) throw usersError;
    const loadedUsers = userPage.users.length;
    const users = userPage.users.map((user) => ({
      id: user.id, email: user.email ?? null, created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at ?? null,
    }));

    const { data: plans, error: plansError } = await adminClient
      .from("lir9_user_plans").select("user_id, plan, expires_at");
    if (plansError) throw plansError;
    const now = Date.now();
    const planByUser = new Map((plans ?? []).map((plan) => [plan.user_id, plan] as const));
    const enrichedUsers = users.map((user) => {
      const plan = planByUser.get(user.id);
      const isVip = plan?.plan === "vip" && (!plan.expires_at || new Date(plan.expires_at).getTime() > now);
      return { ...user, is_vip: Boolean(isVip), expires_at: isVip ? plan?.expires_at ?? null : null };
    });

    return json({
      loadedUsers,
      users: enrichedUsers.sort((a, b) => b.created_at.localeCompare(a.created_at)),
      page: requestedPage,
      hasMore: userPage.users.length === requestedPerPage,
      paidSubscribers: null,
      subscriptionTrackingAvailable: false,
    });
  } catch (error) {
    console.error("Admin dashboard operation failed:", error);
    return json({ error: "انجام عملیات مدیریت ناموفق بود. دوباره تلاش کن." }, 500);
  }
});
