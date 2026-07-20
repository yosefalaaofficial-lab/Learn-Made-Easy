import React, { useState, useRef, useEffect } from "react";
import {
  Play, Pause, Radio, ChevronLeft, ChevronRight, Check, X,
  Headphones, MessageCircle, ListMusic, SkipForward, RotateCcw, Volume2
} from "lucide-react";

/* ---------------------------------------------------------
   البيانات
--------------------------------------------------------- */

const LEVELS = [
  { id: "pre-a1", label: "Pre-A1", ar: "البداية", freq: "88.1", desc: "الحروف والأصوات" },
  { id: "a1",     label: "A1",     ar: "مبتدئ",   freq: "92.3", desc: "جمل بسيطة يومية" },
  { id: "a2",     label: "A2",     ar: "أساسي",   freq: "96.5", desc: "مواقف الحياة اليومية" },
  { id: "b1",     label: "B1",     ar: "متوسط",   freq: "100.7", desc: "حوارات وأفكار متصلة" },
  { id: "b2",     label: "B2",     ar: "متوسط عالي", freq: "104.9", desc: "نقاش وتفاصيل دقيقة" },
  { id: "c1",     label: "C1",     ar: "متقدم",   freq: "109.1", desc: "طلاقة شبه كاملة" },
];

const QUESTIONS = [
  { levelIdx: 0, q: "الحرف اللي بييجي بعد B في الأبجدية الإنجليزية؟", options: ["A", "C", "D", "F"], correct: 1 },
  { levelIdx: 1, q: "اختار الترجمة الصح لكلمة: كتاب", options: ["Book", "Table", "Chair", "Pen"], correct: 0 },
  { levelIdx: 1, q: "I ___ a student.", options: ["is", "are", "am", "be"], correct: 2 },
  { levelIdx: 2, q: "اختار الجملة الصح: كل يوم بروح الشغل بالأتوبيس", options: ["I go to work by bus every day.", "I going work bus every day.", "I goes to work in bus.", "I go work by the bus everyday."], correct: 0 },
  { levelIdx: 2, q: "She ___ to the market yesterday.", options: ["go", "goes", "went", "going"], correct: 2 },
  { levelIdx: 3, q: "I ___ this movie before.", options: ["saw", "see", "have seen", "seeing"], correct: 2 },
  { levelIdx: 3, q: "المرادف الأقرب لكلمة difficult:", options: ["easy", "hard", "fast", "cheap"], correct: 1 },
  { levelIdx: 4, q: "If I ___ more time, I would travel more.", options: ["have", "has", "had", "having"], correct: 2 },
  { levelIdx: 4, q: "The meeting was put ___ until next week.", options: ["off", "on", "up", "in"], correct: 0 },
  { levelIdx: 5, q: "اختار الصياغة الأكثر رسمية ودقة:", options: ["Gonna need that report ASAP, k?", "I would appreciate it if you could send the report at your earliest convenience.", "Send report now pls.", "Report - send - fast - thanks."], correct: 1 },
];

