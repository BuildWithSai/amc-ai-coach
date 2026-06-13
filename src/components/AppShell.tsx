import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  AlertTriangle,
  Sparkles,
  BarChart3,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/study-sessions", icon: BookOpen, label: "Study Sessions" },
  { to: "/mistakes", icon: AlertTriangle, label: "Mistakes" },
  { to: "/ai-coach", icon: Sparkles, label: "AI Coach" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F5F5F7]">
      <aside className="flex h-full w-64 shrink-0 flex-col border-r border-black/10 bg-white">

        <div className="flex items-center gap-3 px-5 py-[18px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0A84FF] text-[13px] font-bold text-white">
            A
          </div>
          <span className="text-[15px] font-semibold text-gray-900">AMC Coach</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-all duration-150 ease-out ${
                  active
                    ? "bg-[#EBF5FF] text-[#0A84FF]"
                    : "text-[#86868B] hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
          <span className="flex cursor-not-allowed select-none items-center gap-3 px-3 py-2 text-[14px] font-medium text-gray-300">
            <BarChart3 className="h-4 w-4 shrink-0" />
            Progress
          </span>
        </nav>

        <div className="border-t border-black/10 px-5 py-4">
          <p className="text-[14px] font-semibold text-gray-900">Dr. Priya</p>
          <p className="mt-0.5 text-[13px] text-[#86868B]">AMC MCQ Part 1</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
