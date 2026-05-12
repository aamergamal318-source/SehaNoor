"use strict";

/* ============================================================
   BILINGUAL CONTENT  (default: Arabic)
   ============================================================ */
const CONTENT = {
  ar: {
    pageTitle: "أورط صحي | اورط أبو ربيعة",
    langLabel: "עברית",
    "logo.name":   "أورط صحي",
    "logo.school": "اورط أبو ربيعة",
    "nav.bmi":"حاسبة BMI","nav.articles":"مقالات","nav.activities":"أنشطة",
    "nav.gallery":"معرض","nav.tips":"الفوز","nav.about":"عن المشروع",
    "hero.chip":   "اورط أبو ربيعة | رابعة النقب",
    "hero.t1":"أورط","hero.t2":"صحـي",
    "hero.slogan": "كُل • تمرَّن • أَحِبَّ",
    "hero.desc":   "مشروع صحي متكامل لتعزيز نمط الحياة الصحي لدى طلاب مدرسة اورط أبو ربيعة في النقب — تغذية سليمة، نشاط بدني، وحبّ للصحة.",
    "hero.cta1":"احسب مؤشر كتلة الجسم","hero.cta2":"مقالات صحية",
    "hero.c1":"تغذية سليمة","hero.c2":"نشاط بدني","hero.c3":"شرب الماء","hero.c4":"الحماية من الشمس",
    "hero.scroll":"مرر للأسفل",
    "stats.s1":"طالب مشارك","stats.s2":"مقالات صحية","stats.s3":"أنشطة فعّالة","stats.s4":"اقتراحات للفوز",
    "bmi.eyebrow":"أداة صحية تفاعلية","bmi.h2":"حاسبة مؤشر كتلة الجسم",
    "bmi.sub":"أدخل بياناتك للحصول على تقييم صحي مخصص وتوصيات مناسبة لعمرك",
    "bmi.formTitle":"بياناتك الشخصية",
    "bmi.wl":"الوزن (كغ)","bmi.hl":"الطول (سم)","bmi.al":"العمر (سنة)","bmi.gl":"الجنس",
    "bmi.male":"ذكر","bmi.female":"أنثى",
    "bmi.calcBtn":"احسب الآن",
    "bmi.rU":"نقص الوزن","bmi.rN":"وزن طبيعي","bmi.rW":"زيادة وزن","bmi.rO":"سمنة",
    "bmi.empty":"أدخل بياناتك وانقر \"احسب الآن\" للحصول على تقييمك الصحي الشخصي",
    "bmi.errReq":"يرجى ملء جميع الحقول",
    "bmi.recTitle":"توصياتك الشخصية:",
    "bmi.childNote":"ملاحظة: للأطفال والمراهقين (2–18 سنة)، يُقيَّم المؤشر وفق النسب المئوية للعمر والجنس بحسب مراجع CDC.",
    "art.eyebrow":"محتوى صحي مميز","art.h2":"مقالات صحية",
    "art.sub":"معلومات علمية حول التغذية والنشاط والصحة للمجتمع البدوي في النقب",
    "art.more":"اقرأ المزيد","art.less":"أقل","art.readFull":"اقرأ المقالة كاملة",
    "act.eyebrow":"ما نقوم به","act.h2":"أنشطة الصيف الصحي",
    "act.sub":"برامج وأنشطة المدرسة لتعزيز الصحة في المجتمع",
    "gal.eyebrow":"لحظات مميزة","gal.h2":"معرض الصور",
    "gal.sub":"صور توضيحية لأنشطة وفعاليات مشروع أورط صحي",
    "tips.eyebrow":"وصفة النجاح","tips.h2":"كيف نفوز بمسابقة أورط صحي؟",
    "tips.sub":"استراتيجيات مدروسة ستجعل مدرستنا تتميز وتحقق الفوز",
    "test.eyebrow":"أصوات طلابنا","test.h2":"ماذا يقول طلابنا",
    "about.eyebrow":"عن المشروع","about.h2":"أورط صحي — رؤية وطنية",
    "about.p1":"أورط صحي مشروع وطني لشبكة أورط إسرائيل، يهدف إلى تعزيز نمط الحياة الصحي لدى الطلاب في جميع أنحاء البلاد. مدرسة اورط أبو ربيعة تشارك بحضور قوي ومتميز مع دمج الثقافة البدوية الأصيلة.",
    "about.p2":"نؤمن بأن الصحة رحلة يومية تبدأ من مائدتنا وخطواتنا ومحبتنا لأنفسنا ومجتمعنا.",
    "about.b1":"موقع أورط صحي","about.b2":"شبكة أورط إسرائيل",
    "about.tag":"لأكل • للتمرن • للحياة",
    "footer.nav":"تصفّح","footer.links":"روابط",
    "footer.school":"اورط أبو ربيعة","footer.proj":"مشروع أورط صحي 2025–2026",
  },
  he: {
    pageTitle: "אורט בריא | אורט אבו רביעה",
    langLabel: "العربية",
    "logo.name":   "אורט בריא",
    "logo.school": "אורט אבו רביעה",
    "nav.bmi":"מחשבון BMI","nav.articles":"מאמרים","nav.activities":"פעילויות",
    "nav.gallery":"גלריה","nav.tips":"עצות לניצחון","nav.about":"אודות",
    "hero.chip":   "ב''ס אורט אבו רביעה | רבעייה בנגב",
    "hero.t1":"אורט","hero.t2":"בריא",
    "hero.slogan": "לאכול • להתעמל • לאהוב",
    "hero.desc":   "פרויקט בריאות לקידום אורח חיים בריא בקרב תלמידי ב''ס אורט אבו רביעה בנגב — תזונה נכונה, פעילות גופנית ואהבה לבריאות.",
    "hero.cta1":"בדוק את ה-BMI שלך","hero.cta2":"מאמרים בריאותיים",
    "hero.c1":"תזונה נכונה","hero.c2":"פעילות גופנית","hero.c3":"שתיית מים","hero.c4":"הגנה מהשמש",
    "hero.scroll":"גלול למטה",
    "stats.s1":"תלמידים משתתפים","stats.s2":"מאמרים בריאותיים","stats.s3":"פעילויות פעילות","stats.s4":"הצעות לניצחון",
    "bmi.eyebrow":"כלי בריאות אינטראקטיבי","bmi.h2":"מחשבון מדד מסת הגוף (BMI)",
    "bmi.sub":"הזן את הנתונים שלך לקבלת הערכה בריאותית אישית והמלצות מותאמות לגילך",
    "bmi.formTitle":"הפרטים שלך",
    "bmi.wl":"משקל (ק''ג)","bmi.hl":"גובה (ס''מ)","bmi.al":"גיל (שנים)","bmi.gl":"מין",
    "bmi.male":"זכר","bmi.female":"נקבה",
    "bmi.calcBtn":"חשב עכשיו",
    "bmi.rU":"תת-משקל","bmi.rN":"משקל תקין","bmi.rW":"עודף משקל","bmi.rO":"השמנה",
    "bmi.empty":"מלא את הפרטים ולחץ \"חשב עכשיו\" לקבלת ההערכה הבריאותית האישית שלך",
    "bmi.errReq":"אנא מלא את כל השדות",
    "bmi.recTitle":"ההמלצות שלך:",
    "bmi.childNote":"הערה: לילדים ומתבגרים (2–18), ה-BMI מוערך לפי אחוזוני גיל ומין לפי מחקרי CDC.",
    "art.eyebrow":"תוכן בריאותי מיוחד","art.h2":"מאמרים בריאותיים",
    "art.sub":"מידע מדעי על תזונה, פעילות ובריאות לקהילה הבדואית בנגב",
    "art.more":"קרא עוד","art.less":"הצג פחות","art.readFull":"קרא את המאמר המלא",
    "act.eyebrow":"מה אנחנו עושים","act.h2":"פעילויות קיץ בריא",
    "act.sub":"תוכניות ופעילויות ביה''ס לקידום הבריאות בקהילה",
    "gal.eyebrow":"רגעים מיוחדים","gal.h2":"גלריית תמונות",
    "gal.sub":"תמונות המדגימות את פעילויות ואירועי פרויקט אורט בריא",
    "tips.eyebrow":"מתכון לניצחון","tips.h2":"כיצד לזכות בתחרות אורט בריא?",
    "tips.sub":"אסטרטגיות מחושבות שיבדלו את ביה''ס שלנו ויובילו לניצחון",
    "test.eyebrow":"קולות תלמידינו","test.h2":"מה אומרים תלמידינו",
    "about.eyebrow":"אודות הפרויקט","about.h2":"אורט בריא — חזון לאומי",
    "about.p1":"אורט בריא הוא פרויקט לאומי של רשת אורט ישראל, שמטרתו לקדם אורח חיים בריא בקרב תלמידים בכל הארץ. ב''ס אורט אבו רביעה משתתף בנוכחות חזקה ומיוחדת עם שילוב התרבות הבדואית האותנטית.",
    "about.p2":"אנו מאמינים שהבריאות היא מסע יומי שמתחיל משולחן האוכל שלנו, מצעדינו ומאהבתנו לעצמנו ולקהילתנו.",
    "about.b1":"אתר אורט בריא","about.b2":"רשת אורט ישראל",
    "about.tag":"לאכול • להתעמל • לחיות",
    "footer.nav":"ניווט","footer.links":"קישורים",
    "footer.school":"ב''ס אורט אבו רביעה","footer.proj":"פרויקט: אורט בריא 2025–2026",
  },
};

