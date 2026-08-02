/* ============================================================================
   TOURNAMENT OS — AUTHENTICATION PAGES
   All auth pages render inside AuthLayout which provides the centred shell,
   logo, back-link, and ambient background.
   ============================================================================ */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { AuthFormField, AuthRegionField } from "./AuthFormField";
import { loginSchema, signupSchema, forgotSchema, resetSchema, type LoginValues, type SignupValues, type ForgotValues, type ResetValues } from "./schemas";
import { ease } from "@/shared/motion/motion-tokens";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Globe, Terminal, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import DynamicText from "@/components/ui-lib/kokonutui/texts/dynamic-text";
import Loader from "@/components/ui-lib/kokonutui/inputs/loader";
import ProfileSetup from "@/components/ui-lib/kokonutui/inputs/avatar-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "./AuthContext";
import { REGIONS } from "@/lib/directory";
import { cn } from "@/lib/utils";

/* Shared primitives */

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
  const [globalError, setGlobalError] = useState("");

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: LoginValues) {
    setGlobalError("");
    const err = await login({ email: values.email, password: values.password, rememberMe: !!values.rememberMe });
    if (err) {
      if (err.field) form.setError(err.field as keyof LoginValues, { message: err.message });
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {globalError && <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{globalError}</div>}
            <AuthFormField name="email" label="Email address" type="email" placeholder="you@guild.gg" autoComplete="email" />
            <AuthFormField name="password" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />

            <div className="flex items-center justify-between text-sm">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2 text-mid">
                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400" />
                    Remember me
                  </label>
                )}
              />
              <Link to="/forgot-password" className="text-cyan-300 hover:text-cyan-200">Forgot password?</Link>
            </div>

            <SubmitButton loading={auth.status === "loading"}>Sign in</SubmitButton>
          </form>
        </Form>

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
  const [globalError, setGlobalError] = useState("");

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", displayName: "", email: "", password: "", confirmPassword: "", region: "EU-West", agree: false },
  });

  async function onSubmit(values: SignupValues) {
    setGlobalError("");
    const err = await signup({
      username: values.username,
      displayName: values.displayName ?? "",
      email: values.email,
      password: values.password,
      region: values.region,
    });
    if (err) {
      if (err.field) form.setError(err.field as keyof SignupValues, { message: err.message });
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

        {/* Identity step — KokonutUI avatar picker (wired) */}
        <div className="mb-5 rounded-2xl border border-white/8 bg-white/[0.01] p-2">
          <ProfileSetup
            onComplete={(data) => {
              form.setValue("username", data.username);
            }}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {globalError && <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{globalError}</div>}
            <div className="grid grid-cols-2 gap-3">
              <AuthFormField name="username" label="Username" placeholder="Phantom" autoComplete="username" />
              <AuthFormField name="displayName" label="Display name" placeholder="Kai Nakamura" />
            </div>
            <AuthFormField name="email" label="Email address" type="email" placeholder="you@guild.gg" autoComplete="email" />
            <div className="grid grid-cols-2 gap-3">
              <AuthFormField name="password" label="Password" type="password" placeholder="8+ characters" autoComplete="new-password" />
              <AuthFormField name="confirmPassword" label="Confirm password" type="password" placeholder="Repeat password" autoComplete="new-password" />
            </div>
            <AuthRegionField name="region" regions={REGIONS} />

            <FormField
              control={form.control}
              name="agree"
              render={({ field }) => (
                <FormItem>
                  <label className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/[0.01] px-4 py-3.5">
                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} className="mt-0.5 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400" />
                    <span className="text-xs leading-relaxed text-mid">
                      I agree to the <span className="text-cyan-300">Code of Conduct</span>, the{" "}
                      <span className="text-cyan-300">Tournament Rules</span>, and the platform{" "}
                      <span className="text-cyan-300">Terms of Service</span>.
                    </span>
                  </label>
                  <FormMessage className="px-1 text-xs text-rose-400" />
                </FormItem>
              )}
            />

            <SubmitButton loading={auth.status === "loading"}>Create account</SubmitButton>
          </form>
        </Form>

        <p className="mt-6 text-center text-xs text-mid">Already have an account? <Link to="/login" className="text-cyan-300 hover:text-cyan-200 font-medium">Sign in</Link></p>
      </div>
    </motion.div>
  );
}

/* ============================================================ Forgot Password */
export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotValues) {
    setSentEmail(values.email);
    await new Promise((r) => setTimeout(r, 900));
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
            <p className="mt-2 text-sm text-mid">We sent a reset link to <span className="text-hi">{sentEmail}</span>. It expires in 30 minutes.</p>
            <Link to="/login" className="mt-6 block text-sm text-cyan-300 hover:text-cyan-200">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-center font-display text-2xl font-bold text-hi">Reset password</h1>
            <p className="mt-1 text-center text-sm text-mid">Enter your email and we'll send a reset link.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <AuthFormField name="email" label="Email address" type="email" placeholder="you@guild.gg" autoComplete="email" />
                <SubmitButton loading={form.formState.isSubmitting}>Send reset link</SubmitButton>
              </form>
            </Form>
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
  const [done, setDone] = useState(false);
  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 900));
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <AuthFormField name="password" label="New password" type="password" placeholder="8+ characters" autoComplete="new-password" />
                <AuthFormField name="confirmPassword" label="Confirm password" type="password" placeholder="Repeat password" autoComplete="new-password" />
                <SubmitButton loading={form.formState.isSubmitting}>Update password</SubmitButton>
              </form>
            </Form>
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