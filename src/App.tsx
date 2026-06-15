import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./services/supabase";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudySessionsPage from "./pages/StudySessionsPage";
import MistakesPage from "./pages/MistakesPage";
import AICoachPage from "./pages/AICoachPage";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/10 border-t-[#0A84FF]" />
      </div>
    );
  }

  if (!session) return <LoginPage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/study-sessions" element={<StudySessionsPage />} />
        <Route path="/mistakes" element={<MistakesPage />} />
        <Route path="/ai-coach" element={<AICoachPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
