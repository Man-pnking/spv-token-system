import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "src/components");

console.log("=".repeat(70));
console.log("PADDING AND SPACING AUDIT");
console.log("=".repeat(70));

const FILES = [
  "Hero.jsx",
  "Intro.jsx",
  "WhatYoureBuying.jsx",
  "CurveStats.jsx",
  "HowItWorks.jsx",
  "TradePanel.jsx",
  "Docs.jsx",
  "FAQ.jsx",
  "HowToVerify.jsx",
  "Footer.jsx",
  "Navbar.jsx",
];

const pyRegex = /py-(\d+)/g;
const pxRegex = /px-(\d+)/g;
const mbRegex = /mb-(\d+)/g;
const mtRegex = /mt-(\d+)/g;
const overflowRegex = /overflow-(hidden|auto|scroll|clip|visible)/g;
const maxWidthRegex = /max-w-([a-z0-9]+)/g;
const truncateRegex = /(truncate|line-clamp-\d+|overflow-hidden)/g;

for (const f of FILES) {
  const filePath = path.join(dir, f);
  if (!fs.existsSync(filePath)) {
    console.log(`${f.padEnd(28)} MISSING`);
    continue;
  }
  const content = fs.readFileSync(filePath, "utf8");

  const py = [...new Set((content.match(pyRegex) || []))].sort();
  const px = [...new Set((content.match(pxRegex) || []))].sort();
  const mb = [...new Set((content.match(mbRegex) || []))].sort();
  const mt = [...new Set((content.match(mtRegex) || []))].sort();
  const overflow = [...new Set((content.match(overflowRegex) || []))].sort();
  const maxW = [...new Set((content.match(maxWidthRegex) || []))].sort();
  const clip = (content.match(truncateRegex) || []).length;

  console.log(`\n${f}`);
  console.log(`  padding-y:  ${py.join(", ") || "none"}`);
  console.log(`  padding-x:  ${px.join(", ") || "none"}`);
  console.log(`  margin-b:   ${mb.join(", ") || "none"}`);
  console.log(`  margin-t:   ${mt.join(", ") || "none"}`);
  console.log(`  max-w:      ${maxW.join(", ") || "none"}`);
  console.log(`  overflow:   ${overflow.join(", ") || "none"}`);
  console.log(`  truncation: ${clip} occurrences`);
}

console.log("\n" + "=".repeat(70));
console.log("POTENTIAL CLIPPING HAZARDS");
console.log("=".repeat(70));

for (const f of FILES) {
  const filePath = path.join(dir, f);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, "utf8");

  // Look for overflow-hidden on containers that also contain long text
  const hasOverflowHidden = content.includes("overflow-hidden");
  const hasTruncate = content.includes("truncate");
  const hasWhitespaceNowrap = content.includes("whitespace-nowrap");

  if (hasOverflowHidden || hasTruncate || hasWhitespaceNowrap) {
    console.log(`\n${f}:`);
    if (hasOverflowHidden) console.log("  - has overflow-hidden");
    if (hasTruncate) console.log("  - has truncate (text will be cut with ellipsis)");
    if (hasWhitespaceNowrap) console.log("  - has whitespace-nowrap (may overflow on narrow screens)");
  }
}
