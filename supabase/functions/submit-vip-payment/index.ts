import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://lir9-platform.pages.dev",
  "https://nimagorbani1391-png.github.io",
  "http://localhost:5173",
]);
const headersFor = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://lir9-platform.pages.dev",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Vary": "Origin",
});
const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), { status, headers: headersFor(origin) });

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: headersFor(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);

  const authorization = req.headers.get("Authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  if (!token || token === authorization) return json({ error: "ابتدا وارد حساب LIR9 شو." }, 401, origin);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error("VIP payment function environment is incomplete.");
    return json({ error: "سرویس ثبت درخواست پرداخت در دسترس نیست." }, 500, origin);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !authData.user?.email) return json({ error: "نشست معتبر یا ایمیل حساب پیدا نشد." }, 401, origin);

  let body: { receipt_path?: unknown };
  try { body = await req.json(); } catch { return json({ error: "درخواست نامعتبر است." }, 400, origin); }
  const userId = authData.user.id;
  const receiptPath = typeof body?.receipt_path === "string" ? body.receipt_path : "";
  const match = receiptPath.match(new RegExp("^" + userId + "/([0-9a-f-]{36})\\.(jpg|jpeg|png|webp|pdf)$", "i"));
  if (!match) return json({ error: "مسیر فایل رسید معتبر نیست." }, 400, origin);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: pending, error: pendingError } = await admin.from("lir9_vip_payment_requests")
    .select("id").eq("user_id", userId).eq("status", "pending").maybeSingle();
  if (pendingError) return json({ error: "بررسی درخواست‌های قبلی انجام نشد." }, 500, origin);
  if (pending) {
    await admin.storage.from("vip-payment-receipts").remove([receiptPath]);
    return json({ error: "یک درخواست پرداخت در انتظار بررسی داری؛ لطفاً منتظر نتیجه آن بمان." }, 409, origin);
  }

  const filename = receiptPath.slice(userId.length + 1);
  const { data: files, error: fileError } = await admin.storage.from("vip-payment-receipts")
    .list(userId, { limit: 5, search: filename });
  if (fileError) return json({ error: "فایل رسید در فضای ذخیره‌سازی پیدا نشد." }, 400, origin);
  const uploaded = files?.find(file => file.name === filename);
  const size = Number(uploaded?.metadata?.size ?? 0);
  const mime = String(uploaded?.metadata?.mimetype ?? "");
  if (!uploaded || size < 1 || size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(mime)) {
    await admin.storage.from("vip-payment-receipts").remove([receiptPath]);
    return json({ error: "فایل رسید معتبر نیست یا از محدودیت حجم و فرمت عبور کرده است." }, 400, origin);
  }

  const { data: inserted, error: insertError } = await admin.from("lir9_vip_payment_requests")
    .insert({ user_id: userId, email: authData.user.email, receipt_path: receiptPath })
    .select("id, status, created_at").single();
  if (insertError) {
    await admin.storage.from("vip-payment-receipts").remove([receiptPath]);
    if (insertError.code === "23505") return json({ error: "یک درخواست پرداخت در انتظار بررسی داری." }, 409, origin);
    console.error("VIP payment request insert failed:", insertError.message);
    return json({ error: "ثبت درخواست پرداخت انجام نشد. دوباره تلاش کن." }, 500, origin);
  }
  return json({ success: true, request: inserted, message: "درخواستت ثبت شد و پس از بررسی رسید نتیجه اعلام می‌شود." }, 200, origin);
});
