import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard, BookOpen, Library, MessageCircle, ChevronLeft,
  CheckCircle2, Clock3, Target, Languages, Menu, X, Bookmark, Volume2,
  LockKeyhole, ArrowRight, Search, Mic, MicOff, RotateCcw, Award
} from "lucide-react";

type Tab = "home" | "learn" | "vocabulary" | "assistant";
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
type Lesson = { id: number; unit: string; title: string; description: string; duration: string; skill: string; goal: string; explanation: string; takeaway: string; keyWords: { word: string; meaning: string }[]; example: string; translation: string; question: string; choices: string[]; correct: number; answerWhy: string; };
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
  { id: 10, unit: "واحد ۳ · ساخت جمله", title: "جمع بستن اسم‌ها", description: "درباره بیش از یک چیز صحبت کن.", goal: "جمع ساده اسم‌ها را با افزودن s بسازی و در جمله تشخیص بدهی.", takeaway: "بسیاری از اسم‌ها با افزودن s جمع بسته می‌شوند: book → books. بعضی اسم‌ها شکل بی‌قاعده دارند که باید جداگانه یاد گرفته شوند.", keyWords: [{word:"book",meaning:"کتاب"},{word:"books",meaning:"کتاب‌ها"},{word:"two cats",meaning:"دو گربه"}], duration: "۱۲ دقیقه", skill: "گرامر و واژگان", explanation: "برای جمع بستن بسیاری از اسم‌های انگلیسی، s به پایان اسم اضافه می‌شود. بعد از عدد بیشتر از یک، معمولاً اسم را جمع می‌آوریم.", example: "I have two books.", translation: "من دو کتاب دارم.", question: "جمع ساده book کدام است؟", choices: ["bookes", "books", "book"], answerWhy: "برای جمع ساده book فقط s اضافه می‌کنیم: books.", correct: 1 }
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
  }
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
  { word: "Two cats", phonetic: "/tuː kæts/", meaning: "دو گربه", example: "I have two cats.", lesson: "جمع بستن اسم‌ها" }
];
const readStore = (key: string, fallback: string[]) => { try { const raw = localStorage.getItem(key); if (!raw) return fallback; const value: unknown = JSON.parse(raw); return Array.isArray(value) && value.every(item => typeof item === "string") ? value : fallback; } catch { return fallback; } };
const writeStore = (key: string, value: string[]) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [step, setStep] = useState<"learn" | "quiz" | "result" | "typing" | "voice" | "complete">("learn");
  const [choice, setChoice] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizOptionOrders, setQuizOptionOrders] = useState<Record<number, number[]>>({});
  const [lastLessonRewarded, setLastLessonRewarded] = useState(false);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "matched" | "retry" | "unsupported" | "error">("idle");
  const [voiceTranscript, setVoiceTranscript] = useState("");
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
    { id: "assistant" as Tab, label: "دستیار", icon: MessageCircle }
  ];
  const go = (next: Tab) => { setTab(next); setMenuOpen(false); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openLesson = (id: number) => { const index = lessons.findIndex(lesson => lesson.id === id); if (index < 0) return; const unlocked = lessons.slice(0, index).every(lesson => completed.includes(String(lesson.id))); if (!unlocked) { setNotice("برای باز کردن این درس، ابتدا درس‌های قبلی را کامل کن."); setMenuOpen(false); return; } setActiveLesson(id); setStep("learn"); setChoice(null); setQuizIndex(0); setQuizAnswers({}); setQuizOptionOrders(createOptionOrders(lessonContent, id)); setMenuOpen(false); };
  const closeLesson = () => { recognitionRef.current?.abort(); recognitionRef.current = null; setActiveLesson(null); setChoice(null); setStep("learn"); setQuizIndex(0); setQuizAnswers({}); setQuizOptionOrders({}); setVoiceIndex(0); setVoiceStatus("idle"); setVoiceTranscript(""); setTypedAnswer(""); setTypingStatus("idle"); };
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
        const expected = normalizeSpeech(active.keyWords[voiceIndex]?.word || "");
        const matched = alternatives.some(value => speechCanonical(value) === speechCanonical(expected));
        setVoiceTranscript(transcript);
        setVoiceStatus(matched ? "matched" : "retry");
      };
      recognition.onerror = event => {
        setVoiceStatus("error");
        setVoiceTranscript(event.error === "not-allowed" ? "دسترسی میکروفون داده نشده است." : event.error === "no-speech" ? "صدایی تشخیص داده نشد؛ دوباره تلاش کن." : "تشخیص صدا با مشکل روبه‌رو شد؛ اتصال و مجوز میکروفون را بررسی کن.");
      };
      recognition.onend = () => setVoiceStatus(current => current === "listening" ? "idle" : current);
      recognitionRef.current = recognition;
      setVoiceTranscript("");
      setVoiceStatus("listening");
      recognition.start();
    } catch {
      setVoiceStatus("error");
      setVoiceTranscript("شروع میکروفون ممکن نشد؛ دوباره امتحان کن.");
    }
  };
  const beginTypingPractice = () => { setVoiceIndex(0); setTypedAnswer(""); setTypingStatus("idle"); setStep("typing"); };
  const beginQuiz = () => { if (!active) return; setQuizIndex(0); setQuizAnswers({}); setQuizOptionOrders(createOptionOrders(lessonContent, active.id)); setChoice(null); setStep("quiz"); };
  const checkTypedAnswer = () => {
    if (!active) return;
    const expected = normalizeSpeech(active.keyWords[voiceIndex]?.word || "");
    const actual = normalizeSpeech(typedAnswer);
    setTypingStatus(actual && actual === expected ? "matched" : "retry");
  };
  const advanceTypingPractice = () => { if (!active) return; if (voiceIndex < active.keyWords.length - 1) { setVoiceIndex(index => index + 1); setTypedAnswer(""); setTypingStatus("idle"); } else { setVoiceIndex(0); setVoiceStatus("idle"); setVoiceTranscript(""); setStep("voice"); } };
  const advanceVoicePractice = () => { if (!active) return; if (voiceIndex < active.keyWords.length - 1) { setVoiceIndex(index => index + 1); setVoiceStatus("idle"); setVoiceTranscript(""); } else { completeLesson(); } };
  return <div className="app-shell" dir="rtl">
    <aside className={menuOpen ? "sidebar open" : "sidebar"}>
      <div className="brand"><img className="brand-logo-image" src="/LIR9/lir9-brand.jpg" alt="نشان LIR9"/><div><b>LIR9</b><small>یادگیری، قدم‌به‌قدم</small></div><button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="بستن منو"><X/></button></div>
      <div className="lir-wallet"><span>موجودی امتیاز</span><b>{lirBalance} <small>LIR</small></b></div><div className="side-caption">منوی اصلی</div>
      <nav className="side-nav">{nav.map(item => <button key={item.id} className={tab === item.id ? "nav-link active" : "nav-link"} onClick={() => go(item.id)}><item.icon size={19}/><span>{item.label}</span>{tab === item.id && <i/>}</button>)}</nav>
      <div className="sidebar-progress"><div className="side-progress-icon"><Target size={18}/></div><div><b>مسیر فعلی تو</b><small>سطح A1 · مقدماتی</small></div><strong>{progress}٪</strong><div className="side-track"><i style={{width: progress + "%"}}/></div><button onClick={() => go("learn")}>ادامه مسیر <ChevronLeft size={14}/></button></div>
      <div className="sidebar-bottom"><span className="brand-mini">LIR9</span><span>نسخه آزمایشی · اطلاعات روی همین دستگاه ذخیره می‌شود</span></div>
    </aside>
    {menuOpen && <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="بستن منو"/>}
    <main className="main-area">
      <header className="top-header"><button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو"><Menu/></button><div className="breadcrumbs"><span>فضای یادگیری</span><ChevronLeft size={14}/><b>{nav.find(n => n.id === tab)?.label}</b></div><div className="header-level"><span>امتیاز من</span><b>{lirBalance} LIR</b><span>سطح</span><b>A1</b></div></header>
      <div className="page-wrap">
        {tab === "home" && <>
          <section className="welcome-block"><div><span className="eyebrow"><i/> فضای شخصی یادگیری</span><h1>از همین‌جا شروع کن.</h1><p>قرار نیست همه‌چیز را یک‌روزه یاد بگیری؛ فقط درس بعدی را بردار.</p></div><div className="welcome-mark"><img src="/LIR9/lir9-brand.jpg" alt="نشان LIR9؛ پلتفرم یادگیری زبان انگلیسی" /></div></section>
          <section className="next-card"><div className="next-card-copy"><span className="section-kicker">قدم بعدی تو</span><h2>{completed.length === lessons.length ? "آفرین! این بخش را تمام کردی." : nextLesson.title}</h2><p>{completed.length === lessons.length ? "می‌توانی درس‌ها را مرور کنی یا سراغ مسیر بعدی بروی." : nextLesson.description}</p><div className="next-meta"><span><Clock3 size={14}/>{nextLesson.duration}</span><span><BookOpen size={14}/>{nextLesson.skill}</span></div><button className="primary-button" onClick={() => openLesson(nextLesson.id)}>{completed.length === lessons.length ? "مرور درس‌ها" : "شروع درس بعدی"} <ArrowRight size={16}/></button></div><div className="next-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-core"><Languages size={37}/></div><span>YOUR NEXT STEP</span></div></section>
          <div className="section-heading"><div><span className="section-kicker">نمای کلی</span><h2>پیشرفت یادگیری</h2></div><button className="subtle-link" onClick={() => go("learn")}>دیدن همه درس‌ها <ChevronLeft size={15}/></button></div>
          <section className="overview-grid"><div className="overview-card progress-card"><div className="card-icon"><Target size={19}/></div><div className="overview-label">پیشرفت این بخش</div><div className="progress-big">{progress}<small>٪</small></div><div className="progress-bar"><i style={{width: progress + "%"}}/></div><p>{completed.length} درس از {lessons.length} درس تکمیل شده</p></div><div className="overview-card"><div className="card-icon"><Award size={19}/></div><div className="overview-label">امتیازهای LIR</div><div className="overview-number">{lirBalance}</div><p>۲ LIR برای هر درس جدید و تکمیل‌شده</p></div><div className="overview-card"><div className="card-icon"><BookOpen size={19}/></div><div className="overview-label">درس‌های این بخش</div><div className="overview-number">{lessons.length}</div><p>درس کوتاه و مرحله‌به‌مرحله</p><button className="card-action" onClick={() => go("learn")}>رفتن به درس‌ها <ChevronLeft size={14}/></button></div><div className="overview-card"><div className="card-icon"><Bookmark size={19}/></div><div className="overview-label">لغت‌های ذخیره‌شده</div><div className="overview-number">{saved.length}</div><p>لغت‌هایی که برای مرور نگه داشتی</p><button className="card-action" onClick={() => go("vocabulary")}>مرور لغت‌ها <ChevronLeft size={14}/></button></div></section>
          <section className="simple-panel"><div className="section-heading"><div><span className="section-kicker">برنامه یادگیری</span><h2>درس‌های این بخش</h2></div><span className="level-chip">A1 · مقدماتی</span></div><div className="compact-lessons">{lessons.slice(0,5).map((lesson,index)=><button className="compact-lesson" key={lesson.id} onClick={() => openLesson(lesson.id)}><span className={completed.includes(String(lesson.id)) ? "compact-number done" : "compact-number"}>{completed.includes(String(lesson.id)) ? <CheckCircle2 size={17}/> : String(index+1).padStart(2,"0")}</span><span className="compact-copy"><b>{lesson.title}</b><small>{lesson.duration} · {lesson.skill}</small></span><ChevronLeft size={17}/></button>)}</div><button className="all-lessons-button" onClick={() => go("learn")}>مشاهده برنامه کامل آموزشی <ArrowRight size={15}/></button></section>
        </>}
        {tab === "learn" && <><div className="page-intro"><span className="section-kicker">مسیر آموزشی</span><h1>درس‌ها و تمرین‌ها</h1><p>درس‌ها را به ترتیب پیش ببر. بعد از هر آموزش، یک تمرین کوتاه داری.</p></div><section className="course-summary"><div><span className="level-chip">A1 · مقدماتی</span><h2>پایه‌های زبان انگلیسی</h2><p>از مکالمه‌های ابتدایی تا واژه‌ها و ساخت جمله‌های ساده را قدم‌به‌قدم یاد می‌گیری.</p><div className="course-progress-line"><i style={{width: progress + "%"}}/></div><small>{completed.length} از {lessons.length} درس تکمیل شده</small></div><div className="course-level">A1</div></section><div className="lesson-path">{lessons.map((lesson,index)=>{const done=completed.includes(String(lesson.id));const locked=index>0&&!lessons.slice(0,index).every(previous=>completed.includes(String(previous.id)));return <article className="path-item" key={lesson.id}><div className="path-rail"><span className={done?"path-dot done": "path-dot"}>{done?<CheckCircle2 size={17}/>:index+1}</span>{index!==lessons.length-1&&<i/>}</div><div className="path-card"><div className="path-card-main"><div><span className="path-unit">{lesson.unit}</span><h3>{lesson.title}</h3><p>{lesson.description}</p><div className="lesson-details"><span><Clock3 size={13}/>{lesson.duration}</span><span><BookOpen size={13}/>{lesson.skill}</span></div></div><button disabled={locked} className={done?"secondary-button":"small-primary"} onClick={()=>openLesson(lesson.id)}>{done?"مرور درس":locked?"قفل‌شده":"شروع"}{locked?<LockKeyhole size={14}/>:<ChevronLeft size={15}/>}</button></div></div></article>})}</div></>}
        {tab === "vocabulary" && <><div className="page-intro"><span className="section-kicker">مرور و تثبیت</span><h1>دفتر لغت من</h1><p>لغت‌های مهم را ذخیره کن تا هر وقت خواستی دوباره مرورشان کنی.</p></div><div className="vocab-toolbar"><div className="vocab-count"><b>{saved.length}</b><span>لغت ذخیره‌شده</span><button className={showSavedOnly?"filter-chip active":"filter-chip"} onClick={()=>setShowSavedOnly(value=>!value)} aria-pressed={showSavedOnly}><Bookmark size={13}/>{showSavedOnly?"فقط ذخیره‌شده‌ها":"نمایش همه لغت‌ها"}</button></div><label className="search-field"><Search size={17}/><input aria-label="جست‌وجوی لغت، تلفظ یا معنی" value={search} onChange={e=>setSearch(e.target.value)} placeholder="جست‌وجوی لغت یا معنی"/></label></div><div className="vocab-list">{filteredWords.map(word=>{const isSaved=saved.includes(word.word);return <article className="vocab-row" key={word.word}><div className="vocab-word"><h3>{word.word}</h3><small>{word.phonetic}</small></div><div className="vocab-meaning"><b>{word.meaning}</b><span>{word.example}</span></div><button className={isSaved?"bookmark-button saved":"bookmark-button"} onClick={()=>toggleWord(word.word)} aria-label={isSaved?"حذف از لغت‌های ذخیره‌شده":"ذخیره لغت"}><Bookmark size={18} fill={isSaved?"currentColor":"none"}/></button><button className="sound-button" onClick={()=>speak(word.word)} aria-label="شنیدن تلفظ"><Volume2 size={17}/></button></article>})}{filteredWords.length===0&&<div className="empty-state"><Bookmark size={24}/><b>{showSavedOnly?"هنوز لغتی ذخیره نکرده‌ای.":"لغتی پیدا نشد."}</b><span>{showSavedOnly?"با زدن نشانک کنار هر لغت، آن را اینجا نگه دار.":"عبارت دیگری جست‌وجو کن یا فیلتر را تغییر بده."}</span></div>}</div><p className="local-note">لغت‌های ذخیره‌شده فقط در همین مرورگر و دستگاه نگهداری می‌شوند.</p></>}
        {tab === "assistant" && <><div className="page-intro"><span className="section-kicker">همراه یادگیری</span><h1>دستیار هوشمند</h1><p>قرار است در مسیر یادگیری به پرسش‌هایت پاسخ دهد و تمرین پیشنهاد کند.</p></div><section className="assistant-placeholder"><div className="assistant-symbol"><MessageCircle size={30}/></div><span className="coming-label">در حال آماده‌سازی</span><h2>دستیار هنوز به مدل هوش مصنوعی متصل نشده است.</h2><p>نمی‌خواهیم وانمود کنیم پاسخ‌های این بخش از AI می‌آیند. اتصال امن به سرویس هوش مصنوعی در مرحله فنی بعدی انجام می‌شود.</p><button className="primary-button" onClick={()=>go("learn")}>فعلاً ادامه یادگیری <ArrowRight size={16}/></button></section></>}
        {notice && <div className="notice" role="status" aria-live="polite">{notice}<button onClick={()=>setNotice("")} aria-label="بستن پیام">×</button></div>}
      </div>
      <footer className="page-footer"><span>LIR9</span><span>نسخه آزمایشی رابط کاربری · بازخورد تو مسیر را بهتر می‌کند.</span></footer>
    </main>
    <nav className="mobile-tabs">{nav.map(item=><button key={item.id} className={tab===item.id?"selected":""} onClick={()=>go(item.id)}><item.icon size={19}/><span>{item.label}</span></button>)}</nav>
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
  <div className="voice-intro"><span className="voice-kicker"><Mic size={15}/> تمرین تلفظ با میکروفون</span><h3>این عبارت را با صدای بلند بگو</h3><p>عبارت را به انگلیسی تلفظ کن. اگر مرورگر همان عبارت را تشخیص دهد، تیک می‌خورد و می‌توانی به مورد بعدی بروی.</p></div>
  <div className="voice-counter">عبارت {voiceIndex+1} از {active.keyWords.length}</div>
  <div className="voice-target"><strong dir="ltr">{active.keyWords[voiceIndex].word.replace(/…/g,"").trim()}</strong><span>{active.keyWords[voiceIndex].meaning}</span><button onClick={()=>speak(active.keyWords[voiceIndex].word.replace(/…/g,"").trim())}><Volume2 size={15}/> شنیدن نمونه</button></div>
  <div className={"voice-status "+voiceStatus}>
    {voiceStatus==="matched"?<CheckCircle2 size={23}/>:voiceStatus==="listening"?<Mic size={22}/>:voiceStatus==="retry"||voiceStatus==="error"?<RotateCcw size={21}/>:<MicOff size={21}/>}
    <div><b>{voiceStatus==="matched"?"آفرین! عبارت تشخیص داده شد.":voiceStatus==="listening"?"دارم گوش می‌دهم…":voiceStatus==="retry"?"عبارت دقیق تشخیص داده نشد.":voiceStatus==="unsupported"?"این مرورگر تشخیص گفتار را پشتیبانی نمی‌کند.":voiceStatus==="error"?"مشکل در ضبط صدا":"آماده‌ای؟"}</b>
    <span>{voiceTranscript || (voiceStatus==="unsupported"?"می‌توانی آزمون نوشتاری را ادامه بدهی؛ این دستگاه امکان ارزیابی گفتار را فراهم نکرد.":voiceStatus==="listening"?"حالا عبارت را واضح و با صدای طبیعی بگو.":"برای شروع، دکمه میکروفون را بزن.")}</span></div>
  </div>
  {voiceStatus==="matched"?<button className="primary-button voice-next" onClick={advanceVoicePractice}>{voiceIndex<active.keyWords.length-1?"عبارت بعدی":"پایان تمرین گفتاری"} <ArrowRight size={16}/></button>:voiceStatus==="unsupported"||voiceStatus==="error"?<button className="primary-button voice-next" onClick={advanceVoicePractice}>عبارت را با صدای بلند تمرین کردم <ArrowRight size={16}/></button>:<button className="primary-button voice-record" onClick={startVoiceAttempt} disabled={voiceStatus==="listening"}>{voiceStatus==="listening"?"در حال شنیدن…":"شروع ضبط و تشخیص"} <Mic size={16}/></button>}
  {voiceStatus==="retry"&&<button className="text-button voice-retry" onClick={startVoiceAttempt}>تلاش دوباره</button>}
  <p className="voice-privacy">برای این تمرین، تشخیص گفتار از قابلیت مرورگر استفاده می‌کند. در بعضی مرورگرها صدا برای پردازش به سرویس آنلاین ارسال می‌شود.</p>