/* ============================================================
   ARTICLES
   ============================================================ */
const ARTICLES = {
  ar: [
    { slug:"food", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&q=80", cat:"تغذية", catBg:"#E8F5E9", catColor:"#2E7D32",
      title:"الغذاء الصحي في المجتمع البدوي",
      sum:"المطبخ البدوي التقليدي مليء بالكنوز الصحية — كيف نحافظ على الجيد ونتخلى عن الضار؟",
      full:`<p>تحتوي الأطعمة التقليدية للمجتمع البدوي على عناصر صحية قيّمة: المنسف من الضأن والأرز، خبز الطابون، المجدرة بالعدس، والسلطات الطازجة — جميعها غنية بالبروتين والألياف والفيتامينات.</p>
      <p><strong>التحدي اليوم:</strong> دخول الأطعمة المصنعة والمشروبات المحلاة وتراجع العادات الغذائية الصحية التقليدية.</p>
      <p><strong>توصيات مهمة:</strong></p>
      <ul><li>فضّل خبز الطابون على الخبز الأبيض المصنع</li><li>تناول العدس والحمص والبرغل يومياً</li><li>أضف خضروات ورقية لكل وجبة</li><li>استبدل المشروبات المحلاة بالماء والشاي الطبيعي</li><li>قلل جذرياً من الوجبات السريعة والمعلبات</li></ul>` },
    { slug:"water", img:"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format&q=80", cat:"شرب الماء", catBg:"#E3F2FD", catColor:"#1565C0",
      title:"الماء — الحياة في قلب النقب",
      sum:"في النقب الحار، الترطيب ليس خياراً بل ضرورة. كم تحتاج وكيف تحقق ذلك؟",
      full:`<p>يُفقَد الجسم كميات كبيرة من السوائل عبر التعرق في مناخ النقب، مما يؤدي إلى الجفاف الذي يضرّ بالتركيز والأداء والصحة العامة.</p>
      <p><strong>الاحتياج اليومي:</strong></p>
      <ul><li>الأطفال (6–12 سنة): 1.5 لتر على الأقل</li><li>المراهقون (12–18 سنة): 2 لتر على الأقل</li><li>البالغون: 2–3 لتر، أكثر في الصيف</li></ul>
      <p><strong>نصائح ذهبية:</strong></p>
      <ul><li>ابدأ يومك بكوب ماء قبل الإفطار</li><li>ضع زجاجة ماء على مكتبك دائماً</li><li>تناول فواكه وخضروات غنية بالماء كالبطيخ والخيار</li><li>أضف نعناعاً أو ليموناً للنكهة</li></ul>` },
    { slug:"sun", img:"https://images.unsplash.com/photo-1527430253228-e93688616381?w=600&auto=format&q=80", cat:"الحماية من الشمس", catBg:"#FFF9C4", catColor:"#F57F17",
      title:"الحماية الذكية من أشعة الشمس",
      sum:"شمس النقب قوية طوال العام. كيف تتمتع بالخارج مع حماية جلدك وصحتك؟",
      full:`<p>الأشعة فوق البنفسجية في النقب خطيرة بشكل خاص بين 10 صباحاً و4 مساءً. التعرض دون حماية يسبب حروق الشمس، الإجهاد الحراري، وأضراراً جلدية طويلة الأمد.</p>
      <p><strong>قواعد الحماية الخمس:</strong></p>
      <ul><li>🧴 كريم واقٍ SPF 30+ قبل 30 دقيقة من الخروج، يُجدَّد كل ساعتين</li><li>🧢 قبعة بحواف عريضة تحمي الوجه والرقبة</li><li>🕶️ نظارات شمسية معتمدة لمنع UV</li><li>👕 ملابس قطنية فاتحة ومريحة</li><li>🌳 ابحث عن الظل في ساعات الذروة</li></ul>` },
    { slug:"activity", img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&q=80", cat:"نشاط بدني", catBg:"#FFF3E0", catColor:"#E65100",
      title:"تحرَّك! — النشاط البدني للصحة",
      sum:"30 دقيقة نشاط يومياً تغير حياتك. كيف نتحرك في صيف النقب الحار؟",
      full:`<p>النشاط البدني المنتظم يخفض الوزن، يحسّن المزاج، يقوي العظام، ويرفع مستوى التركيز. الأطفال والمراهقون يحتاجون 60 دقيقة على الأقل يومياً.</p>
      <p><strong>أفكار للنشاط في النقب:</strong></p>
      <ul><li>المشي أو الجري في الصباح الباكر (قبل 9 صباحاً)</li><li>السباحة في المسبح صيفاً</li><li>كرة القدم، السلة، الكرة الطائرة مساءً</li><li>رقصة الدبكة التقليدية — نشاط وتراث</li><li>ركوب الدراجات في الحي</li><li>تمارين اليوغا والتمدد صباحاً</li></ul>` },
    { slug:"snacks", img:"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&q=80", cat:"وجبات خفيفة", catBg:"#FCE4EC", catColor:"#880E4F",
      title:"وجبات خفيفة صحية لصيف رائع",
      sum:"بدلاً من الشيبس والغازية — بطيخ وجوز وتمر! اكتشف بدائل لذيذة وصحية.",
      full:`<p>في الصيف نميل لتناول وجبات باردة ومحلاة. الخيار الصحيح يحسّن الطاقة ويحمي الصحة.</p>
      <p><strong>وجبات خفيفة مثالية:</strong></p>
      <ul><li>🍉 بطيخ مثلج — 92% ماء، منعش ومشبع</li><li>🫐 عنب مجمّد — حلوى صحية طبيعية</li><li>🥒 خيار بليمون ومعدنوس — منعش وصحي</li><li>🥜 جوز ولوز — طاقة وبروتين</li><li>🧆 حمص مع خضروات طازجة</li><li>🍦 آيس كريم فواكه منزلي الصنع</li><li>🌽 ذرة مسلوقة — غنية بالألياف</li></ul>
      <p><strong>تجنّب:</strong> المشروبات الغازية، الشيبس، الحلويات الصناعية — تحتوي كميات خطيرة من السكر والملح والدهون.</p>` },
  ],
  he: [
    { slug:"food", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&q=80", cat:"תזונה", catBg:"#E8F5E9", catColor:"#2E7D32",
      title:"תזונה בריאה בחברה הבדואית",
      sum:"המטבח הבדואי המסורתי עמוס בכנוי בריאות — כיצד שומרים על הטוב ומשפרים את הרע?",
      full:`<p>מאכלים בדואיים מסורתיים עשירים בחלבון, סיבים וויטמינים: מנסף, לחם טאבון, מוג'דרה עדשים, סלטים טריים — כולם מזון מעולה. הבעיה: מזונות מעובדים ומשקאות ממותקים חדרו לתפריט היומי.</p>
      <p><strong>המלצות מעשיות:</strong></p>
      <ul><li>העדף לחם טאבון על לחם לבן</li><li>אכל עדשים, חומוס וגריסים יומיומית</li><li>הוסף ירקות עלים לכל ארוחה</li><li>החלף משקאות ממותקים במים ותה טבעי</li><li>הגבל מזון מהיר ומזון מעובד</li></ul>` },
    { slug:"water", img:"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format&q=80", cat:"שתיית מים", catBg:"#E3F2FD", catColor:"#1565C0",
      title:"מים — חיים בנגב",
      sum:"בנגב החם, שתיית מים מספיקה אינה מותרות — היא הכרח. כמה צריך ומתי?",
      full:`<p>האקלים הצחיח של הנגב מחייב שתייה מרובה. גוף מיובש פוגע בריכוז, בביצועים ובבריאות הכללית.</p>
      <p><strong>כמה מים ליום?</strong></p>
      <ul><li>ילדים 6–12: לפחות 1.5 ליטר</li><li>מתבגרים 12–18: לפחות 2 ליטר</li><li>מבוגרים: 2–3 ליטר, יותר בקיץ</li></ul>
      <p><strong>טיפים לשתייה יותר:</strong></p>
      <ul><li>שתה כוס מים לפני ארוחת הבוקר</li><li>שמור בקבוק מים על השולחן</li><li>אכל מלפפון, אבטיח ועגבנייה</li><li>הוסף ליים או נענע לטעם</li></ul>` },
    { slug:"sun", img:"https://images.unsplash.com/photo-1527430253228-e93688616381?w=600&auto=format&q=80", cat:"הגנה מהשמש", catBg:"#FFF9C4", catColor:"#F57F17",
      title:"הגנה חכמה מהשמש",
      sum:"בנגב שמש חזקה כל השנה. כיצד נהנים בחוץ בצורה בטוחה ומוגנת?",
      full:`<p>קרינת UV בנגב חזקה במיוחד בין 10:00–16:00. חשיפה ללא הגנה גורמת לכוויות, עייפות ונזקים לטווח ארוך.</p>
      <p><strong>חמישה כללי הגנה:</strong></p>
      <ul><li>🧴 קרם הגנה SPF 30+ — 30 דקות לפני יציאה, מחדש כל שעתיים</li><li>🧢 כובע עם שוליים רחבים</li><li>🕶️ משקפי שמש עם מסנן UV</li><li>👕 בגדים קלים מכותנה בצבעים בהירים</li><li>🌳 חפש צל בשעות הקיצוניות</li></ul>` },
    { slug:"activity", img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&q=80", cat:"פעילות גופנית", catBg:"#FFF3E0", catColor:"#E65100",
      title:"זוז! — פעילות גופנית לבריאות",
      sum:"30 דקות פעילות ביום משנות הכל. איך מפעילים את הגוף גם בקיץ הנגב?",
      full:`<p>פעילות גופנית סדירה מפחיתה משקל, משפרת מצב רוח, מחזקת עצמות ומעלה ריכוז.</p>
      <p><strong>רעיונות לפעילות בנגב:</strong></p>
      <ul><li>הליכה/ריצה לפני 9:00 או אחרי 17:00</li><li>שחייה בבריכה ציבורית</li><li>ספורט קבוצתי: כדורגל, כדורסל, כדורעף</li><li>ריקוד דבקה מסורתי</li><li>רכיבה על אופניים</li><li>יוגה ומתיחות בבוקר</li></ul>` },
    { slug:"snacks", img:"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&q=80", cat:"חטיפים בריאים", catBg:"#FCE4EC", catColor:"#880E4F",
      title:"חטיפים בריאים לקיץ מושלם",
      sum:"במקום צ'יפס ודיאט — תאנים, אגוזים ואבטיח! גלה חלופות טעימות ובריאות.",
      full:`<p>בקיץ אנו אוכלים יותר חטיפים. בחירה נכונה שומרת על הבריאות ומשפרת את האנרגיה.</p>
      <p><strong>חטיפים מצוינים:</strong></p>
      <ul><li>🍉 אבטיח קפוא — 92% מים, מרענן ומתוק</li><li>🫐 ענבים קפואים — קינוח בריא</li><li>🥒 מלפפון עם לימון — טרי ומרענן</li><li>🥜 אגוזים ושקדים — שובע ובריאות</li><li>🧆 חומוס עם ירקות טריים</li><li>🍦 גלידת פירות תוצרת בית</li><li>🌽 תירס מבושל</li></ul>
      <p><strong>הימנע מ:</strong> שתיות קלות, צ'יפס, ממתקים מסוכרים — עמוסים בסוכר, מלח ושומן.</p>` },
  ],
};

