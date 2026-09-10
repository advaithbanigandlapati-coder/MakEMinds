---
title: AprilTag pose fusion for DECODE auto
slug: 2026-04-vision-pipeline
date: 2026-04-12
tags: ["vision", "auto", "decode"]
excerpt: How we fused Limelight 3A AprilTag estimates with wheel odometry to ship a 4-routine autonomous in 9 days.
__placeholder: true
---

We had nine days between league qualifiers and the regional. Our existing
autonomous was pure dead reckoning — fine until the field tilted half a
degree. Time to ship vision.

## The fix

Limelight 3A on the front face, tuned for the season-specific tags. We
fused its MT2-relative pose estimate with the drive odometry using a
complementary filter — vision when confidence was high, wheels in the
gap between samples.

## What we learned

- Vision alone introduced jitter on the cascade lift; the filter ate it.
- We re-localized once per auto routine, never mid-path — saved ~80ms
  per cycle.
- The Limelight MT2 reliability dropped under stage lighting; a single
  fallback to MT1 made the difference.
