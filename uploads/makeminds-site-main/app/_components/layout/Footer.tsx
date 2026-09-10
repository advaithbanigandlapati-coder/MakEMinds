/*
  Site-wide footer (PLAN — implicit). Mono everything, hairline at top,
  three columns: nav · contact · meta. Site-wide so it lives in root
  layout, not a page.
*/

import Link from "next/link";
import { NAV } from "@/lib/nav";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-boot-fade
      className="relative mt-24 border-t border-border bg-bg-elev/40 px-6 py-12 md:px-12 md:py-16 lg:px-20"
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-semibold tracking-normal text-fg">
            MakEMinds Robotics
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            FTC team 23786 · edison nj · rookie 2023
          </p>
          <p className="mt-6 max-w-md text-sm leading-[1.6] text-fg-muted">
            Student-led FTC team. We compete from regionals to worlds, mentor
            two FLL teams, and run a free summer build camp.
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">
            [ index ]
          </p>
          <ul className="mt-4 space-y-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted hover:text-accent"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">
            [ contact ]
          </p>
          <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            <li>
              <a
                href="mailto:info@makemindsrobotics.org"
                className="hover:text-accent"
              >
                info@makemindsrobotics.org
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/makemindsrobotics"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                @makemindsrobotics
              </a>
            </li>
            <li>edison, nj — usa</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim md:flex-row md:items-center">
        <p>© {year} makeminds robotics · ftc team 23786</p>
        <p>
          made by the team · <span className="text-accent">2026 rebuild</span>
        </p>
      </div>
    </footer>
  );
}