/* ============================================================
   ACTIVITIES
   ============================================================ */
const ACTIVITIES = {
  ar: [
    { n:"01", ico:"🥗", bg:"#E8F5E9", ac:"#2E7D32", title:"ركيزة الحفاظ على التغذية الصحيحة", desc:"كشك تفاعلي يتعلم فيه الطلاب هرم الغذاء ويحصلون على بطاقة وصفة صحية أسبوعية مخصصة." },
    { n:"02", ico:"💧", bg:"#E3F2FD", ac:"#1565C0", title:"منظومة أنشطة شرب الماء", desc:"نشاط تجريبي مذهل يُظهر كمية السوائل التي يفقدها الجسم في يوم صيفي في النقب وكيفية تعويضها." },
    { n:"03", ico:"⏳", bg:"#F3E5F5", ac:"#6A1B9A", title:"نشاط كبسولة الزمن", desc:"يكتب كل طالب رسالة لنفسه عن عاداته الصحية اليوم، ويفتحها في نهاية العام ليرى مدى التقدم." },
    { n:"04", ico:"📄", bg:"#FFF3E0", ac:"#E65100", title:"منشورات وجبات خفيفة صيفية صحية", desc:"صمّم الطلاب منشورات إبداعية بوصفات وجبات صحية من التراث البدوي ممزوجة بأفكار غذائية حديثة." },
    { n:"05", ico:"☀️", bg:"#FFF9C4", ac:"#F9A825", title:"عرض ذكي في الشمس", desc:"عرض توضيحي حي للحماية من الشمس: كريم الوقاية، القبعات، الملابس، ونصائح للنشاط الآمن خارجاً." },
    { n:"06", ico:"🚶", bg:"#FCE4EC", ac:"#AD1457", title:"ورشة الخروج من الروتين", desc:"تجربة أنشطة بدنية جديدة: يوغا، رقص دبكة، مشي نوردي — حتى المنكبّ على الكتب يخرج للحركة!" },
  ],
  he: [
    { n:"01", ico:"🥗", bg:"#E8F5E9", ac:"#2E7D32", title:"פוט לשמירה על תזונה נכונה", desc:"דוכן אינטראקטיבי בו תלמידים לומדים על פירמידת המזון ומקבלים כרטיס מרשם בריא שבועי." },
    { n:"02", ico:"💧", bg:"#E3F2FD", ac:"#1565C0", title:"מערך פעילות — שתיית מים", desc:"פעילות חווייתית מרתקת המדגימה כמה נוזלים הגוף מאבד ביום קיץ בנגב וכיצד לשמור על הידרציה." },
    { n:"03", ico:"⏳", bg:"#F3E5F5", ac:"#6A1B9A", title:"פעילות קפסולת זמן", desc:"כל תלמיד כותב לעצמו מכתב על הרגלי הבריאות היום ויפתח בסוף השנה לראות את ההתקדמות." },
    { n:"04", ico:"📄", bg:"#FFF3E0", ac:"#E65100", title:"פלייירים — נשנושי קיץ בריאים", desc:"תלמידים עיצבו עלונים מקוריים עם מתכוני חטיפים בריאים מהמסורת הבדואית לצד חידושים בריאים." },
    { n:"05", ico:"☀️", bg:"#FFF9C4", ac:"#F9A825", title:"מצגת חכם בשמש", desc:"הדגמה חיה: קרם הגנה, כובעים, בגדים מתאימים — טיפים מעשיים לפעילות חוץ בטוחה בנגב." },
    { n:"06", ico:"🚶", bg:"#FCE4EC", ac:"#AD1457", title:"סדנת יוצאים מהשגרה", desc:"התנסות בפעילויות גופניות חדשות: יוגה, ריקוד, הליכה נורדית — גם מי שרגיל לשבת יוצא לנוע!" },
  ],
};

