import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import SmoothTab from "@/components/ui-lib/kokonutui/navigation/smooth-tab";
import { cn } from "@/lib/utils";

/* ============================================================================
   SmoothTab wrapper — controlled-ish KokonutUI smooth tab with the site's
   cyan active color. Items: { id, label, icon? }.
   ============================================================================ */

export interface SmoothTabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export function SmoothTabBar({
  items,
  defaultValue,
  value,
  onChange,
  className,
}: {
  items: SmoothTabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;

  return (
    <div className={cn("overflow-x-auto no-scrollbar", className)}>
      <SmoothTab
        items={items.map((i) => ({ id: i.id, title: i.label, icon: i.icon, color: "#22d3ee" }))}
        defaultTabId={active}
        activeColor="#22d3ee"
        onChange={(id) => {
          setInternal(id);
          onChange?.(id);
        }}
      />
    </div>
  );
}
