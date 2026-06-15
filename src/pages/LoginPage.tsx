/**
 * Auth page for email/password sign in and account creation.
 * Toggles between modes in-place. Errors are surfaced inline; never via alert().
 * After sign-up, shows a confirmation prompt if Supabase email verification is on.
 */
import { useState, useRef, useEffect } from "react";
import { Stethoscope } from "lucide-react";
import { supabase } from "../services/supabase";

type Mode = "signin" | "signup";

// Static — no props or state dependency, so defined once at module scope rather than
// recreated on every render (every keystroke re-renders the component).
// text-base (16px) on mobile prevents iOS Safari auto-zoom on input focus.
// sm:text-[14px] restores the design-system size on larger screens.
const INPUT_CLS =
  "h-[38px] w-full rounded-lg border border-black/10 bg-white px-3 text-base sm:text-[14px] text-gray-900 transition-all duration-150 placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

// Map raw Supabase error strings to user-readable copy.
// Falls through to the original message for unknown errors so nothing is silently swallowed.
function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Incorrect email or password. Check your details and try again.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("email not confirmed"))
    return "Confirm your email first — check your inbox for the activation link.";
  if (m.includes("password should be at least") || m.includes("password must be at least"))
    return "Password must be at least 6 characters.";
  if (m.includes("unable to validate email") || m.includes("invalid email") || m.includes("invalid format"))
    return "Enter a valid email address.";
  if (m.includes("rate limit") || m.includes("too many requests") || m.includes("only request this once every 60"))
    return "Too many attempts. Wait a minute and try again.";
  if (m.includes("network") || m.includes("fetch") || m.includes("failed to fetch"))
    return "Connection problem. Check your internet and try again.";
  return msg;
}

function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  // Focus the confirmation heading when the form swaps to the success state
  const confirmRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (signedUp) confirmRef.current?.focus();
  }, [signedUp]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setSignedUp(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Client-side guards — fast feedback before touching the network
    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "signup" && trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (error) setError(friendlyError(error.message));
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (error) {
          setError(friendlyError(error.message));
        } else if (!data.session) {
          setSignedUp(true);
        }
      }
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmittable = !loading && email.trim().length > 0 && password.trim().length > 0;

  return (
    // min-h-[100dvh]: dvh shrinks when the soft keyboard opens on iOS 15.4+ so the form
    // re-centers to the visible area instead of sitting half-covered by the keyboard.
    // py-12: vertical breathing room; also keeps content scrollable on short viewports
    //   (phone landscape) without any explicit overflow hack.
    // paddingBottom style: clears the home-indicator safe area on notched iPhones.
    //   viewport-fit=cover is set in index.html so env(safe-area-inset-bottom) is live.
    <div
      className="flex min-h-[100dvh] items-center justify-center bg-[#F5F5F7] px-4 py-12"
      style={{ paddingBottom: "max(3rem, env(safe-area-inset-bottom))" }}
    >
      <div className="w-full max-w-[360px]">

        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#0060D0] shadow-[0_1px_4px_rgba(10,132,255,0.45)]">
            <Stethoscope className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="text-[20px] font-semibold tracking-[-0.01em] text-gray-900">
              AMC AI Coach
            </p>
            {/* h1 carries the page purpose for screen readers; visual size is intentionally modest */}
            <h1 className="mt-0.5 text-[14px] font-normal text-secondary">
              {mode === "signin" ? "Sign in to your account" : "Create your account"}
            </h1>
          </div>
        </div>

        {/* Card — aria-live so screen readers catch the form ↔ confirmation swap */}
        <div
          className="rounded-xl border border-black/10 bg-white p-6"
          aria-live="polite"
          aria-atomic="true"
        >
          {signedUp ? (
            <div className="text-center">
              <h2
                ref={confirmRef}
                tabIndex={-1}
                className="text-[15px] font-semibold text-gray-900 focus:outline-none"
              >
                Check your email
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-secondary" style={{ textWrap: "pretty" }}>
                We sent a confirmation link to{" "}
                {/* break-all prevents long email addresses from overflowing the 360px card */}
                <span className="break-all font-medium text-gray-900">{email.trim()}</span>.
                Open it to activate your account, then come back and sign in.
              </p>
              <button
                type="button"
                onClick={() => { setSignedUp(false); setMode("signin"); }}
                className="mt-5 min-h-[44px] w-full cursor-pointer rounded-lg bg-accent px-4 py-2 text-[14px] font-medium text-white transition-all duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 active:scale-[0.98] md:min-h-0"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-medium text-secondary">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  aria-describedby={error ? "login-error" : undefined}
                  className={INPUT_CLS}
                />
              </div>

              <div className="mb-5">
                <label htmlFor="login-password" className="mb-1.5 block text-[13px] font-medium text-secondary">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={mode === "signup" ? 6 : undefined}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  aria-describedby={
                    error ? "login-error" : mode === "signup" ? "password-hint" : undefined
                  }
                  className={INPUT_CLS}
                />
                {mode === "signup" && !error && (
                  <p id="password-hint" className="mt-1.5 text-[12px] text-secondary">
                    Minimum 6 characters
                  </p>
                )}
              </div>

              {error && (
                <p id="login-error" role="alert" className="mb-4 text-[13px] text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!isSubmittable}
                className="min-h-[44px] w-full cursor-pointer rounded-lg bg-accent px-4 py-2 text-[14px] font-medium text-white transition-all duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 md:min-h-0"
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

        {/* Mode toggle — disabled during in-flight requests to prevent mid-request mode switch */}
        {!signedUp && (
          <p className="mt-5 text-center text-[13px] text-secondary">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  disabled={loading}
                  className="cursor-pointer py-1 font-medium text-accent transition-colors duration-150 hover:text-accent-hover focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
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
                  disabled={loading}
                  className="cursor-pointer py-1 font-medium text-accent transition-colors duration-150 hover:text-accent-hover focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
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
