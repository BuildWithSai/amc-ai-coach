import { useState, useEffect, useRef } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { saveUserProfile } from "../services/storage";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { SectionTitle } from "../components/SectionTitle";

const labelCls =
  "mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary";

const inputCls =
  "w-full rounded-xl bg-gray-100 px-3 py-2.5 text-[14px] text-[#1C1C1E] outline-none transition-colors focus:bg-gray-50 focus:ring-2 focus:ring-[rgba(10,132,255,0.20)]";

const resetBtnCls =
  "min-h-[44px] rounded-lg border border-black/[0.1] px-3 py-1.5 text-[13px] font-medium text-secondary transition-colors hover:bg-gray-100 hover:text-gray-900 md:min-h-0";

function SettingsPage() {
  const { profile, loading, error, refetch } = useUserProfile();
  const [examDate, setExamDate] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("");
  const [savedExamDate, setSavedExamDate] = useState(false);
  const [savedWeeklyHours, setSavedWeeklyHours] = useState(false);
  const [isSavingExamDate, setIsSavingExamDate] = useState(false);
  const [isSavingWeeklyHours, setIsSavingWeeklyHours] = useState(false);
  const [saveErrorExamDate, setSaveErrorExamDate] = useState<string | null>(
    null,
  );
  const [saveErrorWeeklyHours, setSaveErrorWeeklyHours] = useState<
    string | null
  >(null);
  const timerExamDate = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerWeeklyHours = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (profile) {
      setExamDate(profile.examDate ?? "");
      setWeeklyHours(profile.weeklyHours?.toString() ?? "");
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (timerExamDate.current) clearTimeout(timerExamDate.current);
      if (timerWeeklyHours.current) clearTimeout(timerWeeklyHours.current);
    };
  }, []);

  const handleSaveExamDate = async () => {
    setIsSavingExamDate(true);
    setSaveErrorExamDate(null);
    try {
      await saveUserProfile(
        examDate || null,
        weeklyHours ? Number(weeklyHours) : null,
      );
      await refetch();
      setSavedExamDate(true);
      timerExamDate.current = setTimeout(() => setSavedExamDate(false), 2000);
    } catch {
      setSaveErrorExamDate("Failed to save. Please try again.");
    } finally {
      setIsSavingExamDate(false);
    }
  };

  const handleSaveWeeklyHours = async () => {
    setIsSavingWeeklyHours(true);
    setSaveErrorWeeklyHours(null);
    try {
      await saveUserProfile(
        examDate || null,
        weeklyHours ? Number(weeklyHours) : null,
      );
      await refetch();
      setSavedWeeklyHours(true);
      timerWeeklyHours.current = setTimeout(
        () => setSavedWeeklyHours(false),
        2000,
      );
    } catch {
      setSaveErrorWeeklyHours("Failed to save. Please try again.");
    } finally {
      setIsSavingWeeklyHours(false);
    }
  };

  const handleClearExamDate = async () => {
    setExamDate("");
    await saveUserProfile(null, weeklyHours ? Number(weeklyHours) : null);
    await refetch();
  };

  const handleClearWeeklyHours = async () => {
    setWeeklyHours("");
    await saveUserProfile(examDate || null, null);
    await refetch();
  };

  if (loading)
    return (
      <AppShell>
        <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:w-4/5">
          <p className="text-[14px] text-secondary">Loading…</p>
        </div>
      </AppShell>
    );

  if (error)
    return (
      <AppShell>
        <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:w-4/5">
          <p className="text-[14px] text-danger">{error}</p>
        </div>
      </AppShell>
    );

  const today = new Date().toISOString().slice(0, 10);

  return (
    <AppShell>
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:w-4/5">
        <SectionTitle
          title="Settings"
          subtitle="Personalise your study plan and exam target."
        />
        <div className="rounded-xl bg-white p-5">
          <h2 className="mb-5 text-[15px] font-semibold text-[#1C1C1E]">
            Profile
          </h2>
          <div className="space-y-5">
            {/* Exam date */}
            <div className="border-b border-black/[0.05] pb-5">
              <label htmlFor="settings-exam-date" className={labelCls}>
                Exam date
              </label>
              <input
                id="settings-exam-date"
                type="date"
                min={today}
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className={inputCls}
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={handleSaveExamDate}
                  disabled={
                    isSavingExamDate || examDate === (profile?.examDate ?? "")
                  }
                >
                  {isSavingExamDate ? "Saving…" : "Save exam date"}
                </Button>
                <button
                  type="button"
                  onClick={handleClearExamDate}
                  className={resetBtnCls}
                >
                  Reset
                </button>
                <span role="status" className="text-[13px] text-success">
                  {savedExamDate ? "Saved!" : ""}
                </span>
              </div>
              {saveErrorExamDate && (
                <p role="alert" className="mt-2 text-[13px] text-danger">
                  {saveErrorExamDate}
                </p>
              )}
            </div>

            {/* Weekly study hours */}
            <div>
              <label htmlFor="settings-weekly-hours" className={labelCls}>
                Weekly study hours
              </label>
              <input
                id="settings-weekly-hours"
                type="number"
                min="0"
                max="80"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)}
                className={`${inputCls} tabular-nums`}
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={handleSaveWeeklyHours}
                  disabled={isSavingWeeklyHours}
                >
                  {isSavingWeeklyHours ? "Saving…" : "Save weekly hours"}
                </Button>
                <button
                  type="button"
                  onClick={handleClearWeeklyHours}
                  className={resetBtnCls}
                >
                  Reset
                </button>
                <span role="status" className="text-[13px] text-success">
                  {savedWeeklyHours ? "Saved!" : ""}
                </span>
              </div>
              {saveErrorWeeklyHours && (
                <p role="alert" className="mt-2 text-[13px] text-danger">
                  {saveErrorWeeklyHours}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default SettingsPage;
