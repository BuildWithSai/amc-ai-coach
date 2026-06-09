import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import StudySessionsPage from "./pages/StudySessionsPage";
import MistakesPage from "./pages/MistakesPage";
import AICoachPage from "./pages/AICoachPage";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Study Sessions", to: "/study-sessions" },
  { label: "Mistakes", to: "/mistakes" },
  { label: "AI Coach", to: "/ai-coach" },
];

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside
          style={{
            width: "220px",
            flexShrink: 0,
            backgroundColor: "#1C1C1E",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Logo */}
          <div style={{ padding: "24px 20px 20px" }}>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.2px",
              }}
            >
              AMC AI Coach
            </span>
          </div>

          {/* Hairline divider */}
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", margin: "0 20px" }} />

          {/* Nav links */}
          <nav style={{ flex: 1, padding: "12px 8px" }}>
            {navItems.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className="flex items-center py-2 px-3 text-[13px] mb-0.5 transition-colors rounded-r-sm"
                style={({ isActive }) => ({
                  borderLeft: `3px solid ${isActive ? "#0D9488" : "transparent"}`,
                  backgroundColor: isActive ? "rgba(255,255,255,0.10)" : "transparent",
                  color: isActive ? "#FFFFFF" : "#9CA3AF",
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: "none",
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* ── Main content ──────────────────────────────────────────── */}
        <main style={{ marginLeft: "220px", flex: 1, minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/study-sessions" element={<StudySessionsPage />} />
            <Route path="/mistakes" element={<MistakesPage />} />
            <Route path="/ai-coach" element={<AICoachPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
