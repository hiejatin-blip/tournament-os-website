import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/* ============================================================================
   Dock — MagicUI-style floating quick-access bar (simplified, tokenized).
   Fixed bottom-center icon dock for authenticated portal users.
   Hidden under reduced-motion? No — it's static layout, keep visible.
   ============================================================================ */

export type DockItem = {
  icon: LucideIcon;
  label: string;
  to: string;
  badge?: string;
};

export function Dock({ items, className }: { items: DockItem[]; className?: string }) {
  return (
    <nav
      aria-label="Quick actions"
      className={cn(
        "fixed bottom-4 left-1/2 z-50 -translate-x-1/2",
        "flex items-end gap-1 rounded-2xl border border-white/10 bg-void-900/80 px-2 py-2 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl",
        className,
      )}
    >
      {items.map((item) => (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            <Link
              to={item.to}
              aria-label={item.label}
              className="relative grid h-11 w-11 place-items-center rounded-xl text-mid transition-all duration-200 hover:-translate-y-1 hover:bg-cyan-400/10 hover:text-cyan-300"
            >
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top" className="border-white/8 bg-void-900 font-mono text-[10px] text-hi">
            {item.label}
          </TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}