const EPISODES = {
  "pre-a1": [
    { id: "pa1-1", title: "الحروف بتتنطق إزاي", en: "A, B, C, D, E, F, G. Listen and repeat each letter slowly.", ar: "الحلقة دي بتسمعك كل حرف من الأبجدية الإنجليزية لوحده مع نطقه الصح، وده أول خطوة قبل ما تبدأ تقرا أي كلمة.", dur: "٤ دقايق" },
    { id: "pa1-2", title: "أول كلمات في حياتك", en: "Hello. My name is Sara. This is a cat. This is a book.", ar: "هنا بنبدأ بأبسط الكلمات والجمل اللي هتستخدمها كل يوم، زي التحية وتعريف نفسك.", dur: "٥ دقايق" },
  ],
  "a1": [
    { id: "a1-1", title: "أعرّف نفسي بالإنجليزي", en: "Hi, I am Omar. I am from Egypt. I am twenty years old. I like football.", ar: "شرح لتركيب جملة التعريف بالنفس: الاسم، البلد، السن، والهوايات، وأزاي تستخدم فعل to be بشكل صحيح.", dur: "٦ دقايق" },
    { id: "a1-2", title: "في المطعم", en: "Can I have a coffee, please? How much is it? Thank you very much.", ar: "جمل جاهزة تستخدمها في أي مطعم أو كافيه، مع شرح لأسلوب الطلب المهذب باستخدام can I have.", dur: "٦ دقايق" },
  ],
  "a2": [
    { id: "a2-1", title: "يوم في حياتي", en: "I wake up at seven. I have breakfast and go to work by bus. In the evening, I watch TV with my family.", ar: "شرح المضارع البسيط لوصف الروتين اليومي، وأدوات الزمن زي always, usually, in the evening.", dur: "٧ دقايق" },
    { id: "a2-2", title: "حجز رحلة", en: "I would like to book a ticket to Cairo. What time does the train leave? Is there a discount for students?", ar: "مفردات وجمل السفر والحجز، مع شرح استخدام would like كصيغة مهذبة للطلب.", dur: "٧ دقايق" },
  ],
  "b1": [
    { id: "b1-1", title: "حكاية حصلت زمان", en: "Last summer, I traveled to Alexandria. I had never seen the sea before, so it was an amazing experience.", ar: "شرح للفرق بين الماضي البسيط والـ past perfect لما بنحكي قصة فيها أحداث قبل بعض.", dur: "٨ دقايق" },
    { id: "b1-2", title: "رأيك في حاجة", en: "In my opinion, working from home is better because you save time and feel more relaxed.", ar: "أدوات إبداء الرأي زي in my opinion و I believe، وأزاي تبني حجة بسيطة لرأيك.", dur: "٨ دقايق" },
  ],
  "b2": [
    { id: "b2-1", title: "نقاش: التكنولوجيا والتعليم", en: "Although technology has made learning more accessible, some argue it has reduced students' attention spans.", ar: "شرح جمل الـ although و contrast في النقاش الأكاديمي، وأزاي توازن بين رأيين مختلفين.", dur: "٩ دقايق" },
    { id: "b2-2", title: "مقابلة شغل", en: "Could you tell me about a challenge you faced at work and how you handled it?", ar: "أسئلة مقابلات الشغل الشائعة وأزاي تجاوب عليها بثقة باستخدام صيغة الخبرة السابقة.", dur: "٩ دقايق" },
  ],
  "c1": [
    { id: "c1-1", title: "تحليل مقال رأي", en: "The proliferation of remote work has fundamentally reshaped our assumptions about productivity and presence.", ar: "مفردات متقدمة وتراكيب رسمية بتتستخدم في المقالات والتحليلات، مع تفكيك للجملة المركبة.", dur: "١٠ دقايق" },
    { id: "c1-2", title: "دبلوماسية في الكلام", en: "While I understand your position, I would gently push back on the assumption that this is the only viable option.", ar: "أسلوب الاعتراض المهذب والدبلوماسي في النقاشات الرسمية، وهو من أصعب مهارات مستوى C1.", dur: "١٠ دقايق" },
  ],
};

const LISTENING = {
  "pre-a1": { en: "Cat. Dog. Sun. Book.", q: "إيه هو صوت الحرف الأول في كلمة Dog؟", options: ["د", "ب", "س", "ك"], correct: 0 },
  "a1": { en: "This is my family. My mother is a teacher. My father is a doctor.", q: "مهنة الأب في المقطع إيه؟", options: ["مدرس", "دكتور", "مهندس", "طبيب أسنان"], correct: 1 },
  "a2": { en: "The weather today is sunny but a bit cold. Tomorrow it will rain in the morning.", q: "الجو بكرة هيكون إزاي الصبح؟", options: ["مشمس", "هيتلج", "هيمطر", "هادي"], correct: 2 },
  "b1": { en: "The new metro line will reduce travel time between the two cities by almost forty minutes.", q: "الخط الجديد هيقلل الوقت بكام دقيقة تقريبًا؟", options: ["عشرين", "ثلاثين", "أربعين", "ستين"], correct: 2 },
  "b2": { en: "Critics argue that the policy, while well-intentioned, fails to address the root causes of the housing shortage.", q: "النقاد بيقولوا إن السياسة دي...", options: ["حلت المشكلة تمامًا", "معالجاش السبب الحقيقي", "غير أخلاقية", "مش موجودة أصلًا"], correct: 1 },
  "c1": { en: "Despite the committee's reservations, the proposal was approved on the grounds that delaying it further would be more costly.", q: "اتوافق على المقترح ليه؟", options: ["لأن اللجنة موافقة تمامًا", "لأن التأخير هيكلف أكتر", "لأنه رخيص", "لأن مفيش بديل"], correct: 1 },
};

