---
title: Tuning the lift PID, in three iterations
slug: 2026-01-control-loop-tuning
date: 2026-01-18
tags: ["control", "lift", "decode"]
excerpt: How we went from "overshoots every preset, hits the hardstops" to "settles in 220ms with no oscillation" — three tuning sessions, no math required.
__placeholder: true
---

The cascade lift had the same problem every match: snap up, overshoot,
hit the hardstop, lose half a second clawing back to the preset. Time
to actually tune it.

## Where we started

Our first cut was straight Ziegler-Nichols off the top of someone's
head. Kp = 0.08, no I, no D. Settling time near 800ms with visible
oscillation at every preset.

## Session 1 — kill the overshoot

We doubled Kp, added Kd at one-eighth of Kp. The lift was now stiffer
on the way up but still bounced for two cycles before settling. The
issue wasn't the response curve — it was that we were ramping the
setpoint instantaneously.

## Session 2 — ramp the setpoint

We added a 250ms linear ramp from current position to target. Suddenly
the lift behaved like it understood physics. Overshoot dropped to under
0.4 inches at the highest preset.

## Session 3 — kill the steady-state drag

Tiny integral term (Ki = 0.001) to handle the spring sag at full
extension. Final numbers: settle time 220ms, overshoot under 0.2", zero
oscillation. Drivers stopped complaining at practice the same night.
