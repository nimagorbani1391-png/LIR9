import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "./lib/supabase";
import { areLearningStatesEqual, loadLearningState, saveLearningState, type LearningState } from "./lib/learningState";
import { lessons, lessonContent, courseUnits, createOptionOrders } from "./data/curriculum";
import A2Course from "./components/A2Course";
import {
  LayoutDashboard, BookOpen, Library, MessageCircle, ChevronLeft,
  CheckCircle2, Clock3, Target, Languages, AlignJustify, X, Bookmark, Volume2,
  LockKeyhole, ArrowRight, Search, SearchCheck, Mic, MicOff, RotateCcw, Award, GraduationCap, UserRound, Mail, CalendarDays, ShieldCheck, LogOut, Crown, Star, Bot, Send, Sparkles, Info, Headset, Copy, UploadCloud
} from "lucide-react";

type Tab = "home" | "learn" | "vocabulary" | "library" | "assistant" | "certificates" | "vip" | "payment-confirmation" | "account" | "about";
type CertificateRecord = { student_name: string; level: string; score: number; verification_code: string; issued_at: string };
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
      <p className="auth-privacy-link"><a href={`${import.meta.env.BASE_URL}privacy.html`}>سیاست حریم خصوصی</a></p>
    </section>
    <div className="auth-background-glow" aria-hidden="true"/>
  </main>;
}



type PlacementQuestion = { prompt: string; options: string[]; answer: number; skill: string; };
const placementQuestions: PlacementQuestion[] = [
  { prompt: "Choose the correct greeting.", options: ["Good morning!", "I am twelve.", "It is a book."], answer: 0, skill: "مکالمه" },
  { prompt: "My name ___ Sara.", options: ["am", "is", "are"], answer: 1, skill: "فعل be" },
  { prompt: "I have ___ apple.", options: ["a", "an", "the"], answer: 1, skill: "حروف تعریف" },
  { prompt: "The plural of book is ___.", options: ["books", "bookes", "book"], answer: 0, skill: "اسم جمع" },
  { prompt: "This is Ali's phone. It is ___.", options: ["his", "he", "him"], answer: 0, skill: "مالکیت" },
  { prompt: "She ___ English every day.", options: ["study", "studies", "studying"], answer: 1, skill: "حال ساده" },
  { prompt: "___ you like tea?", options: ["Do", "Does", "Are"], answer: 0, skill: "سؤال حال ساده" },
  { prompt: "There ___ two chairs.", options: ["is", "are", "am"], answer: 1, skill: "There is / are" },
  { prompt: "He can ___ very well.", options: ["swim", "swims", "to swim"], answer: 0, skill: "توانایی" },
  { prompt: "The class starts ___ 8 o'clock.", options: ["in", "on", "at"], answer: 2, skill: "حروف اضافه زمان" }
];
function PlacementAssessment({ result, onResultChange }: { result: { score: number; date: string } | null; onResultChange: (result: { score: number; date: string }) => void }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const finish = () => {
    const finalScore = placementQuestions.reduce((total, question, i) => total + (answers[i] === question.answer ? 1 : 0), 0);
    const next = { score: finalScore, date: new Date().toISOString() };
    onResultChange(next);
    setStarted(false);
  };
  const reset = () => { setAnswers({}); setIndex(0); setStarted(true); };
  const band = result ? result.score <= 4 ? "بهتر است آموزش A1 را از پایه شروع کنی" : result.score <= 7 ? "بخشی از پایه A1 را بلدی؛ درس‌ها را کامل کن" : "پایه اولیه خوبی داری؛ مسیر کامل A1 را ادامه بده" : "";
  return <section className="placement-card">
    <div className="placement-card-icon"><Target size={22}/></div>
    <div className="placement-card-copy">
      <span className="section-kicker">شروع هوشمند مسیر</span>
      <h2>ارزیابی اولیه زبان انگلیسی</h2>
      <p>۱۰ سؤال کوتاه از مباحث پایه A1. نتیجه فقط یک تخمین اولیه است و جای آزمون استاندارد تعیین سطح را نمی‌گیرد.</p>
      {result && !started && <div className="placement-result"><strong>{result.score} از ۱۰</strong><span>{band}</span></div>}
      {started ? <div className="placement-quiz" dir="ltr">
        <div className="placement-quiz-top"><span>Question {index + 1} of {placementQuestions.length}</span><span>{Math.round((index + 1) / placementQuestions.length * 100)}%</span></div>
        <div className="placement-track"><i style={{width: ((index + 1) / placementQuestions.length * 100) + "%"}}/></div>
        <h3>{placementQuestions[index].prompt}</h3>
        <div className="placement-options">{placementQuestions[index].options.map((option, optionIndex) => <button key={option} className={answers[index] === optionIndex ? "selected" : ""} onClick={() => setAnswers(current => ({...current, [index]: optionIndex}))}>{option}</button>)}</div>
        <div className="placement-actions"><button className="secondary-button" disabled={index === 0} onClick={() => setIndex(value => value - 1)}>Previous</button><button className="small-primary" disabled={answers[index] === undefined} onClick={() => index === placementQuestions.length - 1 ? finish() : setIndex(value => value + 1)}>{index === placementQuestions.length - 1 ? "View result" : "Next"}</button></div>
      </div> : <button className="small-primary placement-start" onClick={reset}>{result ? "تکرار ارزیابی" : "شروع ارزیابی"} <ChevronLeft size={16}/></button>}
    </div>
  </section>;
}


