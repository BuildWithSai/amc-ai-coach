/**
 * Auth page for email/password sign in and account creation.
 * Toggles between modes in-place. Errors are surfaced inline; never via alert().
 * After sign-up, shows a confirmation prompt if Supabase email verification is on.
 */
import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { supabase } from "../services/supabase";

type Mode = "signin" | "signup";

function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setSignedUp(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        // Email confirmation required — session won't exist yet
        setSignedUp(true);
      }
    }

    setLoading(false);
  };

  const inputCls =
    "h-[38px] w-full rounded-lg border border-black/10 bg-white px-3 text-[14px] text-gray-900 placeholder:text-[#6B6B70] transition-all duration-150 focus:border-[#0A84FF] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4">
      <div className="w-full max-w-[360px]">

        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#0060D0] shadow-[0_1px_4px_rgba(10,132,255,0.45)]">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <p className="text-[20px] font-semibold tracking-[-0.01em] text-gray-900">
              AMC AI Coach
            </p>
            <p className="mt-0.5 text-[14px] text-[#6B6B70]">
              {mode === "signin" ? "Sign in to your account" : "Create your account"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-black/10 bg-white p-6">

          {/* Post sign-up confirmation notice */}
          {signedUp ? (
            <div className="text-center">
              <p className="text-[15px] font-semibold text-gray-900">Check your email</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6B6B70]">
                We sent a confirmation link to <span className="font-medium text-gray-900">{email}</span>.
                Open it to activate your account, then come back and sign in.
              </p>
              <button
                type="button"
                onClick={() => { setSignedUp(false); setMode("signin"); }}
                className="mt-5 w-full rounded-lg bg-[#0A84FF] px-4 py-2 text-[14px] font-medium text-white transition-all duration-150 hover:bg-[#0071E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/40 active:scale-[0.98]"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-medium text-[#6B6B70]">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>

              <div className="mb-5">
                <label htmlFor="login-password" className="mb-1.5 block text-[13px] font-medium text-[#6B6B70]">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className={inputCls}
                />
              </div>

              {error && (
                <p role="alert" className="mb-4 text-[13px] text-[#D63031]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full rounded-lg bg-[#0A84FF] px-4 py-2 text-[14px] font-medium text-white transition-all duration-150 hover:bg-[#0071E3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {mode === "signin" ? "Signing in…" : "Creating account…"}
                  </span>
                ) : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>
          )}
        </div>

        {/* Mode toggle */}
        {!signedUp && (
          <p className="mt-5 text-center text-[13px] text-[#6B6B70]">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-medium text-[#0A84FF] transition-colors duration-150 hover:text-[#0071E3] focus-visible:outline-none focus-visible:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-medium text-[#0A84FF] transition-colors duration-150 hover:text-[#0071E3] focus-visible:outline-none focus-visible:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        )}

      </div>
    </div>
  );
}

export default LoginPage;
