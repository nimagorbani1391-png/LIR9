import { useState } from "react";
import {
  ArrowLeft, ArrowUpLeft, BookOpen, BrainCircuit, Check, ChevronDown,
  CirclePlay, GraduationCap, Headphones, Menu, MessageCircle, Mic2,
  Sparkles, Target, X, Zap
} from "lucide-react";

const levels = [
  { code: "A1", title: "مبتدی", detail: "شروع از پایه و ساخت اولین جمله‌ها", progress: "شروع مسیر" },
  { code: "A2", title: "پایه", detail: "مکالمه‌های روزمره و درک بهتر", progress: "مرحله بعد" },
  { code: "B1", title: "متوسط", detail: "استقلال در مکالمه و ارتباط", progress: "مرحله بعد" },
  { code: "B2", title: "متوسط پیشرفته", detail: "بیان روان‌تر و فهم محتوای پیچیده", progress: "مرحله بعد" },
  { code: "C1", title: "پیشرفته", detail: "استفاده دقیق و حرفه‌ای از زبان", progress: "هدف بلندمدت" },
];

const features = [
  { icon: BookOpen, title: "درس‌های ساختارمند", text: "از پایه و قدم‌به‌قدم جلو برو؛ هر درس هدف مشخص و مسیر روشن دارد." },
  { icon: Target, title: "تمرین و ارزیابی", text: "بعد از یادگیری تمرین کن و با آزمون‌ها میزان پیشرفتت را بسنج." },
  { icon: Headphones, title: "چهار مهارت اصلی", text: "گرامر، واژگان، شنیدار، خواندن، نوشتن و مکالمه را کنار هم تقویت کن." },
  { icon: BrainCircuit, title: "دستیار هوشمند", text: "برای رفع اشکال، توضیح مفاهیم و تمرین بیشتر از AI کمک بگیر." },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  const goToLevels = () => {
    document.getElementById("levels")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotice("لطفاً یک ایمیل معتبر وارد کن.");
      return;
    }
    setNotice("این فرم در نسخه نمایشی است و هنوز ثبت‌نام واقعی فعال نشده.");
  };

  return (
    <div className="app-shell">
      <div className="top-glow" aria-hidden="true" />
      <header className="site-header container">
        <a className="brand" href="#" aria-label="LIR9 صفحه اصلی">
          <span className="brand-mark">L<span>9</span></span>
          <span className="brand-name">LIR9<small>LEARN WITH PURPOSE</small></span>
        </a>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="باز کردن منو">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#features" onClick={() => setMenuOpen(false)}>ویژگی‌ها</a>
          <a href="#levels" onClick={() => setMenuOpen(false)}>سطح‌های آموزشی</a>
          <a href="#method" onClick={() => setMenuOpen(false)}>روش یادگیری</a>
        </nav>
        <button className="header-cta" onClick={goToLevels}>شروع یادگیری <ArrowLeft size={16} /></button>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> یادگیری زبان، با مسیر مشخص</div>
            <h1>انگلیسی را<br /><span>اصولی یاد بگیر.</span></h1>
            <p className="hero-description">
              از اولین کلمه تا تسلط پیشرفته؛ با درس‌های مرحله‌به‌مرحله،
              تمرین هدفمند و مسیری که پیشرفتت را قابل اندازه‌گیری می‌کند.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={goToLevels}>مسیرم رو انتخاب می‌کنم <ArrowLeft size={18} /></button>
              <a className="secondary-link" href="#method"><CirclePlay size={18} /> روش کار LIR9</a>
            </div>
            <div className="hero-proof">
              <div className="proof-icon"><GraduationCap size={19} /></div>
              <div><strong>از A1 تا C1</strong><span>پنج سطح، یک مسیر پیوسته</span></div>
            </div>
          </div>
          <div className="hero-art" aria-label="نمای گرافیکی مسیر یادگیری">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="learning-card">
              <div className="card-topline"><span>YOUR LEARNING PATH</span><Sparkles size={16} /></div>
              <div className="card-title">مسیر پیشرفت تو</div>
              <div className="path-line">
                {levels.map((level, index) => (
                  <div className={index === 0 ? "path-step active" : "path-step"} key={level.code}>
                    <span className="path-node">{index === 0 ? <Check size={15} /> : level.code}</span>
                    <span className="path-label">{level.code}</span>
                  </div>
                ))}
              </div>
              <div className="lesson-preview">
                <div className="lesson-icon"><BookOpen size={19} /></div>
                <div className="lesson-info"><strong>اولین قدم: معرفی خودت</strong><span>درس ۱ · سطح A1</span></div>
                <ArrowUpLeft className="lesson-arrow" size={18} />
              </div>
              <div className="card-footer"><span><Zap size={14} /> قدم‌های کوچک، پیشرفت واقعی</span><span className="live-dot" /></div>
            </div>
            <div className="floating-chip chip-one"><MessageCircle size={16} /> تمرین مکالمه</div>
            <div className="floating-chip chip-two"><Mic2 size={16} /> شنیدن و تکرار</div>
            <div className="hero-star star-one">✳</div>
            <div className="hero-star star-two">✦</div>
          </div>
        </section>

        <section className="trust-strip container">
          <span>یک مسیر کامل برای یادگیری واقعی</span>
          <div className="trust-items"><span>ساختار CEFR</span><i /> <span>تمرین هدفمند</span><i /> <span>پیشرفت مرحله‌ای</span></div>
        </section>

        <section className="section container" id="features">
          <div className="section-heading">
            <div><span className="section-kicker">WHY LIR9</span><h2>یادگیری، فراتر از حفظ کردن.</h2></div>
            <p>فقط درس نمی‌خوانی؛ مهارت می‌سازی، تمرین می‌کنی و قدم‌به‌قدم جلو می‌روی.</p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text }, index) => (
              <article className="feature-card" key={title}>
                <div className="feature-icon"><Icon size={22} /></div>
                <span className="feature-number">0{index + 1}</span>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="levels-section" id="levels">
          <div className="container section">
            <div className="section-heading">
              <div><span className="section-kicker">YOUR LEVEL, YOUR PACE</span><h2>از کجا شروع می‌کنی؟</h2></div>
              <p>سطح مناسب خودت را پیدا کن. مسیر LIR9 از مبتدی تا پیشرفته طراحی شده است.</p>
            </div>
            <div className="level-grid">
              {levels.map((level, index) => (
                <button className={index === 0 ? "level-card level-highlight" : "level-card"} key={level.code} onClick={() => setNotice("انتخاب سطح در نسخه بعدی فعال می‌شود.")}>
                  <span className="level-index">0{index + 1}</span>
                  <strong className="level-code">{level.code}</strong>
                  <span className="level-title">{level.title}</span>
                  <span className="level-detail">{level.detail}</span>
                  <span className="level-bottom">{level.progress}<ArrowLeft size={15} /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section method-section container" id="method">
          <div className="method-visual">
            <div className="method-orb"><GraduationCap size={48} strokeWidth={1.2} /></div>
            <span className="method-tag tag-a">LEARN</span><span className="method-tag tag-b">PRACTICE</span><span className="method-tag tag-c">GROW</span>
          </div>
          <div className="method-copy">
            <span className="section-kicker">THE LIR9 METHOD</span>
            <h2>یاد بگیر. تمرین کن.<br /><span>پیشرفتت را ببین.</span></h2>
            <div className="method-list">
              <div><span>۱</span><p><strong>یادگیری مفهومی</strong><small>هر موضوع را با توضیح روشن و مثال کاربردی یاد بگیر.</small></p></div>
              <div><span>۲</span><p><strong>تمرین فعال</strong><small>دانسته‌هایت را با تمرین و فعالیت به مهارت تبدیل کن.</small></p></div>
              <div><span>۳</span><p><strong>سنجش پیشرفت</strong><small>با آزمون و بازخورد، نقاط قوت و نیاز به تمرین را بشناس.</small></p></div>
            </div>
          </div>
        </section>

        <section className="final-cta container">
          <div className="cta-decoration">L9</div>
          <div className="cta-content">
            <span className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>اولین قدم رو بردار.</h2>
            <p>برای شروع مسیر یادگیری، ایمیلت را وارد کن.</p>
            <form className="signup-form" onSubmit={handleSubmit}>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ایمیل تو" aria-label="ایمیل" />
              <button type="submit">شروع مسیر <ArrowLeft size={17} /></button>
            </form>
            {notice && <p className="form-notice" role="status">{notice}</p>}
          </div>
        </section>
      </main>

      <footer className="site-footer container">
        <a className="brand footer-brand" href="#"><span className="brand-mark">L<span>9</span></span><span className="brand-name">LIR9<small>LEARN WITH PURPOSE</small></span></a>
        <p>مسیر یادگیری تو، از اینجا شروع می‌شود.</p>
        <span className="copyright">© 2026 LIR9 · همه حقوق محفوظ است.</span>
      </footer>
    </div>
  );
}

export default App;