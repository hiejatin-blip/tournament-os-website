import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ============================================================================
   AuthFormField — shadcn Form + RHF field with the site's void/cyan styling.
   Replaces the hand-rolled `Field` component in the auth pages.
   ============================================================================ */

export function AuthFormField({
  name,
  label,
  type = "text",
  placeholder,
  description,
  autoComplete,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
  autoComplete?: string;
  className?: string;
}) {
  const { control } = useFormContext();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-sm font-medium text-hi">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={inputType}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="rounded-xl border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi placeholder:text-lo focus:border-cyan-400/50 focus:ring-cyan-400/20"
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lo transition-colors hover:text-hi"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </FormControl>
          {description && <FormDescription className="text-xs text-lo">{description}</FormDescription>}
          <FormMessage className="text-xs text-rose-400" />
        </FormItem>
      )}
    />
  );
}

/* Select-style region picker wired into RHF */
export function AuthRegionField({
  name,
  regions,
  label = "Region",
}: {
  name: string;
  regions: readonly string[];
  label?: string;
}) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-hi">{label}</FormLabel>
          <FormControl>
            <select
              value={field.value}
              onChange={field.onChange}
              className={cn(
                "w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi",
                "focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20",
              )}
            >
              {regions.map((r) => (
                <option key={r} value={r} className="bg-void-900 text-hi">
                  {r}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage className="text-xs text-rose-400" />
        </FormItem>
      )}
    />
  );
}
