import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "src/components");

console.log("=".repeat(70));
console.log("MOBILE CLIPPING AUDIT");
console.log("=".repeat(70));

const FILES = fs.readdirSync(dir).filter(f => f.endsWith(".jsx"));

const HAZARDS = [
  { pattern: /truncate/g, name: "truncate" },
  { pattern: /whitespace-nowrap/g, name: "whitespace-nowrap" },
  { pattern: /overflow-hidden/g, name: "overflow-hidden" },
  { pattern: /overflow-x-hidden/g, name: "overflow-x-hidden" },
  { pattern: /line-clamp-\d+/g, name: "line-clamp" },
  { pattern: /text-ellipsis/g, name: "text-ellipsis" },
  { pattern: /w-\[min\(/g, name: "w-[min(...)]" },
  { pattern: /max-w-\[/g, name: "max-w-[...]" },
  { pattern: /min-w-max/g, name: "min-w-max" },
  { pattern: /text-\[\d+px\]/g, name: "text-[Npx]" },
];

for (const f of FILES) {
  const filePath = path.join(dir, f);
  const content = fs.readFileSync(filePath, "utf8");
  const hazards = [];

  for (const h of HAZARDS) {
    const matches = content.match(h.pattern);
    if (matches) {
      hazards.push(`${h.name} (${matches.length})`);
    }
  }

  if (hazards.length > 0) {
    console.log(`\n${f}`);
    console.log(`  ${hazards.join(", ")}`);
  }
}

console.log("\n" + "=".repeat(70));
console.log("FIXED WIDTHS THAT MAY OVERFLOW ON 375px");
console.log("=".repeat(70));

for (const f of FILES) {
  const filePath = path.join(dir, f);
  const content = fs.readFileSync(filePath, "utf8");

  const fixedWidths = content.match(/w-\[\d+px\]/g);
  const fixedMaxWidths = content.match(/max-w-\[\d+px\]/g);

  if (fixedWidths || fixedMaxWidths) {
    console.log(`\n${f}`);
    if (fixedWidths) console.log(`  w-[Npx]: ${fixedWidths.join(", ")}`);
    if (fixedMaxWidths) console.log(`  max-w-[Npx]: ${fixedMaxWidths.join(", ")}`);
  }
}
