import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Building2 } from "lucide-react";
import { useUser, useAuth, useActiveGuild } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

/* ============================================================
   GuildSwitcher — lets users managing multiple guilds swap
   the active guild context instantly. Changes propagate via
   AuthContext.updateUser().
   ============================================================ */
export function GuildSwitcher() {
  const user = useUser();
  const { switchGuild } = useAuth();
  const activeGuild = useActiveGuild();
  const [open, setOpen] = useState(false);

  if (!user || user.managedGuilds.length <= 1) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] py-1 pl-2 pr-2.5 text-sm text-hi transition-colors hover:border-cyan-400/25"
      >
        <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[10px] font-bold text-hi ring-1 ring-white/10", activeGuild?.gradient ?? "from-cyan-500/30 to-blue-600/10")}>
          {activeGuild?.avatar ?? "G"}
        </span>
        <span className="hidden sm:block truncate max-w-[80px]">{activeGuild?.name ?? "Guild"}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-lo transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/8 bg-void-900/95 backdrop-blur-xl elev-3"
          >
            <div className="border-b border-white/6 px-3 py-2.5">
              <p className="text-xs font-medium text-lo uppercase tracking-wider">Your guilds</p>
            </div>
            {user.managedGuilds.map((g) => {
              const isActive = g.id === user.activeGuildId;
              return (
                <button
                  key={g.id}
                  onClick={() => { switchGuild(g.id); setOpen(false); }}
                  className={cn("flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]", isActive ? "bg-cyan-400/5" : "")}
                >
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-[11px] font-bold text-hi ring-1 ring-white/10", g.gradient)}>{g.avatar}</span>
                  <span className="flex-1 min-w-0">
                    <span className={cn("block truncate text-sm", isActive ? "text-cyan-300 font-medium" : "text-hi")}>{g.name}</span>
                    <span className="block text-[11px] text-lo truncate">{g.role} · {g.memberCount.toLocaleString()} members</span>
                  </span>
                  {isActive && <Check className="h-4 w-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
            <div className="border-t border-white/6 px-3 py-2">
              <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-mid transition-colors hover:text-hi hover:bg-white/[0.03]">
                <Building2 className="h-3.5 w-3.5" /> Add another guild
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