/* ============================================================
   GALLERY
   ============================================================ */
const GALLERY = [
  { img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&q=80",  cap:{ar:"خضروات طازجة غنية بالفيتامينات",he:"ירקות טריים עשירים בויטמינים"}, cls:"wide" },
  { img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&q=80",  cap:{ar:"نشاط بدني يومي — أساس الصحة",he:"פעילות גופנית יומית — בסיס הבריאות"}, cls:"tall" },
  { img:"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&q=80",  cap:{ar:"طعام صحي متوازن ومغذٍّ",he:"אוכל בריא מאוזן ומזין"}, cls:"" },
  { img:"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&auto=format&q=80",  cap:{ar:"الماء — مصدر الحياة في الصحراء",he:"מים — מקור החיים במדבר"}, cls:"" },
  { img:"https://images.unsplash.com/photo-1544025162-d76538b2a5e7?w=800&auto=format&q=80",  cap:{ar:"مائدة البحر المتوسط الصحية",he:"שולחן ים תיכוני בריא"}, cls:"wide" },
  { img:"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&q=80",  cap:{ar:"التمرين يبني الجسم والعقل",he:"אימון בונה גוף ונפש"}, cls:"" },
];

/* ============================================================
   COMPETITION TIPS
   ============================================================ */
const TIPS = {
  ar: [
    { n:"01", t:"توثيق شامل واحترافي",           d:"صوّروا وسجّلوا كل نشاط. ملف غني بالصور والمقاطع يُبهج المحكّمين أكثر من أي شيء آخر." },
    { n:"02", t:"انخراط المجتمع الكامل",          d:"ادعوا الآباء والأجداد وأصحاب المشاريع للمشاركة — حين ينخرط المجتمع، يحيا المشروع." },
    { n:"03", t:"قياس الأثر الحقيقي",             d:"تتبّعوا مؤشرات BMI والعادات الصحية قبل المشروع وبعده. الأرقام المُثبتة تفوز." },
    { n:"04", t:"دمج الثقافة البدوية الأصيلة",   d:"الأطعمة التقليدية والدبكة والأعشاب الطبية — التراث البدوي هو حلّ صحي موجود منذ قرون." },
    { n:"05", t:"سفراء صحة من الطلاب",           d:"طلاب متميزون يُعلّمون زملاءهم — التعليم بين الأقران أكثر فاعلية من المحاضرات." },
    { n:"06", t:"شراكة مع متخصصين",              d:"أطباء ومغذّون وعلماء نفس — الخبراء يضيفون مصداقية وعمقاً مهنياً للمشروع." },
    { n:"07", t:"حديقة خضروات مدرسية",           d:"الطلاب الذين زرعوا طعامهم يأكلونه بشوق — ويفهمون فعلاً من أين يأتي." },
    { n:"08", t:"حضور رقمي مؤثر",               d:"موقع إلكتروني كهذا + إنستجرام + مقاطع تيك توك بتحديات صحية = حضور رقمي استثنائي." },
    { n:"09", t:"معرض صحي مجتمعي",              d:"فعّالية كبرى مفتوحة للمجتمع: فحوصات، طبخ صحي، أنشطة — حدث لا يُنسى." },
    { n:"10", t:"عرض ختامي مبهر",               d:"بيانات + فيديو + شهادات طلاب + خطة مستقبل — المحكّمون يريدون رؤية الأثر والمستقبل." },
  ],
  he: [
    { n:"01", t:"תיעוד מקיף ומקצועי",           d:"צלמו, הקליטו ותעדו כל פעילות. ספר עשיר בתמונות וסרטונים מרשים שופטים יותר מכל." },
    { n:"02", t:"מעורבות קהילתית מלאה",         d:"הזמינו הורים, סבים ובעלי עסקים — כשהקהילה מעורבת הפרויקט חי ובועט." },
    { n:"03", t:"מדידת השפעה אמיתית",           d:"עקבו אחר BMI והרגלים בתחילת ובסוף השנה. תוצאות מספריות מוכחות — זה מנצח." },
    { n:"04", t:"שילוב התרבות הבדואית האותנטית", d:"מאכלים מסורתיים, ריקוד דבקה, צמחי מרפא — המורשת הבדואית כפתרון בריאותי עתיק." },
    { n:"05", t:"שגרירי בריאות מתלמידים",       d:"תלמידים מצטיינים שמלמדים חבריהם — חינוך עמיתים יותר אפקטיבי מהרצאות." },
    { n:"06", t:"שותפות עם מומחים",             d:"רופאים, דיאטנים, פסיכולוגים — שיתוף מומחים מוסיף אמינות ועומק מקצועי." },
    { n:"07", t:"גינת ירקות בית-ספרית",        d:"תלמידים שגידלו את האוכל שלהם אוכלים אותו בשמחה — ומבינים מאיפה הגיע." },
    { n:"08", t:"נוכחות דיגיטלית חזקה",        d:"אתר כזה + אינסטגרם + טיקטוק עם אתגרי בריאות = נוכחות דיגיטלית מרשימה." },
    { n:"09", t:"יריד בריאות קהילתי",          d:"אירוע פתוח לכולם: בדיקות, בישול בריא, פעילויות — אירוע גדול שלא ישכח." },
    { n:"10", t:"מצגת סיום מרשימה",           d:"נתונים + סרטון + עדויות + תוכנית המשך — שופטים רוצים לראות השפעה ועתיד." },
  ],
};

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const TESTIMONIALS = {
  ar: [
    { q:"استخدمت حاسبة BMI وتعلمت الكثير عن صحتي. قررت أن آكل المزيد من الخضروات وأشرب 8 أكواب من الماء يومياً!", name:"أحمد م.", role:"طالب، الصف العاشر", emo:"🧑‍🎓" },
    { q:"المشروع غيّر نظرتي للتغذية. لم أكن أعرف أن مجدرتنا التقليدية وحمصنا أصحّ من كثير من الأطعمة الحديثة!", name:"مريم ع.", role:"طالبة، الصف التاسع", emo:"👩‍🎓" },
    { q:"نشاط كبسولة الزمن كان رائعاً جداً. كتبت أهدافاً صحية لنفسي وأنا متحمسة جداً لقراءتها في نهاية السنة.", name:"رنا س.", role:"طالبة، الصف الحادي عشر", emo:"🌟" },
  ],
  he: [
    { q:"השתמשתי במחשבון ה-BMI ולמדתי המון על הבריאות שלי. החלטתי לאכול יותר ירקות ולשתות 8 כוסות מים ביום!", name:"אחמד מ.", role:"תלמיד, כיתה י", emo:"🧑‍🎓" },
    { q:"הפרויקט שינה את ההסתכלות שלי על תזונה. לא ידעתי שמוג'דרה וחומוס בריאים יותר מהרבה אוכל מודרני!", name:"מרים ע.", role:"תלמידה, כיתה ט", emo:"👩‍🎓" },
    { q:"פעילות קפסולת הזמן הייתה מדהימה. כתבתי לעצמי יעדים בריאותיים ואני נרגשת לקרוא אותם בסוף השנה.", name:"ראנא ס.", role:"תלמידה, כיתה יא", emo:"🌟" },
  ],
};

/* ============================================================
   PEDIATRIC BMI TABLES (CDC approximation)  [p5, p85, p95]
   ============================================================ */
const PERC = {
  male:   { 2:[14.7,17.0,17.8],3:[14.0,17.0,17.9],4:[13.6,17.2,18.2],5:[13.4,17.4,18.7],6:[13.4,17.7,19.3],7:[13.6,18.2,20.1],8:[13.9,18.9,21.0],9:[14.2,19.8,22.1],10:[14.5,20.8,23.3],11:[15.0,21.7,24.5],12:[15.5,22.6,25.7],13:[16.1,23.4,26.8],14:[16.7,24.2,27.7],15:[17.2,24.8,28.4],16:[17.7,25.3,29.0],17:[18.1,25.7,29.4],18:[18.5,26.0,29.7] },
  female: { 2:[14.5,17.1,18.0],3:[13.7,17.0,18.1],4:[13.3,17.2,18.5],5:[13.2,17.5,19.0],6:[13.2,17.9,19.7],7:[13.4,18.6,20.7],8:[13.7,19.4,21.9],9:[14.1,20.3,23.1],10:[14.6,21.3,24.4],11:[15.2,22.2,25.5],12:[15.8,23.0,26.4],13:[16.4,23.6,27.1],14:[16.9,24.1,27.6],15:[17.3,24.4,27.9],16:[17.6,24.6,28.1],17:[17.9,24.8,28.3],18:[18.2,25.0,28.5] },
};

const RESULTS = {
  ar: {
    underweight:{ label:"نقص الوزن",  color:"#3498db", recs:["زِد حجم وجباتك تدريجياً","تناوَل 3 وجبات + وجبتين خفيفتين يومياً","أضِف مكسرات وأفوكادو وأطعمة غنية بالطاقة الصحية","تحدَّث مع طبيب لمعرفة السبب","مارِس الرياضة لتقوية العضلات"] },
    normal:     { label:"وزن طبيعي",  color:"#27ae60", recs:["أحسنت! حافظ على هذا المستوى الرائع","5 حصص خضار وفواكه يومياً على الأقل","8 أكواب ماء يومياً","60 دقيقة نشاط بدني يومياً","حدِّد وقت الشاشات بساعتين متواصلتين"] },
    overweight: { label:"زيادة وزن", color:"#f39c12", recs:["قلِّل حجم الوجبات تدريجياً — لا تجوّع نفسك!","استبدِل المشروبات المحلاة بالماء","60–90 دقيقة نشاط بدني يومياً","قلِّل الوجبات السريعة والمصنعة","اشرِك والداً أو طبيباً في خطة مخصصة"] },
    obese:      { label:"سمنة",       color:"#e74c3c", recs:["راجِع الطبيب لفحص شامل وخطة علاجية","احتفظ بمذكرة يومية للأكل والنشاط","قلِّل السكر والدهون المشبعة","ابدأ بالمشي اليومي وزِد المدة تدريجياً","اكسَب دعم أسرتك — التغيير رحلة مشتركة"] },
  },
  he: {
    underweight:{ label:"תת-משקל",   color:"#3498db", recs:["הגדל את גודל המנות בהדרגה","אכול 3 ארוחות + 2 חטיפים בריאים ביום","כלול אגוזים, אבוקדו ומזונות עתירי קלוריות בריאות","פנה לרופא לאבחון","עשה פעילות גופנית לחיזוק שרירים"] },
    normal:     { label:"משקל תקין", color:"#27ae60", recs:["כל הכבוד! המשך לשמור על הרגלים טובים","5 מנות ירקות ופירות ביום","8 כוסות מים ביום","60 דקות פעילות גופנית ביום","הגבל זמן מסך לשעתיים ברצף"] },
    overweight: { label:"עודף משקל", color:"#f39c12", recs:["הפחת מנות בהדרגה — אל תרעב!","החלף משקאות ממותקים במים","60–90 דקות פעילות ביום","הגבל מזון מהיר ומעובד","שתף הורה או רופא לתוכנית אישית"] },
    obese:      { label:"השמנה",     color:"#e74c3c", recs:["פנה לרופא לבדיקה מקיפה","שמור יומן אכילה ופעילות","הפחת סוכר ושומן רוויה","התחל בהליכה יומית והגבר בהדרגה","גייס תמיכת המשפחה — שינוי הוא מסע משפחתי"] },
  },
};

/* ============================================================
   STATE
   ============================================================ */
let lang = localStorage.getItem("ortbari_lang") || "ar";

/* ============================================================
   PRELOADER
   ============================================================ */
(function initPreloader() {
  const fill = document.getElementById("plFill");
  const pl   = document.getElementById("preloader");
  let w = 0;
  const iv = setInterval(() => {
    w += Math.random() * 18 + 4;
    if (w >= 100) { w = 100; clearInterval(iv); }
    fill.style.width = w + "%";
    if (w === 100) setTimeout(() => pl.classList.add("done"), 300);
  }, 80);
})();

/* ============================================================
   SCROLL: progress bar + back-to-top + header shadow
   ============================================================ */
const scrollProg = document.getElementById("scrollProg");
const bttBtn     = document.getElementById("bttBtn");
const hdr        = document.getElementById("hdr");

window.addEventListener("scroll", () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollProg.style.width = pct + "%";
  bttBtn.classList.toggle("visible", window.scrollY > 400);
  hdr.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

bttBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ============================================================
   MOBILE MENU
   ============================================================ */
const burger = document.getElementById("burger");
const mNav   = document.getElementById("mNav");
burger.addEventListener("click", () => {
  const open = mNav.classList.toggle("open");
  burger.classList.toggle("open", open);
});
mNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mNav.classList.remove("open"); burger.classList.remove("open");
}));

