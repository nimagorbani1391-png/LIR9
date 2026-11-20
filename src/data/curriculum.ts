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
  {"id":21,"unit":"واحد ۹ · پایه‌های زبان","title":"الفبا و هجی کردن","description":"حروف انگلیسی را بشناس و نام‌ها و واژه‌های ساده را هجی کن.","goal":"بتوانی حروف A تا Z را تشخیص بدهی، نام حروف را بگویی و املای یک نام را سؤال و جواب کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"نام حروف با صدای آن‌ها در کلمه فرق دارد. برای پرسیدن املا بگو How do you spell ...?","keyWords":[{"word":"alphabet","meaning":"الفبا"},{"word":"letter","meaning":"حرف"},{"word":"spell","meaning":"هجی کردن"},{"word":"How do you spell it?","meaning":"چطور آن را هجی می‌کنی؟"}],"example":"How do you spell your name? — N-I-M-A.","translation":"اسمت را چطور هجی می‌کنی؟ — ن، ی، م، ا.","question":"Which letters spell CAT? ","choices":["C-A-T","K-E-T","C-E-T"],"correct":0,"answerWhy":"املای درست cat برابر C-A-T است."},
  {"id":22,"unit":"واحد ۹ · پایه‌های زبان","title":"اعداد ۲۰ تا ۱۰۰ و شماره‌ها","description":"عددهای بزرگ‌تر را برای سن، قیمت و شماره تلفن به کار ببر.","goal":"بتوانی دهگان‌ها را بخوانی، عددهای ترکیبی بسازی و شماره تلفن را رقم‌به‌رقم بیان کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"در عددهای ترکیبی بین دهگان و یکان خط تیره می‌آید: twenty-one، thirty-five. شماره تلفن را معمولاً رقم‌به‌رقم می‌خوانیم.","keyWords":[{"word":"twenty","meaning":"بیست"},{"word":"thirty","meaning":"سی"},{"word":"fifty","meaning":"پنجاه"},{"word":"phone number","meaning":"شماره تلفن"}],"example":"My phone number is 0912…","translation":"شماره تلفن من ۰۹۱۲… است.","question":"How do you write 40?","choices":["Fourty","Forty","Fourteen"],"correct":1,"answerWhy":"املای درست چهل forty است."},
  {"id":23,"unit":"واحد ۹ · پایه‌های زبان","title":"روزها، ماه‌ها و تاریخ","description":"روز هفته، ماه و تاریخ‌های ساده را بیان کن.","goal":"بتوانی روزها و ماه‌ها را نام ببری، درباره روز موردنظر سؤال کنی و تاریخ ساده را بخوانی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"نام روزها و ماه‌ها با حرف بزرگ شروع می‌شود. برای ماه از in و برای روز مشخص از on استفاده می‌کنیم.","keyWords":[{"word":"Monday","meaning":"دوشنبه"},{"word":"January","meaning":"ژانویه"},{"word":"today","meaning":"امروز"},{"word":"date","meaning":"تاریخ"}],"example":"My birthday is in May. It is on Friday.","translation":"تولد من در ماه مه است. روز جمعه است.","question":"Which word is a month?","choices":["Tuesday","April","Sunday"],"correct":1,"answerWhy":"April نام یک ماه است."},
  {"id":24,"unit":"واحد ۹ · پایه‌های زبان","title":"کشورها، ملیت‌ها و زبان‌ها","description":"درباره کشور، ملیت و زبانی که صحبت می‌کنی حرف بزن.","goal":"بتوانی بپرسی اهل کجا هستی و چه زبانی صحبت می‌کنی و پاسخ ساده بدهی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"I'm from Iran درباره کشور مبدأ است؛ I'm Iranian درباره ملیت و I speak Persian درباره زبان است.","keyWords":[{"word":"country","meaning":"کشور"},{"word":"nationality","meaning":"ملیت"},{"word":"language","meaning":"زبان"},{"word":"speak","meaning":"صحبت کردن"}],"example":"I'm Iranian. I speak Persian and a little English.","translation":"من ایرانی هستم. فارسی و کمی انگلیسی صحبت می‌کنم.","question":"I'm from Italy. I'm ___.","choices":["Italian","Italy","Italish"],"correct":0,"answerWhy":"Italian ملیت مربوط به Italy است."},
  {"id":25,"unit":"واحد ۱۰ · توصیف و اشیا","title":"وسایل کلاس و دستورهای ساده","description":"نام وسایل کلاس را یاد بگیر و دستورهای کوتاه را بفهم.","goal":"بتوانی وسایل رایج کلاس را نام ببری و دستورهای ساده معلم را اجرا کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"در دستور مستقیم، فعل در ابتدای جمله می‌آید: Open the door. برای مؤدبانه‌تر شدن please را اضافه کن.","keyWords":[{"word":"pen","meaning":"خودکار"},{"word":"notebook","meaning":"دفتر"},{"word":"board","meaning":"تخته"},{"word":"Open your book","meaning":"کتابت را باز کن"}],"example":"Please open your notebook.","translation":"لطفاً دفترت را باز کن.","question":"Which is a classroom object?","choices":["notebook","cloudy","Monday"],"correct":0,"answerWhy":"notebook یعنی دفتر."},
  {"id":26,"unit":"واحد ۱۰ · توصیف و اشیا","title":"رنگ‌ها و صفت‌های پایه","description":"رنگ و ویژگی‌های ساده افراد و اشیا را توصیف کن.","goal":"بتوانی با صفت‌های پرکاربرد رنگ، اندازه و کیفیت یک اسم را توصیف کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"صفت در انگلیسی معمولاً پیش از اسم می‌آید: a red car. صفت با جمع یا جنسیت تغییر نمی‌کند.","keyWords":[{"word":"big","meaning":"بزرگ"},{"word":"small","meaning":"کوچک"},{"word":"beautiful","meaning":"زیبا"},{"word":"blue","meaning":"آبی"}],"example":"It is a small blue bag.","translation":"این یک کیف آبی کوچک است.","question":"Choose the correct phrase.","choices":["a red car","a car red","red a car"],"correct":0,"answerWhy":"صفت پیش از اسم می‌آید."},
  {"id":27,"unit":"واحد ۱۰ · توصیف و اشیا","title":"مالکیت با 's و ضمیرهای ملکی","description":"نشان بده یک وسیله متعلق به چه کسی است.","goal":"بتوانی از 's برای مالکیت و mine، yours، his و hers برای جایگزینی اسم استفاده کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"برای مالکیت یک شخص از 's استفاده می‌کنیم: Ali's phone. ضمیر ملکی mine به‌تنهایی می‌آید و قبل از اسم قرار نمی‌گیرد.","keyWords":[{"word":"Sara's bag","meaning":"کیف سارا"},{"word":"mine","meaning":"مال من"},{"word":"yours","meaning":"مال تو"},{"word":"hers","meaning":"مال او"}],"example":"This is Sara's book. The blue one is mine.","translation":"این کتاب سارا است. آبیه مال من است.","question":"Choose the correct possessive.","choices":["Sara's bag","Sara bag's","Saras bag"],"correct":0,"answerWhy":"برای مالکیت Sara's نوشته می‌شود."},
  {"id":28,"unit":"واحد ۱۰ · توصیف و اشیا","title":"these و those و جمع‌های بی‌قاعده","description":"به چند چیز نزدیک یا دور اشاره کن و جمع‌های رایج را بشناس.","goal":"بتوانی these و those را به‌درستی به کار ببری و شکل جمع چند اسم بی‌قاعده را تشخیص بدهی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"These جمع this برای چیزهای نزدیک و those جمع that برای چیزهای دور است. بعضی جمع‌ها بی‌قاعده‌اند: child → children.","keyWords":[{"word":"these","meaning":"این‌ها"},{"word":"those","meaning":"آن‌ها"},{"word":"children","meaning":"کودکان"},{"word":"people","meaning":"مردم / افراد"}],"example":"These are my keys. Those are your bags.","translation":"این‌ها کلیدهای من هستند. آن‌ها کیف‌های تو هستند.","question":"Plural of child is…","choices":["childs","children","childes"],"correct":1,"answerWhy":"جمع بی‌قاعده child برابر children است."},
  {"id":29,"unit":"واحد ۱۱ · ساختارهای روزمره","title":"There is و There are","description":"وجود داشتن یک یا چند چیز را بیان کن.","goal":"بتوانی درباره وجود اشیاء در یک مکان با there is و there are جمله مثبت و منفی بسازی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"برای اسم مفرد یا غیرقابل‌شمارش از there is و برای اسم جمع از there are استفاده کن.","keyWords":[{"word":"There is","meaning":"وجود دارد (مفرد)"},{"word":"There are","meaning":"وجود دارند (جمع)"},{"word":"a park","meaning":"یک پارک"},{"word":"any","meaning":"هیچ / مقداری"}],"example":"There are two chairs in the room.","translation":"دو صندلی در اتاق وجود دارد.","question":"There ___ a book on the table.","choices":["is","are","am"],"correct":0,"answerWhy":"book مفرد است؛ there is درست است."},
  {"id":30,"unit":"واحد ۱۱ · ساختارهای روزمره","title":"کلمات پرسشی پایه","description":"سؤال‌های اطلاعاتی با what، where، who، when و how بپرس.","goal":"بتوانی برای گرفتن اطلاعات ساده، کلمه پرسشی مناسب را انتخاب و سؤال کوتاه بسازی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"What درباره چیز، where درباره مکان، who درباره شخص، when درباره زمان و how درباره چگونگی می‌پرسد.","keyWords":[{"word":"what","meaning":"چه / چه چیزی"},{"word":"where","meaning":"کجا"},{"word":"who","meaning":"چه کسی"},{"word":"when","meaning":"چه زمانی"}],"example":"Where do you live? — I live in Berlin.","translation":"کجا زندگی می‌کنی؟ — در برلین زندگی می‌کنم.","question":"Which word asks about a place?","choices":["where","who","when"],"correct":0,"answerWhy":"where درباره مکان می‌پرسد."},
  {"id":31,"unit":"واحد ۱۱ · ساختارهای روزمره","title":"منفی کردن حال ساده","description":"بگو چه کاری را انجام نمی‌دهی یا چه چیزی را دوست نداری.","goal":"بتوانی با don't و doesn't جمله منفی حال ساده بسازی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"برای I، you، we و they از don't و برای he، she و it از doesn't استفاده کن؛ بعد از doesn't فعل ساده می‌آید.","keyWords":[{"word":"don't","meaning":"نمی / انجام نمی‌دهم"},{"word":"doesn't","meaning":"نمی / انجام نمی‌دهد"},{"word":"work","meaning":"کار کردن"},{"word":"like","meaning":"دوست داشتن"}],"example":"She doesn't work on Sundays.","translation":"او یکشنبه‌ها کار نمی‌کند.","question":"He ___ like milk.","choices":["doesn't","don't","isn't"],"correct":0,"answerWhy":"با he از doesn't استفاده می‌کنیم."},
  {"id":32,"unit":"واحد ۱۱ · ساختارهای روزمره","title":"سؤال بله/خیر با do و does","description":"درباره عادت‌ها و کارهای روزمره سؤال کن.","goal":"بتوانی سؤال حال ساده را با do یا does بسازی و پاسخ کوتاه بدهی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"در سؤال حال ساده do/does پیش از فاعل می‌آید و فعل اصلی بعد از فاعل به شکل ساده است.","keyWords":[{"word":"Do you…?","meaning":"آیا تو ...؟"},{"word":"Does he…?","meaning":"آیا او ...؟"},{"word":"Yes, I do.","meaning":"بله."},{"word":"No, she doesn't.","meaning":"نه."}],"example":"Does your brother play football? — Yes, he does.","translation":"آیا برادرت فوتبال بازی می‌کند؟ — بله.","question":"___ you like music?","choices":["Do","Does","Are"],"correct":0,"answerWhy":"با you از do استفاده می‌شود."},
  {"id":33,"unit":"واحد ۱۲ · زندگی و کارهای در جریان","title":"سؤال‌های اطلاعاتی درباره زندگی روزمره","description":"با what time، how often و where درباره برنامه روزانه سؤال کن.","goal":"بتوانی سؤال‌های ساده اطلاعاتی را با do/does و کلمه پرسشی بسازی و پاسخ مرتبط بدهی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"ساختار رایج: کلمه پرسشی + do/does + فاعل + فعل پایه. پاسخ باید دقیقاً به همان اطلاعاتی جواب دهد که سؤال می‌خواهد.","keyWords":[{"word":"What time","meaning":"چه ساعتی"},{"word":"How often","meaning":"هر چند وقت"},{"word":"Where","meaning":"کجا"},{"word":"usually","meaning":"معمولاً"}],"example":"What time do you start school? — At eight.","translation":"چه ساعتی مدرسه را شروع می‌کنی؟ — ساعت هشت.","question":"___ do you get up? — At seven.","choices":["What time","Where","Who"],"correct":0,"answerWhy":"برای پرسیدن ساعت از what time استفاده می‌کنیم."},
  {"id":34,"unit":"واحد ۱۲ · زندگی و کارهای در جریان","title":"حال استمراری","description":"درباره کاری که همین حالا در جریان است صحبت کن.","goal":"بتوانی am/is/are را با فعل ingدار ترکیب کنی و عمل در حال انجام را توصیف کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"حال استمراری با am/is/are + فعل ing ساخته می‌شود و برای کاری است که اکنون در جریان است.","keyWords":[{"word":"now","meaning":"اکنون"},{"word":"reading","meaning":"در حال خواندن"},{"word":"cooking","meaning":"در حال آشپزی"},{"word":"What are you doing?","meaning":"داری چه کار می‌کنی؟"}],"example":"She is studying English now.","translation":"او الان در حال مطالعه انگلیسی است.","question":"He ___ watching TV now.","choices":["is","are","am"],"correct":0,"answerWhy":"با he از is استفاده می‌کنیم."},
  {"id":35,"unit":"واحد ۱۲ · زندگی و کارهای در جریان","title":"ضمیرهای مفعولی","description":"در جمله به شخصی اشاره کن که کاری روی او انجام می‌شود.","goal":"بتوانی me، you، him، her، it، us و them را در جایگاه مفعول به کار ببری.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"ضمیر مفعولی معمولاً بعد از فعل یا حرف اضافه می‌آید: call me، talk to her. جای فاعل از I و جای مفعول از me استفاده کن.","keyWords":[{"word":"me","meaning":"من را / به من"},{"word":"him","meaning":"او را (مذکر)"},{"word":"her","meaning":"او را (مونث)"},{"word":"them","meaning":"آن‌ها را"}],"example":"I know him. She helps us.","translation":"من او را می‌شناسم. او به ما کمک می‌کند.","question":"Please help ___.","choices":["me","I","my"],"correct":0,"answerWhy":"پس از help به ضمیر مفعولی me نیاز داریم."},
  {"id":36,"unit":"واحد ۱۲ · زندگی و کارهای در جریان","title":"حروف اضافه زمان","description":"زمان رویدادها را با at، on و in دقیق‌تر بیان کن.","goal":"بتوانی at را برای ساعت، on را برای روز و in را برای ماه، سال و بخش‌های روز انتخاب کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"at برای ساعت و عبارت‌های ثابت مثل at night، on برای روز و تاریخ، و in برای ماه، سال و بخش‌های روز به کار می‌رود.","keyWords":[{"word":"at seven","meaning":"ساعت هفت"},{"word":"on Monday","meaning":"روز دوشنبه"},{"word":"in July","meaning":"در ماه ژوئیه"},{"word":"at night","meaning":"شب‌ها"}],"example":"The lesson is on Monday at nine.","translation":"درس روز دوشنبه ساعت نه است.","question":"The train leaves ___ 8:30.","choices":["at","on","in"],"correct":0,"answerWhy":"برای ساعت دقیق از at استفاده می‌کنیم."},
  {"id":37,"unit":"واحد ۱۳ · خرید و غذا","title":"اسم‌های قابل‌شمارش و غیرقابل‌شمارش","description":"تفاوت اسم‌هایی را که می‌توان شمرد با اسم‌های غیرقابل‌شمارش بفهم.","goal":"بتوانی a/an، some و مقدارهای ساده را با اسم‌های مناسب به کار ببری.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"اسم قابل‌شمارش مفرد می‌تواند a/an بگیرد؛ اسم غیرقابل‌شمارش معمولاً جمع بسته نمی‌شود. برای مقدار از a glass of یا a bottle of استفاده کن.","keyWords":[{"word":"apple","meaning":"سیب (قابل‌شمارش)"},{"word":"water","meaning":"آب (غیرقابل‌شمارش)"},{"word":"some","meaning":"مقداری"},{"word":"a bottle of","meaning":"یک بطری"}],"example":"I'd like a sandwich and some water.","translation":"یک ساندویچ و مقداری آب می‌خواهم.","question":"Which noun is usually uncountable?","choices":["water","apple","egg"],"correct":0,"answerWhy":"water معمولاً غیرقابل‌شمارش است."},
  {"id":38,"unit":"واحد ۱۳ · خرید و غذا","title":"غذا و سفارش در کافه","description":"غذاها را نام ببر و سفارش ساده و مؤدبانه بده.","goal":"بتوانی غذا و نوشیدنی را نام ببری، درخواست ساده مطرح کنی و درباره منو سؤال کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"I'd like ... برای سفارش مؤدبانه مناسب است. لطفاً از please استفاده کن و برای درخواست از Can I have ...? کمک بگیر.","keyWords":[{"word":"menu","meaning":"منو"},{"word":"I'd like","meaning":"مایلم / می‌خواهم"},{"word":"tea","meaning":"چای"},{"word":"bill","meaning":"صورتحساب"}],"example":"I'd like a tea, please. Can I have the menu?","translation":"لطفاً یک چای می‌خواهم. می‌توانم منو را داشته باشم؟","question":"Which phrase is polite for ordering?","choices":["I'd like a coffee, please.","Give coffee.","Coffee now."],"correct":0,"answerWhy":"I'd like درخواست مؤدبانه است."},
  {"id":39,"unit":"واحد ۱۳ · خرید و غذا","title":"خرید لباس و پرسیدن قیمت","description":"لباس‌های ساده را نام ببر و قیمت را بپرس.","goal":"بتوانی درباره اندازه و رنگ لباس سؤال کنی و قیمت را با How much is/are بپرسی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"برای مفرد از How much is ...? و برای جمع از How much are ...? استفاده کن.","keyWords":[{"word":"How much is it?","meaning":"قیمتش چقدر است؟"},{"word":"cheap","meaning":"ارزان"},{"word":"expensive","meaning":"گران"},{"word":"size","meaning":"اندازه"}],"example":"How much are these shoes? — They are twenty euros.","translation":"قیمت این کفش‌ها چقدر است؟ — بیست یورو هستند.","question":"How much ___ this shirt?","choices":["is","are","do"],"correct":0,"answerWhy":"shirt مفرد است؛ is می‌آید."},
  {"id":40,"unit":"واحد ۱۴ · شهر و رفت‌وآمد","title":"مکان‌های شهر و مسیر پرسیدن","description":"مکان‌های عمومی را بشناس و مسیر ساده بپرس.","goal":"بتوانی مکان‌های شهر را نام ببری و با سؤال‌های کوتاه آدرس بپرسی و مسیر ساده را بفهمی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"برای پرسیدن مسیر از Excuse me, where is ...? استفاده کن. دستور مسیر با فعل پایه شروع می‌شود: go، turn، cross.","keyWords":[{"word":"bank","meaning":"بانک"},{"word":"station","meaning":"ایستگاه"},{"word":"turn left","meaning":"به چپ بپیچ"},{"word":"go straight","meaning":"مستقیم برو"}],"example":"Excuse me, where is the station? Go straight and turn left.","translation":"ببخشید، ایستگاه کجاست؟ مستقیم برو و به چپ بپیچ.","question":"What does turn left mean?","choices":["به چپ بپیچ","به راست بپیچ","مستقیم برو"],"correct":0,"answerWhy":"turn left یعنی به چپ بپیچ."},
  {"id":41,"unit":"واحد ۱۴ · شهر و رفت‌وآمد","title":"حمل‌ونقل و سفر ساده","description":"درباره روش رفت‌وآمد و سفرهای کوتاه صحبت کن.","goal":"بتوانی وسایل حمل‌ونقل را نام ببری و بگویی با چه وسیله‌ای به جایی می‌روی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"برای وسیله نقلیه معمولاً از by + وسیله استفاده می‌کنیم: by bus، by train. اما می‌گوییم on foot.","keyWords":[{"word":"by bus","meaning":"با اتوبوس"},{"word":"train","meaning":"قطار"},{"word":"ticket","meaning":"بلیت"},{"word":"airport","meaning":"فرودگاه"}],"example":"I go to work by bus. I need a ticket.","translation":"با اتوبوس به محل کار می‌روم. به بلیت نیاز دارم.","question":"I travel ___ train.","choices":["by","on","in"],"correct":0,"answerWhy":"برای وسیله نقلیه از by train استفاده می‌شود."},
  {"id":42,"unit":"واحد ۱۴ · شهر و رفت‌وآمد","title":"آب‌وهوا و فصل‌ها","description":"آب‌وهوا و فصل موردعلاقه‌ات را توصیف کن.","goal":"بتوانی درباره هوا با it is و صفت‌های رایج صحبت کنی و فصل موردعلاقه‌ات را بیان کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"برای توصیف هوا معمولاً از It is + صفت استفاده می‌کنیم: It's sunny. نام فصل‌ها معمولاً با in می‌آید: in winter.","keyWords":[{"word":"sunny","meaning":"آفتابی"},{"word":"cloudy","meaning":"ابری"},{"word":"cold","meaning":"سرد"},{"word":"season","meaning":"فصل"}],"example":"It's cold and rainy today. I like spring.","translation":"امروز سرد و بارانی است. من بهار را دوست دارم.","question":"What does cloudy mean?","choices":["ابری","آفتابی","بارانی"],"correct":0,"answerWhy":"cloudy یعنی ابری."},
  {"id":43,"unit":"واحد ۱۵ · کاربرد واقعی و جمع‌بندی","title":"دعوت کردن و پیشنهاد ساده","description":"برای دعوت کردن یا پیشنهاد فعالیتی ساده از عبارت‌های مناسب استفاده کن.","goal":"بتوانی پیشنهاد کوتاه بدهی، دعوت را بپذیری یا مؤدبانه رد کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"Let's + فعل پایه برای پیشنهاد است. Would you like ...? دعوت مؤدبانه‌تری است. برای رد کردن، دلیل کوتاه و محترمانه بیاور.","keyWords":[{"word":"Let's…","meaning":"بیا ..."},{"word":"Would you like…?","meaning":"مایلی ...؟"},{"word":"That sounds great","meaning":"عالی به نظر می‌رسد"},{"word":"Sorry, I can't","meaning":"متأسفم، نمی‌توانم"}],"example":"Would you like to play football? — That sounds great!","translation":"دوست داری فوتبال بازی کنیم؟ — عالیه!","question":"Complete: Let's ___ football.","choices":["play","plays","playing"],"correct":0,"answerWhy":"پس از Let's فعل پایه می‌آید."},
  {"id":44,"unit":"واحد ۱۵ · کاربرد واقعی و جمع‌بندی","title":"درخواست کمک و عبارت‌های مؤدبانه","description":"در موقعیت‌های روزمره کمک بخواه و پاسخ مناسب بده.","goal":"بتوانی از please، thank you، excuse me و Can you help me? در موقعیت درست استفاده کنی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"برای جلب توجه مؤدبانه Excuse me و برای درخواست Can you ...? به کار ببر. پس از کمک، Thank you بگو.","keyWords":[{"word":"Can you help me?","meaning":"می‌توانی کمکم کنی؟"},{"word":"Excuse me","meaning":"ببخشید"},{"word":"please","meaning":"لطفاً"},{"word":"You're welcome","meaning":"خواهش می‌کنم"}],"example":"Excuse me, can you help me, please?","translation":"ببخشید، می‌توانید لطفاً به من کمک کنید؟","question":"Which phrase means «ببخشید»?","choices":["Excuse me","You're welcome","Good night"],"correct":0,"answerWhy":"Excuse me برای جلب توجه مؤدبانه است."},
  {"id":45,"unit":"واحد ۱۵ · کاربرد واقعی و جمع‌بندی","title":"مرور یکپارچه مهارت‌های A1","description":"آموخته‌های A1 را در یک موقعیت روزمره به هم وصل کن.","goal":"بتوانی خودت را معرفی کنی، درباره خانواده و برنامه روزانه حرف بزنی، سؤال بپرسی و در موقعیت خرید یا کافه پاسخ بدهی.","duration":"۱۲ تا ۱۵ دقیقه","skill":"گرامر، واژگان و مکالمه","takeaway":"در مکالمه واقعی چند ساختار ساده را به هم وصل کن. جمله‌های کوتاه و درست از جمله‌های طولانی و نامطمئن بهترند.","keyWords":[{"word":"introduce yourself","meaning":"خودت را معرفی کن"},{"word":"daily routine","meaning":"برنامه روزانه"},{"word":"ask for directions","meaning":"مسیر بپرس"},{"word":"order food","meaning":"غذا سفارش بده"}],"example":"Hello, I'm Mina. I live in a small city. I usually study in the morning.","translation":"سلام، من مینا هستم. در شهری کوچک زندگی می‌کنم. معمولاً صبح‌ها درس می‌خوانم.","question":"Choose the correct introduction.","choices":["My name is Ali.","My name Ali.","I name is Ali."],"correct":0,"answerWhy":"ساختار معرفی نام My name is است."},
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
  21: {
    "concept": "الفبای انگلیسی ۲۶ حرف دارد. نام حروف را یاد بگیر؛ هنگام هجی کردن، نام هر حرف را جداگانه می‌گویی.",
    "workedExamples": [
      {
        "english": "How do you spell cat?",
        "translation": "کلمه cat را چطور هجی می‌کنی؟",
        "why": "پاسخ حرف‌به‌حرف C-A-T است."
      },
      {
        "english": "My name is Nima.",
        "translation": "نام من نیما است.",
        "why": "برای هجی کردن نام، حروف نام را جداگانه می‌گوییم."
      }
    ],
    "steps": [
      {
        "heading": "حروف صدادار",
        "detail": "A, E, I, O و U حروف صدادار اصلی‌اند. Y در بعضی واژه‌ها نقش صدای واکه دارد."
      },
      {
        "heading": "نام حروف",
        "detail": "نام حرف با صدای آن در کلمه یکی نیست؛ برای نمونه نام A با صدای آن در apple فرق دارد."
      },
      {
        "heading": "سؤال درباره املا",
        "detail": "برای پرسیدن املا بگو How do you spell your name? و پاسخ را حرف‌به‌حرف بیان کن."
      },
      {
        "heading": "تمرین هجی",
        "detail": "نام خودت و سه واژه ساده را آهسته هجی کن؛ بین حروف مکث کوتاه داشته باش."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "How do you spell your name?",
        "translation": "اسمت را چطور هجی می‌کنی؟"
      },
      {
        "speaker": "B",
        "line": "N-I-M-A.",
        "translation": "ن، ی، م، ا."
      }
    ],
    "commonMistake": "نام حروف را با صدای آن‌ها در کلمه اشتباه نگیر؛ هنگام هجی کردن نام حرف را می‌گویی، نه صدای کلمه را.",
    "practiceTip": "نام خودت، نام یک دوست و واژه book را با صدای بلند هجی کن.",
    "questions": [
      {
        "prompt": "Which letters spell CAT? ",
        "options": [
          "C-A-T",
          "K-E-T",
          "C-E-T"
        ],
        "correct": 0,
        "explanation": "املای درست cat برابر C-A-T است."
      },
      {
        "prompt": "How many letters are in the English alphabet?",
        "options": [
          "Twenty-four",
          "Twenty-six",
          "Thirty"
        ],
        "correct": 1,
        "explanation": "الفبای انگلیسی ۲۶ حرف دارد."
      },
      {
        "prompt": "Which group contains the main vowel letters?",
        "options": [
          "A, E, I, O, U",
          "B, C, D, F, G",
          "J, K, L, M, N"
        ],
        "correct": 0,
        "explanation": "حروف صدادار اصلی A، E، I، O و U هستند."
      },
      {
        "prompt": "Choose the correct question.",
        "options": [
          "How spell you name?",
          "How do you spell your name?",
          "How you do spell name?"
        ],
        "correct": 1,
        "explanation": "ساختار درست پرسش How do you spell ...? است."
      },
      {
        "prompt": "What does spell mean?",
        "options": [
          "هجی کردن",
          "ترجمه کردن",
          "گوش دادن"
        ],
        "correct": 0,
        "explanation": "spell یعنی حروف یک واژه را به ترتیب گفتن."
      }
    ]
  },
  22: {
    "concept": "عددهای ۲۰ تا ۱۰۰ برای سن، قیمت، تعداد و شماره‌ها لازم‌اند. دهگان‌ها را دقیق یاد بگیر و عددهای بین آن‌ها را با خط تیره بنویس.",
    "workedExamples": [
      {
        "english": "Thirty-two",
        "translation": "سی‌ودو",
        "why": "عدد ۳۲ از thirty و two ساخته می‌شود."
      },
      {
        "english": "My age is fifteen.",
        "translation": "سن من پانزده سال است.",
        "why": "برای سن از عدد استفاده می‌کنیم؛ در گفتار طبیعی‌تر می‌گوییم I'm fifteen."
      }
    ],
    "steps": [
      {
        "heading": "دهگان‌ها",
        "detail": "twenty، thirty، forty، fifty، sixty، seventy، eighty، ninety و one hundred را تمرین کن."
      },
      {
        "heading": "عدد ترکیبی",
        "detail": "برای ۲۱ می‌گوییم twenty-one و برای ۴۶ می‌گوییم forty-six؛ بین دو بخش خط تیره می‌آید."
      },
      {
        "heading": "تفاوت‌های املایی",
        "detail": "به املای forty و fifty دقت کن؛ forty با u نوشته نمی‌شود."
      },
      {
        "heading": "شماره تلفن",
        "detail": "شماره تلفن را معمولاً رقم‌به‌رقم بخوان؛ zero برای ۰ و double برای دو رقم یکسانِ پشت‌سرهم هم کاربرد دارد."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "How old are you?",
        "translation": "چند سالته؟"
      },
      {
        "speaker": "B",
        "line": "I'm twenty-one.",
        "translation": "بیست‌ویک سالم است."
      }
    ],
    "commonMistake": "املای forty را با four اشتباه نکن؛ forty بدون u نوشته می‌شود.",
    "practiceTip": "دهگان‌ها را از ۲۰ تا ۱۰۰ بنویس و پنج عدد تصادفی را با صدای بلند بخوان.",
    "questions": [
      {
        "prompt": "How do you write 40?",
        "options": [
          "Fourty",
          "Forty",
          "Fourteen"
        ],
        "correct": 1,
        "explanation": "املای درست چهل forty است."
      },
      {
        "prompt": "What number is seventy-five?",
        "options": [
          "57",
          "75",
          "70"
        ],
        "correct": 1,
        "explanation": "seventy-five یعنی ۷۵."
      },
      {
        "prompt": "Choose the correct spelling.",
        "options": [
          "twenty-one",
          "twenty one (در عدد مرکب نوشتاری)",
          "twenty-onee"
        ],
        "correct": 0,
        "explanation": "عدد مرکب ۲۱ با خط تیره نوشته می‌شود."
      },
      {
        "prompt": "How do you usually say a phone number?",
        "options": [
          "Digit by digit",
          "As one long word",
          "Only the last digit"
        ],
        "correct": 0,
        "explanation": "شماره تلفن را معمولاً رقم‌به‌رقم می‌خوانیم."
      },
      {
        "prompt": "What is 100?",
        "options": [
          "One hundred",
          "Ten hundred",
          "One thousand"
        ],
        "correct": 0,
        "explanation": "one hundred یعنی صد."
      }
    ]
  },
  23: {
    "concept": "روزها و ماه‌ها برای قرارها، برنامه و تاریخ ضروری‌اند. نام آن‌ها در انگلیسی با حرف بزرگ شروع می‌شود.",
    "workedExamples": [
      {
        "english": "My birthday is in June.",
        "translation": "تولد من در ماه ژوئن است.",
        "why": "برای نام ماه از in استفاده می‌شود."
      },
      {
        "english": "The meeting is on Tuesday.",
        "translation": "جلسه روز سه‌شنبه است.",
        "why": "برای روز هفته از on استفاده می‌کنیم."
      }
    ],
    "steps": [
      {
        "heading": "روزهای هفته",
        "detail": "Monday تا Sunday را به ترتیب یاد بگیر؛ روزها با حرف بزرگ شروع می‌شوند."
      },
      {
        "heading": "ماه‌های سال",
        "detail": "January تا December را تمرین کن و به املای February و Wednesday دقت کن."
      },
      {
        "heading": "حرف اضافه روز و ماه",
        "detail": "برای روز مشخص از on و برای ماه یا سال از in استفاده می‌کنیم."
      },
      {
        "heading": "پرسیدن تاریخ",
        "detail": "برای پرسیدن روز بگو What day is it? و برای تاریخ بگو What's the date?"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "What day is it today?",
        "translation": "امروز چه روزی است؟"
      },
      {
        "speaker": "B",
        "line": "It's Friday.",
        "translation": "جمعه است."
      }
    ],
    "commonMistake": "نام روزها و ماه‌ها را با حرف کوچک ننویس؛ Monday و March با حرف بزرگ آغاز می‌شوند.",
    "practiceTip": "برنامه هفتگی خودت را با نام سه روز و دو ماه توصیف کن.",
    "questions": [
      {
        "prompt": "Which word is a month?",
        "options": [
          "Tuesday",
          "April",
          "Sunday"
        ],
        "correct": 1,
        "explanation": "April نام یک ماه است."
      },
      {
        "prompt": "Choose the correct phrase.",
        "options": [
          "in Monday",
          "on Monday",
          "at Monday"
        ],
        "correct": 1,
        "explanation": "برای روزهای هفته از on استفاده می‌کنیم."
      },
      {
        "prompt": "Choose the correct phrase.",
        "options": [
          "in August",
          "on August",
          "at August"
        ],
        "correct": 0,
        "explanation": "برای ماه‌ها از in استفاده می‌کنیم."
      },
      {
        "prompt": "Which spelling is correct?",
        "options": [
          "Wensday",
          "Wednesday",
          "Wednsday"
        ],
        "correct": 1,
        "explanation": "املای درست Wednesday است."
      },
      {
        "prompt": "Which question asks about the day?",
        "options": [
          "What day is it?",
          "How old are you?",
          "Where are you?"
        ],
        "correct": 0,
        "explanation": "What day is it? درباره روز هفته می‌پرسد."
      }
    ]
  },
  24: {
    "concept": "کشور، ملیت و زبان سه اطلاعات مرتبط اما متفاوت‌اند. کشور می‌گوید اهل کجا هستی، ملیت هویت ملی را بیان می‌کند و زبان می‌گوید چه زبانی صحبت می‌کنی.",
    "workedExamples": [
      {
        "english": "She's from Japan. She's Japanese.",
        "translation": "او اهل ژاپن است. او ژاپنی است.",
        "why": "Japan نام کشور و Japanese ملیت یا زبان است."
      },
      {
        "english": "I speak English and Persian.",
        "translation": "من انگلیسی و فارسی صحبت می‌کنم.",
        "why": "برای بیان زبان‌هایی که بلدیم از speak استفاده می‌کنیم."
      }
    ],
    "steps": [
      {
        "heading": "کشور و مبدأ",
        "detail": "برای مبدأ از be from استفاده کن: I'm from Iran."
      },
      {
        "heading": "ملیت",
        "detail": "برای ملیت از صفت ملیت استفاده کن: I'm Iranian. نام ملیت‌ها با حرف بزرگ شروع می‌شود."
      },
      {
        "heading": "زبان",
        "detail": "برای زبان از speak استفاده کن: I speak Persian."
      },
      {
        "heading": "سؤال متناسب",
        "detail": "Where are you from? درباره مبدأ و What languages do you speak? درباره زبان‌ها می‌پرسد."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Where are you from?",
        "translation": "اهل کجا هستی؟"
      },
      {
        "speaker": "B",
        "line": "I'm from Brazil. I'm Brazilian.",
        "translation": "اهل برزیل هستم. برزیلی‌ام."
      }
    ],
    "commonMistake": "Iranian و Iran را جابه‌جا نکن: Iran کشور است و Iranian ملیت یا صفت مربوط به آن.",
    "practiceTip": "کشور، ملیت و زبان خودت را در سه جمله جداگانه معرفی کن.",
    "questions": [
      {
        "prompt": "I'm from Italy. I'm ___.",
        "options": [
          "Italian",
          "Italy",
          "Italish"
        ],
        "correct": 0,
        "explanation": "Italian ملیت مربوط به Italy است."
      },
      {
        "prompt": "Which question asks about language?",
        "options": [
          "Where are you from?",
          "What languages do you speak?",
          "How old are you?"
        ],
        "correct": 1,
        "explanation": "What languages do you speak? درباره زبان‌هایی است که صحبت می‌کنی."
      },
      {
        "prompt": "Choose the correct sentence.",
        "options": [
          "I speak Persian.",
          "I am speak Persian.",
          "I speaking Persian."
        ],
        "correct": 0,
        "explanation": "پس از I از فعل پایه speak استفاده می‌کنیم."
      },
      {
        "prompt": "What is Japan?",
        "options": [
          "A language",
          "A country",
          "A nationality"
        ],
        "correct": 1,
        "explanation": "Japan نام کشور است."
      },
      {
        "prompt": "Nationality adjectives usually begin with…",
        "options": [
          "a capital letter",
          "a number",
          "a comma"
        ],
        "correct": 0,
        "explanation": "نام ملیت‌ها و زبان‌ها با حرف بزرگ شروع می‌شوند."
      }
    ]
  },
  25: {
    "concept": "وسایل و دستورهای کلاس را یاد بگیر. بتوانی وسایل کلاس را نام ببری و دستورهای کوتاه را اجرا کنی.",
    "workedExamples": [
      {
        "english": "There are two pens on the desk.",
        "translation": "دو خودکار روی میز وجود دارد.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "There is a book in my bag.",
        "translation": "یک کتاب در کیف من وجود دارد.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی وسایل کلاس را نام ببری و دستورهای کوتاه را اجرا کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Where is your notebook?",
        "translation": "دفترت کجاست؟"
      },
      {
        "speaker": "B",
        "line": "It's on the desk.",
        "translation": "روی میز است."
      }
    ],
    "commonMistake": "در دستور مستقیم، فعل در ابتدای جمله می‌آید. برای مؤدبانه‌تر شدن please را اضافه کن.",
    "practiceTip": "دستورها را در خانه به انگلیسی برای خودت اجرا کن.",
    "questions": [
      {
        "prompt": "Which is a classroom object?",
        "options": [
          "notebook",
          "cloudy",
          "Monday"
        ],
        "correct": 0,
        "explanation": "notebook یعنی دفتر."
      },
      {
        "prompt": "Choose the polite instruction.",
        "options": [
          "Please open your book.",
          "You opening book.",
          "Open you book please?"
        ],
        "correct": 0,
        "explanation": "برای دستور مؤدبانه، Please را می‌توان در ابتدا آورد."
      },
      {
        "prompt": "What does board mean?",
        "options": [
          "تخته",
          "مداد",
          "کیف"
        ],
        "correct": 0,
        "explanation": "board یعنی تخته."
      },
      {
        "prompt": "Complete: ___ your pencil.",
        "options": [
          "Open",
          "Opens",
          "Opening"
        ],
        "correct": 0,
        "explanation": "در دستور مستقیم از شکل پایه فعل استفاده می‌کنیم."
      },
      {
        "prompt": "Where is the pen? — It is ___ the desk.",
        "options": [
          "on",
          "at",
          "by"
        ],
        "correct": 0,
        "explanation": "on the desk یعنی روی میز."
      }
    ]
  },
  26: {
    "concept": "رنگ و ویژگی‌های ساده را توصیف کن. بتوانی رنگ، اندازه و ویژگی یک شخص یا شیء را در جمله بیان کنی.",
    "workedExamples": [
      {
        "english": "It is a small blue bag.",
        "translation": "این یک کیف آبی کوچک است.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "My room is clean and bright.",
        "translation": "اتاق من تمیز و روشن است.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی رنگ، اندازه و ویژگی یک شخص یا شیء را در جمله بیان کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "What color is your bag?",
        "translation": "کیفت چه رنگی است؟"
      },
      {
        "speaker": "B",
        "line": "It's black and small.",
        "translation": "سیاه و کوچک است."
      }
    ],
    "commonMistake": "صفت معمولاً پیش از اسم می‌آید و با جمع یا جنسیت تغییر نمی‌کند.",
    "practiceTip": "سه وسیله اطرافت را با رنگ و اندازه توصیف کن.",
    "questions": [
      {
        "prompt": "Choose the correct phrase.",
        "options": [
          "a red car",
          "a car red",
          "red a car"
        ],
        "correct": 0,
        "explanation": "صفت پیش از اسم می‌آید."
      },
      {
        "prompt": "What is the opposite of big?",
        "options": [
          "small",
          "long",
          "new"
        ],
        "correct": 0,
        "explanation": "small متضاد big است."
      },
      {
        "prompt": "Choose the correct sentence.",
        "options": [
          "The bags are blue.",
          "The bags is blue.",
          "The bags blue are."
        ],
        "correct": 0,
        "explanation": "فاعل جمع bags با are می‌آید."
      },
      {
        "prompt": "Which word is a color?",
        "options": [
          "green",
          "friendly",
          "tall"
        ],
        "correct": 0,
        "explanation": "green یعنی سبز."
      },
      {
        "prompt": "Complete: It is ___ old house.",
        "options": [
          "an",
          "a",
          "are"
        ],
        "correct": 0,
        "explanation": "old با صدای واکه شروع می‌شود، پس an می‌آید."
      }
    ]
  },
  27: {
    "concept": "مالکیت را با ساختارهای متنوع بیان کن. بتوانی از 's و ضمیرهای ملکی mine، yours، his و hers درست استفاده کنی.",
    "workedExamples": [
      {
        "english": "This is Sara's book. The blue one is mine.",
        "translation": "این کتاب سارا است. آبیه مال من است.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Is this your phone?",
        "translation": "آیا این گوشی توست؟",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی از 's و ضمیرهای ملکی mine، yours، his و hers درست استفاده کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Is this Ali's pen?",
        "translation": "آیا این خودکار علی است؟"
      },
      {
        "speaker": "B",
        "line": "No, it's mine.",
        "translation": "نه، مال من است."
      }
    ],
    "commonMistake": "'s بعد از نام صاحب می‌آید؛ mine و yours بدون اسم بعد از خودشان استفاده می‌شوند.",
    "practiceTip": "با وسایل خودت پنج جمله مالکیت بساز.",
    "questions": [
      {
        "prompt": "Choose the correct possessive.",
        "options": [
          "Sara's bag",
          "Sara bag's",
          "Saras bag"
        ],
        "correct": 0,
        "explanation": "برای مالکیت Sara's نوشته می‌شود."
      },
      {
        "prompt": "This book is ___.",
        "options": [
          "mine",
          "my",
          "I"
        ],
        "correct": 0,
        "explanation": "mine ضمیر ملکی مستقل است."
      },
      {
        "prompt": "That is ___ phone.",
        "options": [
          "his",
          "he",
          "him"
        ],
        "correct": 0,
        "explanation": "his پیش از اسم phone می‌آید."
      },
      {
        "prompt": "Which phrase means «مال تو»?",
        "options": [
          "yours",
          "your",
          "you"
        ],
        "correct": 0,
        "explanation": "yours یعنی مال تو/شما."
      },
      {
        "prompt": "Choose the correct sentence.",
        "options": [
          "The red car is hers.",
          "The red car is her.",
          "The red car hers is."
        ],
        "correct": 0,
        "explanation": "hers ضمیر ملکی مستقل است."
      }
    ]
  },
  28: {
    "concept": "به چند چیز نزدیک یا دور اشاره کن. بتوانی these و those را با اسم جمع و چند جمع بی‌قاعده به کار ببری.",
    "workedExamples": [
      {
        "english": "These are my keys. Those are your bags.",
        "translation": "این‌ها کلیدهای من هستند. آن‌ها کیف‌های تو هستند.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "The children are happy.",
        "translation": "بچه‌ها خوشحال‌اند.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی these و those را با اسم جمع و چند جمع بی‌قاعده به کار ببری."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Are these your books?",
        "translation": "آیا این‌ها کتاب‌های تو هستند؟"
      },
      {
        "speaker": "B",
        "line": "No, those are my books.",
        "translation": "نه، آن‌ها کتاب‌های من هستند."
      }
    ],
    "commonMistake": "these جمع this و those جمع that است؛ children و people جمع‌های بی‌قاعده‌اند.",
    "practiceTip": "در اتاق به سه چیز نزدیک و سه چیز دور اشاره کن و نام ببر.",
    "questions": [
      {
        "prompt": "Plural of child is…",
        "options": [
          "childs",
          "children",
          "childes"
        ],
        "correct": 1,
        "explanation": "جمع بی‌قاعده child برابر children است."
      },
      {
        "prompt": "For things near us, use…",
        "options": [
          "these",
          "those",
          "that"
        ],
        "correct": 0,
        "explanation": "these برای چند چیز نزدیک است."
      },
      {
        "prompt": "Which is correct?",
        "options": [
          "Those are my shoes.",
          "Those is my shoes.",
          "That are my shoes."
        ],
        "correct": 0,
        "explanation": "those با فعل جمع are می‌آید."
      },
      {
        "prompt": "Plural of person is often…",
        "options": [
          "people",
          "personses",
          "peoples"
        ],
        "correct": 0,
        "explanation": "people جمع رایج person است."
      },
      {
        "prompt": "Choose the correct phrase.",
        "options": [
          "these books",
          "this books",
          "these book"
        ],
        "correct": 0,
        "explanation": "these با اسم جمع می‌آید."
      }
    ]
  },
  29: {
    "concept": "وجود داشتن یک یا چند چیز را بیان کن. بتوانی there is و there are را در جمله مثبت، منفی و سؤال ساده به کار ببری.",
    "workedExamples": [
      {
        "english": "There are two chairs in the room.",
        "translation": "دو صندلی در اتاق وجود دارد.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Is there a bank near here?",
        "translation": "آیا این نزدیکی بانک وجود دارد؟",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی there is و there are را در جمله مثبت، منفی و سؤال ساده به کار ببری."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Are there any shops here?",
        "translation": "آیا اینجا مغازه‌ای هست؟"
      },
      {
        "speaker": "B",
        "line": "Yes, there are two shops.",
        "translation": "بله، دو مغازه هست."
      }
    ],
    "commonMistake": "برای مفرد there is و برای جمع there are می‌آید؛ در سؤال فعل be به ابتدای جمله می‌رود.",
    "practiceTip": "اتاقت را با سه جمله There is و There are توصیف کن.",
    "questions": [
      {
        "prompt": "There ___ a book on the table.",
        "options": [
          "is",
          "are",
          "am"
        ],
        "correct": 0,
        "explanation": "book مفرد است؛ there is درست است."
      },
      {
        "prompt": "There ___ three windows.",
        "options": [
          "is",
          "are",
          "be"
        ],
        "correct": 1,
        "explanation": "windows جمع است؛ there are درست است."
      },
      {
        "prompt": "Choose the correct question.",
        "options": [
          "Is there a bank?",
          "There is a bank?",
          "Are there a bank?"
        ],
        "correct": 0,
        "explanation": "برای سؤال مفرد، Is ابتدای جمله می‌آید."
      },
      {
        "prompt": "Which phrase is correct?",
        "options": [
          "There aren't any chairs.",
          "There isn't any chairs.",
          "There not are chairs."
        ],
        "correct": 0,
        "explanation": "برای جمع از aren't استفاده می‌کنیم."
      },
      {
        "prompt": "What does there are mean?",
        "options": [
          "وجود دارند",
          "وجود دارد (مفرد)",
          "هستند؟"
        ],
        "correct": 0,
        "explanation": "there are برای وجود چند چیز به کار می‌رود."
      }
    ]
  },
  30: {
    "concept": "با کلمات پرسشی اطلاعات موردنیاز را بگیر. بتوانی what، where، who، when، why و how را در سؤال مناسب انتخاب کنی.",
    "workedExamples": [
      {
        "english": "Where do you live? — I live in Berlin.",
        "translation": "کجا زندگی می‌کنی؟ — در برلین زندگی می‌کنم.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Who is your teacher?",
        "translation": "معلمت چه کسی است؟",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی what، where، who، when، why و how را در سؤال مناسب انتخاب کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "When is your birthday?",
        "translation": "تولدت چه زمانی است؟"
      },
      {
        "speaker": "B",
        "line": "It's in June.",
        "translation": "در ماه ژوئن است."
      }
    ],
    "commonMistake": "هر کلمه پرسشی نوع خاصی از اطلاعات را می‌خواهد؛ پاسخ را متناسب با آن انتخاب کن.",
    "practiceTip": "برای هر یک از what، where، who و when یک سؤال بساز.",
    "questions": [
      {
        "prompt": "Which word asks about a place?",
        "options": [
          "where",
          "who",
          "when"
        ],
        "correct": 0,
        "explanation": "where درباره مکان می‌پرسد."
      },
      {
        "prompt": "Which word asks about a person?",
        "options": [
          "who",
          "what",
          "how"
        ],
        "correct": 0,
        "explanation": "who درباره شخص می‌پرسد."
      },
      {
        "prompt": "Complete: ___ is your birthday?",
        "options": [
          "When",
          "Where",
          "Who"
        ],
        "correct": 0,
        "explanation": "when برای زمان است."
      },
      {
        "prompt": "How are you? asks about…",
        "options": [
          "condition",
          "place",
          "name"
        ],
        "correct": 0,
        "explanation": "How are you? حال و وضعیت را می‌پرسد."
      },
      {
        "prompt": "Choose the correct question.",
        "options": [
          "What is your name?",
          "What your name is?",
          "What are name you?"
        ],
        "correct": 0,
        "explanation": "در سؤال با be، فعل is پیش از فاعل می‌آید."
      }
    ]
  },
  31: {
    "concept": "بگو چه کاری را انجام نمی‌دهی. بتوانی با don't و doesn't جمله منفی بسازی و فعل پایه را درست انتخاب کنی.",
    "workedExamples": [
      {
        "english": "She doesn't work on Sundays.",
        "translation": "او یکشنبه‌ها کار نمی‌کند.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "I don't drink coffee.",
        "translation": "من قهوه نمی‌نوشم.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی با don't و doesn't جمله منفی بسازی و فعل پایه را درست انتخاب کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Do you play tennis?",
        "translation": "تنیس بازی می‌کنی؟"
      },
      {
        "speaker": "B",
        "line": "No, I don't. I don't like it.",
        "translation": "نه. دوستش ندارم."
      }
    ],
    "commonMistake": "don't با I/you/we/they و doesn't با he/she/it می‌آید؛ پس از آن فعل ساده است.",
    "practiceTip": "سه جمله منفی درباره عادت‌های خودت بنویس.",
    "questions": [
      {
        "prompt": "He ___ like milk.",
        "options": [
          "doesn't",
          "don't",
          "isn't"
        ],
        "correct": 0,
        "explanation": "با he از doesn't استفاده می‌کنیم."
      },
      {
        "prompt": "I ___ work on Sunday.",
        "options": [
          "don't",
          "doesn't",
          "am not"
        ],
        "correct": 0,
        "explanation": "با I از don't استفاده می‌کنیم."
      },
      {
        "prompt": "After doesn't, use…",
        "options": [
          "base verb",
          "verb + s",
          "verb + ing"
        ],
        "correct": 0,
        "explanation": "پس از doesn't فعل پایه می‌آید."
      },
      {
        "prompt": "Choose the correct sentence.",
        "options": [
          "She doesn't drive.",
          "She don't drive.",
          "She doesn't drives."
        ],
        "correct": 0,
        "explanation": "doesn't با فعل پایه drive می‌آید."
      },
      {
        "prompt": "They ___ live here.",
        "options": [
          "don't",
          "doesn't",
          "isn't"
        ],
        "correct": 0,
        "explanation": "با they از don't استفاده می‌شود."
      }
    ]
  },
  32: {
    "concept": "درباره عادت‌ها و کارهای روزمره سؤال کن. بتوانی سؤال حال ساده با do و does و پاسخ کوتاه بسازی.",
    "workedExamples": [
      {
        "english": "Does your brother play football? — Yes, he does.",
        "translation": "آیا برادرت فوتبال بازی می‌کند؟ — بله.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Do they live here?",
        "translation": "آیا آن‌ها اینجا زندگی می‌کنند؟",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی سؤال حال ساده با do و does و پاسخ کوتاه بسازی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Does she speak English?",
        "translation": "آیا او انگلیسی صحبت می‌کند؟"
      },
      {
        "speaker": "B",
        "line": "No, she doesn't.",
        "translation": "نه، صحبت نمی‌کند."
      }
    ],
    "commonMistake": "در سؤال do/does پیش از فاعل می‌آید؛ فعل اصلی پس از فاعل همیشه پایه است.",
    "practiceTip": "از یک دوست پنج سؤال با Do you...? بپرس.",
    "questions": [
      {
        "prompt": "___ you like music?",
        "options": [
          "Do",
          "Does",
          "Are"
        ],
        "correct": 0,
        "explanation": "با you از do استفاده می‌شود."
      },
      {
        "prompt": "___ he work here?",
        "options": [
          "Do",
          "Does",
          "Is"
        ],
        "correct": 1,
        "explanation": "با he از does استفاده می‌شود."
      },
      {
        "prompt": "Choose the correct question.",
        "options": [
          "Does she play tennis?",
          "Does she plays tennis?",
          "Do she play tennis?"
        ],
        "correct": 0,
        "explanation": "پس از does، فعل ساده play می‌آید."
      },
      {
        "prompt": "Short answer: Do they study? — Yes, ___.",
        "options": [
          "they do",
          "they does",
          "they are"
        ],
        "correct": 0,
        "explanation": "پاسخ کوتاه do با فاعل they به صورت they do است."
      },
      {
        "prompt": "Which auxiliary is used with we?",
        "options": [
          "do",
          "does",
          "is"
        ],
        "correct": 0,
        "explanation": "we با do می‌آید."
      }
    ]
  },
  33: {
    "concept": "با سؤال‌های اطلاعاتی درباره برنامه روزانه جزئیات بگیر. بتوانی کلمه پرسشی را با do/does ترکیب کنی و جواب کامل بدهی.",
    "workedExamples": [
      {
        "english": "What time do you start school? — At eight.",
        "translation": "چه ساعتی مدرسه را شروع می‌کنی؟ — ساعت هشت.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "How often does he exercise?",
        "translation": "او هر چند وقت ورزش می‌کند؟",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی کلمه پرسشی را با do/does ترکیب کنی و جواب کامل بدهی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Where do they work?",
        "translation": "آن‌ها کجا کار می‌کنند؟"
      },
      {
        "speaker": "B",
        "line": "They work in a hospital.",
        "translation": "آن‌ها در بیمارستان کار می‌کنند."
      }
    ],
    "commonMistake": "الگو: کلمه پرسشی + do/does + فاعل + فعل پایه؛ پاسخ باید همان نوع اطلاعات را بدهد.",
    "practiceTip": "درباره ساعت بیداری، محل کار و دفعات ورزش سه سؤال بساز.",
    "questions": [
      {
        "prompt": "___ do you get up? — At seven.",
        "options": [
          "What time",
          "Where",
          "Who"
        ],
        "correct": 0,
        "explanation": "برای پرسیدن ساعت از what time استفاده می‌کنیم."
      },
      {
        "prompt": "How often asks about…",
        "options": [
          "frequency",
          "location",
          "person"
        ],
        "correct": 0,
        "explanation": "How often درباره دفعات تکرار است."
      },
      {
        "prompt": "Choose the correct question.",
        "options": [
          "Where does she live?",
          "Where do she live?",
          "Where she does live?"
        ],
        "correct": 0,
        "explanation": "با she از does استفاده می‌شود."
      },
      {
        "prompt": "What is a suitable answer to Where do you work?",
        "options": [
          "In a shop.",
          "At seven.",
          "Twice a week."
        ],
        "correct": 0,
        "explanation": "Where درباره مکان است؛ In a shop پاسخ مکانی است."
      },
      {
        "prompt": "Complete: How often ___ they play?",
        "options": [
          "do",
          "does",
          "are"
        ],
        "correct": 0,
        "explanation": "با they از do استفاده می‌شود."
      }
    ]
  },
  34: {
    "concept": "درباره کاری که همین حالا در جریان است صحبت کن. بتوانی am/is/are را با فعل ingدار ترکیب کنی و سؤال و منفی ساده بسازی.",
    "workedExamples": [
      {
        "english": "She is studying English now.",
        "translation": "او الان در حال مطالعه انگلیسی است.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "They are playing outside.",
        "translation": "آن‌ها بیرون در حال بازی هستند.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی am/is/are را با فعل ingدار ترکیب کنی و سؤال و منفی ساده بسازی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "What are you doing?",
        "translation": "داری چه کار می‌کنی؟"
      },
      {
        "speaker": "B",
        "line": "I'm reading a book.",
        "translation": "دارم کتاب می‌خوانم."
      }
    ],
    "commonMistake": "ساختار حال استمراری am/is/are + فعل ingدار است و برای کار در حال انجام به کار می‌رود.",
    "practiceTip": "سه کاری را که افراد اطرافت اکنون انجام می‌دهند توصیف کن.",
    "questions": [
      {
        "prompt": "He ___ watching TV now.",
        "options": [
          "is",
          "are",
          "am"
        ],
        "correct": 0,
        "explanation": "با he از is استفاده می‌کنیم."
      },
      {
        "prompt": "They are ___ football.",
        "options": [
          "playing",
          "play",
          "plays"
        ],
        "correct": 0,
        "explanation": "پس از are در حال استمراری فعل ingدار می‌آید."
      },
      {
        "prompt": "Choose the correct question.",
        "options": [
          "Are you working?",
          "Do you working?",
          "Are you work?"
        ],
        "correct": 0,
        "explanation": "در سؤال حال استمراری، are پیش از فاعل می‌آید."
      },
      {
        "prompt": "Which time word often signals present continuous?",
        "options": [
          "now",
          "every day",
          "usually"
        ],
        "correct": 0,
        "explanation": "now یعنی اکنون و می‌تواند نشانه حال استمراری باشد."
      },
      {
        "prompt": "I ___ not listening.",
        "options": [
          "am",
          "is",
          "are"
        ],
        "correct": 0,
        "explanation": "با I از am استفاده می‌کنیم."
      }
    ]
  },
  35: {
    "concept": "به شخصی اشاره کن که کاری روی او انجام می‌شود. بتوانی ضمیرهای مفعولی را بعد از فعل و حرف اضافه به کار ببری.",
    "workedExamples": [
      {
        "english": "I know him. She helps us.",
        "translation": "من او را می‌شناسم. او به ما کمک می‌کند.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Please call me.",
        "translation": "لطفاً به من زنگ بزن.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی ضمیرهای مفعولی را بعد از فعل و حرف اضافه به کار ببری."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Do you know Anna?",
        "translation": "آنا را می‌شناسی؟"
      },
      {
        "speaker": "B",
        "line": "Yes, I know her.",
        "translation": "بله، او را می‌شناسم."
      }
    ],
    "commonMistake": "I و he ضمیر فاعلی‌اند؛ me و him در جایگاه مفعول قرار می‌گیرند.",
    "practiceTip": "با هرکدام از me، him، her و them یک جمله بساز.",
    "questions": [
      {
        "prompt": "Please help ___.",
        "options": [
          "me",
          "I",
          "my"
        ],
        "correct": 0,
        "explanation": "پس از help به ضمیر مفعولی me نیاز داریم."
      },
      {
        "prompt": "I can see Ali. I can see ___.",
        "options": [
          "him",
          "he",
          "his"
        ],
        "correct": 0,
        "explanation": "برای مفعول مذکر از him استفاده می‌شود."
      },
      {
        "prompt": "This is Sara. I know ___.",
        "options": [
          "her",
          "she",
          "hers"
        ],
        "correct": 0,
        "explanation": "برای مفعول مؤنث از her استفاده می‌شود."
      },
      {
        "prompt": "Which is an object pronoun?",
        "options": [
          "them",
          "they",
          "their"
        ],
        "correct": 0,
        "explanation": "them ضمیر مفعولی است."
      },
      {
        "prompt": "Talk to ___.",
        "options": [
          "us",
          "we",
          "our"
        ],
        "correct": 0,
        "explanation": "پس از حرف اضافه to ضمیر مفعولی us می‌آید."
      }
    ]
  },
  36: {
    "concept": "زمان را با at، on و in دقیق بیان کن. بتوانی حرف اضافه مناسب ساعت، روز، تاریخ و ماه را انتخاب کنی.",
    "workedExamples": [
      {
        "english": "The lesson is on Monday at nine.",
        "translation": "درس روز دوشنبه ساعت نه است.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "I was born in 2010.",
        "translation": "من در سال ۲۰۱۰ به دنیا آمدم.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی حرف اضافه مناسب ساعت، روز، تاریخ و ماه را انتخاب کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "When is the party?",
        "translation": "مهمانی چه زمانی است؟"
      },
      {
        "speaker": "B",
        "line": "It's on Saturday at six.",
        "translation": "شنبه ساعت شش است."
      }
    ],
    "commonMistake": "at برای ساعت، on برای روز و تاریخ و in برای ماه و سال استفاده می‌شود؛ at night یک ترکیب ثابت است.",
    "practiceTip": "برای برنامه هفتگی‌ات سه جمله با at، on و in بنویس.",
    "questions": [
      {
        "prompt": "The train leaves ___ 8:30.",
        "options": [
          "at",
          "on",
          "in"
        ],
        "correct": 0,
        "explanation": "برای ساعت دقیق از at استفاده می‌کنیم."
      },
      {
        "prompt": "We have English ___ Monday.",
        "options": [
          "on",
          "at",
          "in"
        ],
        "correct": 0,
        "explanation": "برای روز هفته از on استفاده می‌شود."
      },
      {
        "prompt": "My birthday is ___ December.",
        "options": [
          "in",
          "on",
          "at"
        ],
        "correct": 0,
        "explanation": "برای ماه از in استفاده می‌شود."
      },
      {
        "prompt": "Which phrase is correct?",
        "options": [
          "at night",
          "in night",
          "on night"
        ],
        "correct": 0,
        "explanation": "at night ترکیب رایج و درست است."
      },
      {
        "prompt": "The date is ___ 12 May.",
        "options": [
          "on",
          "in",
          "at"
        ],
        "correct": 0,
        "explanation": "برای تاریخ مشخص از on استفاده می‌کنیم."
      }
    ]
  },
  37: {
    "concept": "تفاوت اسم‌های قابل‌شمارش و غیرقابل‌شمارش را در خرید و غذا بفهم. بتوانی a/an و some را با اسم مناسب و ظرف‌های اندازه‌گیری به کار ببری.",
    "workedExamples": [
      {
        "english": "I'd like a sandwich and some water.",
        "translation": "یک ساندویچ و مقداری آب می‌خواهم.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Two bottles of milk, please.",
        "translation": "لطفاً دو بطری شیر.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی a/an و some را با اسم مناسب و ظرف‌های اندازه‌گیری به کار ببری."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Would you like some tea?",
        "translation": "کمی چای می‌خواهی؟"
      },
      {
        "speaker": "B",
        "line": "Yes, please.",
        "translation": "بله، لطفاً."
      }
    ],
    "commonMistake": "اسم قابل‌شمارش را می‌توان شمرد؛ اسم غیرقابل‌شمارش معمولاً جمع نمی‌بندد و با ظرف‌هایی مثل a glass of مقدارش را بیان می‌کنیم.",
    "practiceTip": "از یخچال پنج اسم انتخاب کن و مشخص کن کدام قابل‌شمارش‌اند.",
    "questions": [
      {
        "prompt": "Which noun is usually uncountable?",
        "options": [
          "water",
          "apple",
          "egg"
        ],
        "correct": 0,
        "explanation": "water معمولاً غیرقابل‌شمارش است."
      },
      {
        "prompt": "Choose the correct phrase.",
        "options": [
          "an apple",
          "a apple",
          "some apple (برای یک عدد)"
        ],
        "correct": 0,
        "explanation": "apple با صدای واکه شروع می‌شود و مفرد قابل‌شمارش است؛ an apple."
      },
      {
        "prompt": "Which is correct?",
        "options": [
          "some rice",
          "a rice",
          "two rices"
        ],
        "correct": 0,
        "explanation": "rice معمولاً غیرقابل‌شمارش است و با some می‌آید."
      },
      {
        "prompt": "A ___ of water.",
        "options": [
          "glass",
          "bread",
          "rice"
        ],
        "correct": 0,
        "explanation": "برای اندازه آب می‌گوییم a glass of water."
      },
      {
        "prompt": "Choose the plural countable noun.",
        "options": [
          "three bananas",
          "three milk",
          "three bread"
        ],
        "correct": 0,
        "explanation": "banana قابل‌شمارش است و جمع می‌شود."
      }
    ]
  },
  38: {
    "concept": "غذا را نام ببر و سفارش مؤدبانه بده. بتوانی سفارش ساده بدهی، منو بخواهی و درباره صورتحساب سؤال کنی.",
    "workedExamples": [
      {
        "english": "I'd like a tea, please.",
        "translation": "لطفاً یک چای می‌خواهم.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Can I have the menu?",
        "translation": "می‌توانم منو را داشته باشم؟",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی سفارش ساده بدهی، منو بخواهی و درباره صورتحساب سؤال کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Are you ready to order?",
        "translation": "برای سفارش آماده‌اید؟"
      },
      {
        "speaker": "B",
        "line": "Yes, I'd like a sandwich, please.",
        "translation": "بله، لطفاً یک ساندویچ می‌خواهم."
      }
    ],
    "commonMistake": "I'd like برای سفارش مؤدبانه است؛ please درخواست را دوستانه‌تر می‌کند.",
    "practiceTip": "یک گفت‌وگوی چهارخطی برای سفارش صبحانه بنویس.",
    "questions": [
      {
        "prompt": "Which phrase is polite for ordering?",
        "options": [
          "I'd like a coffee, please.",
          "Give coffee.",
          "Coffee now."
        ],
        "correct": 0,
        "explanation": "I'd like درخواست مؤدبانه است."
      },
      {
        "prompt": "What does menu mean?",
        "options": [
          "منو",
          "صورتحساب",
          "پیشخدمت"
        ],
        "correct": 0,
        "explanation": "menu یعنی فهرست غذا و نوشیدنی."
      },
      {
        "prompt": "How do you ask for the bill?",
        "options": [
          "Can I have the bill, please?",
          "Where is my food?",
          "How old is the bill?"
        ],
        "correct": 0,
        "explanation": "برای درخواست صورتحساب از Can I have the bill? استفاده می‌شود."
      },
      {
        "prompt": "Complete: I'd ___ a sandwich.",
        "options": [
          "like",
          "likes",
          "liking"
        ],
        "correct": 0,
        "explanation": "ساختار ثابت I'd like است."
      },
      {
        "prompt": "What does please mean?",
        "options": [
          "لطفاً",
          "متأسفم",
          "خداحافظ"
        ],
        "correct": 0,
        "explanation": "please برای مؤدبانه کردن درخواست است."
      }
    ]
  },
  39: {
    "concept": "در خرید لباس درباره قیمت و اندازه سؤال کن. بتوانی قیمت مفرد و جمع و اندازه لباس را بپرسی و پاسخ ساده بدهی.",
    "workedExamples": [
      {
        "english": "How much are these shoes? — They are twenty euros.",
        "translation": "قیمت این کفش‌ها چقدر است؟ — بیست یورو هستند.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "This shirt is too small.",
        "translation": "این پیراهن خیلی کوچک است.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی قیمت مفرد و جمع و اندازه لباس را بپرسی و پاسخ ساده بدهی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Can I try it on?",
        "translation": "می‌توانم آن را پرو کنم؟"
      },
      {
        "speaker": "B",
        "line": "Of course. The changing room is there.",
        "translation": "البته. اتاق پرو آنجاست."
      }
    ],
    "commonMistake": "برای مفرد از How much is و برای جمع از How much are استفاده کن؛ shoes معمولاً جمع است.",
    "practiceTip": "یک مکالمه کوتاه درباره خرید پیراهن و پرسیدن قیمت تمرین کن.",
    "questions": [
      {
        "prompt": "How much ___ this shirt?",
        "options": [
          "is",
          "are",
          "do"
        ],
        "correct": 0,
        "explanation": "shirt مفرد است؛ is می‌آید."
      },
      {
        "prompt": "How much ___ these shoes?",
        "options": [
          "are",
          "is",
          "does"
        ],
        "correct": 0,
        "explanation": "shoes جمع است؛ are می‌آید."
      },
      {
        "prompt": "What does expensive mean?",
        "options": [
          "گران",
          "ارزان",
          "رایگان"
        ],
        "correct": 0,
        "explanation": "expensive یعنی گران."
      },
      {
        "prompt": "Which question asks to try clothes?",
        "options": [
          "Can I try it on?",
          "Where do you live?",
          "What time is it?"
        ],
        "correct": 0,
        "explanation": "Can I try it on? یعنی می‌توانم آن را پرو کنم؟"
      },
      {
        "prompt": "What is a size?",
        "options": [
          "اندازه",
          "رنگ",
          "قیمت"
        ],
        "correct": 0,
        "explanation": "size یعنی اندازه."
      }
    ]
  },
  40: {
    "concept": "مکان‌های عمومی و دستورهای مسیر را یاد بگیر. بتوانی مسیر ساده را بپرسی و دستورهایی مثل turn left و go straight را بفهمی.",
    "workedExamples": [
      {
        "english": "Go straight and turn left.",
        "translation": "مستقیم برو و به چپ بپیچ.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "The bank is next to the station.",
        "translation": "بانک کنار ایستگاه است.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی مسیر ساده را بپرسی و دستورهایی مثل turn left و go straight را بفهمی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Excuse me, where is the museum?",
        "translation": "ببخشید، موزه کجاست؟"
      },
      {
        "speaker": "B",
        "line": "Go straight. It's on your right.",
        "translation": "مستقیم برو. سمت راست توست."
      }
    ],
    "commonMistake": "در دستور مسیر از فعل پایه استفاده می‌کنیم؛ next to یعنی کنار و opposite یعنی روبه‌روی.",
    "practiceTip": "مسیر خانه تا یک فروشگاه را با سه دستور انگلیسی توضیح بده.",
    "questions": [
      {
        "prompt": "What does turn left mean?",
        "options": [
          "به چپ بپیچ",
          "به راست بپیچ",
          "مستقیم برو"
        ],
        "correct": 0,
        "explanation": "turn left یعنی به چپ بپیچ."
      },
      {
        "prompt": "Where can you catch a train?",
        "options": [
          "station",
          "bank",
          "cafe"
        ],
        "correct": 0,
        "explanation": "قطار را در station یا ایستگاه می‌گیریم."
      },
      {
        "prompt": "Choose the correct direction.",
        "options": [
          "Go straight",
          "Goes straight",
          "Going straight"
        ],
        "correct": 0,
        "explanation": "در دستور مستقیم فعل پایه می‌آید."
      },
      {
        "prompt": "What does next to mean?",
        "options": [
          "کنار",
          "داخل",
          "پشت"
        ],
        "correct": 0,
        "explanation": "next to یعنی کنار."
      },
      {
        "prompt": "Which phrase is polite to start asking directions?",
        "options": [
          "Excuse me",
          "Good night",
          "I'm hungry"
        ],
        "correct": 0,
        "explanation": "Excuse me برای جلب توجه مؤدبانه است."
      }
    ]
  },
  41: {
    "concept": "درباره رفت‌وآمد و سفر کوتاه صحبت کن. بتوانی وسایل حمل‌ونقل را نام ببری و روش رفت‌وآمدت را بیان کنی.",
    "workedExamples": [
      {
        "english": "I go to work by bus.",
        "translation": "من با اتوبوس به محل کار می‌روم.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "We travel by train.",
        "translation": "ما با قطار سفر می‌کنیم.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی وسایل حمل‌ونقل را نام ببری و روش رفت‌وآمدت را بیان کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Where can I buy a ticket?",
        "translation": "از کجا می‌توانم بلیت بخرم؟"
      },
      {
        "speaker": "B",
        "line": "At the ticket office.",
        "translation": "از باجه بلیت."
      }
    ],
    "commonMistake": "برای وسیله نقلیه از by + وسیله استفاده کن؛ استثنای رایج on foot است.",
    "practiceTip": "سه روش رفت‌وآمد را با by بیان کن و یک جمله با on foot بساز.",
    "questions": [
      {
        "prompt": "I travel ___ train.",
        "options": [
          "by",
          "on",
          "in"
        ],
        "correct": 0,
        "explanation": "برای وسیله نقلیه از by train استفاده می‌شود."
      },
      {
        "prompt": "What is a ticket?",
        "options": [
          "بلیت",
          "چمدان",
          "نقشه"
        ],
        "correct": 0,
        "explanation": "ticket یعنی بلیت."
      },
      {
        "prompt": "Where do planes arrive?",
        "options": [
          "airport",
          "station",
          "library"
        ],
        "correct": 0,
        "explanation": "هواپیما در airport یا فرودگاه می‌آید."
      },
      {
        "prompt": "Which phrase is correct?",
        "options": [
          "on foot",
          "by foot",
          "in foot"
        ],
        "correct": 0,
        "explanation": "عبارت درست on foot است."
      },
      {
        "prompt": "Choose the transport.",
        "options": [
          "bus",
          "cloudy",
          "hungry"
        ],
        "correct": 0,
        "explanation": "bus وسیله حمل‌ونقل است."
      }
    ]
  },
  42: {
    "concept": "آب‌وهوا و فصل موردعلاقه‌ات را توصیف کن. بتوانی وضعیت هوا و فصل را با جمله‌های ساده بیان کنی.",
    "workedExamples": [
      {
        "english": "It's cold and rainy today.",
        "translation": "امروز سرد و بارانی است.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "I like spring because it's warm.",
        "translation": "من بهار را دوست دارم چون هوا گرم است.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی وضعیت هوا و فصل را با جمله‌های ساده بیان کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "What's the weather like today?",
        "translation": "امروز هوا چطور است؟"
      },
      {
        "speaker": "B",
        "line": "It's sunny and warm.",
        "translation": "آفتابی و گرم است."
      }
    ],
    "commonMistake": "برای هوا از It is + صفت استفاده می‌کنیم؛ فصل‌ها با in می‌آیند: in winter.",
    "practiceTip": "آب‌وهوای امروز و فصل موردعلاقه‌ات را در چهار جمله توصیف کن.",
    "questions": [
      {
        "prompt": "What does cloudy mean?",
        "options": [
          "ابری",
          "آفتابی",
          "بارانی"
        ],
        "correct": 0,
        "explanation": "cloudy یعنی ابری."
      },
      {
        "prompt": "Complete: It ___ hot today.",
        "options": [
          "is",
          "are",
          "am"
        ],
        "correct": 0,
        "explanation": "فاعل it با is می‌آید."
      },
      {
        "prompt": "Which is a season?",
        "options": [
          "spring",
          "Tuesday",
          "blue"
        ],
        "correct": 0,
        "explanation": "spring بهار و یکی از فصل‌هاست."
      },
      {
        "prompt": "Choose the correct phrase.",
        "options": [
          "in winter",
          "on winter",
          "at winter"
        ],
        "correct": 0,
        "explanation": "برای فصل‌ها از in استفاده می‌کنیم."
      },
      {
        "prompt": "Which question asks about weather?",
        "options": [
          "What's the weather like?",
          "Where are you from?",
          "How old are you?"
        ],
        "correct": 0,
        "explanation": "این سؤال درباره وضعیت آب‌وهواست."
      }
    ]
  },
  43: {
    "concept": "دعوت و پیشنهاد فعالیت بده و پاسخ مناسب انتخاب کن. بتوانی با Let's و Would you like دعوت کنی و آن را بپذیری یا رد کنی.",
    "workedExamples": [
      {
        "english": "Would you like to play football?",
        "translation": "دوست داری فوتبال بازی کنیم؟",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Let's watch a movie.",
        "translation": "بیا فیلم ببینیم.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی با Let's و Would you like دعوت کنی و آن را بپذیری یا رد کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Would you like some tea?",
        "translation": "کمی چای میل داری؟"
      },
      {
        "speaker": "B",
        "line": "Yes, please. That sounds nice.",
        "translation": "بله، لطفاً. خوب به نظر می‌رسد."
      }
    ],
    "commonMistake": "Let's با فعل پایه می‌آید؛ Would you like to با فعل و to استفاده می‌شود.",
    "practiceTip": "یک دوست را به یک فعالیت دعوت کن و دو پاسخ ممکن بنویس.",
    "questions": [
      {
        "prompt": "Complete: Let's ___ football.",
        "options": [
          "play",
          "plays",
          "playing"
        ],
        "correct": 0,
        "explanation": "پس از Let's فعل پایه می‌آید."
      },
      {
        "prompt": "Choose a polite invitation.",
        "options": [
          "Would you like to join us?",
          "Join us now!",
          "You joining?"
        ],
        "correct": 0,
        "explanation": "Would you like ...? دعوت مؤدبانه است."
      },
      {
        "prompt": "What is a positive response?",
        "options": [
          "That sounds great!",
          "No, never.",
          "I don't know you."
        ],
        "correct": 0,
        "explanation": "That sounds great پذیرش مثبت دعوت است."
      },
      {
        "prompt": "Complete: Would you like ___ come?",
        "options": [
          "to",
          "for",
          "at"
        ],
        "correct": 0,
        "explanation": "ساختار would like to + فعل است."
      },
      {
        "prompt": "Which phrase politely refuses?",
        "options": [
          "Sorry, I can't.",
          "Yes, of course.",
          "Thank you very much."
        ],
        "correct": 0,
        "explanation": "Sorry, I can't رد مؤدبانه است."
      }
    ]
  },
  44: {
    "concept": "در موقعیت روزمره مؤدبانه کمک بخواه. بتوانی با please، thank you، excuse me و can you درخواست ساده مطرح کنی.",
    "workedExamples": [
      {
        "english": "Excuse me, can you help me, please?",
        "translation": "ببخشید، می‌توانید لطفاً کمکم کنید؟",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "Thank you for your help.",
        "translation": "از کمکت ممنونم.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی با please، thank you، excuse me و can you درخواست ساده مطرح کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "Can you show me the way?",
        "translation": "می‌توانی راه را به من نشان بدهی؟"
      },
      {
        "speaker": "B",
        "line": "Of course. Go straight.",
        "translation": "حتماً. مستقیم برو."
      }
    ],
    "commonMistake": "Excuse me برای شروع درخواست و please برای مؤدبانه کردن آن است؛ بعد از کمک Thank you بگو.",
    "practiceTip": "سه درخواست مؤدبانه برای کلاس، خیابان و فروشگاه بساز.",
    "questions": [
      {
        "prompt": "Which phrase means «ببخشید»?",
        "options": [
          "Excuse me",
          "You're welcome",
          "Good night"
        ],
        "correct": 0,
        "explanation": "Excuse me برای جلب توجه مؤدبانه است."
      },
      {
        "prompt": "Complete: Can you help ___?",
        "options": [
          "me",
          "I",
          "my"
        ],
        "correct": 0,
        "explanation": "بعد از help ضمیر مفعولی me می‌آید."
      },
      {
        "prompt": "What do you say after someone helps you?",
        "options": [
          "Thank you",
          "Excuse me",
          "Good morning"
        ],
        "correct": 0,
        "explanation": "برای قدردانی می‌گوییم Thank you."
      },
      {
        "prompt": "What does You're welcome mean?",
        "options": [
          "خواهش می‌کنم",
          "ببخشید",
          "خداحافظ"
        ],
        "correct": 0,
        "explanation": "You're welcome پاسخ رایج به تشکر است."
      },
      {
        "prompt": "Choose the polite request.",
        "options": [
          "Could you repeat that, please?",
          "Repeat it!",
          "You repeat."
        ],
        "correct": 0,
        "explanation": "Could you ... please? درخواست مؤدبانه است."
      }
    ]
  },
  45: {
    "concept": "دانسته‌های A1 را در موقعیت واقعی ترکیب کن. بتوانی خودت را معرفی کنی، برنامه روزانه را توصیف کنی، سؤال بپرسی و در موقعیت خرید یا کافه مکالمه کنی.",
    "workedExamples": [
      {
        "english": "Hello, I'm Mina. I live in a small city.",
        "translation": "سلام، من مینا هستم. در شهری کوچک زندگی می‌کنم.",
        "why": "این مثال کاربرد مستقیم ساختار اصلی درس را نشان می‌دهد."
      },
      {
        "english": "I usually study in the morning.",
        "translation": "من معمولاً صبح‌ها درس می‌خوانم.",
        "why": "این نمونه دوم ساختار را در جمله‌ای متفاوت نشان می‌دهد."
      }
    ],
    "steps": [
      {
        "heading": "ساختار اصلی",
        "detail": "بتوانی خودت را معرفی کنی، برنامه روزانه را توصیف کنی، سؤال بپرسی و در موقعیت خرید یا کافه مکالمه کنی."
      },
      {
        "heading": "واژگان کلیدی",
        "detail": "واژه‌های این درس را با صدای بلند بخوان و برای هرکدام یک مثال بساز."
      },
      {
        "heading": "کاربرد در موقعیت واقعی",
        "detail": "به مکالمه نمونه دقت کن و عبارت‌ها را در موقعیت مشابه به کار ببر."
      },
      {
        "heading": "تمرین شخصی",
        "detail": "با استفاده از واژه‌ها و ساختار درس، درباره زندگی واقعی خودت جمله بساز."
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "line": "What do you do after school?",
        "translation": "بعد از مدرسه چه کار می‌کنی؟"
      },
      {
        "speaker": "B",
        "line": "I usually do my homework and read.",
        "translation": "معمولاً تکالیفم را انجام می‌دهم و مطالعه می‌کنم."
      }
    ],
    "commonMistake": "در گفت‌وگوی واقعی از جمله‌های کوتاه، پیوندهای ساده مثل and و but و واژگان آشنا استفاده کن.",
    "practiceTip": "یک معرفی ۶ تا ۸ جمله‌ای از خودت بنویس و آن را با صدای بلند بخوان.",
    "questions": [
      {
        "prompt": "Choose the correct introduction.",
        "options": [
          "My name is Ali.",
          "My name Ali.",
          "I name is Ali."
        ],
        "correct": 0,
        "explanation": "ساختار معرفی نام My name is است."
      },
      {
        "prompt": "She ___ to school every day.",
        "options": [
          "goes",
          "go",
          "going"
        ],
        "correct": 0,
        "explanation": "در حال ساده با she به فعل s اضافه می‌شود."
      },
      {
        "prompt": "There ___ two books.",
        "options": [
          "are",
          "is",
          "am"
        ],
        "correct": 0,
        "explanation": "برای اسم جمع از there are استفاده می‌شود."
      },
      {
        "prompt": "How do you order politely?",
        "options": [
          "I'd like a sandwich, please.",
          "Give sandwich.",
          "I sandwich."
        ],
        "correct": 0,
        "explanation": "I'd like درخواست مؤدبانه برای سفارش است."
      },
      {
        "prompt": "Which phrase asks for a place?",
        "options": [
          "Where is the station?",
          "How old are you?",
          "What is your name?"
        ],
        "correct": 0,
        "explanation": "where درباره مکان سؤال می‌کند."
      }
    ]
  }
};

export const createOptionOrders = (content: Record<number, LessonContent>, lessonId: number) => Object.fromEntries((content[lessonId]?.questions ?? []).map((question, questionIndex) => { const order = question.options.map((_, index) => index); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } return [questionIndex, order]; })) as Record<number, number[]>;

export const courseUnits = [...new Set(lessons.map(lesson => lesson.unit))].map(unit => ({ unit, lessons: lessons.filter(lesson => lesson.unit === unit) }));