const CONVERSATION = {
  "pre-a1": [["Yes.", "أيوة"], ["No.", "لأ"], ["Hi!", "أهلاً"]],
  "a1": [["How are you?", "إزيك؟"], ["I'm fine, thanks.", "أنا كويس، شكرًا"], ["See you later.", "أشوفك بعدين"]],
  "a2": [["Could you help me, please?", "ممكن تساعدني؟"], ["I'm not sure about that.", "مش متأكد من ده"], ["What do you mean?", "تقصد إيه؟"]],
  "b1": [["I see your point, but...", "فاهم وجهة نظرك، بس..."], ["Let's find a middle ground.", "يلا نلاقي حل وسط"], ["That makes sense.", "ده منطقي"]],
  "b2": [["I'd like to build on what you said.", "حابب أكمّل على اللي قلته"], ["That's a fair point, however...", "ده كلام مظبوط، لكن..."], ["Let's circle back to this later.", "خلينا نرجعلها تاني بعدين"]],
  "c1": [["I take your point, though I'd frame it differently.", "فاهمك، بس أنا هحطها بشكل مختلف شوية"], ["With respect, I have to disagree.", "مع كل احترامي، مش متفق"], ["That's a nuanced issue worth unpacking.", "دي قضية معقدة تستاهل نتناقش فيها بالتفصيل"]],
};

/* ---------------------------------------------------------
   أدوات مساعدة
--------------------------------------------------------- */

function speak(text, lang, onEnd) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.95;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}
function stopSpeak() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function PlayButton({ id, text, lang = "en-US", playingId, setPlayingId, size = "md" }) {
  const isPlaying = playingId === id;
  const dim = size === "sm" ? "w-8 h-8" : "w-11 h-11";
  return (
    <button
      onClick={() => {
        if (isPlaying) { stopSpeak(); setPlayingId(null); }
        else { setPlayingId(id); speak(text, lang, () => setPlayingId(null)); }
      }}
      className={`${dim} shrink-0 rounded-full flex items-center justify-center transition-all
        ${isPlaying ? "bg-amber-400 text-[#12232E] shadow-[0_0_18px_rgba(232,163,61,0.6)]" : "bg-white/10 text-amber-300 hover:bg-white/20"}`}
      aria-label="تشغيل"
    >
      {isPlaying ? <Pause size={size === "sm" ? 14 : 18} /> : <Play size={size === "sm" ? 14 : 18} className="mr-[-2px]" />}
    </button>
  );
}

/* ---------------------------------------------------------
   الشاشة الرئيسية
--------------------------------------------------------- */

