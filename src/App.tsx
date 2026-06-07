import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import StudySessionsPage from "./pages/StudySessionsPage";
import MistakesPage from "./pages/MistakesPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/study-sessions">Study Sessions</Link> |{" "}
        <Link to="/mistakes">Mistakes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/study-sessions" element={<StudySessionsPage />} />
        <Route path="/mistakes" element={<MistakesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
