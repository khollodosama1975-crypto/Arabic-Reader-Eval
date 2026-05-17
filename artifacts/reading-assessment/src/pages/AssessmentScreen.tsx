import { useState, useEffect, useRef, useCallback } from "react";

const ARABIC_PARAGRAPH = [
  "ذَهَبَ", "الْوَلَدُ", "إِلَى", "الْمَدْرَسَةِ", "فِي", "الصَّبَاحِ",
  "الْبَاكِرِ،", "وَكَانَ", "يَحْمِلُ", "حَقِيبَتَهُ", "عَلَى", "كَتِفِهِ",
  "الأَيْمَنِ.", "سَلَّمَ", "عَلَى", "مُعَلِّمِهِ", "عِنْدَ", "الْبَابِ",
  "وَجَلَسَ", "فِي", "مَقْعَدِهِ.", "فَتَحَ", "كِتَابَهُ", "وَبَدَأَ",
  "يَقْرَأُ", "بِصَوْتٍ", "وَاضِحٍ.", "أَحَبَّ", "الطِّفْلُ", "الدِّرَاسَةَ",
  "وَكَانَ", "يَسْأَلُ", "عَنْ", "كُلِّ", "شَيْءٍ", "يُثِيرُ",
  "فُضُولَهُ.", "قَالَ", "الْمُعَلِّمُ:", "أَحْسَنْتَ", "يَا", "بُنَيَّ،",
  "أَنْتَ", "طَالِبٌ", "مُجْتَهِدٌ", "وَمُتَمَيِّزٌ.", "ابْتَسَمَ", "الطِّفْلُ",
  "وَشَكَرَ", "مُعَلِّمَهُ", "بِكُلِّ", "أَدَبٍ", "وَاحْتِرَامٍ.", "فِي",
  "نِهَايَةِ", "الْيَوْمِ", "رَجَعَ", "إِلَى", "بَيْتِهِ", "مَسْرُورًا.",
];

const TOTAL_WORDS = ARABIC_PARAGRAPH.length;
const DURATION = 60;

type Phase = "ready" | "running" | "done";

interface AssessmentScreenProps {
  studentName: string;
  onFinish: (elapsed: number, mistakes: number) => void;
}