/* ============================================================
   LANGUAGE SWITCH
   ============================================================ */
function applyLang() {
  const c = CONTENT[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir  = "rtl";
  document.body.className = "lang-" + lang;
  document.title = c.pageTitle;
  document.getElementById("langLabel").textContent = c.langLabel;

  document.querySelectorAll("[data-key]").forEach(el => {
    const v = c[el.dataset.key];
    if (v !== undefined) el.textContent = v;
  });

  // Update gender select options
  document.querySelectorAll("#gender option[data-key]").forEach(opt => {
    const v = c[opt.dataset.key];
    if (v) opt.textContent = v;
  });

  renderArticles();
  renderActivities();
  renderGallery();
  renderTips();
  renderTestimonials();
}

document.getElementById("langBtn").addEventListener("click", () => {
  lang = lang === "ar" ? "he" : "ar";
  localStorage.setItem("ortbari_lang", lang);
  applyLang();
});

/* ============================================================
   AOS (scroll-triggered animations)
   ============================================================ */
function initAOS() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("aos-in"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-aos]").forEach(el => obs.observe(el));
}

/* ============================================================
   STATS COUNTER
   ============================================================ */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const to  = +el.dataset.to;
      const sfx = el.dataset.sfx || "";
      let cur = 0;
      const step = to / 50;
      const iv = setInterval(() => {
        cur = Math.min(cur + step, to);
        el.textContent = Math.round(cur) + sfx;
        if (cur >= to) clearInterval(iv);
      }, 30);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".st-n[data-to]").forEach(el => obs.observe(el));
}

