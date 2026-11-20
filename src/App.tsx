import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./lib/supabase";
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
const createOptionOrders = (content: Record<number, LessonContent>, lessonId: number) => Object.fromEntries((content[lessonId]?.questions ?? []).map((question, questionIndex) => { const order = question.options.map((_, index) => index); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } return [questionIndex, order]; })) as Record<number, number[]>;
type Lesson = { id: number; unit: string; title: string; description: string; duration: string; skill: string; goal: string; explanation?: string; takeaway: string; keyWords: { word: string; meaning: string }[]; example: string; translation: string; question: string; choices: string[]; correct: number; answerWhy: string; };
const lessons: Lesson[] = [
  { id: 1, unit: "واحد ۱ · شروع مکالمه", title: "سلام و احوال‌پرسی", description: "یاد بگیر مکالمه را طبیعی شروع کنی.", goal: "بتوانی مکالمه‌ای کوتاه را با سلام و پرسیدن حال طرف مقابل آغاز کنی.", takeaway: "Hi در گفت‌وگوی دوستانه رایج است؛ Hello کمی خنثی‌تر و رسمی‌تر است. برای پاسخ می‌توانی بگویی: I'm fine, thanks.", keyWords: [{"word":"Hello","meaning":"سلام"},{"word":"How are you?","meaning":"حالت چطور است؟"},{"word":"I'm fine","meaning":"من خوبم"}], duration: "۸ دقیقه", skill: "مکالمه", explanation: "برای سلام کردن در موقعیت‌های روزمره از Hello یا Hi استفاده می‌کنیم. برای پرسیدن حال طرف مقابل می‌گوییم: How are you?", example: "Hi! How are you?", translation: "سلام! حالت چطوره؟", question: "کدام عبارت برای پرسیدن حال یک نفر است؟", choices: ["How are you?", "What is your name?", "Where are you from?"], answerWhy: "How are you? برای پرسیدن حال مخاطب استفاده می‌شود. What is your name? نام را می‌پرسد و Where are you from? درباره محل یا کشور مبدأ است.", correct: 0 },
  { id: 2, unit: "واحد ۱ · شروع مکالمه", title: "معرفی نام", description: "نام خودت و دیگران را معرفی کن.", goal: "بتوانی نام خودت را با دو ساختار رایج معرفی کنی.", takeaway: "بعد از My name is یا I'm، نام شخص می‌آید. فعل is را در ساختار My name is حذف نکن.", keyWords: [{"word":"My name is…","meaning":"اسم من ... است"},{"word":"I'm…","meaning":"من ... هستم"},{"word":"Nice to meet you","meaning":"از آشنایی با تو خوشحالم"}], duration: "۱۰ دقیقه", skill: "واژگان و مکالمه", explanation: "برای گفتن نام از الگوی My name is … استفاده کن. شکل کوتاه و رایج آن I'm … است.", example: "My name is Sara. / I'm Sara.", translation: "اسم من سارا است. / من سارا هستم.", question: "کدام جمله از نظر گرامری درست است؟", choices: ["My name Sara.", "My name is Sara.", "I name is Sara."], answerWhy: "ساختار درست My name is + name است. در جمله My name Sara فعل is جا افتاده است.", correct: 1 },
  { id: 3, unit: "واحد ۱ · شروع مکالمه", title: "معرفی محل زندگی", description: "بگو اهل کجا هستی.", goal: "بتوانی بگویی اهل کجا هستی یا از کجا آمده‌ای.", takeaway: "ساختار I'm from + نام شهر یا کشور است. بعد از from معمولاً نام مکان می‌آید.", keyWords: [{"word":"from","meaning":"از / اهلِ"},{"word":"country","meaning":"کشور"},{"word":"city","meaning":"شهر"}], duration: "۹ دقیقه", skill: "گرامر", explanation: "برای گفتن اینکه اهل کجا هستی از ساختار I'm from + place استفاده می‌کنیم.", example: "I'm from Iran.", translation: "من اهل ایران هستم.", question: "جای خالی را کامل کن: I'm ___ Germany.", choices: ["from", "at", "is"], answerWhy: "در این جمله برای بیان مبدأ از from استفاده می‌کنیم؛ at و is در این ساختار درست نیستند.", correct: 0 },
  { id: 4, unit: "واحد ۱ · شروع مکالمه", title: "ضمیرهای فاعلی", description: "با I, you, he و she آشنا شو.", goal: "ضمیر مناسب را برای اشاره به خودت، مخاطب یا شخص دیگر انتخاب کنی.", takeaway: "He برای یک مرد و She برای یک زن استفاده می‌شود. They برای بیش از یک نفر یا در بعضی کاربردهای مفرد به کار می‌رود.", keyWords: [{"word":"I","meaning":"من"},{"word":"You","meaning":"تو / شما"},{"word":"He","meaning":"او (مذکر)"},{"word":"She","meaning":"او (مونث)"}], duration: "۱۲ دقیقه", skill: "گرامر", explanation: "ضمیر فاعلی نشان می‌دهد چه کسی کار را انجام می‌دهد: I برای من، You برای تو/شما، He برای او (مذکر) و She برای او (مونث).", example: "She is a student. He is my friend.", translation: "او دانش‌آموز است. او دوست من است.", question: "کدام ضمیر برای یک مرد به کار می‌رود؟", choices: ["She", "He", "They"], answerWhy: "He ضمیر فاعلی سوم‌شخص مفرد برای مرد است. She برای زن و They برای جمع به کار می‌رود.", correct: 1 },
  { id: 5, unit: "واحد ۲ · واژه‌های روزمره", title: "اعداد ۱ تا ۲۰", description: "عددهای پرکاربرد را بشناس و در موقعیت‌های ساده به کار ببر.", goal: "بتوانی عددهای ۱ تا ۲۰ را بخوانی، بشنوی و بنویسی.", takeaway: "به املای fourteen و fifteen دقت کن؛ در عددهای thirteen تا nineteen معمولاً پسوند teen دیده می‌شود.", keyWords: [{word:"one",meaning:"یک"},{word:"five",meaning:"پنج"},{word:"ten",meaning:"ده"}], duration: "۱۰ دقیقه", skill: "واژگان و شنیدار", explanation: "عددها برای گفتن سن، تعداد و شماره‌ها ضروری‌اند. در این درس با شکل نوشتاری و تلفظ چند عدد پایه آشنا می‌شوی.", example: "I have five books.", translation: "من پنج کتاب دارم.", question: "عدد ۱۲ در انگلیسی کدام است؟", choices: ["Twenty", "Twelve", "Two"], answerWhy: "Twelve یعنی دوازده؛ Two یعنی دو و Twenty یعنی بیست.", correct: 1 },
  { id: 6, unit: "واحد ۲ · واژه‌های روزمره", title: "اعضای خانواده", description: "درباره اعضای خانواده‌ات صحبت کن.", goal: "بتوانی چند عضو خانواده را نام ببری و با جمله ساده معرفی کنی.", takeaway: "برای گفتن «مادر من» می‌گوییم my mother. واژه my مالکیت را نشان می‌دهد.", keyWords: [{word:"mother",meaning:"مادر"},{word:"father",meaning:"پدر"},{word:"sister",meaning:"خواهر"}], duration: "۱۱ دقیقه", skill: "واژگان و مکالمه", explanation: "واژه‌های خانواده در مکالمه‌های روزمره بسیار پرکاربردند. می‌توانی نام عضو خانواده را بعد از my بیاوری.", example: "This is my mother.", translation: "این مادر من است.", question: "معنی brother چیست؟", choices: ["برادر", "خواهر", "پدر"], answerWhy: "Brother یعنی برادر؛ sister یعنی خواهر و father یعنی پدر.", correct: 0 },
  { id: 7, unit: "واحد ۲ · واژه‌های روزمره", title: "شغل‌ها و معرفی افراد", description: "شغل افراد را با جمله‌های کوتاه بیان کن.", goal: "بتوانی چند شغل رایج را نام ببری و بگویی یک نفر چه‌کاره است.", takeaway: "برای یک شغل مفرد معمولاً از a یا an استفاده می‌کنیم: a teacher، an artist.", keyWords: [{word:"teacher",meaning:"معلم"},{word:"doctor",meaning:"پزشک"},{word:"student",meaning:"دانش‌آموز / دانشجو"}], duration: "۱۲ دقیقه", skill: "واژگان و گرامر", explanation: "برای معرفی شغل می‌توانی از الگوی He is a ... یا She is a ... استفاده کنی.", example: "She is a teacher.", translation: "او معلم است.", question: "کدام واژه به معنی پزشک است؟", choices: ["Teacher", "Doctor", "Student"], answerWhy: "Doctor یعنی پزشک؛ teacher یعنی معلم و student یعنی دانش‌آموز یا دانشجو.", correct: 1 },
  { id: 8, unit: "واحد ۳ · ساخت جمله", title: "حروف تعریف a و an", description: "قبل از اسم‌های مفرد، a و an را درست انتخاب کن.", goal: "در عبارت‌های ساده تشخیص بده چه زمانی از a و چه زمانی از an استفاده می‌شود.", takeaway: "انتخاب a یا an به صدای آغازین واژه بعدی بستگی دارد، نه فقط حرف اول آن.", keyWords: [{word:"a book",meaning:"یک کتاب"},{word:"an apple",meaning:"یک سیب"},{word:"an egg",meaning:"یک تخم‌مرغ"}], duration: "۱۲ دقیقه", skill: "گرامر", explanation: "a پیش از صدای آغازین همخوان و an پیش از صدای آغازین واکه می‌آید؛ مانند a book و an apple.", example: "It is an apple.", translation: "این یک سیب است.", question: "کدام عبارت درست است؟", choices: ["a orange", "an orange", "an book"], answerWhy: "Orange با صدای واکه آغاز می‌شود، پس an orange درست است. پیش از book از a استفاده می‌کنیم.", correct: 1 },
  { id: 9, unit: "واحد ۳ · ساخت جمله", title: "اشاره به چیزها: this و that", description: "به چیزهای نزدیک و دور اشاره کن.", goal: "تفاوت this برای چیز نزدیک و that برای چیز دور را در جمله ساده به کار ببری.", takeaway: "This is ... برای یک چیز نزدیک و That is ... برای یک چیز دور استفاده می‌شود.", keyWords: [{word:"this",meaning:"این (نزدیک)"},{word:"that",meaning:"آن (دور)"},{word:"this book",meaning:"این کتاب"}], duration: "۱۰ دقیقه", skill: "گرامر و مکالمه", explanation: "وقتی چیزی نزدیک توست از this و وقتی دورتر است از that استفاده کن. هر دو در این درس با اسم مفرد می‌آیند.", example: "This is my book.", translation: "این کتاب من است.", question: "برای اشاره به یک چیز دور کدام واژه مناسب است؟", choices: ["This", "That", "These"], answerWhy: "That برای اشاره به یک چیز دور به کار می‌رود؛ this برای چیز نزدیک است و these شکل جمع this است.", correct: 1 },
  { id: 10, unit: "واحد ۳ · ساخت جمله", title: "جمع بستن اسم‌ها", description: "درباره بیش از یک چیز صحبت کن.", goal: "جمع ساده اسم‌ها را با افزودن s بسازی و در جمله تشخیص بدهی.", takeaway: "بسیاری از اسم‌ها با افزودن s جمع بسته می‌شوند: book → books. بعضی اسم‌ها شکل بی‌قاعده دارند که باید جداگانه یاد گرفته شوند.", keyWords: [{word:"book",meaning:"کتاب"},{word:"books",meaning:"کتاب‌ها"},{word:"two cats",meaning:"دو گربه"}], duration: "۱۲ دقیقه", skill: "گرامر و واژگان", explanation: "برای جمع بستن بسیاری از اسم‌های انگلیسی، s به پایان اسم اضافه می‌شود. بعد از عدد بیشتر از یک، معمولاً اسم را جمع می‌آوریم.", example: "I have two books.", translation: "من دو کتاب دارم.", question: "جمع ساده book کدام است؟", choices: ["bookes", "books", "book"], answerWhy: "برای جمع ساده book فقط s اضافه می‌کنیم: books.", correct: 1 },
  { id: 11, unit: "واحد ۴ · جمله‌سازی", title: "فعل be در جمله منفی", description: "یاد بگیر چطور بگویی کسی یا چیزی این‌طور نیست.", goal: "بتوانی با am not، isn't و aren't جمله منفی بسازی.", takeaway: "برای منفی کردن فعل be، not را بعد از am/is/are می‌آوریم: I am not tired. / She isn't late.", keyWords: [{word:"not",meaning:"نه / نیست"},{word:"tired",meaning:"خسته"},{word:"ready",meaning:"آماده"}], example: "I am not tired.", translation: "من خسته نیستم.", question: "کدام جمله درست است؟", choices: ["He isn't busy.", "He not is busy.", "He aren't busy."], correct: 0, answerWhy: "برای he از is استفاده می‌کنیم و not بعد از آن می‌آید: He is not busy یا He isn't busy.", duration:"۱۲ دقیقه", skill:"گرامر و جمله‌سازی" },
  { id: 12, unit: "واحد ۴ · جمله‌سازی", title: "سؤال ساختن با فعل be", description: "سؤال‌های ساده درباره آدم‌ها و چیزها بپرس.", goal: "بتوانی جای فعل be و فاعل را در سؤال درست کنی و کوتاه جواب بدهی.", takeaway: "برای سؤال، am/is/are را به ابتدای جمله می‌بریم: Are you ready? پاسخ کوتاه: Yes, I am. / No, I'm not.", keyWords: [{word:"Are you…?",meaning:"آیا تو ... هستی؟"},{word:"Yes, I am.",meaning:"بله، هستم."},{word:"No, I'm not.",meaning:"نه، نیستم."}], example: "Are you ready? Yes, I am.", translation: "آماده‌ای؟ بله، هستم.", question: "کدام گزینه سؤال درست است؟", choices: ["Are they students?", "They are students?", "Are students they?"], correct: 0, answerWhy: "در سؤال بله/خیر با فعل be، فعل قبل از فاعل می‌آید: Are + they + students?", duration:"۱۲ دقیقه", skill:"گرامر و مکالمه" },
  { id: 13, unit: "واحد ۵ · آدم‌ها و وسایل", title: "مالکیت با my و your", description: "بگو هر وسیله یا چیزی مال چه کسی است.", goal: "بتوانی از my، your، his و her برای نشان دادن مالکیت استفاده کنی.", takeaway: "my یعنی مال من، your یعنی مال تو/شما، his برای یک مرد و her برای یک زن است. این کلمات قبل از اسم می‌آیند: my phone.", keyWords: [{word:"my phone",meaning:"گوشی من"},{word:"your bag",meaning:"کیف تو"},{word:"his book",meaning:"کتاب او (مذکر)"}], example: "This is my phone.", translation: "این گوشی من است.", question: "اگر کیف متعلق به سارا باشد، کدام درست است؟", choices: ["Her bag", "His bag", "Your bag"], correct: 0, answerWhy: "برای مالکیت یک زن از her استفاده می‌کنیم؛ پس Her bag یعنی کیف او.", duration:"۱۲ دقیقه", skill:"واژگان و گرامر" },
  { id: 14, unit: "واحد ۵ · آدم‌ها و وسایل", title: "داشتن با have و has", description: "درباره چیزهایی که داری صحبت کن.", goal: "در جمله مثبت، have و has را با فاعل درست به کار ببری.", takeaway: "با I/you/we/they از have و با he/she/it از has استفاده می‌کنیم: I have a bike. / She has a bike.", keyWords: [{word:"have",meaning:"داشتن (با I و you و ...)"},{word:"has",meaning:"داشتن (با he و she و it)"},{word:"bike",meaning:"دوچرخه"}], example: "She has a new bike.", translation: "او یک دوچرخه جدید دارد.", question: "جای خالی را کامل کن: My brother ___ a ball.", choices: ["have", "has", "am"], correct: 1, answerWhy: "My brother یک نفر است و می‌توانیم آن را he در نظر بگیریم؛ پس has درست است.", duration:"۱۲ دقیقه", skill:"گرامر و واژگان" },
  { id: 15, unit: "واحد ۶ · زندگی روزمره", title: "حال ساده برای عادت‌ها", description: "درباره کارهایی که هر روز انجام می‌دهی حرف بزن.", goal: "بتوانی با حال ساده درباره عادت‌ها و برنامه روزانه جمله مثبت بسازی.", takeaway: "برای I/you/we/they شکل ساده فعل را می‌آوریم: I play. برای he/she/it معمولاً s اضافه می‌شود: She plays.", keyWords: [{word:"every day",meaning:"هر روز"},{word:"study",meaning:"درس خواندن"},{word:"play",meaning:"بازی کردن"}], example: "I play games after school.", translation: "من بعد از مدرسه بازی می‌کنم.", question: "کدام جمله درست است؟", choices: ["She plays tennis.", "She play tennis.", "She playing tennis."], correct: 0, answerWhy: "فاعل she سوم‌شخص مفرد است؛ در جمله مثبت حال ساده معمولاً به فعل s اضافه می‌کنیم: plays.", duration:"۱۴ دقیقه", skill:"گرامر و مکالمه" },
  { id: 16, unit: "واحد ۶ · زندگی روزمره", title: "قیدهای تکرار", description: "بگو یک کار را چند وقت یک‌بار انجام می‌دهی.", goal: "بتوانی always، usually، sometimes و never را در جمله به کار ببری.", takeaway: "قیدهای تکرار معمولاً قبل از فعل اصلی می‌آیند: I usually walk. اما با فعل be بعد از آن می‌آیند: I am always happy.", keyWords: [{word:"always",meaning:"همیشه"},{word:"usually",meaning:"معمولاً"},{word:"sometimes",meaning:"گاهی"}], example: "I usually do my homework after school.", translation: "من معمولاً بعد از مدرسه تکالیفم را انجام می‌دهم.", question: "کدام جمله جای قید را درست نشان می‌دهد؟", choices: ["I always drink water.", "I drink always water.", "Always I water drink."], correct: 0, answerWhy: "در جمله ساده با فعل اصلی، قید تکرار معمولاً قبل از فعل می‌آید: always drink.", duration:"۱۲ دقیقه", skill:"گرامر و مکالمه" },
  { id: 17, unit: "واحد ۷ · توانایی‌ها و سرگرمی‌ها", title: "بیان توانایی با can", description: "درباره کارهایی که می‌توانی انجام بدهی صحبت کن.", goal: "بتوانی با can توانایی را بیان کنی و سؤال ساده بسازی.", takeaway: "بعد از can فعل ساده و بدون to می‌آید: I can swim. برای سؤال، can را اول می‌آوریم: Can you swim?", keyWords: [{word:"can",meaning:"توانستن"},{word:"swim",meaning:"شنا کردن"},{word:"draw",meaning:"نقاشی کشیدن"}], example: "I can play the guitar.", translation: "من می‌توانم گیتار بزنم.", question: "کدام جمله درست است؟", choices: ["She can dance.", "She can to dance.", "She cans dance."], correct: 0, answerWhy: "بعد از can فعل ساده می‌آید؛ نه to می‌گیرد و نه s سوم‌شخص.", duration:"۱۲ دقیقه", skill:"گرامر و مکالمه" },
  { id: 18, unit: "واحد ۷ · توانایی‌ها و سرگرمی‌ها", title: "علاقه‌ها با like", description: "درباره چیزهایی که دوست داری بگو.", goal: "بتوانی درباره علاقه‌ها با like و likes جمله بسازی.", takeaway: "با I/you/we/they از like و با he/she/it از likes استفاده می‌کنیم. بعد از like می‌توان اسم یا فعل ingدار آورد: I like music. / I like reading.", keyWords: [{word:"like",meaning:"دوست داشتن"},{word:"music",meaning:"موسیقی"},{word:"reading",meaning:"کتاب خواندن"}], example: "I like listening to music.", translation: "من گوش دادن به موسیقی را دوست دارم.", question: "کدام جمله درست است؟", choices: ["He likes football.", "He like football.", "He liking football."], correct: 0, answerWhy: "با he در جمله مثبت حال ساده، likes می‌آید.", duration:"۱۲ دقیقه", skill:"واژگان و مکالمه" },
  { id: 19, unit: "واحد ۸ · مکان‌ها و زمان", title: "حروف اضافه مکان", description: "جای وسایل را دقیق توضیح بده.", goal: "بتوانی از in، on و under برای توصیف مکان استفاده کنی.", takeaway: "in یعنی داخل، on یعنی روی سطح و under یعنی زیر. معنی را با تصویر ذهنی یاد بگیر: The book is on the desk.", keyWords: [{word:"in",meaning:"داخل"},{word:"on",meaning:"روی"},{word:"under",meaning:"زیر"}], example: "My bag is under the desk.", translation: "کیف من زیر میز است.", question: "اگر کتاب روی میز باشد، کدام حرف اضافه مناسب است؟", choices: ["on", "in", "under"], correct: 0, answerWhy: "وقتی چیزی روی سطح میز قرار دارد از on استفاده می‌کنیم.", duration:"۱۲ دقیقه", skill:"واژگان و کاربرد" },
  { id: 20, unit: "واحد ۸ · مکان‌ها و زمان", title: "گفتن ساعت و زمان‌های روز", description: "زمان فعالیت‌های روزانه‌ات را بیان کن.", goal: "بتوانی ساعت‌های ساده را بگویی و از in the morning و at night استفاده کنی.", takeaway: "برای ساعت دقیق از الگوی It's + time استفاده کن: It's seven o'clock. برای زمان‌های روز می‌گوییم in the morning و at night.", keyWords: [{word:"o'clock",meaning:"راس ساعت"},{word:"in the morning",meaning:"صبح‌ها"},{word:"at night",meaning:"شب‌ها"}], example: "I get up at seven o'clock.", translation: "من ساعت هفت بیدار می‌شوم.", question: "کدام عبارت به معنی «صبح‌ها» است؟", choices: ["in the morning", "at night", "in the evening"], correct: 0, answerWhy: "in the morning یعنی صبح‌ها؛ at night یعنی شب‌ها و in the evening یعنی عصرها.", duration:"۱۳ دقیقه", skill:"واژگان و مکالمه" },
];
type LessonContent = {
  concept: string;
  steps: { heading: string; detail: string }[];
  dialogue: { speaker: string; line: string; translation: string }[];
  commonMistake: string;
  practiceTip: string;
  questions: { prompt: string; options: string[]; correct: number; explanation: string }[];
};
const lessonContent: Record<number, LessonContent> = {
  1: {
    concept: "در انگلیسی معمولاً سلام را با توجه به صمیمیت و موقعیت انتخاب می‌کنیم. بعد از سلام، می‌توانیم حال طرف مقابل را بپرسیم و به پاسخ او واکنش کوتاهی نشان دهیم.",
    steps: [
      { heading: "شروع دوستانه", detail: "Hi! در گفت‌وگو با دوست، هم‌کلاسی یا فردی که با او راحتی طبیعی است." },
      { heading: "شروع خنثی‌تر", detail: "Hello! در بیشتر موقعیت‌ها مناسب است و کمی رسمی‌تر از Hi به نظر می‌رسد." },
      { heading: "پرسیدن حال", detail: "How are you? یعنی «حالت چطور است؟». این عبارت سؤال است و در پایان آن علامت سؤال می‌آید." },
      { heading: "پاسخ کوتاه", detail: "می‌توانی بگویی I'm fine, thanks. یا Pretty good, thanks. و بعد بپرسی And you? یعنی «تو چطور؟»" }
    ],
    dialogue: [
      { speaker: "A", line: "Hi, Sara! How are you?", translation: "سلام سارا! حالت چطوره؟" },
      { speaker: "B", line: "I'm good, thanks. And you?", translation: "خوبم، ممنون. تو چطوری؟" },
      { speaker: "A", line: "I'm great, thank you!", translation: "عالی‌ام، ممنون!" }
    ],
    commonMistake: "How are you? را با What are you? اشتباه نگیر. اولی درباره حال شخص است؛ دومی در این موقعیت پرسش طبیعی و درستی نیست.",
    practiceTip: "مکالمه را با صدای بلند دو بار بخوان؛ بار دوم جای Sara را با نام یک دوست عوض کن.",
    questions: [
      { prompt: "برای پرسیدن حال دوستت کدام عبارت درست است؟", options: ["How are you?", "What is your name?", "Where are you from?"], correct: 0, explanation: "How are you? درباره حال مخاطب سؤال می‌کند. دو گزینه دیگر به‌ترتیب نام و محل مبدأ را می‌پرسند." },
      { prompt: "کدام پاسخ برای «How are you?» طبیعی است؟", options: ["I'm fine, thanks.", "My name is Ali.", "I'm from Iran."], correct: 0, explanation: "I'm fine, thanks یعنی «خوبم، ممنون» و پاسخ مستقیم به پرسش حال است." },
      { prompt: "کدام گزینه لحن دوستانه‌تری برای سلام دارد؟", options: ["Hi!", "Goodbye!", "Sorry!"], correct: 0, explanation: "Hi! یک سلام کوتاه و دوستانه است؛ Goodbye برای خداحافظی و Sorry برای عذرخواهی است." }
    ]
  },
  2: {
    concept: "برای معرفی نام، دو الگوی بسیار رایج داریم: My name is + name و I'm + name. هر دو درست‌اند؛ دومی کوتاه‌تر و محاوره‌ای‌تر است.",
    steps: [
      { heading: "الگوی کامل", detail: "My name is Nima. یعنی «اسم من نیما است». بعد از My name حتماً فعل is می‌آید." },
      { heading: "الگوی کوتاه", detail: "I'm Nima. شکل کوتاه I am است و در مکالمه روزمره بسیار رایج است." },
      { heading: "واکنش مؤدبانه", detail: "وقتی با کسی آشنا می‌شوی بگو Nice to meet you. یعنی «از آشنایی با تو خوشحالم»." },
      { heading: "پرسیدن نام", detail: "برای پرسیدن نام می‌توانی بگویی What's your name? شکل کامل آن What is your name? است." }
    ],
    dialogue: [
      { speaker: "A", line: "Hello! What's your name?", translation: "سلام! اسمت چیه؟" },
      { speaker: "B", line: "I'm Nima. What's your name?", translation: "من نیما هستم. اسم تو چیه؟" },
      { speaker: "A", line: "I'm Sara. Nice to meet you.", translation: "من سارا هستم. از آشنایی باهات خوشحالم." },
      { speaker: "B", line: "Nice to meet you, too.", translation: "من هم از آشنایی با تو خوشحالم." }
    ],
    commonMistake: "نگو My name Nima؛ در این ساختار فعل is لازم است: My name is Nima. اما در الگوی کوتاه می‌گویی I'm Nima.",
    practiceTip: "نام خودت را در هر دو الگو بگو و سپس یک بار سؤال What's your name? را تمرین کن.",
    questions: [
      { prompt: "کدام جمله کامل و درست است؟", options: ["My name Ali.", "My name is Ali.", "I name is Ali."], correct: 1, explanation: "ساختار درست My name is + نام است؛ فعل is نباید حذف شود." },
      { prompt: "شکل کوتاه I am کدام است؟", options: ["I'm", "Is", "My"], correct: 0, explanation: "I'm کوتاه‌شده I am است و برای معرفی خود استفاده می‌شود." },
      { prompt: "برای گفتن «من هم از آشنایی با تو خوشحالم» چه می‌گویی؟", options: ["Nice to meet you, too.", "How are you?", "Good night."], correct: 0, explanation: "too در پایان این پاسخ معنی «هم» می‌دهد." }
    ]
  },
  3: {
    concept: "برای گفتن اینکه اهل کجا هستی، از ساختار be + from + place استفاده می‌کنیم. در جمله ساده I am به شکل کوتاه I'm نوشته و گفته می‌شود.",
    steps: [
      { heading: "ساختار اصلی", detail: "I'm from Iran. یعنی «من اهل ایران هستم». بعد از from نام شهر یا کشور می‌آید." },
      { heading: "درباره شخص دیگر", detail: "برای he و she فعل is می‌آید: He is from Spain. / She's from Italy." },
      { heading: "پرسیدن مبدأ", detail: "Where are you from? یعنی «اهل کجا هستی؟». پاسخ را با I'm from ... شروع کن." },
      { heading: "تفاوت مهم", detail: "from درباره مبدأ یا زادگاه است؛ in معمولاً مکان حضور را نشان می‌دهد: I'm in Berlin یعنی الان در برلین هستم." }
    ],
    dialogue: [
      { speaker: "A", line: "Where are you from?", translation: "اهل کجا هستی؟" },
      { speaker: "B", line: "I'm from Iran. And you?", translation: "من اهل ایران هستم. تو چطور؟" },
      { speaker: "A", line: "I'm from Germany.", translation: "من اهل آلمان هستم." }
    ],
    commonMistake: "I'm in Iran و I'm from Iran یک معنی ندارند: اولی می‌گوید الان در ایران هستم؛ دومی می‌گوید اهل ایرانم.",
    practiceTip: "جمله I'm from ... را با نام سه کشور یا شهر مختلف تمرین کن؛ سپس سؤال Where are you from? را با صدای بلند بپرس.",
    questions: [
      { prompt: "جای خالی را کامل کن: I'm ___ Iran.", options: ["from", "at", "are"], correct: 0, explanation: "برای بیان مبدأ از from استفاده می‌کنیم: I'm from Iran." },
      { prompt: "معنی Where are you from? چیست؟", options: ["چند سالته؟", "اهل کجا هستی؟", "حالت چطوره؟"], correct: 1, explanation: "Where درباره مکان می‌پرسد و Where are you from? یعنی اهل کجا هستی؟" },
      { prompt: "کدام جمله می‌گوید «او (مذکر) اهل اسپانیاست»؟", options: ["He is from Spain.", "He are from Spain.", "He from Spain."], correct: 0, explanation: "برای he در زمان حال ساده فعل be به شکل is می‌آید." }
    ]
  },
  4: {
    concept: "ضمیر فاعلی جای نام شخص یا گروه را می‌گیرد و معمولاً پیش از فعل قرار می‌گیرد. انتخاب ضمیر به شخص و تعداد بستگی دارد.",
    steps: [
      { heading: "شخص اول و دوم", detail: "I یعنی من؛ you یعنی تو یا شما. You هم برای یک نفر و هم برای چند نفر استفاده می‌شود." },
      { heading: "شخص سوم مفرد", detail: "He برای مرد یا پسر، she برای زن یا دختر و it برای شیء، حیوان یا مفهوم به کار می‌رود." },
      { heading: "حالت جمع", detail: "We یعنی ما و they یعنی آن‌ها. They برای چند انسان یا چند چیز استفاده می‌شود." },
      { heading: "ضمیر و فعل be", detail: "در جمله‌های پایه می‌گوییم: I am، You are، He/She/It is، We/They are." }
    ],
    dialogue: [
      { speaker: "A", line: "Who is he?", translation: "او (مذکر) کیست؟" },
      { speaker: "B", line: "He is my brother.", translation: "او برادر من است." },
      { speaker: "A", line: "And who are they?", translation: "و آن‌ها چه کسانی هستند؟" },
      { speaker: "B", line: "They are my friends.", translation: "آن‌ها دوستان من هستند." }
    ],
    commonMistake: "برای he و she از are استفاده نکن. شکل درست He is و She is است؛ اما با you و they از are استفاده می‌کنیم.",
    practiceTip: "به سه نفر یا سه شیء اطرافت اشاره کن و برای هرکدام یک جمله با he، she، it یا they بساز.",
    questions: [
      { prompt: "برای اشاره به یک مرد از کدام ضمیر استفاده می‌کنیم؟", options: ["She", "He", "They"], correct: 1, explanation: "He ضمیر سوم‌شخص مفرد برای مرد یا پسر است." },
      { prompt: "جای خالی را کامل کن: They ___ my friends.", options: ["am", "is", "are"], correct: 2, explanation: "They با فعل are می‌آید: They are my friends." },
      { prompt: "کدام گزینه برای «ما» است؟", options: ["We", "You", "It"], correct: 0, explanation: "We یعنی ما؛ You یعنی تو/شما و It برای یک شیء یا حیوان است." }
    ]
  },
  5: {
    concept: "عددها برای بیان تعداد، سن، شماره و قیمت در مکالمه‌های روزمره لازم‌اند. در این درس روی چند عدد پایه و تفاوت شکل نوشتاری آن‌ها تمرکز می‌کنیم.",
    steps: [
      { heading: "عددهای پایه", detail: "one یعنی یک، two یعنی دو و three یعنی سه. این سه عدد را چند بار با صدای بلند تکرار کن." },
      { heading: "عددهای پنج و ده", detail: "five یعنی پنج و ten یعنی ده. به املای five دقت کن؛ حرف پایانی آن e است." },
      { heading: "عدد دوازده", detail: "twelve یعنی دوازده و شکل آن مانند two یا ten ساخته نشده؛ بهتر است آن را جداگانه به خاطر بسپاری." },
      { heading: "تمرین در جمله", detail: "I have five books یعنی من پنج کتاب دارم. عدد پیش از اسم می‌آید." }
    ],
    dialogue: [
      { speaker: "A", line: "How many books do you have?", translation: "چند کتاب داری؟" },
      { speaker: "B", line: "I have five books.", translation: "من پنج کتاب دارم." },
      { speaker: "A", line: "I have ten books.", translation: "من ده کتاب دارم." }
    ],
    commonMistake: "عدد thirteen به معنی سیزده است و thirty به معنی سی؛ این دو را با هم اشتباه نگیر.",
    practiceTip: "از یک تا بیست بشمار و سپس تعداد سه وسیله اطرافت را به انگلیسی بگو.",
    questions: [
      { prompt: "کدام واژه به معنی دوازده است؟", options: ["Twelve", "Twenty", "Two"], correct: 0, explanation: "Twelve یعنی دوازده؛ twenty بیست و two دو است." },
      { prompt: "عدد پنج کدام است؟", options: ["Five", "Fifteen", "Four"], correct: 0, explanation: "Five یعنی پنج؛ fifteen پانزده و four چهار است." },
      { prompt: "جای خالی را کامل کن: I have ___ books. (۱۰)", options: ["ten", "one", "three"], correct: 0, explanation: "عدد ده در انگلیسی ten نوشته می‌شود." }
    ]
  },
  6: {
    concept: "برای صحبت درباره خانواده، نام اعضا را یاد می‌گیریم و آن‌ها را با ساختارهای ساده معرفی می‌کنیم.",
    steps: [
      { heading: "والدین", detail: "mother یعنی مادر و father یعنی پدر. برای گفتن «مادر من» می‌گوییم my mother." },
      { heading: "خواهر و برادر", detail: "sister یعنی خواهر و brother یعنی برادر." },
      { heading: "معرفی با this is", detail: "This is my father یعنی «این پدر من است». از این ساختار برای معرفی یک نفر استفاده می‌کنیم." },
      { heading: "مالکیت با my", detail: "my پیش از اسم می‌آید و معنی «مال من / ـِ من» می‌دهد: my sister، my family." }
    ],
    dialogue: [
      { speaker: "A", line: "Who is she?", translation: "او کیست؟" },
      { speaker: "B", line: "She is my sister.", translation: "او خواهر من است." },
      { speaker: "A", line: "And who is he?", translation: "و او کیست؟" },
      { speaker: "B", line: "He is my father.", translation: "او پدر من است." }
    ],
    commonMistake: "mother و father را با هم جابه‌جا نکن؛ mother مادر و father پدر است. برای برادر از brother استفاده می‌کنیم.",
    practiceTip: "سه عضو خانواده را با الگوی This is my ... معرفی کن.",
    questions: [
      { prompt: "معنی sister چیست؟", options: ["خواهر", "مادر", "برادر"], correct: 0, explanation: "Sister یعنی خواهر؛ brother یعنی برادر." },
      { prompt: "جای خالی را کامل کن: This is ___ mother.", options: ["my", "I", "me"], correct: 0, explanation: "برای گفتن «مادر من» از my mother استفاده می‌کنیم." },
      { prompt: "کدام جمله می‌گوید «او پدر من است»؟", options: ["He is my father.", "She is my sister.", "I am a student."], correct: 0, explanation: "He is my father یعنی او پدر من است." }
    ]
  },
  7: {
    concept: "برای معرفی شغل افراد از نام شغل همراه فعل be استفاده می‌کنیم. در این درس چند شغل رایج و ساختار جمله را می‌آموزی.",
    steps: [
      { heading: "نام شغل‌ها", detail: "teacher یعنی معلم، doctor یعنی پزشک و student یعنی دانش‌آموز یا دانشجو." },
      { heading: "معرفی شغل", detail: "I am a student یعنی من دانش‌آموز/دانشجو هستم. برای he و she از is استفاده می‌کنیم." },
      { heading: "استفاده از a", detail: "در جمله She is a teacher، حرف a پیش از اسم شغل مفرد آمده است." },
      { heading: "پرسیدن شغل", detail: "What do you do? پرسشی رایج برای پرسیدن شغل است؛ پاسخ می‌تواند I am a student باشد." }
    ],
    dialogue: [
      { speaker: "A", line: "What do you do?", translation: "چه‌کاره‌ای؟" },
      { speaker: "B", line: "I'm a student.", translation: "من دانش‌آموز/دانشجو هستم." },
      { speaker: "A", line: "My mother is a doctor.", translation: "مادر من پزشک است." }
    ],
    commonMistake: "در جمله معرفی شغل مفرد، حرف تعریف را فراموش نکن: She is teacher نادرست است؛ She is a teacher درست است.",
    practiceTip: "با سه شغل این درس جمله بساز: I am a ... / He is a ... / She is a ...",
    questions: [
      { prompt: "معنی doctor چیست؟", options: ["پزشک", "معلم", "دانش‌آموز"], correct: 0, explanation: "Doctor یعنی پزشک." },
      { prompt: "کدام جمله درست است؟", options: ["She is a teacher.", "She are a teacher.", "She is teacher."], correct: 0, explanation: "با she از is استفاده می‌کنیم و پیش از شغل مفرد a می‌آید." },
      { prompt: "کدام واژه به معنی دانش‌آموز یا دانشجو است؟", options: ["Student", "Doctor", "Father"], correct: 0, explanation: "Student به معنی دانش‌آموز یا دانشجو است." }
    ]
  },
  8: {
    concept: "a و an هر دو معنی «یک» می‌دهند و پیش از اسم مفرد قابل‌شمارش می‌آیند. انتخاب میان آن‌ها به صدای آغازین واژه بعدی بستگی دارد.",
    steps: [
      { heading: "کاربرد a", detail: "پیش از صدای همخوان از a استفاده می‌کنیم: a book، a teacher." },
      { heading: "کاربرد an", detail: "پیش از صدای واکه از an استفاده می‌کنیم: an apple، an egg." },
      { heading: "به صدا توجه کن", detail: "ملاک صدای آغازین است، نه صرفاً حرف اول. برای نمونه an hour با صدای آغازین واکه گفته می‌شود." },
      { heading: "در جمله", detail: "It is an apple یعنی این یک سیب است. a یا an پیش از اسم می‌آید." }
    ],
    dialogue: [
      { speaker: "A", line: "What is this?", translation: "این چیست؟" },
      { speaker: "B", line: "It is an apple.", translation: "این یک سیب است." },
      { speaker: "A", line: "And that is a book.", translation: "و آن یک کتاب است." }
    ],
    commonMistake: "an book نادرست است؛ چون book با صدای همخوان آغاز می‌شود، باید بگویی a book.",
    practiceTip: "پنج اسم انگلیسی اطرافت پیدا کن و قبل از هرکدام a یا an بگذار.",
    questions: [
      { prompt: "کدام عبارت درست است؟", options: ["an apple", "a apple", "an book"], correct: 0, explanation: "Apple با صدای واکه آغاز می‌شود؛ پس an apple درست است." },
      { prompt: "پیش از book از چه چیزی استفاده می‌کنیم؟", options: ["a", "an", "are"], correct: 0, explanation: "Book با صدای همخوان آغاز می‌شود؛ عبارت درست a book است." },
      { prompt: "کدام جمله درست است؟", options: ["It is an egg.", "It is a egg.", "It an egg."], correct: 0, explanation: "Egg با صدای واکه آغاز می‌شود و جمله کامل به فعل is نیاز دارد." }
    ]
  },
  9: {
    concept: "this و that برای اشاره به یک شخص یا چیز به کار می‌روند. تفاوت اصلی آن‌ها فاصله است: this نزدیک و that دور.",
    steps: [
      { heading: "چیز نزدیک", detail: "This یعنی این. وقتی چیزی نزدیک توست می‌گویی This is my pen." },
      { heading: "چیز دور", detail: "That یعنی آن. برای چیزی دورتر می‌گویی That is a car." },
      { heading: "پرسش درباره چیز", detail: "What is this? یعنی «این چیست؟». می‌توانی با It is a ... پاسخ بدهی." },
      { heading: "شکل کوتاه", detail: "That is را می‌توان به That's کوتاه کرد: That's my bag." }
    ],
    dialogue: [
      { speaker: "A", line: "What is this?", translation: "این چیست؟" },
      { speaker: "B", line: "This is my phone.", translation: "این تلفن من است." },
      { speaker: "A", line: "What is that?", translation: "آن چیست؟" },
      { speaker: "B", line: "That is a bus.", translation: "آن یک اتوبوس است." }
    ],
    commonMistake: "برای یک چیز نزدیک از this و برای یک چیز دور از that استفاده کن؛ these شکل جمع this است و در این درس موضوع اصلی ما نیست.",
    practiceTip: "به یک وسیله نزدیک و یک وسیله دور اشاره کن و برای هرکدام جمله بساز.",
    questions: [
      { prompt: "برای اشاره به یک چیز نزدیک کدام واژه مناسب است؟", options: ["This", "That", "Those"], correct: 0, explanation: "This برای یک چیز نزدیک استفاده می‌شود." },
      { prompt: "معنی That is my bag چیست؟", options: ["آن کیف من است.", "این کیف من است.", "کیف من کجاست؟"], correct: 0, explanation: "That یعنی آن؛ پس جمله یعنی «آن کیف من است»." },
      { prompt: "شکل کوتاه That is کدام است؟", options: ["That's", "This's", "Those"], correct: 0, explanation: "That's شکل کوتاه That is است." }
    ]
  },
  10: {
    concept: "در انگلیسی بسیاری از اسم‌های قابل‌شمارش برای نشان دادن بیش از یکی، s می‌گیرند. این شکل را جمع می‌نامیم.",
    steps: [
      { heading: "اسم مفرد", detail: "book یعنی یک کتاب و cat یعنی یک گربه." },
      { heading: "ساخت جمع ساده", detail: "برای بسیاری از اسم‌ها s اضافه می‌کنیم: book → books و cat → cats." },
      { heading: "عدد و اسم جمع", detail: "بعد از two، three و عددهای بیشتر از یک، معمولاً اسم جمع می‌آید: two books." },
      { heading: "همه اسم‌ها یکسان نیستند", detail: "بعضی اسم‌ها جمع بی‌قاعده دارند؛ مانند child → children. آن‌ها را باید جداگانه یاد گرفت." }
    ],
    dialogue: [
      { speaker: "A", line: "How many cats do you have?", translation: "چند گربه داری؟" },
      { speaker: "B", line: "I have two cats.", translation: "من دو گربه دارم." },
      { speaker: "A", line: "I have three books.", translation: "من سه کتاب دارم." }
    ],
    commonMistake: "برای دو یا چند مورد، اسم ساده مفرد را بدون تغییر نیاور: two book نادرست است؛ two books درست است.",
    practiceTip: "نام سه وسیله را یک بار مفرد و یک بار جمع بنویس؛ مثل pen/pens.",
    questions: [
      { prompt: "جمع ساده book کدام است؟", options: ["books", "bookes", "book"], correct: 0, explanation: "برای جمع ساده book فقط s اضافه می‌کنیم: books." },
      { prompt: "کدام عبارت درست است؟", options: ["two cats", "two cat", "two cates"], correct: 0, explanation: "بعد از two اسم به شکل جمع می‌آید: two cats." },
      { prompt: "جمع بی‌قاعده child کدام است؟", options: ["childs", "children", "childes"], correct: 1, explanation: "Children شکل جمع بی‌قاعده child است." }
    ]
  },
  11: {
    concept: "برای گفتن اینکه چیزی یا کسی این‌طور نیست، not را به فعل be اضافه می‌کنیم. در انگلیسی جای کلمه‌ها مهم است؛ پس به ترتیب فاعل، فعل و not دقت کن.",
    steps: [{heading:"جمله مثبت را ببین",detail:"He is tired یعنی او خسته است. اول فاعل He و بعد فعل is آمده است."},{heading:"not را اضافه کن",detail:"He is not tired یعنی او خسته نیست. not بعد از am/is/are می‌آید."},{heading:"شکل کوتاه و طبیعی",detail:"He isn't tired همان معنی را دارد. I'm not شکل کوتاه I am not است."}],
    dialogue:[{speaker:"A",line:"Are you tired?",translation:"خسته‌ای؟"},{speaker:"B",line:"No, I'm not. I'm ready!",translation:"نه، خسته نیستم. آماده‌ام!"}],
    commonMistake:"نگو He not is tired. ترتیب درست He is not tired است؛ not بعد از فعل be قرار می‌گیرد.",
    practiceTip:"سه جمله درباره خودت بساز: یک جمله مثبت و یک جمله منفی درباره حالت، و یک جمله درباره دوستت.",
    questions:[{prompt:"کدام جمله منفی درست است؟",options:["She isn't hungry.","She not is hungry.","She aren't hungry."],correct:0,explanation:"با she از is استفاده می‌کنیم و شکل کوتاه منفی آن isn't است."},{prompt:"معنی I'm not late چیست؟",options:["من دیر نکرده‌ام / دیر نیستم.","من خیلی خوشحالم.","من آماده‌ام."],correct:0,explanation:"I'm not یعنی من نیستم؛ late یعنی دیر. پس جمله می‌گوید من دیر نیستم."},{prompt:"جای خالی را کامل کن: They ___ at home.",options:["aren't","isn't","am not"],correct:0,explanation:"برای they از are استفاده می‌کنیم؛ شکل منفی کوتاه آن aren't است."}]
  },
  12: {
    concept:"در سؤال‌های ساده با am/is/are، فعل را به ابتدای جمله می‌بریم. این تغییر ترتیب کمک می‌کند شنونده بفهمد سؤال می‌پرسیم.",
    steps:[{heading:"جمله معمولی",detail:"You are ready یعنی تو آماده‌ای. فاعل You اول آمده و بعد are."},{heading:"جمله را سؤالی کن",detail:"Are you ready? فقط جای are و you عوض می‌شود؛ معنی اصلی حفظ می‌شود."},{heading:"پاسخ کوتاه",detail:"Yes, I am یا No, I'm not. در پاسخ کوتاه، فعل را تکرار می‌کنیم."}],
    dialogue:[{speaker:"A",line:"Are you in class?",translation:"در کلاس هستی؟"},{speaker:"B",line:"Yes, I am. Are you?",translation:"بله، هستم. تو چطور؟"}],
    commonMistake:"در سؤال نگو You are ready? در انگلیسی معیار مبتدی، شکل روشن و درست این است: Are you ready?",
    practiceTip:"از یک دوست سه سؤال بساز: Are you happy? Are you a student? Are you ready?",
    questions:[{prompt:"کدام سؤال ترتیب درست دارد؟",options:["Is he your friend?","He is your friend?","Is your friend he?"],correct:0,explanation:"فعل is قبل از فاعل he قرار می‌گیرد."},{prompt:"پاسخ کوتاه مثبت به Are they ready? کدام است؟",options:["Yes, they are.","Yes, they is.","Yes, are they."],correct:0,explanation:"در پاسخ کوتاه، فاعل و شکل درست فعل را می‌آوریم: they are."},{prompt:"کدام جمله یک سؤال بله/خیر است؟",options:["Are you okay?","You are okay.","You okay are."],correct:0,explanation:"قرار گرفتن are در ابتدای جمله، آن را به سؤال بله/خیر تبدیل می‌کند."}]
  },
  13: {
    concept:"برای اینکه معلوم شود یک چیز متعلق به چه کسی است، از کلمات مالکیت استفاده می‌کنیم. این کلمات قبل از اسم قرار می‌گیرند و جای اسم را نمی‌گیرند.",
    steps:[{heading:"my و your",detail:"my یعنی مال من و your یعنی مال تو یا شما: my phone، your notebook."},{heading:"his و her",detail:"his برای مالکیت یک مرد/پسر و her برای یک زن/دختر است: his game، her bag."},{heading:"در جمله استفاده کن",detail:"This is my phone. یعنی این گوشی من است. کلمه my پیش از phone آمده است."}],
    dialogue:[{speaker:"A",line:"Is this your notebook?",translation:"این دفتر توست؟"},{speaker:"B",line:"No, it's her notebook.",translation:"نه، دفتر اوست."}],
    commonMistake:"my با me فرق دارد. my قبل از اسم می‌آید (my book)، اما me شکل مفعولی ضمیر است.",
    practiceTip:"سه وسیله اطرافت را انتخاب کن و با my، your یا his/her معرفی کن.",
    questions:[{prompt:"اگر وسیله متعلق به یک دختر باشد، کدام مناسب است؟",options:["her pencil","his pencil","I pencil"],correct:0,explanation:"her برای مالکیت یک دختر/زن استفاده می‌شود."},{prompt:"کدام عبارت یعنی «دفتر تو»؟",options:["your notebook","you notebook","yours notebook"],correct:0,explanation:"your صفت ملکی است و پیش از اسم notebook می‌آید."},{prompt:"جمله را کامل کن: Ali has a bike. It is ___ bike.",options:["his","her","my"],correct:0,explanation:"Ali نام پسرانه در این مثال است؛ برای مالکیت او از his استفاده می‌کنیم."}]
  },
  14: {
    concept:"have و has هر دو معنی «داشتن» می‌دهند. انتخابشان به فاعل جمله بستگی دارد، نه به چیزی که داریم.",
    steps:[{heading:"با I و you",detail:"I have a phone و You have a bike. برای I و you از have استفاده می‌کنیم."},{heading:"با he و she",detail:"He has a ball و She has a cat. برای he و she از has استفاده می‌کنیم."},{heading:"فاعل را پیدا کن",detail:"قبل از انتخاب فعل، ببین چه کسی چیزی دارد. My brother مثل he است، پس has می‌گیرد."}],
    dialogue:[{speaker:"A",line:"Do you have a pet?",translation:"حیوان خانگی داری؟"},{speaker:"B",line:"Yes, I have a cat.",translation:"بله، یک گربه دارم."}],
    commonMistake:"نگو She have a dog. چون فاعل she است، باید بگویی She has a dog.",
    practiceTip:"درباره خودت، دوستت و یکی از اعضای خانواده سه جمله با have یا has بساز.",
    questions:[{prompt:"کدام جمله درست است؟",options:["My sister has a tablet.","My sister have a tablet.","My sister haves a tablet."],correct:0,explanation:"My sister برابر she است؛ پس has درست است."},{prompt:"جای خالی: We ___ two English books.",options:["have","has","is"],correct:0,explanation:"برای we از have استفاده می‌کنیم."},{prompt:"معنی He has a new bag چیست؟",options:["او یک کیف جدید دارد.","او یک کیف جدید است.","آن‌ها کیف جدید دارند."],correct:0,explanation:"has در این ساختار معنی داشتن می‌دهد و he یعنی او (مذکر)."}]
  },
  15: {
    concept:"حال ساده برای کارهایی است که معمولاً، مرتب یا به‌عنوان عادت انجام می‌دهیم؛ نه لزوماً همین لحظه.",
    steps:[{heading:"درباره خودت",detail:"I study English یعنی من انگلیسی می‌خوانم. با I شکل ساده فعل study را می‌آوریم."},{heading:"درباره یک نفر دیگر",detail:"با he/she/it در جمله مثبت معمولاً به فعل s یا es اضافه می‌کنیم: She studies."},{heading:"نشانه‌های عادت",detail:"عبارت‌هایی مثل every day و after school کمک می‌کنند بفهمیم درباره برنامه و عادت حرف می‌زنیم."}],
    dialogue:[{speaker:"A",line:"What do you do after school?",translation:"بعد از مدرسه چه کار می‌کنی؟"},{speaker:"B",line:"I play basketball and study English.",translation:"بسکتبال بازی می‌کنم و انگلیسی می‌خوانم."}],
    commonMistake:"برای he یا she در جمله مثبت، s فعل را فراموش نکن: He plays، نه He play.",
    practiceTip:"برنامه یک روز معمولی خودت را با سه جمله انگلیسی توصیف کن.",
    questions:[{prompt:"کدام جمله درباره عادت درست است؟",options:["I watch videos after school.","I watches videos after school.","I watching videos after school."],correct:0,explanation:"با I، فعل در شکل ساده watch می‌آید."},{prompt:"جای خالی: Sara ___ English every day.",options:["studies","study","studying"],correct:0,explanation:"Sara برابر she است. study به studies تبدیل می‌شود."},{prompt:"کدام عبارت بیشتر به عادت اشاره می‌کند؟",options:["every day","right now","at this second"],correct:0,explanation:"every day یعنی هر روز و نشانه‌ای از تکرار و عادت است."}]
  },
  16: {
    concept:"گاهی مهم نیست فقط چه کاری انجام می‌دهیم؛ مهم است چند بار آن را انجام می‌دهیم. قیدهای تکرار این مقدار را نشان می‌دهند.",
    steps:[{heading:"از همیشه تا هرگز",detail:"always یعنی همیشه، usually یعنی معمولاً، sometimes یعنی گاهی و never یعنی هرگز."},{heading:"جای قید با فعل اصلی",detail:"معمولاً قید پیش از فعل اصلی می‌آید: I usually study."},{heading:"جای قید با be",detail:"اگر فعل جمله am/is/are باشد، قید بعد از آن می‌آید: She is always kind."}],
    dialogue:[{speaker:"A",line:"Do you always play games?",translation:"همیشه بازی می‌کنی؟"},{speaker:"B",line:"No, I sometimes read books.",translation:"نه، گاهی کتاب می‌خوانم."}],
    commonMistake:"نگو I play always football. جای طبیعی قید تکرار در این جمله I always play football است.",
    practiceTip:"چهار فعالیت روزانه انتخاب کن و با always، usually، sometimes یا never درباره‌شان جمله بساز.",
    questions:[{prompt:"کدام جمله ترتیب درست دارد؟",options:["I sometimes read.","I read sometimes books.","Sometimes I am read."],correct:0,explanation:"قید sometimes پیش از فعل اصلی read آمده است."},{prompt:"معنی usually چیست؟",options:["معمولاً","هرگز","به‌ندرت"],correct:0,explanation:"usually یعنی معمولاً؛ یعنی کاری در بیشتر مواقع انجام می‌شود."},{prompt:"جای درست قید را انتخاب کن: He is ___ late.",options:["never","late never","is neverly"],correct:0,explanation:"با فعل be، قید تکرار بعد از آن می‌آید: is never late."}]
  },
  17: {
    concept:"can برای بیان توانایی یا اجازه به کار می‌رود. در این درس از آن برای گفتن کارهایی استفاده می‌کنیم که بلدیم انجام بدهیم.",
    steps:[{heading:"توانایی خودت",detail:"I can swim یعنی من می‌توانم شنا کنم. can برای همه فاعل‌ها یکسان است."},{heading:"بعد از can چه می‌آید؟",detail:"بعد از can شکل ساده فعل می‌آید: can play، can draw. نه to می‌آوریم و نه s."},{heading:"سؤال بساز",detail:"Can you ride a bike? یعنی می‌توانی دوچرخه‌سواری کنی؟ پاسخ: Yes, I can یا No, I can't."}],
    dialogue:[{speaker:"A",line:"Can you play chess?",translation:"می‌توانی شطرنج بازی کنی؟"},{speaker:"B",line:"Yes, I can, but I can't play the guitar.",translation:"بله، می‌توانم؛ اما نمی‌توانم گیتار بزنم."}],
    commonMistake:"بعد از can، فعل ساده می‌آید. can to swim و can swims نادرست‌اند.",
    practiceTip:"سه توانایی واقعی خودت را با I can و یک کاری را که هنوز بلد نیستی با I can't بنویس.",
    questions:[{prompt:"کدام جمله درست است؟",options:["I can draw.","I can to draw.","I cans draw."],correct:0,explanation:"بعد از can فعل ساده draw می‌آید."},{prompt:"پاسخ کوتاه به Can she sing? کدام است؟",options:["Yes, she can.","Yes, she cans.","Yes, can she."],correct:0,explanation:"در پاسخ کوتاه، فاعل و can را می‌آوریم."},{prompt:"معنی I can't skate چیست؟",options:["من نمی‌توانم اسکیت کنم.","من اسکیت دوست دارم.","من همیشه اسکیت می‌کنم."],correct:0,explanation:"can't شکل منفی cannot است و ناتوانی را نشان می‌دهد."}]
  },
  18: {
    concept:"برای حرف زدن درباره علاقه‌ها از like استفاده می‌کنیم. می‌توانیم بگوییم چه چیزی را دوست داریم یا از انجام چه کاری لذت می‌بریم.",
    steps:[{heading:"اسم بعد از like",detail:"I like music یعنی من موسیقی را دوست دارم. بعد از like می‌توان اسم آورد."},{heading:"فعل ingدار",detail:"I like reading یعنی من کتاب خواندن را دوست دارم. برای بیان فعالیت موردعلاقه، فعل ingدار می‌آید."},{heading:"با he و she",detail:"در جمله مثبت حال ساده با he/she می‌گوییم likes: She likes art."}],
    dialogue:[{speaker:"A",line:"What kind of music do you like?",translation:"چه نوع موسیقی‌ای دوست داری؟"},{speaker:"B",line:"I like pop music. I also like reading.",translation:"موسیقی پاپ دوست دارم. کتاب خواندن را هم دوست دارم."}],
    commonMistake:"در جمله مثبت با he یا she، likes را به کار ببر؛ اما بعد از can همچنان فعل ساده می‌آید.",
    practiceTip:"سه علاقه‌ات را با I like بنویس و از یک دوست بپرس What do you like?",
    questions:[{prompt:"کدام جمله درست است؟",options:["He likes football.","He like football.","He likes play football."],correct:0,explanation:"با he از likes استفاده می‌کنیم؛ برای جمله ساده همین ساختار کافی است."},{prompt:"کدام عبارت یعنی «من نقاشی کردن را دوست دارم»؟",options:["I like drawing.","I like draw.","I likes drawing."],correct:0,explanation:"بعد از like برای فعالیت می‌توان از فعل ingدار drawing استفاده کرد."},{prompt:"جای خالی: They ___ video games.",options:["like","likes","liking"],correct:0,explanation:"برای they از شکل ساده like استفاده می‌کنیم."}]
  },
  19: {
    concept:"حروف اضافه مکان مثل یک نقشه کوچک‌اند؛ به شنونده می‌گویند چیزی دقیقاً کجاست.",
    steps:[{heading:"in یعنی داخل",detail:"The keys are in the bag یعنی کلیدها داخل کیف هستند."},{heading:"on یعنی روی سطح",detail:"The phone is on the desk یعنی گوشی روی میز است."},{heading:"under یعنی زیر",detail:"The ball is under the chair یعنی توپ زیر صندلی است."}],
    dialogue:[{speaker:"A",line:"Where is my phone?",translation:"گوشی من کجاست؟"},{speaker:"B",line:"It's on your desk.",translation:"روی میزت است."}],
    commonMistake:"in و on را جابه‌جا نکن: داخل کیف in the bag است؛ روی میز on the desk.",
    practiceTip:"به اتاقت نگاه کن و جای سه وسیله را با in، on یا under توصیف کن.",
    questions:[{prompt:"اگر مداد داخل جامدادی باشد، کدام درست است؟",options:["in the pencil case","on the pencil case","under the pencil case"],correct:0,explanation:"in یعنی داخل؛ پس in the pencil case درست است."},{prompt:"معنی under the table چیست؟",options:["زیر میز","روی میز","داخل میز"],correct:0,explanation:"under به معنی زیر است."},{prompt:"کدام جمله درست است؟",options:["The book is on the desk.","The book is in the desk (برای روی میز).","The book under is desk."],correct:0,explanation:"برای قرار داشتن روی سطح میز از on the desk استفاده می‌کنیم."}]
  },
  20: {
    concept:"برای برنامه‌ریزی و صحبت درباره روز، باید بتوانیم ساعت و بخش‌های مختلف روز را بیان کنیم.",
    steps:[{heading:"ساعت دقیق",detail:"It's seven o'clock یعنی ساعت هفت است. برای ساعت‌های دقیق می‌توانی o'clock را به کار ببری."},{heading:"زمان‌های روز",detail:"in the morning یعنی صبح، in the afternoon یعنی بعدازظهر و in the evening یعنی عصر."},{heading:"یک نکته کاربردی",detail:"برای night معمولاً می‌گوییم at night. مثال: I read at night."}],
    dialogue:[{speaker:"A",line:"What time do you get up?",translation:"چه ساعتی بیدار می‌شوی؟"},{speaker:"B",line:"I get up at seven o'clock.",translation:"ساعت هفت بیدار می‌شوم."}],
    commonMistake:"برای گفتن «شب‌ها» معمولاً at night می‌گوییم، نه in the night در جمله‌های ساده روزمره.",
    practiceTip:"برنامه صبح تا شب خودت را با سه ساعت ساده و عبارت‌های morning و night تعریف کن.",
    questions:[{prompt:"کدام عبارت یعنی «ساعت هشت»؟",options:["eight o'clock","eight clock","o'clock eight"],correct:0,explanation:"الگوی رایج برای ساعت دقیق عدد + o'clock است."},{prompt:"کدام عبارت یعنی «شب‌ها»؟",options:["at night","in the morning","in the afternoon"],correct:0,explanation:"at night برای اشاره به شب به کار می‌رود."},{prompt:"جمله را کامل کن: I go to school ___ the morning.",options:["in","on","under"],correct:0,explanation:"ترکیب درست in the morning است."}]
  },
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
          <section className="welcome-block"><div><span className="eyebrow"><i/> فضای شخصی یادگیری</span><h1>از همین‌جا شروع کن.</h1><p>قرار نیست همه‌چیز را یک‌روزه یاد بگیری؛ فقط درس بعدی را بردار.</p></div></section>
          <button className="vip-promo-banner" onClick={() => go("vip")}><span className="vip-promo-icon"><Crown size={24}/></span><span className="vip-promo-copy"><small>شگفت انگیز! 🎉🔥</small><strong>اشتراک VIP</strong></span><span className="vip-promo-action">مشاهده پیشنهاد <ChevronLeft size={16}/></span><span className="vip-pulse" aria-hidden="true"/></button>
          <section className="next-card"><div className="next-card-copy"><span className="section-kicker">قدم بعدی تو</span><h2>{completed.length === lessons.length ? "آفرین! این بخش را تمام کردی." : nextLesson.title}</h2><p>{completed.length === lessons.length ? "می‌توانی درس‌ها را مرور کنی یا سراغ مسیر بعدی بروی." : nextLesson.description}</p><div className="next-meta"><span><Clock3 size={14}/>{nextLesson.duration}</span><span><BookOpen size={14}/>{nextLesson.skill}</span></div><button className="primary-button" onClick={() => openLesson(nextLesson.id)}>{completed.length === lessons.length ? "مرور درس‌ها" : "شروع درس بعدی"} <ArrowRight size={16}/></button></div><div className="next-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-core"><Languages size={37}/></div><span>قدم بعدی تو</span></div></section>
          <div className="section-heading"><div><span className="section-kicker">نمای کلی</span><h2>پیشرفت یادگیری</h2></div><button className="subtle-link" onClick={() => go("learn")}>دیدن همه درس‌ها <ChevronLeft size={15}/></button></div>
          <section className="overview-grid"><div className="overview-card progress-card"><div className="card-icon"><Target size={19}/></div><div className="overview-label">پیشرفت این بخش</div><div className="progress-big">{progress}<small>٪</small></div><div className="progress-bar"><i style={{width: progress + "%"}}/></div><p>{completed.length} درس از {lessons.length} درس تکمیل شده</p></div><div className="overview-card"><div className="card-icon"><Award size={19}/></div><div className="overview-label">امتیازهای LIR</div><div className="overview-number">{lirBalance}</div><p>۲ LIR برای هر درس جدید و تکمیل‌شده</p></div><div className="overview-card"><div className="card-icon"><BookOpen size={19}/></div><div className="overview-label">درس‌های این بخش</div><div className="overview-number">{lessons.length}</div><p>درس کوتاه و مرحله‌به‌مرحله</p><button className="card-action" onClick={() => go("learn")}>رفتن به درس‌ها <ChevronLeft size={14}/></button></div><div className="overview-card"><div className="card-icon"><Bookmark size={19}/></div><div className="overview-label">لغت‌های ذخیره‌شده</div><div className="overview-number">{saved.length}</div><p>لغت‌هایی که برای مرور نگه داشتی</p><button className="card-action" onClick={() => go("vocabulary")}>مرور لغت‌ها <ChevronLeft size={14}/></button></div></section>
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