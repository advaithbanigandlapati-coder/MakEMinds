/*
  JS-readable mirror of the CSS color tokens declared in app/globals.css.
  Use only when a value cannot be expressed in CSS — e.g., R3F materials,
  canvas fills, or animation libraries that need a hex literal.
  For everything Tailwind/CSS can reach, use the var(--name) / class instead.
*/

export const colors = {
  bg: "#050506",
  bgElev: "#0e1116",
  fg: "#e8eef4",
  fgMuted: "#8090a4",
  fgDim: "#555c65",
  border: "#1a2028",
  accent: "#649dc7",
  accentHi: "#ccd9e6",
  accentDim: "#2e5878",
  warn: "#ff6b35",
} as const;

export type ColorToken = keyof typeof colors;

export const fonts = {
  display: "var(--font-display)",
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;
