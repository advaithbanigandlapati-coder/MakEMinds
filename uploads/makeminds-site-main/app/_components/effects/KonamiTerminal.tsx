"use client";

/*
  Konami code → terminal overlay (PLAN §7).
  Listens for the classic sequence: ↑ ↑ ↓ ↓ ← → ← → B A.
  Opens a fullscreen terminal with three commands:
    whoami   — team identity
    roster   — count + lead names (placeholder until team.json verified)
    season   — current season + awards summary
    exit / q — close
*/

import { useEffect, useRef, useState } from "react";
import achievementsData from "@/content/achievements.json";
import teamData from "@/content/team.json";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

type Line = { text: string; tone?: "accent" | "muted" | "warn" };

function runCommand(cmd: string): Line[] {
  const trimmed = cmd.trim().toLowerCase();
  if (trimmed === "whoami") {
    const t = achievementsData.team;
    return [
      { text: `team   : ${t.name} · #${t.number}`, tone: "accent" },
      { text: `region : ${t.city}, ${t.state} · ${t.country}` },
      { text: `rookie : ${t.rookieYear}` },
      { text: `events : ${t.eventsCompeted}` },
    ];
  }
  if (trimmed === "roster") {
    const members = teamData.members;
    return [
      { text: `roster · ${members.length} students`, tone: "accent" },
      ...members.map((m) => ({
        text: `  ${m.role.padEnd(28, " ")} ${m.name}`,
        tone: "muted" as const,
      })),
    ];
  }
  if (trimmed === "season") {
    const awards = achievementsData.majorAwards;
    return [
      { text: "season · 2025-26 · DECODE", tone: "accent" },
      { text: `major awards (lifetime): ${awards.length}`, tone: "muted" },
      ...awards.slice(0, 4).map((a) => ({
        text: `  ${a.year} · ${a.name} — ${a.event}`,
        tone: "muted" as const,
      })),
    ];
  }
  if (trimmed === "help" || trimmed === "?") {
    return [
      { text: "available commands:", tone: "accent" },
      { text: "  whoami   identity + footprint" },
      { text: "  roster   student roster" },
      { text: "  season   current season summary" },
      { text: "  exit     close terminal" },
    ];
  }
  if (trimmed === "exit" || trimmed === "q" || trimmed === "quit") {
    return [{ text: "__close__" }];
  }
  return [{ text: `command not found: ${cmd}`, tone: "warn" }];
}

export default function KonamiTerminal() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>([
    { text: "[ make-minds-robotics // hidden terminal ]", tone: "accent" },
    { text: "type 'help' to list commands.", tone: "muted" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bufferRef = useRef<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) return;
      bufferRef.current.push(e.key);
      // Keep only the last N keys.
      if (bufferRef.current.length > SEQUENCE.length) {
        bufferRef.current = bufferRef.current.slice(-SEQUENCE.length);
      }
      // Case-insensitive comparison for the letter keys at the end.
      const matched = SEQUENCE.every(
        (k, i) => k.toLowerCase() === (bufferRef.current[i] ?? "").toLowerCase(),
      );
      if (matched) {
        bufferRef.current = [];
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, history.length]);

  if (!open) return null;

  const submit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const result = runCommand(trimmed);
    if (result[0]?.text === "__close__") {
      setOpen(false);
      setInput("");
      setHistory([
        { text: "[ make-minds-robotics // hidden terminal ]", tone: "accent" },
        { text: "type 'help' to list commands.", tone: "muted" },
      ]);
      return;
    }
    setHistory((h) => [...h, { text: `> ${trimmed}`, tone: "muted" }, ...result]);
    setInput("");
  };

  return (
    <div
      role="dialog"
      aria-label="Hidden team terminal"
      className="fixed inset-0 z-[200] flex items-end justify-center bg-bg/95 backdrop-blur-sm md:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-3xl border border-border bg-bg-elev p-5 font-mono text-[12px] leading-[1.7]">
        <div className="mb-3 flex items-center justify-between text-fg-dim">
          <span className="text-accent">[ team-23786 // konami ]</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="hover:text-accent"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {history.map((l, i) => (
            <p
              key={i}
              className={
                l.tone === "accent"
                  ? "text-accent"
                  : l.tone === "warn"
                    ? "text-warn"
                    : l.tone === "muted"
                      ? "text-fg-muted"
                      : "text-fg"
              }
            >
              {l.text}
            </p>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mt-3 flex items-center gap-2 border-t border-border pt-3"
        >
          <span className="text-accent">›</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="flex-1 bg-transparent text-fg focus:outline-none"
            aria-label="Command input"
          />
        </form>
      </div>
    </div>
  );
}
