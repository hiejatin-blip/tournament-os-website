import { Link } from "react-router-dom";
import { LogOut, User, Settings, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { profileMenu } from "@/shared/config/navigation";
import { useAuth, useUser } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ============================================================================
   ProfileMenu — shared profile dropdown for SiteNav + DashboardLayout.
   Built on shadcn DropdownMenu (Radix): keyboard nav, escape-to-close,
   focus management out of the box. Replaces two inline hand-rolled menus.
   ============================================================================ */

const fallbackIcons = { User, Settings, HelpCircle, LogOut } as const;

export function ProfileMenu({ className }: { className?: string }) {
  const user = useUser();
  const { logout } = useAuth();
  const initials = user?.avatar ?? "PH";
  const name = user?.displayName ?? "Player";
  const email = user?.email ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] py-1 pl-1 pr-2.5 text-hi outline-none transition-colors hover:border-cyan-400/25 focus-visible:ring-2 focus-visible:ring-cyan-400/60",
          className,
        )}
        aria-label={`Account menu for ${name}`}
      >
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-gradient-to-br from-cyan-500/30 to-amber-500/20 text-[11px] font-bold text-hi">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[10rem] truncate text-sm text-hi">{name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-white/8 bg-void-900/95 backdrop-blur-xl">
        <DropdownMenuLabel>
          <p className="text-sm font-medium text-hi">{name}</p>
          <p className="truncate text-[11px] text-lo">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/6" />
        {profileMenu.map((m) => {
          const isLogout = m.label === "Sign out";
          const Icon = m.icon ?? fallbackIcons[m.label === "Sign out" ? "LogOut" : "User"];
          if (isLogout) {
            return (
              <DropdownMenuItem
                key="logout"
                onSelect={() => logout()}
                className="cursor-pointer text-mid focus:bg-rose-500/10 focus:text-rose-400"
              >
                <Icon className="h-4 w-4" />
                {m.label}
              </DropdownMenuItem>
            );
          }
          return (
            <DropdownMenuItem key={m.to} asChild className="cursor-pointer text-mid focus:bg-white/[0.04] focus:text-hi">
              <Link to={m.to} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                {m.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