</div><div className="dialog-actions"><button className="text-button" onClick={()=>setStep("learn")}>بازگشت به آموزش</button></div></>}</>{step==="typing"&&<><div className="lesson-body voice-practice">
<div className="voice-intro"><span className="voice-kicker"><BookOpen size={15}/> آزمون نوشتاری</span><h3>معادل انگلیسی را بنویس</h3><p>معنی فارسی را بخوان و عبارت انگلیسی را از حافظه بنویس. حروف بزرگ و کوچک و نشانه‌گذاری در نمره تأثیر ندارند.</p></div>
<div className="voice-counter">عبارت {voiceIndex+1} از {active.keyWords.length}</div>
<div className="voice-target"><strong>{active.keyWords[voiceIndex].meaning}</strong><span>معادل انگلیسی را بنویس</span><button onClick={()=>speak(active.keyWords[voiceIndex].word.replace(/…/g,"").trim())}><Volume2 size={15}/> شنیدن نمونه</button></div>
<label className="typing-answer"><span>پاسخ تو</span><input dir="ltr" lang="en" autoComplete="off" spellCheck={false} value={typedAnswer} onChange={event=>{setTypedAnswer(event.target.value);setTypingStatus("idle");}} onKeyDown={event=>{if(event.key==="Enter")checkTypedAnswer();}} placeholder="Type in English…"/></label>
{typingStatus!=="idle"&&<div className={"voice-status "+typingStatus}>{typingStatus==="matched"?<CheckCircle2 size={22}/>:<RotateCcw size={21}/>}<div><b>{typingStatus==="matched"?"درست نوشتی!":"هنوز دقیق نیست؛ دوباره تلاش کن."}</b><span>{typingStatus==="matched"?"آفرین؛ این عبارت را یاد گرفتی.":"به حروف و ترتیب کلمات دقت کن و دوباره بنویس."}</span></div></div>}
{typingStatus==="matched"?<button className="primary-button voice-next" onClick={advanceTypingPractice}>{voiceIndex<active.keyWords.length-1?"عبارت بعدی":"رفتن به تمرین گفتاری"} <ArrowRight size={16}/></button>:<button className="primary-button voice-record" onClick={checkTypedAnswer} disabled={!typedAnswer.trim()}>بررسی پاسخ <CheckCircle2 size={16}/></button>}
<p className="voice-privacy">پاسخ تایپی در همین صفحه بررسی می‌شود و به سرویس بیرونی ارسال نمی‌شود.</p>
</div><div className="dialog-actions"><button className="text-button" onClick={()=>setStep("learn")}>بازگشت به آموزش</button></div></>}{step==="quiz"&&<><div className="lesson-body"><div className="quiz-progress-head"><span>سؤال {quizIndex+1} از {lessonContent[active.id].questions.length}</span><span>پاسخ درست: {quizScore}</span></div><div className="quiz-progress-track"><i style={{width:((quizIndex+1)/lessonContent[active.id].questions.length*100)+"%"}}/></div><span className="question-count">تمرین درک مطلب</span><h3>{lessonContent[active.id].questions[quizIndex].prompt}</h3><div className="answer-options">{(quizOptionOrders[quizIndex] ?? lessonContent[active.id].questions[quizIndex].options.map((_,index)=>index)).map((originalIndex,displayIndex)=>{const item=lessonContent[active.id].questions[quizIndex].options[originalIndex];return <button key={originalIndex} className={choice===displayIndex?"chosen":""} aria-pressed={choice===displayIndex} onClick={()=>setChoice(displayIndex)}><span>{String.fromCharCode(65+displayIndex)}</span>{item}</button>;})}</div></div><div className="dialog-actions"><button className="text-button" onClick={()=>setStep("learn")}>بازگشت به آموزش</button><button className="primary-button" disabled={choice===null} onClick={()=>{const originalIndex=(quizOptionOrders[quizIndex] ?? lessonContent[active.id].questions[quizIndex].options.map((_,index)=>index))[choice!];setQuizAnswers(previous=>({...previous,[quizIndex]:originalIndex}));setStep("result");}}>بررسی پاسخ <ArrowRight size={16}/></button></div></>}{step==="complete"&&<div className="lesson-complete"><div className="completion-confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="completion-medal"><Award size={42}/></div><span className="completion-kicker">LIR9 · LEVEL UP</span><h3>آفرین! این درس تموم شد!</h3><p>یک قدم مهم دیگه به انگلیسی بهتر نزدیک شدی.</p>{lastLessonRewarded?<div className="completion-reward"><CheckCircle2 size={19}/><b>۲ LIR</b><span>پاداش تکمیل درس</span></div>:<div className="completion-reward"><CheckCircle2 size={19}/><b>آفرین!</b><span>مرور دوباره درس</span></div>}<button className="primary-button" onClick={closeLesson}>ادامه مسیر یادگیری <ArrowRight size={17}/></button></div>}{step==="result"&&<><div className="lesson-body result-body"><div className={quizAnswers[quizIndex]===lessonContent[active.id].questions[quizIndex].correct?"result-check":"result-retry"}>{quizAnswers[quizIndex]===lessonContent[active.id].questions[quizIndex].correct?<CheckCircle2 size={30}/>:<BookOpen size={30}/>}</div><h3>{quizAnswers[quizIndex]===lessonContent[active.id].questions[quizIndex].correct?"آفرین! پاسخ درست است.":"این پاسخ درست نیست؛ از توضیح یاد بگیر."}</h3><p>پاسخ درست: <strong dir="ltr">{lessonContent[active.id].questions[quizIndex].options[lessonContent[active.id].questions[quizIndex].correct]}</strong></p><div className="answer-explanation"><b>چرا؟</b><span>{lessonContent[active.id].questions[quizIndex].explanation}</span></div></div><div className="dialog-actions">{quizIndex<lessonContent[active.id].questions.length-1?<><button className="text-button" onClick={()=>{setStep("quiz");setChoice(null);}}>تلاش دوباره</button><button className="primary-button" onClick={()=>{setQuizIndex(index=>index+1);setChoice(null);setStep("quiz");}}>سؤال بعدی <ArrowRight size={16}/></button></>:quizScore>=2?<button className="primary-button" onClick={beginTypingPractice}>ادامه به آزمون نوشتاری <ArrowRight size={16}/></button>:<button className="primary-button" onClick={beginQuiz}>تکرار آزمون انتخابی · {quizScore}/3 <RotateCcw size={16}/></button>}</div></>}</section></div>}
  </div>;
}
export default App;