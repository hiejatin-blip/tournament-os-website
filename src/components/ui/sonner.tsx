import { Toaster as Sonner, type ToasterProps } from "sonner";

/* ============================================================================
   Sonner toaster — dark-only (Tournament OS identity decision).
   Previously imported `useTheme` from `next-themes` with no ThemeProvider
   mounted anywhere — a latent crash. Theme is now hardcoded to dark and the
   next-themes dependency has been removed.
   ============================================================================ */
const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner theme="dark" className="toaster group" {...props} />;
};

export { Toaster };