export default function AssessmentScreen({ studentName, onFinish }: AssessmentScreenProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [elapsed, setElapsed] = useState(0);
  const [errorWords, setErrorWords] = useState<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const stopTimer = useCallback((finalElapsed: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onFinish(finalElapsed, errorWords.size);
  }, [errorWords, onFinish]);

  useEffect(() => {
    if (phase === "running") {
      startTimeRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const passedSeconds = Math.floor((now - startTimeRef.current) / 1000);
        const remaining = DURATION - passedSeconds;
        if (remaining <= 0) {
          setTimeLeft(0);
          setElapsed(DURATION);
          setPhase("done");
          if (intervalRef.current) clearInterval(intervalRef.current);
          onFinish(DURATION, errorWords.size);
        } else {
          setTimeLeft(remaining);
          setElapsed(passedSeconds);
        }
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  function handleStart() {
    setPhase("running");
    setTimeLeft(DURATION);
    setElapsed(0);
    setErrorWords(new Set());
  }

  function handleStop() {
    const now = Date.now();
    const passedSeconds = Math.min(DURATION, Math.floor((now - startTimeRef.current) / 1000));
    setPhase("done");
    stopTimer(passedSeconds);
  }

  function toggleWord(index: number) {
    if (phase !== "running") return;
    setErrorWords((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  const timerWarning = timeLeft <= 10 && phase === "running";
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = ((DURATION - timeLeft) / DURATION) * 100;

  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="min-h-screen p-4 pb-8"
      style={{ background: "linear-gradient(135deg, hsl(221 83% 96%) 0%, hsl(210 40% 97%) 50%, hsl(221 83% 93%) 100%)" }}
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: "hsl(215 20% 55%)" }}>الطالب</p>
            <h2 className="text-lg font-bold" style={{ color: "hsl(222 47% 15%)" }}>{studentName}</h2>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium mb-0.5" style={{ color: "hsl(215 20% 55%)" }}>عدد الكلمات</p>
            <p className="text-lg font-bold" style={{ color: "hsl(222 47% 15%)" }}>{TOTAL_WORDS}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium mb-0.5" style={{ color: "hsl(215 20% 55%)" }}>الأخطاء</p>
            <p className="text-lg font-bold" style={{ color: errorWords.size > 0 ? "hsl(0 84% 50%)" : "hsl(142 71% 45%)" }}>
              {errorWords.size}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <svg width="110" height="110" className="rotate-[-90deg]">
              <circle cx="55" cy="55" r="44" fill="none" stroke="hsl(214 32% 88%)" strokeWidth="8" />
              <circle
                cx="55" cy="55" r="44"
                fill="none"
                stroke={timerWarning ? "hsl(0 84% 55%)" : "hsl(221 83% 53%)"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.3s ease, stroke 0.3s ease" }}
              />
            </svg>
            <div className={`absolute flex flex-col items-center ${timerWarning ? "timer-warning" : ""}`}>
              <span
                className="text-2xl font-bold tabular-nums"
                style={{ color: timerWarning ? "hsl(0 84% 50%)" : "hsl(222 47% 15%)", fontFamily: "monospace" }}
              >
                {timerDisplay}
              </span>
              <span className="text-xs font-medium" style={{ color: "hsl(215 20% 55%)" }}>ثانية</span>
            </div>
          </div>
        </div>

        {/* Paragraph Card */}
        <div
          className="rounded-2xl p-6 mb-6 shadow-md"
          style={{ background: "white", border: "1px solid hsl(214 32% 88%)" }}
        >
          {phase === "ready" && (
            <p className="text-center text-sm font-medium mb-4 py-2 rounded-xl" style={{ color: "hsl(221 83% 53%)", background: "hsl(221 83% 53% / 0.08)" }}>
              اضغط زر "ابدأ" ثم انقر على الكلمات التي يخطئ فيها الطالب
            </p>
          )}
          {phase === "running" && (
            <p className="text-center text-sm font-medium mb-4 py-2 rounded-xl" style={{ color: "hsl(0 84% 50%)", background: "hsl(0 84% 50% / 0.07)" }}>
              انقر على الكلمة عند الخطأ — ستتحول إلى اللون الأحمر
            </p>
          )}
          {phase === "done" && (
            <p className="text-center text-sm font-medium mb-4 py-2 rounded-xl" style={{ color: "hsl(142 71% 35%)", background: "hsl(142 71% 45% / 0.08)" }}>
              انتهى الاختبار
            </p>
          )}

          <div className="text-right leading-loose" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {ARABIC_PARAGRAPH.map((word, index) => (
              <span
                key={index}
                onClick={() => toggleWord(index)}
                className={`word-btn text-xl font-semibold ${errorWords.has(index) ? "word-error" : ""} ${phase !== "running" ? "word-disabled" : ""}`}
                style={{ fontFamily: "'Cairo', sans-serif" }}
                title={phase === "running" ? "انقر لتحديد خطأ" : ""}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          {phase === "ready" && (
            <button
              onClick={handleStart}
              className="px-10 py-3.5 rounded-xl text-base font-bold transition-all duration-150 active:scale-95"
              style={{
                background: "hsl(142 71% 45%)",
                color: "white",
                boxShadow: "0 4px 14px hsl(142 71% 45% / 0.35)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(142 71% 38%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(142 71% 45%)")}
            >
              ابدأ
            </button>
          )}
          {phase === "running" && (
            <button
              onClick={handleStop}
              className="px-10 py-3.5 rounded-xl text-base font-bold transition-all duration-150 active:scale-95"
              style={{
                background: "hsl(0 84% 60%)",
                color: "white",
                boxShadow: "0 4px 14px hsl(0 84% 60% / 0.35)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0 84% 52%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0 84% 60%)")}
            >
              إيقاف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
