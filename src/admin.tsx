import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Activity, ArrowDownToLine, CalendarDays, CircleDollarSign, Crown, LogOut, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { supabase } from "./lib/supabase";

type AdminUser = { id: string; email: string | null; created_at: string; last_sign_in_at: string | null; is_vip: boolean; expires_at: string | null };
type DashboardData = { totalUsers: number; users: AdminUser[]; hasMore: boolean; page: number; paidSubscribers: number | null; subscriptionTrackingAvailable: boolean };
const formatDate = (value: string) => new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function AdminApp() {
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [durationDays, setDurationDays] = useState("30");

  async function requestDashboard(
    operation?: { action: "grant_vip" | "revoke_vip"; user_id: string; duration_days?: number | null },
    page = 1,
    append = false
  ) {
    if (!supabase) { setError("تنظیمات اتصال Supabase در دسترس نیست."); return false; }
    const { data: result, error: invokeError } = await supabase.functions.invoke("smooth-function", {
      body: { ...(operation ?? {}), page, per_page: 50 },
    });
    if (invokeError) { setError("ارتباط با سرور برقرار نشد. نشست مدیر را بررسی کن."); return false; }
    if (result?.error) { setError(result.error); return false; }
    if (operation) setNotice(result?.message ?? "عملیات با موفقیت انجام شد.");
    const nextData = result as DashboardData;
    setData(previous => append && previous
      ? { ...nextData, users: [...previous.users, ...nextData.users] }
      : nextData);
    setAuthorized(true);
    setError("");
    return true;
  }

  async function reloadDashboard(): Promise<DashboardData | null> {
    if (!supabase) return null;
    const { data: result, error: invokeError } = await supabase.functions.invoke("smooth-function", { body: { page: 1, per_page: 50 } });
    if (invokeError || result?.error) throw invokeError ?? new Error(result?.error);
    return result as DashboardData;
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setNotice("");
    await requestDashboard();
    setLoading(false);
  }

  async function refresh() {
    setLoading(true); setError(""); setNotice("");
    try { await requestDashboard(); } finally { setLoading(false); }
  }

  async function manageVip(user: AdminUser) {
    const action = user.is_vip ? "revoke_vip" : "grant_vip";
    const prompt = user.is_vip
      ? `اشتراک VIP کاربر ${user.email ?? user.id} لغو شود؟`
      : `برای ${user.email ?? user.id} اشتراک VIP فعال شود؟`;
    if (!window.confirm(prompt)) return;
    setLoading(true); setError(""); setNotice("");
    try {
      const operation = action === "grant_vip"
        ? { action, user_id: user.id, duration_days: durationDays === "forever" ? null : Number(durationDays) } as const
        : { action, user_id: user.id } as const;
      await requestDashboard(operation);
    } finally { setLoading(false); }
  }

  async function signOut() {
    if (!supabase || loading) return;
    setLoading(true);
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) throw signOutError;
      setAuthorized(false);
      setData(null);
      setNotice("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "خروج از حساب انجام نشد؛ دوباره تلاش کن.");
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    if (!data) return;
    const rows = [["ایمیل", "وضعیت VIP", "اعتبار تا", "تاریخ عضویت", "آخرین ورود"],
      ...data.users.map(user => [user.email ?? "", user.is_vip ? "VIP" : "رایگان", user.expires_at ?? "دائمی/ندارد", user.created_at, user.last_sign_in_at ?? ""])];
    const csv = "\uFEFF" + rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "lir9-users.csv"; anchor.click(); URL.revokeObjectURL(url);
  }

  const filteredUsers = useMemo(() => (data?.users ?? []).filter(user =>
    (user.email ?? "").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  ), [data, search]);

  if (!authorized) return (
    <main className="login-shell"><section className="login-card">
      <div className="brand-mark">L9</div><span className="eyebrow">LIR9 / PRIVATE CONSOLE</span>
      <h1>ورود به مدیریت</h1><p>برای ورود، ابتدا با حساب مدیر در LIR9 وارد شده باش؛ سپس دسترسی را بررسی کن.</p>
      <form onSubmit={signIn}>
        {error && <div className="error-box">{error}</div>}
        <button className="primary-button" disabled={loading}>{loading ? "در حال بررسی..." : "بررسی دسترسی و ورود"}</button>
      </form><div className="security-note"><ShieldCheck size={17}/> هویت مدیر در سمت سرور بررسی می‌شود؛ رمز جداگانه‌ای در این صفحه دریافت نمی‌شود.</div>
    </section></main>
  );

  return (
    <main className="admin-shell">
      <header className="topbar"><div className="brand-lockup"><div className="brand-mark small">L9</div><div><strong>LIR9</strong><span>ADMIN CONSOLE</span></div></div>
        <div className="top-actions"><span className="secure-label"><ShieldCheck size={15}/> دسترسی تأییدشده</span><button className="ghost-button" onClick={signOut}><LogOut size={16}/> خروج</button></div>
      </header>
      <section className="welcome-row"><div><span className="eyebrow">OVERVIEW / CONTROL CENTER</span><h1>داشبورد مدیریت</h1><p>مدیریت کاربران و اشتراک‌های LIR9</p></div>
        <button className="refresh-button" onClick={() => void refresh()} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""}/> به‌روزرسانی</button>
      </section>
      {error && <div className="error-box wide">{error}</div>}
      {notice && <div className="success-box">{notice}</div>}
      <section className="stats-grid">
        <article className="stat-card"><div className="stat-icon blue"><Users/></div><span>کل کاربران ثبت‌نام‌شده</span><strong>{data ? data.totalUsers.toLocaleString("fa-IR") : "—"}</strong><small>بر اساس حساب‌های احراز هویت Supabase</small></article>
        <article className="stat-card"><div className="stat-icon green"><CalendarDays/></div><span>کاربران در فهرست</span><strong>{data ? data.users.length.toLocaleString("fa-IR") : "—"}</strong><small>فهرست دریافت‌شده از سرور</small></article>
        <article className="stat-card"><div className="stat-icon amber"><CircleDollarSign/></div><span>اشتراک‌های پرداختی</span><strong>غیرفعال</strong><small>پرداخت آنلاین هنوز متصل نیست</small></article>
        <article className="stat-card"><div className="stat-icon violet"><Activity/></div><span>وضعیت پنل</span><strong className="status-live">متصل</strong><small>دسترسی امن سمت سرور</small></article>
      </section>
      <section className="table-card">
        <div className="table-heading"><div><h2>مدیریت کاربران و VIP</h2><p>برای هر کاربر می‌توانی VIP را فعال یا لغو کنی.</p></div>
          <button className="ghost-button" onClick={exportCsv} disabled={!data?.users.length}><ArrowDownToLine size={16}/> خروجی CSV</button></div>
        <div className="vip-toolbar">
          <label className="admin-search"><Search size={16}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="جست‌وجو با ایمیل کاربر..." /></label>
          <label className="duration-select"><span>مدت VIP هنگام فعال‌سازی</span><select value={durationDays} onChange={event => setDurationDays(event.target.value)}><option value="30">۳۰ روز</option><option value="90">۹۰ روز</option><option value="365">یک سال</option><option value="forever">دائمی</option></select></label>
        </div>
        {!data && !loading ? <div className="empty-state">برای مشاهده اطلاعات، داشبورد را به‌روزرسانی کن.</div> : loading && !data ? <div className="empty-state">در حال دریافت فهرست کاربران...</div> : (
          <div className="table-wrap"><table><thead><tr><th>کاربر</th><th>تاریخ عضویت</th><th>وضعیت اشتراک</th><th>عملیات</th></tr></thead><tbody>
            {filteredUsers.map(user => <tr key={user.id}>
              <td><div className="user-cell"><div className="avatar">{(user.email?.[0] ?? "U").toUpperCase()}</div><span>{user.email ?? "بدون ایمیل"}</span></div></td>
              <td>{formatDate(user.created_at)}</td>
              <td>{user.is_vip ? <span className="vip-status"><Crown size={14}/> VIP {user.expires_at ? `تا ${formatDate(user.expires_at)}` : "دائمی"}</span> : <span className="free-status">رایگان</span>}</td>
              <td><button className={user.is_vip ? "revoke-vip-button" : "grant-vip-button"} disabled={loading} onClick={() => void manageVip(user)}>{user.is_vip ? "لغو VIP" : "فعال‌سازی VIP"}</button></td>
            </tr>)}
            {filteredUsers.length === 0 && <tr><td colSpan={4} className="no-results">کاربری با این ایمیل پیدا نشد.</td></tr>}
          </tbody></table></div>
        )}
        {data?.hasMore && <div className="table-footnote"><p>برای مشاهده کاربران بیشتر، صفحه بعد را بارگذاری کن.</p><button className="ghost-button" onClick={() => void requestDashboard(undefined, (data.page ?? 1) + 1, true)} disabled={loading}><RefreshCw size={15}/> بارگذاری کاربران بیشتر</button></div>}
      </section>
      <footer className="admin-footer"><span>LIR9 ADMIN • PRIVATE ACCESS</span><span>تغییر اشتراک فقط از طریق سرور مجاز است.</span></footer>
    </main>
  );
}
