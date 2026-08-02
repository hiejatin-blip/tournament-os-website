/* ============================================================================
   TOURNAMENT OS — AUTHENTICATION PAGES
   All auth pages render inside AuthLayout which provides the centred shell,
   logo, back-link, and ambient background.
   ============================================================================ */
import { useState } from "react";
import { ease } from "@/shared/motion/motion-tokens";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Globe, Terminal, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import DynamicText from "@/components/ui-lib/kokonutui/texts/dynamic-text";
import Loader from "@/components/ui-lib/kokonutui/inputs/loader";
import { useAuth } from "./AuthContext";
import { REGIONS } from "@/lib/directory";
import { cn } from "@/lib/utils";

/* Shared primitives */

function Field({ label, type = "text", id, value, onChange, error, placeholder, suffix }: {
  label: string; type?: string; id: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; suffix?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-hi">{label}</label>
      <div className="relative mt-1.5">
        <input
          id={id} type={isPassword ? (show ? "text" : "password") : type}
          value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={cn("w-full rounded-xl border bg-white/[0.02] px-4 py-3 text-sm text-hi placeholder:text-lo focus:outline-none focus:ring-1", error ? "border-rose-400/60 focus:ring-rose-400/60" : "border-white/10 focus:border-cyan-400/50 focus:ring-cyan-400/50")}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-lo hover:text-hi">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-void-950 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-6px_rgba(34,211,238,0.6)] disabled:pointer-events-none disabled:opacity-60">
      {loading ? <Loader size="sm" title="" subtitle="" className="!size-8" /> : <ArrowRight className="h-4 w-4" />}
      {children}
    </button>
  );
}

function Divider() {
  return <div className="flex items-center gap-3 py-2"><span className="h-px flex-1 bg-white/8" /><span className="font-mono text-[10px] uppercase tracking-wider text-lo">or</span><span className="h-px flex-1 bg-white/8" /></div>;
}

function SocialButtons() {
  return (
    <div className="space-y-2.5">
      <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-hi transition-colors hover:border-cyan-400/30 hover:bg-white/[0.06]"><Globe className="h-4 w-4" />Continue with Google</button>
      <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-hi transition-colors hover:border-cyan-400/30 hover:bg-white/[0.06]"><Terminal className="h-4 w-4" />Continue with Discord</button>
    </div>
  );
}

/* ============================================================ Login */
export function LoginPage() {
  const { login, auth } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/app/player";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError({});
    setGlobalError("");
    const err = await login({ email, password, rememberMe });
    if (err) {
      if (err.field) setFieldError({ [err.field]: err.message });
      else setGlobalError(err.message);
      return;
    }
    navigate(next, { replace: true });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: ease.emphasized }}>
      <div className="conic-border relative overflow-hidden rounded-3xl border border-white/8 bg-void-900/80 p-7 elev-3 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <h1 className="text-center font-display text-2xl font-bold text-hi">Welcome back</h1>
        <div className="mt-2 text-center"><DynamicText /></div>
        <p className="mt-1 text-center text-sm text-mid">Sign in to your Tournament OS account.</p>

        <SocialButtons />
        <Divider />

        <form onSubmit={submit} className="space-y-4">
          {globalError && <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{globalError}</div>}
          <Field label="Email address" type="email" id="email" value={email} onChange={setEmail} placeholder="you@guild.gg" error={fieldError.email} />
          <Field label="Password" type="password" id="password" value={password} onChange={setPassword} placeholder="••••••••" error={fieldError.password} />

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-mid">
              <span className={cn("grid h-4 w-4 place-items-center rounded border transition-colors", rememberMe ? "border-cyan-400/60 bg-cyan-400/20 text-cyan-300" : "border-white/15 bg-white/[0.02]")} onClick={() => setRememberMe((v) => !v)}>
                {rememberMe && <Check className="h-3 w-3" />}
              </span>
              Remember me
            </label>
            <Link to="/forgot-password" className="text-cyan-300 hover:text-cyan-200">Forgot password?</Link>
          </div>

          <SubmitButton loading={auth.status === "loading"}>Sign in</SubmitButton>
        </form>

        <p className="mt-6 text-center text-xs text-mid">No account? <Link to="/signup" className="text-cyan-300 hover:text-cyan-200 font-medium">Create one</Link></p>
      </div>
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-lo">Demo: any email + 6+ char password</p>
    </motion.div>
  );
}

