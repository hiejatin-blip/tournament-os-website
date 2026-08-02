import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CommandSearch } from "@/components/site/CommandSearch";

/* ============================================================================
   SearchProvider — ONE command palette for the whole app.
   Previously `useCommandSearch()` was a per-component hook mounting its own
   <CommandSearch> in SiteNav, DashboardLayout AND ExplorePage (3 ⌘K
   listeners, 3 palettes, focus fights). The provider owns the state, the
   single ⌘K listener, and the single palette mount.
   ============================================================================ */

type SearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <CommandSearch open={open} onClose={() => setOpen(false)} />
    </SearchContext.Provider>
  );
}

export function useCommandSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useCommandSearch must be used within <SearchProvider>");
  }
  return { open: ctx.open, setOpen: ctx.setOpen };
}

/* Convenience trigger for buttons that open the palette */
export function useOpenSearch() {
  const ctx = useContext(SearchContext);
  return useCallback(() => ctx?.setOpen(true), [ctx]);
}
