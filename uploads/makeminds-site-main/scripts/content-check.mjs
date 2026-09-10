#!/usr/bin/env node
/*
  Walks content/ and content/notebook/ looking for __placeholder: true
  flags. Exits 0 with a count + list (warn, doesn't fail the build).
  Run before launch: npm run content-check.

  Future: take an --enforce flag to exit nonzero, then call from CI.
*/

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "content");

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREY = "\x1b[90m";
const ACCENT = "\x1b[36m";
const RESET = "\x1b[0m";

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir);
  for (const e of entries) {
    const p = path.join(dir, e);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

function flagsIn(content, file) {
  const flags = [];
  // JSON: "__placeholder": true
  const jsonRx = /"__placeholder"\s*:\s*true/g;
  while (jsonRx.exec(content) !== null) {
    flags.push({ file, kind: "json" });
  }
  // Markdown frontmatter: __placeholder: true
  if (file.endsWith(".md")) {
    const mdRx = /^__placeholder:\s*true\s*$/m;
    if (mdRx.test(content)) flags.push({ file, kind: "md-frontmatter" });
  }
  return flags;
}

const files = await walk(ROOT);
const all = [];
for (const f of files) {
  if (!/\.(json|md)$/.test(f)) continue;
  const content = await readFile(f, "utf-8");
  all.push(...flagsIn(content, f));
}

if (all.length === 0) {
  console.log(`${ACCENT}[content-check]${RESET} no __placeholder flags remaining. ✓`);
  process.exit(0);
}

console.log(
  `${YELLOW}[content-check]${RESET} ${all.length} placeholder flag${all.length === 1 ? "" : "s"} still present:`,
);
const byFile = new Map();
for (const a of all) {
  byFile.set(a.file, (byFile.get(a.file) ?? 0) + 1);
}
for (const [file, count] of byFile) {
  const rel = path.relative(path.join(__dirname, ".."), file);
  console.log(`  ${RED}•${RESET} ${rel} ${GREY}(${count}×)${RESET}`);
}
console.log(`\n${GREY}fix or remove the __placeholder flags before launch.${RESET}`);
// Warn-only: exit 0 so the build doesn't fail today.
process.exit(0);
