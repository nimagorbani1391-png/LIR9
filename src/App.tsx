import { useMemo, useState } from "react";
import {
  LayoutDashboard, BookOpen, Library, MessageCircle, Settings, Search,
  Bell, ChevronLeft, ChevronDown, Play, CheckCircle2, Clock3, Flame,
  Target, Trophy, Headphones, Languages, Plus, Send, Menu, X, Bookmark,
  CircleHelp, ArrowUpRight, LockKeyhole, Volume2, Star
} from "lucide-react";

type Tab = "home" | "learn" | "vocabulary" | "assistant";
const lessons = [
  { id: 1, unit: "UNIT 01 · INTRODUCTIONS", title: "معرفی خودت به انگلیسی", sub: "گفتن نام، سن و محل زندگی", time: "۱۲ دقیقه", type: "درس تعاملی", done: true },
  { id: 2, unit: "UNIT 01 · INTRODUCTIONS", title: "سلام و احوال‌پرسی", sub: "شروع یک مکالمه طبیعی", time: "۱۵ دقیقه", type: "مکالمه", done: false },
  { id: 3, unit: "UNIT 01 · INTRODUCTIONS", title: "ضمیرهای فاعلی", sub: "I, You, He, She و بقیه", time: "۱۰ دقیقه", type: "گرامر", done: false },
];
const words = [
  { word: "Introduce", phonetic: "/ˌɪntrəˈduːs/", meaning: "معرفی کردن", example: "Let me introduce myself.", level: "A1" },
  { word: "Friendly", phonetic: "/ˈfrendli/", meaning: "دوستانه، صمیمی", example: "She is very friendly.", level: "A1" },
  { word: "Improve", phonetic: "/ɪmˈpruːv/", meaning: "بهبود دادن", example: "I want to improve my English.", level: "A2" },
];
function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>(["Introduce"]);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "سلام! من دستیار یادگیری LIR9 هستم. هر سؤال انگلیسی داری بپرس؛ با هم حلش می‌کنیم." }]);
  const [notice, setNotice] = useState("");
  const filteredWords = useMemo(() => words.filter(w => (w.word + w.meaning).toLowerCase().includes(query.toLowerCase())), [query]);
  const go = (next: Tab) => { setTab(next); setMenu(false); setNotice(""); };
  const send = () => {
    if (!chat.trim()) return;
    setMessages(m => [...m, { role: "user", text: chat.trim() }, { role: "assistant", text: "پیامت دریافت شد. در نسخه فعلی، اتصال هوش مصنوعی هنوز فعال نشده؛ اما محیط دستیار آماده است." }]);
    setChat("");
  };
  const current = lessons.find(l => l.id === activeLesson);
  const nav = [
    { id: "home" as Tab, label: "داشبورد", icon: LayoutDashboard },
    { id: "learn" as Tab, label: "یادگیری", icon: BookOpen },
    { id: "vocabulary" as Tab, label: "دفتر لغات", icon: Library },
    { id: "assistant" as Tab, label: "دستیار AI", icon: MessageCircle },
  ];
  return <div className="app">
    <aside className={menu ? "sidebar show" : "sidebar"}>
      <div className="brand"><div className="brand-symbol">L<span>9</span></div><div><b>LIR9</b><small>LEARN WITH PURPOSE</small></div><button className="close-menu" onClick={() => setMenu(false)}><X/></button></div>
      <div className="profile-mini"><div className="avatar">N</div><div><b>زبان‌آموز</b><small>مسیر یادگیری من</small></div><ChevronDown size={16}/></div>
      <div className="nav-caption">فضای یادگیری</div>
      <nav>{nav.map(n => <button key={n.id} className={tab === n.id ? "nav-item active" : "nav-item"} onClick={() => go(n.id)}><n.icon size={19}/><span>{n.label}</span>{n.id === "assistant" && <span className="new-tag">NEW</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><b>به راهنمایی نیاز داری؟</b><p>هر وقت خواستی، از بخش دستیار کمک بگیر.</p><button onClick={() => go("assistant")}>گفت‌وگو با دستیار <ChevronLeft size={15}/></button></div><button className="nav-item settings"><Settings size={18}/> تنظیمات</button><div className="sidebar-foot">© 2026 LIR9</div></div>
    </aside>
    {menu && <button className="scrim" onClick={() => setMenu(false)} aria-label="بستن منو"/>}
    <main className="main">
      <header className="topbar"><button className="menu-toggle" onClick={() => setMenu(true)}><Menu/></button><div className="breadcrumb">فضای یادگیری <ChevronLeft size={14}/><b>{nav.find(n => n.id === tab)?.label}</b></div><div className="top-actions"><button className="icon-btn" aria-label="جست‌وجو"><Search size={19}/></button><button className="icon-btn notification" aria-label="اعلان‌ها"><Bell size={19}/><i/></button><div className="top-avatar">N</div></div></header>
      <div className="content">
        {tab === "home" && <>
          <div className="welcome-row"><div><div className="eyebrow"><span/> مسیر یادگیری تو فعال است</div><h1>سلام، خوش اومدی! <span>✦</span></h1><p>هر روز یک قدم کوچک؛ همین‌طوری به هدفت می‌رسی.</p></div><button className="level-pill">سطح فعلی <b>A1</b><ChevronDown size={15}/></button></div>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon gold"><Target/></div><div><small>پیشرفت سطح</small><strong>۱۲٪</strong><span>از مسیر A1</span></div><div className="mini-ring"><span>12%</span></div></div>
            <div className="stat-card"><div className="stat-icon green"><CheckCircle2/></div><div><small>درس‌های تکمیل‌شده</small><strong>۳ <em>/ ۲۵</em></strong><span>در سطح A1</span></div></div>
            <div className="stat-card"><div className="stat-icon orange"><Flame/></div><div><small>روزهای پیوسته</small><strong>۲ <em>روز</em></strong><span>ادامه بده!</span></div></div>
            <div className="stat-card"><div className="stat-icon purple"><Trophy/></div><div><small>امتیاز یادگیری</small><strong>۱۲۰</strong><span>امتیاز کسب‌شده</span></div></div>
          </div>
          <div className="dashboard-grid">
            <section className="panel continue-panel"><div className="panel-head"><div><span className="overline">CONTINUE LEARNING</span><h2>ادامه مسیر یادگیری</h2></div><button className="text-link" onClick={() => go("learn")}>همه درس‌ها <ChevronLeft size={15}/></button></div><div className="continue-card"><div className="lesson-art"><div className="art-circle"><Languages size={36}/></div><span>LESSON 02</span></div><div className="continue-info"><span className="chip">A1 · مبتدی</span><h3>سلام و احوال‌پرسی</h3><p>یاد بگیر چطور یک مکالمه ساده را شروع کنی و حال دیگران را بپرسی.</p><div className="lesson-meta"><span><Clock3 size={14}/> ۱۵ دقیقه</span><span><Headphones size={14}/> مکالمه</span></div><button className="gold-btn" onClick={() => {setActiveLesson(2);setChecked(false);}}>ادامه درس <ChevronLeft size={16}/></button></div></div></section>
            <section className="panel progress-panel"><div className="panel-head"><div><span className="overline">YOUR JOURNEY</span><h2>مسیر سطح A1</h2></div><span className="tiny-status">در حال یادگیری</span></div><div className="progress-number"><strong>۱۲٪</strong><span>تکمیل‌شده</span></div><div className="progress-track"><i style={{width:"12%"}}/></div><div className="progress-labels"><span>شروع</span><span>هدف: پایان A1</span></div><div className="milestone"><span className="milestone-icon"><Star size={17}/></span><div><b>اولین نقطه عطف</b><small>تکمیل ۵ درس برای باز شدن آزمون اول</small></div><LockKeyhole size={16}/></div><button className="outline-btn" onClick={() => go("learn")}>مشاهده برنامه آموزشی <ArrowUpRight size={15}/></button></section>
          </div>
          <section className="panel today-panel"><div className="panel-head"><div><span className="overline">YOUR PLAN</span><h2>برنامه امروز</h2></div><span className="date-label">هدف روزانه: ۲۰ دقیقه</span></div><div className="today-list"><div className="today-item done"><span className="task-check"><CheckCircle2 size={18}/></span><div><b>مرور لغات قبلی</b><small>۵ دقیقه · واژگان</small></div><span className="task-state">انجام شد</span></div><div className="today-item"><span className="task-check"><Play size={16}/></span><div><b>درس سلام و احوال‌پرسی</b><small>۱۵ دقیقه · مکالمه</small></div><button onClick={() => {setActiveLesson(2);setChecked(false);}}>شروع <ChevronLeft size={15}/></button></div></div></section>
        </>}
        {tab === "learn" && <><div className="page-title"><span className="overline">LEARNING PATH</span><h1>مسیر آموزشی من</h1><p>قدم‌به‌قدم پیش برو؛ هر درس تو را به تسلط نزدیک‌تر می‌کند.</p></div><div className="course-banner"><div><span className="chip">سطح A1 · مبتدی</span><h2>پایه‌های زبان انگلیسی</h2><p>در این سطح، اولین مکالمه‌ها و ساختارهای ضروری زبان را یاد می‌گیری.</p><div className="banner-progress"><i/></div><small>۳ از ۲۵ درس تکمیل شده · ۱۲٪</small></div><div className="course-badge">A1</div></div><div className="unit-heading"><div><span className="overline">UNIT 01</span><h2>شروع مکالمه</h2></div><span>۳ درس · حدود ۳۷ دقیقه</span></div><div className="lesson-list">{lessons.map(l => <article className="lesson-row" key={l.id}><div className={l.done ? "lesson-status complete" : "lesson-status"}>{l.done ? <CheckCircle2/> : <Play/>}</div><div className="lesson-row-info"><small>{l.unit}</small><h3>{l.title}</h3><p>{l.sub}</p><div className="row-meta"><span><Clock3 size={13}/>{l.time}</span><span>{l.type}</span></div></div><button className={l.done ? "review-btn" : "start-btn"} onClick={() => {setActiveLesson(l.id);setChecked(false);setAnswer("");}}>{l.done ? "مرور درس" : "شروع درس"} <ChevronLeft size={15}/></button></article>)}</div><div className="locked-unit"><LockKeyhole/><div><b>UNIT 02 · اطلاعات شخصی</b><small>پس از تکمیل درس‌های این بخش باز می‌شود.</small></div></div></>}
        {tab === "vocabulary" && <><div className="page-title"><span className="overline">MY VOCABULARY</span><h1>دفتر لغات من</h1><p>کلمه‌های جدیدت را اینجا نگه دار و مرتب مرور کن.</p></div><div className="vocab-summary"><div><small>مجموع لغات ذخیره‌شده</small><b>{saved.length + 2} <span>کلمه</span></b></div><div><small>نیازمند مرور</small><b>۲ <span>کلمه</span></b></div><button className="gold-btn" onClick={() => setNotice("افزودن لغت جدید در نسخه بعدی فعال می‌شود.")}><Plus size={16}/> افزودن لغت</button></div><div className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="جست‌وجو در لغات..." /></div><div className="word-list">{filteredWords.map(w => <article className="word-card" key={w.word}><div className="word-main"><div><h3>{w.word}</h3><small>{w.phonetic}</small></div><span className="word-level">{w.level}</span></div><b>{w.meaning}</b><p>{w.example}</p><button className={saved.includes(w.word) ? "save-word saved" : "save-word"} onClick={() => setSaved(s => s.includes(w.word) ? s.filter(x => x !== w.word) : [...s,w.word])}><Bookmark size={15} fill={saved.includes(w.word) ? "currentColor" : "none"}/>{saved.includes(w.word) ? "ذخیره‌شده" : "ذخیره لغت"}</button></article>)}</div>{filteredWords.length === 0 && <div className="empty-state">لغتی با این عبارت پیدا نشد.</div>}</>}
        {tab === "assistant" && <><div className="page-title"><span className="overline">LIR9 AI ASSISTANT</span><h1>دستیار هوشمند زبان</h1><p>سؤال بپرس، جمله‌ات را بررسی کن یا یک موضوع را ساده‌تر یاد بگیر.</p></div><div className="assistant-layout"><div className="chat-panel"><div className="chat-head"><div className="ai-avatar"><MessageCircle/></div><div><b>دستیار LIR9</b><small><i/> همراه یادگیری تو</small></div><span className="chip">نسخه آزمایشی</span></div><div className="chat-messages">{messages.map((m,i)=><div key={i} className={m.role === "user" ? "message user-message" : "message"}>{m.text}</div>)}</div><div className="chat-compose"><input value={chat} onChange={e => setChat(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="مثلاً تفاوت am و is چیه؟"/><button onClick={send} aria-label="ارسال"><Send size={17}/></button></div><small className="prototype-note">اتصال مدل هوش مصنوعی هنوز راه‌اندازی نشده است.</small></div><div className="suggestions"><h3>از اینجا شروع کن</h3>{["زمان حال ساده را توضیح بده","این جمله را اصلاح کن: I am go","با من مکالمه A1 تمرین کن"].map(s=><button key={s} onClick={() => setChat(s)}>{s}<ChevronLeft size={15}/></button>)}</div></div></>}
        {notice && <div className="notice">{notice}<button onClick={() => setNotice("")}>×</button></div>}
      </div>
      <footer className="main-footer"><span>LIR9 · مسیر یادگیری تو</span><span>ساخته‌شده برای یادگیری اصولی</span></footer>
    </main>
    <nav className="mobile-nav">{nav.map(n=><button key={n.id} className={tab===n.id?"selected":""} onClick={()=>go(n.id)}><n.icon size={19}/><span>{n.label}</span></button>)}</nav>
    {activeLesson && <div className="modal-backdrop" onClick={() => setActiveLesson(null)}><section className="lesson-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActiveLesson(null)}><X/></button>{current?.done ? <><span className="overline">LESSON REVIEW</span><h2>{current.title}</h2><p>این درس قبلاً تکمیل شده است. می‌توانی دوباره محتوایش را مرور کنی.</p><div className="success-box"><CheckCircle2/> درس تکمیل‌شده</div></> : <><span className="overline">LESSON  ·  A1 BEGINNER</span><h2>{current?.title ?? "درس آموزشی"}</h2><p>برای معرفی خودت می‌توانی از این الگو استفاده کنی:</p><div className="example-box"><small>EXAMPLE</small><b>Hi! My name is Alex. I'm from Iran.</b><button onClick={() => {if ("speechSynthesis" in window) {const u=new SpeechSynthesisUtterance("Hi! My name is Alex. I'm from Iran.");u.lang="en-US";speechSynthesis.speak(u);} else setNotice("مرورگر از پخش گفتار پشتیبانی نمی‌کند.");}}><Volume2 size={16}/> شنیدن تلفظ</button></div><h3 className="quiz-title">تمرین کوتاه</h3><p>کدام جمله برای معرفی نام درست است؟</p><div className="quiz-options">{["My name Alex.","My name is Alex.","I name is Alex."].map(a=><button key={a} className={answer===a?"chosen":""} onClick={()=>{setAnswer(a);setChecked(false);}}>{a}</button>)}</div>{checked && <div className={answer==="My name is Alex."?"success-box":"error-box"}>{answer==="My name is Alex."?"آفرین! پاسخ درست است.":"یک بار دیگر امتحان کن. پاسخ درست: My name is Alex."}</div>}<button className="gold-btn full" disabled={!answer} onClick={()=>setChecked(true)}>بررسی پاسخ</button></>}</section></div>}
  </div>;
}
export default App;