import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

/* ============================================================================
   AuthLayout — focused, distraction-free shell for authentication pages.
   No global nav/footer. Centers the auth card with ambient background.
   ============================================================================ */
export function AuthLayout() {
  return (
    <div className="depth-fog relative grid min-h-screen place-items-center overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[50vh] w-[60vh] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center"><Logo /></Link>
        <Outlet />
        <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-xs text-lo transition-colors hover:text-hi">
          <ArrowLeft className="h-3.5 w-3.5" />Back to home
        </Link>
      </div>
    </div>
  );
}