/* ============================================================
   BMI CALCULATOR
   ============================================================ */
function getBmiCat(bmi, age, gender) {
  if (age >= 19) {
    if (bmi < 18.5) return "underweight";
    if (bmi < 25)   return "normal";
    if (bmi < 30)   return "overweight";
    return "obese";
  }
  const a  = Math.min(18, Math.max(2, Math.round(age)));
  const gk = gender === "female" ? "female" : "male";
  const [p5, p85, p95] = PERC[gk][a];
  if (bmi < p5)  return "underweight";
  if (bmi < p85) return "normal";
  if (bmi < p95) return "overweight";
  return "obese";
}

function bmiPct(bmi) { return Math.min(97, Math.max(3, ((bmi - 12) / 28) * 100)); }
function bmiOffset(bmi) { const t = 465; return t - Math.min(1,(bmi-12)/28)*t; }

document.getElementById("bmiForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const c  = CONTENT[lang];
  const errEl = document.getElementById("bmiErr");
  errEl.textContent = "";

  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const age    = parseFloat(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;

  if (!weight || !height || !age) { errEl.textContent = c["bmi.errReq"]; return; }

  const bmi = weight / Math.pow(height / 100, 2);
  const cat = getBmiCat(bmi, age, gender);
  const res = RESULTS[lang][cat];

  document.getElementById("resEmpty").hidden  = true;
  document.getElementById("resFilled").hidden = false;

  document.getElementById("ringVal").textContent = bmi.toFixed(1);
  document.getElementById("ringVal").style.color  = res.color;
  const arc = document.getElementById("ringArc");
  arc.style.stroke            = res.color;
  arc.style.strokeDashoffset  = bmiOffset(bmi);

  const badge = document.getElementById("resBadge");
  badge.textContent       = res.label;
  badge.style.background  = res.color + "22";
  badge.style.color       = res.color;

  document.getElementById("meterPin").style.left = bmiPct(bmi) + "%";

  const childNote = age < 19 ? `<p class="rec-child">${c["bmi.childNote"]}</p>` : "";
  document.getElementById("recBox").innerHTML = `
    <h4>${c["bmi.recTitle"]}</h4>
    <ul class="rec-list">${res.recs.map(r => `<li>${r}</li>`).join("")}</ul>
    ${childNote}`;
});