/* ============================================================ Signup */
export function SignupPage() {
  const { signup, auth } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState<string>("EU-West");
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError({});
    setGlobalError("");
    const err = await signup({ username, displayName, email, password, region });
    if (err) {
      if (err.field) setFieldError({ [err.field]: err.message });
      else setGlobalError(err.message);
      return;
    }
    navigate("/auth/verify-email");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: ease.emphasized }}>
      <div className="conic-border relative overflow-hidden rounded-3xl border border-white/8 bg-void-900/80 p-7 elev-3 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <h1 className="text-center font-display text-2xl font-bold text-hi">Create your account</h1>
        <p className="mt-1 text-center text-sm text-mid">Join the Tournament OS ecosystem.</p>

        <SocialButtons />
        <Divider />

        <form onSubmit={submit} className="space-y-4">
          {globalError && <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{globalError}</div>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username" id="username" value={username} onChange={setUsername} placeholder="Phantom" error={fieldError.username} />
            <Field label="Display name" id="displayName" value={displayName} onChange={setDisplayName} placeholder="Kai Nakamura" />
          </div>
          <Field label="Email address" type="email" id="email" value={email} onChange={setEmail} placeholder="you@guild.gg" error={fieldError.email} />
          <Field label="Password" type="password" id="password" value={password} onChange={setPassword} placeholder="8+ characters" error={fieldError.password} />
          <div>
            <label className="block text-sm font-medium text-hi">Region</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi focus:border-cyan-400/50 focus:outline-none">
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <SubmitButton loading={auth.status === "loading"}>Create account</SubmitButton>
        </form>

        <p className="mt-6 text-center text-xs text-mid">Already have an account? <Link to="/login" className="text-cyan-300 hover:text-cyan-200 font-medium">Sign in</Link></p>
      </div>
    </motion.div>
  );
}

/* ============================================================ Forgot Password */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: ease.emphasized }}>
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-void-900/80 p-7 elev-3 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        {sent ? (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-400"><Check className="h-7 w-7" /></div>
            <h2 className="mt-5 text-lg font-semibold text-hi">Check your inbox</h2>
            <p className="mt-2 text-sm text-mid">We sent a reset link to <span className="text-hi">{email}</span>. It expires in 30 minutes.</p>
            <Link to="/login" className="mt-6 block text-sm text-cyan-300 hover:text-cyan-200">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-center font-display text-2xl font-bold text-hi">Reset password</h1>
            <p className="mt-1 text-center text-sm text-mid">Enter your email and we'll send a reset link.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label="Email address" type="email" id="email" value={email} onChange={setEmail} placeholder="you@guild.gg" />
              <SubmitButton loading={loading}>Send reset link</SubmitButton>
            </form>
            <p className="mt-4 text-center text-xs text-mid"><Link to="/login" className="text-cyan-300 hover:text-cyan-200">Back to sign in</Link></p>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================ Reset Password */
export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
  }

  if (!token) return <div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 p-7 text-center text-sm text-rose-300">Invalid or expired reset link. <Link to="/forgot-password" className="underline">Request a new one</Link>.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: ease.emphasized }}>
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-void-900/80 p-7 elev-3 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-400"><Check className="h-7 w-7" /></div>
            <h2 className="mt-5 text-lg font-semibold text-hi">Password updated</h2>
            <p className="mt-2 text-sm text-mid">Your password has been changed. Sign in with your new credentials.</p>
            <Link to="/login" className="mt-6 inline-block rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-void-950">Sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-center font-display text-2xl font-bold text-hi">New password</h1>
            <p className="mt-1 text-center text-sm text-mid">Choose a strong password for your account.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              {error && <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{error}</div>}
              <Field label="New password" type="password" id="password" value={password} onChange={setPassword} placeholder="8+ characters" />
              <Field label="Confirm password" type="password" id="confirm" value={confirm} onChange={setConfirm} placeholder="Must match above" />
              <SubmitButton loading={loading}>Update password</SubmitButton>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================ Email Verification */
export function EmailVerificationPage() {
  const { auth } = useAuth();
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function resend() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setResent(true);
  }

  const email = auth.status === "authenticated" ? auth.user.email : "your email";

  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: ease.emphasized }}>
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-void-900/80 p-7 text-center elev-3 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cyan-400/10 text-4xl">📧</div>
        <h1 className="mt-5 font-display text-2xl font-bold text-hi">Verify your email</h1>
        <p className="mt-3 text-sm text-mid">We sent a verification link to <span className="text-hi">{email}</span>. Click the link to activate your account.</p>
        <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] p-4 text-left text-xs text-mid space-y-1">
          <p>✓ Check your spam folder if you don't see it.</p>
          <p>✓ The link expires in 24 hours.</p>
          <p>✓ You can still browse while unverified.</p>
        </div>
        {resent ? (
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-emerald-400"><Check className="h-4 w-4" />Verification email resent!</div>
        ) : (
          <button onClick={resend} disabled={loading} className="mt-5 flex items-center justify-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 disabled:opacity-60 mx-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Resend verification email
          </button>
        )}
        <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-xs font-medium text-hi">Or enter your 6-digit code</p>
          <InputOTP
            maxLength={6}
            onComplete={(val) => toast.success("Code accepted — welcome to the arena!")}
            render={({ slots }) => (
              <InputOTPGroup className="mt-3 justify-center">
                {slots.map((slot, i) => (
                  <InputOTPSlot key={i} index={i} className="h-11 w-10 border-white/10 bg-void-950 text-lg font-bold text-hi" {...slot} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
        <Link to="/app/player" className="mt-4 block text-xs text-lo hover:text-hi">Continue to dashboard →</Link>
      </div>
    </motion.div>
  );
}