type A1FinalQuestion = { prompt: string; options: string[]; skill: string };
const a1FinalQuestions: A1FinalQuestion[] = [
  {prompt:"Choose the correct greeting.",options:["I am from Spain.","It is a pencil.","Good morning!"],skill:"مکالمه"},
  {prompt:"My name ___ Daniel.",options:["are","is","am"],skill:"فعل be"},
  {prompt:"How do you spell CAT?",options:["C-A-T","K-E-T","C-E-T"],skill:"الفبا"},
  {prompt:"I'm from Brazil. I'm ___.",options:["Brazil","Brazilish","Brazilian"],skill:"کشورها و ملیت‌ها"},
  {prompt:"I have ___ orange.",options:["are","an","a"],skill:"حروف تعریف"},
  {prompt:"The plural of child is ___.",options:["children","childs","childes"],skill:"اسم جمع"},
  {prompt:"___ are my keys here in my hand.",options:["Those","That","These"],skill:"اشاره"},
  {prompt:"They ___ students.",options:["am","are","is"],skill:"فعل be"},
  {prompt:"This is Sara's bag. It is ___.",options:["hers","her","she"],skill:"مالکیت"},
  {prompt:"My brother ___ a new bike.",options:["have","is","has"],skill:"have و has"},
  {prompt:"She ___ to school every day.",options:["going","goes","go"],skill:"حال ساده"},
  {prompt:"I ___ drink coffee. I don't like it.",options:["never","am never","never am"],skill:"قید تکرار"},
  {prompt:"He can ___ very well.",options:["swims","to swim","swim"],skill:"توانایی"},
  {prompt:"I like ___ books.",options:["reads","reading","read"],skill:"علاقه‌ها"},
  {prompt:"The cat is ___ the table.",options:["under","at","between of"],skill:"حروف اضافه مکان"},
  {prompt:"The class starts ___ 9 o'clock.",options:["on","in","at"],skill:"زمان"},
  {prompt:"There ___ two windows in the room.",options:["am","are","is"],skill:"There is / are"},
  {prompt:"___ is your English teacher?",options:["Who","Where","When"],skill:"کلمات پرسشی"},
  {prompt:"___ you play tennis?",options:["Does","Are","Do"],skill:"سؤال حال ساده"},
  {prompt:"She ___ like tea.",options:["isn't","doesn't","don't"],skill:"منفی حال ساده"},
  {prompt:"They are ___ football now.",options:["playing","play","plays"],skill:"حال استمراری"},
  {prompt:"I know Ali. I know ___.",options:["he","his","him"],skill:"ضمیر مفعولی"},
  {prompt:"Can I have ___ water, please?",options:["an","some","a"],skill:"قابل‌شمارش و غیرقابل‌شمارش"},
  {prompt:"Which is a polite order?",options:["I'd like a sandwich, please.","Give me sandwich!","I sandwich."],skill:"سفارش غذا"},
  {prompt:"How much ___ these shoes?",options:["is","do","are"],skill:"خرید"},
  {prompt:"To go left, you say…",options:["Go straight.","Turn left.","Go right."],skill:"مسیرپرسیدن"},
  {prompt:"I go to work ___ bus.",options:["by","on","in"],skill:"حمل‌ونقل"},
  {prompt:"It's ___ today. Take an umbrella.",options:["sunny","dry","rainy"],skill:"آب‌وهوا"},
  {prompt:"Would you like ___ join us?",options:["for","to","at"],skill:"دعوت کردن"},
  {prompt:"Someone helps you. You say…",options:["Thank you.","Excuse me.","Good night."],skill:"عبارت‌های مؤدبانه"}
];
function A1FinalAssessment({ unlocked, result, onResultChange }: { unlocked: boolean; result: { score: number; date: string } | null; onResultChange: (result: { score: number; date: string }) => void }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [optionOrders, setOptionOrders] = useState<number[][]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const finish = async () => {
    if (!supabase || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const submittedAnswers = a1FinalQuestions.map((_, i) => answers[i]);
      const { data, error } = await supabase.rpc("submit_my_a1_final_assessment", { p_answers: submittedAnswers });
      if (error) throw error;
      const next = { score: Number(data.score), date: String(data.submitted_at) };
      onResultChange(next);
      setStarted(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setSubmitError(/maximum five final assessment attempts/i.test(message)
        ? "برای جلوگیری از حدس‌زدن پاسخ‌ها، حداکثر ۵ بار در ۲۴ ساعت می‌توانی آزمون پایانی را ثبت کنی."
        : "ثبت آزمون انجام نشد؛ اتصال را بررسی کن و دوباره تلاش کن.");
    } finally {
      setSubmitting(false);
    }
  };
  const reset = () => {
    setAnswers({});
    setIndex(0);
    setOptionOrders(a1FinalQuestions.map(question => {
      const order = question.options.map((_, optionIndex) => optionIndex);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return order;
    }));
    setSubmitError("");
    setStarted(true);
  };
  const current = a1FinalQuestions[index];
  const currentOrder = optionOrders[index] ?? current.options.map((_, optionIndex) => optionIndex);
  return <section className="a1-final-card">
    <div className="a1-final-head"><div><span className="section-kicker">ارزیابی پایانی</span><h2>آزمون جامع پایان A1</h2><p>۳۰ سؤال از گرامر، واژگان و کاربرد زبان؛ برای قبولی باید دست‌کم ۲۴ پاسخ درست داشته باشی.</p></div><div className="a1-final-mark"><Award size={24}/><b>۳۰</b><small>سؤال</small></div></div>
    {!unlocked ? <div className="a1-final-locked"><LockKeyhole size={18}/><span>پس از تکمیل همه {lessons.length} درس، آزمون جامع برایت باز می‌شود.</span></div> : started ? <div className="a1-final-quiz" dir="ltr">
      <div className="a1-final-progress"><span>Question {index+1} of {a1FinalQuestions.length}</span><b>{Math.round((index+1)/a1FinalQuestions.length*100)}%</b></div>
      <div className="a1-final-track"><i style={{width:((index+1)/a1FinalQuestions.length*100)+"%"}}/></div>
      <small className="a1-final-skill">{current.skill}</small><h3>{current.prompt}</h3>
      <div className="a1-final-options">{currentOrder.map(originalIndex=><button type="button" key={originalIndex} className={answers[index]===originalIndex?"selected":""} onClick={()=>setAnswers(prev=>({...prev,[index]:originalIndex}))}>{current.options[originalIndex]}</button>)}</div>
      {submitError && <p className="certificate-error" role="alert">{submitError}</p>}
      <div className="a1-final-actions"><button type="button" className="secondary-button" disabled={index===0||submitting} onClick={()=>setIndex(v=>v-1)}>Previous</button><button type="button" className="small-primary" disabled={answers[index]===undefined||submitting} onClick={()=>index===a1FinalQuestions.length-1?void finish():setIndex(v=>v+1)}>{submitting?"در حال ثبت…":index===a1FinalQuestions.length-1?"Submit test":"Next"}</button></div>
    </div> : result ? <div className="a1-final-result"><strong>{result.score} / 30</strong><span>{result.score>=24?"آزمون را با موفقیت گذراندی. عالیه!":"هنوز به حدنصاب نرسیدی؛ بخش‌های نیازمند تمرین را مرور کن."}</span><small>{result.score>=24?"حدنصاب قبولی: ۲۴ از ۳۰":"حدنصاب قبولی: ۲۴ از ۳۰"} · {new Date(result.date).toLocaleDateString("fa-IR")}</small><button type="button" className="small-primary" onClick={reset}>شرکت دوباره در آزمون</button></div> : <button type="button" className="small-primary a1-final-start" onClick={reset}>شروع آزمون جامع <ArrowRight size={16}/></button>}
    
  </section>;
}

type LibraryItem = {
  id: string; title: string; summary: string; category: "داستان" | "مقاله" | "مکالمه";
  level: string; minutes: number; file: string; featured?: boolean;
};
type LibraryArticle = { title: string; introduction: string; paragraphs: string[]; vocabulary?: { word: string; meaning: string }[]; };
const libraryCache = new Map<string, LibraryItem[] | LibraryArticle>();
function ContentLibrary({ listeningCompleted, listeningScores, onListeningProgressChange, isVip, onUpgrade }: { listeningCompleted: string[]; listeningScores: Record<string, boolean>; onListeningProgressChange: (completed: string[], scores: Record<string, boolean>) => void; isVip: boolean; onUpgrade: () => void }) {
  const [items, setItems] = useState<LibraryItem[]>(() => (libraryCache.get("index") as LibraryItem[] | undefined) ?? []);
  const [loading, setLoading] = useState(() => !libraryCache.has("index"));
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("همه");
  const [libraryMode, setLibraryMode] = useState<"reading" | "listening">("reading");
  const [selected, setSelected] = useState<LibraryItem | null>(null);
  const [article, setArticle] = useState<LibraryArticle | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [vipModalOpen, setVipModalOpen] = useState(false);

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
    fetch(`${import.meta.env.BASE_URL}content/library/index.json?v=20261122-19`, { cache: "no-store" })
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
  const categoryCounts = useMemo(() => ({ "همه": items.length, "داستان": items.filter(item => item.category === "داستان").length, "مقاله": items.filter(item => item.category === "مقاله").length, "مکالمه": items.filter(item => item.category === "مکالمه").length }), [items]);
  const readingMinutes = useMemo(() => items.reduce((total, item) => total + item.minutes, 0), [items]);

  if (selected && isVip) return <section className="library-page">
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
    <div className="page-intro library-intro"><span className="section-kicker">یادگیری فراتر از درس‌ها</span><h1>کتابخانه محتوا</h1><p>مطالب آموزشی و تمرین‌های شنیداری را در یک فضای منظم دنبال کن.</p></div>
    <div className="library-mode-switch" role="tablist" aria-label="بخش‌های کتابخانه">
      <button type="button" role="tab" aria-selected={libraryMode === "reading"} className={libraryMode === "reading" ? "active" : ""} onClick={() => setLibraryMode("reading")}><BookOpen size={16}/> مطالب کتابخانه</button>
      <button type="button" role="tab" aria-selected={libraryMode === "listening"} className={libraryMode === "listening" ? "active" : ""} onClick={() => { if (!isVip) { setVipModalOpen(true); return; } setLibraryMode("listening"); }}><Volume2 size={16}/>{!isVip && <LockKeyhole size={13}/>} آزمایشگاه شنیداری</button>
    </div>
    {libraryMode === "listening" ? <ListeningLab completed={listeningCompleted} scores={listeningScores} onProgressChange={onListeningProgressChange}/> : <>
    <div className="library-feature">
      <div className="library-feature-icon"><BookOpen size={27}/></div>
      <div className="library-feature-copy"><span>فضای مطالعه LIR9</span><h2>دانش بیشتر، قدم‌های کوچک‌تر</h2><p>داستان، مقاله و مکالمه‌های کاربردی؛ متناسب با سطح زبانت.</p></div>
      <div className="library-feature-stats" aria-label="آمار کتابخانه"><div><b>{items.length}</b><span>مطلب آموزشی</span></div><div><b>{categoryCounts["مکالمه"]}</b><span>مکالمه کاربردی</span></div><div><b>{readingMinutes}</b><span>دقیقه مطالعه</span></div></div>
      <span className="library-feature-mark">LIR9</span>
    </div>
    <label className="library-search"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="جست‌وجو در داستان‌ها، مقاله‌ها و مکالمه‌ها…" aria-label="جست‌وجو در کتابخانه محتوا"/></label>
    <div className="library-filters" aria-label="دسته‌بندی محتوا">
      {["همه", "داستان", "مقاله", "مکالمه"].map(item => <button key={item} className={category===item?"active":""} onClick={() => setCategory(item)} aria-pressed={category===item}><span>{item}</span><small>{categoryCounts[item as keyof typeof categoryCounts]}</small></button>)}
    </div>
    {loading && <div className="library-state"><span className="library-spinner"/> در حال دریافت فهرست کتابخانه…</div>}
    {error && <div className="library-error" role="alert">{error}<button onClick={() => { setError(""); setLoading(true); window.location.reload(); }}>تلاش دوباره</button></div>}
    {!loading && !error && <div className="library-grid">
      {filtered.map((item, index) => <button className={item.featured?"library-card is-featured":"library-card"} key={item.id} onClick={() => { if (!isVip) { setVipModalOpen(true); return; } setSelected(item); setError(""); }} style={{animationDelay:`${index*45}ms`}}>
        <div className={`library-card-art art-${item.category === "داستان" ? "story" : item.category === "مقاله" ? "article" : "dialogue"}`}><span>{item.category}</span><BookOpen size={25}/>{item.featured&&<em>پیشنهاد LIR9</em>}</div>
        <div className="library-card-copy"><div className="library-card-meta"><span>{item.level}</span><span><Clock3 size={12}/>{item.minutes} دقیقه</span></div><h3>{item.title}</h3><p>{item.summary}</p><span className="library-card-link">{isVip ? "مطالعه مطلب" : "محتوای ویژه VIP"} {isVip ? <ArrowRight size={15}/> : <LockKeyhole size={14}/>}</span></div>
      </button>)}
      {!filtered.length && <div className="library-empty"><Search size={24}/><b>مطلبی پیدا نشد</b><span>عبارت جست‌وجو یا دسته‌بندی را تغییر بده.</span></div>}
    </div>}
    </>}
    {vipModalOpen && !isVip && createPortal(
      <div className="lirto-quota-overlay library-vip-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setVipModalOpen(false); }}>
        <section className="lirto-quota-dialog library-vip-dialog" role="dialog" aria-modal="true" aria-labelledby="library-vip-title">
          <button className="lirto-quota-close" type="button" onClick={() => setVipModalOpen(false)} aria-label="بستن پیام"><X size={19}/></button>
          <span className="lirto-quota-crown"><Crown size={27}/></span>
          <span className="lirto-quota-eyebrow">LIR9 · VIP CONTENT</span>
          <h3 id="library-vip-title">این محتوا ویژه اعضای VIP است!</h3>
          <p>برای مطالعه این داستان یا مقاله و استفاده از تمرین‌های آزمایشگاه شنیداری، به اشتراک VIP نیاز داری. با فعال‌سازی VIP می‌توانی به این محتوای آموزشی دسترسی پیدا کنی.</p>
          <button className="lirto-quota-upgrade" type="button" onClick={onUpgrade}>مشاهده پلن VIP <Crown size={17}/></button>
          <button className="lirto-quota-later" type="button" onClick={() => setVipModalOpen(false)}>فعلاً نه</button>
        </section>
      </div>,
      document.body
    )}
  </section>;
}


type LirtoMessage = { role: "assistant" | "user"; text: string };
type LirtoQuota = { is_vip: boolean; used: number; limit: number | null; remaining: number | null; allowed: boolean };

function LirtoAssistant({ onUpgrade }: { onUpgrade: () => void }) {
  const [messages, setMessages] = useState<LirtoMessage[]>([
    { role: "assistant", text: "سلام! من LIRTO هستم؛ همراه هوشمندت برای یادگیری زبان انگلیسی. ✨" }
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [quota, setQuota] = useState<LirtoQuota | null>(null);
  const [quotaModalOpen, setQuotaModalOpen] = useState(false);
  const quotaExhausted = Boolean(quota && !quota.is_vip && (quota.remaining ?? 0) <= 0);

  useEffect(() => {
    let active = true;
    if (!supabase) return;
    void (async () => {
      const { data, error } = await supabase.rpc("get_lirto_daily_usage");
      if (!active) return;
      if (error) {
        console.error("Could not load LIRTO daily quota:", error);
        return;
      }
      const currentQuota = data as LirtoQuota;
      setQuota(currentQuota);
      if (!currentQuota.is_vip && currentQuota.used >= 3) setQuotaModalOpen(true);
    })();
    return () => { active = false; };
  }, []);

  const sendMessage = async () => {
    const value = draft.trim();
    if (!value || isSending || quotaExhausted) return;
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

      if (data?.usage) setQuota(data.usage as LirtoQuota);
      if (data?.limit_reached) {
        setQuotaModalOpen(true);
        return;
      }
      if (typeof data?.reply !== "string" || !data.reply.trim()) {
        throw new Error(data?.error || "پاسخ معتبری دریافت نشد.");
      }
      setMessages(current => [...current, { role: "assistant", text: data.reply }]);
      const updatedQuota = data?.usage as LirtoQuota | undefined;
      if (updatedQuota && !updatedQuota.is_vip && updatedQuota.used >= 3) {
        setQuotaModalOpen(true);
      }
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
      {["چطور انگلیسی سلام کنم؟","گرامر حال ساده رو توضیح بده","با من انگلیسی مکالمه کن"].map(item => <button key={item} type="button" disabled={isSending || quotaExhausted} onClick={() => setDraft(item)}>{item}</button>)}
    </div>
    <div className="lirto-quota-status" aria-live="polite">
      {quota?.is_vip
        ? <><Crown size={14}/> دسترسی VIP · بدون محدودیت پیام</>
        : quota
          ? <><ShieldCheck size={14}/> سهمیه امروز: {quota.used} از ۳ پیام</>
          : <><ShieldCheck size={14}/> در حال بررسی سهمیه روزانه…</>}
    </div>
    <form className="lirto-composer" onSubmit={event => { event.preventDefault(); void sendMessage(); }}>
      <input value={draft} onChange={event => setDraft(event.target.value)} placeholder={quotaExhausted ? "سهمیه امروزت تمام شده است." : "پیامت رو برای LIRTO بنویس..."} aria-label="پیام به LIRTO" maxLength={1200} disabled={isSending || quotaExhausted}/>
      <button type="submit" disabled={!draft.trim() || isSending || quotaExhausted} aria-label="ارسال پیام"><Send size={17}/></button>
    </form>
    {quotaExhausted && <button className="lirto-quota-upgrade-inline" type="button" onClick={onUpgrade}><Crown size={16}/> مشاهده پلن VIP و ارتقاء حساب</button>}
    <div className="lirto-footnote"><ShieldCheck size={13}/> اتصال امن به موتور هوش مصنوعی Groq</div>

    {quotaModalOpen && quotaExhausted && <div className="lirto-quota-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setQuotaModalOpen(false); }}>
      <section className="lirto-quota-dialog" role="dialog" aria-modal="true" aria-labelledby="lirto-quota-title">
        <button className="lirto-quota-close" type="button" onClick={() => setQuotaModalOpen(false)} aria-label="بستن پیام"><X size={19}/></button>
        <span className="lirto-quota-crown"><Crown size={27}/></span>
        <span className="lirto-quota-eyebrow">LIR9 · VIP</span>
        <h3 id="lirto-quota-title">شما سهمیه‌ی خود را مصرف کرده‌اید!</h3>
        <p>سهمیه رایگان امروز شما به پایان رسیده است. برای استفاده نامحدود از دستیار، پلن خود را ارتقاء دهید.</p>
        <button className="lirto-quota-upgrade" type="button" onClick={onUpgrade}>مشاهده پلن VIP <Crown size={17}/></button>
        <button className="lirto-quota-later" type="button" onClick={() => setQuotaModalOpen(false)}>فعلاً نه</button>
        <small>سهمیه رایگان با شروع روز جدید دوباره فعال می‌شود.</small>
      </section>
    </div>}
  </section>;
}


type ListeningExercise={id:string;level:"A1"|"A2";title:string;situation:string;duration:string;script:string;question:string;options:string[];answer:number;explanation:string;vocabulary:{word:string;meaning:string}[]};
const listeningExercises:ListeningExercise[]=[
{id:"cafe-order",level:"A1",title:"At the café",situation:"سفارش دادن در کافه",duration:"۲۰ ثانیه",script:"Good morning. Can I have a small coffee, please? Of course. Would you like milk? Yes, please. Anything else? No, that's all. Thank you.",question:"What does the customer order?",options:["A small coffee","A cup of tea","A large juice"],answer:0,explanation:"Can I have a small coffee? یعنی یک قهوه کوچک می‌خواهم.",vocabulary:[{word:"small",meaning:"کوچک"},{word:"Would you like…?",meaning:"میل داری…؟"},{word:"That's all.",meaning:"همین کافی است."}]},
{id:"daily-routine",level:"A1",title:"A busy morning",situation:"برنامه صبحگاهی",duration:"۲۵ ثانیه",script:"I usually wake up at seven. I have breakfast with my family, and then I walk to school. My first class starts at eight thirty.",question:"How does the speaker go to school?",options:["By bus","On foot","By car"],answer:1,explanation:"walk to school یعنی پیاده به مدرسه رفتن.",vocabulary:[{word:"usually",meaning:"معمولاً"},{word:"wake up",meaning:"بیدار شدن"},{word:"on foot",meaning:"پیاده"}]},
{id:"weekend-plan",level:"A1",title:"Weekend plans",situation:"برنامه آخر هفته",duration:"۲۵ ثانیه",script:"Are you free on Saturday, Emma? Yes, I am. Let's visit the museum in the afternoon. Great idea. We can meet at two o'clock.",question:"Where do they plan to go?",options:["To the cinema","To the museum","To the library"],answer:1,explanation:"Let's visit the museum یعنی بیا از موزه دیدن کنیم.",vocabulary:[{word:"free",meaning:"وقت‌داشتن"},{word:"visit",meaning:"بازدید کردن"},{word:"afternoon",meaning:"بعدازظهر"}]},
{id:"lost-item",level:"A2",title:"A missing bag",situation:"پیدا کردن کیف گمشده",duration:"۳۰ ثانیه",script:"Excuse me, I think I left my bag on the train. What does it look like? It's black, and it has a red label. When did you last see it? Just before I got off at Central Station.",question:"What color is the label on the bag?",options:["Blue","Black","Red"],answer:2,explanation:"It has a red label یعنی یک برچسب قرمز دارد.",vocabulary:[{word:"left",meaning:"جا گذاشتم"},{word:"label",meaning:"برچسب"},{word:"got off",meaning:"پیاده شدم"}]},
{id:"weather-change",level:"A2",title:"Changing weather",situation:"تغییر وضعیت هوا",duration:"۳۵ ثانیه",script:"The weather was sunny this morning, so we decided to have lunch outside. But dark clouds appeared around noon, and it started raining. We quickly moved everything indoors.",question:"Why did they move everything indoors?",options:["It became too cold","It started raining","The restaurant closed"],answer:1,explanation:"it started raining یعنی باران شروع شد؛ به همین دلیل وسایل را به داخل بردند.",vocabulary:[{word:"decided",meaning:"تصمیم گرفتند"},{word:"clouds",meaning:"ابرها"},{word:"indoors",meaning:"در فضای داخل"}]}

,{id:"home-evening",level:"A1",title:"At home",situation:"توصیف خانه و وسایل",duration:"۲۵ ثانیه",script:"Welcome to my home. There is a small kitchen and a bright living room. My books are on the table, and my bag is under the chair.",question:"Where is the bag?",options:["On the table","Under the chair","In the kitchen"],answer:1,explanation:"My bag is under the chair یعنی کیف من زیر صندلی است.",vocabulary:[{word:"living room",meaning:"اتاق نشیمن"},{word:"bright",meaning:"روشن"},{word:"under",meaning:"زیر"}]},
{id:"family-talk",level:"A1",title:"My family",situation:"معرفی اعضای خانواده",duration:"۲۵ ثانیه",script:"My name is Leo. I live with my parents and my younger sister. My father is a teacher, and my mother works in a hospital. We have dinner together every evening.",question:"Where does Leo's mother work?",options:["At a school","At a hospital","At a shop"],answer:1,explanation:"My mother works in a hospital یعنی مادرم در بیمارستان کار می‌کند.",vocabulary:[{word:"parents",meaning:"والدین"},{word:"younger",meaning:"کوچک‌تر"},{word:"together",meaning:"با هم"}]},
{id:"supermarket",level:"A1",title:"At the supermarket",situation:"خرید مواد غذایی",duration:"۳۰ ثانیه",script:"Excuse me, how much are these apples? They are two euros a kilo. Okay. I would like one kilo of apples and a bottle of water, please.",question:"What does the customer buy?",options:["Apples and water","Bread and milk","Oranges and juice"],answer:0,explanation:"یک کیلو سیب و یک بطری آب سفارش می‌دهد.",vocabulary:[{word:"a kilo",meaning:"یک کیلو"},{word:"bottle",meaning:"بطری"},{word:"customer",meaning:"مشتری"}]},
{id:"weather-report",level:"A1",title:"Today's weather",situation:"گزارش ساده آب‌وهوا",duration:"۲۵ ثانیه",script:"Good morning. Today is sunny and warm. The temperature is twenty degrees. It may be cloudy in the evening, so take a light jacket with you.",question:"What is the weather like in the morning?",options:["Snowy and cold","Sunny and warm","Rainy and windy"],answer:1,explanation:"Today is sunny and warm یعنی امروز آفتابی و گرم است.",vocabulary:[{word:"temperature",meaning:"دما"},{word:"cloudy",meaning:"ابری"},{word:"jacket",meaning:"ژاکت"}]},
{id:"city-directions",level:"A1",title:"Finding the library",situation:"پرسیدن مسیر در شهر",duration:"۳۰ ثانیه",script:"Excuse me, where is the library? Go straight for two minutes. Turn right at the bank. The library is next to the park, opposite the school.",question:"Where is the library?",options:["Next to the park","Behind the bank","Inside the school"],answer:0,explanation:"The library is next to the park یعنی کتابخانه کنار پارک است.",vocabulary:[{word:"go straight",meaning:"مستقیم برو"},{word:"turn right",meaning:"به راست بپیچ"},{word:"opposite",meaning:"روبروی"}]},
{id:"daily-routine-evening",level:"A1",title:"After school",situation:"برنامه بعد از مدرسه",duration:"۲۵ ثانیه",script:"I finish school at two o'clock. I go home and have lunch. Then I do my homework. In the evening, I sometimes play football with my friends.",question:"What does the speaker do after lunch?",options:["Goes to sleep","Does homework","Goes shopping"],answer:1,explanation:"Then I do my homework یعنی بعد از آن تکالیفم را انجام می‌دهم.",vocabulary:[{word:"finish",meaning:"تمام کردن"},{word:"homework",meaning:"تکلیف"},{word:"sometimes",meaning:"گاهی"}]},
{id:"new-classmate",level:"A1",title:"A new classmate",situation:"آشنایی با هم‌کلاسی جدید",duration:"۲۵ ثانیه",script:"Hi, I'm Emma. What's your name? My name is David. Nice to meet you, David. Where are you from? I'm from Canada, but I live here now.",question:"Where is David from?",options:["Canada","Australia","Germany"],answer:0,explanation:"I'm from Canada یعنی اهل کانادا هستم.",vocabulary:[{word:"classmate",meaning:"هم‌کلاسی"},{word:"Nice to meet you",meaning:"از آشنایی خوشحالم"},{word:"live",meaning:"زندگی کردن"}]},
{"id":"buying-ticket","level":"A1","title":"Buying a ticket","situation":"خرید بلیت اتوبوس","duration":"۳۰ ثانیه","script":"Hello. Can I have a ticket to the airport, please? Single or return? A single ticket, please. That is eight euros. Here you are. Thank you. The bus leaves from platform three.","question":"Which platform does the bus leave from?","options":["Platform one","Platform two","Platform three"],"answer":2,"explanation":"The bus leaves from platform three یعنی اتوبوس از سکوی شماره سه حرکت می‌کند.","vocabulary":[{"word":"ticket","meaning":"بلیت"},{"word":"single","meaning":"یک‌طرفه"},{"word":"platform","meaning":"سکو"}]},
{"id":"hotel-check-in","level":"A2","title":"Checking into a hotel","situation":"پذیرش در هتل","duration":"۳۵ ثانیه","script":"Good evening. I have a reservation under the name Taylor. Certainly. Could I see your passport, please? Here you are. Your room is on the fourth floor. Breakfast is served from seven until ten. Is Wi-Fi included? Yes, the password is on your key card.","question":"Where can the guest find the Wi-Fi password?","options":["On the room door","On the key card","At the restaurant"],"answer":1,"explanation":"The password is on your key card یعنی رمز وای‌فای روی کارت اتاق نوشته شده است.","vocabulary":[{"word":"reservation","meaning":"رزرو"},{"word":"fourth floor","meaning":"طبقه چهارم"},{"word":"included","meaning":"شامل‌شده"}]},
{"id":"cooking-pasta","level":"A1","title":"Making pasta","situation":"دنبال کردن دستور آشپزی","duration":"۳۰ ثانیه","script":"First, boil some water in a large pot. Add the pasta and cook it for ten minutes. While the pasta is cooking, cut two tomatoes. Then drain the pasta and add the tomatoes and some cheese.","question":"How long should the pasta cook?","options":["Five minutes","Ten minutes","Fifteen minutes"],"answer":1,"explanation":"Cook it for ten minutes یعنی آن را ده دقیقه بپز.","vocabulary":[{"word":"boil","meaning":"جوشاندن"},{"word":"pot","meaning":"قابلمه"},{"word":"drain","meaning":"آبکش کردن"}]},
{"id":"doctor-appointment","level":"A2","title":"At the doctor's","situation":"گفت‌وگو در مطب پزشک","duration":"۳۵ ثانیه","script":"Doctor: What seems to be the problem? Patient: I have had a headache since yesterday. Doctor: Do you also have a fever? Patient: No, I don't think so. Doctor: I will check your temperature. Please drink plenty of water and get some rest.","question":"How long has the patient had a headache?","options":["Since this morning","Since yesterday","For one week"],"answer":1,"explanation":"Since yesterday یعنی از دیروز؛ بیمار از دیروز سردرد داشته است.","vocabulary":[{"word":"headache","meaning":"سردرد"},{"word":"fever","meaning":"تب"},{"word":"temperature","meaning":"دما"}]},
{"id":"job-interview-listening","level":"A2","title":"A job interview","situation":"پاسخ به سؤال مصاحبه کاری","duration":"۳۵ ثانیه","script":"Interviewer: Why would you like to work with us? Candidate: I enjoy solving problems and working in a team. I also learn new tools quickly. Interviewer: Can you tell me about a project you worked on? Candidate: Yes. At school, I worked with two classmates to build a simple website.","question":"How many classmates worked on the website with the candidate?","options":["One","Two","Three"],"answer":1,"explanation":"I worked with two classmates یعنی با دو هم‌کلاسی کار کردم.","vocabulary":[{"word":"candidate","meaning":"داوطلب"},{"word":"solve problems","meaning":"حل مسئله"},{"word":"project","meaning":"پروژه"}]},
{"id":"weekend-weather-plan","level":"A1","title":"A change of plans","situation":"تغییر برنامه به دلیل آب‌وهوا","duration":"۳۰ ثانیه","script":"Are we still going to the park this afternoon? I don't think so. The weather report says it will rain after lunch. Let's go to the shopping center instead. Good idea. We can meet at the bus stop at two.","question":"Why are they not going to the park?","options":["It will rain","It is too hot","The park is closed"],"answer":0,"explanation":"The weather report says it will rain یعنی گزارش هواشناسی می‌گوید باران خواهد بارید.","vocabulary":[{"word":"weather report","meaning":"گزارش هواشناسی"},{"word":"instead","meaning":"به‌جای آن"},{"word":"bus stop","meaning":"ایستگاه اتوبوس"}]}
];
function ListeningLab({ completed, scores, onProgressChange }: { completed: string[]; scores: Record<string, boolean>; onProgressChange: (completed: string[], scores: Record<string, boolean>) => void }){
 const [level,setLevel]=useState<"all"|"A1"|"A2">("all"),[selected,setSelected]=useState("cafe-order"),[choice,setChoice]=useState<number|null>(null),[checked,setChecked]=useState(false),[revealed,setRevealed]=useState(false),[speed,setSpeed]=useState(1),[playing,setPlaying]=useState(false),[audioError,setAudioError]=useState("");
 const available=listeningExercises.filter(x=>level==="all"||x.level===level),exercise=listeningExercises.find(x=>x.id===selected)??listeningExercises[0],score=Object.values(scores).filter(Boolean).length;
 const stop=()=>{if("speechSynthesis"in window)window.speechSynthesis.cancel();setPlaying(false)};
 useEffect(()=>()=>{if("speechSynthesis"in window)window.speechSynthesis.cancel()},[]);
 const play=()=>{if(!("speechSynthesis"in window)||typeof SpeechSynthesisUtterance==="undefined"){setAudioError("پخش گفتار در این مرورگر پشتیبانی نمی‌شود.");return}stop();setAudioError("");const u=new SpeechSynthesisUtterance(exercise.script);u.lang="en-US";u.rate=speed;u.pitch=1;u.onstart=()=>setPlaying(true);u.onend=()=>setPlaying(false);u.onerror=()=>{setPlaying(false);setAudioError("پخش صدا کامل نشد؛ دوباره تلاش کن.")};window.speechSynthesis.speak(u)};
 const selectExercise=(id:string)=>{stop();setSelected(id);setChoice(null);setChecked(false);setRevealed(false);setAudioError("")};
 const check=()=>{if(choice===null)return;const nextScores={...scores,[exercise.id]:choice===exercise.answer};const nextCompleted=choice===exercise.answer&&!completed.includes(exercise.id)?[...completed,exercise.id]:completed;onProgressChange(nextCompleted,nextScores);setChecked(true)};
 return <section className="listening-lab" dir="rtl">
 <div className="listening-hero"><div className="listening-hero-copy"><span className="listening-kicker"><i/> LISTENING LAB</span><h1>گوش کن، بفهم، پیشرفت کن.</h1><p>مکالمه‌های کوتاه و کاربردی انگلیسی را بشنو، جزئیات را تشخیص بده و درک شنیداری‌ات را بسنج.</p><div className="listening-hero-meta"><span><Volume2 size={15}/> پخش قابل تکرار</span><span><Target size={15}/> آزمون درک مطلب</span></div></div><div className="listening-hero-art" aria-hidden="true"><div className="listening-wave"><i/><i/><i/><i/><i/><i/><i/></div><div className="listening-headphone"><Volume2 size={32}/></div></div></div>
 <div className="listening-stats"><div><span>تمرین‌های موجود</span><b>{listeningExercises.length}</b><small>از سطح A1 تا A2</small></div><div><span>تمرین‌های تکمیل‌شده</span><b>{completed.length}<small> / {listeningExercises.length}</small></b><small>با پاسخ صحیح</small></div><div><span>پاسخ‌های صحیح</span><b>{score}</b><small>در تلاش‌های ثبت‌شده</small></div></div>
 <div className="listening-section-head"><div><span className="section-kicker">کتابخانه شنیداری</span><h2>یک تمرین انتخاب کن</h2></div><div className="listening-level-filter">{([{id:"all",label:"همه"},{id:"A1",label:"A1"},{id:"A2",label:"A2"}] as const).map(x=><button key={x.id} className={level===x.id?"active":""} onClick={()=>{setLevel(x.id);const first=listeningExercises.find(e=>x.id==="all"||e.level===x.id);if(first)selectExercise(first.id)}}>{x.label}</button>)}</div></div>
 <div className="listening-layout"><aside className="listening-playlist">{available.map((x,i)=><button key={x.id} className={selected===x.id?"listening-track active":"listening-track"} onClick={()=>selectExercise(x.id)}><span className="listening-track-number">{completed.includes(x.id)?<CheckCircle2 size={17}/>:String(i+1).padStart(2,"0")}</span><span className="listening-track-copy"><b>{x.title}</b><small>{x.situation}</small><em>{x.level} · {x.duration}</em></span><ChevronLeft size={17}/></button>)}</aside>
 <div className="listening-workspace"><div className="listening-exercise-head"><div><span className="listening-level-tag">{exercise.level} · تمرین شنیداری</span><h2>{exercise.title}</h2><p>{exercise.situation}</p></div><span className="listening-duration"><Clock3 size={14}/>{exercise.duration}</span></div>
 <div className="listening-player"><div className="listening-player-top"><span><Volume2 size={16}/> پخش مکالمه</span><span className={playing?"listening-live is-playing":"listening-live"}>{playing?"در حال پخش":"آماده پخش"}</span></div><div className="listening-player-main"><button className="listening-play-button" onClick={playing?stop:play} aria-label={playing?"توقف پخش":"پخش مکالمه"}>{playing?<span className="listening-pause-icon">Ⅱ</span>:<Volume2 size={23}/>}</button><div className="listening-player-description"><b>{playing?"با دقت گوش کن…":"برای شنیدن مکالمه آماده‌ای؟"}</b><span>می‌توانی چند بار به مکالمه گوش بدهی.</span></div><div className="listening-speed"><label htmlFor="listening-speed">سرعت</label><select id="listening-speed" value={speed} onChange={e=>{setSpeed(Number(e.target.value));if(playing)stop()}}><option value={0.8}>۰٫۸×</option><option value={1}>۱×</option><option value={1.2}>۱٫۲×</option></select></div></div><div className={playing?"listening-equalizer playing":"listening-equalizer"} aria-hidden="true">{Array.from({length:31},(_,i)=><i key={i} style={{"--bar":String(12+(i*17%28))} as React.CSSProperties}/>)}</div><div className="listening-player-actions"><button onClick={play}><RotateCcw size={14}/> پخش دوباره</button><button onClick={()=>setRevealed(v=>!v)}><BookOpen size={14}/> {revealed?"پنهان کردن متن":"نمایش متن مکالمه"}</button></div>{audioError&&<p className="listening-audio-error" role="status">{audioError}</p>}{revealed&&<div className="listening-transcript"><span>متن مکالمه</span><p dir="ltr" lang="en">{exercise.script}</p></div>}</div>
 <div className="listening-question"><div className="listening-question-label"><Target size={16}/> سنجش درک مطلب</div><h3 dir="ltr" lang="en">{exercise.question}</h3><div className="listening-options">{exercise.options.map((o,i)=><button key={o} disabled={checked} className={checked&&i===exercise.answer?"correct":checked&&i===choice?"incorrect":choice===i?"selected":""} onClick={()=>setChoice(i)}><span>{String.fromCharCode(65+i)}</span>{o}{checked&&i===exercise.answer&&<CheckCircle2 size={17}/>}</button>)}</div>{checked&&<div className={choice===exercise.answer?"listening-feedback correct":"listening-feedback incorrect"}><b>{choice===exercise.answer?"آفرین! درست شنیدی.":"این بار درست نبود؛ دوباره گوش کن."}</b><p>{exercise.explanation}</p></div>}<div className="listening-question-actions">{checked?<button className="listening-next" onClick={()=>{const i=available.findIndex(x=>x.id===exercise.id);selectExercise(available[(i+1)%available.length].id)}}>{available.length>1?"تمرین بعدی":"بازگشت به تمرین"} <ChevronLeft size={16}/></button>:<button className="listening-check" disabled={choice===null} onClick={check}>بررسی پاسخ <CheckCircle2 size={16}/></button>}</div></div>
 <div className="listening-vocabulary"><span className="section-kicker">واژه‌های کلیدی</span><div>{exercise.vocabulary.map(x=><div key={x.word}><b dir="ltr">{x.word}</b><span>{x.meaning}</span></div>)}</div></div></div></div>
 <p className="listening-note"><ShieldCheck size={14}/> صدا با قابلیت گفتار مرورگر ساخته می‌شود؛ نوع صدا و کیفیت آن به دستگاه و مرورگر بستگی دارد. نتیجه تمرین فعلاً در همین مرورگر ذخیره می‌شود.</p>
 </section>
}


function App() {
  const [authSession, setAuthSession] = useState<import("@supabase/supabase-js").Session | null>(null);
  const [libraryIsVip, setLibraryIsVip] = useState(false);
  const [serverCompletedCount, setServerCompletedCount] = useState(0);
  const [serverProgressReady, setServerProgressReady] = useState(false);
  const [verifiedFinalResult, setVerifiedFinalResult] = useState<{ score: number; date: string } | null>(null);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [certificateIssuing, setCertificateIssuing] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [signOutBusy, setSignOutBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [learningStateReady, setLearningStateReady] = useState(false);
  const [learningStateError, setLearningStateError] = useState("");
  const [tab, setTab] = useState<Tab>("home");
  const [learningLevel, setLearningLevel] = useState<"A1" | "A2">("A1");
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
  const [placementResult, setPlacementResult] = useState<{ score: number; date: string } | null>(null);
  const [a1FinalResult, setA1FinalResult] = useState<{ score: number; date: string } | null>(null);
  const [issuedCertificate, setIssuedCertificate] = useState<CertificateRecord | null>(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateError, setCertificateError] = useState("");
  const [listeningCompleted, setListeningCompleted] = useState<string[]>([]);
  const [listeningScores, setListeningScores] = useState<Record<string, boolean>>({});
  const lastPersistedSnapshotRef = useRef<string | null>(null);
  const [search, setSearch] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [notice, setNotice] = useState("");
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const active = lessons.find(l => l.id === activeLesson);
  const progress = Math.round(completed.length / lessons.length * 100);
  const nextLesson = lessons.find(l => !completed.includes(String(l.id))) ?? lessons[0];
  const filteredWords = useMemo(() => vocabulary.filter(w => (!showSavedOnly || saved.includes(w.word)) && (w.word + w.phonetic + w.meaning + w.example + w.lesson).toLowerCase().includes(search.trim().toLowerCase())), [search, showSavedOnly, saved]);
  const nav = [
    { id: "home" as Tab, label: "خانه", icon: LayoutDashboard },
    { id: "learn" as Tab, label: "درس‌ها", icon: BookOpen },
    { id: "vocabulary" as Tab, label: "لغت‌های من", icon: Languages },
    { id: "library" as Tab, label: "کتابخانه محتوا", icon: Library },
    { id: "assistant" as Tab, label: "دستیار", icon: MessageCircle },
    { id: "certificates" as Tab, label: "مدارک من", icon: GraduationCap },
    { id: "vip" as Tab, label: "اشتراک VIP", icon: Crown },
  ];
  const go = (next: Tab) => { setTab(next); setMenuOpen(false); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const submitVipPayment = async (event: import("react").FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !authSession?.user?.id || !authSession.user.email || !paymentReceipt || paymentSubmitting) return;
    const file = paymentReceipt;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) { setPaymentError("فقط تصویر JPG، PNG، WEBP یا فایل PDF قابل قبول است."); return; }
    if (file.size < 1 || file.size > 5 * 1024 * 1024) { setPaymentError("حجم فایل رسید باید کمتر از ۵ مگابایت باشد."); return; }
    setPaymentSubmitting(true); setPaymentError("");
    const extension = file.type === "image/jpeg" ? "jpg" : file.type === "application/pdf" ? "pdf" : file.type.split("/")[1];
    const receiptPath = `${authSession.user.id}/${crypto.randomUUID()}.${extension}`;
    try {
      const { error: uploadError } = await supabase.storage.from("vip-payment-receipts").upload(receiptPath, file, {
        cacheControl: "3600", contentType: file.type, upsert: false,
      });
      if (uploadError) throw uploadError;
      const { data, error: invokeError } = await supabase.functions.invoke("submit-vip-payment", {
        body: { receipt_path: receiptPath },
      });
      if (invokeError || data?.error) {
        if (data?.error) await supabase.storage.from("vip-payment-receipts").remove([receiptPath]);
        throw invokeError ?? new Error(data.error);
      }
      setPaymentSubmitted(true);
      setPaymentReceipt(null);
    } catch (caught) {
      setPaymentError(caught instanceof Error ? caught.message : "ثبت درخواست انجام نشد. دوباره تلاش کن.");
    } finally {
      setPaymentSubmitting(false);
    }
  };
  useEffect(() => {
    if (!authLoading && authSession && new URLSearchParams(window.location.search).get("action") === "delete-account") {
      setTab("account");
      setDeleteConfirmOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [authLoading, authSession]);
  useEffect(() => {
    if (!authSession || !supabase || !learningStateReady) { setServerProgressReady(false); return; }
    let active = true;
    setServerProgressReady(false);
    void (async () => {
      try {
        const { data, error } = await supabase.rpc("get_my_a1_certificate_status");
        if (error) throw error;
        if (!active) return;
        const verifiedLessons = Array.isArray(data?.completed_lessons) ? data.completed_lessons.map(String) : [];
        setServerCompletedCount(Number(data?.completed_count) || 0);
        setCompleted(verifiedLessons);
        writeStore("lir9-completed", verifiedLessons);
        setVerifiedFinalResult(data?.final_score === null || data?.final_score === undefined ? null : {
          score: Number(data.final_score),
          date: String(data.final_submitted_at || new Date().toISOString())
        });
        setServerProgressReady(true);
      } catch (error) {
        console.error("Could not load server-verified A1 progress:", error);
        if (active) {
          setServerCompletedCount(0);
          setCompleted([]);
          writeStore("lir9-completed", []);
          setVerifiedFinalResult(null);
          setServerProgressReady(true);
        }
      }
    })();
    return () => { active = false; };
  }, [authSession?.user.id, learningStateReady]);
  useEffect(() => {
    if (tab !== "certificates" || !authSession || !supabase) return;
    let active = true;
    setCertificateLoading(true);
    setCertificateError("");
    void (async () => {
      try {
        const { data, error } = await supabase.rpc("get_my_a1_certificate");
        if (!active) return;
        if (error) { setCertificateError("دریافت وضعیت مدرک انجام نشد. دوباره تلاش کن."); return; }
        setIssuedCertificate(data as CertificateRecord | null);
      } catch {
        if (active) setCertificateError("دریافت وضعیت مدرک انجام نشد. دوباره تلاش کن.");
      } finally {
        if (active) setCertificateLoading(false);
      }
    })();
    return () => { active = false; };
  }, [tab, authSession?.user.id]);
  const openLesson = (id: number) => { const index = lessons.findIndex(lesson => lesson.id === id); if (index < 0) return; if (!serverProgressReady || index > serverCompletedCount) { setNotice("برای باز کردن این درس، ابتدا درس‌های قبلی را با آزمون معتبر تکمیل کن."); setMenuOpen(false); return; } setActiveLesson(id); setStep("learn"); setChoice(null); setQuizIndex(0); setQuizAnswers({}); setQuizOptionOrders(createOptionOrders(lessonContent, id)); setMenuOpen(false); };
  const closeLesson = () => { recognitionRef.current?.abort(); recognitionRef.current = null; setActiveLesson(null); setChoice(null); setStep("learn"); setQuizIndex(0); setQuizAnswers({}); setQuizOptionOrders({}); setVoiceStatus("idle"); setVoiceTranscript(""); setTypedAnswer(""); setTypingStatus("idle"); };
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

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
    const timeout = window.setTimeout(() => { void advanceVoicePractice(); }, 900);
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

  useEffect(() => {
    if (!authSession || !supabase) { setLibraryIsVip(false); return; }
    let active = true;
    void supabase.rpc("get_lirto_daily_usage").then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error("Could not verify VIP access for content library:", error);
        setLibraryIsVip(false);
        return;
      }
      setLibraryIsVip(Boolean((data as LirtoQuota | null)?.is_vip));
    });
    return () => { active = false; };
  }, [authSession?.user.id]);

  useEffect(() => {
    const userId = authSession?.user.id;
    if (!userId) {
      setLearningStateReady(false);
      return;
    }
    let active = true;
    setLearningStateReady(false);
    setLearningStateError("");
    const readNumber = (key: string) => {
      try {
        const value = Number(localStorage.getItem(key) || 0);
        return Number.isFinite(value) && value >= 0 ? value : 0;
      } catch { return 0; }
    };
    const readBooleanMap = (key: string): Record<string, boolean> => {
      try {
        const value: unknown = JSON.parse(localStorage.getItem(key) || "{}");
        if (!value || typeof value !== "object" || Array.isArray(value)) return {};
        return Object.fromEntries(Object.entries(value).filter(([, item]) => typeof item === "boolean")) as Record<string, boolean>;
      } catch { return {}; }
    };
    const readResult = (key: string): { score: number; date: string } | null => {
      try {
        const value = JSON.parse(localStorage.getItem(key) || "null");
        return value && Number.isFinite(value.score) && typeof value.date === "string" ? value : null;
      } catch { return null; }
    };
    const latestResult = (
      first: { score: number; date: string } | null,
      second: { score: number; date: string } | null
    ) => {
      if (!first) return second;
      if (!second) return first;
      return new Date(first.date).getTime() >= new Date(second.date).getTime() ? first : second;
    };
    const sync = async () => {
      try {
        const cloud = await loadLearningState();
        if (!active) return;
        const owner = localStorage.getItem("lir9-learning-owner");
        const canImportLocal = !owner || owner === userId;
        const local: LearningState = canImportLocal ? {
          completedLessons: readStore("lir9-completed", []),
          rewardedLessons: readStore("lir9-rewarded", []),
          lirBalance: readNumber("lir9-balance"),
          savedWords: readStore("lir9-saved", ["Hello"]),
          listeningCompleted: readStore("lir9-listening-completed", []),
          listeningScores: readBooleanMap("lir9-listening-scores"),
          placementResult: readResult("lir9-placement-result"),
          a1FinalResult: readResult("lir9-a1-final-result"),
        } : {};
        const merged: LearningState = {
          completedLessons: [...new Set([...(local.completedLessons || []), ...(cloud?.completedLessons || [])])].filter(id => lessons.some(lesson => String(lesson.id) === id)),
          rewardedLessons: [...new Set([...(local.rewardedLessons || []), ...(cloud?.rewardedLessons || [])])],
          lirBalance: Math.max(local.lirBalance || 0, cloud?.lirBalance || 0),
          savedWords: [...new Set([...(local.savedWords || []), ...(cloud?.savedWords || [])])].filter(word => vocabulary.some(item => item.word === word)),
          listeningCompleted: [...new Set([...(local.listeningCompleted || []), ...(cloud?.listeningCompleted || [])])],
          listeningScores: { ...(local.listeningScores || {}), ...(cloud?.listeningScores || {}) },
          placementResult: latestResult(local.placementResult || null, cloud?.placementResult || null),
          a1FinalResult: latestResult(local.a1FinalResult || null, cloud?.a1FinalResult || null),
        };
        setCompleted(merged.completedLessons || []);
        setRewarded(merged.rewardedLessons || []);
        setLirBalance(merged.lirBalance || 0);
        setSaved(merged.savedWords || ["Hello"]);
        setPlacementResult(merged.placementResult || null);
        setA1FinalResult(merged.a1FinalResult || null);
        setListeningCompleted(merged.listeningCompleted || []);
        setListeningScores(merged.listeningScores || {});
        localStorage.setItem("lir9-completed", JSON.stringify(merged.completedLessons || []));
        localStorage.setItem("lir9-rewarded", JSON.stringify(merged.rewardedLessons || []));
        localStorage.setItem("lir9-balance", String(merged.lirBalance || 0));
        localStorage.setItem("lir9-saved", JSON.stringify(merged.savedWords || ["Hello"]));
        localStorage.setItem("lir9-listening-completed", JSON.stringify(merged.listeningCompleted || []));
        localStorage.setItem("lir9-listening-scores", JSON.stringify(merged.listeningScores || {}));
        if (merged.placementResult) localStorage.setItem("lir9-placement-result", JSON.stringify(merged.placementResult));
        else localStorage.removeItem("lir9-placement-result");
        if (merged.a1FinalResult) localStorage.setItem("lir9-a1-final-result", JSON.stringify(merged.a1FinalResult));
        else localStorage.removeItem("lir9-a1-final-result");
        if (!areLearningStatesEqual(cloud, merged)) {
          await saveLearningState(merged, userId);
        }
        lastPersistedSnapshotRef.current = JSON.stringify(merged);
        if (!active) return;
        localStorage.setItem("lir9-learning-owner", userId);
        setLearningStateReady(true);
      } catch (error) {
        console.error("Learning state sync failed:", error);
        const diagnostic = error && typeof error === "object"
          ? error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown }
          : null;
        const diagnosticMessage = [
          diagnostic?.message,
          diagnostic?.code ? "کد: " + String(diagnostic.code) : "",
          diagnostic?.details,
          diagnostic?.hint,
        ].filter(value => typeof value === "string" && value.trim()).join(" | ");
        if (active) setLearningStateError(
          "همگام‌سازی پیشرفت آموزشی انجام نشد. جزئیات خطا: " + (diagnosticMessage || "خطای نامشخص")
        );
      }
    };
    void sync();
    return () => { active = false; };
  }, [authSession?.user.id]);

  useEffect(() => {
    if (!authSession || !learningStateReady) return;
    const snapshot: LearningState = {
      completedLessons: completed,
      rewardedLessons: rewarded,
      lirBalance,
      savedWords: saved,
      listeningCompleted,
      listeningScores,
      placementResult,
      a1FinalResult,
    };
    const snapshotKey = JSON.stringify(snapshot);
    if (snapshotKey === lastPersistedSnapshotRef.current) return;
    const timer = window.setTimeout(() => {
      void saveLearningState(snapshot, authSession.user.id).then(() => {
        lastPersistedSnapshotRef.current = snapshotKey;
      }).catch(error => {
        console.error("Could not save learning state:", error);
        setNotice("ذخیره پیشرفت در فضای ابری انجام نشد؛ دوباره تلاش کن.");
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [authSession?.user.id, learningStateReady, completed, rewarded, lirBalance, saved, listeningCompleted, listeningScores, placementResult, a1FinalResult]);

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
  const handleDeleteAccount = async () => {
    if (!supabase || !authSession || deleteBusy) return;
    setDeleteBusy(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account", { method: "POST" });
      if (error) throw error;
      await supabase.auth.signOut({ scope: "local" });
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith("lir9-"))
          .forEach(key => localStorage.removeItem(key));
      } catch { /* local storage may be unavailable */ }
      setDeleteConfirmOpen(false);
      setAuthSession(null);
      setLearningStateReady(false);
      setCompleted([]);
      setRewarded([]);
      setSaved([]);
      setLirBalance(0);
    } catch (error) {
      console.error("Account deletion failed:", error);
      setNotice("حذف حساب انجام نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.");
      setDeleteConfirmOpen(false);
    } finally {
      setDeleteBusy(false);
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
  const handleIssueCertificate = async () => {
    if (!supabase || certificateIssuing) return;
    setCertificateIssuing(true);
    setCertificateError("");
    try {
      const { data, error } = await supabase.rpc("issue_my_a1_certificate");
      if (error) throw error;
      setIssuedCertificate(data as CertificateRecord);
    } catch (error) {
      console.error("Certificate issuance failed:", error);
      setCertificateError("صدور گواهی انجام نشد. شرایط را دوباره بررسی کن و تلاش کن.");
    } finally {
      setCertificateIssuing(false);
    }
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
  const advanceVoicePractice = async () => {
    if (!active || lessonSubmitting || !supabase) return;
    const questions = lessonContent[active.id]?.questions ?? [];
    const answers = questions.map((_, index) => quizAnswers[index]);
    if (answers.length !== 5 || answers.some(answer => !Number.isInteger(answer))) {
      setNotice("پاسخ‌های آزمون کامل نیستند؛ آزمون این درس را دوباره انجام بده.");
      return;
    }
    setLessonSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("submit_my_a1_lesson_assessment", {
        p_lesson_id: active.id,
        p_answers: answers
      });
      if (error) throw error;
      if (!data?.passed) {
        setNotice("نمره این درس به حدنصاب ۴ از ۵ نرسید؛ آزمون را دوباره انجام بده.");
        setStep("learn");
        return;
      }
      setServerCompletedCount(Number(data.completed_count) || serverCompletedCount);
      completeLesson();
    } catch (error) {
      console.error("Server verification for lesson failed:", error);
      setVoiceStatus("idle");
      setNotice("ثبت امن نتیجه درس انجام نشد. اتصال را بررسی کن و دوباره تلاش کن.");
    } finally {
      setLessonSubmitting(false);
    }
  };
  if (authLoading) return <main className="auth-screen" dir="rtl"><div className="auth-loading"><span className="auth-brand-mark">L</span><b>LIR9</b><p>در حال بررسی حساب کاربری…</p></div></main>;
  if (!authSession) return <AuthScreen />;
  if (!learningStateReady && learningStateError) return <main className="auth-screen" dir="rtl"><div className="auth-loading"><span className="auth-brand-mark">L</span><b>LIR9</b><p>{learningStateError}</p><button className="auth-submit" onClick={() => window.location.reload()}>تلاش دوباره</button></div></main>;
  if (!learningStateReady) return <main className="auth-screen" dir="rtl"><div className="auth-loading"><span className="auth-brand-mark">L</span><b>LIR9</b><p>در حال همگام‌سازی امن پیشرفت آموزشی…</p></div></main>;
  return <div className="app-shell" dir="rtl">
    <aside className={menuOpen ? "sidebar open" : "sidebar"}>
      <div className="brand"><div><b>LIR9</b><small>یادگیری، قدم‌به‌قدم</small></div><button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="بستن منو"><X/></button></div>
      <button className={tab === "about" ? "sidebar-about active" : "sidebar-about"} onClick={() => go("about")}><span className="sidebar-about-icon"><Info size={17}/></span><span><b>درباره LIR9</b><small>با مسیر و هدف ما آشنا شو</small></span><ChevronLeft size={15}/></button><div className="side-caption">منوی اصلی</div>
      <nav className="side-nav">{nav.map(item => <button key={item.id} className={tab === item.id ? "nav-link active" : "nav-link"} onClick={() => go(item.id)}><item.icon size={19}/><span>{item.label}</span>{tab === item.id && <i/>}</button>)}<button className={tab === "account" ? "nav-link active" : "nav-link"} onClick={() => go("account")}><UserRound size={19}/><span>حساب کاربری</span>{tab === "account" && <i/>}</button><a className="nav-link" href={`${import.meta.env.BASE_URL}verify.html`}><SearchCheck size={19}/><span>استعلام مدرک</span></a><a className="nav-link" href="https://rubika.ir/IM_NIMA_GORBANI" target="_blank" rel="noopener noreferrer"><Headset size={19}/><span>پشتیبانی</span></a></nav>
      <div className="sidebar-progress"><div className="side-progress-icon"><Target size={18}/></div><div><b>مسیر فعلی تو</b><small>سطح A1 · مقدماتی</small></div><strong>{progress}٪</strong><div className="side-track"><i style={{width: progress + "%"}}/></div><button onClick={() => go("learn")}>ادامه مسیر <ChevronLeft size={14}/></button></div>
      <div className="sidebar-bottom"><span className="brand-mini">LIR9</span><span className="sidebar-user-email" title={authSession.user.email || ""}>{authSession.user.email}</span></div>
    </aside>
    {menuOpen && <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="بستن منو"/>}
    <main className="main-area">
      <header className="top-header"><button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو"><AlignJustify size={21} strokeWidth={1.8}/></button><div className="breadcrumbs"><span>فضای یادگیری</span><ChevronLeft size={14}/><b>{tab === "account" ? "حساب کاربری" : tab === "payment-confirmation" ? "تأیید خرید اشتراک" : nav.find(n => n.id === tab)?.label}</b></div><div className="header-level"><span>امتیاز من</span><b className="header-lir-balance"><Star size={13} fill="currentColor" strokeWidth={1.8}/>{lirBalance} LIR</b><span>سطح</span><b>A1</b></div></header>
      <div className="page-wrap">
        {tab === "home" && <>
          <section className="welcome-block"><div><span className="eyebrow"><i/> فضای شخصی یادگیری</span><h1>از همین‌جا شروع کن.</h1><p>درس‌ها را به‌ترتیب کامل کن و میزان پیشرفتت را همین‌جا دنبال کن.</p></div></section>
          <button className="vip-promo-banner" onClick={() => go("vip")}><span className="vip-promo-icon"><Crown size={24}/></span><span className="vip-promo-copy"><small>شگفت انگیز! 🎉🔥</small><strong>اشتراک VIP</strong></span><span className="vip-promo-action">مشاهده پیشنهاد <ChevronLeft size={16}/></span><span className="vip-pulse" aria-hidden="true"/></button>
          <section className="next-card"><div className="next-card-copy"><span className="section-kicker">قدم بعدی تو</span><h2>{completed.length === lessons.length ? "آفرین! این بخش را تمام کردی." : nextLesson.title}</h2><p>{completed.length === lessons.length ? "می‌توانی درس‌ها را مرور کنی یا سراغ مسیر بعدی بروی." : nextLesson.description}</p><div className="next-meta"><span><Clock3 size={14}/>{nextLesson.duration}</span><span><BookOpen size={14}/>{nextLesson.skill}</span></div><button className="primary-button" onClick={() => openLesson(nextLesson.id)}>{completed.length === lessons.length ? "مرور درس‌ها" : "شروع درس بعدی"} <ArrowRight size={16}/></button></div><div className="next-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-core"><Languages size={37}/></div><span>قدم بعدی تو</span></div></section>
          <div className="section-heading"><div><span className="section-kicker">نمای کلی</span><h2>پیشرفت یادگیری</h2></div><button className="subtle-link" onClick={() => go("learn")}>دیدن همه درس‌ها <ChevronLeft size={15}/></button></div>
          <section className="overview-grid"><div className="overview-card progress-card"><div className="card-icon"><Target size={19}/></div><div className="overview-label">درصد تکمیل مسیر</div><div className="progress-big">{progress}<small>٪</small></div><div className="progress-bar"><i style={{width: progress + "%"}}/></div><p>تاکنون {completed.length} درس از {lessons.length} درس را کامل کرده‌ای.</p></div><div className="overview-card"><div className="card-icon"><Award size={19}/></div><div className="overview-label">امتیازهای من</div><div className="overview-number">{lirBalance}</div><p>با تکمیل هر درس برای نخستین بار، ۲ امتیاز LIR می‌گیری.</p></div><div className="overview-card"><div className="card-icon"><BookOpen size={19}/></div><div className="overview-label">درس‌های این بخش</div><div className="overview-number">{lessons.length}</div><p>درس کوتاه و مرحله‌به‌مرحله</p><button className="card-action" onClick={() => go("learn")}>رفتن به درس‌ها <ChevronLeft size={14}/></button></div><div className="overview-card"><div className="card-icon"><Bookmark size={19}/></div><div className="overview-label">لغت‌های ذخیره‌شده</div><div className="overview-number">{saved.length}</div><p>لغت‌هایی که برای مرور نگه داشتی</p><button className="card-action" onClick={() => go("vocabulary")}>مرور لغت‌ها <ChevronLeft size={14}/></button></div></section>
          <section className="simple-panel"><div className="section-heading"><div><span className="section-kicker">برنامه یادگیری</span><h2>درس‌های این بخش</h2></div><span className="level-chip">A1 · مقدماتی</span></div><div className="compact-lessons">{lessons.slice(0,5).map((lesson,index)=><button className="compact-lesson" key={lesson.id} onClick={() => openLesson(lesson.id)}><span className={completed.includes(String(lesson.id)) ? "compact-number done" : "compact-number"}>{completed.includes(String(lesson.id)) ? <CheckCircle2 size={17}/> : String(index+1).padStart(2,"0")}</span><span className="compact-copy"><b>{lesson.title}</b><small>{lesson.duration} · {lesson.skill}</small></span><ChevronLeft size={17}/></button>)}</div><button className="all-lessons-button" onClick={() => go("learn")}>مشاهده برنامه کامل آموزشی <ArrowRight size={15}/></button></section>
        </>}
        {tab === "learn" && learningLevel === "A2" && <A2Course onBack={() => setLearningLevel("A1")} />}
        {tab === "learn" && learningLevel === "A1" && <>
          <div className="a2-entry-row"><div><b>سطح بعدی آماده یادگیری است</b><small>مسیر مستقل A2 · ۲۴ درس ساختاریافته</small></div><button onClick={() => setLearningLevel("A2")}>ورود به سطح A2 <ChevronLeft size={15}/></button></div>
          <section className="learning-hero">
            <div className="learning-hero-copy">
              <span className="learning-eyebrow"><span/> مسیر یادگیری انگلیسی · سطح A1</span>
              <h1>قدم‌به‌قدم، تا تسلط</h1>
              <p>یک مسیر روشن برای یادگیری؛ هر درس را بفهم، تمرین کن و با اطمینان به مرحله بعد برو.</p>
              <div className="learning-hero-actions"><span className="learning-level-pill">A1 · مقدماتی</span><span className="learning-duration"><Clock3 size={14}/> {lessons.length} درس ساختاریافته</span></div>
            </div>
            <div className="learning-progress-orb" style={{background: `conic-gradient(var(--gold) ${progress*3.6}deg, #34382e 0deg)`}}>
              <div><strong>{progress}<small>٪</small></strong><span>پیشرفت دوره</span></div>
            </div>
          </section>
          <section className="learning-stats" aria-label="آمار مسیر یادگیری">
            <article><span className="learning-stat-icon"><BookOpen size={18}/></span><div><strong>{lessons.length}</strong><small>درس در مسیر</small></div></article>
            <article><span className="learning-stat-icon"><CheckCircle2 size={18}/></span><div><strong>{completed.length}</strong><small>درس تکمیل‌شده</small></div></article>
            <article><span className="learning-stat-icon"><Target size={18}/></span><div><strong>{lessons.length-completed.length}</strong><small>درس باقی‌مانده</small></div></article>
            <article><span className="learning-stat-icon"><Star size={18}/></span><div><strong>{lirBalance}</strong><small>امتیاز LIR</small></div></article>
          </section>
          <section className="learning-next">
            <div className="learning-next-mark"><Sparkles size={22}/></div>
            <div className="learning-next-copy"><span>پیشنهاد برای ادامه</span><h2>{completed.length === lessons.length ? "مسیر A1 را به پایان رساندی!" : nextLesson.title}</h2><p>{completed.length === lessons.length ? "می‌توانی درس‌ها را برای تثبیت مرور کنی و نتیجه نهایی را بسنجی." : nextLesson.description}</p></div>
            <button className="learning-next-button" onClick={() => openLesson(nextLesson.id)}>{completed.length === lessons.length ? "مرور درس‌ها" : "ادامه یادگیری"} <ArrowRight size={16}/></button>
          </section>
          <div className="learning-section-heading"><div><span>برنامه درسی</span><h2>نقشه راه A1</h2><p>درس‌ها به ترتیب آموزشی چیده شده‌اند تا هر مهارت بر پایه آموخته‌های قبلی ساخته شود.</p></div><div className="learning-total-chip">{completed.length} از {lessons.length} تکمیل</div></div>
          <div className="learning-units">
            {courseUnits.map((unit,unitIndex)=>{
              const unitDone=unit.lessons.filter(lesson=>completed.includes(String(lesson.id))).length;
              const unitPercent=Math.round(unitDone/unit.lessons.length*100);
              return <section className="learning-unit" key={unit.unit}>
                <header className="learning-unit-header">
                  <div className="learning-unit-number">{String(unitIndex+1).padStart(2,"0")}</div>
                  <div className="learning-unit-title"><span>واحد {String(unitIndex+1).padStart(2,"0")}</span><h3>{unit.unit.split("·").pop()?.trim() || unit.unit}</h3><small>{unit.lessons.length} درس · {unitDone} درس تکمیل‌شده</small></div>
                  <div className="learning-unit-meter"><strong>{unitPercent}٪</strong><div><i style={{width:unitPercent+"%"}}/></div></div>
                </header>
                <div className="learning-lesson-list">
                  {unit.lessons.map(lesson=>{
                    const index=lessons.findIndex(item=>item.id===lesson.id);
                    const done=completed.includes(String(lesson.id));
                    const locked=index>0&&!lessons.slice(0,index).every(previous=>completed.includes(String(previous.id)));
                    return <article className={`learning-lesson-row ${done?"is-done":locked?"is-locked":"is-current"}`} key={lesson.id}>
                      <div className="learning-lesson-status">{done?<CheckCircle2 size={18}/>:locked?<LockKeyhole size={16}/>:<span>{String(lesson.id).padStart(2,"0")}</span>}</div>
                      <div className="learning-lesson-info"><h4>{lesson.title}</h4><p>{lesson.description}</p><div className="learning-lesson-meta"><span><Clock3 size={12}/>{lesson.duration}</span><span><BookOpen size={12}/>{lesson.skill}</span></div></div>
                      <button className="learning-lesson-action" disabled={locked} onClick={()=>openLesson(lesson.id)}>{done?"مرور درس":locked?"ابتدا درس‌های قبلی":"شروع درس"}{locked?<LockKeyhole size={14}/>:<ChevronLeft size={15}/>}</button>
                    </article>;
                  })}
                </div>
              </section>;
            })}
          </div>
          <PlacementAssessment result={placementResult} onResultChange={result => { setPlacementResult(result); try { localStorage.setItem("lir9-placement-result", JSON.stringify(result)); } catch { /* local storage may be unavailable */ } }}/>
          <A1FinalAssessment unlocked={serverProgressReady && serverCompletedCount === lessons.length} result={verifiedFinalResult} onResultChange={result => { setVerifiedFinalResult(result); setA1FinalResult(result); try { localStorage.setItem("lir9-a1-final-result", JSON.stringify(result)); } catch { /* local storage may be unavailable */ } }}/>
        </>}{tab === "library" && <ContentLibrary isVip={libraryIsVip} onUpgrade={() => go("vip")} listeningCompleted={listeningCompleted} listeningScores={listeningScores} onListeningProgressChange={(nextCompleted, nextScores) => { setListeningCompleted(nextCompleted); setListeningScores(nextScores); writeStore("lir9-listening-completed", nextCompleted); try { localStorage.setItem("lir9-listening-scores", JSON.stringify(nextScores)); } catch { /* local storage may be unavailable */ } }}/>}
        {tab === "vocabulary" && <><div className="page-intro"><span className="section-kicker">مرور و تثبیت</span><h1>دفتر لغت من</h1><p>لغت‌های مهم را ذخیره کن تا هر وقت خواستی دوباره مرورشان کنی.</p></div><div className="vocab-toolbar"><div className="vocab-count"><b>{saved.length}</b><span>لغت ذخیره‌شده</span><button className={showSavedOnly?"filter-chip active":"filter-chip"} onClick={()=>setShowSavedOnly(value=>!value)} aria-pressed={showSavedOnly}><Bookmark size={13}/>{showSavedOnly?"فقط ذخیره‌شده‌ها":"نمایش همه لغت‌ها"}</button></div><label className="search-field"><Search size={17}/><input aria-label="جست‌وجوی لغت، تلفظ یا معنی" value={search} onChange={e=>setSearch(e.target.value)} placeholder="جست‌وجوی لغت یا معنی"/></label></div><div className="vocab-list">{filteredWords.map(word=>{const isSaved=saved.includes(word.word);return <article className="vocab-row" key={word.word}><div className="vocab-word"><h3>{word.word}</h3><small>{word.phonetic}</small></div><div className="vocab-meaning"><b>{word.meaning}</b><span>{word.example}</span></div><button className={isSaved?"bookmark-button saved":"bookmark-button"} onClick={()=>toggleWord(word.word)} aria-label={isSaved?"حذف از لغت‌های ذخیره‌شده":"ذخیره لغت"}><Bookmark size={18} fill={isSaved?"currentColor":"none"}/></button><button className="sound-button" onClick={()=>speak(word.word)} aria-label="شنیدن تلفظ"><Volume2 size={17}/></button></article>})}{filteredWords.length===0&&<div className="empty-state"><Bookmark size={24}/><b>{showSavedOnly?"هنوز لغتی ذخیره نکرده‌ای.":"لغتی پیدا نشد."}</b><span>{showSavedOnly?"با زدن نشانک کنار هر لغت، آن را اینجا نگه دار.":"عبارت دیگری جست‌وجو کن یا فیلتر را تغییر بده."}</span></div>}</div><p className="local-note">لغت‌های ذخیره‌شده فقط در همین مرورگر و دستگاه نگهداری می‌شوند.</p></>}
        {tab === "assistant" && <><div className="page-intro"><span className="section-kicker">همراه یادگیری</span><h1>دستیار LIRTO</h1><p>همیشه کنار تو؛ همراه هوشمند مسیر یادگیری زبان انگلیسی.</p></div><LirtoAssistant onUpgrade={() => go("vip")}/></>}
        {tab === "vip" && <section className="vip-page"><div className="page-intro"><span className="section-kicker">پیشنهاد ویژه اعضای LIR9</span><h1>اشتراک VIP</h1><p>فرصتی ویژه برای همراهی جدی‌تر با مسیر یادگیری.</p></div><article className="vip-price-card"><div className="vip-card-glow"/><div className="vip-card-top"><span className="vip-crown"><Crown size={23}/></span><span className="vip-offer-tag">تخفیف شگفت‌انگیز 🎉</span></div><h2>اشتراک VIP</h2><p className="vip-card-subtitle">یک پیشنهاد ویژه برای مسیر یادگیری تو</p><div className="vip-price-area"><span className="vip-old-price">۸۹۰٬۰۰۰ تومان</span><div className="vip-current-price"><strong>۱۹۹٬۰۰۰</strong><span>تومان</span></div><span className="vip-discount">۷۸٪ تخفیف</span></div><div className="vip-divider"/><div className="vip-benefits"><h3>با اشتراک VIP چه چیزهایی به دست می‌آوری؟</h3><ul><li><CheckCircle2 size={17}/> دسترسی کامل به تمام مقاله‌های آموزشی</li><li><CheckCircle2 size={17}/> مطالعه همه داستان‌های کتابخانه</li><li><CheckCircle2 size={17}/> دسترسی به مکالمه‌های کاربردی انگلیسی</li><li><CheckCircle2 size={17}/> استفاده از آزمایشگاه شنیداری و تمرین‌های آن</li><li><CheckCircle2 size={17}/> گفت‌وگوی نامحدود با دستیار هوش مصنوعی LIRTO</li></ul></div><button className="vip-activate-button" onClick={()=>setPaymentDetailsOpen(value=>!value)} aria-expanded={paymentDetailsOpen}>فعال‌سازی اشتراک VIP <Crown size={17}/></button>
          {paymentDetailsOpen && <section className="vip-payment-details" aria-label="اطلاعات پرداخت">
            <span className="vip-payment-kicker">پرداخت کارت‌به‌کارت</span>
            <h3>واریز هزینه اشتراک</h3>
            <p>مبلغ اشتراک را به شماره کارت زیر واریز کن. پس از پرداخت، دکمه ثبت درخواست را بزن و تصویر رسید را در صفحه بعد بارگذاری کن.</p>
            <div className="vip-card-number"><bdi dir="ltr">6219 8614 3561 1040</bdi><button type="button" onClick={() => { if (!navigator.clipboard?.writeText) { setNotice("کپی خودکار در این مرورگر در دسترس نیست؛ شماره کارت را دستی کپی کن."); return; } void navigator.clipboard.writeText("6219861435611040").then(() => setNotice("شماره کارت کپی شد."), () => setNotice("کپی انجام نشد؛ شماره کارت را دستی کپی کن.")); }} aria-label="کپی شماره کارت"><Copy size={17}/> کپی</button></div>
            <button className="vip-payment-continue" type="button" onClick={() => { setPaymentSubmitted(false); setPaymentError(""); go("payment-confirmation"); }}>پرداخت کردم؛ ثبت درخواست تأیید <ArrowRight size={17}/></button>
            <small>فعال‌سازی VIP فقط پس از بررسی و تأیید واریز توسط مدیریت انجام می‌شود.</small>
          </section>}
          <span className="vip-secure-note"><ShieldCheck size={14}/> ثبت رسید به‌معنی تأیید پرداخت نیست؛ درخواست شما توسط مدیریت بررسی می‌شود.</span></article></section>}
        {tab === "payment-confirmation" && <section className="payment-confirmation-page">
          <div className="page-intro"><span className="section-kicker">LIR9 · VIP PAYMENT</span><h1>تأیید خرید اشتراک</h1><p>اطلاعات پرداخت را ثبت کن تا درخواستت برای بررسی به مدیریت ارسال شود.</p></div>
          {paymentSubmitted ? <article className="payment-confirmation-card payment-success">
            <span className="payment-success-icon"><CheckCircle2 size={28}/></span><h2>درخواستت ثبت شد</h2>
            <p>رسید و ایمیل حساب LIR9 برای مدیریت ارسال شد. پس از بررسی و تأیید واریز، اشتراک VIP روی همین حساب فعال می‌شود.</p>
            <button className="primary-button" type="button" onClick={() => go("vip")}>بازگشت به اشتراک VIP <ArrowRight size={16}/></button>
          </article> : <form className="payment-confirmation-card" onSubmit={submitVipPayment}>
            <div className="payment-account-email"><span>ایمیل حساب LIR9</span><strong dir="ltr">{authSession?.user.email ?? "ایمیل حساب در دسترس نیست"}</strong><small>این ایمیل از حساب واردشده دریافت شده و قابل تغییر نیست.</small></div>
            <label className="payment-upload-label">تصویر یا فایل رسید واریز
              <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required onChange={event => setPaymentReceipt(event.target.files?.[0] ?? null)} />
              <small>{paymentReceipt ? paymentReceipt.name : "JPG، PNG، WEBP یا PDF · حداکثر ۵ مگابایت"}</small>
            </label>
            {paymentError && <div className="payment-form-error" role="alert">{paymentError}</div>}
            <p className="payment-review-note">پس از ارسال، درخواست در پنل مدیریت ثبت می‌شود. لطفاً فقط رسید واقعی واریز را بارگذاری کن؛ ارسال رسید به‌تنهایی باعث فعال‌شدن VIP نمی‌شود.</p>
            <button className="vip-activate-button payment-submit-button" type="submit" disabled={paymentSubmitting || !paymentReceipt || !authSession?.user.email}>
              {paymentSubmitting ? "در حال ثبت درخواست…" : "ارسال رسید و ثبت درخواست"} <UploadCloud size={17}/>
            </button>
          </form>}
        </section>}
        {tab === "about" && <section className="about-page"><div className="page-intro"><span className="section-kicker">درباره ما</span><h1>یادگیری، قدم‌به‌قدم</h1><p>به LIR9 خوش آمدی؛ فضایی برای یادگیری اصولی زبان انگلیسی، از پایه تا سطح پیشرفته.</p></div><article className="about-card"><div className="about-mark">L</div><h2><bdi dir="ltr">LIR9</bdi>؛ همراه مسیر یادگیری تو</h2><p>LIR9 با هدف ساده‌تر، منظم‌تر و کاربردی‌تر کردن یادگیری زبان انگلیسی ساخته شده است. در این مسیر، آموزش مرحله‌به‌مرحله، تمرین، مرور و سنجش پیشرفت کنار هم قرار می‌گیرند تا بتوانی با برنامه و آگاهی جلو بروی.</p><div className="about-values"><div><BookOpen size={19}/><b>آموزش ساختارمند</b><span>یادگیری مفاهیم در مسیر مشخص و سطح‌بندی‌شده</span></div><div><Target size={19}/><b>تمرین و پیشرفت</b><span>تمرین آموخته‌ها و پیگیری مسیر آموزشی</span></div><div><Sparkles size={19}/><b>یادگیری پیوسته</b><span>هر روز یک قدم نزدیک‌تر به تسلط بیشتر</span></div></div><button className="primary-button" onClick={() => go("learn")}>ادامه یادگیری <ArrowRight size={16}/></button></article></section>}
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
          <section className="account-privacy-card">
            <div><span className="section-kicker">شفافیت و امنیت</span><h2>سیاست حریم خصوصی</h2><p>اطلاعات مربوط به گردآوری، استفاده، نگهداری و حذف داده‌های کاربران در این صفحه توضیح داده شده است.</p></div>
            <a className="account-privacy-link" href={`${import.meta.env.BASE_URL}privacy.html`}>سیاست حریم خصوصی <ChevronLeft size={16}/></a>
          </section>
          <section className="account-delete-card">
            <div><span className="section-kicker">مدیریت داده‌ها</span><h2>حذف حساب کاربری</h2><p>با تأیید این درخواست، حساب و اطلاعات مرتبط با آن از سامانه حذف می‌شود. این عملیات قابل بازگشت نیست.</p></div>
            <button className="account-delete-button" type="button" onClick={() => setDeleteConfirmOpen(true)} disabled={deleteBusy}>حذف حساب کاربری</button>
          </section>
          {deleteConfirmOpen && <div className="account-delete-overlay" role="presentation">
            <section className="account-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="account-delete-title" aria-describedby="account-delete-description">
              <div className="account-delete-dialog-icon"><ShieldCheck size={24}/></div>
              <h2 id="account-delete-title">از حذف حساب اطمینان دارید؟</h2>
              <p id="account-delete-description">با انتخاب «تأیید حذف»، حساب کاربری و اطلاعات یادگیری مرتبط با آن حذف می‌شود. این عملیات قابل بازگشت نیست.</p>
              <div className="account-delete-actions">
                <button type="button" className="account-delete-cancel" onClick={() => setDeleteConfirmOpen(false)} disabled={deleteBusy}>لغو</button>
                <button type="button" className="account-delete-confirm" onClick={() => void handleDeleteAccount()} disabled={deleteBusy}>{deleteBusy ? "در حال حذف…" : "تأیید حذف"}</button>
              </div>
            </section>
          </div>}
        </section>}
        {tab === "certificates" && <><div className="page-intro"><span className="section-kicker">افتخارات و دستاوردهای LIR9</span><h1>مدارک من</h1><p>گواهی پایان دوره A1 پس از تکمیل همه درس‌ها و قبولی در آزمون پایانی صادر می‌شود.</p></div><section className="certificate-studio"><div className="certificate-status"><span className="certificate-status-icon"><ShieldCheck size={19}/></span><div><b>گواهی داخلی پایان دوره LIR9</b><p>این گواهی توسط LIR9 صادر و از طریق شناسه یکتا قابل استعلام است.</p></div></div><div className="certificate-eligibility"><div><span>درس‌های تکمیل‌شده</span><strong>{serverCompletedCount} / {lessons.length}</strong><small>{serverCompletedCount === lessons.length ? "تمام درس‌ها در سرور تأیید شده‌اند" : "برای صدور، همه درس‌ها را با آزمون معتبر تکمیل کن"}</small></div><div><span>آزمون پایانی A1</span><strong>{verifiedFinalResult ? `${verifiedFinalResult.score} / 30` : "—"}</strong><small>{(verifiedFinalResult?.score ?? 0) >= 24 ? "نمره در سرور تأیید شده" : "حداقل نمره قبولی ۲۴ است"}</small></div></div>{certificateLoading ? <div className="certificate-empty-state">در حال بررسی وضعیت مدرک…</div> : issuedCertificate ? <><div id="lir9-certificate-print" className="lir9-certificate certificate-specimen certificate-issued"><div className="certificate-frame"><div className="certificate-ornament certificate-ornament-top">✦　✧　✦</div><div className="certificate-topline">LIR9 · ENGLISH LEARNING PROGRAM</div><div className="certificate-brand">LIR<span>9</span></div><div className="certificate-brand-sub">LEARN · PRACTICE · PROGRESS</div><div className="certificate-emblem"><Award size={25}/></div><div className="certificate-eyebrow">CERTIFICATE OF COMPLETION</div><h2>گواهی پایان دوره</h2><p className="certificate-intro">بدین‌وسیله گواهی می‌شود که</p><div className="certificate-recipient">{issuedCertificate.student_name}</div><p className="certificate-body">با موفقیت محتوای آموزشی سطح زیر را تکمیل کرده و حدنصاب آزمون پایانی برنامه آموزشی LIR9 را کسب نموده است.</p><div className="certificate-level"><i className="certificate-level-rule"/><b>{issuedCertificate.level}</b><i className="certificate-level-rule"/></div><div className="certificate-level-caption">ENGLISH PROFICIENCY · COURSE LEVEL</div><div className="certificate-date-row"><span>DATE OF ISSUE</span><strong>{new Date(issuedCertificate.issued_at).toLocaleDateString("fa-IR", {year:"numeric",month:"long",day:"numeric"})}</strong></div><div className="certificate-bottom"><div><small>VERIFICATION CODE</small><b dir="ltr">{issuedCertificate.verification_code}</b></div><div className="certificate-seal"><Award size={17}/><b>LIR9</b><small>VERIFIED</small></div><div><small>FINAL ASSESSMENT</small><b>{issuedCertificate.score} / 30</b></div></div><div className="certificate-number">VERIFY ONLINE · LIR9</div><div className="certificate-ornament certificate-ornament-bottom">✦　✧　✦</div></div></div><div className="certificate-actions"><button className="primary-button" onClick={() => window.print()}><Award size={16}/> چاپ / ذخیره PDF</button><a className="certificate-verify-link" href={`${import.meta.env.BASE_URL}verify.html?code=${encodeURIComponent(issuedCertificate.verification_code)}`} target="_blank" rel="noreferrer"><ShieldCheck size={16}/> استعلام اصالت مدرک</a></div></> : <div className="certificate-issue-panel"><div><b>{serverCompletedCount === lessons.length && (verifiedFinalResult?.score ?? 0) >= 24 ? "شرایط صدور گواهی تکمیل شده است" : "شرایط صدور گواهی هنوز تکمیل نشده"}</b><p>{serverCompletedCount === lessons.length && (verifiedFinalResult?.score ?? 0) >= 24 ? "پیشرفت ۴۵ درس و نمره آزمون پایانی در سرور تأیید شده‌اند. می‌توانی گواهی خود را صادر کنی." : "برای صدور، باید هر ۴۵ درس را با حداقل ۴ پاسخ درست از ۵ سؤال تکمیل کنی و در آزمون پایانی حداقل ۲۴ از ۳۰ بگیری. بررسی فقط بر اساس سوابق تأییدشده سرور انجام می‌شود."}</p></div><button className="primary-button" onClick={handleIssueCertificate} disabled={certificateIssuing || serverCompletedCount !== lessons.length || (verifiedFinalResult?.score ?? 0) < 24}>{certificateIssuing ? "در حال صدور…" : "صدور گواهی پایان دوره"} <ShieldCheck size={16}/></button></div>}{certificateError && <p className="certificate-error" role="alert">{certificateError}</p>}</section></>}
        {notice && <div className="notice" role="status" aria-live="polite">{notice}<button onClick={()=>setNotice("")} aria-label="بستن پیام">×</button></div>}
      </div>
      <footer className="page-footer"><span>LIR9</span><span>نسخه آزمایشی رابط کاربری · بازخورد تو مسیر را بهتر می‌کند.</span></footer>
    </main>
    <nav className="mobile-tabs">{nav.filter(item=>item.id!=="vip").map(item=><button key={item.id} className={tab===item.id?"selected":""} onClick={()=>go(item.id)}><item.icon size={19}/><span>{item.label}</span></button>)}</nav>
    {tab === "learn" && learningLevel === "A1" && active && <div className="lesson-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)closeLesson();}}><section className="lesson-dialog" role="dialog" aria-modal="true" aria-labelledby="lesson-title"><header className="lesson-dialog-head"><div><span className="section-kicker">درس {String(active.id).padStart(2,"0")} · سطح A1</span><h2 id="lesson-title">{active.title}</h2></div><button className="icon-button" onClick={closeLesson} aria-label="بستن درس"><X/></button></header><div className="lesson-steps"><span className={step==="learn"?"current":""}>۱. آموزش</span><i/><span className={step==="quiz"||step==="result"?"current":""}>۲. آزمون</span><i/><span className={step==="typing"?"current":""}>۳. نوشتاری</span><i/><span className={step==="voice"?"current":""}>۴. گفتاری</span><i/><span className={step==="complete"?"current":""}>۵. پایان</span></div>{step==="learn"&&<><div className="lesson-body lesson-flow">
<div className="lesson-goal"><span>هدف این درس</span><p>{active.goal}</p></div>
<div className="lesson-phase"><header className="lesson-phase-head"><span>مرحله ۱</span><div><b>یادگیری مفهوم</b><small>اول موضوع را بفهم، بعد مثالش را ببین.</small></div></header>
<section className="lesson-teaching flow-section"><span className="lesson-section-label">مفهوم اصلی</span><p>{lessonContent[active.id].concept}</p></section>
<section className="lesson-teaching flow-section"><span className="lesson-section-label">آموزش قدم‌به‌قدم</span>{lessonContent[active.id].steps.map((item,index)=><div className="teaching-step" key={item.heading}><span>{index+1}</span><div><b>{item.heading}</b><p>{item.detail}</p></div></div>)}</section>
<section className="lesson-worked-examples flow-section"><span className="lesson-section-label">مثال‌های حل‌شده</span><p className="worked-examples-intro">هر مثال را بخوان، ترجمه را بررسی کن و به دلیل انتخاب ساختار دقت کن.</p>{lessonContent[active.id].workedExamples.map((example,index)=><article className="worked-example" key={example.english}><span className="worked-example-number">{index+1}</span><div><strong dir="ltr" lang="en">{example.english}</strong><p>{example.translation}</p><small>{example.why}</small></div><button onClick={()=>speak(example.english)} aria-label={"شنیدن "+example.english}><Volume2 size={16}/></button></article>)}</section>
<div className="lesson-example flow-section"><small className="flow-label">نمونه کاربردی</small><strong dir="ltr">{active.example}</strong><span>{active.translation}</span><button onClick={()=>speak(active.example)}><Volume2 size={16}/> شنیدن تلفظ</button></div></div>
<div className="lesson-phase"><header className="lesson-phase-head"><span>مرحله ۲</span><div><b>استفاده در زبان واقعی</b><small>واژه‌ها را یاد بگیر و کاربردشان را در مکالمه ببین.</small></div></header>
<div className="lesson-vocabulary flow-section"><b className="flow-label">واژه‌ها و عبارت‌های مهم</b><div>{active.keyWords.map(item=><button key={item.word} onClick={()=>speak(item.word)}><span dir="ltr">{item.word}</span><small>{item.meaning}</small><Volume2 size={13}/></button>)}</div></div>
<section className="lesson-dialogue flow-section"><span className="lesson-section-label">مکالمه نمونه</span>{lessonContent[active.id].dialogue.map((line,index)=><div className="dialogue-line" key={index}><b aria-label={"گوینده "+line.speaker}>{line.speaker}</b><div className="dialogue-bubble"><strong dir="ltr">{line.line}</strong><small>{line.translation}</small><button className="dialogue-play" onClick={()=>speak(line.line)} aria-label={"پخش تلفظ جمله "+line.line}><Volume2 size={15}/><span>پخش</span></button></div></div>)}</section></div>
<div className="lesson-phase"><header className="lesson-phase-head"><span>مرحله ۳</span><div><b>مرور و تثبیت</b><small>نکته‌های مهم را مرور کن و برای آزمون آماده شو.</small></div></header>
<section className="lesson-mistake flow-section"><b>اشتباه رایج</b><p>{lessonContent[active.id].commonMistake}</p></section>
<div className="lesson-takeaway"><b>خلاصه درس</b><p>{active.takeaway}</p></div>
<section className="lesson-practice-tip flow-section"><b>قبل از آزمون</b><p>{lessonContent[active.id].practiceTip}</p></section></div>
</div><div className="dialog-actions lesson-practice-actions"><button className="primary-button" onClick={beginQuiz}>آزمون این درس <ArrowRight size={16}/></button></div></>}<>{step==="voice"&&<><div className="lesson-body voice-practice">
  <div className="voice-intro"><span className="voice-kicker"><Mic size={15}/> تمرین گفتاری با میکروفون</span><h3>با این عبارت یک جمله بساز و آن را بیان کن</h3><p>با استفاده از عبارت هدف، یک جمله درباره خودت بساز و آن را با صدای بلند بیان کن. این بخش برای تمرین گفتار است؛ مرورگر متن گفتار را تشخیص می‌دهد، اما کیفیت تلفظ و روانی صحبت را نمره‌گذاری نمی‌کند.</p></div>
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
  {voiceStatus==="matched"?<div className="voice-auto-next"><CheckCircle2 size={16}/> پاسخ درست بود؛ خودکار ادامه می‌دهیم.</div>:voiceStatus==="unsupported"||voiceStatus==="error"?<button className="primary-button voice-next" onClick={()=>void advanceVoicePractice()} disabled={lessonSubmitting}>{lessonSubmitting?"در حال ثبت نتیجه…":"عبارت را با صدای بلند تمرین کردم"} <ArrowRight size={16}/></button>:<button className="primary-button voice-record" onClick={startVoiceAttempt} disabled={voiceStatus==="listening"}>{voiceStatus==="listening"?"در حال شنیدن…":"شروع ضبط و تشخیص"} <Mic size={16}/></button>}
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
</div><div className="dialog-actions"><button className="text-button" onClick={()=>setStep("learn")}>بازگشت به آموزش</button></div></>}{step==="quiz"&&<><div className="lesson-body"><div className="quiz-progress-head"><span>سؤال {quizIndex+1} از {lessonContent[active.id].questions.length}</span><span>پاسخ‌ها: {Object.keys(quizAnswers).length} / ۵</span></div><div className="quiz-progress-track"><i style={{width:((quizIndex+1)/lessonContent[active.id].questions.length*100)+"%"}}/></div><span className="question-count">آزمون سنجش یادگیری · حداقل ۴ پاسخ درست از ۵ سؤال</span><h3>{lessonContent[active.id].questions[quizIndex].prompt}</h3><div className="answer-options">{(quizOptionOrders[quizIndex] ?? lessonContent[active.id].questions[quizIndex].options.map((_,index)=>index)).map((originalIndex,displayIndex)=>{const item=lessonContent[active.id].questions[quizIndex].options[originalIndex];return <button key={originalIndex} className={choice===displayIndex?"chosen":""} aria-pressed={choice===displayIndex} onClick={()=>setChoice(displayIndex)}><span>{String.fromCharCode(65+displayIndex)}</span>{item}</button>;})}</div></div><div className="dialog-actions"><button className="text-button" onClick={()=>setStep("learn")}>بازگشت به آموزش</button><button className="primary-button" disabled={choice===null} onClick={()=>{const originalIndex=(quizOptionOrders[quizIndex] ?? lessonContent[active.id].questions[quizIndex].options.map((_,index)=>index))[choice!];setQuizAnswers(previous=>({...previous,[quizIndex]:originalIndex}));setStep("result");}}>بررسی پاسخ <ArrowRight size={16}/></button></div></>}{step==="complete"&&<div className="lesson-complete"><div className="completion-confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="completion-medal"><Award size={42}/></div><span className="completion-kicker">LIR9 · LEVEL UP</span><h3>آفرین! این درس تموم شد!</h3><p>یک قدم مهم دیگه به انگلیسی بهتر نزدیک شدی.</p>{lastLessonRewarded?<div className="completion-reward"><CheckCircle2 size={19}/><b>۲ LIR</b><span>پاداش تکمیل درس</span></div>:<div className="completion-reward"><CheckCircle2 size={19}/><b>آفرین!</b><span>مرور دوباره درس</span></div>}<button className="primary-button" onClick={closeLesson}>ادامه مسیر یادگیری <ArrowRight size={17}/></button></div>}{step==="result"&&<><div className="lesson-body result-body"><div className="result-check"><CheckCircle2 size={30}/></div><h3>پاسخت ثبت شد.</h3><p>نتیجه آزمون پس از پاسخ به هر پنج سؤال، در سرور محاسبه و تأیید می‌شود.</p></div><div className="dialog-actions">{quizIndex<lessonContent[active.id].questions.length-1?<><button className="text-button" onClick={()=>{setStep("quiz");setChoice(null);}}>تغییر پاسخ</button><button className="primary-button" onClick={()=>{setQuizIndex(index=>index+1);setChoice(null);setStep("quiz");}}>سؤال بعدی <ArrowRight size={16}/></button></>:<button className="primary-button" onClick={beginTypingPractice}>ادامه به آزمون نوشتاری <ArrowRight size={16}/></button>}</div></>}</section></div>}
  </div>;
}
export default App;