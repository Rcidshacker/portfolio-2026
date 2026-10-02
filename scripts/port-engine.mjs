// One-shot: slice the original shan-shui-inf script into src/lib/shanshui/engine.ts.
// Only the random source changes (Math.random -> seeded rng); algorithm is untouched.
import { readFileSync, writeFileSync } from "node:fs";
const [src, out] = process.argv.slice(2);
const L = readFileSync(src, "utf8").split("\n");
const take = (a, b) => L.slice(a - 1, b).join("\n"); // 1-indexed inclusive
let body = [
  take(90, 203),   // Noise (p5.js perlin)
  take(207, 382),  // PolyTools
  take(386, 510),  // Util: unNan, distance, mapval, randChoice, bezmh, poly ...
  take(516, 3704), // stroke, blob, texture, Tree, Mount, Arch, Man, water
].join("\n");
body = body
  .replace(/Math\.random\(\)/g, "rng()")
  .replace(/^(\s*)reso = 10;/gm, "$1var reso = 10;") // implicit global in the original
  .split("\n")
  .filter((l) => !/^\s*console\.log\(.*\);?\s*$/.test(l))
  .join("\n");
const head = `/* eslint-disable */
// @ts-nocheck
/**
 * Ported from https://github.com/LingDong-/shan-shui-inf (MIT, (c) 2018 Lingdong Huang).
 * See ./LICENSE. Algorithm is unchanged; Math.random is replaced by a seeded rng so a
 * seed always yields the same painting. Typed entry points live in world.ts.
 */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rng = mulberry32(1);
let vtxlist0, vtxlist1, vtxlist; // implicit globals in the original stroke()
export function setSeed(s) {
  rng = mulberry32(s);
  Noise.noiseSeed(s);
}
export function random() { return rng(); }
`;
const tail = `
export { Noise, Tree, Mount, Arch, Man, water, stroke, poly, blob, texture, unNan, randChoice, normRand };
`;
writeFileSync(out, head + body + tail);
console.log("wrote", out, (head + body + tail).split("\n").length, "lines");