export default function EnglishRadioApp() {
  const [view, setView] = useState("landing"); // landing | quiz | picker | dashboard
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [level, setLevel] = useState(null); // index into LEVELS
  const [tab, setTab] = useState("episodes"); // episodes | listening | conversation
  const [browseLevel, setBrowseLevel] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [listenAnswer, setListenAnswer] = useState({});

  useEffect(() => () => stopSpeak(), [view]);

  const activeLevelIdx = browseLevel !== null ? browseLevel : level;
  const activeLevel = activeLevelIdx !== null ? LEVELS[activeLevelIdx] : null;

  function computeLevel(finalAnswers) {
    let achieved = -1;
    for (let li = 0; li < LEVELS.length; li++) {
      const qs = QUESTIONS.map((q, i) => ({ ...q, i })).filter((q) => q.levelIdx === li);
      if (qs.length === 0) continue;
      const correctCount = qs.filter((q) => finalAnswers[q.i] === q.correct).length;
      const passed = correctCount >= Math.ceil(qs.length / 2);
      if (passed) achieved = li;
      else break;
    }
    return Math.max(achieved, 0);
  }

  function handleAnswer(optIdx) {
    setSelectedAnswer(optIdx);
    const next = [...answers];
    next[qIndex] = optIdx;
    setAnswers(next);
    setTimeout(() => {
      setSelectedAnswer(null);
      if (qIndex + 1 < QUESTIONS.length) {
        setQIndex(qIndex + 1);
      } else {
        const lvl = computeLevel(next);
        setLevel(lvl);
        setView("result");
      }
    }, 450);
  }

  const fonts = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
      .font-ar { font-family: 'Tajawal', sans-serif; }
      .font-mono-en { font-family: 'JetBrains Mono', monospace; }
    `}</style>
  );

  if (view === "landing") {
    return (
      <div dir="rtl" lang="ar" className="font-ar min-h-screen bg-[#12232E] text-[#F6EFE3] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        {fonts}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 50% 0%, #E8A33D, transparent 60%)" }} />
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
          <div className="flex items-center gap-2 text-amber-300 mb-6">
            <Radio size={22} />
            <span className="font-mono-en tracking-widest text-sm">ENGLISH RADIO</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            اتعلم إنجليزي زي ما تسمع محطة راديو
          </h1>
          <p className="text-[#F6EFE3]/70 text-lg mb-10 leading-relaxed">
            حلقات صوتية مسجّلة، من أول ما تتعلم الحروف لحد ما توصل لمستوى C1،
            مع مصادر استماع ومحادثة جنب كل حلقة.
          </p>

          <div className="w-full mb-10 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8">
            <div className="flex items-center justify-between font-mono-en text-xs text-amber-300/70 mb-3">
              <span>88.1</span><span>96.5</span><span>104.9</span><span>109.1</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 relative">
              <div className="absolute inset-y-0 right-0 w-full rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, #E8A33D33)" }} />
              <div className="absolute -top-1.5 right-2 w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(232,163,61,0.8)]" />
            </div>
            <p className="mt-4 text-sm text-[#F6EFE3]/50">هنظبط الترددّ على مستواك بعد اختبار قصير</p>
          </div>

          <button
            onClick={() => { setView("quiz"); setQIndex(0); setAnswers([]); }}
            className="w-full rounded-full bg-amber-400 text-[#12232E] font-bold py-4 text-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
          >
            ابدأ اختبار تحديد المستوى
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setView("picker")}
            className="mt-4 text-[#F6EFE3]/60 hover:text-[#F6EFE3] text-sm underline underline-offset-4 flex items-center gap-1"
          >
            <SkipForward size={14} />
            مش عايز تعمل اختبار؟ اختار مستواك بنفسك
          </button>
        </div>
      </div>
    );
  }

  if (view === "picker") {
    return (
      <div dir="rtl" lang="ar" className="font-ar min-h-screen bg-[#12232E] text-[#F6EFE3] px-6 py-14">
        {fonts}
        <div className="max-w-xl mx-auto">
          <button onClick={() => setView("landing")} className="text-amber-300 text-sm mb-8 flex items-center gap-1">
            <ChevronRight size={16} /> رجوع
          </button>
          <h2 className="text-2xl font-bold mb-1">اختار مستواك</h2>
          <p className="text-[#F6EFE3]/60 mb-8">تقدر تغيّره في أي وقت من الداشبورد</p>
          <div className="grid gap-3">
            {LEVELS.map((lv, i) => (
              <button
                key={lv.id}
                onClick={() => { setLevel(i); setBrowseLevel(null); setView("dashboard"); }}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-5 py-4 transition-colors text-right"
              >
                <div>
                  <div className="font-bold">{lv.ar}</div>
                  <div className="text-sm text-[#F6EFE3]/50">{lv.desc}</div>
                </div>
                <div className="font-mono-en text-amber-300 text-sm">{lv.label} · {lv.freq}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "quiz") {
    const q = QUESTIONS[qIndex];
    const progress = ((qIndex) / QUESTIONS.length) * 100;
    return (
      <div dir="rtl" lang="ar" className="font-ar min-h-screen bg-[#12232E] text-[#F6EFE3] px-6 py-14 flex flex-col">
        {fonts}
        <div className="max-w-xl w-full mx-auto flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2 font-mono-en text-xs text-[#F6EFE3]/50">
            <span>سؤال {qIndex + 1} / {QUESTIONS.length}</span>
            <span>{LEVELS[q.levelIdx].label}</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 mb-10">
            <div className="h-1 rounded-full bg-amber-400 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <h2 className="text-2xl font-bold mb-8 leading-relaxed">{q.q}</h2>

          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === q.correct;
              let style = "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]";
              if (selectedAnswer !== null && isSelected) {
                style = isCorrect ? "border-emerald-400 bg-emerald-400/10" : "border-rose-400 bg-rose-400/10";
              }
              return (
                <button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(i)}
                  className={`font-mono-en text-right rounded-xl border px-5 py-4 transition-colors flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isSelected && (isCorrect ? <Check size={18} className="text-emerald-400" /> : <X size={18} className="text-rose-400" />)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === "result" && level !== null) {
    const lv = LEVELS[level];
    return (
      <div dir="rtl" lang="ar" className="font-ar min-h-screen bg-[#12232E] text-[#F6EFE3] px-6 py-14 flex flex-col items-center justify-center text-center">
        {fonts}
        <Radio size={28} className="text-amber-300 mb-4" />
        <p className="text-[#F6EFE3]/60 mb-2">اتظبط الترددّ على</p>
        <div className="font-mono-en text-5xl font-bold text-amber-300 mb-2">{lv.freq}</div>
        <h2 className="text-3xl font-black mb-2">{lv.label} — {lv.ar}</h2>
        <p className="text-[#F6EFE3]/60 max-w-sm mb-10">{lv.desc}</p>
        <button
          onClick={() => setView("dashboard")}
          className="rounded-full bg-amber-400 text-[#12232E] font-bold px-10 py-4 hover:bg-amber-300 transition-colors"
        >
          يلا بينا نبدأ
        </button>
      </div>
    );
  }

  if (view === "dashboard" && activeLevel) {
    const episodes = EPISODES[activeLevel.id];
    const listening = LISTENING[activeLevel.id];
    const conversation = CONVERSATION[activeLevel.id];
    const userAnswer = listenAnswer[activeLevel.id];

    return (
      <div dir="rtl" lang="ar" className="font-ar min-h-screen bg-[#EFE6D8] text-[#12232E]">
        {fonts}
        <div className="bg-[#12232E] text-[#F6EFE3] px-6 pt-8 pb-6 rounded-b-3xl">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-amber-300">
                <Radio size={18} />
                <span className="font-mono-en text-xs tracking-widest">ENGLISH RADIO</span>
              </div>
              <button
                onClick={() => { setView("picker"); setBrowseLevel(null); }}
                className="text-xs text-[#F6EFE3]/60 hover:text-[#F6EFE3] flex items-center gap-1"
              >
                <RotateCcw size={12} /> غيّر مستواك
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#F6EFE3]/50 mb-1">مستواك الحالي</div>
                <div className="text-2xl font-black">{activeLevel.label} · {activeLevel.ar}</div>
              </div>
              <div className="font-mono-en text-3xl text-amber-300">{activeLevel.freq}</div>
            </div>
            <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
              {LEVELS.map((lv, i) => (
                <button
                  key={lv.id}
                  onClick={() => setBrowseLevel(i === level ? null : i)}
                  className={`shrink-0 font-mono-en text-xs px-3 py-1.5 rounded-full border transition-colors
                    ${activeLevelIdx === i ? "bg-amber-400 text-[#12232E] border-amber-400" : "border-white/15 text-[#F6EFE3]/60 hover:text-[#F6EFE3]"}`}
                >
                  {lv.label}
         