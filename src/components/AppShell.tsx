import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV_GROUPS = [
  {
    section: "Overview",
    items: [{ to: "/", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    section: "Learning",
    items: [
      { to: "/study-sessions", icon: BookOpen, label: "Study Sessions" },
      { to: "/mistakes", icon: AlertTriangle, label: "Mistakes" },
    ],
  },
  {
    section: "AI",
    items: [{ to: "/ai-coach", icon: Sparkles, label: "AI Coach" }],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F5F5F7]">
      <aside className="flex h-full w-64 shrink-0 flex-col border-r border-black/[0.07] bg-white">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0A84FF]">
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">
            AMC AI Coach
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2">
          {NAV_GROUPS.map(({ section, items }, i) => (
            <div key={section} className={i > 0 ? "mt-5" : ""}>
              <p className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#86868B]/50 select-none">
                {section}
              </p>
              <div className="space-y-[2px]">
                {items.map(({ to, icon: Icon, label }) => {
                  const active = pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`group flex items-center gap-2.5 rounded-[8px] px-3 py-[9px] text-[14px] font-medium transition-all duration-100 ${
                        active
                          ? "bg-[#EBF3FF] text-[#0A84FF]"
                          : "text-[#3C3C43]/80 hover:bg-[#F2F2F7] hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors duration-100 ${
                          active
                            ? "text-[#0A84FF]"
                            : "text-[#86868B] group-hover:text-gray-700"
                        }`}
                      />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Reports — coming soon */}
          <div className="mt-5">
            <p className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#86868B]/50 select-none">
              Reports
            </p>
            <span className="flex cursor-not-allowed select-none items-center gap-2.5 rounded-[8px] px-3 py-[9px] text-[14px] font-medium text-[#86868B]/35">
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span>Progress</span>
              <span className="ml-auto rounded-full bg-[#F2F2F7] px-[7px] py-[2px] text-[10px] font-semibold uppercase tracking-wide text-[#86868B]/55">
                Soon
              </span>
            </span>
          </div>
        </nav>

        {/* Profile */}
        <div className="border-t border-black/[0.07] p-3">
          <div className="flex items-center gap-3 rounded-[8px] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[11px] font-bold text-white shadow-sm">
              L
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-gray-900">
                Dr. Lavanya
              </p>
              <p className="mt-[3px] truncate text-[11.5px] leading-tight text-[#86868B]">
                AMC MCQ Part 1
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
