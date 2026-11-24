// Ekspor pose kapal, ombak, matahari per frame → JSON untuk QC (node --experimental-strip-types)
import * as G from '../../src/outro/laut-geom.ts';
const freeze = process.argv[2] === 'qc';
const rows = [];
for (let f = 0; f < 195; f++) {
  let frontMin = 1e9;
  for (let x = 0; x <= G.W; x += 4) frontMin = Math.min(frontMin, G.waveY(G.FRONT, x, f));
  rows.push({f, ship: G.shipPose(f, freeze), sunY: G.sunY(f), frontMin});
}
console.log(JSON.stringify({SHIP_S: G.SHIP_S, HULL_BOTTOM: G.HULL_BOTTOM, SUN: G.SUN, LOCK_S: G.LOCK_S, LOCK_LEFT: G.LOCK_LEFT, LOCK_TOP: G.LOCK_TOP, CTA_TOP: G.CTA_TOP, T: G.T, rows}));