/* ============================================================
   RENDER: ARTICLES
   ============================================================ */
function renderArticles() {
  const c    = CONTENT[lang];
  const list = ARTICLES[lang];
  document.getElementById("artGrid").innerHTML = list.map((a, i) => `
    <article class="art-card" data-aos>
      <a class="art-img-link" href="articles/${a.slug}.html">
        <div class="art-img-box">
          <img class="art-img" src="${a.img}" alt="${a.title}" loading="lazy"
               onerror="this.parentElement.style.background='${a.catBg}';this.style.display='none'">
          <div class="art-img-ov"></div>
          <div class="art-pill" style="background:${a.catBg};color:${a.catColor}">${a.cat}</div>
        </div>
      </a>
      <div class="art-body">
        <div class="art-title">${a.title}</div>
        <div class="art-sum">${a.sum}</div>
      </div>
      <div class="art-exp" id="ae${i}">${a.full}</div>
      <div class="art-foot">
        <button class="art-toggle" id="at${i}" onclick="toggleArt(${i})">
          <span id="atl${i}">${c["art.more"]}</span>
          <span class="art-arr">▼</span>
        </button>
        <a class="art-full-btn" href="articles/${a.slug}.html">${c["art.readFull"]} →</a>
      </div>
    </article>`).join("");
  initAOS();
}

