import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ChevronLeft, Clock3, Headphones, LockKeyhole, Mic, MicOff, RotateCcw, Volume2, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { a2Lessons, a2Units } from "../data/a2Curriculum";
import "./A2Course.css";

type Step = "learn" | "writing" | "speaking" | "quiz" | "complete";
type Recognition = { lang:string; interimResults:boolean; maxAlternatives:number; onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null; onerror:((event:{error:string})=>void)|null; onend:(()=>void)|null; start:()=>void; stop:()=>void };
type RecognitionWindow = Window & { SpeechRecognition?: new()=>Recognition; webkitSpeechRecognition?: new()=>Recognition };

export default function A2Course({ onBack }: { onBack:()=>void }) {
  const [completed,setCompleted]=useState<number[]>([]);
  const [ready,setReady]=useState(false);
  const [error,setError]=useState("");
  const [activeId,setActiveId]=useState<number|null>(null);
  const [step,setStep]=useState<Step>("learn");
  const [writing,setWriting]=useState("");
  const [transcript,setTranscript]=useState("");
  const [recording,setRecording]=useState(false);
  const [questionIndex,setQuestionIndex]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const [answers,setAnswers]=useState<Record<number,number>>({});
  const [submitting,setSubmitting]=useState(false);
  const [notice,setNotice]=useState("");
  const [showTranslation,setShowTranslation]=useState(false);
  const [orders,setOrders]=useState<number[][]>([]);
  const active=a2Lessons.find(item=>item.id===activeId)??null;
  const nextLesson=a2Lessons.find(item=>!completed.includes(item.id))??a2Lessons[a2Lessons.length-1];
  const progress=Math.round(completed.length/a2Lessons.length*100);
  const allComplete=completed.length===a2Lessons.length;
  const completedSet=useMemo(()=>new Set(completed),[completed]);

  useEffect(()=>{
    let alive=true;
    if(!supabase){setError("اتصال Supabase تنظیم نشده است.");setReady(true);return;}
    void supabase.rpc("get_my_a2_progress").then(({data,error})=>{
      if(!alive)return;
      if(error){setError("برای فعال‌شدن مسیر A2، migration اختصاصی آن باید در Supabase اجرا شود.");setReady(true);return;}
      const ids=Array.isArray(data?.completed_lessons)?data.completed_lessons.map((id:string)=>Number(id)).filter((id:number)=>Number.isInteger(id)&&id>=1&&id<=24):[];
      setCompleted([...new Set(ids)].sort((a,b)=>a-b));setReady(true);
    }).catch(()=>{if(alive){setError("دریافت پیشرفت A2 انجام نشد. اتصال را بررسی کن.");setReady(true);}});
    return()=>{alive=false;};
  },[]);

  useEffect(()=>{
    if(!notice)return;
    const id=window.setTimeout(()=>setNotice(""),4500);
    return()=>window.clearTimeout(id);
  },[notice]);

  useEffect(()=>{
    if(!activeId)return;
    const close=(event:KeyboardEvent)=>{if(event.key==="Escape")closeLesson();};
    document.body.style.overflow="hidden";
    window.addEventListener("keydown",close);
    return()=>{document.body.style.overflow="";window.removeEventListener("keydown",close);};
  },[activeId]);

  const speak=(text:string)=>{
    if(!("speechSynthesis" in window)){setNotice("پخش گفتار در این مرورگر پشتیبانی نمی‌شود.");return;}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang="en-US";utterance.rate=.88;
    window.speechSynthesis.speak(utterance);
  };
  const openLesson=(id:number)=>{
    const index=a2Lessons.findIndex(item=>item.id===id);
    if(index<0)return;
    if(index>completed.length){setNotice("برای باز کردن این درس، ابتدا درس‌های قبلی A2 را با موفقیت بگذران.");return;}
    const lesson=a2Lessons[index];
    setActiveId(id);setStep("learn");setWriting("");setTranscript("");setQuestionIndex(0);setSelected(null);setAnswers({});setShowTranslation(false);
    setOrders(lesson.questions.map((question)=>question[1].map((_,i)=>i).sort(()=>Math.random()-.5)));
  };
  const closeLesson=()=>{setActiveId(null);setStep("learn");setRecording(false);};
  const startRecording=()=>{
    const api=window as RecognitionWindow;const Constructor=api.SpeechRecognition??api.webkitSpeechRecognition;
    if(!Constructor){setNotice("تشخیص گفتار در این مرورگر پشتیبانی نمی‌شود؛ تمرین را با صدای بلند انجام بده و ادامه بده.");return;}
    const recognition=new Constructor();recognition.lang="en-US";recognition.interimResults=false;recognition.maxAlternatives=1;
    recognition.onresult=event=>{setTranscript(event.results[0]?.[0]?.transcript??"");setRecording(false);};
    recognition.onerror=()=>{setRecording(false);setNotice("دسترسی میکروفون یا تشخیص گفتار با مشکل روبه‌رو شد.");};
    recognition.onend=()=>setRecording(false);
    try{setTranscript("");setRecording(true);recognition.start();}catch{setRecording(false);setNotice("شروع میکروفون ممکن نشد.");}
  };
  const submitQuiz=async(finalAnswers:Record<number,number>=answers)=>{
    if(!active||!supabase)return;
    const payload=active.questions.map((_,i)=>finalAnswers[i]);
    if(payload.length!==5||payload.some(value=>!Number.isInteger(value))){setNotice("به همه پنج سؤال پاسخ بده.");return;}
    setSubmitting(true);
    try{
      const {data,error}=await supabase.rpc("submit_my_a2_lesson_assessment",{p_lesson_id:active.id,p_answers:payload});
      if(error)throw error;
      if(!data?.passed){setNotice("حدنصاب این درس ۴ پاسخ درست از ۵ سؤال است. آموزش را مرور و دوباره تلاش کن.");setStep("learn");return;}
      setCompleted(current=>[...new Set([...current,active.id])].sort((a,b)=>a-b));setStep("complete");
    }catch(err){
      console.error("A2 assessment submission failed",err);
      setNotice("ثبت امن نتیجه انجام نشد. مطمئن شو migration مربوط به A2 در Supabase اجرا شده است.");
    }finally{setSubmitting(false);}
  };
  const currentQuestion=active?.questions[questionIndex];
  const currentOrder=orders[questionIndex]??currentQuestion?.[1].map((_,i)=>i)??[];

  if(!ready)return <section className="a2-course" dir="rtl"><div className="a2-loading">در حال دریافت مسیر آموزشی A2…</div></section>;
  if(error)return <section className="a2-course" dir="rtl"><header className="a2-top"><button className="a2-back" onClick={onBack}><ChevronLeft size={17}/> بازگشت به A1</button><span className="a2-label">LIR9 · A2</span></header><div className="a2-setup"><BookOpen size={32}/><h2>برای فعال‌سازی مسیر A2 یک مرحله باقی مانده</h2><p>{error}</p><p>فایل migration با نام <code>202611240001_lir9_a2_course_progress.sql</code> به مخزن پروژه اضافه شده است. پس از اجرای آن در SQL Editor سوپابیس، این صفحه به‌صورت خودکار پیشرفت امن را دریافت می‌کند.</p><a href="https://github.com/nimagorbani1391-png/LIR9/blob/feature/a2-course-official-app-icon/supabase/migrations/202611240001_lir9_a2_course_progress.sql" target="_blank" rel="noreferrer">مشاهده فایل migration در GitHub</a></div></section>;

  return <section className="a2-course" dir="rtl">
    <header className="a2-top"><button className="a2-back" onClick={onBack}><ChevronLeft size={17}/> بازگشت به A1</button><span className="a2-label">LIR9 · مسیر مستقل سطح A2</span></header>
    <section className="a2-hero"><div className="a2-hero-copy"><span className="a2-eyebrow">ELEMENTARY · WAYSTAGE</span><h1>یک قدم جلوتر؛ انگلیسی واقعی‌تر.</h1><p>در سطح A2 جمله‌های کامل‌تری می‌سازی، درباره گذشته و آینده حرف می‌زنی، تجربه‌ها را توضیح می‌دهی و در موقعیت‌های روزمره مستقل‌تر ارتباط برقرار می‌کنی.</p><div className="a2-pills"><span>۲۴ درس آموزشی</span><span>۱۱ واحد موضوعی</span><span>آزمون امن مرحله‌ای</span></div></div><div className="a2-progress-ring" style={{background:`conic-gradient(#e9ad35 ${progress*3.6}deg,#34332d 0deg)`}}><div><b>{progress}٪</b><small>پیشرفت A2</small></div></div></section>
    <section className="a2-stats"><article><b>{a2Lessons.length}</b><span>درس کامل</span></article><article><b>{completed.length}</b><span>درس گذرانده</span></article><article><b>{a2Lessons.length-completed.length}</b><span>درس باقی‌مانده</span></article><article><b>{a2Units.length}</b><span>واحد آموزشی</span></article></section>
    <section className="a2-next"><div><span>پیشنهاد برای ادامه</span><h2>{allComplete?"مسیر آموزشی A2 را به پایان رساندی!":nextLesson.title}</h2><p>{allComplete?"همه ۲۴ درس این سطح را با آزمون‌های معتبر تکمیل کرده‌ای.":nextLesson.description}</p></div><button onClick={()=>openLesson(nextLesson.id)}>{allComplete?"مرور درس پایانی":"ادامه یادگیری"} <ArrowRight size={16}/></button></section>
    <div className="a2-section-heading"><div><span>CURRICULUM</span><h2>نقشه راه A2</h2><p>هر درس شامل آموزش مرحله‌ای، واژگان، مثال، مکالمه، متن خواندنی، تمرین نوشتاری و آزمون است.</p></div><b>{completed.length} / ۲۴</b></div>
    <div className="a2-units">{a2Units.map((unit,unitIndex)=>{const done=unit.lessons.filter(l=>completedSet.has(l.id)).length;return <article className="a2-unit" key={unit.unit}><header><span>{String(unitIndex+1).padStart(2,"0")}</span><div><small>UNIT {unitIndex+1}</small><h3>{unit.unit.split("·").pop()?.trim()}</h3><p>{done} از {unit.lessons.length} درس تکمیل شده</p></div><b>{Math.round(done/unit.lessons.length*100)}٪</b></header><div className="a2-unit-track"><i style={{width:`${done/unit.lessons.length*100}%`}}/></div><div className="a2-lesson-list">{unit.lessons.map(lesson=>{const index=a2Lessons.findIndex(l=>l.id===lesson.id);const locked=index>completed.length;const isDone=completedSet.has(lesson.id);return <article key={lesson.id} className={`a2-lesson-row ${isDone?"done":locked?"locked":"current"}`}><span className="a2-lesson-number">{isDone?<CheckCircle2 size={17}/>:locked?<LockKeyhole size={15}/>:String(lesson.id).padStart(2,"0")}</span><div><b>{lesson.title}</b><small>{lesson.description}</small></div><button disabled={locked} onClick={()=>openLesson(lesson.id)}>{isDone?"مرور درس":locked?"قفل":"شروع"} <ChevronLeft size={14}/></button></article>;})}</div></article>;})}</div>
    <section className="a2-outcomes"><h2>در پایان A2 چه کارهایی می‌توانی انجام بدهی؟</h2><ul><li>درباره تجربه‌ها، اتفاق‌های گذشته و برنامه‌های آینده صحبت کنی.</li><li>در سفر، هتل، فرودگاه، فروشگاه و تماس تلفنی نیازهایت را بیان کنی.</li><li>مقدار، مقایسه، توصیه، قانون و دلیل را با ساختارهای درست توضیح بدهی.</li><li>متن‌های کوتاه روزمره را بخوانی و پیام یا متن ساده بنویسی.</li></ul></section>
    {notice&&<div className="a2-notice" role="status">{notice}</div>}
    {active&&<div className="a2-overlay" onMouseDown={event=>{if(event.target===event.currentTarget)closeLesson();}}><section className="a2-modal" role="dialog" aria-modal="true" aria-labelledby="a2-lesson-title"><header className="a2-modal-head"><div><span>A2 · LESSON {String(active.id).padStart(2,"0")}</span><h2 id="a2-lesson-title">{active.title}</h2></div><button onClick={closeLesson} aria-label="بستن درس"><X/></button></header><div className="a2-stagebar"><span className={step==="learn"?"active":""}>۱ آموزش</span><i/><span className={step==="writing"?"active":""}>۲ نوشتن</span><i/><span className={step==="speaking"?"active":""}>۳ گفتار</span><i/><span className={step==="quiz"?"active":""}>۴ آزمون</span><i/><span className={step==="complete"?"active":""}>۵ پایان</span></div>
    {step==="learn"&&<div className="a2-modal-body"><div className="a2-goal"><b>هدف یادگیری</b><p>{active.goal}</p></div><section><h3>مفهوم اصلی</h3><p>{active.explanation}</p></section><section><h3>آموزش قدم‌به‌قدم</h3>{active.steps.map(([heading,detail],i)=><div className="a2-step" key={heading}><b>{i+1}</b><div><strong>{heading}</strong><p>{detail}</p></div></div>)}</section><section><h3>واژگان کلیدی</h3><div className="a2-vocab">{active.vocabulary.map(([word,meaning])=><button key={word} onClick={()=>speak(word)}><b dir="ltr">{word}</b><span>{meaning}</span><Volume2 size={14}/></button>)}</div></section><section><h3>مثال‌های کاربردی</h3>{active.examples.map(([english,translation,why])=><article className="a2-example" key={english}><div><b dir="ltr">{english}</b><p>{translation}</p><small>{why}</small></div><button onClick={()=>speak(english)} aria-label="پخش مثال"><Volume2 size={16}/></button></article>)}</section><section className="a2-reading"><div className="a2-reading-head"><h3>متن خواندنی و شنیداری</h3><button onClick={()=>speak(active.reading)}><Headphones size={15}/> گوش دادن</button></div><p dir="ltr">{active.reading}</p><button className="a2-translation-toggle" onClick={()=>setShowTranslation(v=>!v)}>{showTranslation?"پنهان کردن ترجمه":"نمایش ترجمه فارسی"}</button>{showTranslation&&<p>{active.readingFa}</p>}</section><section><h3>مکالمه نمونه</h3><div className="a2-dialogue">{active.dialogue.map(([speaker,line,translation],i)=><article key={i}><b>{speaker}</b><div><strong dir="ltr">{line}</strong><small>{translation}</small><button onClick={()=>speak(line)}><Volume2 size={13}/> پخش</button></div></article>)}</div></section><section className="a2-mistake"><b>اشتباه رایج</b><p>{active.mistakes}</p></section></div>}
    {step==="writing"&&<div className="a2-modal-body a2-practice"><span>WRITING PRACTICE</span><h3>حالا خودت بنویس</h3><p>{active.writing}</p><textarea value={writing} onChange={e=>setWriting(e.target.value)} placeholder="Write your answer in English…" dir="ltr"/><small>{writing.trim().split(/\s+/).filter(Boolean).length} کلمه · پاسخ را با حداقل ۲۰ کلمه بنویس.</small><button disabled={writing.trim().split(/\s+/).filter(Boolean).length<20} onClick={()=>setStep("speaking")}>رفتن به تمرین گفتاری <ArrowRight size={16}/></button></div>}
    {step==="speaking"&&<div className="a2-modal-body a2-practice"><span>SPEAKING PRACTICE</span><h3>با صدای بلند تمرین کن</h3><p>درباره موضوع درس، دست‌کم ۳۰ ثانیه انگلیسی صحبت کن. می‌توانی از میکروفون برای ثبت متن گفتار استفاده کنی؛ تشخیص خودکار، نمره تلفظ صادر نمی‌کند.</p><div className="a2-mic-result"><button onClick={startRecording} disabled={recording}>{recording?<MicOff/>:<Mic/>}{recording?"در حال شنیدن…":"شروع ضبط گفتار"}</button><p dir="ltr">{transcript||"Speech transcript will appear here."}</p></div><button onClick={()=>{setQuestionIndex(0);setSelected(null);setAnswers({});setStep("quiz");}}>رفتن به آزمون درس <ArrowRight size={16}/></button></div>}
    {step==="quiz"&&currentQuestion&&<div className="a2-modal-body a2-quiz"><div className="a2-quiz-progress"><span>سؤال {questionIndex+1} از ۵</span><b>{Math.round((questionIndex+1)/5*100)}٪</b></div><div className="a2-unit-track"><i style={{width:`${(questionIndex+1)/5*100}%`}}/></div><h3>{currentQuestion[0]}</h3><div className="a2-options">{currentOrder.map((original,index)=><button key={original} className={selected===index?"selected":""} onClick={()=>setSelected(index)}><span>{String.fromCharCode(65+index)}</span>{currentQuestion[1][original]}</button>)}</div><div className="a2-quiz-actions"><button disabled={selected===null||submitting} onClick={()=>{const original=currentOrder[selected!];const nextAnswers={...answers,[questionIndex]:original};setAnswers(nextAnswers);if(questionIndex===4){void submitQuiz(nextAnswers);}else{setQuestionIndex(i=>i+1);setSelected(null);}}}>{questionIndex===4?(submitting?"در حال بررسی…":"ثبت آزمون"):"سؤال بعدی"} <ArrowRight size={15}/></button></div></div>}
    {step==="complete"&&<div className="a2-complete"><div><CheckCircle2 size={42}/></div><span>LESSON COMPLETED</span><h3>آفرین! این درس را با موفقیت گذراندی.</h3><p>نتیجه آزمون در سرور ثبت شد و درس بعدی باز شده است.</p><button onClick={closeLesson}>بازگشت به نقشه راه <ArrowRight size={16}/></button></div>}
    </section></div>}
  </section>;
}
