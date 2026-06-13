import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  AlertTriangle,
  Sparkles,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ to: "/", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    label: "Learning",
    items: [
      { to: "/study-sessions", icon: BookOpen, label: "Study Sessions" },
      { to: "/mistakes", icon: AlertTriangle, label: "Mistakes" },
    ],
  },
  {
    label: "AI",
    items: [{ to: "/ai-coach", icon: Sparkles, label: "AI Coach" }],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-page">
      {/* ── Sidebar ── */}
      <aside
        className="flex h-full w-[252px] shrink-0 flex-col bg-[#F7F6F1]"
        style={{ boxShadow: "1px 0 0 rgba(0,0,0,0.06)" }}
      >
        {/* ── Brand ── */}
        <div className="px-5 pt-7 pb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-lg bg-nav-accent shadow-sm">
              <span className="text-[11px] font-bold leading-none text-white">
                A
              </span>
            </div>
            <div>
              <span className="text-[14px] font-semibold tracking-[-0.01em] text-gray-900">
                AMC AI Coach
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3">
          {NAV_GROUPS.map((group, groupIndex) => (
            <div key={group.label} className={groupIndex > 0 ? "mt-6" : ""}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A8A29E]">
                {group.label}
              </p>
              <div className="space-y-[2px]">
                {group.items.map(({ to, icon: Icon, label }) => {
                  const active = pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`group relative flex items-center gap-3 rounded-[10px] px-3 py-[9px] text-[14px] tracking-[-0.01em] outline-none ring-0 transition-all duration-150 ${
                        active
                          ? "bg-nav-accent/[0.10] font-[530] text-nav-fg"
                          : "font-[440] text-[#78716C] hover:bg-black/[0.04] hover:text-[#57534E]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-full bg-nav-accent"
                          transition={{
                            type: "spring",
                            stiffness: 480,
                            damping: 38,
                            mass: 0.8,
                          }}
                        />
                      )}
                      <Icon
                        className={`h-[16px] w-[16px] shrink-0 transition-colors duration-150 ${
                          active
                            ? "text-nav-accent"
                            : "text-[#A8A29E] group-hover:text-[#78716C]"
                        }`}
                        strokeWidth={active ? 2 : 1.75}
                      />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Reports — coming soon */}
          <div className="mt-6">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A8A29E]">
              Reports
            </p>
            <span className="flex cursor-not-allowed select-none items-center justify-between rounded-[10px] px-3 py-[9px] text-[14px] font-[440] tracking-[-0.01em] text-[#D6D3D1]">
              <span className="flex items-center gap-3">
                <BarChart3
                  className="h-[16px] w-[16px] shrink-0 text-[#D6D3D1]"
                  strokeWidth={1.75}
                />
                Progress
              </span>
              <span className="rounded-md bg-[#E7E5E4]/60 px-[6px] py-[2px] text-[10px] font-medium text-[#A8A29E]">
                Soon
              </span>
            </span>
          </div>
        </nav>

        {/* ── User identity ── */}
        <div className="border-t border-black/[0.06] px-4 py-4">
          <div className="group flex cursor-default items-center gap-3 rounded-[10px] px-1 py-1 transition-colors duration-150 hover:bg-black/[0.03]">
            <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-nav-accent/[0.10] text-[12px] font-semibold text-nav-accent">
              P
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium leading-tight text-gray-900">
                Dr. Lavanya
              </p>
              <p className="mt-[2px] text-[11.5px] leading-tight text-[#A8A29E]">
                AMC MCQ Part 1
              </p>
            </div>
            <ChevronRight className="h-[14px] w-[14px] shrink-0 text-[#D6D3D1] transition-colors duration-150 group-hover:text-[#A8A29E]" />
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
