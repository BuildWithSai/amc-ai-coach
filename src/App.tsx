import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import StudySessionsPage from "./pages/StudySessionsPage";
import MistakesPage from "./pages/MistakesPage";
import AICoachPage from "./pages/AICoachPage";

function App() {
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
