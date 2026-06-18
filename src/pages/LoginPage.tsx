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
  "h-[38px] w-full rounded-lg border border-black/10 bg-gray-50 px-3 text-base sm:text-[14px] text-gray-900 transition-all duration-150 placeholder:text-secondary focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20";

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
    // py-10: vertical breathing room; also keeps content scrollable on short viewports
    //   (phone landscape) without any explicit overflow hack.
    // paddingBottom style: clears the home-indicator safe area on notched iPhones.
    //   viewport-fit=cover is set in index.html so env(safe-area-inset-bottom) is live.
    <div
      className="flex min-h-[100dvh] items-center justify-center bg-white px-4"
      style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="w-full max-w-[380px]">

        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="mb-5 mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <Stethoscope className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-[24px] font-medium leading-tight text-gray-900">
            Your AMC study coach.
          </h1>
          <p className="mt-1.5 text-[17px] font-medium text-secondary">
            {mode === "signin" ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* Form — aria-live so screen readers catch the form ↔ confirmation swap */}
        <div aria-live="polite" aria-atomic="true">
          {signedUp ? (
            <div>
              <h2
                ref={confirmRef}
                tabIndex={-1}
                className="text-[15px] font-semibold text-gray-900 focus:outline-none"
              >
                Check your email
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-secondary" style={{ textWrap: "pretty" }}>
                We sent a confirmation link to{" "}
                {/* break-all prevents long email addresses from overflowing the 380px container */}
                <span className="break-all font-medium text-gray-900">{email.trim()}</span>.
                Open it to activate your account, then come back and sign in.
              </p>
              <button
                type="button"
                onClick={() => { setSignedUp(false); setMode("signin"); }}
                className="mt-5 h-11 w-full cursor-pointer rounded-lg bg-gray-900 px-4 text-[14px] font-medium text-white transition-all duration-150 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 active:scale-[0.98]"
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
                className="h-11 w-full cursor-pointer rounded-lg bg-gray-900 px-4 text-[14px] font-medium text-white transition-all duration-150 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
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
          <p className="mt-6 text-[13px] text-secondary">
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
