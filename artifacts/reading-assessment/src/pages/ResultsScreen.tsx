interface ResultsScreenProps {
  studentName: string;
  elapsed: number;
  mistakes: number;
  onReset: () => void;
}

function getRank(mistakes: number): { label: string; description: string; color: string; bg: string; icon: string } {
  if (mistakes <= 2) {
    return {
      label: "المركز الأول",
      description: "ممتاز — أداء رائع جداً",
      color: "hsl(142 71% 35%)",
      bg: "hsl(142 71% 45% / 0.10)",
      icon: "🥇",
    };
  } else if (mistakes <= 5) {
    return {
      label: "المركز الثاني",
      description: "جيد جداً — أداء جيد",
      color: "hsl(38 95% 40%)",
      bg: "hsl(38 95% 55% / 0.10)",
      icon: "🥈",
    };
  } else {
    return {
      label: "المركز الثالث",
      description: "مقبول — يحتاج إلى تدريب إضافي",
      color: "hsl(0 84% 50%)",
      bg: "hsl(0 84% 60% / 0.08)",
      icon: "🥉",
    };
  }
}

export default function ResultsScreen({ studentName, elapsed, mistakes, onReset }: ResultsScreenProps) {
  const rank = getRank(mistakes);
  const finishedEarly = elapsed < 60;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, hsl(221 83% 96%) 0%, hsl(210 40% 97%) 50%, hsl(221 83% 93%) 100%)" }}
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "hsl(222 47% 15%)" }}>نتيجة الاختبار</h1>
          <p className="text-base mt-1" style={{ color: "hsl(215 20% 55%)" }}>{studentName}</p>
        </div>

        {/* Rank Card */}
        <div
          className="rounded-2xl p-7 mb-4 text-center shadow-lg"
          style={{ background: rank.bg, border: `2px solid ${rank.color}30` }}
        >
          <div className="text-5xl mb-3">{rank.icon}</div>
          <h2 className="text-3xl font-black mb-1" style={{ color: rank.color }}>{rank.label}</h2>
          <p className="text-base font-semibold" style={{ color: rank.color }}>{rank.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Time */}
          <div
            className="rounded-2xl p-5 text-center shadow-sm"
            style={{ background: "white", border: "1px solid hsl(214 32% 88%)" }}
          >
            <div className="flex items-center justify-center mb-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(221 83% 53%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: "hsl(215 20% 55%)" }}>
              {finishedEarly ? "أنهى القراءة في" : "الوقت المستغرق"}
            </p>
            <p className="text-2xl font-black" style={{ color: "hsl(221 83% 53%)" }}>
              {elapsed}
            </p>
            <p className="text-xs font-medium" style={{ color: "hsl(215 20% 55%)" }}>ثانية</p>
            {finishedEarly && (
              <p className="text-xs mt-1.5 font-semibold" style={{ color: "hsl(142 71% 40%)" }}>
                أنهى قبل انتهاء الوقت
              </p>
            )}
          </div>

          {/* Mistakes */}
          <div
            className="rounded-2xl p-5 text-center shadow-sm"
            style={{ background: "white", border: "1px solid hsl(214 32% 88%)" }}
          >
            <div className="flex items-center justify-center mb-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(0 84% 55%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: "hsl(215 20% 55%)" }}>عدد الأخطاء</p>
            <p
              className="text-2xl font-black"
              style={{ color: mistakes === 0 ? "hsl(142 71% 40%)" : "hsl(0 84% 50%)" }}
            >
              {mistakes}
            </p>
            <p className="text-xs font-medium" style={{ color: "hsl(215 20% 55%)" }}>
              {mistakes === 0 ? "بدون أخطاء!" : mistakes === 1 ? "خطأ واحد" : `خطأ`}
            </p>
          </div>
        </div>

        {/* Rank legend */}
        <div
          className="rounded-2xl p-4 mb-6 shadow-sm"
          style={{ background: "white", border: "1px solid hsl(214 32% 88%)" }}
        >
          <p className="text-sm font-bold mb-3 text-center" style={{ color: "hsl(222 47% 20%)" }}>معيار التقييم</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold" style={{ color: "hsl(142 71% 35%)" }}>المركز الأول</span>
              <span style={{ color: "hsl(215 20% 50%)" }}>من 0 إلى 2 خطأ</span>
            </div>
            <div className="h-px" style={{ background: "hsl(214 32% 90%)" }} />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold" style={{ color: "hsl(38 95% 40%)" }}>المركز الثاني</span>
              <span style={{ color: "hsl(215 20% 50%)" }}>من 3 إلى 5 أخطاء</span>
            </div>
            <div className="h-px" style={{ background: "hsl(214 32% 90%)" }} />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold" style={{ color: "hsl(0 84% 50%)" }}>المركز الثالث</span>
              <span style={{ color: "hsl(215 20% 50%)" }}>أكثر من 5 أخطاء</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3.5 rounded-xl text-base font-bold transition-all duration-150 active:scale-95"
            style={{
              background: "hsl(221 83% 53%)",
              color: "white",
              boxShadow: "0 4px 14px hsl(221 83% 53% / 0.30)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(221 83% 46%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(221 83% 53%)")}
          >
            اختبار طالب جديد
          </button>
        </div>
      </div>
    </div>
  );
}
