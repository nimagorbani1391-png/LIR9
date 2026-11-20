// Structured A1 English curriculum. Keep lesson data separate from application UI.
export type Lesson = { id: number; unit: string; title: string; description: string; duration: string; skill: string; goal: string; explanation?: string; takeaway: string; keyWords: { word: string; meaning: string }[]; example: string; translation: string; question: string; choices: string[]; correct: number; answerWhy: string; };
export const lessons: Lesson[] = [
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
export type LessonContent = {
  concept: string;
  workedExamples: { english: string; translation: string; why: string }[];
  steps: { heading: string; detail: string }[];
  dialogue: { speaker: string; line: string; translation: string }[];
  commonMistake: string;
  practiceTip: string;
  questions: { prompt: string; options: string[]; correct: number; explanation: string }[];
};
export const lessonContent: Record<number, LessonContent> = {
  1: {
    concept: "در انگلیسی معمولاً سلام را با توجه به صمیمیت و موقعیت انتخاب می‌کنیم. بعد از سلام، می‌توانیم حال طرف مقابل را بپرسیم و به پاسخ او واکنش کوتاهی نشان دهیم.",
    workedExamples: [{"english":"Hi, Alex!","translation":"سلام، الکس!","why":"برای شروع دوستانه مکالمه از Hi استفاده می‌کنیم."},{"english":"I'm fine, thanks. And you?","translation":"خوبم، ممنون. تو چطوری؟","why":"پاسخ حال با یک سؤال متقابل طبیعی‌تر می‌شود."}],
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
      { prompt: "کدام گزینه لحن دوستانه‌تری برای سلام دارد؟", options: ["Hi!", "Goodbye!", "Sorry!"], correct: 0, explanation: "Hi! یک سلام کوتاه و دوستانه است؛ Goodbye برای خداحافظی و Sorry برای عذرخواهی است." },
    {"prompt":"اگر دوستت بگوید How are you? کدام پاسخ مناسب است؟","options":["I'm good, thanks.","I'm from Iran.","My name is Ali."],"correct":0,"explanation":"I'm good, thanks پاسخ طبیعی به پرسش درباره حال است."},{"prompt":"برای خداحافظی کدام عبارت مناسب است؟","options":["Goodbye!","Hello!","Nice to meet you."],"correct":0,"explanation":"Goodbye برای خداحافظی است؛ Hello و Nice to meet you برای شروع یا آشنایی‌اند."}]
  },
  2: {
    concept: "برای معرفی نام، دو الگوی بسیار رایج داریم: My name is + name و I'm + name. هر دو درست‌اند؛ دومی کوتاه‌تر و محاوره‌ای‌تر است.",
    workedExamples: [{"english":"My name is Reza.","translation":"اسم من رضاست.","why":"در الگوی کامل، بعد از My name فعل is لازم است."},{"english":"I'm Reza. Nice to meet you.","translation":"من رضا هستم. از آشنایی با تو خوشحالم.","why":"I'm شکل کوتاه I am است و در مکالمه رایج‌تر است."}],
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
      { prompt: "برای گفتن «من هم از آشنایی با تو خوشحالم» چه می‌گویی؟", options: ["Nice to meet you, too.", "How are you?", "Good night."], correct: 0, explanation: "too در پایان این پاسخ معنی «هم» می‌دهد." },
    {"prompt":"جای خالی را کامل کن: ___ name is Mina.","options":["My","I","Me"],"correct":0,"explanation":"در ساختار My name is از صفت ملکی my پیش از name استفاده می‌کنیم."},{"prompt":"پس از معرفی، کدام عبارت مؤدبانه است؟","options":["Nice to meet you.","Where are you from?","How old are you?"],"correct":0,"explanation":"Nice to meet you برای ابراز خوشحالی از آشنایی استفاده می‌شود."}]
  },
  3: {
    concept: "برای گفتن اینکه اهل کجا هستی، از ساختار be + from + place استفاده می‌کنیم. در جمله ساده I am به شکل کوتاه I'm نوشته و گفته می‌شود.",
    workedExamples: [{"english":"I'm from Iran.","translation":"من اهل ایران هستم.","why":"from مبدأ یا زادگاه را نشان می‌دهد."},{"english":"I'm in Berlin now.","translation":"من الان در برلین هستم.","why":"in مکان حضور فعلی را نشان می‌دهد، نه لزوماً زادگاه."}],
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
      { prompt: "کدام جمله می‌گوید «او (مذکر) اهل اسپانیاست»؟", options: ["He is from Spain.", "He are from Spain.", "He from Spain."], correct: 0, explanation: "برای he در زمان حال ساده فعل be به شکل is می‌آید." },
    {"prompt":"اگر کسی بپرسد Where are you from? درباره چه چیزی می‌پرسد؟","options":["محل مبدأ یا زادگاه","مکان فعلی","سن"],"correct":0,"explanation":"Where are you from? درباره اهل کجا بودن می‌پرسد."},{"prompt":"کدام جمله می‌گوید «من الان در خانه هستم»؟","options":["I'm at home.","I'm from home.","I home am."],"correct":0,"explanation":"at home مکان حضور را نشان می‌دهد؛ from home مبدأ را بیان می‌کند."}]
  },
  4: {
    concept: "ضمیر فاعلی جای نام شخص یا گروه را می‌گیرد و معمولاً پیش از فعل قرار می‌گیرد. انتخاب ضمیر به شخص و تعداد بستگی دارد.",
    workedExamples: [{"english":"She is my sister.","translation":"او خواهر من است.","why":"برای یک زن یا دختر از She و فعل is استفاده می‌کنیم."},{"english":"They are my friends.","translation":"آن‌ها دوستان من هستند.","why":"برای چند نفر از They و فعل are استفاده می‌کنیم."}],
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
      { prompt: "کدام گزینه برای «ما» است؟", options: ["We", "You", "It"], correct: 0, explanation: "We یعنی ما؛ You یعنی تو/شما و It برای یک شیء یا حیوان است." },
    {"prompt":"جای خالی را کامل کن: My parents ___ at home.","options":["are","is","am"],"correct":0,"explanation":"My parents جمع است و با are می‌آید."},{"prompt":"برای یک گربه در جمله ساده از کدام ضمیر استفاده می‌کنیم؟","options":["It","He","We"],"correct":0,"explanation":"برای یک حیوان وقتی جنسیت را مشخص نمی‌کنیم، معمولاً از it استفاده می‌شود."}]
  },
  5: {
    concept: "عددها برای بیان تعداد، سن، شماره و قیمت در مکالمه‌های روزمره لازم‌اند. در این درس روی چند عدد پایه و تفاوت شکل نوشتاری آن‌ها تمرکز می‌کنیم.",
    workedExamples: [{"english":"I have three books.","translation":"من سه کتاب دارم.","why":"عدد پیش از اسم می‌آید و برای بیش از یکی، اسم معمولاً جمع می‌شود."},{"english":"My brother is fifteen.","translation":"برادرم پانزده ساله است.","why":"برای گفتن سن از عدد همراه فعل be استفاده می‌کنیم."}],
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
      { prompt: "جای خالی را کامل کن: I have ___ books. (۱۰)", options: ["ten", "one", "three"], correct: 0, explanation: "عدد ده در انگلیسی ten نوشته می‌شود." },
    {"prompt":"عدد ۱۳ کدام است؟","options":["Thirteen","Thirty","Three"],"correct":0,"explanation":"Thirteen یعنی سیزده؛ thirty یعنی سی و three یعنی سه."},{"prompt":"جمله «دو مداد دارم» کدام است؟","options":["I have two pencils.","I has two pencil.","I have a pencils."],"correct":0,"explanation":"با I از have استفاده می‌کنیم و بعد از two اسم به شکل جمع می‌آید."}]
  },
  6: {
    concept: "برای صحبت درباره خانواده، نام اعضا را یاد می‌گیریم و آن‌ها را با ساختارهای ساده معرفی می‌کنیم.",
    workedExamples: [{"english":"This is my mother.","translation":"این مادر من است.","why":"my پیش از اسم می‌آید و مالکیت یا نسبت را نشان می‌دهد."},{"english":"I have two brothers.","translation":"من دو برادر دارم.","why":"برای بیش از یک برادر از جمع brothers استفاده می‌کنیم."}],
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
      { prompt: "کدام جمله می‌گوید «او پدر من است»؟", options: ["He is my father.", "She is my sister.", "I am a student."], correct: 0, explanation: "He is my father یعنی او پدر من است." },
    {"prompt":"معنی uncle چیست؟","options":["عمو / دایی","خواهر","پدربزرگ"],"correct":0,"explanation":"Uncle به معنی عمو یا دایی است."},{"prompt":"کدام جمله معرفی درست است؟","options":["This is my brother.","This my brother is.","This are my brother."],"correct":0,"explanation":"برای معرفی یک نفر از This is + my + اسم استفاده می‌کنیم."}]
  },
  7: {
    concept: "برای معرفی شغل افراد از نام شغل همراه فعل be استفاده می‌کنیم. در این درس چند شغل رایج و ساختار جمله را می‌آموزی.",
    workedExamples: [{"english":"My father is a driver.","translation":"پدرم راننده است.","why":"در معرفی شغل مفرد معمولاً a یا an پیش از اسم شغل می‌آید."},{"english":"She is an artist.","translation":"او هنرمند است.","why":"artist با صدای واکه شروع می‌شود؛ پس an می‌آید."}],
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
      { prompt: "کدام واژه به معنی دانش‌آموز یا دانشجو است؟", options: ["Student", "Doctor", "Father"], correct: 0, explanation: "Student به معنی دانش‌آموز یا دانشجو است." },
    {"prompt":"کدام گزینه به معنی «او مهندس است» می‌باشد؟","options":["He is an engineer.","He is a engineer.","He are an engineer."],"correct":0,"explanation":"engineer با صدای واکه آغاز می‌شود، پس an درست است؛ با he نیز is می‌آید."},{"prompt":"برای پرسیدن شغل یک نفر کدام سؤال طبیعی است؟","options":["What do you do?","Where do you do?","How do you job?"],"correct":0,"explanation":"What do you do? پرسش رایج درباره شغل است."}]
  },
  8: {
    concept: "a و an هر دو معنی «یک» می‌دهند و پیش از اسم مفرد قابل‌شمارش می‌آیند. انتخاب میان آن‌ها به صدای آغازین واژه بعدی بستگی دارد.",
    workedExamples: [{"english":"It is a university.","translation":"این یک دانشگاه است.","why":"university با صدای /juː/ آغاز می‌شود؛ بنابراین a درست است."},{"english":"He eats an apple.","translation":"او یک سیب می‌خورد.","why":"apple با صدای واکه آغاز می‌شود؛ بنابراین an درست است."}],
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
      { prompt: "کدام جمله درست است؟", options: ["It is an egg.", "It is a egg.", "It an egg."], correct: 0, explanation: "Egg با صدای واکه آغاز می‌شود و جمله کامل به فعل is نیاز دارد." },
    {"prompt":"کدام گزینه بر اساس صدا درست است؟","options":["an hour","a hour","an university"],"correct":0,"explanation":"h در hour تلفظ نمی‌شود و واژه با صدای واکه آغاز می‌شود؛ university با صدای /juː/ آغاز می‌شود و a می‌گیرد."},{"prompt":"کدام مورد اسم مفرد قابل‌شمارش است؟","options":["an egg","water","music"],"correct":0,"explanation":"egg اسم مفرد قابل‌شمارش است و می‌توان گفت an egg؛ water و music معمولاً غیرقابل‌شمارش‌اند."}]
  },
  9: {
    concept: "this و that برای اشاره به یک شخص یا چیز به کار می‌روند. تفاوت اصلی آن‌ها فاصله است: this نزدیک و that دور.",
    workedExamples: [{"english":"This is my pen.","translation":"این خودکار من است.","why":"برای یک چیز نزدیک از this استفاده می‌کنیم."},{"english":"That is your car.","translation":"آن ماشین توست.","why":"برای یک چیز دورتر از that استفاده می‌کنیم."}],
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
      { prompt: "شکل کوتاه That is کدام است؟", options: ["That's", "This's", "Those"], correct: 0, explanation: "That's شکل کوتاه That is است." },
    {"prompt":"برای اشاره به چند چیز نزدیک کدام واژه درست است؟","options":["These","This","That"],"correct":0,"explanation":"These شکل جمع this است و برای چند چیز نزدیک به کار می‌رود."},{"prompt":"کدام جمله برای چیزی دور درست است؟","options":["That is a bus.","This are a bus.","Those is a bus."],"correct":0,"explanation":"برای یک چیز دور از That is استفاده می‌کنیم."}]
  },
  10: {
    concept: "در انگلیسی بسیاری از اسم‌های قابل‌شمارش برای نشان دادن بیش از یکی، s می‌گیرند. این شکل را جمع می‌نامیم.",
    workedExamples: [{"english":"One box, two boxes.","translation":"یک جعبه، دو جعبه.","why":"اسم‌هایی که به x ختم می‌شوند معمولاً برای جمع es می‌گیرند."},{"english":"One baby, two babies.","translation":"یک نوزاد، دو نوزاد.","why":"در بسیاری از اسم‌های پایان‌یافته به consonant + y، y به ies تبدیل می‌شود."}],
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
      { prompt: "جمع بی‌قاعده child کدام است؟", options: ["childs", "children", "childes"], correct: 1, explanation: "Children شکل جمع بی‌قاعده child است." },
    {"prompt":"جمع کلمه box کدام است؟","options":["boxes","boxs","boxies"],"correct":0,"explanation":"اسم‌هایی که به x ختم می‌شوند معمولاً برای جمع es می‌گیرند."},{"prompt":"جمع بی‌قاعده child کدام است؟","options":["children","childs","childes"],"correct":0,"explanation":"Child جمع بی‌قاعده children دارد."}]
  },
  11: {
    concept: "برای گفتن اینکه چیزی یا کسی این‌طور نیست، not را به فعل be اضافه می‌کنیم. در انگلیسی جای کلمه‌ها مهم است؛ پس به ترتیب فاعل، فعل و not دقت کن.",
    workedExamples: [{"english":"I am not busy.","translation":"من مشغول نیستم.","why":"برای I از am not استفاده می‌کنیم."},{"english":"They aren't at home.","translation":"آن‌ها خانه نیستند.","why":"برای they از are not یا شکل کوتاه aren't استفاده می‌کنیم."}],
    steps: [{heading:"جمله مثبت را ببین",detail:"He is tired یعنی او خسته است. اول فاعل He و بعد فعل is آمده است."},{heading:"not را اضافه کن",detail:"He is not tired یعنی او خسته نیست. not بعد از am/is/are می‌آید."},{heading:"شکل کوتاه و طبیعی",detail:"He isn't tired همان معنی را دارد. I'm not شکل کوتاه I am not است."}, { heading: "پاسخ کوتاه و شکل‌های دیگر", detail: "برای پاسخ کوتاه بگو Yes, he is یا No, he isn't. برای we و they از aren't و برای I از I'm not استفاده می‌کنیم." }],
    dialogue:[{speaker:"A",line:"Are you tired?",translation:"خسته‌ای؟"},{speaker:"B",line:"No, I'm not. I'm ready!",translation:"نه، خسته نیستم. آماده‌ام!"}],
    commonMistake:"نگو He not is tired. ترتیب درست He is not tired است؛ not بعد از فعل be قرار می‌گیرد.",
    practiceTip:"سه جمله درباره خودت بساز: یک جمله مثبت و یک جمله منفی درباره حالت، و یک جمله درباره دوستت.",
    questions:[{prompt:"کدام جمله منفی درست است؟",options:["She isn't hungry.","She not is hungry.","She aren't hungry."],correct:0,explanation:"با she از is استفاده می‌کنیم و شکل کوتاه منفی آن isn't است."},{prompt:"معنی I'm not late چیست؟",options:["من دیر نکرده‌ام / دیر نیستم.","من خیلی خوشحالم.","من آماده‌ام."],correct:0,explanation:"I'm not یعنی من نیستم؛ late یعنی دیر. پس جمله می‌گوید من دیر نیستم."},{prompt:"جای خالی را کامل کن: They ___ at home.",options:["aren't","isn't","am not"],correct:0,explanation:"برای they از are استفاده می‌کنیم؛ شکل منفی کوتاه آن aren't است."},{"prompt":"جمله را منفی کن: She is happy.","options":["She isn't happy.","She not is happy.","She don't happy."],"correct":0,"explanation":"برای منفی کردن فعل be، not بعد از is می‌آید: She is not / isn't happy."},{"prompt":"جای خالی را کامل کن: I ___ hungry.","options":["am not","isn't","aren't"],"correct":0,"explanation":"با I از am not استفاده می‌کنیم."}]
  },
  12: {
    concept:"در سؤال‌های ساده با am/is/are، فعل را به ابتدای جمله می‌بریم. این تغییر ترتیب کمک می‌کند شنونده بفهمد سؤال می‌پرسیم.",
    workedExamples: [{"english":"Are you ready? — Yes, I am.","translation":"آماده‌ای؟ — بله، هستم.","why":"در سؤال، are پیش از فاعل می‌آید و در پاسخ کوتاه دوباره فعل را می‌آوریم."},{"english":"Is Sara a student? — No, she isn't.","translation":"آیا سارا دانش‌آموز است؟ — نه، نیست.","why":"برای سوم‌شخص مفرد، is در ابتدای سؤال قرار می‌گیرد."}],
    steps:[{heading:"جمله معمولی",detail:"You are ready یعنی تو آماده‌ای. فاعل You اول آمده و بعد are."},{heading:"جمله را سؤالی کن",detail:"Are you ready? فقط جای are و you عوض می‌شود؛ معنی اصلی حفظ می‌شود."},{heading:"پاسخ کوتاه",detail:"Yes, I am یا No, I'm not. در پاسخ کوتاه، فعل را تکرار می‌کنیم."}, { heading: "سؤال با کلمه پرسشی", detail: "برای پرسیدن مکان، کلمه پرسشی را پیش از فعل بیاور: Where are you? یعنی «کجا هستی؟». پاسخ می‌تواند I'm at home باشد." }],
    dialogue:[{speaker:"A",line:"Are you in class?",translation:"در کلاس هستی؟"},{speaker:"B",line:"Yes, I am. Are you?",translation:"بله، هستم. تو چطور؟"}],
    commonMistake:"در سؤال نگو You are ready? در انگلیسی معیار مبتدی، شکل روشن و درست این است: Are you ready?",
    practiceTip:"از یک دوست سه سؤال بساز: Are you happy? Are you a student? Are you ready?",
    questions:[{prompt:"کدام سؤال ترتیب درست دارد؟",options:["Is he your friend?","He is your friend?","Is your friend he?"],correct:0,explanation:"فعل is قبل از فاعل he قرار می‌گیرد."},{prompt:"پاسخ کوتاه مثبت به Are they ready? کدام است؟",options:["Yes, they are.","Yes, they is.","Yes, are they."],correct:0,explanation:"در پاسخ کوتاه، فاعل و شکل درست فعل را می‌آوریم: they are."},{prompt:"کدام جمله یک سؤال بله/خیر است؟",options:["Are you okay?","You are okay.","You okay are."],correct:0,explanation:"قرار گرفتن are در ابتدای جمله، آن را به سؤال بله/خیر تبدیل می‌کند."},{"prompt":"کدام پاسخ کوتاه به Is he tired? درست است؟","options":["No, he isn't.","No, he don't.","No, isn't he."],"correct":0,"explanation":"برای پاسخ کوتاه با be، فاعل و شکل درست be را می‌آوریم."},{"prompt":"کدام سؤال درباره مکان درست است؟","options":["Where are they?","Where they are?","Where is they?"],"correct":0,"explanation":"در سؤال با be، فعل پیش از فاعل می‌آید: Where are they?"}]
  },
  13: {
    concept:"برای اینکه معلوم شود یک چیز متعلق به چه کسی است، از کلمات مالکیت استفاده می‌کنیم. این کلمات قبل از اسم قرار می‌گیرند و جای اسم را نمی‌گیرند.",
    workedExamples: [{"english":"This is my notebook.","translation":"این دفتر من است.","why":"my پیش از اسم می‌آید؛ my notebook یک گروه اسمی کامل است."},{"english":"Her bag is blue.","translation":"کیف او آبی است.","why":"her مالکیت را برای یک زن یا دختر نشان می‌دهد و پیش از bag می‌آید."}],
    steps:[{heading:"my و your",detail:"my یعنی مال من و your یعنی مال تو یا شما: my phone، your notebook."},{heading:"his و her",detail:"his برای مالکیت یک مرد/پسر و her برای یک زن/دختر است: his game، her bag."},{heading:"در جمله استفاده کن",detail:"This is my phone. یعنی این گوشی من است. کلمه my پیش از phone آمده است."}, { heading: "مالکیت برای گروه‌های دیگر", detail: "برای we از our و برای they از their استفاده می‌کنیم: our house یعنی خانه ما و their teacher یعنی معلم آن‌ها." }],
    dialogue:[{speaker:"A",line:"Is this your notebook?",translation:"این دفتر توست؟"},{speaker:"B",line:"No, it's her notebook.",translation:"نه، دفتر اوست."}],
    commonMistake:"my با me فرق دارد. my قبل از اسم می‌آید (my book)، اما me شکل مفعولی ضمیر است.",
    practiceTip:"سه وسیله اطرافت را انتخاب کن و با my، your یا his/her معرفی کن.",
    questions:[{prompt:"اگر وسیله متعلق به یک دختر باشد، کدام مناسب است؟",options:["her pencil","his pencil","I pencil"],correct:0,explanation:"her برای مالکیت یک دختر/زن استفاده می‌شود."},{prompt:"کدام عبارت یعنی «دفتر تو»؟",options:["your notebook","you notebook","yours notebook"],correct:0,explanation:"your صفت ملکی است و پیش از اسم notebook می‌آید."},{prompt:"جمله را کامل کن: Ali has a bike. It is ___ bike.",options:["his","her","my"],correct:0,explanation:"Ali نام پسرانه در این مثال است؛ برای مالکیت او از his استفاده می‌کنیم."},{"prompt":"جای خالی را کامل کن: We love ___ school.","options":["our","we","us"],"correct":0,"explanation":"our صفت ملکی است و پیش از اسم school می‌آید."},{"prompt":"کدام عبارت یعنی «خانه آن‌ها»؟","options":["their house","they house","them house"],"correct":0,"explanation":"their برای مالکیت آن‌ها استفاده می‌شود."}]
  },
  14: {
    concept:"have و has هر دو معنی «داشتن» می‌دهند. انتخابشان به فاعل جمله بستگی دارد، نه به چیزی که داریم.",
    workedExamples: [{"english":"We have a small garden.","translation":"ما یک باغ کوچک داریم.","why":"با we از have استفاده می‌کنیم."},{"english":"My sister has a bicycle.","translation":"خواهرم یک دوچرخه دارد.","why":"فاعل my sister معادل she است؛ پس has می‌آید."}],
    steps:[{heading:"با I و you",detail:"I have a phone و You have a bike. برای I و you از have استفاده می‌کنیم."},{heading:"با he و she",detail:"He has a ball و She has a cat. برای he و she از has استفاده می‌کنیم."},{heading:"فاعل را پیدا کن",detail:"قبل از انتخاب فعل، ببین چه کسی چیزی دارد. My brother مثل he است، پس has می‌گیرد."}, { heading: "سؤال درباره داشتن", detail: "برای سؤال از Do you have...? استفاده می‌کنیم. برای he و she می‌گوییم Does she have...? دقت کن بعد از does، فعل have به شکل پایه برمی‌گردد." }],
    dialogue:[{speaker:"A",line:"Do you have a pet?",translation:"حیوان خانگی داری؟"},{speaker:"B",line:"Yes, I have a cat.",translation:"بله، یک گربه دارم."}],
    commonMistake:"نگو She have a dog. چون فاعل she است، باید بگویی She has a dog.",
    practiceTip:"درباره خودت، دوستت و یکی از اعضای خانواده سه جمله با have یا has بساز.",
    questions:[{prompt:"کدام جمله درست است؟",options:["My sister has a tablet.","My sister have a tablet.","My sister haves a tablet."],correct:0,explanation:"My sister برابر she است؛ پس has درست است."},{prompt:"جای خالی: We ___ two English books.",options:["have","has","is"],correct:0,explanation:"برای we از have استفاده می‌کنیم."},{prompt:"معنی He has a new bag چیست؟",options:["او یک کیف جدید دارد.","او یک کیف جدید است.","آن‌ها کیف جدید دارند."],correct:0,explanation:"has در این ساختار معنی داشتن می‌دهد و he یعنی او (مذکر)."},{"prompt":"جمله را کامل کن: Does your brother ___ a car?","options":["have","has","having"],"correct":0,"explanation":"بعد از does فعل اصلی به شکل پایه می‌آید: have."},{"prompt":"کدام جمله درست است؟","options":["They have a dog.","They has a dog.","They haves a dog."],"correct":0,"explanation":"با they از have استفاده می‌کنیم."}]
  },
  15: {
    concept:"حال ساده برای کارهایی است که معمولاً، مرتب یا به‌عنوان عادت انجام می‌دهیم؛ نه لزوماً همین لحظه.",
    workedExamples: [{"english":"I study English every evening.","translation":"من هر عصر انگلیسی می‌خوانم.","why":"برای I در حال ساده، فعل به شکل پایه می‌آید."},{"english":"Arman watches TV after dinner.","translation":"آرمان بعد از شام تلویزیون تماشا می‌کند.","why":"با he/she/it معمولاً به فعل s یا es اضافه می‌شود."}],
    steps:[{heading:"درباره خودت",detail:"I study English یعنی من انگلیسی می‌خوانم. با I شکل ساده فعل study را می‌آوریم."},{heading:"درباره یک نفر دیگر",detail:"با he/she/it در جمله مثبت معمولاً به فعل s یا es اضافه می‌کنیم: She studies."},{heading:"نشانه‌های عادت",detail:"عبارت‌هایی مثل every day و after school کمک می‌کنند بفهمیم درباره برنامه و عادت حرف می‌زنیم."}, { heading: "املای فعل در سوم‌شخص", detail: "بیشتر فعل‌ها s می‌گیرند؛ فعل‌های پایان‌یافته به ch، sh، ss یا x معمولاً es می‌گیرند: watches. در consonant + y، y به ies تبدیل می‌شود: studies." }],
    dialogue:[{speaker:"A",line:"What do you do after school?",translation:"بعد از مدرسه چه کار می‌کنی؟"},{speaker:"B",line:"I play basketball and study English.",translation:"بسکتبال بازی می‌کنم و انگلیسی می‌خوانم."}],
    commonMistake:"برای he یا she در جمله مثبت، s فعل را فراموش نکن: He plays، نه He play.",
    practiceTip:"برنامه یک روز معمولی خودت را با سه جمله انگلیسی توصیف کن.",
    questions:[{prompt:"کدام جمله درباره عادت درست است؟",options:["I watch videos after school.","I watches videos after school.","I watching videos after school."],correct:0,explanation:"با I، فعل در شکل ساده watch می‌آید."},{prompt:"جای خالی: Sara ___ English every day.",options:["studies","study","studying"],correct:0,explanation:"Sara برابر she است. study به studies تبدیل می‌شود."},{prompt:"کدام عبارت بیشتر به عادت اشاره می‌کند؟",options:["every day","right now","at this second"],correct:0,explanation:"every day یعنی هر روز و نشانه‌ای از تکرار و عادت است."},{"prompt":"کدام شکل سوم‌شخص فعل study درست است؟","options":["studies","studys","studyies"],"correct":0,"explanation":"وقتی فعل به consonant + y ختم شود، y به ies تبدیل می‌شود."},{"prompt":"جای خالی را کامل کن: He ___ TV every night.","options":["watches","watch","watching"],"correct":0,"explanation":"watch به ch ختم می‌شود و برای he شکل watches می‌گیرد."}]
  },
  16: {
    concept:"گاهی مهم نیست فقط چه کاری انجام می‌دهیم؛ مهم است چند بار آن را انجام می‌دهیم. قیدهای تکرار این مقدار را نشان می‌دهند.",
    workedExamples: [{"english":"I usually walk to school.","translation":"من معمولاً پیاده به مدرسه می‌روم.","why":"قید usually پیش از فعل اصلی walk قرار می‌گیرد."},{"english":"She is always polite.","translation":"او همیشه مؤدب است.","why":"وقتی فعل be داریم، قید تکرار بعد از am/is/are می‌آید."}],
    steps:[{heading:"از همیشه تا هرگز",detail:"always یعنی همیشه، usually یعنی معمولاً، sometimes یعنی گاهی و never یعنی هرگز."},{heading:"جای قید با فعل اصلی",detail:"معمولاً قید پیش از فعل اصلی می‌آید: I usually study."},{heading:"جای قید با be",detail:"اگر فعل جمله am/is/are باشد، قید بعد از آن می‌آید: She is always kind."}, { heading: "پرسیدن تعداد دفعات", detail: "برای پرسیدن تکرار یک کار از How often...? استفاده کن: How often do you exercise? یعنی «هر چند وقت ورزش می‌کنی؟»." }],
    dialogue:[{speaker:"A",line:"Do you always play games?",translation:"همیشه بازی می‌کنی؟"},{speaker:"B",line:"No, I sometimes read books.",translation:"نه، گاهی کتاب می‌خوانم."}],
    commonMistake:"نگو I play always football. جای طبیعی قید تکرار در این جمله I always play football است.",
    practiceTip:"چهار فعالیت روزانه انتخاب کن و با always، usually، sometimes یا never درباره‌شان جمله بساز.",
    questions:[{prompt:"کدام جمله ترتیب درست دارد؟",options:["I sometimes read.","I read sometimes books.","Sometimes I am read."],correct:0,explanation:"قید sometimes پیش از فعل اصلی read آمده است."},{prompt:"معنی usually چیست؟",options:["معمولاً","هرگز","به‌ندرت"],correct:0,explanation:"usually یعنی معمولاً؛ یعنی کاری در بیشتر مواقع انجام می‌شود."},{prompt:"جای درست قید را انتخاب کن: He is ___ late.",options:["never","late never","is neverly"],correct:0,explanation:"با فعل be، قید تکرار بعد از آن می‌آید: is never late."},{"prompt":"جای درست قید usually کجاست؟","options":["I usually drink tea.","I drink usually tea.","I drink tea usually always."],"correct":0,"explanation":"قید تکرار معمولاً پیش از فعل اصلی قرار می‌گیرد."},{"prompt":"برای پرسیدن «هر چند وقت ورزش می‌کنی؟» کدام سؤال درست است؟","options":["How often do you exercise?","How many often you exercise?","How often are you exercise?"],"correct":0,"explanation":"How often درباره دفعات تکرار می‌پرسد و با do you + فعل پایه ساخته می‌شود."}]
  },
  17: {
    concept:"can برای بیان توانایی یا اجازه به کار می‌رود. در این درس از آن برای گفتن کارهایی استفاده می‌کنیم که بلدیم انجام بدهیم.",
    workedExamples: [{"english":"I can speak English.","translation":"من می‌توانم انگلیسی صحبت کنم.","why":"بعد از can فعل به شکل ساده می‌آید؛ to یا s اضافه نمی‌کنیم."},{"english":"Can you ride a bike? — Yes, I can.","translation":"می‌توانی دوچرخه‌سواری کنی؟ — بله، می‌توانم.","why":"برای سؤال، can به ابتدای جمله می‌رود."}],
    steps:[{heading:"توانایی خودت",detail:"I can swim یعنی من می‌توانم شنا کنم. can برای همه فاعل‌ها یکسان است."},{heading:"بعد از can چه می‌آید؟",detail:"بعد از can شکل ساده فعل می‌آید: can play، can draw. نه to می‌آوریم و نه s."},{heading:"سؤال بساز",detail:"Can you ride a bike? یعنی می‌توانی دوچرخه‌سواری کنی؟ پاسخ: Yes, I can یا No, I can't."}, { heading: "منفی و پاسخ کوتاه", detail: "برای منفی کردن از cannot یا can't استفاده کن: I can't drive. پاسخ کوتاه هم Yes, I can و No, I can't است." }],
    dialogue:[{speaker:"A",line:"Can you play chess?",translation:"می‌توانی شطرنج بازی کنی؟"},{speaker:"B",line:"Yes, I can, but I can't play the guitar.",translation:"بله، می‌توانم؛ اما نمی‌توانم گیتار بزنم."}],
    commonMistake:"بعد از can، فعل ساده می‌آید. can to swim و can swims نادرست‌اند.",
    practiceTip:"سه توانایی واقعی خودت را با I can و یک کاری را که هنوز بلد نیستی با I can't بنویس.",
    questions:[{prompt:"کدام جمله درست است؟",options:["I can draw.","I can to draw.","I cans draw."],correct:0,explanation:"بعد از can فعل ساده draw می‌آید."},{prompt:"پاسخ کوتاه به Can she sing? کدام است؟",options:["Yes, she can.","Yes, she cans.","Yes, can she."],correct:0,explanation:"در پاسخ کوتاه، فاعل و can را می‌آوریم."},{prompt:"معنی I can't skate چیست؟",options:["من نمی‌توانم اسکیت کنم.","من اسکیت دوست دارم.","من همیشه اسکیت می‌کنم."],correct:0,explanation:"can't شکل منفی cannot است و ناتوانی را نشان می‌دهد."},{"prompt":"کدام جمله منفی درست است؟","options":["She can't drive.","She doesn't can drive.","She can't to drive."],"correct":0,"explanation":"منفی can با can't ساخته می‌شود و پس از آن فعل ساده می‌آید."},{"prompt":"جای خالی را کامل کن: ___ they swim?","options":["Can","Do can","Are can"],"correct":0,"explanation":"برای سؤال درباره توانایی، can به ابتدای جمله می‌آید."}]
  },
  18: {
    concept:"برای حرف زدن درباره علاقه‌ها از like استفاده می‌کنیم. می‌توانیم بگوییم چه چیزی را دوست داریم یا از انجام چه کاری لذت می‌بریم.",
    workedExamples: [{"english":"I like listening to music.","translation":"من گوش دادن به موسیقی را دوست دارم.","why":"بعد از like می‌توان از فعل ingدار برای بیان فعالیت استفاده کرد."},{"english":"My brother likes football.","translation":"برادرم فوتبال را دوست دارد.","why":"با he/she/it در جمله مثبت از likes استفاده می‌کنیم."}],
    steps:[{heading:"اسم بعد از like",detail:"I like music یعنی من موسیقی را دوست دارم. بعد از like می‌توان اسم آورد."},{heading:"فعل ingدار",detail:"I like reading یعنی من کتاب خواندن را دوست دارم. برای بیان فعالیت موردعلاقه، فعل ingدار می‌آید."},{heading:"با he و she",detail:"در جمله مثبت حال ساده با he/she می‌گوییم likes: She likes art."}, { heading: "گفتن علاقه نداشتن", detail: "برای بیان علاقه نداشتن می‌گوییم I don't like... . برای he و she از doesn't like استفاده می‌کنیم: She doesn't like coffee." }],
    dialogue:[{speaker:"A",line:"What kind of music do you like?",translation:"چه نوع موسیقی‌ای دوست داری؟"},{speaker:"B",line:"I like pop music. I also like reading.",translation:"موسیقی پاپ دوست دارم. کتاب خواندن را هم دوست دارم."}],
    commonMistake:"در جمله مثبت با he یا she، likes را به کار ببر؛ اما بعد از can همچنان فعل ساده می‌آید.",
    practiceTip:"سه علاقه‌ات را با I like بنویس و از یک دوست بپرس What do you like?",
    questions:[{prompt:"کدام جمله درست است؟",options:["He likes football.","He like football.","He likes play football."],correct:0,explanation:"با he از likes استفاده می‌کنیم؛ برای جمله ساده همین ساختار کافی است."},{prompt:"کدام عبارت یعنی «من نقاشی کردن را دوست دارم»؟",options:["I like drawing.","I like draw.","I likes drawing."],correct:0,explanation:"بعد از like برای فعالیت می‌توان از فعل ingدار drawing استفاده کرد."},{prompt:"جای خالی: They ___ video games.",options:["like","likes","liking"],correct:0,explanation:"برای they از شکل ساده like استفاده می‌کنیم."},{"prompt":"کدام جمله درباره علاقه درست است؟","options":["I like cooking.","I likes cooking.","I like cookings."],"correct":0,"explanation":"با I از like استفاده می‌کنیم؛ برای فعالیت می‌توان از فعل ingدار استفاده کرد."},{"prompt":"جمله «او قهوه دوست ندارد» کدام است؟","options":["She doesn't like coffee.","She don't likes coffee.","She not like coffee."],"correct":0,"explanation":"برای منفی کردن حال ساده با she از doesn't + فعل پایه استفاده می‌کنیم."}]
  },
  19: {
    concept:"حروف اضافه مکان مثل یک نقشه کوچک‌اند؛ به شنونده می‌گویند چیزی دقیقاً کجاست.",
    workedExamples: [{"english":"The keys are in the bag.","translation":"کلیدها داخل کیف هستند.","why":"in یعنی داخل یک فضا یا محفظه."},{"english":"The phone is on the table.","translation":"گوشی روی میز است.","why":"on برای قرار گرفتن روی یک سطح به کار می‌رود."}],
    steps:[{heading:"in یعنی داخل",detail:"The keys are in the bag یعنی کلیدها داخل کیف هستند."},{heading:"on یعنی روی سطح",detail:"The phone is on the desk یعنی گوشی روی میز است."},{heading:"under یعنی زیر",detail:"The ball is under the chair یعنی توپ زیر صندلی است."}, { heading: "مکان‌های دقیق‌تر", detail: "next to یعنی کنار، behind یعنی پشت و in front of یعنی جلوی چیزی. مثال: The bag is next to the chair." }],
    dialogue:[{speaker:"A",line:"Where is my phone?",translation:"گوشی من کجاست؟"},{speaker:"B",line:"It's on your desk.",translation:"روی میزت است."}],
    commonMistake:"in و on را جابه‌جا نکن: داخل کیف in the bag است؛ روی میز on the desk.",
    practiceTip:"به اتاقت نگاه کن و جای سه وسیله را با in، on یا under توصیف کن.",
    questions:[{prompt:"اگر مداد داخل جامدادی باشد، کدام درست است؟",options:["in the pencil case","on the pencil case","under the pencil case"],correct:0,explanation:"in یعنی داخل؛ پس in the pencil case درست است."},{prompt:"معنی under the table چیست؟",options:["زیر میز","روی میز","داخل میز"],correct:0,explanation:"under به معنی زیر است."},{prompt:"کدام جمله درست است؟",options:["The book is on the desk.","The book is in the desk (برای روی میز).","The book under is desk."],correct:0,explanation:"برای قرار داشتن روی سطح میز از on the desk استفاده می‌کنیم."},{"prompt":"اگر کیف کنار صندلی باشد، کدام عبارت درست است؟","options":["next to the chair","in the chair","under of chair"],"correct":0,"explanation":"next to یعنی کنار."},{"prompt":"معنی behind the door چیست؟","options":["پشت در","جلوی در","داخل در"],"correct":0,"explanation":"behind به معنی پشت است."}]
  },
  20: {
    concept:"برای برنامه‌ریزی و صحبت درباره روز، باید بتوانیم ساعت و بخش‌های مختلف روز را بیان کنیم.",
    workedExamples: [{"english":"It's eight o'clock.","translation":"ساعت هشت است.","why":"برای ساعت دقیق از It's + عدد + o'clock استفاده می‌کنیم."},{"english":"I do my homework in the evening.","translation":"من عصرها تکالیفم را انجام می‌دهم.","why":"برای بخش‌های روز معمولاً از in the morning/afternoon/evening استفاده می‌کنیم."}],
    steps:[{heading:"ساعت دقیق",detail:"It's seven o'clock یعنی ساعت هفت است. برای ساعت‌های دقیق می‌توانی o'clock را به کار ببری."},{heading:"زمان‌های روز",detail:"in the morning یعنی صبح، in the afternoon یعنی بعدازظهر و in the evening یعنی عصر."},{heading:"یک نکته کاربردی",detail:"برای night معمولاً می‌گوییم at night. مثال: I read at night."}, { heading: "حرف اضافه زمان", detail: "برای ساعت دقیق از at استفاده کن: at seven. برای روزهای هفته از on و برای بخش‌های روز از in استفاده می‌کنیم: on Monday، in the morning." }],
    dialogue:[{speaker:"A",line:"What time do you get up?",translation:"چه ساعتی بیدار می‌شوی؟"},{speaker:"B",line:"I get up at seven o'clock.",translation:"ساعت هفت بیدار می‌شوم."}],
    commonMistake:"برای گفتن «شب‌ها» معمولاً at night می‌گوییم، نه in the night در جمله‌های ساده روزمره.",
    practiceTip:"برنامه صبح تا شب خودت را با سه ساعت ساده و عبارت‌های morning و night تعریف کن.",
    questions:[{prompt:"کدام عبارت یعنی «ساعت هشت»؟",options:["eight o'clock","eight clock","o'clock eight"],correct:0,explanation:"الگوی رایج برای ساعت دقیق عدد + o'clock است."},{prompt:"کدام عبارت یعنی «شب‌ها»؟",options:["at night","in the morning","in the afternoon"],correct:0,explanation:"at night برای اشاره به شب به کار می‌رود."},{prompt:"جمله را کامل کن: I go to school ___ the morning.",options:["in","on","under"],correct:0,explanation:"ترکیب درست in the morning است."},{"prompt":"جای خالی را کامل کن: The class starts ___ 9 o'clock.","options":["at","in","on"],"correct":0,"explanation":"برای ساعت دقیق از at استفاده می‌کنیم."},{"prompt":"کدام عبارت درست است؟","options":["on Friday","at Friday","in Friday"],"correct":0,"explanation":"برای روزهای هفته از on استفاده می‌کنیم."}]
  },
};

export const createOptionOrders = (content: Record<number, LessonContent>, lessonId: number) => Object.fromEntries((content[lessonId]?.questions ?? []).map((question, questionIndex) => { const order = question.options.map((_, index) => index); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } return [questionIndex, order]; })) as Record<number, number[]>;

export const courseUnits = [...new Set(lessons.map(lesson => lesson.unit))].map(unit => ({ unit, lessons: lessons.filter(lesson => lesson.unit === unit) }));

