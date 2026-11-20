import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./lib/supabase";
import { lessons, lessonContent, courseUnits, createOptionOrders, type Lesson } from "./data/curriculum";
import {
  LayoutDashboard, BookOpen, Library, MessageCircle, ChevronLeft,
  CheckCircle2, Clock3, Target, Languages, Menu, X, Bookmark, Volume2,
  LockKeyhole, ArrowRight, Search, Mic, MicOff, RotateCcw, Award, GraduationCap, UserRound, Mail, CalendarDays, ShieldCheck, LogOut, Crown, Star, Bot, Send, Sparkles
} from "lucide-react";

type Tab = "home" | "learn" | "vocabulary" | "library" | "assistant" | "certificates" | "vip" | "account";
type SpeechResultLike = { transcript: string; confidence?: number };
type SpeechRecognitionLike = {
  lang: string; interimResults: boolean; maxAlternatives: number;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<SpeechResultLike>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void; stop: () => void; abort: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
const normalizeSpeech = (value: string) => value.toLowerCase().replace(/[’']/g, "").replace(/…/g, "").replace(/\bi am\b/g, "im").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const speechCanonical = (value: string) => {
  const normalized = normalizeSpeech(value);
  const numberWords: Record<string, string> = { "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen", "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen", "18": "eighteen", "19": "nineteen", "20": "twenty" };
  const aliases: Record<string, string> = { "won": "one", "too": "two", "to": "two", "for": "four", "ate": "eight" };
  return normalized.split(" ").map(token => numberWords[token] || aliases[token] || token).join(" ");
};

const vocabulary = [
  { word: "Hello", phonetic: "/həˈloʊ/", meaning: "سلام", example: "Hello, how are you?", lesson: "سلام و احوال‌پرسی" },
  { word: "Introduce", phonetic: "/ˌɪntrəˈduːs/", meaning: "معرفی کردن", example: "Let me introduce myself.", lesson: "معرفی نام" },
  { word: "Friendly", phonetic: "/ˈfrendli/", meaning: "دوستانه، صمیمی", example: "She is very friendly.", lesson: "سلام و احوال‌پرسی" },
  { word: "Improve", phonetic: "/ɪmˈpruːv/", meaning: "بهبود دادن", example: "I want to improve my English.", lesson: "مرور" },
  { word: "From", phonetic: "/frʌm/", meaning: "از، اهلِ", example: "I'm from Iran.", lesson: "معرفی محل زندگی" },
  { word: "One", phonetic: "/wʌn/", meaning: "یک", example: "I have one book.", lesson: "اعداد ۱ تا ۲۰" },
  { word: "Five", phonetic: "/faɪv/", meaning: "پنج", example: "I have five books.", lesson: "اعداد ۱ تا ۲۰" },
  { word: "Ten", phonetic: "/ten/", meaning: "ده", example: "Ten students are here.", lesson: "اعداد ۱ تا ۲۰" },
  { word: "Twelve", phonetic: "/twelv/", meaning: "دوازده", example: "I am twelve.", lesson: "اعداد ۱ تا ۲۰" },
  { word: "Mother", phonetic: "/ˈmʌðər/", meaning: "مادر", example: "This is my mother.", lesson: "اعضای خانواده" },
  { word: "Father", phonetic: "/ˈfɑːðər/", meaning: "پدر", example: "He is my father.", lesson: "اعضای خانواده" },
  { word: "Sister", phonetic: "/ˈsɪstər/", meaning: "خواهر", example: "She is my sister.", lesson: "اعضای خانواده" },
  { word: "Teacher", phonetic: "/ˈtiːtʃər/", meaning: "معلم", example: "She is a teacher.", lesson: "شغل‌ها و معرفی افراد" },
  { word: "Doctor", phonetic: "/ˈdɑːktər/", meaning: "پزشک", example: "My mother is a doctor.", lesson: "شغل‌ها و معرفی افراد" },
  { word: "Student", phonetic: "/ˈstuːdənt/", meaning: "دانش‌آموز / دانشجو", example: "I'm a student.", lesson: "شغل‌ها و معرفی افراد" },
  { word: "A book", phonetic: "/ə bʊk/", meaning: "یک کتاب", example: "It is a book.", lesson: "حروف تعریف a و an" },
  { word: "An apple", phonetic: "/ən ˈæpəl/", meaning: "یک سیب", example: "It is an apple.", lesson: "حروف تعریف a و an" },
  { word: "An egg", phonetic: "/ən eɡ/", meaning: "یک تخم‌مرغ", example: "This is an egg.", lesson: "حروف تعریف a و an" },
  { word: "This", phonetic: "/ðɪs/", meaning: "این (نزدیک)", example: "This is my phone.", lesson: "اشاره به چیزها: this و that" },
  { word: "That", phonetic: "/ðæt/", meaning: "آن (دور)", example: "That is a bus.", lesson: "اشاره به چیزها: this و that" },
  { word: "Book", phonetic: "/bʊk/", meaning: "کتاب", example: "I have two books.", lesson: "جمع بستن اسم‌ها" },
  { word: "Books", phonetic: "/bʊks/", meaning: "کتاب‌ها", example: "I have three books.", lesson: "جمع بستن اسم‌ها" },
  { word: "Two cats", phonetic: "/tuː kæts/", meaning: "دو گربه", example: "I have two cats.", lesson: "جمع بستن اسم‌ها" },
  { word:"Usually",phonetic:"/ˈjuːʒuəli/",meaning:"معمولاً",example:"I usually walk to school.",lesson:"قیدهای تکرار" },
  { word:"Sometimes",phonetic:"/ˈsʌmtaɪmz/",meaning:"گاهی",example:"I sometimes read comics.",lesson:"قیدهای تکرار" },
  { word:"Always",phonetic:"/ˈɔːlweɪz/",meaning:"همیشه",example:"She always does her homework.",lesson:"قیدهای تکرار" },
  { word:"Can",phonetic:"/kæn/",meaning:"توانستن",example:"I can ride a bike.",lesson:"بیان توانایی با can" },
  { word:"Draw",phonetic:"/drɔː/",meaning:"نقاشی کشیدن",example:"I can draw a cat.",lesson:"بیان توانایی با can" },
  { word:"Swim",phonetic:"/swɪm/",meaning:"شنا کردن",example:"Can you swim?",lesson:"بیان توانایی با can" },
  { word:"Like",phonetic:"/laɪk/",meaning:"دوست داشتن",example:"I like science.",lesson:"علاقه‌ها با like" },
  { word:"Reading",phonetic:"/ˈriːdɪŋ/",meaning:"کتاب خواندن",example:"I like reading stories.",lesson:"علاقه‌ها با like" },
  { word:"Music",phonetic:"/ˈmjuːzɪk/",meaning:"موسیقی",example:"I listen to music.",lesson:"علاقه‌ها با like" },
  { word:"Under",phonetic:"/ˈʌndər/",meaning:"زیر",example:"The ball is under the chair.",lesson:"حروف اضافه مکان" },
  { word:"On",phonetic:"/ɑːn/",meaning:"روی",example:"The phone is on the desk.",lesson:"حروف اضافه مکان" },
  { word:"In",phonetic:"/ɪn/",meaning:"داخل",example:"The keys are in my bag.",lesson:"حروف اضافه مکان" },
  { word:"Morning",phonetic:"/ˈmɔːrnɪŋ/",meaning:"صبح",example:"I study in the morning.",lesson:"گفتن ساعت و زمان‌های روز" },
  { word:"Night",phonetic:"/naɪt/",meaning:"شب",example:"I read at night.",lesson:"گفتن ساعت و زمان‌های روز" },
  { word:"Ready",phonetic:"/ˈredi/",meaning:"آماده",example:"I'm ready for class.",lesson:"فعل be در جمله منفی" },
  { word:"Tired",phonetic:"/ˈtaɪərd/",meaning:"خسته",example:"I'm not tired.",lesson:"فعل be در جمله منفی" },
  { word:"Notebook",phonetic:"/ˈnoʊtbʊk/",meaning:"دفتر",example:"This is my notebook.",lesson:"مالکیت با my و your" },
  { word:"Your",phonetic:"/jʊr/",meaning:"مال تو / شما",example:"Is this your bag?",lesson:"مالکیت با my و your" },
  { word:"Have",phonetic:"/hæv/",meaning:"داشتن",example:"I have a new book.",lesson:"داشتن با have و has" },
  { word:"Has",phonetic:"/hæz/",meaning:"دارد",example:"He has a blue bike.",lesson:"داشتن با have و has" },
];
const readStore = (key: string, fallback: string[]) => { try { const raw = localStorage.getItem(key); if (!raw) return fallback; const value: unknown = JSON.parse(raw); return Array.isArray(value) && value.every(item => typeof item === "string") ? value : fallback; } catch { return fallback; } };
const writeStore = (key: string, value: string[]) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };

function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: import("react").FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!supabase) {
      setError("اتصال به سرویس ورود کامل تنظیم نشده است. کمی بعد دوباره تلاش کن.");
      return;
    }
    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("تکرار رمز عبور با رمز اصلی یکسان نیست.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: window.location.origin + import.meta.env.BASE_URL
          }
        });
        if (authError) throw authError;
        if (!data.session) {
          setMessage("حساب ساخته شد! برای فعال‌سازی، لینک تأیید را از ایمیلت باز کن؛ سپس به همین سایت برگرد و وارد شو.");
        } else {
          setMessage("حساب کاربری با موفقیت ساخته شد.");
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (authError) throw authError;
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "مشکلی در انجام درخواست پیش آمد.";
      if (/invalid login credentials/i.test(message)) setError("ایمیل یا رمز عبور اشتباه است.");
      else if (/email not confirmed/i.test(message)) setError("ایمیلت هنوز تأیید نشده است. لینک ارسال‌شده را باز کن.");
      else if (/user already registered/i.test(message)) setError("این ایمیل قبلاً ثبت‌نام کرده است؛ وارد حساب شو.");
      else if (/password should be at least/i.test(message)) setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      else setError(message);
    } finally {
      setBusy(false);
    }
  };

  return <main className="auth-screen" dir="rtl">
    <section className="auth-card">
      <div className="auth-brand"><span className="auth-brand-mark">L</span><div><b>LIR9</b><small>یادگیری، قدم‌به‌قدم</small></div></div>
      <div className="auth-heading"><span>فضای یادگیری شخصی تو</span><h1>{mode === "signup" ? "به LIR9 خوش اومدی" : "خوش برگشتی!"}</h1><p>{mode === "signup" ? "حساب بساز تا مسیر یادگیری و پیشرفتت همراهت بماند." : "برای ادامه مسیر یادگیری وارد حساب خودت شو."}</p></div>
      <div className="auth-switch"><button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); setMessage(""); }}>ثبت‌نام</button><button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); setMessage(""); }}>ورود</button></div>
      <form className="auth-form" onSubmit={submit}>
        {mode === "signup" && <label>نام نمایشی<input value={name} onChange={event => setName(event.target.value)} placeholder="نامی که در LIR9 نمایش داده می‌شود" autoComplete="name" required maxLength={50}/></label>}
        <label>ایمیل<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required dir="ltr"/></label>
        <label>رمز عبور<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="حداقل ۸ کاراکتر" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={8} dir="ltr"/></label>
        {mode === "signup" && <label>تکرار رمز عبور<input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="رمز عبور را دوباره وارد کن" autoComplete="new-password" required minLength={8} dir="ltr"/></label>}
        {error && <div className="auth-alert error" role="alert">{error}</div>}
        {message && <div className="auth-alert success" role="status">{message}</div>}
        <button className="auth-submit" type="submit" disabled={busy}>{busy ? "لطفاً صبر کن…" : mode === "signup" ? "ساخت حساب کاربری" : "ورود به حساب"} <span>←</span></button>
      </form>
      <p className="auth-footnote"><span>◆</span> اطلاعات حساب با امنیت Supabase مدیریت می‌شود.</p>
    </section>
    <div className="auth-background-glow" aria-hidden="true"/>
  </main>;
}


