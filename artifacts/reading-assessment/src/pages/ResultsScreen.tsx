import type { LeaderboardEntry } from "@/App";
import { sortLeaderboard } from "@/App";

interface ResultsScreenProps {
  studentName: string;
  elapsed: number;
  mistakes: number;
  leaderboard: LeaderboardEntry[];
  currentEntryId: string;
  onReset: () => void;
  onClearLeaderboard: () => void;
}

function getRankBadge(rank: number) {
  if (rank === 1) return { emoji: "🥇", bg: "hsl(45 100% 51% / 0.15)", border: "hsl(45 100% 51%)", text: "hsl(36 100% 30%)" };
  if (rank === 2) return { emoji: "🥈", bg: "hsl(220 10% 75% / 0.20)", border: "hsl(220 10% 65%)", text: "hsl(220 10% 35%)" };
  if (rank === 3) return { emoji: "🥉", bg: "hsl(25 80% 55% / 0.15)", border: "hsl(25 80% 55%)", text: "hsl(25 80% 30%)" };
  return { emoji: null, bg: "transparent", border: "hsl(214 32% 88%)", text: "hsl(222 47% 20%)" };
}

export default function ResultsScreen({
  studentName,
  elapsed,
  mistakes,
  leaderboard,
  currentEntryId,
  onReset,
  onClearLeaderboard,
}: ResultsScreenProps) {
  const sorted = sortLeaderboard(leaderboard);
  const myRank = sorted.findIndex((e) => e.id === currentEntryId) + 1;
  const badge = getRankBadge(myRank);

  return (
    <div
      className="min-h-screen p-4 pb-10"
      style={{ background: "linear-gradient(135deg, hsl(221 83% 96%) 0%, hsl(210 40% 97%) 50%, hsl(221 83% 93%) 100%)" }}
      dir="rtl"
    >
      <div className="max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center mb-5 pt-2">
          <h1 className="text-2xl font-bold" style={{ color: "hsl(222 47% 15%)" }}>نتيجة الاختبار</h1>
        </div>

        {/* My result card */}
        <div
          className="rounded-2xl p-5 mb-4 shadow-md"
          style={{ background: "white", border: `2px solid ${badge.border}`, }}
        >
          <div className="flex items-center gap-3 mb-4">
            {/* Rank number */}
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full w-14 h-14 text-2xl font-black"
              style={{ background: badge.bg, border: `2px solid ${badge.border}`, color: badge.text }}
            >
              {badge.emoji ?? `#${myRank}`}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium mb-0.5" style={{ color: "hsl(215 20% 55%)" }}>المركز الحالي</p>
              <p className="text-2xl font-black leading-none" style={{ color: badge.text }}>
                {myRank === 1 ? "المركز الأول 🎉" : myRank === 2 ? "المركز الثاني" : myRank === 3 ? "المركز الثالث" : `المركز #${myRank}`}
              </p>
              <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: "hsl(222 47% 25%)" }}>{studentName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: "hsl(221 83% 53% / 0.07)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "hsl(221 83% 45%)" }}>الوقت المستغرق</p>
              <p className="text-2xl font-black" style={{ color: "hsl(221 83% 53%)" }}>{elapsed}</p>
              <p className="text-xs" style={{ color: "hsl(215 20% 55%)" }}>ثانية</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: mistakes === 0 ? "hsl(142 71% 45% / 0.08)" : "hsl(0 84% 60% / 0.07)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: mistakes === 0 ? "hsl(142 71% 35%)" : "hsl(0 84% 45%)" }}>عدد الأخطاء</p>
              <p className="text-2xl font-black" style={{ color: mistakes === 0 ? "hsl(142 71% 40%)" : "hsl(0 84% 50%)" }}>{mistakes}</p>
              <p className="text-xs" style={{ color: "hsl(215 20% 55%)" }}>{mistakes === 0 ? "بدون أخطاء!" : "خطأ"}</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div
          className="rounded-2xl shadow-md overflow-hidden mb-5"
          style={{ background: "white", border: "1px solid hsl(214 32% 88%)" }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: "hsl(221 83% 53%)" }}>
            <span className="text-white text-base">🏆</span>
            <h2 className="text-sm font-bold text-white">لوحة المتصدرين</h2>
            <span className="text-white/70 text-xs mr-auto">{sorted.length} طالب</span>
          </div>

          {/* Column headers */}
          <div
            className="grid px-4 py-2 text-xs font-bold"
            style={{ gridTemplateColumns: "2rem 1fr 4rem 4rem", color: "hsl(215 20% 50%)", background: "hsl(210 40% 97%)", borderBottom: "1px solid hsl(214 32% 90%)" }}
          >
            <span className="text-center">#</span>
            <span>الاسم</span>
            <span className="text-center">الأخطاء</span>
            <span className="text-center">الوقت</span>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: "hsl(214 32% 91%)" }}>
            {sorted.length === 0 && (
              <div className="py-6 text-center text-sm" style={{ color: "hsl(215 20% 55%)" }}>
                لا توجد نتائج بعد
              </div>
            )}
            {sorted.map((entry, idx) => {
              const rank = idx + 1;
              const isMe = entry.id === currentEntryId;
              const rb = getRankBadge(rank);
              return (
                <div
                  key={entry.id}
                  className="grid items-center px-4 py-2.5 gap-1"
                  style={{
                    gridTemplateColumns: "2rem 1fr 4rem 4rem",
                    background: isMe ? "hsl(221 83% 53% / 0.07)" : "transparent",
                    borderRight: isMe ? "3px solid hsl(221 83% 53%)" : "3px solid transparent",
                  }}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    {rank <= 3 ? (
                      <span className="text-lg leading-none">{rb.emoji}</span>
                    ) : (
                      <span className="text-sm font-bold" style={{ color: "hsl(215 20% 50%)" }}>#{rank}</span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: isMe ? "hsl(221 83% 45%)" : "hsl(222 47% 15%)" }}
                    >
                      {entry.name}
                      {isMe && <span className="text-xs font-normal mr-1" style={{ color: "hsl(221 83% 55%)" }}>(أنت)</span>}
                    </p>
                    <p className="text-xs" style={{ color: "hsl(215 20% 60%)" }}>{entry.date}</p>
                  </div>

                  {/* Mistakes */}
                  <div className="text-center">
                    <span
                      className="inline-block text-sm font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: entry.mistakes === 0 ? "hsl(142 71% 45% / 0.12)" : "hsl(0 84% 60% / 0.10)",
                        color: entry.mistakes === 0 ? "hsl(142 71% 35%)" : "hsl(0 84% 45%)",
                      }}
                    >
                      {entry.mistakes}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="text-center">
                    <span className="text-sm font-semibold" style={{ color: "hsl(221 83% 50%)" }}>
                      {entry.elapsed}ث
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95"
            style={{ background: "hsl(221 83% 53%)", color: "white", boxShadow: "0 4px 14px hsl(221 83% 53% / 0.30)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(221 83% 46%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(221 83% 53%)")}
          >
            طالب جديد
          </button>
          <button
            onClick={onClearLeaderboard}
            className="py-3.5 px-5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95"
            style={{ background: "hsl(0 84% 60% / 0.10)", color: "hsl(0 84% 45%)", border: "1px solid hsl(0 84% 60% / 0.25)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(0 84% 60% / 0.18)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(0 84% 60% / 0.10)")}
          >
            مسح النتائج
          </button>
        </div>
      </div>
    </div>
  );
}
