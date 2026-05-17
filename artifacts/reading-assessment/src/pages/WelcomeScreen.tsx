import { useState } from "react";
import type { LeaderboardEntry } from "@/App";
import { sortLeaderboard } from "@/App";

interface WelcomeScreenProps {
  onStart: (name: string) => void;
  leaderboard: LeaderboardEntry[];
}

function getRankEmoji(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function WelcomeScreen({ onStart, leaderboard }: WelcomeScreenProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const sorted = sortLeaderboard(leaderboard);
  const top5 = sorted.slice(0, 5);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("يرجى إدخال اسم الطالب");
      return;
    }
    if (trimmed.split(/\s+/).length < 2) {
      setError("يرجى إدخال الاسم الرباعي كاملاً");
      return;
    }
    setError("");
    onStart(trimmed);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, hsl(221 83% 96%) 0%, hsl(210 40% 97%) 50%, hsl(221 83% 93%) 100%)" }}
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3"
            style={{ background: "hsl(221 83% 53%)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-0.5" style={{ color: "hsl(222 47% 15%)" }}>تقييم القراءة</h1>
          <p className="text-sm" style={{ color: "hsl(215 20% 50%)" }}>اختبار القراءة الجهرية — 46 كلمة / 60 ثانية</p>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl shadow-lg p-6 mb-4"
          style={{ background: "white", border: "1px solid hsl(214 32% 88%)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="student-name"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "hsl(222 47% 15%)" }}
              >
                اسم الطالب الرباعي
              </label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
                placeholder="مثال: محمد أحمد علي حسن"
                className="w-full text-right rounded-xl px-4 py-3 text-base outline-none transition-all"
                style={{
                  border: error ? "2px solid hsl(0 84% 60%)" : "2px solid hsl(214 32% 82%)",
                  fontFamily: "'Cairo', sans-serif",
                  color: "hsl(222 47% 15%)",
                  background: "hsl(210 40% 98%)",
                }}
                onFocus={(e) => { if (!error) e.target.style.border = "2px solid hsl(221 83% 53%)"; }}
                onBlur={(e) => { if (!error) e.target.style.border = "2px solid hsl(214 32% 82%)"; }}
                autoComplete="off"
                dir="rtl"
              />
              {error && (
                <p className="mt-1 text-xs font-medium" style={{ color: "hsl(0 84% 50%)" }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-base font-bold transition-all duration-150 active:scale-95"
              style={{ background: "hsl(221 83% 53%)", color: "white", boxShadow: "0 4px 14px hsl(221 83% 53% / 0.35)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(221 83% 46%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(221 83% 53%)")}
            >
              بدء الاختبار
            </button>
          </form>
        </div>

        {/* Leaderboard preview */}
        {top5.length > 0 && (
          <div
            className="rounded-2xl shadow-md overflow-hidden"
            style={{ background: "white", border: "1px solid hsl(214 32% 88%)" }}
          >
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "hsl(221 83% 53%)" }}>
              <span className="text-white text-sm">🏆</span>
              <h2 className="text-sm font-bold text-white">المتصدرون</h2>
            </div>
            <div className="divide-y" style={{ borderColor: "hsl(214 32% 91%)" }}>
              {top5.map((entry, idx) => {
                const rank = idx + 1;
                return (
                  <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-base w-7 text-center flex-shrink-0 font-bold" style={{ color: "hsl(215 20% 45%)" }}>
                      {getRankEmoji(rank)}
                    </span>
                    <span className="flex-1 text-sm font-semibold truncate" style={{ color: "hsl(222 47% 15%)" }}>
                      {entry.name}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: entry.mistakes === 0 ? "hsl(142 71% 45% / 0.12)" : "hsl(0 84% 60% / 0.10)",
                        color: entry.mistakes === 0 ? "hsl(142 71% 35%)" : "hsl(0 84% 45%)",
                      }}
                    >
                      {entry.mistakes} خطأ
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "hsl(221 83% 50%)" }}>
                      {entry.elapsed}ث
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {top5.length === 0 && (
          <p className="text-center text-xs mt-3" style={{ color: "hsl(215 20% 55%)" }}>
            المرحلة الابتدائية — ستظهر نتائج الطلاب هنا بعد الاختبار
          </p>
        )}
      </div>
    </div>
  );
}
