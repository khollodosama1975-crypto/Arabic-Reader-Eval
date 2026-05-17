import { useState, useEffect } from "react";
import WelcomeScreen from "@/pages/WelcomeScreen";
import AssessmentScreen from "@/pages/AssessmentScreen";
import ResultsScreen from "@/pages/ResultsScreen";

export interface LeaderboardEntry {
  id: string;
  name: string;
  mistakes: number;
  elapsed: number;
  date: string;
}

type Screen = "welcome" | "assessment" | "results";

interface SessionData {
  studentName: string;
  elapsed: number;
  mistakes: number;
}

const STORAGE_KEY = "reading_assessment_leaderboard";

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (a.mistakes !== b.mistakes) return a.mistakes - b.mistakes;
    return a.elapsed - b.elapsed;
  });
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [session, setSession] = useState<SessionData>({ studentName: "", elapsed: 0, mistakes: 0 });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard());
  const [currentEntryId, setCurrentEntryId] = useState<string>("");

  useEffect(() => {
    saveLeaderboard(leaderboard);
  }, [leaderboard]);

  function handleStart(name: string) {
    setSession({ studentName: name, elapsed: 0, mistakes: 0 });
    setScreen("assessment");
  }

  function handleFinish(elapsed: number, mistakes: number) {
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random()}`,
      name: session.studentName,
      mistakes,
      elapsed,
      date: new Date().toLocaleDateString("ar-SA"),
    };
    setCurrentEntryId(entry.id);
    setLeaderboard((prev) => [...prev, entry]);
    setSession((s) => ({ ...s, elapsed, mistakes }));
    setScreen("results");
  }

  function handleReset() {
    setSession({ studentName: "", elapsed: 0, mistakes: 0 });
    setCurrentEntryId("");
    setScreen("welcome");
  }

  function handleClearLeaderboard() {
    setLeaderboard([]);
    setCurrentEntryId("");
    setScreen("welcome");
  }

  if (screen === "welcome") {
    return <WelcomeScreen onStart={handleStart} leaderboard={sortLeaderboard(leaderboard)} />;
  }

  if (screen === "assessment") {
    return <AssessmentScreen studentName={session.studentName} onFinish={handleFinish} />;
  }

  return (
    <ResultsScreen
      studentName={session.studentName}
      elapsed={session.elapsed}
      mistakes={session.mistakes}
      leaderboard={sortLeaderboard(leaderboard)}
      currentEntryId={currentEntryId}
      onReset={handleReset}
      onClearLeaderboard={handleClearLeaderboard}
    />
  );
}
