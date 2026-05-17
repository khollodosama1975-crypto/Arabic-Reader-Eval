import { useState } from "react";

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, hsl(221 83% 96%) 0%, hsl(210 40% 97%) 50%, hsl(221 83% 93%) 100%)" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: "hsl(221 83% 53%)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: "hsl(222 47% 15%)" }}>
            تقييم القراءة
          </h1>
          <p className="text-base" style={{ color: "hsl(215 20% 50%)" }}>
            اختبار القراءة الجهرية للطلاب
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-lg p-8" style={{ background: "white", border: "1px solid hsl(214 32% 88%)" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="student-name"
                className="block text-base font-semibold mb-2"
                style={{ color: "hsl(222 47% 15%)" }}
              >
                اسم الطالب الرباعي
              </label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="مثال: محمد أحمد علي حسن"
                className="w-full text-right rounded-xl px-4 py-3 text-base outline-none transition-all"
                style={{
                  border: error ? "2px solid hsl(0 84% 60%)" : "2px solid hsl(214 32% 82%)",
                  fontFamily: "'Cairo', sans-serif",
                  color: "hsl(222 47% 15%)",
                  background: "hsl(210 40% 98%)",
                }}
                onFocus={(e) => {
                  if (!error) e.target.style.border = "2px solid hsl(221 83% 53%)";
                }}
                onBlur={(e) => {
                  if (!error) e.target.style.border = "2px solid hsl(214 32% 82%)";
                }}
                autoComplete="off"
                dir="rtl"
              />
              {error && (
                <p className="mt-1.5 text-sm font-medium" style={{ color: "hsl(0 84% 50%)" }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-base font-bold transition-all duration-150 active:scale-95"
              style={{
                background: "hsl(221 83% 53%)",
                color: "white",
                boxShadow: "0 4px 14px hsl(221 83% 53% / 0.35)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(221 83% 46%)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(221 83% 53%)")}
            >
              بدء الاختبار
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "hsl(215 20% 55%)" }}>
          المرحلة الابتدائية — اختبار القراءة الجهرية
        </p>
      </div>
    </div>
  );
}
