// Smoke check: same seed => identical SVG, output non-empty, timing printed.
import assert from "node:assert/strict";
import { setSeed, Mount, Tree, Arch, Man, water } from "../src/lib/shanshui/engine.ts";

const gens: Record<string, () => string> = {
  mountain: () => Mount.mountain(0, 300, 1.5),
  flatMount: () => Mount.flatMount(0, 700, 2, { wid: 700, hei: 100, cho: 0.55 }),
  distMount: () => Mount.distMount(0, 280, 5, { hei: 150, len: 1000 }),
  tree01: () => Tree.tree01(0, 500),
  arch01: () => Arch.arch01(0, 500),
  arch03: () => Arch.arch03(0, 500),
  boat01: () => Arch.boat01(0, 500, 0.3, { sca: 0.6, fli: false }),
  man: () => Man.man(0, 500),
  water: () => water(0, 300, 3),
};
for (const [name, g] of Object.entries(gens)) {
  setSeed(7); const t0 = performance.now(); const a = g(); const ms = performance.now() - t0;
  setSeed(7); const b = g();
  assert.equal(a, b, `${name}: not deterministic`);
  assert.ok(a.length > 200, `${name}: empty output`);
  const nan = (a.match(/NaN/g) ?? []).length;
  console.log(`${name.padEnd(10)} ok  ${(a.length / 1024).toFixed(0).padStart(5)} KB  ${ms.toFixed(0).padStart(4)} ms  polylines=${(a.match(/<polyline/g) ?? []).length}  NaN=${nan}`);
}
setSeed(1); const s1 = Mount.mountain(0, 300, 1); setSeed(2); const s2 = Mount.mountain(0, 300, 1);
assert.notEqual(s1, s2, "different seeds should differ");
console.log("PASS");
