"use client";

import { useSyncExternalStore } from "react";

/*
  Returns whether the given media query matches, subscribed to via
  useSyncExternalStore so it satisfies React 19's "no setState in effect
  for external subscriptions" rule.

  SSR returns the supplied fallback (default false).
*/
export function useMediaQuery(query: string, ssrFallback = false): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => ssrFallback,
  );
}

// Convenience aliases for the queries used across the site.
export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)", false);

export const useCoarsePointer = () =>
  useMediaQuery("(pointer: coarse)", false);
