"use client";

/*
  Contact form (PLAN §Contact pattern). Posts to /api/contact via Resend.
  Optimistic UI: button shows "TRANSMITTING..." then "SENT" or "FAILED".
  Falls back gracefully — a `mailto:` link sits right under the submit
  so the form is never a hard dependency.
*/

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const REASONS = [
  { value: "sponsorship", label: "Sponsorship" },
  { value: "mentor", label: "Mentor" },
  { value: "partnership", label: "Partnership" },
  { value: "outreach", label: "Outreach" },
  { value: "judging", label: "Judging" },
  { value: "join", label: "Join the team" },
  { value: "other", label: "Other" },
];

type Props = {
  /** Optional preselected reason from URL query. */
  defaultReason?: string;
};

export default function ContactForm({ defaultReason }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialReason = REASONS.some((r) => r.value === defaultReason)
    ? defaultReason
    : "sponsorship";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      reason: String(fd.get("reason") ?? "other"),
      message: String(fd.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Server returned ${res.status}`);
      }
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error.");
    }
  }

  const buttonText =
    status === "sending"
      ? "TRANSMITTING..."
      : status === "sent"
        ? "✓ SENT"
        : status === "error"
          ? "TRY AGAIN"
          : "TRANSMIT →";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field label="Name" name="name" required autoComplete="name" />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
      />
      <Field label="Reason" name="reason" as="select" defaultValue={initialReason}>
        {REASONS.map((r) => (
          <option key={r.value} value={r.value} className="bg-bg text-fg">
            {r.label}
          </option>
        ))}
      </Field>
      <Field
        label="Message"
        name="message"
        as="textarea"
        rows={5}
        required
        placeholder="Tell us what you need."
      />

      <div className="mt-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="inline-flex h-12 items-center justify-center border border-accent bg-transparent px-6 font-mono text-[12px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-bg disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-accent"
        >
          {buttonText}
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
          or email us direct:{" "}
          <a
            href="mailto:info@makemindsrobotics.org"
            className="text-fg-muted hover:text-accent"
          >
            info@makemindsrobotics.org
          </a>
        </p>
        {/* aria-live region: a single persistent node so screen readers
            announce submit results. Conditional <p> blocks would mount
            without announcement. */}
        <div role="status" aria-live="polite" aria-atomic="true">
          {status === "sent" ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              ✓ message received. we&apos;ll reply within 48 hours.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-warn">
              ✗ {errorMsg ?? "couldn't send."} use the mailto link above.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  rows?: number;
  placeholder?: string;
  defaultValue?: string;
  as?: "input" | "textarea" | "select";
  children?: React.ReactNode;
};

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  rows,
  placeholder,
  defaultValue,
  as = "input",
  children,
}: FieldProps) {
  const base =
    "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-fg placeholder:text-fg-dim focus:border-accent focus:outline-none transition-colors";

  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={rows ?? 4}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={base + " resize-none"}
        />
      ) : as === "select" ? (
        <select name={name} required={required} defaultValue={defaultValue} className={base}>
          {children}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={base}
        />
      )}
    </label>
  );
}
