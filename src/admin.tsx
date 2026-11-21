import { useState } from "react";
import type { FormEvent } from "react";
import { Activity, ArrowDownToLine, CalendarDays, CircleDollarSign, LogOut, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { supabase } from "./lib/supabase";

type AdminUser = { id: string; email: string | null; created_at: string; last_sign_in_at: string | null };
type DashboardData = { totalUsers: number; users: AdminUser[]; hasMore: boolean; paidSubscribers: number | null; subscriptionTrackingAvailable: boolean };

const formatDate = (value: string) => new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function AdminApp() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestDashboard(secret: string) {
    if (!supabase) {
      setError("تنظیمات اتصال Supabase در دسترس نیست.");
      return false;
    }
    const { data: result, error: invokeError } = await supabase.functions.invoke("smooth-function", {
      body: { password: secret },
    });
    if (invokeError) {
      setError("ارتباط با سرور برقرار نشد. تنظیمات تابع را بررسی کن.");
      setData(null);
      return false;
    }
    if (result?.error) {
      setError(result.error);
      setData(null);
      return false;
    }
    setData(result as DashboardData);
    setAuthorized(true);
    setError("");
    return true;
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const ok = await requestDashboard(password);
    if (!ok) setPassword("");
    setLoading(false);
  }

  async function refresh() {
    setLoading(true);
    setError("");
    await requestDashboard(password);
    setLoading(false);
  }

  function signOut() {
    setAuthorized(false);
    setPassword("");
    setData(null);
    setError("");
  }

  function exportCsv() {
    if (!data) return;
    const rows = [["ایمیل", "تاریخ عضویت", "آخرین ورود"], ...data.users.map(user => [user.email ?? "", user.created_at, user.last_sign_in_at ?? ""])];
    const csv = "\uFEFF" + rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "lir9-users.csv"; anchor.click(); URL.revokeObjectURL(url);
  }

  if (!authorized) return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand-mark">L9</div>
        <span className="eyebrow">LIR9 / PRIVATE CONSOLE</span>
        <h1>ورود به مدیریت</h1>
        <p>برای ورود، رمز اختصاصی پنل را وارد کن.</p>
        <form onSubmit={signIn}>
          <label htmlFor="admin-password">رمز ورود</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
          {error && <div className="error-box">{error}</div>}
          <button className="primary-button" disabled={loading || !password}>{loading ? "در حال بررسی..." : "ورود به پنل"}</button>
        </form>
        <div className="security-note"><ShieldCheck size={17} /> اعتبار رمز فقط در سمت سرور بررسی می‌شود.</div>
      </section>
    </main>
  );

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark small">L9</div><div><strong>LIR9</strong><span>ADMIN CONSOLE</span></div></div>
        <div className="top-actions"><span className="secure-label"><ShieldCheck size={15}/> دسترسی تأییدشده</span><button className="ghost-button" onClick={signOut}><LogOut size={16}/> خروج</button></div>
      </header>
      <section className="welcome-row">
        <div><span className="eyebrow">OVERVIEW / CONTROL CENTER</span><h1>داشبورد مدیریت</h1><p>نمای کلی کاربران و وضعیت فعالیت در LIR9</p></div>
        <button className="refresh-button" onClick={() => void refresh()} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""}/> به‌روزرسانی</button>
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
