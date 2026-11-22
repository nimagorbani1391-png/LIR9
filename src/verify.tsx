import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Award, BadgeCheck, Search, ShieldCheck, XCircle } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./verify.css";

type Verification = {
  is_valid: boolean;
  student_name?: string;
  level?: string;
  score?: number;
  verification_code?: string;
  issued_at?: string;
  status?: string;
};

function VerifyCertificate() {
  const initialCode = new URLSearchParams(window.location.search).get("code") ?? "";
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<Verification | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const verify = useCallback(async (value: string) => {
    const normalized = value.trim().toUpperCase();
    setResult(null);
    setError("");
    if (!normalized) {
      setError("شناسه مدرک را وارد کن.");
      return;
    }
    if (!supabase) {
      setError("سرویس استعلام در دسترس نیست. لطفاً بعداً دوباره تلاش کن.");
      return;
    }
    setBusy(true);
    try {
      const { data, error: requestError } = await supabase.rpc("verify_lir9_certificate", {
        p_code: normalized,
      });
      if (requestError) throw requestError;
      const response = data as Verification | null;
      if (!response?.is_valid) {
        setResult({ is_valid: false });
        return;
      }
      setResult(response);
    } catch {
      setError("ارتباط با سامانه استعلام برقرار نشد. اتصال اینترنت را بررسی و دوباره تلاش کن.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (initialCode) void verify(initialCode);
  }, [initialCode, verify]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void verify(code);
  };

  return <main className="verify-page" dir="rtl">
    <header className="verify-header">
      <a className="verify-brand" href="./" aria-label="بازگشت به LIR9"><span>L</span><b>LIR9</b></a>
      <span className="verify-header-label"><ShieldCheck size={16}/> سامانه اعتبارسنجی مدارک</span>
    </header>
    <section className="verify-card">
      <div className="verify-icon"><Award size={28}/></div>
      <span className="verify-eyebrow">LIR9 · CERTIFICATE VALIDATION</span>
      <h1>استعلام اصالت مدرک</h1>
      <p className="verify-intro">شناسه یکتای درج‌شده روی گواهی را وارد کن تا وضعیت آن مستقیماً از پایگاه داده LIR9 بررسی شود.</p>
      <form className="verify-form" onSubmit={submit}>
        <label htmlFor="certificate-code">شناسه مدرک</label>
        <input id="certificate-code" dir="ltr" autoComplete="off" spellCheck={false} value={code} onChange={event => setCode(event.target.value)} placeholder="LIR9-A1-XXXXXXXX" maxLength={48}/>
        <button type="submit" disabled={busy || !code.trim()}><Search size={17}/>{busy ? "در حال بررسی…" : "بررسی مدرک"}</button>
      </form>
      {error && <p className="verify-error" role="alert">{error}</p>}
      {result && !result.is_valid && <section className="verify-result invalid" role="status"><XCircle size={25}/><div><b>مدرک تأیید نشد</b><p>شناسه واردشده در سامانه ثبت نشده یا مدرک معتبر نیست. شناسه را دوباره بررسی کن.</p></div></section>}
      {result?.is_valid && <section className="verify-result valid" role="status">
        <BadgeCheck size={27}/>
        <div className="verify-result-content">
          <b>مدرک معتبر است</b>
          <p>این گواهی در پایگاه داده LIR9 ثبت شده و در حال حاضر باطل نشده است.</p>
          <dl>
            <div><dt>نام زبان‌آموز</dt><dd>{result.student_name}</dd></div>
            <div><dt>سطح</dt><dd dir="ltr">{result.level}</dd></div>
            <div><dt>نمره آزمون</dt><dd>{result.score} از ۳۰</dd></div>
            <div><dt>تاریخ صدور</dt><dd>{result.issued_at ? new Date(result.issued_at).toLocaleDateString("fa-IR") : "—"}</dd></div>
            <div><dt>شناسه یکتا</dt><dd dir="ltr">{result.verification_code}</dd></div>
          </dl>
          <small>این گواهی داخلی LIR9 است و معادل مدرک رسمی CEFR یا مدرک بین‌المللی نیست.</small>
        </div>
      </section>}
    </section>
    <footer className="verify-footer">LIR9 · سامانه استعلام گواهی‌های داخلی پایان دوره</footer>
  </main>;
}

ReactDOM.createRoot(document.getElementById("verify-root")!).render(<VerifyCertificate />);
