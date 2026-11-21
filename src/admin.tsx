import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { supabase } from "./lib/supabase";
import "./admin.css";

type AdminUser = { id: string; email: string | null; created_at: string; display_name: string };

function AdminApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!supabase) { setSessionReady(true); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setSessionReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      if (!session) { setUsers([]); setPage(1); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadUsers = useCallback(async () => {
    if (!supabase || !signedIn) return;
    setBusy(true);
    setError("");
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("admin-dashboard", {
        body: { page, pageSize: 100 },
      });
      if (invokeError) throw invokeError;
      if (!data || !Array.isArray(data.users)) throw new Error("پاسخ سرور معتبر نیست.");
      setUsers(data.users);
      setHasMore(Boolean(data.hasMore));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "خطای نامشخص";
      setError(message.includes("403") ? "این حساب اجازه دسترسی به پنل مدیریت را ندارد." : "دریافت اطلاعات انجام نشد. اتصال تابع سرور را بررسی کن.");
      setUsers([]);
      setHasMore(false);
    } finally {
      setBusy(false);
    }
  }, [signedIn, page]);

  useEffect(() => { void loadUsers(); }, [loadUsers, refreshKey]);

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) { setError("تنظیمات اتصال Supabase کامل نیست."); return; }
    setBusy(true); setError("");
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (loginError) setError("ایمیل یا رمز عبور صحیح نیست.");
    setPassword("");
  };

  const logout = async () => { if (supabase) await supabase.auth.signOut(); };

  if (!sessionReady) return <main className="admin-shell"><p>در حال بررسی نشست امن…</p></main>;

  return <main className="admin-shell">
    <header className="admin-header">
      <div><span className="admin-eyebrow">PRIVATE CONTROL CENTER</span><h1>مدیریت LIR9</h1><p>محیط مستقل مدیریت کاربران و حساب‌ها</p></div>
      {signedIn && <button className="admin-ghost" onClick={logout}>خروج امن</button>}
    </header>
    {!signedIn ? <form className="admin-login" onSubmit={login}>
      <h2>ورود مدیر</h2><p>برای مشاهده اطلاعات، با حساب مدیر وارد شو.</p>
      <label>ایمیل<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required dir="ltr" /></label>
      <label>رمز عبور<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required dir="ltr" /></label>
      {error && <div className="admin-error">{error}</div>}
      <button className="admin-primary" disabled={busy}>{busy ? "در حال ورود…" : "ورود به پنل"}</button>
    </form> : <>
      <section className="admin-summary">
        <article><span>کاربران در این صفحه</span><strong>{users.length}</strong><small>تا ۱۰۰ حساب در هر صفحه</small></article>
        <article><span>جدیدترین عضویت این صفحه</span><strong className="admin-date">{users[0]?.created_at ? new Date(users[0].created_at).toLocaleDateString("fa-IR") : "—"}</strong><small>مرتب‌شده از جدید به قدیم</small></article>
        <article><span>اشتراک‌های خریداری‌شده</span><strong className="admin-na">فعلاً نامشخص</strong><small>ثبت خرید و درگاه پرداخت هنوز متصل نیست</small></article>
      </section>
      <section className="admin-users">
        <div className="admin-users-head"><div><h2>فهرست کاربران</h2><p>ایمیل و تاریخ عضویت از Supabase Auth</p></div><button className="admin-ghost" disabled={busy} onClick={() => setRefreshKey(v => v + 1)}>بروزرسانی</button></div>
        {error && <div className="admin-error">{error}</div>}
        {busy ? <div className="admin-empty">در حال دریافت کاربران…</div> : users.length === 0 ? <div className="admin-empty">کاربری برای نمایش وجود ندارد.</div> :
          <div className="admin-table-wrap"><table><thead><tr><th>#</th><th>نام نمایشی</th><th>ایمیل</th><th>تاریخ عضویت</th></tr></thead><tbody>
            {users.map((user, index) => <tr key={user.id}><td>{(page - 1) * 100 + index + 1}</td><td>{user.display_name || "بدون نام"}</td><td dir="ltr">{user.email || "—"}</td><td>{new Date(user.created_at).toLocaleString("fa-IR", { dateStyle:"medium", timeStyle:"short" })}</td></tr>)}
          </tbody></table></div>}
        <footer className="admin-pagination"><span>صفحه {page}</span><div><button disabled={page === 1 || busy} onClick={() => setPage(v => Math.max(1, v - 1))}>قبلی</button><button disabled={!hasMore || busy} onClick={() => setPage(v => v + 1)}>بعدی</button></div></footer>
      </section>
    </>}
    <p className="admin-security">دسترسی به اطلاعات در سمت سرور با شناسه مدیر کنترل می‌شود؛ ورود به‌تنهایی مجوز مدیریت نیست.</p>
  </main>;
}

ReactDOM.createRoot(document.getElementById("admin-root")!).render(<AdminApp />);