function toggleArt(i) {
  const exp = document.getElementById("ae" + i);
  const btn = document.getElementById("at" + i);
  const lbl = document.getElementById("atl" + i);
  const c   = CONTENT[lang];
  const open = exp.classList.toggle("open");
  btn.classList.toggle("open", open);
  lbl.textContent = open ? c["art.less"] : c["art.more"];
}

/* ============================================================
   RENDER: ACTIVITIES
   ============================================================ */
function renderActivities() {
  document.getElementById("actGrid").innerHTML = ACTIVITIES[lang].map(a => `
    <div class="act-card" style="--ac:${a.ac}" data-aos>
      <div class="act-num">نشاط ${a.n}</div>
      <div class="act-ico" style="background:${a.bg}">${a.ico}</div>
      <div class="act-title">${a.title}</div>
      <div class="act-desc">${a.desc}</div>
    </div>`).join("");
  initAOS();
}

/* ============================================================
   RENDER: GALLERY
   ============================================================ */
function renderGallery() {
  document.getElementById("galGrid").innerHTML = GALLERY.map((g, i) => `
    <div class="gi ${g.cls}" onclick="openLightbox(${i})" data-aos>
      <img class="gi-img" src="${g.img}" alt="${g.cap[lang]}" loading="lazy"
           onerror="this.parentElement.style.background='#E3F2FD'">
      <div class="gi-ov"><span class="gi-cap">${g.cap[lang]}</span></div>
    </div>`).join("");

  if (!document.getElementById("lightbox")) {
    const lb = document.createElement("div");
    lb.id = "lightbox"; lb.className = "lightbox";
    lb.innerHTML = `<button class="lb-close" onclick="closeLightbox()">✕</button><img class="lb-img" id="lbImg" src="" alt="">`;
    lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
    document.body.appendChild(lb);
  }
  initAOS();
}

function openLightbox(i) {
  document.getElementById("lbImg").src = GALLERY[i].img.replace("w=500","w=1200").replace("w=800","w=1400");
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

/* ============================================================
   RENDER: TIPS
   ============================================================ */
function renderTips() {
  document.getElementById("tipsGrid").innerHTML = TIPS[lang].map(t => `
    <div class="tip-card" data-aos>
      <div class="tip-n">${t.n}</div>
      <div class="tip-t">${t.t}</div>
      <div class="tip-d">${t.d}</div>
    </div>`).join("");
  initAOS();
}

/* ============================================================
   RENDER: TESTIMONIALS
   ============================================================ */
let testIdx = 0;
let testTimer;

function renderTestimonials() {
  const list  = TESTIMONIALS[lang];
  const track = document.getElementById("testTrack");
  const dots  = document.getElementById("testDots");

  track.innerHTML = list.map(t => `
    <div class="test-slide">
      <div class="test-q">"</div>
      <div class="test-body">${t.q}</div>
      <div class="test-emo">${t.emo}</div>
      <div class="test-name">${t.name}</div>
      <div class="test-role">${t.role}</div>
    </div>`).join("");

  dots.innerHTML = list.map((_,i) => `
    <button class="test-dot${i===testIdx?" on":""}" onclick="goTest(${i})"></button>`).join("");

  gotoTest(testIdx);
  clearInterval(testTimer);
  testTimer = setInterval(() => goTest((testIdx + 1) % list.length), 5000);
}

function gotoTest(n) {
  testIdx = n;
  document.getElementById("testTrack").style.transform = `translateX(${lang==="ar"?n*100:-n*100}%)`;
  document.querySelectorAll(".test-dot").forEach((d,i) => d.classList.toggle("on", i===n));
}

function goTest(n) { gotoTest(n); clearInterval(testTimer); testTimer = setInterval(() => goTest((testIdx+1) % TESTIMONIALS[lang].length), 5000); }

/* ============================================================
   INIT
   ============================================================ */
document.getElementById("year").textContent = new Date().getFullYear();
applyLang();
initAOS();
initCounters();
