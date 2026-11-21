import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Activity, ArrowDownToLine, CalendarDays, CircleDollarSign, LogOut, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { supabase } from "./lib/supabase";

type AdminUser = { id: string; email: string | null; created_at: string; last_sign_in_at: string | null };
type DashboardData = { totalUsers: number; users: AdminUser[]; hasMore: boolean; paidSubscribers: number | null; subscriptionTrackingAvailable: boolean };

const formatDate = (value: string) => new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function AdminApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) { setError("تنظیمات اتصال Supabase در دسترس نیست."); setSessionReady(true); return; }
    supabase.auth.getSession().then(({ data: result }) => {
      setSignedIn(Boolean(result.session));
      setSessionReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      if (!session) setData(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadDashboard() {
    if (!supabase) return;
    setLoading(true); setError("");
    const { data: result, error: invokeError } = await supabase.functions.invoke("admin-dashboard", { body: { action: "overview" } });
    if (invokeError) {
      setError("دریافت اطلاعات انجام نشد. دسترسی تابع سرور و تنظیمات آن را بررسی کنید.");
      setData(null);
    } else if (result?.error) {
      setError(result.error);
      setData(null);
    } else {
      setData(result as DashboardData);
    }
    setLoading(false);
  }

  useEffect(() => { if (signedIn) void loadDashboard(); }, [signedIn]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true); setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (authError) setError("ورود انجام نشد. ایمیل و رمز عبور را بررسی کن.");
    setPassword("");
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setData(null);
  }

  function exportCsv() {
    if (!data) return;
    const rows = [["ایمیل", "تاریخ عضویت", "آخرین ورود"], ...data.users.map(user => [user.email ?? "", user.created_at, user.last_sign_in_at ?? ""])];
    const csv = "\uFEFF" + rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "lir9-users.csv"; anchor.click(); URL.revokeObjectURL(url);
  }

  if (!sessionReady) return <main className="admin-shell"><div className="loading-card">در حال بررسی نشست امن...</div></main>;

  if (!signedIn) return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand-mark">L9</div>
        <span className="eyebrow">LIR9 / PRIVATE CONSOLE</span>
        <h1>ورود به مدیریت</h1>
        <p>این بخش فقط برای حساب مدیر مجاز است.</p>
        <form onSubmit={signIn}>
          <label htmlFor="admin-email">ایمیل مدیر</label>
          <input id="admin-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required />
          <label htmlFor="admin-password">رمز عبور</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
          {error && <div className="error-box">{error}</div>}
          <button className="primary-button" disabled={loading}>{loading ? "در حال ورود..." : "ورود امن"}</button>
        </form>
        <div className="security-note"><ShieldCheck size={17} /> مجوز مدیریت در سمت سرور بررسی می‌شود.</div>
      </section>
    </main>
  );

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark small">L9</div><div><strong>LIR9</strong><span>ADMIN CONSOLE</span></div></div>
        <div className="top-actions"><span className="secure-label"><ShieldCheck size={15}/> نشست احراز هویت‌شده</span><button className="ghost-button" onClick={signOut}><LogOut size={16}/> خروج</button></div>
      </header>
      <section className="welcome-row">
        <div><span className="eyebrow">OVERVIEW / CONTROL CENTER</span><h1>داشبورد مدیریت</h1><p>نمای کلی کاربران و وضعیت فعالیت در LIR9</p></div>
        <button className="refresh-button" onClick={() => void loadDashboard()} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""}/> به‌روزرسانی</button>
      </section>
      {error && <div className="error-box wide">{error}</div>}
      <section className="stats-grid">
        <article className="stat-card"><div className="stat-icon blue"><Users/></div><span>کل کاربران ثبت‌نام‌شده</span><strong>{data ? data.totalUsers.toLocaleString("fa-IR") : "—"}</strong><small>بر اساس حساب‌های احراز هویت Supabase</small></article>
        <article className="stat-card"><div className="stat-icon green"><CalendarDays/></div><span>کاربران دریافت‌شده</span><strong>{data ? data.users.length.toLocaleString("fa-IR") : "—"}</strong><small>فهرست صفحه فعلی</small></article>
        <article className="stat-card"><div className="stat-icon amber"><CircleDollarSign/></div><span>اشتراک‌های پولی</span><strong>{data?.subscriptionTrackingAvailable ? data.paidSubscribers?.toLocaleString("fa-IR") : "نیازمند اتصال پرداخت"}</strong><small>تا زمان اتصال پرداخت، عددی نمایش داده نمی‌شود</small></article>
        <article className="stat-card"><div className="stat-icon violet"><Activity/></div><span>وضعیت پنل</span><strong className="status-live">متصل</strong><small>ارتباط امن با تابع سرور</small></article>
      </section>
      <section className="table-card">
        <div className="table-heading"><div><h2>کاربران LIR9</h2><p>ایمیل، تاریخ عضویت و آخرین ورود</p></div><button className="ghost-button" onClick={exportCsv} disabled={!data?.users.length}><ArrowDownToLine size={16}/> خروجی CSV</button></div>
        {!data && !loading ? <div className="empty-state">برای مشاهده اطلاعات، داشبورد را به‌روزرسانی کن.</div> : loading && !data ? <div className="empty-state">در حال دریافت فهرست کاربران...</div> : (
          <div className="table-wrap"><table><thead><tr><th>کاربر</th><th>تاریخ عضویت</th><th>آخرین ورود</th></tr></thead><tbody>
            {data?.users.map(user => <tr key={user.id}><td><div className="user-cell"><div className="avatar">{(user.email?.[0] ?? "U").toUpperCase()}</div><span>{user.email ?? "بدون ایمیل"}</span></div></td><td>{formatDate(user.created_at)}</td><td>{user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "هنوز وارد نشده"}</td></tr>)}
          </tbody></table></div>
        )}
        {data?.hasMore && <p className="table-footnote">برای سبک ماندن درخواست‌ها، فعلاً بخشی از فهرست نمایش داده شده است.</p>}
      </section>
      <footer className="admin-footer"><span>LIR9 ADMIN • PRIVATE ACCESS</span><span>اطلاعات فقط از سرور مجاز دریافت می‌شود.</span></footer>
    </main>
  );
}