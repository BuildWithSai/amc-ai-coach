import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Stethoscope,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { supabase } from "../services/supabase";
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
  {
    section: "Account",
    items: [{ to: "/settings", icon: Settings, label: "Settings" }],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const closeSidebar = () => setMobileOpen(false);

  // Close sidebar on any route change — handles same-page taps and browser back/forward
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F7F8FA]">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        data-open={mobileOpen.toString()}
        className="fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col border-r border-black/[0.07] bg-white transition-transform duration-200 ease-out md:relative md:z-auto md:translate-x-0"
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A84FF] to-[#0060D0] shadow-[0_1px_4px_rgba(10,132,255,0.45)]">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">
              AMC AI Coach
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2">
          {NAV_GROUPS.map(({ section, items }, i) => (
            <div key={section} className={i > 0 ? "mt-5" : ""}>
              <p className="mb-1.5 select-none px-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#86868B]/50">
                {section}
              </p>
              <div className="space-y-[2px]">
                {items.map(({ to, icon: Icon, label }) => {
                  const active = pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      aria-current={active ? "page" : undefined}
                      onClick={closeSidebar}
                      className={`group flex min-h-[44px] items-center gap-2.5 rounded-[8px] px-3 py-[9px] text-[14px] font-medium transition-all duration-100 md:min-h-0 ${
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
            <p className="mb-1.5 select-none px-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#86868B]/50">
              Reports
            </p>
            <span
              role="button"
              aria-disabled="true"
              tabIndex={-1}
              className="flex cursor-not-allowed select-none items-center gap-2.5 rounded-[8px] px-3 py-[9px] text-[14px] font-medium text-[#86868B]/35"
            >
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1C1C1E] text-[11px] font-bold text-white">
              {userEmail ? userEmail[0].toUpperCase() : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-gray-900">
                {userEmail ? userEmail.split("@")[0] : "—"}
              </p>
              <p className="mt-[3px] truncate text-[11.5px] leading-tight text-[#86868B]">
                AMC MCQ Part 1
              </p>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              onClick={() => supabase.auth.signOut()}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#86868B] transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header — hidden on md+ */}
        <div
          className="flex shrink-0 items-center gap-3 border-b border-black/[0.07] bg-white px-4 py-3 md:hidden"
          style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
        >
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">
            AMC AI Coach
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
