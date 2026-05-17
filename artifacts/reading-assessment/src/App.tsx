import { useState } from "react";
import WelcomeScreen from "@/pages/WelcomeScreen";
import AssessmentScreen from "@/pages/AssessmentScreen";
import ResultsScreen from "@/pages/ResultsScreen";

type Screen = "welcome" | "assessment" | "results";

interface SessionData {
  studentName: string;
  elapsed: number;
  mistakes: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [session, setSession] = useState<SessionData>({
    studentName: "",
    elapsed: 0,
    mistakes: 0,
  });

  function handleStart(name: string) {
    setSession((s) => ({ ...s, studentName: name }));
    setScreen("assessment");
  }

  function handleFinish(elapsed: number, mistakes: number) {
    setSession((s) => ({ ...s, elapsed, mistakes }));
    setScreen("results");
  }

  function handleReset() {
    setSession({ studentName: "", elapsed: 0, mistakes: 0 });
    setScreen("welcome");
  }

  if (screen === "welcome") {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (screen === "assessment") {
    return (
      <AssessmentScreen
        studentName={session.studentName}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <ResultsScreen
      studentName={session.studentName}
      elapsed={session.elapsed}
      mistakes={session.mistakes}
      onReset={handleReset}
    />
  );
}