type LibraryItem = {
  id: string; title: string; summary: string; category: "داستان" | "مقاله" | "مکالمه";
  level: string; minutes: number; file: string; featured?: boolean;
};
type LibraryArticle = { title: string; introduction: string; paragraphs: string[]; vocabulary?: { word: string; meaning: string }[]; };
const libraryCache = new Map<string, LibraryItem[] | LibraryArticle>();
function ContentLibrary() {
  const [items, setItems] = useState<LibraryItem[]>(() => (libraryCache.get("index") as LibraryItem[] | undefined) ?? []);
  const [loading, setLoading] = useState(() => !libraryCache.has("index"));
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("همه");
  const [selected, setSelected] = useState<LibraryItem | null>(null);
  const [article, setArticle] = useState<LibraryArticle | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioError, setAudioError] = useState("");

  const articleContainsPersian = article?.paragraphs?.some(paragraph => /[\u0600-\u06FF]/.test(paragraph)) ?? false;

  const toggleArticleAudio = () => {
    if (articleContainsPersian) return;
    if (!("speechSynthesis" in window)) { setAudioError("پخش صوت در این مرورگر پشتیبانی نمی‌شود."); return; }
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    if (!article?.paragraphs?.length) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(article.paragraphs.join(". "));
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => { setIsSpeaking(false); setAudioError("پخش صوت متوقف شد. دوباره تلاش کن."); };
    setAudioError("");
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setIsSpeaking(false);
    setAudioError("");
    return () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, [selected]);

  useEffect(() => {
    if (libraryCache.has("index")) return;
    let active = true;
    fetch(`${import.meta.env.BASE_URL}content/library/index.json`, { cache: "force-cache" })
      .then(response => { if (!response.ok) throw new Error("فهرست محتوا دریافت نشد."); return response.json(); })
      .then((data: LibraryItem[]) => {
        if (!Array.isArray(data)) throw new Error("ساختار فهرست محتوا معتبر نیست.");
        libraryCache.set("index", data);
        if (active) { setItems(data); setError(""); }
      })
      .catch(() => { if (active) setError("بارگذاری کتابخانه با مشکل روبه‌رو شد. اتصال اینترنت را بررسی و دوباره تلاش کن."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selected) { setArticle(null); return; }
    const cached = libraryCache.get(selected.file) as LibraryArticle | undefined;
    if (cached) { setArticle(cached); setArticleLoading(false); return; }
    let active = true;
    setArticle(null);
    setArticleLoading(true);
    fetch(`${import.meta.env.BASE_URL}${selected.file}`, { cache: "force-cache" })
      .then(response => { if (!response.ok) throw new Error("مطلب دریافت نشد."); return response.json(); })
      .then((data: LibraryArticle) => {
        libraryCache.set(selected.file, data);
        if (active) setArticle(data);
      })
      .catch(() => { if (active) setError("این مطلب فعلاً در دسترس نیست. دوباره تلاش کن."); })
      .finally(() => { if (active) setArticleLoading(false); });
    return () => { active = false; };
  }, [selected]);

  const filtered = useMemo(() => items.filter(item =>
    (category === "همه" || item.category === category) &&
    `${item.title} ${item.summary} ${item.level} ${item.category}`.toLocaleLowerCase("fa").includes(query.trim().toLocaleLowerCase("fa"))
  ), [items, category, query]);

  if (selected) return <section className="library-page">
    <button className="library-back" onClick={() => { setSelected(null); setError(""); }}><ChevronLeft size={17}/> بازگشت به کتابخانه</button>
    {articleLoading && <div className="library-state"><span className="library-spinner"/> در حال آماده‌سازی مطلب…</div>}
    {error && <div className="library-error" role="alert">{error}<button onClick={() => { setSelected(null); setError(""); }}>بازگشت</button></div>}
    {article && <article className="library-reader">
      <div className="library-reader-meta"><span>{selected.category}</span><span>{selected.level}</span><span><Clock3 size={13}/> {selected.minutes} دقیقه</span></div>
      <h1>{article.title || selected.title}</h1>
      <p className="library-reader-intro">{article.introduction}</p>
      {!articleContainsPersian && <>
        <div className="library-audio-control">
          <button type="button" className={isSpeaking ? "library-audio-button is-speaking" : "library-audio-button"} onClick={toggleArticleAudio} aria-pressed={isSpeaking}>
            <Volume2 size={18}/>{isSpeaking ? "توقف پخش صوت" : "شنیدن متن انگلیسی"}
          </button>
          <span>{isSpeaking ? "در حال خواندن متن انگلیسی…" : "برای شنیدن مکالمه، دکمه را بزن."}</span>
        </div>
        {audioError && <p className="library-audio-error" role="status">{audioError}</p>}
      </>}
      <div className="library-article-body">{article.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      {!!article.vocabulary?.length && <section className="library-vocabulary"><h2>واژه‌های کاربردی</h2>{article.vocabulary.map(word => <div key={word.word}><b dir="ltr">{word.word}</b><span>{word.meaning}</span></div>)}</section>}
      <div className="library-reader-footer"><BookOpen size={17}/> مطالعه‌ات را با آرامش ادامه بده؛ هر روز یک قدم کافی است.</div>
    </article>}
  </section>;

  return <section className="library-page">
    <div className="page-intro library-intro"><span className="section-kicker">یادگیری فراتر از درس‌ها</span><h1>کتابخانه محتوا</h1><p>داستان بخوان، نکته یاد بگیر و مکالمه‌های واقعی را دنبال کن.</p></div>
    <div className="library-feature">
      <div className="library-feature-icon"><BookOpen size={27}/></div>
      <div><span>فضای مطالعه LIR9</span><h2>هر روز، یک مطلب تازه</h2><p>محتوای کوتاه و سطح‌بندی‌شده برای تقویت زبان انگلیسی.</p></div>
      <span className="library-feature-mark">LIR9</span>
    </div>
    <label className="library-search"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="جست‌وجو در داستان‌ها، مقاله‌ها و مکالمه‌ها…" aria-label="جست‌وجو در کتابخانه محتوا"/></label>
    <div className="library-filters" aria-label="دسته‌بندی محتوا">
      {["همه", "داستان", "مقاله", "مکالمه"].map(item => <button key={item} className={category===item?"active":""} onClick={() => setCategory(item)} aria-pressed={category===item}>{item}</button>)}
    </div>
    {loading && <div className="library-state"><span className="library-spinner"/> در حال دریافت فهرست کتابخانه…</div>}
    {error && <div className="library-error" role="alert">{error}<button onClick={() => { setError(""); setLoading(true); window.location.reload(); }}>تلاش دوباره</button></div>}
    {!loading && !error && <div className="library-grid">
      {filtered.map((item, index) => <button className="library-card" key={item.id} onClick={() => { setSelected(item); setError(""); }} style={{animationDelay:`${index*45}ms`}}>
        <div className={`library-card-art art-${item.category === "داستان" ? "story" : item.category === "مقاله" ? "article" : "dialogue"}`}><span>{item.category}</span><BookOpen size={25}/></div>
        <div className="library-card-copy"><div className="library-card-meta"><span>{item.level}</span><span><Clock3 size={12}/>{item.minutes} دقیقه</span></div><h3>{item.title}</h3><p>{item.summary}</p><span className="library-card-link">مطالعه مطلب <ArrowRight size={15}/></span></div>
      </button>)}
      {!filtered.length && <div className="library-empty"><Search size={24}/><b>مطلبی پیدا نشد</b><span>عبارت جست‌وجو یا دسته‌بندی را تغییر بده.</span></div>}
    </div>}
  </section>;
}


type LirtoMessage = { role: "assistant" | "user"; text: string };

function LirtoAssistant() {
  const [messages, setMessages] = useState<LirtoMessage[]>([
    { role: "assistant", text: "سلام! من LIRTO هستم؛ همراه هوشمندت برای یادگیری زبان انگلیسی. ✨" }
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sendMessage = async () => {
    const value = draft.trim();
    if (!value || isSending) return;
    if (!supabase) {
      setMessages(current => [...current, { role: "user", text: value }, { role: "assistant", text: "اتصال حساب کاربری برقرار نیست. لطفاً صفحه را تازه‌سازی کن و دوباره وارد شو." }]);
      setDraft("");
      return;
    }
    const nextMessages: LirtoMessage[] = [...messages, { role: "user", text: value }];
    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("quick-worker", {
        body: {
          messages: nextMessages
            .filter(message => message.role !== "assistant" || messages.length > 0)
            .slice(-8)
            .map(message => ({ role: message.role, content: message.text }))
        }
      });
      if (error) throw error;
      if (typeof data?.reply !== "string" || !data.reply.trim()) {
        throw new Error(data?.error || "پاسخ معتبری دریافت نشد.");
      }
      setMessages(current => [...current, { role: "assistant", text: data.reply }]);
    } catch (error) {
      console.error("LIRTO request failed:", error);
      const message = error instanceof Error ? error.message : "";
      setMessages(current => [...current, {
        role: "assistant",
        text: message.includes("JWT") || message.includes("401")
          ? "برای استفاده از LIRTO باید وارد حساب کاربری‌ات شده باشی."
          : "فعلاً نتونستم به موتور هوش مصنوعی وصل بشم. کمی بعد دوباره تلاش کن."
      }]);
    } finally {
      setIsSending(false);
    }
  };
  return <section className="lirto-shell" aria-label="دستیار LIRTO">
    <header className="lirto-header">
      <div className="lirto-brand">
        <div className="lirto-avatar"><Bot size={25}/><i/></div>
        <div><strong>LIRTO</strong><span>همیشه کنار تو</span></div>
      </div>
      <span className="lirto-specialty"><Sparkles size={13}/> دستیار یادگیری زبان</span>
    </header>
    <div className="lirto-intro"><span className="lirto-kicker">YOUR LANGUAGE COMPANION</span><h2>یادگیری انگلیسی، هوشمندتر.</h2><p>سؤال بپرس، تمرین کن و قدم‌به‌قدم پیشرفت کن.</p></div>
    <div className="lirto-chat" aria-live="polite">
      {messages.map((message, index) => <div className={message.role === "user" ? "lirto-message user" : "lirto-message assistant"} key={index}>
        {message.role === "assistant" && <span className="lirto-message-avatar"><Bot size={15}/></span>}
        <p>{message.text}</p>
      </div>)}
      {isSending && <div className="lirto-message assistant"><span className="lirto-message-avatar"><Bot size={15}/></span><p>دارم فکر می‌کنم... ✨</p></div>}
    </div>
    <div className="lirto-suggestions"><span>شروع سریع:</span>
      {["چطور انگلیسی سلام کنم؟","گرامر حال ساده رو توضیح بده","با من انگلیسی مکالمه کن"].map(item => <button key={item} type="button" disabled={isSending} onClick={() => setDraft(item)}>{item}</button>)}
    </div>
    <form className="lirto-composer" onSubmit={event => { event.preventDefault(); void sendMessage(); }}>
      <input value={draft} onChange={event => setDraft(event.target.value)} placeholder="پیامت رو برای LIRTO بنویس..." aria-label="پیام به LIRTO" maxLength={1200} disabled={isSending}/>
      <button type="submit" disabled={!draft.trim() || isSending} aria-label="ارسال پیام"><Send size={17}/></button>
    </form>
    <div className="lirto-footnote"><ShieldCheck size={13}/> اتصال امن به موتور هوش مصنوعی Groq</div>
  </section>;
}

function App() {
  const [authSession, setAuthSession] = useState<import("@supabase/supabase-js").Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signOutBusy, setSignOutBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [step, setStep] = useState<"learn" | "quiz" | "result" | "typing" | "voice" | "complete">("learn");
  const [choice, setChoice] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizOptionOrders, setQuizOptionOrders] = useState<Record<number, number[]>>({});
  const [lastLessonRewarded, setLastLessonRewarded] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "matched" | "retry" | "unsupported" | "error">("idle");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [typingStatus, setTypingStatus] = useState<"idle" | "matched" | "retry">("idle");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => [...new Set(readStore("lir9-completed", []).filter(id => lessons.some(lesson => String(lesson.id) === id)))]);
  const [rewarded, setRewarded] = useState<string[]>(() => readStore("lir9-rewarded", []));
  const [lirBalance, setLirBalance] = useState<number>(() => { try { const value = Number(localStorage.getItem("lir9-balance") || 0); return Number.isFinite(value) && value >= 0 ? value : 0; } catch { return 0; } });
  const [saved, setSaved] = useState<string[]>(() => [...new Set(readStore("lir9-saved", ["Hello"]).filter(word => vocabulary.some(item => item.word === word)))]);
  const [search, setSearch] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [notice, setNotice] = useState("");
  const active = lessons.find(l => l.id === activeLesson);
  const quizQuestions = active ? lessonContent[active.id]?.questions ?? [] : [];
  const quizScore = useMemo(() => quizQuestions.reduce((score, question, index) => score + (quizAnswers[index] === question.correct ? 1 : 0), 0), [quizAnswers, activeLesson]);
  const progress = Math.round(completed.length / lessons.length * 100);
  const nextLesson = lessons.find(l => !completed.includes(String(l.id))) ?? lessons[0];
  const filteredWords = useMemo(() => vocabulary.filter(w => (!showSavedOnly || saved.includes(w.word)) && (w.word + w.phonetic + w.meaning + w.example + w.lesson).toLowerCase().includes(search.trim().toLowerCase())), [search, showSavedOnly, saved]);
  const nav = [
    { id: "home" as Tab, label: "خانه", icon: LayoutDashboard },
    { id: "learn" as Tab, label: "درس‌ها", icon: BookOpen },
    { id: "vocabulary" as Tab, label: "لغت‌های من", icon: Library },
    { id: "library" as Tab, label: "کتابخانه محتوا", icon: BookOpen },
    { id: "assistant" as Tab, label: "دستیار", icon: MessageCircle },
    { id: "certificates" as Tab, label: "مدارک من", icon: GraduationCap },
    { id: "vip" as Tab, label: "اشتراک VIP", icon: Crown }
  ];
  const go = (next: Tab) => { setTab(next); setMenuOpen(false); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openLesson = (id: number) => { const index = lessons.findIndex(lesson => lesson.id === id); if (index < 0) return; const unlocked = lessons.slice(0, index).every(lesson => completed.includes(String(lesson.id))); if (!unlocked) { setNotice("برای باز کردن این درس، ابتدا درس‌های قبلی را کامل کن."); setMenuOpen(false); return; } setActiveLesson(id); setStep("learn"); setChoice(null); setQuizIndex(0); setQuizAnswers({}); setQuizOptionOrders(createOptionOrders(lessonContent, id)); setMenuOpen(false); };
  const closeLesson = () => { recognitionRef.current?.abort(); recognitionRef.current = null; setActiveLesson(null); setChoice(null); setStep("learn"); setQuizIndex(0); setQuizAnswers({}); setQuizOptionOrders({}); setVoiceStatus("idle"); setVoiceTranscript(""); setTypedAnswer(""); setTypingStatus("idle"); };
  useEffect(() => {
    if (!activeLesson) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { setActiveLesson(null); setChoice(null); setStep("learn"); } };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { recognitionRef.current?.abort(); recognitionRef.current = null; document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [activeLesson]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 4200);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    if (step !== "voice" || voiceStatus !== "matched") return;
    const timeout = window.setTimeout(() => completeLesson(), 900);
    return () => window.clearTimeout(timeout);
  }, [voiceStatus, step, activeLesson]);
  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.error("Could not restore Supabase session:", error.message);
      setAuthSession(data.session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      setAuthLoading(false);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const handleSignOut = async () => {
    if (!supabase || signOutBusy) return;
    const confirmed = window.confirm("آیا مطمئنی می‌خواهی از حساب کاربری LIR9 خارج شوی؟");
    if (!confirmed) return;
    setSignOutBusy(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setNotice("خروج از حساب انجام نشد؛ دوباره تلاش کن.");
        return;
      }
      setMenuOpen(false);
    } catch {
      setNotice("ارتباط با سرویس حساب کاربری برقرار نشد؛ دوباره تلاش کن.");
    } finally {
      setSignOutBusy(false);
    }
  };
  const completeLesson = () => {
    if (!active) return;
    const id = String(active.id);
    const alreadyCompleted = completed.includes(id);
    setLastLessonRewarded(!alreadyCompleted && !rewarded.includes(id));
    const updated = alreadyCompleted ? completed : [...completed, id];
    setCompleted(updated);
    const progressSaved = writeStore("lir9-completed", updated);
    if (!alreadyCompleted && !rewarded.includes(id)) {
      const nextRewarded = [...rewarded, id];
      const nextBalance = lirBalance + 2;
      setRewarded(nextRewarded);
      setLirBalance(nextBalance);
      const rewardSaved = writeStore("lir9-rewarded", nextRewarded);
      let balanceSaved = true;
      try { localStorage.setItem("lir9-balance", String(nextBalance)); } catch { balanceSaved = false; }
      setNotice(progressSaved && rewardSaved && balanceSaved ? "آفرین! درس کامل شد و ۲ LIR به موجودی‌ات اضافه شد." : "درس کامل شد؛ اما ذخیره بخشی از اطلاعات در این مرورگر ممکن نشد.");
    } else {
      setNotice(progressSaved ? "این درس قبلاً تکمیل شده است؛ برای مرور دوباره امتیاز جدیدی دریافت نمی‌کنی." : "ذخیره پیشرفت در این مرورگر ممکن نشد.");
    }
    setStep("complete");
  };
  const toggleWord = (word: string) => {
    const updated = saved.includes(word) ? saved.filter(w => w !== word) : [...saved, word];
    setSaved(updated); if (!writeStore("lir9-saved", updated)) setNotice("ذخیره‌سازی در این مرورگر در دسترس نیست؛ لغت‌ها ممکن است پس از بستن صفحه باقی نمانند.");
  };
  const speak = (text: string) => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") { setNotice("این مرورگر از تبدیل متن به گفتار پشتیبانی نمی‌کند."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = "en-US"; utterance.onerror = () => setNotice("پخش تلفظ انجام نشد؛ تنظیمات صدای مرورگر را بررسی کن."); window.speechSynthesis.speak(utterance);
  };
  const startVoiceAttempt = () => {
    if (!active) return;
    recognitionRef.current?.abort();
    const speechWindow = window as Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) { setVoiceStatus("unsupported"); setVoiceTranscript(""); return; }
    try {
      const recognition = new Recognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.onresult = event => {
        const result = event.results[event.resultIndex] || event.results[0];
        const alternatives = Array.from(result || []).map(item => item.transcript);
        const transcript = alternatives[0] || "";
        const expected = normalizeSpeech(active.keyWords[0]?.word || "");
        const target = speechCanonical(expected);
        const matched = alternatives.some(value => { const spoken = speechCanonical(value); return target.length > 0 && (" " + spoken + " ").includes(" " + target + " "); });
        setVoiceTranscript(transcript);
        setVoiceError("");
        setVoiceStatus(matched ? "matched" : "retry");
      };
      recognition.onerror = event => {
        setVoiceStatus("error");
        setVoiceTranscript("");
        setVoiceError(event.error === "not-allowed" ? "دسترسی میکروفون داده نشده است؛ مجوز میکروفون مرورگر را فعال کن." : event.error === "no-speech" ? "صدایی تشخیص داده نشد؛ دوباره واضح‌تر صحبت کن." : "تشخیص صدا با مشکل روبه‌رو شد؛ اتصال و مجوز میکروفون را بررسی کن.");
      };
      recognition.onend = () => setVoiceStatus(current => current === "listening" ? "idle" : current);
      recognitionRef.current = recognition;
      setVoiceTranscript("");
      setVoiceError("");
      setVoiceStatus("listening");
      recognition.start();
    } catch {
      setVoiceStatus("error");
      setVoiceTranscript("");
      setVoiceError("شروع میکروفون ممکن نشد؛ دوباره امتحان کن.");
    }
  };
  const beginTypingPractice = () => { setTypedAnswer(""); setTypingStatus("idle"); setStep("typing"); };
  const beginQuiz = () => { if (!active) return; setQuizIndex(0); setQuizAnswers({}); setQuizOptionOrders(createOptionOrders(lessonContent, active.id)); setChoice(null); setStep("quiz"); };
  const checkTypedAnswer = () => {
    if (!active) return;
    const expected = normalizeSpeech(active.keyWords[0]?.word || "");
    const actual = normalizeSpeech(typedAnswer);
    const containsTarget = expected.length > 0 && (" " + actual + " ").includes(" " + expected + " ");
    setTypingStatus(containsTarget && actual.split(" ").length >= 3 ? "matched" : "retry");
  };
  const advanceTypingPractice = () => { if (!active) return; setVoiceStatus("idle"); setVoiceTranscript(""); setVoiceError(""); setStep("voice"); };
  const advanceVoicePractice = () => { if (!active) return; completeLesson(); };
  if (authLoading) return <main className="auth-screen" dir="rtl"><div className="auth-loading"><span className="auth-brand-mark">L</span><b>LIR9</b><p>در حال بررسی حساب کاربری…</p></div></main>;
  if (!authSession) return <AuthScreen />;
  return <div className="app-shell" dir="rtl">
    <aside className={menuOpen ? "sidebar open" : "sidebar"}>
      <div className="brand"><div><b>LIR9</b><small>یادگیری، قدم‌به‌قدم</small></div><button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="بستن منو"><X/></button></div>
      <div className="lir-wallet"><span>موجودی امتیاز</span><b>{lirBalance} <small>LIR</small></b></div><div className="side-caption">منوی اصلی</div>
      <nav className="side-nav">{nav.map(item => <button key={item.id} className={tab === item.id ? "nav-link active" : "nav-link"} onClick={() => go(item.id)}><item.icon size={19}/><span>{item.label}</span>{tab === item.id && <i/>}</button>)}<button className={tab === "account" ? "nav-link active" : "nav-link"} onClick={() => go("account")}><UserRound size={19}/><span>حساب کاربری</span>{tab === "account" && <i/>}</button></nav>
      <div className="sidebar-progress"><div className="side-progress-icon"><Target size={18}/></div><div><b>مسیر فعلی تو</b><small>سطح A1 · مقدماتی</small></div><strong>{progress}٪</strong><div className="side-track"><i style={{width: progress + "%"}}/></div><button onClick={() => go("learn")}>ادامه مسیر <ChevronLeft size={14}/></button></div>
      <div className="sidebar-bottom"><span className="brand-mini">LIR9</span><span className="sidebar-user-email" title={authSession.user.email || ""}>{authSession.user.email}</span></div>
    </aside>
    {menuOpen && <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="بستن منو"/>}
    <main className="main-area">
      <header className="top-header"><button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو"><Menu/></button><div className="breadcrumbs"><span>فضای یادگیری</span><ChevronLeft size={14}/><b>{tab === "account" ? "حساب کاربری" : nav.find(n => n.id === tab)?.label}</b></div><div className="header-level"><span>امتیاز من</span><b className="header-lir-balance"><Star size={13} fill="currentColor" strokeWidth={1.8}/>{lirBalance} LIR</b><span>سطح</span><b>A1</b></div></header>
      <div className="page-wrap">
        {tab === "home" && <>
          <section className="welcome-block"><div><span className="eyebrow"><i/> فضای شخصی یادگیری</span><h1>از همین‌جا شروع کن.</h1><p>درس‌ها را به‌ترتیب کامل کن و میزان پیشرفتت را همین‌جا دنبال کن.</p></div></section>
          <button className="vip-promo-banner" onClick={() => go("vip")}><span className="vip-promo-icon"><Crown size={24}/></span><span className="vip-promo-copy"><small>شگفت انگیز! 🎉🔥</small><strong>اشتراک VIP</strong></span><span className="vip-promo-action">مشاهده پیشنهاد <ChevronLeft size={16}/></span><span className="vip-pulse" aria-hidden="true"/></button>
          <section className="next-card"><div className="next-card-copy"><span className="section-kicker">قدم بعدی تو</span><h2>{completed.length === lessons.length ? "آفرین! این بخش را تمام کردی." : nextLesson.title}</h2><p>{completed.length === lessons.length ? "می‌توانی درس‌ها را مرور کنی یا سراغ مسیر بعدی بروی." : nextLesson.description}</p><div className="next-meta"><span><Clock3 size={14}/>{nextLesson.duration}</span><span><BookOpen size={14}/>{nextLesson.skill}</span></div><button className="primary-button" onClick={() => openLesson(nextLesson.id)}>{completed.length === lessons.length ? "مرور درس‌ها" : "شروع درس بعدی"} <ArrowRight size={16}/></button></div><div className="next-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-core"><Languages size={37}/></div><span>قدم بعدی تو</span></div></section>
          <div className="section-heading"><div><span className="section-kicker">نمای کلی</span><h2>پیشرفت یادگیری</h2></div><button className="subtle-link" onClick={() => go("learn")}>دیدن همه درس‌ها <ChevronLeft size={15}/></button></div>
          <section className="overview-grid"><div className="overview-card progress-card"><div className="card-icon"><Target size={19}/></div><div className="overview-label">درصد تکمیل مسیر</div><div className="progress-big">{progress}<small>٪</small></div><div className="progress-bar"><i style={{width: progress + "%"}}/></div><p>تاکنون {completed.length} درس از {lessons.length} درس را کامل کرده‌ای.</p></div><div className="overview-card"><div className="card-icon"><Award size={19}/></div><div className="overview-label">امتیازهای من</div><div className="overview-number">{lirBalance}</div><p>با تکمیل هر درس برای نخستین بار، ۲ امتیاز LIR می‌گیری.</p></div><div className="overview-card"><div className="card-icon"><BookOpen size={19}/></div><div className="overview-label">درس‌های این بخش</div><div className="overview-number">{lessons.length}</div><p>درس کوتاه و مرحله‌به‌مرحله</p><button className="card-action" onClick={() => go("learn")}>رفتن به درس‌ها <ChevronLeft size={14}/></button></div><div className="overview-card"><div className="card-icon"><Bookmark size={19}/></div><div className="overview-label">لغت‌های ذخیره‌شده</div><div className="overview-number">{saved.length}</div><p>لغت‌هایی که برای مرور نگه داشتی</p><button className="card-action" onClick={() => go("vocabulary")}>مرور لغت‌ها <ChevronLeft size={14}/></button></div></section>
          <section className="simple-panel"><div className="section-heading"><div><span className="section-kicker">برنامه یادگیری</span><h2>درس‌های این بخش</h2></div><span className="level-chip">A1 · مقدماتی</span></div><div className="compact-lessons">{lessons.slice(0,5).map((lesson,index)=><button className="compact-lesson" key={lesson.id} onClick={() => openLesson(lesson.id)}><span className={completed.includes(String(lesson.id)) ? "compact-number done" : "compact-number"}>{completed.includes(String(lesson.id)) ? <CheckCircle2 size={17}/> : String(index+1).padStart(2,"0")}</span><span className="compact-copy"><b>{lesson.title}</b><small>{lesson.duration} · {lesson.skill}</small></span><ChevronLeft size={17}/></button>)}</div><button className="all-lessons-button" onClick={() => go("learn")}>مشاهده برنامه کامل آموزشی <ArrowRight size={15}/></button></section>
        </>}
        {tab === "learn" && <><div className="page-intro"><span className="section-kicker">مسیر آموزشی</span><h1>درس‌ها و تمرین‌ها</h1><p>درس‌ها را به ترتیب پیش ببر. بعد از هر آموزش، یک تمرین کوتاه داری.</p></div><section className="course-summary"><div><span className="level-chip">A1 · مقدماتی</span><h2>پایه‌های زبان انگلیسی</h2><p>از مکالمه‌های ابتدایی تا واژه‌ها و ساخت جمله‌های ساده را قدم‌به‌قدم یاد می‌گیری.</p><div className="course-progress-line"><i style={{width: progress + "%"}}/></div><small>{completed.length} از {lessons.length} درس تکمیل شده</small></div><div className="course-level">A1</div></section><div className="lesson-path">{lessons.map((lesson,index)=>{const done=completed.includes(String(lesson.id));const locked=index>0&&!lessons.slice(0,index).every(previous=>completed.includes(String(previous.id)));return <article className="path-item" key={lesson.id}><div className="path-rail"><span className={done?"path-dot done": "path-dot"}>{done?<CheckCircle2 size={17}/>:index+1}</span>{index!==lessons.length-1&&<i/>}</div><div className="path-card"><div className="path-card-main"><div><span className="path-unit">{lesson.unit}</span><h3>{lesson.title}</h3><p>{lesson.description}</p><div className="lesson-details"><span><Clock3 size={13}/>{lesson.duration}</span><span><BookOpen size={13}/>{lesson.skill}</span></div></div><button disabled={locked} className={done?"secondary-button":"small-primary"} onClick={()=>openLesson(lesson.id)}>{done?"مرور درس":locked?"قفل‌شده":"شروع"}{locked?<LockKeyhole size={14}/>:<ChevronLeft size={15}/>}</button></div></div></article>})}</div></>}
        {tab === "library" && <ContentLibrary />}
        {tab === "vocabulary" && <><div className="page-intro"><span className="section-kicker">مرور و تثبیت</span><h1>دفتر لغت من</h1><p>لغت‌های مهم را ذخیره کن تا هر وقت خواستی دوباره مرورشان کنی.</p></div><div className="vocab-toolbar"><div className="vocab-count"><b>{saved.length}</b><span>لغت ذخیره‌شده</span><button className={showSavedOnly?"filter-chip active":"filter-chip"} onClick={()=>setShowSavedOnly(value=>!value)} aria-pressed={showSavedOnly}><Bookmark size={13}/>{showSavedOnly?"فقط ذخیره‌شده‌ها":"نمایش همه لغت‌ها"}</button></div><label className="search-field"><Search size={17}/><input aria-label="جست‌وجوی لغت، تلفظ یا معنی" value={search} onChange={e=>setSearch(e.target.value)} placeholder="جست‌وجوی لغت یا معنی"/></label></div><div className="vocab-list">{filteredWords.map(word=>{const isSaved=saved.includes(word.word);return <article className="vocab-row" key={word.word}><div className="vocab-word"><h3>{word.word}</h3><small>{word.phonetic}</small></div><div className="vocab-meaning"><b>{word.meaning}</b><span>{word.example}</span></div><button className={isSaved?"bookmark-button saved":"bookmark-button"} onClick={()=>toggleWord(word.word)} aria-label={isSaved?"حذف از لغت‌های ذخیره‌شده":"ذخیره لغت"}><Bookmark size={18} fill={isSaved?"currentColor":"none"}/></button><button className="sound-button" onClick={()=>speak(word.word)} aria-label="شنیدن تلفظ"><Volume2 size={17}/></button></article>})}{filteredWords.length===0&&<div className="empty-state"><Bookmark size={24}/><b>{showSavedOnly?"هنوز لغتی ذخیره نکرده‌ای.":"لغتی پیدا نشد."}</b><span>{showSavedOnly?"با زدن نشانک کنار هر لغت، آن را اینجا نگه دار.":"عبارت دیگری جست‌وجو کن یا فیلتر را تغییر بده."}</span></div>}</div><p className="local-note">لغت‌های ذخیره‌شده فقط در همین مرورگر و دستگاه نگهداری می‌شوند.</p></>}
        {tab === "assistant" && <><div className="page-intro"><span className="section-kicker">همراه یادگیری</span><h1>دستیار LIRTO</h1><p>همیشه کنار تو؛ همراه هوشمند مسیر یادگیری زبان انگلیسی.</p></div><LirtoAssistant/></>}
        {tab === "vip" && <section className="vip-page"><div className="page-intro"><span className="section-kicker">پیشنهاد ویژه اعضای LIR9</span><h1>اشتراک VIP</h1><p>فرصتی ویژه برای همراهی جدی‌تر با مسیر یادگیری.</p></div><article className="vip-price-card"><div className="vip-card-glow"/><div className="vip-card-top"><span className="vip-crown"><Crown size={23}/></span><span className="vip-offer-tag">تخفیف شگفت‌انگیز 🎉</span></div><h2>اشتراک VIP</h2><p className="vip-card-subtitle">یک پیشنهاد ویژه برای مسیر یادگیری تو</p><div className="vip-price-area"><span className="vip-old-price">۸۹۰٬۰۰۰ تومان</span><div className="vip-current-price"><strong>۱۹۹٬۰۰۰</strong><span>تومان</span></div><span className="vip-discount">۷۸٪ تخفیف</span></div><div className="vip-divider"/><p className="vip-price-note">قیمت ویژه در مقایسه با قیمت اصلی اشتراک محاسبه شده است.</p><button className="vip-activate-button" onClick={()=>setNotice("درگاه پرداخت هنوز به LIR9 متصل نشده است؛ فعلاً امکان خرید واقعی وجود ندارد.")}>فعال‌سازی اشتراک VIP <Crown size={17}/></button><span className="vip-secure-note"><ShieldCheck size={14}/> پرداخت آنلاین پس از راه‌اندازی درگاه فعال می‌شود.</span></article></section>}
        {tab === "account" && <section className="account-page">
          <div className="account-hero"><div className="account-avatar"><UserRound size={32}/></div><div><span className="section-kicker">حساب شخصی در LIR9</span><h1>حساب کاربری</h1><p>اطلاعات حسابی که با آن وارد LIR9 شده‌ای.</p></div><span className="account-status"><i/> فعال</span></div>
          <div className="account-card"><div className="account-card-heading"><div><span className="section-kicker">اطلاعات حساب</span><h2>اطلاعات شخصی</h2></div><ShieldCheck size={22}/></div>
            <div className="account-detail"><span className="account-detail-icon"><UserRound size={18}/></span><div><small>نام نمایشی</small><strong>{String(authSession.user.user_metadata?.display_name || authSession.user.user_metadata?.full_name || "ثبت نشده")}</strong></div></div>
            <div className="account-detail"><span className="account-detail-icon"><Mail size={18}/></span><div><small>آدرس ایمیل</small><strong dir="ltr">{authSession.user.email || "ثبت نشده"}</strong></div></div>
            <div className="account-detail"><span className="account-detail-icon"><CalendarDays size={18}/></span><div><small>تاریخ ایجاد حساب</small><strong>{authSession.user.created_at ? new Date(authSession.user.created_at).toLocaleDateString("fa-IR", { year:"numeric", month:"long", day:"numeric" }) : "نامشخص"}</strong></div></div>
          </div>
          <p className="account-security-note"><LockKeyhole size={16}/> اطلاعات این بخش از حساب کاربری شما خوانده می‌شود.</p>
          <section className="account-session-card" aria-labelledby="account-session-title">
            <div className="account-session-copy"><span className="section-kicker">نشست کاربری</span><h2 id="account-session-title">مدیریت نشست کاربری</h2><p>برای پایان دادن به نشست فعلی و خروج امن از حساب LIR9 از این گزینه استفاده کن.</p></div>
            <button className="account-signout-button" type="button" onClick={handleSignOut} disabled={signOutBusy}>
              <LogOut size={17}/><span>{signOutBusy ? "در حال خروج…" : "خروج از حساب کاربری"}</span>
            </button>
          </section>
        </section>}
        {tab === "certificates" && <><div className="page-intro"><span className="section-kicker">افتخارات و دستاوردهای LIR9</span><h1>تالار افتخارات</h1><p>هر سطح، یک دستاورد تازه؛ گواهی نهایی پس از تأیید رسمی تکمیل دوره صادر خواهد شد.</p></div><section className="certificate-studio"><div className="certificate-status"><span className="certificate-status-icon"><LockKeyhole size={19}/></span><div><b>پیش‌نمایش طرح گواهی · فاقد اعتبار</b><p>این تصویر، قالب بصری گواهی LIR9 است و به‌تنهایی مدرک رسمی محسوب نمی‌شود. اطلاعات هر زبان‌آموز و شماره استعلام در نسخه نهایی باید به‌صورت امن و پویا درج شود.</p></div></div><div className="certificate-preview-wrap"><img className="certificate-artwork" src="/LIR9/file_00000000a8d481f4b0fd7bb26c886845.png" alt="قالب گواهی پایان سطح LIR9 با طراحی فارسی و انگلیسی"/></div><div className="certificate-future-note"><Award size={17}/><span>پس از راه‌اندازی حساب کاربری و تأیید تکمیل سطح در سرور، نام زبان‌آموز، سطح، تاریخ صدور و شناسه یکتای گواهی به‌صورت پویا اضافه می‌شوند.</span></div></section></>}
        {notice && <div className="notice" role="status" aria-live="polite">{notice}<button onClick={()=>setNotice("")} aria-label="بستن پیام">×</button></div>}
      </div>
      <footer className="page-footer"><span>LIR9</span><span>نسخه آزمایشی رابط کاربری · بازخورد تو مسیر را بهتر می‌کند.</span></footer>
    </main>
    <nav className="mobile-tabs">{nav.filter(item=>item.id!=="vip").map(item=><button key={item.id} className={tab===item.id?"selected":""} onClick={()=>go(item.id)}><item.icon size={19}/><span>{item.label}</span></button>)}</nav>
    {active && <div className="lesson-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)closeLesson();}}><section className="lesson-dialog" role="dialog" aria-modal="true" aria-labelledby="lesson-title"><header className="lesson-dialog-head"><div><span className="section-kicker">درس {String(active.id).padStart(2,"0")} · سطح A1</span><h2 id="lesson-title">{active.title}</h2></div><button className="icon-button" onClick={closeLesson} aria-label="بستن درس"><X/></button></header><div className="lesson-steps"><span className={step==="quiz"||step==="result"?"current":""}>۱. انتخابی</span><i/><span className={step==="typing"?"current":""}>۲. نوشتاری</span><i/><span className={step==="voice"?"current":""}>۳. گفتاری</span><i/><span className={step==="complete"?"current":""}>۴. پایان</span></div>{step==="learn"&&<><div className="lesson-body lesson-flow">
<div className="lesson-goal"><span>هدف این درس</span><p>{active.goal}</p></div>
<div className="lesson-phase"><header className="lesson-phase-head"><span>مرحله ۱</span><div><b>یادگیری مفهوم</b><small>اول موضوع را بفهم، بعد مثالش را ببین.</small></div></header>
<section className="lesson-teaching flow-section"><span className="lesson-section-label">مفهوم اصلی</span><p>{lessonContent[active.id].concept}</p></section>
<section className="lesson-teaching flow-section"><span className="lesson-section-label">آموزش قدم‌به‌قدم</span>{lessonContent[active.id].steps.map((item,index)=><div className="teaching-step" key={item.heading}><span>{index+1}</span><div><b>{item.heading}</b><p>{item.detail}</p></div></div>)}</section>
<div className="lesson-example flow-section"><small className="flow-label">نمونه کاربردی</small><strong dir="ltr">{active.example}</strong><span>{active.translation}</span><button onClick={()=>speak(active.example)}><Volume2 size={16}/> شنیدن تلفظ</button></div></div>
<div className="lesson-phase"><header className="lesson-phase-head"><span>مرحله ۲</span><div><b>استفاده در زبان واقعی</b><small>واژه‌ها را یاد بگیر و کاربردشان را در مکالمه ببین.</small></div></header>
<div className="lesson-vocabulary flow-section"><b className="flow-label">واژه‌ها و عبارت‌های مهم</b><div>{active.keyWords.map(item=><button key={item.word} onClick={()=>speak(item.word)}><span dir="ltr">{item.word}</span><small>{item.meaning}</small><Volume2 size={13}/></button>)}</div></div>
<section className="lesson-dialogue flow-section"><span className="lesson-section-label">مکالمه نمونه</span>{lessonContent[active.id].dialogue.map((line,index)=><div className="dialogue-line" key={index}><b aria-label={"گوینده "+line.speaker}>{line.speaker}</b><div className="dialogue-bubble"><strong dir="ltr">{line.line}</strong><small>{line.translation}</small><button className="dialogue-play" onClick={()=>speak(line.line)} aria-label={"پخش تلفظ جمله "+line.line}><Volume2 size={15}/><span>پخش</span></button></div></div>)}</section></div>
<div className="lesson-phase"><header className="lesson-phase-head"><span>مرحله ۳</span><div><b>مرور و تثبیت</b><small>نکته‌های مهم را مرور کن و برای آزمون آماده شو.</small></div></header>
<section className="lesson-mistake flow-section"><b>اشتباه رایج</b><p>{lessonContent[active.id].commonMistake}</p></section>
<div className="lesson-takeaway"><b>خلاصه درس</b><p>{active.takeaway}</p></div>
<section className="lesson-practice-tip flow-section"><b>قبل از آزمون</b><p>{lessonContent[active.id].practiceTip}</p></section></div>
</div><div className="dialog-actions lesson-practice-actions"><button className="primary-button" onClick={beginQuiz}>آزمون این درس <ArrowRight size={16}/></button></div></>}<>{step==="voice"&&<><div className="lesson-body voice-practice">
  <div className="voice-intro"><span className="voice-kicker"><Mic size={15}/> تمرین تلفظ با میکروفون</span><h3>این عبارت را با صدای بلند بگو</h3><p>با استفاده از عبارت هدف، یک جمله درباره خودت بساز و آن را با صدای بلند بگو. سیستم فقط وجود عبارت و چند کلمه بودن جمله را بررسی می‌کند؛ کیفیت تلفظ را به‌طور قطعی نمره نمی‌دهد.</p></div>
  <div className="voice-counter">تمرین جمله‌سازی و گفتار</div>
  <div className="voice-target"><strong dir="ltr">{active.keyWords[0].word.replace(/…/g,"").trim()}</strong><span>{active.keyWords[0].meaning}</span><button onClick={()=>speak(active.keyWords[0].word.replace(/…/g,"").trim())}><Volume2 size={15}/> شنیدن عبارت</button></div>
  <div className={"voice-status "+voiceStatus}>
    {voiceStatus==="matched"?<CheckCircle2 size={23}/>:voiceStatus==="listening"?<Mic size={22}/>:voiceStatus==="retry"||voiceStatus==="error"?<RotateCcw size={21}/>:<MicOff size={21}/>}
    <div><b>{voiceStatus==="matched"?"آفرین! پاسخ درست تشخیص داده شد.":voiceStatus==="listening"?"دارم گوش می‌دهم…":voiceStatus==="retry"?"پاسخ با عبارت هدف مطابقت نداشت. دوباره تلاش کن.":voiceStatus==="unsupported"?"این مرورگر تشخیص گفتار را پشتیبانی نمی‌کند.":voiceStatus==="error"?"مشکل در ضبط صدا":"آماده‌ای؟"}</b>
    <span>{voiceStatus==="error"?voiceError:voiceStatus==="unsupported"?"می‌توانی عبارت را دستی تمرین کنی؛ این مرورگر تشخیص گفتار را پشتیبانی نمی‌کند.":voiceStatus==="listening"?"صحبت کن؛ متن تشخیص‌داده‌شده همین‌جا نمایش داده می‌شود.":voiceStatus==="matched"?"پاسخت پذیرفته شد؛ در حال رفتن به مرحله بعدی…":voiceStatus==="retry"?"متن شنیده‌شده را پایین ببین و دوباره امتحان کن.":"برای شروع، دکمه میکروفون را بزن."}</span></div>
  </div>
  <div className="voice-transcript-panel" aria-live="polite">
    <span>متنی که سیستم از صدایت تشخیص داد</span>
    <strong dir="ltr" lang="en">{voiceTranscript || (voiceStatus==="listening"?"در انتظار تشخیص صدا…":"هنوز گفتاری ثبت نشده است.")}</strong>
  </div>
  {voiceStatus==="matched"?<div className="voice-auto-next"><CheckCircle2 size={16}/> پاسخ درست بود؛ خودکار ادامه می‌دهیم.</div>:voiceStatus==="unsupported"||voiceStatus==="error"?<button className="primary-button voice-next" onClick={advanceVoicePractice}>عبارت را با صدای بلند تمرین کردم <ArrowRight size={16}/></button>:<button className="primary-button voice-record" onClick={startVoiceAttempt} disabled={voiceStatus==="listening"}>{voiceStatus==="listening"?"در حال شنیدن…":"شروع ضبط و تشخیص"} <Mic size={16}/></button>}
  {voiceStatus==="retry"&&<button className="text-button voice-retry" onClick={startVoiceAttempt}>تلاش دوباره</button>}
  <p className="voice-privacy">برای این تمرین، تشخیص گفتار از قابلیت مرورگر استفاده می‌کند. در بعضی مرورگرها صدا برای پردازش به سرویس آنلاین ارسال می‌شود.</p>
</div><div className="dialog-actions"><button className="text-button" onClick={()=>setStep("learn")}>بازگشت به آموزش</button></div></>}</>{step==="typing"&&<><div className="lesson-body voice-practice">
<div className="voice-intro"><span className="voice-kicker"><BookOpen size={15}/> آزمون نوشتاری</span><h3>یک جمله از خودت بساز</h3><p>با عبارت هدف، یک جمله انگلیسی حداقل سه‌کلمه‌ای درباره خودت یا زندگی روزمره‌ات بنویس. لازم نیست جمله نمونه درس را کپی کنی.</p></div>
<div className="voice-counter">تمرین نوشتن در موقعیت واقعی</div>
<div className="voice-target"><strong>{active.keyWords[0].word.replace(/…/g,"").trim()}</strong><span>{active.keyWords[0].meaning} · با این عبارت جمله خودت را بساز</span><button onClick={()=>speak(active.keyWords[0].word.replace(/…/g,"").trim())}><Volume2 size={15}/> شنیدن عبارت</button></div>
<label className="typing-answer"><span>پاسخ تو</span><input dir="ltr" lang="en" autoComplete="off" spellCheck={false} value={typedAnswer} onChange={event=>{setTypedAnswer(event.target.value);setTypingStatus("idle");}} onKeyDown={event=>{if(event.key==="Enter")checkTypedAnswer();}} placeholder="Type in English…"/></label>
{typingStatus!=="idle"&&<div className={"voice-status "+typingStatus}>{typingStatus==="matched"?<CheckCircle2 size={22}/>:<RotateCcw size={21}/>}<div><b>{typingStatus==="matched"?"جمله‌ات ساخته شد!":"یک بار دیگر امتحان کن."}</b><span>{typingStatus==="matched"?"عبارت هدف و ساختار جمله شناسایی شد؛ درستی کامل گرامر هنوز با این بررسی خودکار سنجیده نمی‌شود.":"عبارت هدف را در یک جمله حداقل سه‌کلمه‌ای به کار ببر."}</span></div></div>}
{typingStatus==="matched"?<button className="primary-button voice-next" onClick={advanceTypingPractice}>{"رفتن به تمرین گفتاری"} <ArrowRight size={16}/></button>:<button className="primary-button voice-record" onClick={checkTypedAnswer} disabled={!typedAnswer.trim()}>بررسی پاسخ <CheckCircle2 size={16}/></button>}
<p className="voice-privacy">پاسخ تایپی در همین صفحه بررسی می‌شود و به سرویس بیرونی ارسال نمی‌شود.</p>
</div><div className="dialog-actions"><button className="text-button" onClick={()=>setStep("learn")}>بازگشت به آموزش</button></div></>}{step==="quiz"&&<><div className="lesson-body"><div className="quiz-progress-head"><span>سؤال {quizIndex+1} از {lessonContent[active.id].questions.length}</span><span>پاسخ درست: {quizScore}</span></div><div className="quiz-progress-track"><i style={{width:((quizIndex+1)/lessonContent[active.id].questions.length*100)+"%"}}/></div><span className="question-count">تمرین درک مطلب</span><h3>{lessonContent[active.id].questions[quizIndex].prompt}</h3><div className="answer-options">{(quizOptionOrders[quizIndex] ?? lessonContent[active.id].questions[quizIndex].options.map((_,index)=>index)).map((originalIndex,displayIndex)=>{const item=lessonContent[active.id].questions[quizIndex].options[originalIndex];return <button key={originalIndex} className={choice===displayIndex?"chosen":""} aria-pressed={choice===displayIndex} onClick={()=>setChoice(displayIndex)}><span>{String.fromCharCode(65+displayIndex)}</span>{item}</button>;})}</div></div><div className="dialog-actions"><button className="text-button" onClick={()=>setStep("learn")}>بازگشت به آموزش</button><button className="primary-button" disabled={choice===null} onClick={()=>{const originalIndex=(quizOptionOrders[quizIndex] ?? lessonContent[active.id].questions[quizIndex].options.map((_,index)=>index))[choice!];setQuizAnswers(previous=>({...previous,[quizIndex]:originalIndex}));setStep("result");}}>بررسی پاسخ <ArrowRight size={16}/></button></div></>}{step==="complete"&&<div className="lesson-complete"><div className="completion-confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="completion-medal"><Award size={42}/></div><span className="completion-kicker">LIR9 · LEVEL UP</span><h3>آفرین! این درس تموم شد!</h3><p>یک قدم مهم دیگه به انگلیسی بهتر نزدیک شدی.</p>{lastLessonRewarded?<div className="completion-reward"><CheckCircle2 size={19}/><b>۲ LIR</b><span>پاداش تکمیل درس</span></div>:<div className="completion-reward"><CheckCircle2 size={19}/><b>آفرین!</b><span>مرور دوباره درس</span></div>}<button className="primary-button" onClick={closeLesson}>ادامه مسیر یادگیری <ArrowRight size={17}/></button></div>}{step==="result"&&<><div className="lesson-body result-body"><div className={quizAnswers[quizIndex]===lessonContent[active.id].questions[quizIndex].correct?"result-check":"result-retry"}>{quizAnswers[quizIndex]===lessonContent[active.id].questions[quizIndex].correct?<CheckCircle2 size={30}/>:<BookOpen size={30}/>}</div><h3>{quizAnswers[quizIndex]===lessonContent[active.id].questions[quizIndex].correct?"آفرین! پاسخ درست است.":"این پاسخ درست نیست؛ از توضیح یاد بگیر."}</h3><p>پاسخ درست: <strong dir="ltr">{lessonContent[active.id].questions[quizIndex].options[lessonContent[active.id].questions[quizIndex].correct]}</strong></p><div className="answer-explanation"><b>چرا؟</b><span>{lessonContent[active.id].questions[quizIndex].explanation}</span></div></div><div className="dialog-actions">{quizIndex<lessonContent[active.id].questions.length-1?<><button className="text-button" onClick={()=>{setStep("quiz");setChoice(null);}}>تلاش دوباره</button><button className="primary-button" onClick={()=>{setQuizIndex(index=>index+1);setChoice(null);setStep("quiz");}}>سؤال بعدی <ArrowRight size={16}/></button></>:quizScore>=2?<button className="primary-button" onClick={beginTypingPractice}>ادامه به آزمون نوشتاری <ArrowRight size={16}/></button>:<button className="primary-button" onClick={beginQuiz}>تکرار آزمون انتخابی · {quizScore}/3 <RotateCcw size={16}/></button>}</div></>}</section></div>}
  </div>;
}
export default App;