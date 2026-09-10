"use client";

/*
  Boot loader — PLAN §1, tightened per first-pass review.

  Full sequence ~1.5s; returning visitors ~0.4s; ?boot=full overrides; any
  key or click anywhere skips immediately; prefers-reduced-motion is 200ms
  fade. On exit the terminal fades and scales down while the page content
  fades in simultaneously via the .mm-boot-done class on <html>.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { bootTiming } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";

type Phase = "idle" | "typing" | "ready" | "fading" | "done";

const BOOT_STORAGE_KEY = "mm:booted";
const BOOT_DONE_CLASS = "mm-boot-done";

type Line = {
  text: string;
  tail?: string;
  indent?: number;
};

const FULL_LINES: Line[] = [
  { text: "[ make-minds-robotics.boot ]" },
  { text: "> resolving makemindsrobotics.org", tail: "OK" },
  { text: "> mounting /home   [██████████████] 100%" },
  { text: "> ready." },
];

const SHORT_LINES: Line[] = [
  { text: "[ make-minds-robotics.boot ]", tail: "ready" },
];

function shouldPlayFull(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("boot") === "full") return true;
  try {
    return window.localStorage.getItem(BOOT_STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}

function markBooted() {
  try {
    window.localStorage.setItem(BOOT_STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}

function pickSpeed(): number {
  const { min, max } = bootTiming.charDelayMs;
  return min + Math.random() * (max - min);
}

export default function BootLoader() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [renderedLines, setRenderedLines] = useState<RenderedLine[]>([]);
  const reduced = useReducedMotion();
  const skipRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timeoutsRef.current) window.clearTimeout(id);
    timeoutsRef.current = [];
  }, []);

  // finish() reads the latest phase via the setState updater function, so
  // we don't need a phaseRef synced during render.
  const finish = useCallback(() => {
    setPhase((cur) => {
      if (cur === "fading" || cur === "done") return cur;
      skipRef.current = true;
      clearTimers();
      markBooted();
      document.documentElement.classList.add(BOOT_DONE_CLASS);
      const id = window.setTimeout(() => setPhase("done"), bootTiming.handoffMs);
      timeoutsRef.current.push(id);
      return "fading";
    });
  }, [clearTimers]);

  useEffect(() => {
    // Safety net: regardless of what happens in the typing path, force the
    // handoff after 4s so the page never stays invisible if a timer is
    // dropped, a state mutation throws, etc.
    const safetyId = window.setTimeout(() => {
      if (!document.documentElement.classList.contains(BOOT_DONE_CLASS)) {
        markBooted();
        document.documentElement.classList.add(BOOT_DONE_CLASS);
        setPhase("done");
      }
    }, 4000);
    timeoutsRef.current.push(safetyId);

    if (reduced) {
      const id = window.setTimeout(() => {
        markBooted();
        document.documentElement.classList.add(BOOT_DONE_CLASS);
        setPhase("done");
      }, bootTiming.reducedMotionFadeMs);
      timeoutsRef.current.push(id);
      return () => clearTimers();
    }

    const lines = shouldPlayFull() ? FULL_LINES : SHORT_LINES;
    const totalLines = lines.length;
    // Initial state is "idle"; we promote to "typing" once we've confirmed
    // we're not in the reduced-motion early-return path. One-shot, mount-only.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase("typing");

    let lineIndex = 0;
    let charIndex = 0;
    let currentRendered: RenderedLine[] = [];

    const typeNextChar = () => {
      if (skipRef.current) return;
      const line = lines[lineIndex];
      if (!line) return;

      if (charIndex === 0) {
        currentRendered = [
          ...currentRendered,
          { text: "", tail: undefined, indent: line.indent ?? 0 },
        ];
      }

      const partial = line.text.slice(0, charIndex + 1);
      currentRendered = currentRendered.slice(0, -1).concat({
        text: partial,
        tail: undefined,
        indent: line.indent ?? 0,
      });
      setRenderedLines(currentRendered);

      charIndex += 1;
      if (charIndex >= line.text.length) {
        const afterTail = () => {
          if (skipRef.current) return;
          if (line.tail) {
            currentRendered = currentRendered.slice(0, -1).concat({
              text: line.text,
              tail: line.tail,
              indent: line.indent ?? 0,
            });
            setRenderedLines(currentRendered);
          }
          lineIndex += 1;
          charIndex = 0;
          if (lineIndex >= totalLines) {
            setPhase("ready");
            const autoId = window.setTimeout(
              finish,
              shouldPlayFull()
                ? bootTiming.postSequencePauseMs
                : bootTiming.returningVisitorMs,
            );
            timeoutsRef.current.push(autoId);
            return;
          }
          const lineId = window.setTimeout(typeNextChar, bootTiming.postLineDelayMs);
          timeoutsRef.current.push(lineId);
        };
        const tailId = window.setTimeout(afterTail, 30);
        timeoutsRef.current.push(tailId);
      } else {
        const charId = window.setTimeout(typeNextChar, pickSpeed());
        timeoutsRef.current.push(charId);
      }
    };

    typeNextChar();

    return () => clearTimers();
  }, [reduced, clearTimers, finish]);

  // Any key skips.
  useEffect(() => {
    if (phase === "done") return;
    const onKey = (e: KeyboardEvent) => {
      // Ignore pure modifier keypresses so Cmd/Ctrl/Shift alone don't trigger.
      if (
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Meta" ||
        e.key === "Alt"
      )
        return;
      e.preventDefault();
      finish();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKey, { capture: true });
  }, [phase, finish]);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Booting MakEMinds Robotics"
      onClick={finish}
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center bg-bg cursor-pointer",
        "transition-opacity ease-out",
        phase === "fading"
          ? "opacity-0 pointer-events-none duration-[600ms]"
          : "opacity-100 duration-200",
      ].join(" ")}
    >
      <div
        className={[
          "w-full max-w-2xl px-6 font-mono text-[13px] leading-[1.7] text-fg select-none",
          "transition-all ease-out",
          phase === "fading"
            ? "scale-y-0 origin-center opacity-0 duration-[500ms]"
            : "scale-y-100 opacity-100 duration-200",
        ].join(" ")}
      >
        {reduced ? (
          <p className="text-fg-muted">
            <span className="text-accent">[ make-minds-robotics ]</span> ready.
          </p>
        ) : (
          <>
            <pre className="whitespace-pre-wrap">
              {renderedLines.map((line, i) => (
                <span key={i} className="block">
                  {line.indent ? " ".repeat(line.indent) : ""}
                  <span
                    className={
                      line.text.startsWith("[") ? "text-accent" : "text-fg"
                    }
                  >
                    {line.text}
                  </span>
                  {line.tail ? (
                    <>
                      {"  "}
                      <span className="text-accent">{line.tail}</span>
                    </>
                  ) : null}
                  {i === renderedLines.length - 1 && phase === "typing" ? (
                    <span className="mm-cursor text-accent">█</span>
                  ) : null}
                </span>
              ))}
            </pre>

            {phase === "ready" ? (
              <p className="mt-5 text-fg-dim transition-opacity duration-200">
                press any key, or click anywhere
              </p>
            ) : null}
          </>
        )}
      </div>

      <style>{`
        .mm-cursor {
          display: inline-block;
          animation: mm-blink 0.85s steps(2) infinite;
        }
        @keyframes mm-blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

type RenderedLine = {
  text: string;
  tail?: string;
  indent: number;
};
